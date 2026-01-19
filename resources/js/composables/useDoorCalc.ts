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
        doorWidth: 900,
        doorHeight: 2030,
        doorHandleSide: 'Left',
        doorBoxDesign: 'Opened',
        interior: {
            panelModel: 2, //Ф-11
            primaryTexture: -1,
            secondaryTexture: -1,
            casingTexture: -1,
        },
        exterior: {
            panelModel: 59, //ВС-6
            primaryTexture: 80,
            secondaryTexture: -1,
            casingTexture: 80,
        },
        metalPainting: {
            undercoat: true,
            primaryColor: -1,
            secondaryColor: -1,
        },
        furniture: {
            primaryLock: '',
            primaryCylindricalLockMechanism: '',
            secondaryLock: '',
            secondaryCylindricalLockMechanism: '',
        },
    })

    //if primary texture changed, then apply primary texture value to casing texture
    watch(() => doorConfig.value.interior.primaryTexture, (newTexture) => {
        doorConfig.value.interior.casingTexture = newTexture
    })
    
    watch(() => doorConfig.value.exterior.primaryTexture, (newTexture) => {
        doorConfig.value.exterior.casingTexture = newTexture
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

    const getSelectedFilm = (id: number) => filmColors.value.find((film: Nomenclature) => film.id === id)
    const getSelectedPaint = (id: number) => paints.value.find((paint: Nomenclature) => paint.id === id)

    return {
        doorConfig,
        total_price,
        isStandard,
        paints,
        doorModels,
        filmColors,
        getDoorModelInfo,
        getSelectedFilm,
        getSelectedPaint,
    }
})