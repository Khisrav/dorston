import { defineStore } from 'pinia';
import { ref, computed, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useTermoDoorCalc } from './useTermoDoorCalc';
import { DoorCombinationImage, Furniture } from '@/types/configurator';

export const useTermoDoorVisual = defineStore('termoDoorVisual', () => {
    const doorCalcStore = useTermoDoorCalc();

    /** Design resolution — matches combination render art dimensions. */
    const stageWidth = 960;
    const stageHeight = 2050;

    const doorCombinationImages = ref<DoorCombinationImage[]>([]);
    const isCombinationsLoading = ref(false);

    const interiorCasingImages = ref<string[]>([
        'Наличник внутренний_Муар чёрный 9005.png',
        'Наличник внутренний_Муар металлик чёрный.png',
        'Наличник внутренний_Антик бронза.png',
        'Наличник внутренний_Антик медь.png',   
        'Наличник внутренний_Антик серебро.png',    
        'Наличник внутренний_Антик синий.png',
        'Наличник внутренний_Белая шагрень.png',
        'Наличник внутренний_Букле опал.png',
        'Наличник внутренний_Букле серый.png',
        'Наличник внутренний_Букле чёрный.png',
        'Наличник внутренний_Золото на белом.png',
        'Наличник внутренний_Муар 1019.png',
        'Наличник внутренний_Муар 6028.png',
        'Наличник внутренний_Муар 7021.png',
        'Наличник внутренний_Муар 7024.png',
        'Наличник внутренний_Муар 9003.png',
        'Наличник внутренний_Муар металлик 8019.png',
        'Наличник внутренний_Муар металлик бронзовый.png',
        'Наличник внутренний_Муар металлик серый.png',
        'Наличник внутренний_Муар металлик синий.png',
    ])

    /**
     * For exterior layers: color dimension is the powder-paint primary color
     * (metalPainting.primaryColor), stored in film_color_id by the seeder.
     * For interior layers: color dimension is a regular film color (primaryTexture).
     */
    function findComboUrl(
        purpose: DoorCombinationImage['purpose'],
        modelId: number | undefined,
        colorId: number | undefined,
    ): string {
        if (!modelId) return '';
        const combo = doorCombinationImages.value.find(
            (img) =>
                img.purpose === purpose &&
                img.door_model_id === modelId &&
                (!colorId || colorId === -1 || img.film_color_id === colorId),
        );
        return combo ? `/storage/${combo.image}` : '';
    }

    // ── Exterior image URLs ───────────────────────────────────────────────────

    const casingUrl = computed(() =>
        findComboUrl(
            'Наличник',
            doorCalcStore.doorConfig.exterior.panelModel,
            doorCalcStore.doorConfig.metalPainting.primaryColor,
        ),
    );

    const doorUrl = computed(() =>
        findComboUrl(
            'Полотно',
            doorCalcStore.doorConfig.exterior.panelModel,
            doorCalcStore.doorConfig.metalPainting.primaryColor,
        ),
    );

    const hingeUrl = computed(() =>
        findComboUrl(
            'Петли',
            doorCalcStore.doorConfig.exterior.panelModel,
            doorCalcStore.doorConfig.metalPainting.primaryColor,
        ),
    );

    // ── Interior image URLs ───────────────────────────────────────────────────

    const interiorDoorUrl = computed(() =>
        findComboUrl(
            'Полотно',
            doorCalcStore.doorConfig.interior.panelModel,
            doorCalcStore.doorConfig.interior.primaryTexture,
        ),
    );

    const interiorCasingUrl = computed(() => {
        const paintName = doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.primaryColor ?? -1)?.name;
        if (!paintName) return '';
        return `/assets/casings/Наличник внутренний_${paintName}.png`;
    });

    // ── Konva image refs ──────────────────────────────────────────────────────

    const [casingImage] = useImage(casingUrl);
    const [doorImage] = useImage(doorUrl);
    const [hingeImage] = useImage(hingeUrl);
    const [interiorDoorImage] = useImage(interiorDoorUrl);
    // const [interiorCasingImage] = useImage('/assets/temp/Короб.png');
    const [interiorCasingImage] = useImage(interiorCasingUrl);

    // ── Furniture image URL helper ────────────────────────────────────────────

    function makeFurnitureUrl(
        getPath: (f: Furniture) => string | null | undefined,
        condition?: () => boolean,
    ): ComputedRef<string> {
        return computed(() => {
            if (condition && !condition()) return '';
            const furniture = doorCalcStore.getFurnitureSet(doorCalcStore.doorConfig.furniture.furnitureSetId ?? -1);
            if (!furniture) return '';
            const path = getPath(furniture);
            return path ? `/storage/${path}` : '';
        });
    }

    // ── Exterior furniture URLs ───────────────────────────────────────────────

    const furnitureExteriorPrimaryCylindricalLockUrl = makeFurnitureUrl(f =>
        f.primary_exterior_cylindrical_lock_image ?? f.exterior_primary_cylindrical_lock_cover_image
    );
    const furnitureExteriorPrimaryLeverLockUrl = makeFurnitureUrl(f =>
        f.primary_exterior_lever_lock_image ?? f.exterior_primary_lever_lock_cover_image
    );
    const furnitureExteriorSecondaryCylindricalLockUrl = makeFurnitureUrl(
        f => f.secondary_exterior_cylindrical_lock_image ?? f.exterior_secondary_cylindrical_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureExteriorSecondaryLeverLockUrl = makeFurnitureUrl(
        f => f.secondary_exterior_lever_lock_image ?? f.exterior_secondary_lever_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureExteriorPeepholeUrl = makeFurnitureUrl(
        f => {
            const pos = doorCalcStore.doorConfig.peepholePosition;
            if (pos === 'Side') return f.peephole_exterior_side_image ?? f.side_peephole_cover_image;
            if (pos === 'Center') return f.peephole_exterior_center_image ?? f.center_peephole_cover_image;
            return f.peephole_exterior_center_image ?? f.peephole_cover_image;
        },
        () => !!doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None',
    );
    const furnitureExteriorHandleUrl = makeFurnitureUrl(f =>
        f.handle_exterior_image ?? f.handle_cover_image
    );

    // ── Interior furniture URLs ───────────────────────────────────────────────

    const furnitureInteriorPrimaryCylindricalLockUrl = makeFurnitureUrl(f =>
        f.primary_interior_cylindrical_lock_image ?? f.interior_primary_cylindrical_lock_cover_image
    );
    const furnitureInteriorPrimaryLeverLockUrl = makeFurnitureUrl(f =>
        f.primary_interior_lever_lock_image ?? f.interior_primary_lever_lock_cover_image
    );
    const furnitureInteriorSecondaryCylindricalLockUrl = makeFurnitureUrl(
        f => f.secondary_interior_cylindrical_lock_image ?? f.interior_secondary_cylindrical_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureInteriorSecondaryLeverLockUrl = makeFurnitureUrl(
        f => f.secondary_interior_lever_lock_image ?? f.interior_secondary_lever_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureInteriorPeepholeUrl = makeFurnitureUrl(
        f => {
            const pos = doorCalcStore.doorConfig.peepholePosition;
            if (pos === 'Side') return f.peephole_interior_side_image ?? f.side_peephole_cover_image;
            if (pos === 'Center') return f.peephole_interior_center_image ?? f.center_peephole_cover_image;
            return f.peephole_interior_center_image ?? f.peephole_cover_image;
        },
        () => !!doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None',
    );
    const furnitureNightLatchTurnerUrl = makeFurnitureUrl(
        f => f.night_latch_turner_image ?? f.night_latch_turner_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasNightLatchTurner,
    );
    const furnitureCylinderRodUrl = makeFurnitureUrl(f => f.cylinder_rod_cover_image);
    const furnitureInteriorHandleUrl = makeFurnitureUrl(f =>
        f.handle_interior_image ?? f.handle_exterior_image ?? f.handle_cover_image
    );

    // ── Furniture Konva image refs ────────────────────────────────────────────

    const [furnitureExteriorPrimaryCylindricalLockImage] = useImage(furnitureExteriorPrimaryCylindricalLockUrl);
    const [furnitureExteriorPrimaryLeverLockImage] = useImage(furnitureExteriorPrimaryLeverLockUrl);
    const [furnitureExteriorSecondaryCylindricalLockImage] = useImage(furnitureExteriorSecondaryCylindricalLockUrl);
    const [furnitureExteriorSecondaryLeverLockImage] = useImage(furnitureExteriorSecondaryLeverLockUrl);
    const [furnitureExteriorPeepholeImage] = useImage(furnitureExteriorPeepholeUrl);
    const [furnitureExteriorHandleImage] = useImage(furnitureExteriorHandleUrl);

    const [furnitureInteriorPrimaryCylindricalLockImage] = useImage(furnitureInteriorPrimaryCylindricalLockUrl);
    const [furnitureInteriorPrimaryLeverLockImage] = useImage(furnitureInteriorPrimaryLeverLockUrl);
    const [furnitureInteriorSecondaryCylindricalLockImage] = useImage(furnitureInteriorSecondaryCylindricalLockUrl);
    const [furnitureInteriorSecondaryLeverLockImage] = useImage(furnitureInteriorSecondaryLeverLockUrl);
    const [furnitureInteriorPeepholeImage] = useImage(furnitureInteriorPeepholeUrl);
    const [furnitureNightLatchTurnerImage] = useImage(furnitureNightLatchTurnerUrl);
    const [furnitureCylinderRodImage] = useImage(furnitureCylinderRodUrl);
    const [furnitureInteriorHandleImage] = useImage(furnitureInteriorHandleUrl);

    // ── Handle-side flip configs ──────────────────────────────────────────────
    // Images authored handle-right; exterior flips when handle is Left.
    // Interior is always the mirror of exterior (sides swap when standing inside).

    function makeFlipConfig(flipped: boolean) {
        return {
            x: flipped ? stageWidth : 0,
            y: 0,
            width: stageWidth,
            height: stageHeight,
            scaleX: flipped ? -1 : 1,
        };
    }

    const exteriorImageConfig = computed(() =>
        makeFlipConfig(doorCalcStore.doorConfig.handleSide === 'Left'),
    );

    const interiorImageConfig = computed(() =>
        makeFlipConfig(doorCalcStore.doorConfig.handleSide !== 'Right'),
    );

    const exteriorPeepholeImageConfig = computed(() => {
        const handleSide = doorCalcStore.doorConfig.doorHandleSide;
        
        if (doorCalcStore.doorConfig.peepholePosition === 'Side') {
            return {
                x: ((handleSide === 'Right' ? 313 : -313) / stageWidth) * stageWidth,
                y: 0,
                width: stageWidth,
                height: stageHeight,
            };
        } else {
            return {
                x: 0,
                y: 0,
                width: stageWidth,
                height: stageHeight,
            };
        }
    });

    const interiorPeepholeImageConfig = computed(() => {
        const handleSide = doorCalcStore.doorConfig.doorHandleSide;
        
        if (doorCalcStore.doorConfig.peepholePosition === 'Side') {
            return {
                x: ((handleSide === 'Right' ? -313 : 313) / stageWidth) * stageWidth,
                y: 0,
                width: stageWidth,
                height: stageHeight,
            };
        } else {
            return {
                x: 0,
                y: 0,
                width: stageWidth,
                height: stageHeight,
            };
        }
    });

    // ── Background rect ───────────────────────────────────────────────────────

    const backgroundConfig = computed(() => ({
        x: (stageWidth * 0.1) / 2,
        y: (stageHeight * 0.01) / 2,
        width: stageWidth * 0.9,
        height: stageHeight * 0.99,
        fill: 'black',
    }));

    return {
        stageWidth,
        stageHeight,
        doorCombinationImages,
        isCombinationsLoading,

        // Exterior door images
        casingImage,
        doorImage,
        hingeImage,

        // Interior door images
        interiorDoorImage,
        interiorCasingImage,

        // Exterior furniture images
        furnitureExteriorPrimaryCylindricalLockImage,
        furnitureExteriorPrimaryLeverLockImage,
        furnitureExteriorSecondaryCylindricalLockImage,
        furnitureExteriorSecondaryLeverLockImage,
        furnitureExteriorPeepholeImage,
        furnitureExteriorHandleImage,

        // Interior furniture images
        furnitureInteriorPrimaryCylindricalLockImage,
        furnitureInteriorPrimaryLeverLockImage,
        furnitureInteriorSecondaryCylindricalLockImage,
        furnitureInteriorSecondaryLeverLockImage,
        furnitureInteriorPeepholeImage,
        furnitureNightLatchTurnerImage,
        furnitureCylinderRodImage,
        furnitureInteriorHandleImage,

        // Configs
        exteriorImageConfig,
        interiorImageConfig,
        exteriorPeepholeImageConfig,
        interiorPeepholeImageConfig,
        backgroundConfig,
    };
});
