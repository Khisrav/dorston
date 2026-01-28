<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Furniture extends Model
{
    protected $table = 'furnitures';
    
    protected $fillable = [
        'shape', 'color', 'cylindrical_lock_cover_image', 'lever_lock_cover_image', 'peephole_cover_image', 'night_latch_turner_cover_image', 'cylinder_rod_cover_image', 'handle_cover_image', 'cylindrical_lock_id', 'lever_lock_id', 'peephole_id', 'night_latch_turner_id', 'cylinder_rod_id', 'handle_id',
    ];

    
}
