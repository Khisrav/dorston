import { defineStore } from "pinia"
import { ref } from "vue"
import { getComfortTotalSum } from "@/constants/comfort"
import { DoorConfig } from "@/types/configurator"
import { getPaintPrice, isMetallicDoor } from "@/lib/utils"
import { useDoorCalc } from "../useDoorCalc"

export const useComfortConstructive = defineStore('comfortConstructive', () => {
    const total_price = ref(0)

    const staticPriceValues = getComfortTotalSum()

    const getTotalPrice = (isStandard: boolean, doorConfig: DoorConfig) => {
        const doorCalcStore = useDoorCalc()
        
        total_price.value = 0
        total_price.value += staticPriceValues
        //цинкогрунт и цвет
        total_price.value += powderPriceValue(doorConfig)
        //Уникальное [Неменяемое]
        total_price.value += changeablePricesValue(doorConfig)
        //Закрыть короб
        total_price.value += closedBoxPriceValue(doorConfig)
        //Дополнительно крепеж если ПП
        total_price.value += isMetallicDoor(doorConfig) ? 0 : ((100 * 0.18) + 4 * 1.6);
        //Замок
        total_price.value += locksPriceValue(doorConfig, doorCalcStore)

        return total_price.value
    }

    const locksPriceValue = (doorConfig: DoorConfig, doorCalcStore: ReturnType<typeof useDoorCalc>) => {
        let sum = 0;
        
        // Primary lock price
        if (doorConfig.furniture.primaryLock && doorConfig.furniture.primaryLock !== -1) {
            const primaryLock = doorCalcStore.locks.primary.find(l => l.id === doorConfig.furniture.primaryLock);
            if (primaryLock) {
                sum += primaryLock.base_price;
            }
        }
        
        // Secondary lock price (if enabled)
        if (doorConfig.furniture.hasSecondaryLock && doorConfig.furniture.secondaryLock && doorConfig.furniture.secondaryLock !== -1) {
            const secondaryLock = doorCalcStore.locks.secondary.find(l => l.id === doorConfig.furniture.secondaryLock);
            if (secondaryLock) {
                sum += secondaryLock.base_price;
            }
        }
        
        return sum;
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

    const powderPriceValue = (doorConfig: DoorConfig) => doorConfig.exterior.panelModel !== 37 ? getPaintPrice(doorConfig) : 0; // verso

    const closedBoxPriceValue = (doorConfig: DoorConfig) => doorConfig.doorBoxDesign === 'Closed' ? 7.56 * 84 + 0.035 * 2300 : 0; // E75+E76

    return {
        getTotalPrice,
    }
})