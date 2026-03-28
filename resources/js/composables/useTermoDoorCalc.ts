import { DoorModel, Nomenclature, Furniture, TermoDoorConfig } from "@/types/configurator";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { isDoorStandard, roundUpTo100 } from "@/lib/utils";
import { useTermoConstructive } from "./door-constructives/useTermoConstructive";

export const useTermoDoorCalc = defineStore('termoDoorCalc', () => {
    //static vars
    const paints = ref<Nomenclature[]>([]);
    const doorModels = ref<DoorModel[]>([]);
    const filmColors = ref<Nomenclature[]>([]);
    const furnitures = ref<Furniture[]>([]);
    const handles = ref<Nomenclature[]>([]);
    const locks = ref<{ primary: Nomenclature[], secondary: Nomenclature[] }>({ primary: [], secondary: [] });
    const cylinders = ref<Nomenclature[]>([]);

    const total_price = ref(0)

    const doorConfig = ref<TermoDoorConfig>({
        constructive: 'Termo+',
        width: 820,
        height: 2050,
        handleSide: 'Left',
        peepholePosition: 'None',
        hasStainlessSteelDoorsill: false,
        hasThermalCable: false,
        isModular: false,
        interior: {
            panelModel: 2, //Ф-11
            primaryTexture: -1,
        },
        exterior: {
            panelModel: 78, //Credo
            primaryTexture: -1,
            secondaryTexture: -1,
        },
        metalPainting: {
            undercoat: true,
            primaryColor: 193,
            secondaryColor: -1,
            innerCasingColor: -1,
        },
        glassColor: {
            exterior: -1,
            interior: -1,
        },
        furniture: {
            furnitureSetId: -1,
            furnitureType: 'push' as 'push' | 'pull' | 'electronic',
            furnitureShape: 'rectangular',
            furnitureColor: 'bronze',
            primaryLock: -1,
            primaryCylindricalLockMechanism: -1,
            hasSecondaryLock: false,
            secondaryLock: -1,
            secondaryCylindricalLockMechanism: -1,
            hasPeephole: false,
            hasNightLatchTurner: false,
        },
    })

    const isStandard = computed(() => isDoorStandard(doorConfig.value.width, doorConfig.value.height))
    
    const getDoorModelInfo = (id: number) => doorModels.value.find((model: DoorModel) => model.id === id) ?? null
    const getFilmColor = (id: number) => filmColors.value.find((film: Nomenclature) => film.id === id) ?? null
    const getPaintColor = (id: number) => paints.value.find((paint: Nomenclature) => paint.id === id) ?? null
    const getFurnitureSet = (id: number) => furnitures.value.find((furniture: Furniture) => furniture.id === id) ?? null
    const getSelectedModel = (type: 'exterior' | 'interior') => {
        const modelId = type === 'exterior' ? doorConfig.value.exterior.panelModel : doorConfig.value.interior.panelModel;
        return doorModels.value.find((m: DoorModel) => m.id === modelId);
    }

    const initializeDefaultConfig = () => {
        if (furnitures.value.length === 0) return

        // Auto-select the first furniture that matches the pre-configured type + color.
        // Fall back to the overall first furniture if no match is found.
        const type  = doorConfig.value.furniture.furnitureType
        const color = doorConfig.value.furniture.furnitureColor
        let candidates = furnitures.value.filter(
            f => f.furniture_type === type && f.color === color
        )
        if (!candidates.length) candidates = furnitures.value

        const first = candidates[0]
        doorConfig.value.furniture.furnitureSetId  = first.id
        doorConfig.value.furniture.furnitureShape  = first.shape
        doorConfig.value.furniture.furnitureColor  = first.color
        doorConfig.value.furniture.furnitureType   = first.furniture_type
    }

    const applyDoorModelConfig = (modelId: number, type: 'exterior' | 'interior') => {
        const model = getDoorModelInfo(modelId)
        if (type === 'exterior') {
            doorConfig.value.exterior.panelModel = model?.id ?? 83
            doorConfig.value.exterior.primaryTexture = model?.default_primary_film_color_id ?? -1
            doorConfig.value.exterior.secondaryTexture = model?.default_secondary_film_color_id ?? -1
            // doorConfig.value.exterior.casingTexture = model?.default_casing_film_color_id ?? -1
            doorConfig.value.metalPainting.primaryColor = model?.default_primary_paint_id ?? -1
            doorConfig.value.metalPainting.secondaryColor = model?.default_secondary_paint_id ?? -1
        } else {
            doorConfig.value.interior.panelModel = model?.id ?? 2
            // doorConfig.value.interior.primaryTexture = model?.default_primary_film_color_id ?? -1
            // doorConfig.value.interior.secondaryTexture = model?.default_secondary_film_color_id ?? -1
            // doorConfig.value.interior.casingTexture = model?.default_casing_film_color_id ?? -1
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
        total_price.value = useTermoConstructive().getTotalPrice(doorConfig.value)
        // total_price.value *= (1.3 * 1.055)
        total_price.value = roundUpTo100(total_price.value)
        console.log('total_price', total_price.value);
    }, { deep: true, immediate: true })

    //if primary texture changed, then apply primary texture value to casing texture
    // watch(() => doorConfig.value.interior.primaryTexture, (newTexture) => {
    //     if (doorConfig.value.interior.casingTexture === -1) {
    //         doorConfig.value.interior.casingTexture = newTexture
    //     }
    // })

    // Reset secondary lock when toggle is turned off
    watch(() => doorConfig.value.furniture.hasSecondaryLock, (hasSecondaryLock) => {
        if (!hasSecondaryLock) {
            doorConfig.value.furniture.secondaryLock = -1
            doorConfig.value.furniture.secondaryCylindricalLockMechanism = -1
        }
    })



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