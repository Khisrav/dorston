import { DoorType } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDoorCalc = defineStore('doorCalc', () => {
    const doorType = ref<DoorType>('Comfort')
    const doorWidth = ref(0);
    const doorHeight = ref(0);
    const doorTexture = ref('Matte');

    return {
        doorType,
        doorWidth,
        doorHeight,
        doorTexture,
    }
})