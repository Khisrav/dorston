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
            'furnitures' => Furniture::all(),
            'locks' => [
                'primary' => Nomenclature::where('tag', 'primary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->get(),
                'secondary' => Nomenclature::where('tag', 'secondary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->get(),
            ],
            
            'handles' => Nomenclature::where('nomenclature_category_id', 6)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
        ]);
    }
}
