import { DoorConfig, doorConstructive, doorType } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDoorCalc = defineStore('doorCalc', () => {
    const doorConfig = ref<DoorConfig>({
        doorType: 'Apartment',
        doorConstructive: 'Comfort',
        doorWidth: 2030,
        doorHeight: 900,
        doorHandleSide: 'Left',
        doorBoxDesign: 'Opened',
        interior: {
            panelModel: '',
            primaryTexture: '',
            secondaryTexture: '',
            casingTexture: '',
        },
        exterior: {
            panelModel: '',
            primaryTexture: '',
            secondaryTexture: '',
            casingTexture: '',
        },
        metalPainting: {
            undercoat: '',
            primaryColor: '',
            secondaryColor: '',
        },
        furniture: {
            primaryLock: '',
            primaryCylindricalLockMechanism: '',
            secondaryLock: '',
            secondaryCylindricalLockMechanism: '',
        },
    })

    return {
        doorConfig,
    }
})