<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('furnitures', function (Blueprint $table) {
            // Rename existing lock cover image columns to have exterior_ prefix
            $table->renameColumn('primary_cylindrical_lock_cover_image', 'exterior_primary_cylindrical_lock_cover_image');
            $table->renameColumn('primary_lever_lock_cover_image', 'exterior_primary_lever_lock_cover_image');
            $table->renameColumn('secondary_cylindrical_lock_cover_image', 'exterior_secondary_cylindrical_lock_cover_image');
            $table->renameColumn('secondary_lever_lock_cover_image', 'exterior_secondary_lever_lock_cover_image');
        });

        Schema::table('furnitures', function (Blueprint $table) {
            // Add interior_ copies of the lock cover image columns
            $table->string('interior_primary_cylindrical_lock_cover_image')->nullable()->after('exterior_primary_cylindrical_lock_cover_image');
            $table->string('interior_primary_lever_lock_cover_image')->nullable()->after('exterior_primary_lever_lock_cover_image');
            $table->string('interior_secondary_cylindrical_lock_cover_image')->nullable()->after('exterior_secondary_cylindrical_lock_cover_image');
            $table->string('interior_secondary_lever_lock_cover_image')->nullable()->after('exterior_secondary_lever_lock_cover_image');

            // Add position-specific peephole cover image columns
            $table->string('side_peephole_cover_image')->nullable()->after('peephole_cover_image');
            $table->string('center_peephole_cover_image')->nullable()->after('side_peephole_cover_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('furnitures', function (Blueprint $table) {
            $table->dropColumn([
                'interior_primary_cylindrical_lock_cover_image',
                'interior_primary_lever_lock_cover_image',
                'interior_secondary_cylindrical_lock_cover_image',
                'interior_secondary_lever_lock_cover_image',
                'side_peephole_cover_image',
                'center_peephole_cover_image',
            ]);
        });

        Schema::table('furnitures', function (Blueprint $table) {
            $table->renameColumn('exterior_primary_cylindrical_lock_cover_image', 'primary_cylindrical_lock_cover_image');
            $table->renameColumn('exterior_primary_lever_lock_cover_image', 'primary_lever_lock_cover_image');
            $table->renameColumn('exterior_secondary_cylindrical_lock_cover_image', 'secondary_cylindrical_lock_cover_image');
            $table->renameColumn('exterior_secondary_lever_lock_cover_image', 'secondary_lever_lock_cover_image');
        });
    }
};
