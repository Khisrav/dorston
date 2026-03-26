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

        $base = rtrim($webhookUrl, '/');

        // Step 1: Create a Contact
        $contactResponse = Http::timeout(10)->post("{$base}/crm.contact.add.json", [
            'fields' => [
                'NAME'  => $validated['name'],
                'PHONE' => [['VALUE' => $validated['phone'], 'VALUE_TYPE' => 'WORK']],
                'EMAIL' => [['VALUE' => $validated['email'], 'VALUE_TYPE' => 'WORK']],
            ],
        ]);

        if ($contactResponse->failed()) {
            return response()->json(['message' => 'Failed to create Bitrix24 contact.'], 502);
        }

        $contactBody = $contactResponse->json();
        if (isset($contactBody['error'])) {
            return response()->json([
                'message'       => 'Bitrix24 rejected the contact.',
                'bitrix_error'  => $contactBody['error'],
                'bitrix_detail' => $contactBody['error_description'] ?? null,
            ], 422);
        }

        $contactId = $contactBody['result'];

        // Step 2: Create a Deal linked to that Contact
        $dealResponse = Http::timeout(10)->post("{$base}/crm.deal.add.json", [
            'fields' => [
                'TITLE'      => $validated['title'] ?? 'Заявка с config.dorston.ru',
                'SOURCE_ID'  => 'WEB',
                'CONTACT_ID' => $contactId,
            ],
            'params' => [
                'REGISTER_SONET_EVENT' => 'Y',
            ],
        ]);

        if ($dealResponse->failed()) {
            return response()->json(['message' => 'Failed to create Bitrix24 deal.'], 502);
        }

        $dealBody = $dealResponse->json();
        if (isset($dealBody['error'])) {
            return response()->json([
                'message'       => 'Bitrix24 rejected the deal.',
                'bitrix_error'  => $dealBody['error'],
                'bitrix_detail' => $dealBody['error_description'] ?? null,
            ], 422);
        }

        return response()->json([
            'message'    => 'ok',
            'deal_id'    => $dealBody['result'] ?? null,
            'contact_id' => $contactId,
        ]);
    }
}