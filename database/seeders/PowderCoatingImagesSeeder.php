<?php

namespace Database\Seeders;

use App\Models\Nomenclature;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PowderCoatingImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all nomenclatures from category 2 (powder coatings) before cleaning
        $powderCoatings = Nomenclature::where('nomenclature_category_id', 2)->get();

        if ($powderCoatings->isEmpty()) {
            Log::warning('No nomenclatures found in category 2');
            return;
        }

        // Delete old images for powder coatings from nomenclatures folder
        foreach ($powderCoatings as $powderCoating) {
            if ($powderCoating->image && str_starts_with($powderCoating->image, 'nomenclatures/')) {
                if (Storage::disk('public')->exists($powderCoating->image)) {
                    Storage::disk('public')->delete($powderCoating->image);
                    Log::info("✓ Deleted old image: {$powderCoating->image}");
                }
            }
        }

        // Clean up entire powder-coatings directory in storage
        if (Storage::disk('public')->exists('powder-coatings')) {
            Storage::disk('public')->deleteDirectory('powder-coatings');
            Log::info('✓ Deleted powder-coatings directory');
        }
        
        // Create fresh powder-coatings directory
        Storage::disk('public')->makeDirectory('powder-coatings');

        $sourcePath = database_path('data/powder-coatings');

        if (!File::isDirectory($sourcePath)) {
            Log::error("Source directory does not exist: {$sourcePath}");
            return;
        }

        $updatedCount = 0;
        $notFoundCount = 0;

        foreach ($powderCoatings as $powderCoating) {
            $imagePath = $this->copyImageToStorage($powderCoating->name, $sourcePath);
            
            if ($imagePath) {
                $powderCoating->update(['image' => $imagePath]);
                $updatedCount++;
                Log::info("✓ Updated powder coating: {$powderCoating->name}");
            } else {
                // Clear image reference if no image found
                $powderCoating->update(['image' => null]);
                $notFoundCount++;
                Log::warning("✗ Image not found for: {$powderCoating->name}");
            }
        }

        Log::info("Powder coatings seeding complete. Updated: {$updatedCount}, Not found: {$notFoundCount}");
    }

    /**
     * Copy image from database/data/powder-coatings to storage/public and return the storage path.
     *
     * @param string $name
     * @param string $sourcePath
     * @return string|null
     */
    protected function copyImageToStorage(string $name, string $sourcePath): ?string
    {
        // Try different extensions
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        
        foreach ($extensions as $ext) {
            $sourceFile = "{$sourcePath}/{$name}.{$ext}";
            
            if (File::exists($sourceFile)) {
                $destinationPath = "powder-coatings/{$name}.{$ext}";
                
                // Copy file to storage
                Storage::disk('public')->put(
                    $destinationPath,
                    File::get($sourceFile)
                );
                
                return $destinationPath;
            }
        }

        return null;
    }
}