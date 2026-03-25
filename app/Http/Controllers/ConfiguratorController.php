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
        // During deployment/migration there can be a short period where either the
        // old or the new columns exist. These fallbacks keep the configurator working.
        $preview = $f->preview ?? $f->preview_image;

        $primaryExteriorCyl = $f->primary_exterior_cylindrical_lock_image ?? $f->exterior_primary_cylindrical_lock_cover_image;
        $primaryInteriorCyl = $f->primary_interior_cylindrical_lock_image ?? $f->interior_primary_cylindrical_lock_cover_image;
        $primaryExteriorLev = $f->primary_exterior_lever_lock_image ?? $f->exterior_primary_lever_lock_cover_image;
        $primaryInteriorLev = $f->primary_interior_lever_lock_image ?? $f->interior_primary_lever_lock_cover_image;

        $secondaryExteriorCyl = $f->secondary_exterior_cylindrical_lock_image ?? $f->exterior_secondary_cylindrical_lock_cover_image;
        $secondaryInteriorCyl = $f->secondary_interior_cylindrical_lock_image ?? $f->interior_secondary_cylindrical_lock_cover_image;
        $secondaryExteriorLev = $f->secondary_exterior_lever_lock_image ?? $f->exterior_secondary_lever_lock_cover_image;
        $secondaryInteriorLev = $f->secondary_interior_lever_lock_image ?? $f->interior_secondary_lever_lock_cover_image;

        $handleExterior = $f->handle_exterior_image ?? $f->handle_cover_image;
        $handleInterior = $f->handle_interior_image ?? $f->handle_exterior_image ?? $f->handle_cover_image;

        $peepholeExteriorCenter = $f->peephole_exterior_center_image
            ?? $f->center_peephole_cover_image
            ?? $f->peephole_cover_image;
        $peepholeExteriorSide = $f->peephole_exterior_side_image ?? $f->side_peephole_cover_image;
        $peepholeInteriorCenter = $f->peephole_interior_center_image ?? $peepholeExteriorCenter;
        $peepholeInteriorSide = $f->peephole_interior_side_image ?? $peepholeExteriorSide;

        $nightLatchTurnerImage = $f->night_latch_turner_image ?? $f->night_latch_turner_cover_image;

        return [
            'id'                                    => $f->id,
            'title'                                 => $f->title,
            // New naming (client spec)
            'preview'                               => $preview,
            // Backward-compat (frontend pieces still using the old key)
            'preview_image'                        => $preview,
            'furniture_type'                        => $f->type,
            'shape'                                 => $f->shape,
            'color'                                 => $f->color,

            // New image fields (client spec)
            'handle_exterior_image'                => $handleExterior,
            'handle_interior_image'                => $handleInterior,
            'peephole_exterior_center_image'      => $peepholeExteriorCenter,
            'peephole_exterior_side_image'        => $peepholeExteriorSide,
            'peephole_interior_center_image'     => $peepholeInteriorCenter,
            'peephole_interior_side_image'       => $peepholeInteriorSide,
            'night_latch_turner_image'            => $nightLatchTurnerImage,

            'primary_exterior_cylindrical_lock_image' => $primaryExteriorCyl,
            'primary_exterior_lever_lock_image'      => $primaryExteriorLev,
            'primary_interior_cylindrical_lock_image' => $primaryInteriorCyl,
            'primary_interior_lever_lock_image'      => $primaryInteriorLev,

            'secondary_exterior_cylindrical_lock_image' => $secondaryExteriorCyl,
            'secondary_exterior_lever_lock_image'       => $secondaryExteriorLev,
            'secondary_interior_cylindrical_lock_image' => $secondaryInteriorCyl,
            'secondary_interior_lever_lock_image'       => $secondaryInteriorLev,

            // Legacy image fields required by the current door visualizer
            'exterior_primary_cylindrical_lock_cover_image' => $primaryExteriorCyl,
            'interior_primary_cylindrical_lock_cover_image' => $primaryInteriorCyl,
            'exterior_primary_lever_lock_cover_image'       => $primaryExteriorLev,
            'interior_primary_lever_lock_cover_image'       => $primaryInteriorLev,
            'exterior_secondary_cylindrical_lock_cover_image' => $secondaryExteriorCyl,
            'interior_secondary_cylindrical_lock_cover_image' => $secondaryInteriorCyl,
            'exterior_secondary_lever_lock_cover_image'       => $secondaryExteriorLev,
            'interior_secondary_lever_lock_cover_image'       => $secondaryInteriorLev,

            // Peephole: visualizer uses a single set of images and relies on mirroring.
            'peephole_cover_image'                   => $peepholeExteriorCenter,
            'side_peephole_cover_image'             => $peepholeExteriorSide,
            'center_peephole_cover_image'           => $peepholeExteriorCenter,

            'night_latch_turner_cover_image'        => $nightLatchTurnerImage,
            'cylinder_rod_cover_image'              => $f->cylinder_rod_cover_image,
            'handle_cover_image'                    => $handleExterior,

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
