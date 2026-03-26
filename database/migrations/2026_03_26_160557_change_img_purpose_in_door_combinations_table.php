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
        Schema::table('door_combinations', function (Blueprint $table) {
            $table->enum('img_purpose', ['Наличник', 'Полотно', 'Вставка наличника', 'Вставка полотна', 'Петли'])->change();
            $table->enum('door_type', ['apartment', 'termo'])->default('apartment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('door_combinations', function (Blueprint $table) {
            $table->enum('img_purpose', ['Наличник', 'Полотно', 'Вставка наличника', 'Вставка полотна'])->change();
        });
    }
};
