<?php

namespace App\Http\Controllers;

use App\Models\DoorModel;
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
            'doorModels' => DoorModel::select('id', 'name', 'image', 'type', 'is_thermally_resistant')
                ->get(),
        ]);
    }
}
