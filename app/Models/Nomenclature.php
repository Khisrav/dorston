<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nomenclature extends Model
{
    protected $fillable = ['name', 'nomenclature_category_id', 'image', 'base_price', 'unit', 'tag', 'properties'];

    protected $casts = [
        'properties' => 'array',
    ];

    public function nomenclatureCategory(): BelongsTo
    {
        return $this->belongsTo(NomenclatureCategory::class, 'nomenclature_category_id');
    }

    public function nomenclatureProperties(): HasMany
    {
        return $this->hasMany(NomenclatureProperty::class, 'nomenclature_id');
    }
}
