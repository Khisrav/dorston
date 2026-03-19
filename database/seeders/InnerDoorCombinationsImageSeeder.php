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

class InnerDoorCombinationsImageSeeder extends Seeder
{
    private const FILM_COLOR_CATEGORY_IDS = [13, 2];
    private const COMBINATIONS_BASE_PATH = 'database/data/door-models/apartment-interior/combinations';
    private const VALID_PURPOSES = ['Наличник', 'Полотно', 'Вставка наличника', 'Вставка полотна', 'Вставка полотно'];

    public function run(): void
    {
        $this->clearPrevious();

        $nomenclatures = Nomenclature::whereIn('nomenclature_category_id', self::FILM_COLOR_CATEGORY_IDS)->get();
        $models = DoorModel::where('type', 'interior')->get();

        $imported = 0;
        $skippedParse = 0;
        $skippedNomenclature = 0;
        $missingFolders = 0;
        $failed = [];

        foreach ($models as $model) {
            $folderPath = base_path(self::COMBINATIONS_BASE_PATH . '/' . $model->name);

            if (!is_dir($folderPath)) {
                $this->command?->warn("Папка комбинаций не найдена для модели: {$model->name}");
                $missingFolders++;
                $failed[] = [
                    'model'    => $model->name,
                    'color'    => '—',
                    'purpose'  => '—',
                    'filename' => '—',
                    'reason'   => 'Папка модели не найдена',
                ];
                continue;
            }

            $files = array_values(array_filter(
                scandir($folderPath),
                fn($f) => !in_array($f, ['.', '..'])
            ));

            foreach ($files as $filename) {
                $parsed = $this->parseFilename($filename);

                if (!$parsed) {
                    $this->command?->warn("Не удалось разобрать имя файла: {$filename}");
                    $skippedParse++;
                    $failed[] = [
                        'model'    => $model->name,
                        'color'    => '—',
                        'purpose'  => '—',
                        'filename' => $filename,
                        'reason'   => 'Не удалось разобрать имя файла',
                    ];
                    continue;
                }

                ['colorName' => $colorName, 'purpose' => $purpose, 'extension' => $extension] = $parsed;

                $filmColor = $this->findNomenclature($colorName, $nomenclatures);

                if (!$filmColor) {
                    $this->command?->warn("Цвет не найден в номенклатуре: '{$colorName}' (файл: {$filename})");
                    $skippedNomenclature++;
                    $failed[] = [
                        'model'    => $model->name,
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
                        'film_color_id'  => $filmColor->id,
                        'img_purpose'    => $purpose === 'Вставка полотно' ? 'Вставка полотна' : $purpose,
                    ],
                    ['image' => $storagePath]
                );

                $this->command?->info("Импортировано: {$filename}");
                $imported++;
            }
        }

        $skippedTotal = $skippedParse + $skippedNomenclature;

        $this->command?->newLine();
        $this->command?->table(
            ['Показатель', 'Кол-во'],
            [
                ['Импортировано',                      $imported],
                ['Пропущено (ошибка имени файла)',      $skippedParse],
                ['Пропущено (цвет не найден)',          $skippedNomenclature],
                ['Пропущено итого',                    $skippedTotal],
                ['Модели без папки',                   $missingFolders],
            ]
        );

        if (!empty($failed)) {
            $this->command?->newLine();
            $this->command?->warn('=== КОМБИНАЦИИ, КОТОРЫЕ НЕ УДАЛОСЬ ИМПОРТИРОВАТЬ ===');
            $this->command?->table(
                ['Модель', 'Цвет', 'Назначение', 'Файл', 'Причина'],
                array_map(fn($f) => array_values($f), $failed)
            );

            $logPath = storage_path('logs/inner-door-combinations-failed.log');
            $lines = ['Комбинации, которые не удалось импортировать — ' . now()->toDateTimeString(), ''];
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
        $combinations = DoorCombination::whereHas(
            'doorModel',
            fn($q) => $q->where('type', 'interior')
        )->get();

        foreach ($combinations as $combination) {
            if ($combination->image && Storage::disk('public')->exists($combination->image)) {
                Storage::disk('public')->delete($combination->image);
            }
        }

        $deleted = $combinations->count();
        if ($deleted > 0) {
            $combinations->toQuery()->delete();
        }

        $this->command?->info("Удалено {$deleted} существующих комбинаций из БД и хранилища.");
    }

    private function parseFilename(string $filename): ?array
    {
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);

        // Split into at most 3 parts: {model}_{color}_{purpose...}
        $parts = explode('_', $nameWithoutExt, 3);

        if (count($parts) < 3) {
            return null;
        }

        [, $colorName, $purpose] = $parts;

        // Trim whitespace — handles leading-space errors from double underscores (e.g. "Ф-48_ Красная Бургундия_...")
        $colorName = trim($colorName);
        $purpose = trim($purpose);

        // Strip duplicate indicators like " (2)" from purpose (e.g. "Полотно (2)" → "Полотно")
        $purpose = trim(preg_replace('/\s*\(\d+\)\s*$/', '', $purpose));

        if (!in_array($purpose, self::VALID_PURPOSES)) {
            return null;
        }

        // Capitalize first letter — handles lowercase-first errors (e.g. "бетон снежный 2" → "Бетон снежный 2")
        $colorName = mb_strtoupper(mb_substr($colorName, 0, 1)) . mb_substr($colorName, 1);

        return compact('colorName', 'purpose', 'extension');
    }

    private function findNomenclature(string $colorName, Collection $nomenclatures): ?Nomenclature
    {
        $normalizedColor = $this->normalize($colorName);

        return $nomenclatures
            ->filter(function ($n) use ($normalizedColor) {
                $normalizedName = $this->normalize($n->name);
                // Check both directions so naming differences in either side don't break matching.
                // E.g. filename "Шпон дуб натуральный 2" should match nomenclature "Шпон дуб натуральный",
                // and filename "Санд айс" should match nomenclature "Санд Айс".
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
