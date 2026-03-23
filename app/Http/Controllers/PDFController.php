<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Mpdf\Mpdf;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;

class PDFController extends Controller
{
    public function generate(Request $request): Response
    {
        $request->validate([
            'exterior_image' => ['required', 'string', 'starts_with:data:image/png'],
            'interior_image' => ['required', 'string', 'starts_with:data:image/png'],
        ]);

        $mpdf = new Mpdf([
            'margin_top'    => 10,
            'margin_bottom' => 10,
            'margin_left'   => 10,
            'margin_right'  => 10,
            'orientation'   => 'P',
            'img_dpi'       => 192,
        ]);

        $exteriorImage = $request->input('exterior_image');
        $interiorImage = $request->input('interior_image');

        // Page 1 — Exterior view
        $mpdf->WriteHTML($this->buildImagePage($exteriorImage, 'Внешний вид'));

        // Page 2 — Interior view
        $mpdf->AddPage();
        $mpdf->WriteHTML($this->buildImagePage($interiorImage, 'Внутренний вид'));

        $pdfContent = $mpdf->Output('', 'S');

        return response($pdfContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="door-config.pdf"',
        ]);
    }

    private function buildImagePage(string $dataUrl, string $label): string
    {
        return <<<HTML
        <div style="text-align:center; font-family: Arial, sans-serif;">
            <p style="font-size:16pt; margin-bottom:8px;">{$label}</p>
            <img src="{$dataUrl}" style="max-width:100%; height:auto;" />
        </div>
        HTML;
    }
}
