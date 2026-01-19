<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoorModel extends Model
{
    protected $fillable = [
        'name', 'image', 'type', 'is_thermally_resistant',
        'has_primary_film_color', 'has_secondary_film_color', 'has_casing_film_color',
        'has_primary_paint', 'has_secondary_paint',
        'default_primary_film_color_id', 'default_secondary_film_color_id', 'default_casing_film_color_id',
        'default_primary_paint_id', 'default_secondary_paint_id',
    ];

    // public function getImageAttribute($value)
    // {
    //     return asset('storage/' . $value);
    // }
}
