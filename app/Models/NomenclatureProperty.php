<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NomenclatureProperty extends Model
{
    protected $fillable = ['nomenclature_id', 'property_name', 'property_value'];

    public function nomenclature(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'nomenclature_id');
    }
}
