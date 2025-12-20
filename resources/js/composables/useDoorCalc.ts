import { DoorConfig, doorConstructive, doorType } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDoorCalc = defineStore('doorCalc', () => {
    const doorConfig = ref<DoorConfig>({
        doorType: 'Apartment',
        doorConstructive: 'Comfort',
        doorWidth: 2030,
        doorHeight: 900,
        doorTexture: '',
        doorHandleSide: 'Left',
        doorBoxDesign: 'Opened',
    })

    return {
        doorConfig,
    }
})