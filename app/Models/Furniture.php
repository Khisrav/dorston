<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Furniture extends Model
{
    protected $table = 'furnitures';
    
    protected $fillable = [
        'type',
        'preview_image',
        'title',
        'shape',
        'color',
        'exterior_primary_cylindrical_lock_cover_image',
        'interior_primary_cylindrical_lock_cover_image',
        'exterior_primary_lever_lock_cover_image',
        'interior_primary_lever_lock_cover_image',
        'exterior_secondary_cylindrical_lock_cover_image',
        'interior_secondary_cylindrical_lock_cover_image',
        'exterior_secondary_lever_lock_cover_image',
        'interior_secondary_lever_lock_cover_image',
        'peephole_cover_image',
        'side_peephole_cover_image',
        'center_peephole_cover_image',
        'night_latch_turner_cover_image',
        'cylinder_rod_cover_image',
        'handle_cover_image',
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
