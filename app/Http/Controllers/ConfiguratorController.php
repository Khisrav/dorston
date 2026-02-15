<?php

namespace App\Http\Controllers;

use App\Models\DoorModel;
use App\Models\Furniture;
use App\Models\Nomenclature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguratorController extends Controller
{
    public function index()
    {
        return Inertia::render('configurator/Index', [
            'paints' => Nomenclature::where('nomenclature_category_id', 2)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'doorModels' => DoorModel::all(),
            'filmColors' => Nomenclature::where('nomenclature_category_id', 13)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            // 'furnitures' => Nomenclature::where('nomenclature_category_id', 3)
            //     ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
            //     ->get(),
            'furnitures' => Furniture::with([
                'cylindricalLock:id,base_price',
                'leverLock:id,base_price',
                'peephole:id,base_price',
                'nightLatchTurner:id,base_price',
                'cylinderRod:id,base_price',
                'handle:id,base_price'
            ])->get()->map(function ($furniture) {
                return [
                    'id' => $furniture->id,
                    'shape' => $furniture->shape,
                    'color' => $furniture->color,
                    'cylindrical_lock_cover_image' => $furniture->cylindrical_lock_cover_image,
                    'lever_lock_cover_image' => $furniture->lever_lock_cover_image,
                    'peephole_cover_image' => $furniture->peephole_cover_image,
                    'night_latch_turner_cover_image' => $furniture->night_latch_turner_cover_image,
                    'cylinder_rod_cover_image' => $furniture->cylinder_rod_cover_image,
                    'handle_cover_image' => $furniture->handle_cover_image,
                    'cylindrical_lock_id' => $furniture->cylindrical_lock_id,
                    'lever_lock_id' => $furniture->lever_lock_id,
                    'peephole_id' => $furniture->peephole_id,
                    'night_latch_turner_id' => $furniture->night_latch_turner_id,
                    'cylinder_rod_id' => $furniture->cylinder_rod_id,
                    'handle_id' => $furniture->handle_id,
                    'cylindrical_lock_price' => $furniture->cylindricalLock?->base_price,
                    'lever_lock_price' => $furniture->leverLock?->base_price,
                    'peephole_price' => $furniture->peephole?->base_price,
                    'night_latch_turner_price' => $furniture->nightLatchTurner?->base_price,
                    'cylinder_rod_price' => $furniture->cylinderRod?->base_price,
                    'handle_price' => $furniture->handle?->base_price,
                    'created_at' => $furniture->created_at,
                    'updated_at' => $furniture->updated_at,
                ];
            }),
            'locks' => [
                'primary' => Nomenclature::where('tag', 'primary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->get(),
                'secondary' => Nomenclature::where('tag', 'secondary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->get(),
            ],
            'cylinders' => Nomenclature::where('nomenclature_category_id', 5)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'handles' => Nomenclature::where('nomenclature_category_id', 6)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
        ]);
    }
}
