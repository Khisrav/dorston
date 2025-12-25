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
        Schema::create('nomenclatures', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('nomenclature_category_id')->constrained('nomenclature_categories');
            $table->string('image')->nullable();
            $table->string('base_price');
            $table->enum('unit', ['м', 'шт', 'кг', 'л', 'м²', 'м³', 'п.м.', 'р/шт', 'р/п.м.', 'р/л', 'р/м²', 'р/м³', 'р/кг']);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nomenclatures');
    }
};
