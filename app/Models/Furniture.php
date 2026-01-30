<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Furniture extends Model
{
    protected $table = 'furnitures';
    
    protected $fillable = [
        'shape', 
        'color', 
        'cylindrical_lock_cover_image', 
        'lever_lock_cover_image', 
        'peephole_cover_image', 
        'night_latch_turner_cover_image', 
        'cylinder_rod_cover_image', 
        'handle_cover_image', 
        'cylindrical_lock_id', 
        'lever_lock_id', 
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
        return $this->belongsTo(Nomenclature::class, 'cylindrical_lock_id');
    }

    public function leverLock(): BelongsTo
    {
        return $this->belongsTo(Nomenclature::class, 'lever_lock_id');
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
