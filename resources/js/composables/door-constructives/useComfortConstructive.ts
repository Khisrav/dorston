import { defineStore } from "pinia"
import { ref } from "vue"
import { getComfortTotalSum } from "@/constants/comfort"
import { DoorConfig } from "@/types/configurator"
import { getPaintPrice, isMetallicDoor } from "@/lib/utils"

export const useComfortConstructive = defineStore('comfortConstructive', () => {
    const total_price = ref(0)

    const staticPriceValues = getComfortTotalSum()

    const getTotalPrice = (isStandard: boolean, doorConfig: DoorConfig) => {
        total_price.value = 0
        total_price.value += staticPriceValues
        //цинкогрунт и цвет
        total_price.value += getPaintPrice(doorConfig)

        return total_price.value
    }

    return {
        getTotalPrice,
    }
})