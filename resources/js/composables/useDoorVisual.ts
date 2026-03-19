import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";
import { DoorCombinationImage } from "@/types/configurator";

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

        console.log('stage size set to', stageWidth.value, stageHeight.value);
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
        console.log('combo finder executed for', purpose, modelId, filmColorId, combo);
        return combo ? `/storage/${combo.image}` : '';
    }

    // Exterior computed URLs
    const exteriorCasingUrl = computed(() =>
        findComboUrl('Наличник', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.casingTexture)
    );
    //hinge
    const exteriorHingeUrl = '/assets/temp/Петли.png';
    const exteriorDoorUrl = computed(() =>
        findComboUrl('Полотно', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.primaryTexture)
    );
    const exteriorAdditionalCasingUrl = computed(() =>
        findComboUrl('Вставка наличника', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.casingTexture)
    );
    const exteriorAdditionalDoorUrl = computed(() =>
        findComboUrl('Вставка полотна', doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.exterior.secondaryTexture)
    );

    // Interior computed URLs
    const interiorDoorUrl = computed(() =>
        findComboUrl('Полотно', doorCalcStore.doorConfig.interior.panelModel, doorCalcStore.doorConfig.interior.primaryTexture)
    );
    const interiorCasingUrl = computed(() =>
        findComboUrl('Наличник', doorCalcStore.doorConfig.interior.panelModel, doorCalcStore.doorConfig.interior.casingTexture)
    );

    const [casingImage] = useImage(exteriorCasingUrl);
    const [doorImage] = useImage(exteriorDoorUrl);
    const [exteriorHingeImage] = useImage(exteriorHingeUrl);
    const [additionalCasingElementImage] = useImage(exteriorAdditionalCasingUrl);
    const [additionalDoorElementImage] = useImage(exteriorAdditionalDoorUrl);

    const [interiorDoorImage] = useImage(interiorDoorUrl);
    // const [interiorCasingImage] = useImage(interiorCasingUrl);
    const [interiorCasingImage] = useImage('/assets/temp/Короб.png')

    const fullStageRect = computed(() => ({
        x: 0,
        y: 0,
        width: stageWidth.value,
        height: stageHeight.value,
    }));

    const layersConfig = computed(() => ({
        exterior: {
            background: {
                x: (stageWidth.value - stageWidth.value * 0.9) / 2,
                y: (stageHeight.value - stageHeight.value * 0.99) / 2,
                width: stageWidth.value * 0.9,
                height: stageHeight.value * 0.99,
                fill: 'black',
            },
            casing: {
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
            },
        },
        interior: {
            background: {
                x: (stageWidth.value - stageWidth.value * 0.9) / 2,
                y: (stageHeight.value - stageHeight.value * 0.99) / 2,
                width: stageWidth.value * 0.9,
                height: stageHeight.value * 0.99,
                // fill: 'black',
            },
            panel: {
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
            },
            casing: {
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
            },
        },
    }));

    const universalConfig = computed(() => ({
        x: 0,
        y: 0,
        width: stageWidth.value,
        height: stageHeight.value,
    }));

    return {
        stageWidth,
        stageHeight,
        setStageDimensions,
        casingImage,
        exteriorHingeImage,
        doorImage,
        additionalCasingElementImage,
        additionalDoorElementImage,
        interiorCasingImage,
        interiorDoorImage,
        fullStageRect,
        layersConfig,
        universalConfig,
        doorCombinationImages,
        isCombinationsLoading,
    }
});