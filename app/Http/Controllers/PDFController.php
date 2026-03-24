<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mpdf\Mpdf;
use InvalidArgumentException;

class PDFController extends Controller
{
    public function generate(Request $request): Response
    {
        $request->validate([
            'exterior_image' => ['required', 'string', 'starts_with:data:image/png'],
            'interior_image' => ['required', 'string', 'starts_with:data:image/png'],
        ]);

        $mpdf = new Mpdf([
            'tempDir'       => storage_path('app/mpdf'),

            'margin_top'    => 10,
            'margin_bottom' => 10,
            'margin_left'   => 10,
            'margin_right'  => 10,
            'orientation'   => 'P',
            'img_dpi'       => 192,
        ]);

        $exteriorImage = $request->input('exterior_image');
        $interiorImage = $request->input('interior_image');

        $tempPaths = [];
        try {
            $tempPaths[] = $this->dataUrlToTempPng($exteriorImage);
            $tempPaths[] = $this->dataUrlToTempPng($interiorImage);

            // Page 1 — Exterior view
            $mpdf->WriteHTML($this->buildImagePage($tempPaths[0], 'Внешний вид'));

            // Page 2 — Interior view
            $mpdf->AddPage();
            $mpdf->WriteHTML($this->buildImagePage($tempPaths[1], 'Внутренний вид'));

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

    /**
     * mPDF parses HTML with PCRE; huge data: URLs in one WriteHTML() string exceed pcre.backtrack_limit.
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

    private function buildImagePage(string $absoluteImagePath, string $label): string
    {
        $src = htmlspecialchars($absoluteImagePath, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return <<<HTML
        <div style="text-align:center; font-family: Arial, sans-serif;">
            <p style="font-size:16pt; margin-bottom:8px;">{$label}</p>
            <img src="{$src}" style="max-width:100%; height:auto;" />
        </div>
        HTML;
    }
}
