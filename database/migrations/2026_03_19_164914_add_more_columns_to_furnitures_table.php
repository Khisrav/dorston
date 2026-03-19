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
            $table->renameColumn('cylindrical_lock_id', 'primary_cylindrical_lock_id');
            $table->renameColumn('lever_lock_id', 'primary_lever_lock_id');

            $table->unsignedInteger('secondary_cylindrical_lock_id')->nullable();
            $table->unsignedInteger('secondary_lever_lock_id')->nullable();


            $table->renameColumn('cylindrical_lock_cover_image', 'primary_cylindrical_lock_cover_image');
            $table->renameColumn('lever_lock_cover_image', 'primary_lever_lock_cover_image');

            $table->unsignedInteger('secondary_cylindrical_lock_cover_image')->nullable();
            $table->unsignedInteger('secondary_lever_lock_cover_image')->nullable();


            $table->enum('type', ['push', 'pull', 'electronic'])->default('push');//push - нажимная, pull - бугельная, electronic - электронная
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('furnitures', function (Blueprint $table) {
            //
        });
    }
};
