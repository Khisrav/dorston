import { defineStore } from "pinia";
import { ref, computed, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";
import { DoorCombinationImage, Furniture } from "@/types/configurator";

export const useDoorVisual = defineStore('doorVisual', () => {
    const doorCalcStore = useDoorCalc();

    const stageWidth = ref<number>(0);
    const stageHeight = ref<number>(0);
    const doorDimensions = {
        width: 960,
        height: 2050,
    }
    const doorCombinationImages = ref<DoorCombinationImage[]>([]);
    const isCombinationsLoading = ref(false);

    const setStageDimensions = (width: number, height: number) => {
        stageWidth.value = width;
        stageHeight.value = width * doorDimensions.height / doorDimensions.width;
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

    const furniturePrimaryCylindricalLockUrl = makeFurnitureUrl(f => f.primary_cylindrical_lock_cover_image);
    const furniturePrimaryLeverLockUrl = makeFurnitureUrl(f => f.primary_lever_lock_cover_image);
    const furnitureSecondaryCylindricalLockUrl = makeFurnitureUrl(
        f => f.secondary_cylindrical_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furnitureSecondaryLeverLockUrl = makeFurnitureUrl(
        f => f.secondary_lever_lock_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasSecondaryLock,
    );
    const furniturePeepholeUrl = makeFurnitureUrl(
        f => f.peephole_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None',
    );
    const furnitureNightLatchTurnerUrl = makeFurnitureUrl(
        f => f.night_latch_turner_cover_image,
        () => !!doorCalcStore.doorConfig.furniture.hasNightLatchTurner,
    );
    const furnitureCylinderRodUrl = makeFurnitureUrl(f => f.cylinder_rod_cover_image);
    const furnitureHandleUrl = makeFurnitureUrl(f => f.handle_cover_image);

    // ── Furniture image loading ───────────────────────────────────────────────

    const [furniturePrimaryCylindricalLockImage] = useImage(furniturePrimaryCylindricalLockUrl);
    const [furniturePrimaryLeverLockImage] = useImage(furniturePrimaryLeverLockUrl);
    const [furnitureSecondaryCylindricalLockImage] = useImage(furnitureSecondaryCylindricalLockUrl);
    const [furnitureSecondaryLeverLockImage] = useImage(furnitureSecondaryLeverLockUrl);
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
            x: flipped ? stageWidth.value : 0,
            y: 0,
            width: stageWidth.value,
            height: stageHeight.value,
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
        x: (stageWidth.value - stageWidth.value * 0.9) / 2,
        y: (stageHeight.value - stageHeight.value * 0.99) / 2,
        width: stageWidth.value * 0.9,
        height: stageHeight.value * 0.99,
        fill: 'black',
    }));

    return {
        stageWidth,
        stageHeight,
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

        // Furniture images
        furniturePrimaryCylindricalLockImage,
        furniturePrimaryLeverLockImage,
        furnitureSecondaryCylindricalLockImage,
        furnitureSecondaryLeverLockImage,
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
