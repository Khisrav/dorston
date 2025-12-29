import { defineStore } from "pinia"
import { ref } from "vue"
import { getComfortTotalSum } from "@/constants/comfort"
import { DoorConfig } from "@/types/configurator"

export const useComfortConstructive = defineStore('comfortConstructive', () => {
    const total_price = ref(0)

    const staticPriceValues = getComfortTotalSum()

    const isMetallicDoor = (doorConfig: DoorConfig) => {
        return ['Kombi', 'Verso', 'Forta', 'Stark'].includes(doorConfig.exterior.panelModel)
    }

    const getTotalPrice = (isStandard: boolean, doorConfig: DoorConfig) => {
        total_price.value = 0
        total_price.value += staticPriceValues
        //цинкогрунт
        total_price.value += (isStandard ? 1 : 1.1) * 420
        //антик медь
        total_price.value += ((isStandard ? 2 : 2.2) - (isMetallicDoor(doorConfig) ? 0 : 0.6)) * 390
        //антик серебро
        total_price.value += ((isStandard ? 2 : 2.2) - (isMetallicDoor(doorConfig) ? 0 : 0.6)) * 480

        return total_price.value
    }

    return {
        getTotalPrice,
    }
})