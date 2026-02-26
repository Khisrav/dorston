/*
 * The door visualizer will be consisted of few layers for both exterior and interior doors.
 * Exterior layers:
 * 0. Black background to mimic the door's gaps
 * 1. Casing image which is already pre baked by designer with milling and film color already applied (i will just slap the image on the stage)
 * 1.1 Some door models have additional elements that overlap the door and apply to casing, in this scenario i just need to apply the correct image which has film color in it already
 * 2. Door itself (milling + film color) is also pre baked by designer and i just need to slap the image on the stage
 * 3. Additional elements that overlap the door and apply to casing, in this scenario i just need to apply the correct image which has film color in it already
 * 4. Doorsill, furniture
 * 5. Hinges are a bit trickier, but i will deal with them later
 * 
 * Door size is static and user's defined size won't affect the visualizer (only when window is resized)
 * This time visualizer will be simplified
 */

import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";

export const useDoorVisual = defineStore('doorVisual', () => {
    const doorCalcStore = useDoorCalc();

    const stageWidth = ref<number>(0);
    const stageHeight = ref<number>(0);
    const doorDimensions = {
        width: 860,
        height: 2050,
    };

    const setStageDimensions = (width: number, height: number) => {
        stageWidth.value = width;
        stageHeight.value = width * doorDimensions.height / doorDimensions.width;

        console.log('stage size set to', stageWidth.value, stageHeight.value);
    }

    // Temp test images
    const [casingImage] = useImage('/assets/temp/Наличник.png');
    const [doorImage] = useImage('/assets/temp/Полотно.png');
    const [additionalCasingElementImage] = useImage('/assets/temp/Доп элемент наличника.png');
    const [additionalDoorElementImage] = useImage('/assets/temp/Доп элемент полотна.png');

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
                fill: 'black',
            },
        },
    }));

    return {
        stageWidth,
        stageHeight,
        setStageDimensions,
        casingImage,
        doorImage,
        additionalCasingElementImage,
        additionalDoorElementImage,
        fullStageRect,
        layersConfig,
    }
});