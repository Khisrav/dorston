import { isDoorPanelStandard, isDoorStandard, isMetallicDoor } from '@/lib/utils';
import { TermoDoorConfig } from '@/types/configurator';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDoorCalc } from '../useDoorCalc';

export const useTermoConstructive = defineStore('termoConstructive', () => {
    const total_price = ref(0);

    const getTotalPrice = (doorConfig: TermoDoorConfig) => {
        const doorCalcStore = useDoorCalc();

        total_price.value = 0;
        
        total_price.value += nonChangeablePricesValue(doorConfig);
        console.log('Стандартное [Неменяемое]:', total_price.value);

        return total_price.value;
    };

    const nonChangeablePricesValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0

        sum += 3*49 + 5*0.65 + 0.35*130 + 3*3.8 + 1.6 + 0.13*125
        sum += 12*24.95 + 2*23 + 0.015*2150 + 124*0.2 + 5*1.6
        //E46
        const modelGroups = {
            firstGroup: [61, 62, 65, 79, 80, 81, 70, 71, 74, 75, 76],
            secondGroup: [77, 78, 82, 83, 63, 64, 66, 67, 68, 69, 72, 73],
        }

        if (modelGroups.firstGroup.includes(doorConfig.exterior.panelModel)) {
            sum += (doorConfig.height > 2099 ? 22 : 18) * 44
        } else if (modelGroups.secondGroup.includes(doorConfig.exterior.panelModel)) {
            sum += (doorConfig.height > 2099 ? 16 : 12) * 44
        }

        //E51:E59
        sum += 132.39
        //E61:E64, E66:E78
        sum += 67.09 + 194.06 + 3929.11

        return 0
    }

    const changeablePricesValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0, subH = doorConfig.height - 60, subW = doorConfig.width - 60

        //E40, E41, E43, E45
        sum += 1*(doorConfig.height>2209?140:105) + 123 + (subH/1000*subW/1000*0.5)*3800 + (subH/1000*subW/1000*0.5)*3500
        //E65
        const condition = (h: number) => {
            if (h <= 2050) return 4
            else if (h > 2100) return 9
            else return 6
        }

        sum += condition(doorConfig.height) * 50

        return 0;
    }

    return {
        getTotalPrice,
    };
});
