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
        // Changeable price calculations (E4-E60, etc.)
        total_price.value += changeablePricesValue(doorConfig)

        return total_price.value
    }

    const changeablePricesValue = (doorConfig: DoorConfig) => {
        let sum = 0;
        //E4
        if (doorConfig.doorHeight <= 2050 && doorConfig.doorWidth <= 960) { sum += 43.175 }
        else if (doorConfig.doorHeight <= 2050 && doorConfig.doorWidth > 960 && doorConfig.doorWidth <= 1050) { sum += 47.4925 }
        else if (doorConfig.doorHeight > 2050 && doorConfig.doorHeight <= 2130 && doorConfig.doorWidth <= 1050) { sum += 47.4925 }
        else if (doorConfig.doorHeight > 2130) { sum += 49.06 }
        sum *= 84;
        //E5
        sum += (doorConfig.doorWidth >= 2120 ? 6.91 : 4.8) * 84;
        //E40
        sum += ((doorConfig.doorHeight - 127) / 1000 * (doorConfig.doorWidth - 128) / 1000 * 0.05) * 2300;
        //E41
        sum += ((doorConfig.doorHeight - 127) / 1000 * (doorConfig.doorWidth - 128) / 1000 * 0.03) * 3250;
        //E44
        sum += (doorConfig.furniture.hasNightLatchTurner ? 1 : 0) * 64;
        //E60
        sum += (doorConfig.doorHeight <= 2050 ? 4 : doorConfig.doorHeight <= 2100 ? 6 : 9) * 50;
        return sum;
    }

    return {
        getTotalPrice,
    }
})