<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class Bitrix24Controller extends Controller
{
    public function lead(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'min:2', 'max:120'],
            'phone' => ['required', 'string', 'min:5', 'max:40'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'title' => ['sometimes', 'string', 'max:255'],
        ]);

        $webhookUrl = config('services.bitrix24.webhook_url');
        if (! is_string($webhookUrl) || $webhookUrl === '') {
            return response()->json(['message' => 'Bitrix24 webhook URL is not configured.'], 500);
        }

        $endpoint = rtrim($webhookUrl, '/') . '/crm.lead.add.json';

        $payload = [
            'fields' => [
                'TITLE'      => $validated['title'] ?? 'Заявка с config.dorston.ru',
                'NAME'       => $validated['name'],
                'SOURCE_ID'  => 'WEB',            // optional: marks lead source
                'PHONE'      => [
                    [
                        'VALUE'      => $validated['phone'],
                        'VALUE_TYPE' => 'WORK',
                    ],
                ],
                'EMAIL'      => [
                    [
                        'VALUE'      => $validated['email'],
                        'VALUE_TYPE' => 'WORK',
                    ],
                ],
            ],
            'params' => [
                'REGISTER_SONET_EVENT' => 'Y', // optional: notify in activity stream
            ],
        ];

        $response = Http::timeout(10)->post($endpoint, $payload);

        if ($response->failed()) {
            return response()->json([
                'message'         => 'Failed to send data to Bitrix24.',
                'bitrix_status'   => $response->status(),
                'bitrix_response' => $response->body(),
            ], 502);
        }

        $body = $response->json();
        if (isset($body['error'])) {
            return response()->json([
                'message'       => 'Bitrix24 rejected the request.',
                'bitrix_error'  => $body['error'],
                'bitrix_detail' => $body['error_description'] ?? null,
            ], 422);
        }

        return response()->json([
            'message' => 'ok',
            'lead_id' => $body['result'] ?? null, // Bitrix24 returns the new lead ID here
        ]);
    }
}