<?php

namespace Database\Seeders;

use App\Models\DoorModel;
use DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class OuterDoorModelsSeeder extends Seeder
{
    public function run(): void
    {
        $interiorModels = [
            'Ф-3', 'Ф-11', 'Ф-20', 'Ф-31', 'Ф-36', 'Ф-37', 'Ф-48', 'Ф-64', 'Ф-71', 'Ф-75', 'Ф-88', 'Ф-95', 'Ф-99',
            'Ф-21', 'Ф-22', 'Ф-23', 'Ф-26', 'Ф-42', 'Ф-24', 'Ф-30', 'Ф-32', 'Ф-76', 'Ф-79', 'ГЛ-1', 'Без панели',
            'ФЗ-1', 'ФЗ-6', 'ФЗ-7', 'ФЗ-8', 'Ф-63 (Darkwood SP)', 'Ф-81 (Drevos SP)', 'Ф-96 (Senator Max SP)',
            'Ф-84 (Senator SP)', 'Ф-85 (Credo SP)'
        ];

        $thermalResistantModels = [
            'Darkwood SP Дуб чарлстон', 'Darkwood SP Вудлайн тёмный', 'Soros Дуб чарлстон', 'Soros Вудлайн тёмный',
            'Drevos SP Пино+чёрный', 'Veles Вяз шоколад', 'Veles Вудлайн тёмный', 'Veles Дуб чарлстон', 'Veles Пино'
        ];

        $exteriorModels = [
            'Kombi', 'Verso', 'Forta', 'Stark', 'BC-6', 'BC-45', 'BC-22', 'BC-24', 'BC-13', 'BC-41', 'BC-46',
            'BC-47', 'BC-32', 'BC-48', 'BC-42', 'BC-49', 'BC-50', 'BC-43', 'BC-51', 'НФ-6', 'BC-52', 'BC-34',
            'BC-30', 'BC-44', 'BC-19', 'BC-38', 'ВС-17'
        ];

        // Clean up existing door models directory in storage
        Storage::disk('public')->deleteDirectory('door-models');
        Storage::disk('public')->makeDirectory('door-models');

        $doorModels = [];

        foreach ($interiorModels as $name) {
            $imagePath = $this->copyImageToStorage($name, 'apartment-interior');
            $doorModels[] = [
                'name' => $name,
                'image' => $imagePath,
                'type' => 'interior',
                'is_thermally_resistant' => false,
            ];
        }

        foreach ($exteriorModels as $name) {
            $imagePath = $this->copyImageToStorage($name, 'apartment-exterior');
            $doorModels[] = [
                'name' => $name,
                'image' => $imagePath,
                'type' => 'exterior',
                'is_thermally_resistant' => false,
            ];
        }

        foreach ($thermalResistantModels as $name) {
            $imagePath = $this->copyImageToStorage($name, 'street-exterior');
            $doorModels[] = [
                'name' => $name,
                'image' => $imagePath,
                'type' => 'exterior',
                'is_thermally_resistant' => true,
            ];
        }

        DB::table('door_models')->truncate();
        DoorModel::insert($doorModels);
    }

    /**
     * Copy image from database/data to storage/public and return the storage path.
     *
     * @param string $name
     * @param string $folder
     * @return string
     */
    protected function copyImageToStorage(string $name, string $folder): string
    {
        $defaultImageSource = database_path('data/door-models/default/placeholder.png');
        $defaultImageDest = 'door-models/default/placeholder.png';
        
        // Copy default placeholder if it doesn't exist in storage
        if (File::exists($defaultImageSource) && !Storage::disk('public')->exists($defaultImageDest)) {
            Storage::disk('public')->makeDirectory('door-models/default');
            Storage::disk('public')->put(
                $defaultImageDest,
                File::get($defaultImageSource)
            );
        }

        // Source path in database/data
        $sourcePath = database_path("data/door-models/{$folder}/{$name}.png");
        
        // Destination path in storage/app/public
        $destinationPath = "door-models/{$folder}/{$name}.png";

        // Check if source file exists
        if (File::exists($sourcePath)) {
            // Create directory if it doesn't exist
            Storage::disk('public')->makeDirectory("door-models/{$folder}");
            
            // Copy file to storage
            Storage::disk('public')->put(
                $destinationPath,
                File::get($sourcePath)
            );
            
            return $destinationPath;
        }

        // Return placeholder if source doesn't exist
        return $defaultImageDest;
    }
}