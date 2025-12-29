import { DoorConfig, doorConstructive, doorType } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useComfortConstructive } from "./door-constructives/useComfortConstructive";
import { isDoorStandard } from "@/lib/utils";

export const useDoorCalc = defineStore('doorCalc', () => {
    const total_price = ref(0)

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

    const isStandard = computed(() => isDoorStandard(doorConfig.value.doorWidth, doorConfig.value.doorHeight))

    watch(doorConfig, () => {
        if (doorConfig.value.doorConstructive === 'Comfort') {
            total_price.value = useComfortConstructive().getTotalPrice(isStandard.value, doorConfig.value)
        }
    }, { deep: true, immediate: true })

    return {
        doorConfig,
        total_price,
        isStandard,
    }
})