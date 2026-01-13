<?php

namespace Database\Seeders;

use App\Models\Nomenclature;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FilmColorImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all nomenclatures from category 13 (film colors) before cleaning
        $filmColors = Nomenclature::where('nomenclature_category_id', 13)->get();

        if ($filmColors->isEmpty()) {
            Log::warning('No nomenclatures found in category 13');
            return;
        }

        // Delete old images for film colors from nomenclatures folder
        foreach ($filmColors as $filmColor) {
            if ($filmColor->image && str_starts_with($filmColor->image, 'nomenclatures/')) {
                if (Storage::disk('public')->exists($filmColor->image)) {
                    Storage::disk('public')->delete($filmColor->image);
                    Log::info("✓ Deleted old image: {$filmColor->image}");
                }
            }
        }

        // Clean up entire film-colors directory in storage
        if (Storage::disk('public')->exists('film-colors')) {
            Storage::disk('public')->deleteDirectory('film-colors');
            Log::info('✓ Deleted film-colors directory');
        }
        
        // Create fresh film-colors directory
        Storage::disk('public')->makeDirectory('film-colors');

        $sourcePath = database_path('data/film-colors');

        if (!File::isDirectory($sourcePath)) {
            Log::error("Source directory does not exist: {$sourcePath}");
            return;
        }

        $updatedCount = 0;
        $notFoundCount = 0;

        foreach ($filmColors as $filmColor) {
            $imagePath = $this->copyImageToStorage($filmColor->name, $sourcePath);
            
            if ($imagePath) {
                $filmColor->update(['image' => $imagePath]);
                $updatedCount++;
                Log::info("✓ Updated film color: {$filmColor->name}");
            } else {
                // Clear image reference if no image found
                $filmColor->update(['image' => null]);
                $notFoundCount++;
                Log::warning("✗ Image not found for: {$filmColor->name}");
            }
        }

        Log::info("Film colors seeding complete. Updated: {$updatedCount}, Not found: {$notFoundCount}");
    }

    /**
     * Copy image from database/data/film-colors to storage/public and return the storage path.
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
                $destinationPath = "film-colors/{$name}.{$ext}";
                
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