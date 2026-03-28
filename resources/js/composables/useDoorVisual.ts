import { defineStore } from "pinia";
import { ref, computed, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";
import { DoorCombinationImage, Furniture } from "@/types/configurator";

export const useDoorVisual = defineStore('doorVisual', () => {
    const doorCalcStore = useDoorCalc();

    /** Design resolution for Konva — matches door art aspect ratio. */
    const doorDimensions = {
        width: 960,
        height: 2050,
    } as const;

    /**
     * Stage is always this size in pixels so layers composite at full quality.
     * DoorVisualizer scales the canvas with CSS to fit the layout (small on screen, sharp for PDF).
     */
    const stageWidth = doorDimensions.width;
    const stageHeight = doorDimensions.height;

    /** Paint IDs that have a matching `public/assets/casings/{id}.png` asset. */
    const interiorCasingPaintIds = new Set([
        192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 205, 208, 209, 210, 211, 212, 385, 386, 387,
    ]);

    const doorCombinationImages = ref<DoorCombinationImage[]>([]);
    const isCombinationsLoading = ref(false);

    /** @deprecated No-op — stage is always design resolution; CSS scales in the UI. */
    function setStageDimensions(_width: number, _height: number): void {
        void _width;
        void _height;
    }

    function findComboUrl(
        purpose: DoorCombinationImage['purpose'],
        modelId: number | undefined,
        filmColorId: number | undefined,
    ): string {
        if (!modelId) return '';
        const combo = doorCombinationImages.value.find(img =>
            img.purpose === purpose &&
            img.door_model_id === modelId &&
            (!filmColorId || img.film_color_id === filmColorId)
        );
        return combo ? `/storage/${combo.image}` : '';
    }

    // ── Exterior door URLs ────────────────────────────────────────────────────

    const exteriorCasingUrl = computed(() =>
        findComboUrl('Наличник', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.casingTexture)
    );
    const exteriorDoorUrl = computed(() =>
        findComboUrl('Полотно', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.primaryTexture)
    );
    const exteriorAdditionalCasingUrl = computed(() =>
        findComboUrl('Вставка наличника', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.casingTexture)
    );
    const exteriorAdditionalDoorUrl = computed(() =>
        findComboUrl('Вставка полотна', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.secondaryTexture)
    );
    const doorsillUrl = computed(() => {
        if (doorCalcStore.doorConfig.stainlessSteelDoorsill) {
            return '/assets/porog-exterior.webp';
        }
        return '';
    });

    // ── Interior door URLs ────────────────────────────────────────────────────

    const interiorDoorUrl = computed(() =>
        findComboUrl('Полотно', doorCalcStore.doorConfig.interior.panelModel, doorCalcStore.doorConfig.interior.primaryTexture)
    );
    const interiorCasingUrl = computed(() => {
        const paintId = doorCalcStore.doorConfig.metalPainting.primaryColor;
        if (paintId == null || paintId < 0 || !interiorCasingPaintIds.has(paintId)) return '';
        return `/assets/casings/${paintId}.png`;
    });
    const interiorDoorsillUrl = computed(() => {
        if (doorCalcStore.doorConfig.stainlessSteelDoorsill) {
            return '/assets/porog-interior.webp';
        }
        return '';
    });

    // ── Door image loading ────────────────────────────────────────────────────

    const [casingImage] = useImage(exteriorCasingUrl);
    const [doorImage] = useImage(exteriorDoorUrl);
    const [exteriorHingeImage] = useImage('/assets/temp/Петли.png');
    const [additionalCasingElementImage] = useImage(exteriorAdditionalCasingUrl);
    const [additionalDoorElementImage] = useImage(exteriorAdditionalDoorUrl);
    const [interiorDoorImage] = useImage(interiorDoorUrl);
    // const [interiorCasingImage] = useImage('/assets/temp/Короб.png');
    const [interiorCasingImage] = useImage(interiorCasingUrl);
    const [doorsillImage] = useImage(doorsillUrl);
    const [interiorDoorsillImage] = useImage(interiorDoorsillUrl);
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

    // ── Furniture image URLs ──────────────────────────────────────────────────

    // Locks (use new naming, keep legacy fallback)
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

    // Peephole: pick by position AND by stage (exterior vs interior)
    const furnitureExteriorPeepholeUrl = makeFurnitureUrl(
        f => {
            const pos = doorCalcStore.doorConfig.peepholePosition;
            if (pos === 'Side') return f.peephole_exterior_side_image ?? f.side_peephole_cover_image;
            if (pos === 'Center') return f.peephole_exterior_center_image ?? f.center_peephole_cover_image;
            return f.peephole_exterior_center_image ?? f.peephole_cover_image;
        },
        () => !!doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None',
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

    const furnitureExteriorHandleUrl = makeFurnitureUrl(f =>
        f.handle_exterior_image ?? f.handle_cover_image
    );
    const furnitureInteriorHandleUrl = makeFurnitureUrl(f =>
        f.handle_interior_image ?? f.handle_exterior_image ?? f.handle_cover_image
    );

    // ── Furniture image loading ───────────────────────────────────────────────

    const [furnitureExteriorPrimaryCylindricalLockImage] = useImage(furnitureExteriorPrimaryCylindricalLockUrl);
    const [furnitureExteriorPrimaryLeverLockImage] = useImage(furnitureExteriorPrimaryLeverLockUrl);
    const [furnitureExteriorSecondaryCylindricalLockImage] = useImage(furnitureExteriorSecondaryCylindricalLockUrl);
    const [furnitureExteriorSecondaryLeverLockImage] = useImage(furnitureExteriorSecondaryLeverLockUrl);

    const [furnitureInteriorPrimaryCylindricalLockImage] = useImage(furnitureInteriorPrimaryCylindricalLockUrl);
    const [furnitureInteriorPrimaryLeverLockImage] = useImage(furnitureInteriorPrimaryLeverLockUrl);
    const [furnitureInteriorSecondaryCylindricalLockImage] = useImage(furnitureInteriorSecondaryCylindricalLockUrl);
    const [furnitureInteriorSecondaryLeverLockImage] = useImage(furnitureInteriorSecondaryLeverLockUrl);

    const [furnitureExteriorPeepholeImage] = useImage(furnitureExteriorPeepholeUrl);
    const [furnitureInteriorPeepholeImage] = useImage(furnitureInteriorPeepholeUrl);
    const [furnitureNightLatchTurnerImage] = useImage(furnitureNightLatchTurnerUrl);
    const [furnitureCylinderRodImage] = useImage(furnitureCylinderRodUrl);
    const [furnitureExteriorHandleImage] = useImage(furnitureExteriorHandleUrl);
    const [furnitureInteriorHandleImage] = useImage(furnitureInteriorHandleUrl);

    // ── Handle-side flip configs ──────────────────────────────────────────────
    // Images are authored with the handle on the right side (from exterior).
    // Exterior: flip horizontally when doorHandleSide is 'Left'.
    // Interior: always the mirror of exterior (standing inside, sides swap).

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
        makeFlipConfig(doorCalcStore.doorConfig.doorHandleSide === 'Left')
    );

    const interiorImageConfig = computed(() =>
        makeFlipConfig(doorCalcStore.doorConfig.doorHandleSide !== 'Right')
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
    // ── Background rect config (symmetric — no flip needed) ──────────────────

    const backgroundConfig = computed(() => ({
        x: (stageWidth - stageWidth * 0.9) / 2,
        y: (stageHeight - stageHeight * 0.99) / 2,
        width: stageWidth * 0.9,
        height: stageHeight * 0.99,
        fill: 'black',
    }));

    return {
        stageWidth,
        stageHeight,
        doorDimensions,
        setStageDimensions,
        doorCombinationImages,
        isCombinationsLoading,

        // Door images
        casingImage,
        exteriorHingeImage,
        doorImage,
        additionalCasingElementImage,
        additionalDoorElementImage,
        interiorCasingImage,
        interiorDoorImage,
        doorsillImage,
        interiorDoorsillImage,
        // Furniture images — exterior
        furnitureExteriorPrimaryCylindricalLockImage,
        furnitureExteriorPrimaryLeverLockImage,
        furnitureExteriorSecondaryCylindricalLockImage,
        furnitureExteriorSecondaryLeverLockImage,

        // Furniture images — interior
        furnitureInteriorPrimaryCylindricalLockImage,
        furnitureInteriorPrimaryLeverLockImage,
        furnitureInteriorSecondaryCylindricalLockImage,
        furnitureInteriorSecondaryLeverLockImage,

        // Furniture images (stage-specific)
        furnitureExteriorPeepholeImage,
        furnitureInteriorPeepholeImage,
        furnitureNightLatchTurnerImage,
        furnitureCylinderRodImage,
        furnitureExteriorHandleImage,
        furnitureInteriorHandleImage,

        // Configs
        exteriorImageConfig,
        interiorImageConfig,
        exteriorPeepholeImageConfig,
        interiorPeepholeImageConfig,
        backgroundConfig,
    }
});
