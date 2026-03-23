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

    const doorCombinationImages = ref<DoorCombinationImage[]>([]);
    const isCombinationsLoading = ref(false);

    /** @deprecated No-op — stage is always design resolution; CSS scales in the UI. */
    function setStageDimensions(_width: number, _height: number): void {}

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

    // ── Interior door URLs ────────────────────────────────────────────────────

    const interiorDoorUrl = computed(() =>
        findComboUrl('Полотно', doorCalcStore.doorConfig.interior.panelModel, doorCalcStore.doorConfig.interior.primaryTexture)
    );

    // ── Door image loading ────────────────────────────────────────────────────

    const [casingImage] = useImage(exteriorCasingUrl);
    const [doorImage] = useImage(exteriorDoorUrl);
    const [exteriorHingeImage] = useImage('/assets/temp/Петли.png');
    const [additionalCasingElementImage] = useImage(exteriorAdditionalCasingUrl);
    const [additionalDoorElementImage] = useImage(exteriorAdditionalDoorUrl);
    const [interiorDoorImage] = useImage(interiorDoorUrl);
    const [interiorCasingImage] = useImage('/assets/temp/Короб.png');

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

    // Exterior lock cover images
    const furnitureExteriorPrimaryCylindricalLockUrl = makeFurnitureUrl(f => f.exterior_primary_cylindrical_lock_cover_image);
    const furnitureExteriorPrimaryLeverLockUrl = makeFurnitureUrl(f => f.exterior_primary_lever_lock_cover_image);
    const furnitureExteriorSecondaryCylindricalLockUrl = makeFurnitureUrl(
        f => f.exterior_secondary_cylindrical_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureExteriorSecondaryLeverLockUrl = makeFurnitureUrl(
        f => f.exterior_secondary_lever_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );

    // Interior lock cover images
    const furnitureInteriorPrimaryCylindricalLockUrl = makeFurnitureUrl(f => f.interior_primary_cylindrical_lock_cover_image);
    const furnitureInteriorPrimaryLeverLockUrl = makeFurnitureUrl(f => f.interior_primary_lever_lock_cover_image);
    const furnitureInteriorSecondaryCylindricalLockUrl = makeFurnitureUrl(
        f => f.interior_secondary_cylindrical_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureInteriorSecondaryLeverLockUrl = makeFurnitureUrl(
        f => f.interior_secondary_lever_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );

    // Peephole cover image — selected by position
    const furniturePeepholeUrl = makeFurnitureUrl(
        f => {
            const pos = doorCalcStore.doorConfig.peepholePosition;
            if (pos === 'Side') return f.side_peephole_cover_image;
            if (pos === 'Center') return f.center_peephole_cover_image;
            return f.peephole_cover_image;
        },
        () => !!doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None',
    );

    const furnitureNightLatchTurnerUrl = makeFurnitureUrl(
        f => f.night_latch_turner_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasNightLatchTurner,
    );
    const furnitureCylinderRodUrl = makeFurnitureUrl(f => f.cylinder_rod_cover_image);
    const furnitureHandleUrl = makeFurnitureUrl(f => f.handle_cover_image);

    // ── Furniture image loading ───────────────────────────────────────────────

    const [furnitureExteriorPrimaryCylindricalLockImage] = useImage(furnitureExteriorPrimaryCylindricalLockUrl);
    const [furnitureExteriorPrimaryLeverLockImage] = useImage(furnitureExteriorPrimaryLeverLockUrl);
    const [furnitureExteriorSecondaryCylindricalLockImage] = useImage(furnitureExteriorSecondaryCylindricalLockUrl);
    const [furnitureExteriorSecondaryLeverLockImage] = useImage(furnitureExteriorSecondaryLeverLockUrl);

    const [furnitureInteriorPrimaryCylindricalLockImage] = useImage(furnitureInteriorPrimaryCylindricalLockUrl);
    const [furnitureInteriorPrimaryLeverLockImage] = useImage(furnitureInteriorPrimaryLeverLockUrl);
    const [furnitureInteriorSecondaryCylindricalLockImage] = useImage(furnitureInteriorSecondaryCylindricalLockUrl);
    const [furnitureInteriorSecondaryLeverLockImage] = useImage(furnitureInteriorSecondaryLeverLockUrl);

    const [furniturePeepholeImage] = useImage(furniturePeepholeUrl);
    const [furnitureNightLatchTurnerImage] = useImage(furnitureNightLatchTurnerUrl);
    const [furnitureCylinderRodImage] = useImage(furnitureCylinderRodUrl);
    const [furnitureHandleImage] = useImage(furnitureHandleUrl);

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
        makeFlipConfig(doorCalcStore.doorConfig.doorHandleSide !== 'Left')
    );

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

        // Shared furniture images
        furniturePeepholeImage,
        furnitureNightLatchTurnerImage,
        furnitureCylinderRodImage,
        furnitureHandleImage,

        // Configs
        exteriorImageConfig,
        interiorImageConfig,
        backgroundConfig,
    }
});
