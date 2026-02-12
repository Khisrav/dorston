import { DoorConfig, doorConstructive, DoorModel, doorType, Nomenclature, Furniture } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { useComfortConstructive } from "./door-constructives/useComfortConstructive";
import { isDoorStandard } from "@/lib/utils";

export const useDoorCalc = defineStore('doorCalc', () => {
    //static vars
    const paints = ref<Nomenclature[]>([]);
    const doorModels = ref<DoorModel[]>([]);
    const filmColors = ref<Nomenclature[]>([]);
    const furnitures = ref<Furniture[]>([]);
    const handles = ref<Nomenclature[]>([]);
    const locks = ref<{ primary: Nomenclature[], secondary: Nomenclature[] }>({ primary: [], secondary: [] });
    const cylinders = ref<Nomenclature[]>([]);

    const total_price = ref(0)

    const doorConfig = ref<DoorConfig>({
        doorType: 'Apartment',
        doorConstructive: 'Comfort',
        doorWidth: 960,
        doorHeight: 2050,
        doorHandleSide: 'Left',
        doorBoxDesign: 'Opened',
        peepholePosition: 'Center',
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
            furnitureSetId: -1,
            furnitureShape: undefined,
            furnitureColor: undefined,
            primaryLock: -1,
            primaryCylindricalLockMechanism: -1,
            hasSecondaryLock: false,
            secondaryLock: -1,
            secondaryCylindricalLockMechanism: -1,
            hasPeephole: true,
            hasNightLatchTurner: false,
        },
    })

    const isStandard = computed(() => isDoorStandard(doorConfig.value.doorWidth, doorConfig.value.doorHeight))
    
    const getDoorModelInfo = (id: number) => doorModels.value.find((model: DoorModel) => model.id === id) ?? null
    const getFilmColor = (id: number) => filmColors.value.find((film: Nomenclature) => film.id === id) ?? null
    const getPaintColor = (id: number) => paints.value.find((paint: Nomenclature) => paint.id === id) ?? null
    const getFurnitureSet = (id: number) => furnitures.value.find((furniture: Furniture) => furniture.id === id) ?? null
    const getSelectedModel = (type: 'exterior' | 'interior') => {
        const modelId = type === 'exterior' ? doorConfig.value.exterior.panelModel : doorConfig.value.interior.panelModel;
        return doorModels.value.find((m: DoorModel) => m.id === modelId);
    }

    const initializeDefaultConfig = () => {
        const defaultExteriorModel = getDoorModelInfo(59)
        const defaultInteriorModel = getDoorModelInfo(2)

        applyDoorModelConfig(defaultExteriorModel?.id ?? 59, 'exterior')
        applyDoorModelConfig(defaultInteriorModel?.id ?? 2, 'interior')

        // Auto-select furniture if only one available
        if (furnitures.value.length === 1) {
            doorConfig.value.furniture.furnitureShape = furnitures.value[0].shape
            doorConfig.value.furniture.furnitureColor = furnitures.value[0].color
            doorConfig.value.furniture.furnitureSetId = furnitures.value[0].id
        }
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
            // doorConfig.value.metalPainting.primaryColor = model?.default_primary_paint_id ?? -1
            // doorConfig.value.metalPainting.secondaryColor = model?.default_secondary_paint_id ?? -1
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
        doorConfig.value.exterior.casingTexture = newTexture
    })

    // Reset secondary lock when toggle is turned off
    watch(() => doorConfig.value.furniture.hasSecondaryLock, (hasSecondaryLock) => {
        if (!hasSecondaryLock) {
            doorConfig.value.furniture.secondaryLock = -1
            doorConfig.value.furniture.secondaryCylindricalLockMechanism = -1
        }
    })

    // Auto-select furniture set when color is selected
    watch(
        () => doorConfig.value.furniture.furnitureColor,
        (color) => {
            if (color) {
                const matchingFurniture = furnitures.value.filter(f => f.color === color)
                if (matchingFurniture.length === 1) {
                    // Only one furniture set with this color, auto-select it
                    doorConfig.value.furniture.furnitureSetId = matchingFurniture[0].id
                    doorConfig.value.furniture.furnitureShape = matchingFurniture[0].shape
                } else if (matchingFurniture.length > 1) {
                    // Multiple options, select the first one
                    doorConfig.value.furniture.furnitureSetId = matchingFurniture[0].id
                    doorConfig.value.furniture.furnitureShape = matchingFurniture[0].shape
                } else {
                    doorConfig.value.furniture.furnitureSetId = -1
                    doorConfig.value.furniture.furnitureShape = undefined
                }
            } else {
                doorConfig.value.furniture.furnitureSetId = -1
                doorConfig.value.furniture.furnitureShape = undefined
            }
        }
    )


    return {
        doorConfig,
        total_price,
        isStandard,
        paints,
        doorModels,
        filmColors,
        furnitures,
        handles,
        locks,
        cylinders,
        getDoorModelInfo,
        getFilmColor,
        getPaintColor,
        getFurnitureSet,
        getSelectedModel,
        initializeDefaultConfig,
    }
})