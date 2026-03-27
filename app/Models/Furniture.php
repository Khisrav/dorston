<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Furniture extends Model
{
    protected $table = 'furnitures';

    protected $fillable = [
        'type',
        'preview',
        'peephole_preview',
        'title',
        'shape',
        'color',
        'primary_exterior_cylindrical_lock_image',
        'primary_interior_cylindrical_lock_image',
        'primary_exterior_lever_lock_image',
        'primary_interior_lever_lock_image',
        'secondary_exterior_cylindrical_lock_image',
        'secondary_interior_cylindrical_lock_image',
        'secondary_exterior_lever_lock_image',
        'secondary_interior_lever_lock_image',
        'peephole_exterior_center_image',
        'peephole_exterior_side_image',
        'peephole_interior_center_image',
        'peephole_interior_side_image',
        'night_latch_turner_image',
        'cylinder_rod_cover_image',
        'handle_exterior_image',
        'handle_interior_image',
        'primary_cylindrical_lock_id',
        'primary_lever_lock_id',
        'secondary_cylindrical_lock_id',
        'secondary_lever_lock_id',
        'peephole_id',
        'night_latch_turner_id',
        'cylinder_rod_id',
        'handle_id',
    ];

    /**
     * Relationships
     */
    public function cylindricalLock(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'primary_cylindrical_lock_id');
    }

    public function leverLock(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'primary_lever_lock_id');
    }

    public function secondaryCylindricalLock(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'secondary_cylindrical_lock_id');
    }

    public function secondaryLeverLock(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'secondary_lever_lock_id');
    }

    public function peephole(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'peephole_id');
    }

    public function nightLatchTurner(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'night_latch_turner_id');
    }

    public function cylinderRod(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'cylinder_rod_id');
    }

    public function handle(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'handle_id');
    }
}
