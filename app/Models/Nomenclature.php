<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nomenclature extends Model
{
    protected $fillable = ['name', 'nomenclature_category_id', 'image', 'base_price', 'unit'];

    public function nomenclatureCategory()
    {
        return $this->belongsTo(NomenclatureCategory::class, 'nomenclature_category_id');
    }
}
