<?php

namespace Database\Seeders;

use App\Models\DoorCombination;
use App\Models\DoorModel;
use App\Models\Nomenclature;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Normalizer;

class TermoDoorCombinationsImageSeeder extends Seeder
{
    private const PAINT_COLOR_CATEGORY_IDS = [2];
    private const COMBINATIONS_BASE_PATH = 'database/data/door-models/termo/combinations';

    // Map short purpose abbreviations (as they appear in filenames) to full DB values
    private const PURPOSE_MAP = [
        'Нал'    => 'Наличник',
        'Полотно' => 'Полотно',
        'Петли'  => 'Петли',
    ];

    public function run(): void
    {
        $this->clearPrevious();

        $nomenclatures = Nomenclature::whereIn('nomenclature_category_id', self::PAINT_COLOR_CATEGORY_IDS)->get();

        $basePath   = base_path(self::COMBINATIONS_BASE_PATH);
        $subfolders = array_values(array_filter(
            scandir($basePath),
            fn($f) => is_dir($basePath . '/' . $f) && !in_array($f, ['.', '..'])
        ));

        $imported            = 0;
        $skippedParse        = 0;
        $skippedNomenclature = 0;
        $skippedModel        = 0;
        $failed              = [];

        foreach ($subfolders as $folder) {
            // Strip trailing " Рендер" to get the model name
            $modelName = trim(preg_replace('/\s*Рендер\s*$/u', '', $folder));
            $model     = DoorModel::where('name', $modelName)->first();

            if (!$model) {
                $this->command?->warn("Модель не найдена в БД: '{$modelName}' (папка: {$folder})");
                $skippedModel++;
                $failed[] = [
                    'model'    => $modelName,
                    'color'    => '—',
                    'purpose'  => '—',
                    'filename' => '—',
                    'reason'   => 'Модель не найдена в БД',
                ];
                continue;
            }

            $folderPath = $basePath . '/' . $folder;
            $files      = array_values(array_filter(
                scandir($folderPath),
                fn($f) => !in_array($f, ['.', '..'])
            ));

            foreach ($files as $filename) {
                $parsed = $this->parseFilename($filename);

                if (!$parsed) {
                    $this->command?->warn("Не удалось разобрать имя файла: {$filename}");
                    $skippedParse++;
                    $failed[] = [
                        'model'    => $modelName,
                        'color'    => '—',
                        'purpose'  => '—',
                        'filename' => $filename,
                        'reason'   => 'Не удалось разобрать имя файла',
                    ];
                    continue;
                }

                ['colorName' => $colorName, 'purpose' => $purpose, 'extension' => $extension] = $parsed;

                $paintColor = $this->findNomenclature($colorName, $nomenclatures);

                if (!$paintColor) {
                    $this->command?->warn("Цвет не найден в номенклатуре: '{$colorName}' (файл: {$filename})");
                    $skippedNomenclature++;
                    $failed[] = [
                        'model'    => $modelName,
                        'color'    => $colorName,
                        'purpose'  => $purpose,
                        'filename' => $filename,
                        'reason'   => 'Цвет не найден в номенклатуре',
                    ];
                    continue;
                }

                $storagePath = 'door-combinations/' . (string) Str::ulid() . '.' . $extension;
                Storage::disk('public')->put($storagePath, file_get_contents($folderPath . '/' . $filename));

                DoorCombination::updateOrCreate(
                    [
                        'door_model_id' => $model->id,
                        'film_color_id' => $paintColor->id,
                        'img_purpose'   => $purpose,
                        'door_type'     => 'termo',
                    ],
                    ['image' => $storagePath]
                );

                $this->command?->info("Импортировано: {$filename}");
                $imported++;
            }
        }

        $skippedTotal = $skippedParse + $skippedNomenclature + $skippedModel;

        $this->command?->newLine();
        $this->command?->table(
            ['Показатель', 'Кол-во'],
            [
                ['Импортировано',                      $imported],
                ['Пропущено (ошибка имени файла)',      $skippedParse],
                ['Пропущено (цвет не найден)',          $skippedNomenclature],
                ['Пропущено (модель не найдена в БД)', $skippedModel],
                ['Пропущено итого',                    $skippedTotal],
            ]
        );

        if (!empty($failed)) {
            $this->command?->newLine();
            $this->command?->warn('=== КОМБИНАЦИИ, КОТОРЫЕ НЕ УДАЛОСЬ ИМПОРТИРОВАТЬ ===');
            $this->command?->table(
                ['Модель', 'Цвет', 'Назначение', 'Файл', 'Причина'],
                array_map(fn($f) => array_values($f), $failed)
            );

            $logPath = storage_path('logs/termo-door-combinations-failed.log');
            $lines   = ['Комбинации, которые не удалось импортировать — ' . now()->toDateTimeString(), ''];
            $lines[] = implode(' | ', ['Модель', 'Цвет', 'Назначение', 'Файл', 'Причина']);
            $lines[] = str_repeat('-', 100);
            foreach ($failed as $f) {
                $lines[] = implode(' | ', array_values($f));
            }
            file_put_contents($logPath, implode(PHP_EOL, $lines) . PHP_EOL);

            $this->command?->newLine();
            $this->command?->line("Список также сохранён в файл: {$logPath}");
        }
    }

    private function clearPrevious(): void
    {
        $combinations = DoorCombination::where('door_type', 'termo')->get();

        foreach ($combinations as $combination) {
            if ($combination->image && Storage::disk('public')->exists($combination->image)) {
                Storage::disk('public')->delete($combination->image);
            }
        }

        $deleted = $combinations->count();
        if ($deleted > 0) {
            $combinations->toQuery()->delete();
        }

        $this->command?->info("Удалено {$deleted} существующих комбинаций термо из БД и хранилища.");
    }

    private function parseFilename(string $filename): ?array
    {
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
        $extension      = pathinfo($filename, PATHINFO_EXTENSION);

        // Split into at most 3 parts: {model}_{color}_{purpose}
        $parts = explode('_', $nameWithoutExt, 3);

        if (count($parts) < 3) {
            return null;
        }

        [, $colorName, $purposeRaw] = $parts;

        $colorName  = trim($colorName);
        $purposeRaw = trim($purposeRaw);

        // Strip duplicate indicators like " (2)" from purpose
        $purposeRaw = trim(preg_replace('/\s*\(\d+\)\s*$/', '', $purposeRaw));

        if (!array_key_exists($purposeRaw, self::PURPOSE_MAP)) {
            return null;
        }

        $purpose = self::PURPOSE_MAP[$purposeRaw];

        // Capitalize first letter — handles lowercase-first errors
        $colorName = mb_strtoupper(mb_substr($colorName, 0, 1)) . mb_substr($colorName, 1);

        return compact('colorName', 'purpose', 'extension');
    }

    private function findNomenclature(string $colorName, Collection $nomenclatures): ?Nomenclature
    {
        $normalizedColor = $this->normalize($colorName);

        return $nomenclatures
            ->filter(function ($n) use ($normalizedColor) {
                $normalizedName = $this->normalize($n->name);
                // Check both directions so naming differences on either side don't break matching.
                return mb_stripos($normalizedColor, $normalizedName, 0, 'UTF-8') !== false
                    || mb_stripos($normalizedName, $normalizedColor, 0, 'UTF-8') !== false;
            })
            ->sortByDesc(fn($n) => mb_strlen($n->name))
            ->first();
    }

    // Normalizes a string for fuzzy matching:
    // - NFC Unicode normalization (macOS returns filenames in NFD via scandir,
    //   e.g. "й" as и + combining breve, which never matches the NFC stored in DB)
    // - Trims whitespace
    // - Replaces ё with е (commonly interchanged in Russian)
    private function normalize(string $str): string
    {
        $str = Normalizer::normalize($str, Normalizer::FORM_C) ?: $str;
        return str_replace(['ё', 'Ё'], ['е', 'Е'], trim($str));
    }
}
