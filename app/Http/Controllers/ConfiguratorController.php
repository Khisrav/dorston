<?php
namespace App\Http\Controllers;

use App\Models\DoorCombination;
use App\Models\DoorModel;
use App\Models\Furniture;
use App\Models\Nomenclature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguratorController extends Controller
{
    private static function mapFurniture(Furniture $f): array
    {
        return [
            'id'                                    => $f->id,
            'title'                                 => $f->title,
            'preview_image'                         => $f->preview_image,
            'furniture_type'                        => $f->type,
            'shape'                                 => $f->shape,
            'color'                                 => $f->color,
            'primary_cylindrical_lock_cover_image'  => $f->primary_cylindrical_lock_cover_image,
            'primary_lever_lock_cover_image'        => $f->primary_lever_lock_cover_image,
            'secondary_cylindrical_lock_cover_image'=> $f->secondary_cylindrical_lock_cover_image,
            'secondary_lever_lock_cover_image'      => $f->secondary_lever_lock_cover_image,
            'peephole_cover_image'                  => $f->peephole_cover_image,
            'night_latch_turner_cover_image'        => $f->night_latch_turner_cover_image,
            'cylinder_rod_cover_image'              => $f->cylinder_rod_cover_image,
            'handle_cover_image'                    => $f->handle_cover_image,
            'primary_cylindrical_lock_id'           => $f->primary_cylindrical_lock_id,
            'primary_lever_lock_id'                 => $f->primary_lever_lock_id,
            'secondary_cylindrical_lock_id'         => $f->secondary_cylindrical_lock_id,
            'secondary_lever_lock_id'               => $f->secondary_lever_lock_id,
            'peephole_id'                           => $f->peephole_id,
            'night_latch_turner_id'                 => $f->night_latch_turner_id,
            'cylinder_rod_id'                       => $f->cylinder_rod_id,
            'handle_id'                             => $f->handle_id,
            'primary_cylindrical_lock_price'        => $f->cylindricalLock?->base_price,
            'primary_lever_lock_price'              => $f->leverLock?->base_price,
            'secondary_cylindrical_lock_price'      => $f->secondaryCylindricalLock?->base_price,
            'secondary_lever_lock_price'            => $f->secondaryLeverLock?->base_price,
            'peephole_price'                        => $f->peephole?->base_price,
            'night_latch_turner_price'              => $f->nightLatchTurner?->base_price,
            'cylinder_rod_price'                    => $f->cylinderRod?->base_price,
            'handle_price'                          => $f->handle?->base_price,
        ];
    }

    public function index()
    {
        return Inertia::render('configurator/Index');
    }

    public function termo()
    {
        return Inertia::render('configurator/Termo', [
            'paints' => Nomenclature::where('nomenclature_category_id', 2)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'doorModels' => DoorModel::where('type', 'interior')
                ->orWhere(function ($query) {
                    $query->where('type', 'exterior')
                        ->where('is_thermally_resistant', true);
                })
                ->get(),
            'filmColors' => Nomenclature::where('nomenclature_category_id', 13)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'furnitures' => Furniture::with([
                'cylindricalLock:id,base_price',
                'leverLock:id,base_price',
                'secondaryCylindricalLock:id,base_price',
                'secondaryLeverLock:id,base_price',
                'peephole:id,base_price',
                'nightLatchTurner:id,base_price',
                'cylinderRod:id,base_price',
                'handle:id,base_price'
            ])->get()->map(fn ($f) => self::mapFurniture($f)),
            'locks' => [
                'primary' => Nomenclature::where('tag', 'primary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->with('nomenclatureProperties')
                    ->get(),
                'secondary' => Nomenclature::where('tag', 'secondary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->with('nomenclatureProperties')
                    ->get(),
            ],
            'cylinders' => Nomenclature::where('nomenclature_category_id', 5)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'handles' => Nomenclature::where('nomenclature_category_id', 6)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'pricing' => Nomenclature::whereIn('nomenclature_category_id', [1, 4, 7, 9, 14, 15, 22])
                ->pluck('base_price', 'name'),
        ]);
    }

    public function termoModular()
    {
        return Inertia::render('configurator/TermoModular');
    }

    public function apartment(Request $request)
    {
        return Inertia::render('configurator/Apartment', [
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
                'secondaryCylindricalLock:id,base_price',
                'secondaryLeverLock:id,base_price',
                'peephole:id,base_price',
                'nightLatchTurner:id,base_price',
                'cylinderRod:id,base_price',
                'handle:id,base_price'
            ])->get()->map(fn ($f) => self::mapFurniture($f)),
            'locks' => [
                'primary' => Nomenclature::where('tag', 'primary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->with('nomenclatureProperties')
                    ->get(),
                'secondary' => Nomenclature::where('tag', 'secondary-lock')
                    ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id', 'properties')
                    ->with('nomenclatureProperties')
                    ->get(),
            ],
            'cylinders' => Nomenclature::where('nomenclature_category_id', 5)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'handles' => Nomenclature::where('nomenclature_category_id', 6)
                ->select('id', 'name', 'base_price', 'unit', 'image', 'nomenclature_category_id')
                ->get(),
            'doorCombinationImages' => Inertia::lazy(function () use ($request) {
                $modelIds = array_filter(array_map('intval', (array) $request->input('door_model_ids', [])));

                if (empty($modelIds)) {
                    return [];
                }

                return DoorCombination::whereIn('door_model_id', $modelIds)
                    ->select('id', 'image', 'img_purpose as purpose', 'door_model_id', 'film_color_id')
                    ->get();
            }),
            'pricing' => Nomenclature::whereIn('nomenclature_category_id', [1, 4, 7, 9, 14, 15, 22])
                ->pluck('base_price', 'name'),
        ]);
    }
}
