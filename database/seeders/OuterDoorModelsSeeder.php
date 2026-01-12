<?php

namespace Database\Seeders;

use App\Models\DoorModel;
use DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OuterDoorModelsSeeder extends Seeder
{
    public function run(): void
    {
        // Clean up existing door models directory in storage
        Storage::disk('public')->deleteDirectory('door-models');
        Storage::disk('public')->makeDirectory('door-models');

        $doorModels = [];

        // Scan and process interior models
        $doorModels = array_merge($doorModels, $this->scanAndProcessFolder('apartment-interior', 'interior', false));
        
        // Scan and process exterior models
        $doorModels = array_merge($doorModels, $this->scanAndProcessFolder('apartment-exterior', 'exterior', false));
        
        // Scan and process thermal resistant models
        $doorModels = array_merge($doorModels, $this->scanAndProcessFolder('street-exterior', 'exterior', true));

        DB::table('door_models')->truncate();
        DoorModel::insert($doorModels);
        
        Log::info("Seeded " . count($doorModels) . " door models");
    }

    /**
     * Scan a folder and process all PNG images
     */
    protected function scanAndProcessFolder(string $folder, string $type, bool $isThermallyResistant): array
    {
        $sourcePath = database_path("data/door-models/{$folder}");
        $doorModels = [];

        if (!File::isDirectory($sourcePath)) {
            Log::warning("Directory does not exist: {$sourcePath}");
            return $doorModels;
        }

        $files = File::files($sourcePath);
        
        foreach ($files as $file) {
            if ($file->getExtension() !== 'png') {
                continue;
            }

            $filename = $file->getFilename();
            $name = pathinfo($filename, PATHINFO_FILENAME);
            
            // Skip placeholder or unwanted files
            if (in_array(strtolower($name), ['placeholder', 'image'])) {
                continue;
            }

            $imagePath = $this->copyImageToStorage($name, $folder);
            
            $doorModels[] = [
                'name' => $name,
                'image' => $imagePath,
                'type' => $type,
                'is_thermally_resistant' => $isThermallyResistant,
            ];
            
            Log::info("✓ Processed: {$name}");
        }

        return $doorModels;
    }

    /**
     * Copy image from database/data to storage/public and return the storage path.
     */
    protected function copyImageToStorage(string $name, string $folder): string
    {
        $defaultImageSource = database_path('data/door-models/placeholder.jpeg');
        $defaultImageDest = 'door-models/placeholder.jpeg';
        
        // Copy default placeholder if it doesn't exist in storage
        if (File::exists($defaultImageSource) && !Storage::disk('public')->exists($defaultImageDest)) {
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

        Log::warning("✗ File not found: {$sourcePath}");
        return $defaultImageDest;
    }
}