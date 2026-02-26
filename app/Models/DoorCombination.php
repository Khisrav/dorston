<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DoorCombination extends Model
{
    protected $fillable = [
        'door_model_id',
        'film_color_id',
        'img_purpose',
        'image',
    ];

    public function doorModel(): BelongsTo
    {
        return $this->belongsTo(DoorModel::class);
    }

    public function filmColor(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class);
    }
}
