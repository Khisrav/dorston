import { DoorConfig, doorConstructive, DoorModel, doorType, Nomenclature } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useComfortConstructive } from "./door-constructives/useComfortConstructive";
import { isDoorStandard } from "@/lib/utils";

export const useDoorCalc = defineStore('doorCalc', () => {
    //static vars
    const paints = ref<Nomenclature[]>([]);
    const doorModels = ref<DoorModel[]>([]);
    const filmColors = ref<Nomenclature[]>([]);

    const total_price = ref(0)

    const doorConfig = ref<DoorConfig>({
        doorType: 'Apartment',
        doorConstructive: 'Comfort',
        doorWidth: 2030,
        doorHeight: 900,
        doorHandleSide: 'Left',
        doorBoxDesign: 'Opened',
        interior: {
            panelModel: 2, //Ф-11
            primaryTexture: '',
            secondaryTexture: '',
            casingTexture: '',
        },
        exterior: {
            panelModel: 59, //ВС-6
            primaryTexture: '',
            secondaryTexture: '',
            casingTexture: '',
        },
        metalPainting: {
            undercoat: false,
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
        //other constructives
        else {
            total_price.value = 0
        }
    }, { deep: true, immediate: true })

    //get door model info
    const getDoorModelInfo = (id: number) => {
        return doorModels.value.find((model: DoorModel) => model.id === id)
    }

    return {
        doorConfig,
        total_price,
        isStandard,
        paints,
        doorModels,
        filmColors,
        getDoorModelInfo,
    }
})