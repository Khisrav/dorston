<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NomenclatureCategory extends Model
{
    protected $fillable = ['name'];

    public function nomenclatures()
    {
        return $this->hasMany(Nomenclature::class);
    }
}
