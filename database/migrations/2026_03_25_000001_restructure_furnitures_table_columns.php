<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Note: we keep `cylinder_rod_cover_image` as-is for now because the current
        // door visualizer relies on it and there is no cylinder rod image in the
        // related nomenclature records.

        // 1) preview_image -> preview
        if (Schema::hasColumn('furnitures', 'preview_image') && !Schema::hasColumn('furnitures', 'preview')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('preview_image', 'preview');
            });
        }

        // 2) Lock cover images -> *_image (new naming)
        $renames = [
            'exterior_primary_cylindrical_lock_cover_image' => 'primary_exterior_cylindrical_lock_image',
            'interior_primary_cylindrical_lock_cover_image' => 'primary_interior_cylindrical_lock_image',
            'exterior_primary_lever_lock_cover_image'       => 'primary_exterior_lever_lock_image',
            'interior_primary_lever_lock_cover_image'       => 'primary_interior_lever_lock_image',

            'exterior_secondary_cylindrical_lock_cover_image' => 'secondary_exterior_cylindrical_lock_image',
            'interior_secondary_cylindrical_lock_cover_image' => 'secondary_interior_cylindrical_lock_image',
            'exterior_secondary_lever_lock_cover_image'       => 'secondary_exterior_lever_lock_image',
            'interior_secondary_lever_lock_cover_image'       => 'secondary_interior_lever_lock_image',
        ];

        foreach ($renames as $from => $to) {
            if (Schema::hasColumn('furnitures', $from) && !Schema::hasColumn('furnitures', $to)) {
                Schema::table('furnitures', function (Blueprint $table) use ($from, $to) {
                    $table->renameColumn($from, $to);
                });
            }
        }

        // 3) handle_cover_image -> handle_exterior_image + add handle_interior_image
        if (Schema::hasColumn('furnitures', 'handle_cover_image') && !Schema::hasColumn('furnitures', 'handle_exterior_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('handle_cover_image', 'handle_exterior_image');
            });
        }

        if (!Schema::hasColumn('furnitures', 'handle_interior_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->string('handle_interior_image')->nullable()->after('handle_exterior_image');
            });
        }

        // Fill interior handle image with whatever we had previously.
        if (Schema::hasColumn('furnitures', 'handle_exterior_image')) {
            DB::table('furnitures')->update([
                'handle_interior_image' => DB::raw('handle_exterior_image'),
            ]);
        }

        // 4) peephole_*_cover_image -> peephole_*_image (exterior + interior)
        if (!Schema::hasColumn('furnitures', 'peephole_exterior_center_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->string('peephole_exterior_center_image')->nullable();
                $table->string('peephole_exterior_side_image')->nullable();
                $table->string('peephole_interior_center_image')->nullable();
                $table->string('peephole_interior_side_image')->nullable();
            });
        }

        // Populate new peephole columns from the old ones.
        // Center fallback: center_peephole_cover_image -> peephole_cover_image
        // Side fallback: side_peephole_cover_image -> peephole_cover_image
        $centerExpr = "COALESCE(center_peephole_cover_image, peephole_cover_image)";
        $sideExpr = "COALESCE(side_peephole_cover_image, peephole_cover_image)";
        if (
            Schema::hasColumn('furnitures', 'center_peephole_cover_image') ||
            Schema::hasColumn('furnitures', 'peephole_cover_image') ||
            Schema::hasColumn('furnitures', 'side_peephole_cover_image')
        ) {
            DB::table('furnitures')->update([
                'peephole_exterior_center_image' => DB::raw($centerExpr),
                'peephole_interior_center_image' => DB::raw($centerExpr),
                'peephole_exterior_side_image' => DB::raw($sideExpr),
                'peephole_interior_side_image' => DB::raw($sideExpr),
            ]);
        }

        // Drop old peephole columns if they exist.
        Schema::table('furnitures', function (Blueprint $table) {
            if (Schema::hasColumn('furnitures', 'peephole_cover_image')) {
                $table->dropColumn('peephole_cover_image');
            }
            if (Schema::hasColumn('furnitures', 'side_peephole_cover_image')) {
                $table->dropColumn('side_peephole_cover_image');
            }
            if (Schema::hasColumn('furnitures', 'center_peephole_cover_image')) {
                $table->dropColumn('center_peephole_cover_image');
            }
        });

        // 5) night_latch_turner_cover_image -> night_latch_turner_image
        if (Schema::hasColumn('furnitures', 'night_latch_turner_cover_image') && !Schema::hasColumn('furnitures', 'night_latch_turner_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('night_latch_turner_cover_image', 'night_latch_turner_image');
            });
        }
    }

    public function down(): void
    {
        // Best-effort rollback (reverse renames/adds).
        // Note: we do not attempt to restore `cylinder_rod_cover_image` in this rollback.

        // preview <- preview_image
        if (Schema::hasColumn('furnitures', 'preview') && !Schema::hasColumn('furnitures', 'preview_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('preview', 'preview_image');
            });
        }

        // lock images
        $renames = [
            'primary_exterior_cylindrical_lock_image' => 'exterior_primary_cylindrical_lock_cover_image',
            'primary_interior_cylindrical_lock_image' => 'interior_primary_cylindrical_lock_cover_image',
            'primary_exterior_lever_lock_image'       => 'exterior_primary_lever_lock_cover_image',
            'primary_interior_lever_lock_image'       => 'interior_primary_lever_lock_cover_image',

            'secondary_exterior_cylindrical_lock_image' => 'exterior_secondary_cylindrical_lock_cover_image',
            'secondary_interior_cylindrical_lock_image' => 'interior_secondary_cylindrical_lock_cover_image',
            'secondary_exterior_lever_lock_image'       => 'exterior_secondary_lever_lock_cover_image',
            'secondary_interior_lever_lock_image'       => 'interior_secondary_lever_lock_cover_image',
        ];

        foreach ($renames as $from => $to) {
            if (Schema::hasColumn('furnitures', $from) && !Schema::hasColumn('furnitures', $to)) {
                Schema::table('furnitures', function (Blueprint $table) use ($from, $to) {
                    $table->renameColumn($from, $to);
                });
            }
        }

        // handle: keep exterior and revert to handle_cover_image
        if (Schema::hasColumn('furnitures', 'handle_exterior_image') && !Schema::hasColumn('furnitures', 'handle_cover_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('handle_exterior_image', 'handle_cover_image');
            });
        }

        // peephole: drop new columns, restore old ones (best-effort)
        if (Schema::hasColumn('furnitures', 'peephole_exterior_center_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->string('peephole_cover_image')->nullable();
                $table->string('side_peephole_cover_image')->nullable();
                $table->string('center_peephole_cover_image')->nullable();
            });

            DB::table('furnitures')->update([
                'peephole_cover_image' => DB::raw('peephole_exterior_center_image'),
                'side_peephole_cover_image' => DB::raw('peephole_exterior_side_image'),
                'center_peephole_cover_image' => DB::raw('peephole_exterior_center_image'),
            ]);

            Schema::table('furnitures', function (Blueprint $table) {
                $table->dropColumn([
                    'peephole_exterior_center_image',
                    'peephole_exterior_side_image',
                    'peephole_interior_center_image',
                    'peephole_interior_side_image',
                ]);
            });
        }

        // night latch
        if (Schema::hasColumn('furnitures', 'night_latch_turner_image') && !Schema::hasColumn('furnitures', 'night_latch_turner_cover_image')) {
            Schema::table('furnitures', function (Blueprint $table) {
                $table->renameColumn('night_latch_turner_image', 'night_latch_turner_cover_image');
            });
        }
    }
};

