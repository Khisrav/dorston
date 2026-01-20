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
            //milling image, milling can overflow to casing
            $table->string('milling_image')->nullable();
            $table->boolean('milling_overflows_to_casing')->default(false);

            //some models have additional elements (decorative element and additional element's texture)
            $table->string('additional_element_decor_image')->nullable();
            $table->string('additional_element_texture_image')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('door_models', function (Blueprint $table) {
            $table->dropColumn([
                'milling_image',
                'milling_overflows_to_casing',
                'additional_element_decor_image',
                'additional_element_texture_image',
            ]);
        });
    }
};
