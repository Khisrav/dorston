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
            $table->boolean('has_primary_film_color')->default(false);
            $table->boolean('has_secondary_film_color')->default(false);
            $table->boolean('has_casing_film_color')->default(false);
            $table->boolean('has_primary_paint')->default(false);
            $table->boolean('has_secondary_paint')->default(false);
            $table->unsignedInteger('default_primary_film_color_id')->nullable();
            $table->unsignedInteger('default_secondary_film_color_id')->nullable();
            $table->unsignedInteger('default_casing_film_color_id')->nullable();
            $table->unsignedInteger('default_primary_paint_id')->nullable();
            $table->unsignedInteger('default_secondary_paint_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('door_models', function (Blueprint $table) {
            $table->dropColumn([
                'has_primary_film_color',
                'has_secondary_film_color',
                'has_casing_film_color',
                'has_primary_paint',
                'has_secondary_paint',
                'default_primary_film_color_id',
                'default_secondary_film_color_id',
                'default_casing_film_color_id',
                'default_primary_paint_id',
                'default_secondary_paint_id',
            ]);
        });
    }
};
