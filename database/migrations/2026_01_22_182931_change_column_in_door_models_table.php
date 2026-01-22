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
        Schema::table('door_models', function (Blueprint $table) {
            $table->renameColumn('additional_element_texture_image', 'additional_element_mask_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('door_models', function (Blueprint $table) {
            $table->renameColumn('additional_element_mask_image', 'additional_element_texture_image');
        });
    }
};
