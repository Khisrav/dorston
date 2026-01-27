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
            primaryTexture: -1,
            secondaryTexture: -1,
            casingTexture: -1,
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

    const isStandard = computed(() => isDoorStandard(doorConfig.value.doorWidth, doorConfig.value.doorHeight))
    
    const getDoorModelInfo = (id: number) => doorModels.value.find((model: DoorModel) => model.id === id) ?? null
    const getFilmColor = (id: number) => filmColors.value.find((film: Nomenclature) => film.id === id) ?? null
    const getPaintColor = (id: number) => paints.value.find((paint: Nomenclature) => paint.id === id) ?? null
    const getSelectedModel = (type: 'exterior' | 'interior') => {
        const modelId = type === 'exterior' ? doorConfig.value.exterior.panelModel : doorConfig.value.interior.panelModel;
        return doorModels.value.find((m: DoorModel) => m.id === modelId);
    }

    const initializeDefaultConfig = () => {
        const defaultExteriorModel = getDoorModelInfo(59)
        const defaultInteriorModel = getDoorModelInfo(2)

        applyDoorModelConfig(defaultExteriorModel?.id ?? 59, 'exterior')
        applyDoorModelConfig(defaultInteriorModel?.id ?? 2, 'interior')
    }

    const applyDoorModelConfig = (modelId: number, type: 'exterior' | 'interior') => {
        const model = getDoorModelInfo(modelId)
        if (type === 'exterior') {
            doorConfig.value.exterior.panelModel = model?.id ?? 59
            doorConfig.value.exterior.primaryTexture = model?.default_primary_film_color_id ?? -1
            doorConfig.value.exterior.secondaryTexture = model?.default_secondary_film_color_id ?? -1
            doorConfig.value.exterior.casingTexture = model?.default_casing_film_color_id ?? -1
            doorConfig.value.metalPainting.primaryColor = model?.default_primary_paint_id ?? -1
            doorConfig.value.metalPainting.secondaryColor = model?.default_secondary_paint_id ?? -1
        } else {
            doorConfig.value.interior.panelModel = model?.id ?? 2
            doorConfig.value.interior.primaryTexture = model?.default_primary_film_color_id ?? -1
            doorConfig.value.interior.secondaryTexture = model?.default_secondary_film_color_id ?? -1
            doorConfig.value.interior.casingTexture = model?.default_casing_film_color_id ?? -1
            doorConfig.value.metalPainting.primaryColor = model?.default_primary_paint_id ?? -1
            doorConfig.value.metalPainting.secondaryColor = model?.default_secondary_paint_id ?? -1
        }
    }

    watch(() => doorConfig.value.exterior.panelModel, (newModelId: number) => {
        applyDoorModelConfig(newModelId, 'exterior')
    })
    watch(() => doorConfig.value.interior.panelModel, (newModelId: number) => {
        applyDoorModelConfig(newModelId, 'interior')
    })
    
    watch(doorConfig, () => {
        if (doorConfig.value.doorConstructive === 'Comfort') {
            total_price.value = useComfortConstructive().getTotalPrice(isStandard.value, doorConfig.value)
        } 
        //other constructives
        else {
            total_price.value = 0
        }
    }, { deep: true, immediate: true })

    //if primary texture changed, then apply primary texture value to casing texture
    watch(() => doorConfig.value.interior.primaryTexture, (newTexture) => {
        if (doorConfig.value.interior.casingTexture === -1) {
            doorConfig.value.interior.casingTexture = newTexture
        }
    })

    watch(() => doorConfig.value.exterior.primaryTexture, (newTexture) => {
        if (doorConfig.value.exterior.casingTexture === -1) {
            doorConfig.value.exterior.casingTexture = newTexture
        }
    })


    return {
        doorConfig,
        total_price,
        isStandard,
        paints,
        doorModels,
        filmColors,
        getDoorModelInfo,
        getFilmColor,
        getPaintColor,
        getSelectedModel,
        initializeDefaultConfig
    }
})