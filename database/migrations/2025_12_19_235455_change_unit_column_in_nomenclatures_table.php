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
        Schema::table('nomenclatures', function (Blueprint $table) {
            $table->string('unit')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nomenclatures', function (Blueprint $table) {
            // $table->enum('unit', ['м', 'шт', 'кг', 'л', 'м²', 'м³', 'п.м.', 'р/шт', 'р/п.м.', 'р/л', 'р/м²', 'р/м³', 'р/кг'])->change();
        });
    }
};
