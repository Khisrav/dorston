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
        Schema::create('furnitures', function (Blueprint $table) {
            $table->id();
            $table->enum('shape', ['rectangular', 'oval', 'other']);
            $table->string('color');
            $table->string('cylindrical_lock_cover_image')->nullable(); //накладка цилиндрического замка
            $table->string('lever_lock_cover_image')->nullable(); //накладка сувальдного замка
            $table->string('peephole_cover_image')->nullable(); //накладка на глазок
            $table->string('night_latch_turner_cover_image')->nullable(); //накладка на ночник
            $table->string('cylinder_rod_cover_image')->nullable(); //вертушок на шток цилиндра
            $table->string('handle_cover_image')->nullable(); //накладка на ручку
            $table->unsignedInteger('cylindrical_lock_id')->nullable();
            $table->unsignedInteger('lever_lock_id')->nullable(); //id сувальдного замка
            $table->unsignedInteger('peephole_id')->nullable(); //id глазка
            $table->unsignedInteger('night_latch_turner_id')->nullable(); //id ночника
            $table->unsignedInteger('cylinder_rod_id')->nullable(); //id вертушки на шток цилиндра
            $table->unsignedInteger('handle_id')->nullable(); //id ручки
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furnitures');
    }
};
