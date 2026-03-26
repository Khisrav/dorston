<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Mpdf\Mpdf;
use InvalidArgumentException;

class PDFController extends Controller
{
    public function generate(Request $request): Response
    {
        $request->validate([
            'exterior_image'      => ['required', 'string', 'starts_with:data:image/png'],
            'interior_image'      => ['required', 'string', 'starts_with:data:image/png'],
            'exterior_model_name' => ['nullable', 'string', 'max:120'],
            'interior_model_name' => ['nullable', 'string', 'max:120'],
            'constructive_name'   => ['nullable', 'string', 'max:120'],
            'phone'               => ['nullable', 'string', 'max:40'],
            'config'              => ['nullable'],

            // Extra buyer / order fields for the spec table (page 3)
            'order_number'        => ['nullable', 'string', 'max:120'],
            'salon_address'       => ['nullable', 'string', 'max:255'],
            'buyer_name'          => ['nullable', 'string', 'max:255'],
            'buyer_phone'         => ['nullable', 'string', 'max:40'],
            'object_address'      => ['nullable', 'string', 'max:255'],
            'seller_name'         => ['nullable', 'string', 'max:255'],
        ]);

        $mpdf = new Mpdf([
            'tempDir'       => storage_path('app/mpdf'),
            'format'        => 'A4',
            'orientation'   => 'P',
            'margin_top'    => 38,   // room for custom header
            'margin_bottom' => 12,
            'margin_left'   => 14,
            'margin_right'  => 14,
            'img_dpi'       => 192,
        ]);

        $exteriorImage    = $request->input('exterior_image');
        $interiorImage    = $request->input('interior_image');
        $exteriorModel    = trim((string) $request->input('exterior_model_name', ''));
        $interiorModel    = trim((string) $request->input('interior_model_name', ''));
        $constructive     = trim((string) $request->input('constructive_name', ''));
        $config           = $this->normalizeConfig($request->input('config'));

        // Buyer / order meta
        $orderNumber   = trim((string) $request->input('order_number', ''));
        $salonAddress  = trim((string) $request->input('salon_address', ''));
        $buyerName     = trim((string) $request->input('buyer_name', ''));
        $buyerPhone    = trim((string) $request->input('buyer_phone', ''));
        $objectAddress = trim((string) $request->input('object_address', ''));
        $sellerName    = trim((string) $request->input('seller_name', ''));

        $mpdf->SetTitle('DORSTON — Спецификация');
        $mpdf->SetAuthor('DORSTON');

        $tempPaths = [];
        try {
            $tempPaths[] = $this->dataUrlToTempPng($exteriorImage);
            $tempPaths[] = $this->dataUrlToTempPng($interiorImage);
            $headerPhone = '8 (800) 222-95-98';

            // ── Page 1 ── exterior view
            $mpdf->SetHTMLHeader($this->buildPageHeader($headerPhone));
            $mpdf->WriteHTML($this->buildCoverPage(
                absoluteExteriorImagePath: $tempPaths[0],
                exteriorModelName: $exteriorModel,
                interiorModelName: $interiorModel,
                constructiveName: $constructive,
            ));

            // ── Page 2 ── interior view
            $mpdf->AddPage();
            $mpdf->SetHTMLHeader($this->buildPageHeader($headerPhone));
            $mpdf->WriteHTML($this->buildInteriorPage($tempPaths[1]));

            // ── Page 3 ── specification table
            $mpdf->AddPage();
            $mpdf->SetHTMLHeader($this->buildPageHeader($headerPhone));
            $mpdf->WriteHTML($this->buildConfigPage(
                sections: $config,
                orderNumber: $orderNumber,
                salonAddress: $salonAddress,
                buyerName: $buyerName,
                buyerPhone: $buyerPhone,
                objectAddress: $objectAddress,
                sellerName: $sellerName,
            ));

            $pdfContent = $mpdf->Output('', 'S');
        } finally {
            foreach ($tempPaths as $path) {
                if (is_string($path) && $path !== '' && is_file($path)) {
                    @unlink($path);
                }
            }
        }

        return response($pdfContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="door-config.pdf"',
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Header
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Page header with the DORSTON logo on the left and the page label on the right.
     * We embed the logo as a data URL so mPDF doesn't depend on URL/path resolution.
     */
    private function buildPageHeader(string $pageLabel): string
    {
        $label = htmlspecialchars($pageLabel, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $logoDataUrl = $this->getLogoDataUrl();
        $logoSrc = $logoDataUrl !== ''
            ? htmlspecialchars($logoDataUrl, ENT_QUOTES | ENT_HTML5, 'UTF-8')
            : '';

        $logoImgHtml = $logoSrc !== ''
            ? '<img src="' . $logoSrc . '" style="height: 6mm; width: auto;border:0px solid #ffffff" />'
            : '';

        return <<<HTML
        <div style="font-family: DejaVu Sans, Arial, sans-serif; padding: 5mm 0 3mm 0; border-bottom: 1pt solid #111827;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                    <td style="text-align:left; vertical-align:middle; width:50%;">
                        {$logoImgHtml}
                    </td>
                    <td style="text-align:right; vertical-align:middle; font-size: 9pt; font-weight: 700; color:#111827; letter-spacing:0.04em;">
                        {$label}
                    </td>
                </tr>
            </table>
        </div>
        HTML;
    }

    private function getLogoDataUrl(): string
    {
        $path = public_path('assets/logo_black.png');
        if (! is_file($path)) {
            return '';
        }

        $binary = file_get_contents($path);
        if ($binary === false || $binary === '') {
            return '';
        }

        return 'data:image/png;base64,' . base64_encode($binary);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Shared styles
    // ──────────────────────────────────────────────────────────────────────────

    private function buildBaseStyles(): string
    {
        return <<<HTML
        <style>
            * { box-sizing: border-box; }
            body {
                font-family: DejaVu Sans, Arial, sans-serif;
                color: #111827;
                margin: 0;
                padding: 0;
            }

            /* ── Page 1 & 2 ── */
            .page-title {
                font-size: 20pt;
                font-weight: 700;
                text-align: center;
                margin: 4mm 0 2mm 0;
                letter-spacing: -0.01em;
            }
            .page-subtitle {
                font-size: 10pt;
                text-align: center;
                color: #374151;
                margin: 0 0 5mm 0;
            }
            .section-label {
                font-size: 11pt;
                font-weight: 700;
                text-align: center;
                margin: 3mm 0 3mm 0;
            }
            .img-wrap {
                text-align: center;
                margin: 2mm 0 0 0;
            }
            .img-wrap img {
                max-width: 62%;
                max-height: 188mm;
                border-radius: 1.5mm;
                display: inline-block;
            }
            .img-caption {
                font-size: 9pt;
                color: #6B7280;
                text-align: center;
                margin-top: 2.5mm;
            }

            /* ── Page 3 spec table ── */
            .spec-heading {
                font-size: 14pt;
                font-weight: 700;
                text-align: center;
                margin: 0 0 4mm 0;
            }
            table.spec {
                width: 100%;
                border-collapse: collapse;
                font-size: 9.5pt;
            }
            table.spec td {
                border: 0.5pt solid #9CA3AF;
                padding: 2mm 3mm;
                vertical-align: middle;
            }
            tr.sec-header td {
                background: #1F2937;
                color: #FFFFFF;
                font-weight: 700;
                font-size: 9pt;
                text-align: center;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                border-color: #1F2937;
                padding: 1.8mm 3mm;
            }
            td.label-cell {
                width: 52%;
                background: #F9FAFB;
                font-weight: 600;
                color: #374151;
            }
            td.value-cell {
                width: 48%;
                color: #111827;
            }
            tr.signature-row td {
                padding-top: 6mm;
                padding-bottom: 6mm;
                font-weight: 600;
                font-size: 9pt;
                color: #374151;
                background: #FFFFFF;
            }
        </style>
        HTML;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Page 1 — exterior view
    // ──────────────────────────────────────────────────────────────────────────

    private function buildCoverPage(
        string $absoluteExteriorImagePath,
        string $exteriorModelName,
        string $interiorModelName,
        string $constructiveName,
    ): string {
        $src      = htmlspecialchars($absoluteExteriorImagePath, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $modelStr = '';
        if ($constructiveName !== '' || $exteriorModelName !== '' || $interiorModelName !== '') {
            $parts = array_filter([$constructiveName, trim($exteriorModelName.'/'.$interiorModelName, '/')]);
            $modelStr = htmlspecialchars(implode(' ', $parts), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        return $this->buildBaseStyles().<<<HTML
        <div>
            <div class="page-title">Ваша дверь спроектирована</div>
            {$this->optionalSubtitle($modelStr)}

            <div class="section-label">Внешний вид двери (со стороны улицы)</div>

            <div class="img-wrap">
                <img src="{$src}" />
                <div class="img-caption">Итоговый внешний вид</div>
            </div>
        </div>
        HTML;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Page 2 — interior view
    // ──────────────────────────────────────────────────────────────────────────

    private function buildInteriorPage(string $absoluteInteriorImagePath): string
    {
        $src = htmlspecialchars($absoluteInteriorImagePath, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return $this->buildBaseStyles().<<<HTML
        <div>
            <div class="section-label" style="font-size:13pt; margin-bottom:4mm;">
                Внутренний вид двери (со стороны помещения)
            </div>
            <div class="img-wrap">
                <img src="{$src}" />
                <div class="img-caption">Итоговый внутренний вид изделия</div>
            </div>
        </div>
        HTML;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Page 3 — specification table
    // ──────────────────────────────────────────────────────────────────────────

    private function buildConfigPage(
        array $sections,
        string $orderNumber,
        string $salonAddress,
        string $buyerName,
        string $buyerPhone,
        string $objectAddress,
        string $sellerName,
    ): string {
        $date = htmlspecialchars(Carbon::now()->format('d/m/y'), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // ── Header rows (order / buyer info) ──────────────────────────────────
        $headerRows = [
            ['Дата',              $date],
            ['№ заказа',          $orderNumber],
            ['Адрес салона',      $salonAddress],
            ['Ф.И.О. покупателя', $buyerName],
            ['Телефон покупателя',$buyerPhone],
            ['Адрес объекта',     $objectAddress],
        ];

        $rowsHtml = '';
        foreach ($headerRows as [$label, $value]) {
            $k = htmlspecialchars($label, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $v = htmlspecialchars($value !== '' ? $value : '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $rowsHtml .= '<tr><td class="label-cell">'.$k.'</td><td class="value-cell">'.$v.'</td></tr>';
        }

        // ── Config sections ────────────────────────────────────────────────────
        foreach ($sections as $section) {
            $title = htmlspecialchars((string) ($section['title'] ?? ''), ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $rowsHtml .= '<tr class="sec-header"><td colspan="2">'.$title.'</td></tr>';

            $rows = $section['rows'] ?? [];
            if (! is_array($rows) || $rows === []) {
                $rowsHtml .= '<tr><td class="label-cell">—</td><td class="value-cell">—</td></tr>';
                continue;
            }

            foreach ($rows as $row) {
                if (! is_array($row)) continue;
                $k = htmlspecialchars((string) ($row['label'] ?? '—'), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $v = htmlspecialchars((string) ($row['value'] ?? '—'), ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $rowsHtml .= '<tr><td class="label-cell">'.$k.'</td><td class="value-cell">'.$v.'</td></tr>';
            }
        }

        // ── Signature rows ─────────────────────────────────────────────────────
        $sellerSafe = htmlspecialchars($sellerName !== '' ? $sellerName : '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $signatureRows = [
            'Дополнительная информация:',
            'Фамилия продавца:',
            'Подпись покупателя:',
            'Расшифровка подписи',
        ];
        foreach ($signatureRows as $label) {
            $k = htmlspecialchars($label, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $v = ($label === 'Фамилия продавца:') ? $sellerSafe : '';
            $rowsHtml .= '<tr class="signature-row"><td class="label-cell">'.$k.'</td><td class="value-cell">'.$v.'</td></tr>';
        }

        return $this->buildBaseStyles().<<<HTML
        <div>
            <div class="spec-heading">Спецификация</div>
            <table class="spec" cellpadding="0" cellspacing="0">
                {$rowsHtml}
            </table>
        </div>
        HTML;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────────────────────────────────

    private function optionalSubtitle(string $text): string
    {
        if ($text === '') return '';
        return '<div class="page-subtitle">'.$text.'</div>';
    }

    /**
     * mPDF parses HTML with PCRE; huge data: URLs in one WriteHTML() string exceed pcre.backtrack_limit.
     * Write the binary to a temp file and pass the path instead.
     */
    private function dataUrlToTempPng(string $dataUrl): string
    {
        if (! preg_match('#^data:image/png;base64,(.+)$#s', $dataUrl, $m)) {
            throw new InvalidArgumentException('Invalid PNG data URL.');
        }

        $binary = base64_decode($m[1], true);
        if ($binary === false || $binary === '') {
            throw new InvalidArgumentException('Invalid base64 image data.');
        }

        $dir = storage_path('app/mpdf');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $path = $dir.'/'.uniqid('pdfimg_', true).'.png';
        if (file_put_contents($path, $binary) === false) {
            throw new InvalidArgumentException('Could not write temporary image.');
        }

        return realpath($path) ?: $path;
    }

    /**
     * Normalize config input into sections:
     * [
     *   ['title' => '...', 'rows' => [['label' => '...', 'value' => '...'], ...]],
     * ]
     */
    private function normalizeConfig(mixed $config): array
    {
        if (is_string($config) && trim($config) !== '') {
            $decoded = json_decode($config, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $config = $decoded;
            }
        }

        if (! is_array($config)) {
            return [['title' => 'Спецификация', 'rows' => []]];
        }

        // Preferred shape: { sections: [ { title, rows: [ {label,value} ] } ] }
        if (isset($config['sections']) && is_array($config['sections'])) {
            $sections = [];
            foreach ($config['sections'] as $section) {
                if (! is_array($section)) continue;
                $title  = trim((string) ($section['title'] ?? ''));
                $rowsIn = $section['rows'] ?? [];
                $rows   = [];
                if (is_array($rowsIn)) {
                    foreach ($rowsIn as $r) {
                        if (! is_array($r)) continue;
                        $label = trim((string) ($r['label'] ?? ''));
                        $value = (string) ($r['value'] ?? '');
                        if ($label === '' && $value === '') continue;
                        $rows[] = [
                            'label' => $label !== '' ? $label : '—',
                            'value' => $value !== '' ? $value : '—',
                        ];
                    }
                }
                $sections[] = [
                    'title' => $title !== '' ? $title : '—',
                    'rows'  => $rows,
                ];
            }
            return $sections !== [] ? $sections : [['title' => 'Спецификация', 'rows' => []]];
        }

        // Array of sections already (list of arrays each having 'rows' or 'title').
        $isSectionsList = array_is_list($config)
            && isset($config[0])
            && is_array($config[0])
            && (isset($config[0]['rows']) || isset($config[0]['title']));

        if ($isSectionsList) {
            return $this->normalizeConfig(['sections' => $config]);
        }

        // Flat associative array → one unnamed section.
        $rows = [];
        foreach ($config as $k => $v) {
            $label = trim((string) $k);
            if ($label === '') continue;
            $value = is_scalar($v) ? (string) $v : json_encode($v, JSON_UNESCAPED_UNICODE);
            $rows[] = ['label' => $label, 'value' => trim($value) !== '' ? trim($value) : '—'];
        }

        return [['title' => 'Спецификация', 'rows' => $rows]];
    }
}