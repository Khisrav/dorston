import { isDoorPanelStandard, isDoorStandard, isMetallicDoor } from '@/lib/utils';
import { TermoDoorConfig } from '@/types/configurator';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTermoDoorCalc } from '../useTermoDoorCalc';
import { getRate } from '@/lib/termoPowderCoating';

export const useTermoConstructive = defineStore('termoConstructive', () => {
    const total_price = ref(0);

    const getTotalPrice = (doorConfig: TermoDoorConfig) => {
        const doorCalcStore = useTermoDoorCalc();

        total_price.value = 0;
        
        total_price.value += nonChangeablePricesValue(doorConfig);
        console.log('Стандартное [Неменяемое]:', nonChangeablePricesValue(doorConfig));
        total_price.value += changeablePricesValue(doorConfig);
        console.log('Уникальное [Изменяемое]:', changeablePricesValue(doorConfig));
        total_price.value += powderPriceValue(doorConfig, doorCalcStore);
        console.log('Порошковая покраска:', powderPriceValue(doorConfig, doorCalcStore));
        total_price.value += additionalFastenersForHPL(doorConfig);
        console.log('Дополнительно крепеж если HPL:', additionalFastenersForHPL(doorConfig));
        total_price.value += locksPriceValue(doorConfig, doorCalcStore);
        console.log('Замки и цилиндры:', locksPriceValue(doorConfig, doorCalcStore));
        total_price.value += furniturePriceValue(doorConfig, doorCalcStore);
        console.log('Фурнитура:', furniturePriceValue(doorConfig, doorCalcStore));
        total_price.value += interiorPanelPriceValue(doorConfig, doorCalcStore);
        console.log('Внутренняя панель:', interiorPanelPriceValue(doorConfig, doorCalcStore));
        total_price.value += exteriorHPLPanelPriceValue(doorConfig, doorCalcStore);
        console.log('Наружная HPL панель:', exteriorHPLPanelPriceValue(doorConfig, doorCalcStore));
        total_price.value += novaPriceValue(doorConfig);
        console.log('Nova отделка:', novaPriceValue(doorConfig));
        total_price.value += fzpPriceValue(doorConfig);
        console.log('ФЗП:', fzpPriceValue(doorConfig));
        total_price.value += metalPriceValue(doorConfig, doorCalcStore);
        console.log('Метал:', metalPriceValue(doorConfig, doorCalcStore));
        total_price.value += difficultyPriceValue(doorConfig);
        console.log('Заложенная сложность:', difficultyPriceValue(doorConfig));

        //порог из нержавейки
        total_price.value += (doorConfig.hasStainlessSteelDoorsill ? 1.6318 : 0) * 187;
        console.log('Порог из нержавейки:', (doorConfig.hasStainlessSteelDoorsill ? 1.6318 : 0) * 187);
        //термокабель
        total_price.value += (doorConfig.hasThermalCable ? 8 : 0) * 187
        console.log('Термокабель:', (doorConfig.hasThermalCable ? 8 : 0) * 187);
        total_price.value += doubleGlazedGlassPriceValue(doorConfig, doorCalcStore);
        console.log('Стеклопакет:', doubleGlazedGlassPriceValue(doorConfig, doorCalcStore));

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

        return sum;
    }

    const changeablePricesValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0, subH = doorConfig.height - 60, subW = doorConfig.width - 60

        //E40, E41, E43, E45
        sum += 1*(doorConfig.height>2209?140:105) + 123 + (subH/1000*subW/1000*0.05)*3800 + (subH/1000*subW/1000*0.05)*3500
        //E65
        const condition = (h: number) => {
            if (h <= 2050) return 4
            else if (h > 2100) return 9
            else return 6
        }

        sum += condition(doorConfig.height) * 50
        return sum;
    }

    const powderPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0
       
        // const paintPrice = doorCalcStore.getPaintColor(doorConfig.metalPainting.primaryColor)?.base_price ?? 0;

        if (doorConfig.metalPainting.primaryColor && doorConfig.metalPainting.primaryColor == -1) return 0
        if (doorConfig.metalPainting.innerCasingColor && doorConfig.metalPainting.innerCasingColor == -1) return 0

        const primaryPaintPrice = doorCalcStore.paints?.find((p) => p.id === doorConfig.metalPainting.primaryColor)?.base_price ?? 0;
        const innerCasingPaintPrice = doorCalcStore.paints?.find((p) => p.id === doorConfig.metalPainting.innerCasingColor)?.base_price ?? 0;

        sum = getRate(doorConfig.metalPainting.primaryColor, doorConfig.exterior.panelModel, isDoorStandard(doorConfig.width, doorConfig.height)) * primaryPaintPrice;
        sum += getRate(doorConfig.metalPainting.innerCasingColor, doorConfig.exterior.panelModel, isDoorStandard(doorConfig.width, doorConfig.height)) * innerCasingPaintPrice;
        return sum
    }

    //дополнительно крепеж если HPL
    const additionalFastenersForHPL = (doorConfig: TermoDoorConfig) => {
        let sum = 0

        if (![77, 78, 79, 80, 81, 82, 83].includes(doorConfig.exterior.panelModel)) {
            sum += 100 * 0.2 + 4 * 1.6
        }

        return sum
    }

    const locksPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0;

        // Primary lock price
        if (doorConfig.furniture.primaryLock &&doorConfig.furniture.primaryLock !== -1) {
            const primaryLock = doorCalcStore.locks.primary.find((l) => l.id === doorConfig.furniture.primaryLock,);
            if (primaryLock) sum += primaryLock.base_price
        }

        // Secondary lock price (if enabled)
        if (doorConfig.furniture.hasSecondaryLock && doorConfig.furniture.secondaryLock && doorConfig.furniture.secondaryLock !== -1) {
            const secondaryLock = doorCalcStore.locks.secondary.find((l) => l.id === doorConfig.furniture.secondaryLock)
            if (secondaryLock) sum += secondaryLock.base_price
        }

        // Primary cylinder price
        if (doorConfig.furniture.primaryCylindricalLockMechanism && doorConfig.furniture.primaryCylindricalLockMechanism !== -1) {
            const primaryCylinder = doorCalcStore.cylinders.find((c) => c.id === doorConfig.furniture.primaryCylindricalLockMechanism)
            if (primaryCylinder) sum += primaryCylinder.base_price
        }

        // Secondary cylinder price (if enabled)
        if (doorConfig.furniture.hasSecondaryLock && doorConfig.furniture.secondaryCylindricalLockMechanism && doorConfig.furniture.secondaryCylindricalLockMechanism !== -1) {
            const secondaryCylinder = doorCalcStore.cylinders.find((c) => c.id === doorConfig.furniture.secondaryCylindricalLockMechanism)
            if (secondaryCylinder) sum += secondaryCylinder.base_price
        }

        return sum;
    }

    const furniturePriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0;

        if (doorConfig.furniture.furnitureSetId !== -1) {
            const furniture = doorCalcStore.furnitures.find((f) => f.id === doorConfig.furniture.furnitureSetId)
            if (furniture) {
                sum += (furniture.cylindrical_lock_price ?? 0)
                console.log('--Цилиндрический замок', sum, (furniture.cylindrical_lock_price ?? 0))

                sum += (furniture.lever_lock_price ?? 0)
                console.log('--Сувальдный замок', sum, (furniture.lever_lock_price ?? 0))

                sum += ((furniture.peephole_price && doorConfig.peepholePosition !== 'None') ? furniture.peephole_price : 0)
                console.log('--Глазок', sum, ((furniture.peephole_price && doorConfig.furniture.hasPeephole) ? furniture.peephole_price : 0))
                
                sum += ((furniture.night_latch_turner_price && doorConfig.furniture.hasNightLatchTurner) ? furniture.night_latch_turner_price : 0)
                console.log('--Ночник', sum, ((furniture.night_latch_turner_price && doorConfig.furniture.hasNightLatchTurner) ? furniture.night_latch_turner_price : 0))
                
                sum += ((furniture.cylinder_rod_price && doorConfig.furniture.hasSecondaryLock) ? furniture.cylinder_rod_price : 0)
                console.log('--Вертушка на шток цилиндра', sum, ((furniture.cylinder_rod_price && doorConfig.furniture.hasSecondaryLock) ? furniture.cylinder_rod_price : 0))
                
                sum += (furniture.handle_price ?? 0)
                console.log('--Ручка', sum, (furniture.handle_price ?? 0))
            }
        }

        return sum;
    }

    const interiorPanelPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0
        const h = doorConfig.height - 60, w = doorConfig.width - 60
        const isHeightStd = h > 2052 ? false : true, isWidthStd = w > 934 ? false : true
        const isStandard = isHeightStd && isWidthStd
        
        const firstPanelsGroup = [2, 3, 11, 13, 14, 16, 18, 19, 20, 26, 27, 87, 4, 5, 6, 8, 7, 15, 10, 12, 21, 22, 1, 17, 23, 24, 25, 28]
        const secondPanelsGroup = [30, 31, 32, 33]

        sum = (isStandard ? 1.932 : 2.89) 
        
        if (firstPanelsGroup.includes(doorConfig.interior.panelModel)) sum *= 272
        else if (secondPanelsGroup.includes(doorConfig.interior.panelModel)) sum *= 290.89
        else if (doorConfig.interior.panelModel === 88) sum *= 375
        else sum = 0

        console.log('МДФ t=10 мм, м2 - сюда же вшита 12мм мдф под панели с зеркалами upd+16:', sum)

        sum += 0.15*1000 + 0.005*214 + 0.05*60 + 0.018*55 + 1*20 + 1*734 + 1*65

        console.log('Клей, Наждачная бумага, м2, Губка шлифовальная, Колер, Упаковка, накладные расходы, Зарплата панель, сложность:', sum)

        const panelPriceGroups = {
            700: [9, 2, 3, 11, 14, 18, 19, 20, 26, 27, 87, 8, 7, 15, 22, 23, 24, 25, 28, 17],
            500: [13, 16, 4, 5, 6, 12, 1, 88],
            900: [21, 30, 31, 32, 33],
            // 0: [-1],
        }

        if (panelPriceGroups[700].includes(doorConfig.interior.panelModel)) sum += 700
        else if (panelPriceGroups[500].includes(doorConfig.interior.panelModel)) sum += 500
        else if (panelPriceGroups[900].includes(doorConfig.interior.panelModel)) sum += 900
        // else if (panelPriceGroups[0].includes(doorConfig.interior.panelModel)) sum += 0

        const filmColorPrice = doorCalcStore.filmColors?.find((f) => f.id === doorConfig.interior.primaryTexture)?.base_price
        sum += (isHeightStd ? 3.5 : 4.55) * (filmColorPrice ?? 0)

        const glassAndProcessing: Record<number, number> = {
            30: 0.4,
            31: 0.4,
            32: 0.4,
            33: 0.4,
            7: 0.1,
            10: 0.1,
            12: 0.15,
            22: 0.05,
        }

        if (glassAndProcessing[doorConfig.interior.panelModel ?? 0]) sum += glassAndProcessing[doorConfig.interior.panelModel ?? 0] * (isHeightStd ? 315 : 366)

        const glueConsumption = (modelNumber: number) => {
            switch(modelNumber) {
                case 7:
                case 10:
                    return 0.1;
                case 12:
                    return 0.15;
                case 22:
                    return 0.05;
                case 30:
                case 31:
                case 32:
                case 33:
                    return 0.4;
                default:
                    return 0;
            }
        }
        sum += glueConsumption(doorConfig.interior.panelModel ?? 0) * 430

        // sum += (doorConfig.interior.panelModel === 10 && isHeightStd ? 0.12084*1400 + 8.176*60 + 0.116812*1400 : 0.12864*1400 + 8.696*60 + 0.124352*1400)
        // sum += (doorConfig.interior.panelModel === 10 && isHeightStd ? 4.144*60 + 0.06042*1400 + 4.088*60 : 4.404*60 + 0.06432*1400)
        if (doorConfig.interior.panelModel === 10 && isHeightStd) sum += 0.12084 * 1400 + 8.176 * 60
        else if (doorConfig.interior.panelModel === 12 && isHeightStd) sum += 0.116812 * 1400 + 4.144 * 60
        else if (doorConfig.interior.panelModel === 22 && !isHeightStd) sum += 0.06042 * 1400 + 4.088 * 60

        sum += (doorConfig.interior.panelModel === 33 ? 0.1 : 0) * 260
        sum += (doorConfig.interior.panelModel === 30 ? 4.476 : 0) * 140
        sum += (doorConfig.interior.panelModel === 30 ? 0.451136 : 0) * 1100
        sum += (doorConfig.interior.panelModel === 31 && isHeightStd ? 1.28896*1100 + 5.308*60 : 0)
        sum += (doorConfig.interior.panelModel === 32 && !isHeightStd ? 1.583004*1100 + 5.6*60 : 0)
        sum += (doorConfig.interior.panelModel === 33 && !isHeightStd ? 1.2573 : 0) * 1100

        return sum
    }

    const exteriorHPLPanelPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0
        const w = doorConfig.width - 60, h = doorConfig.height - 60
        const isStd = (h > 1999 && w > 909 ? false : true)
        const isModular = doorConfig.isModular

        const prices: Record<number, Record<string, Record<string, number>>> = {
            61: { nonModular: { std: 13900, nonStd: 15200}, modular: { std: 8600, nonStd: 9400 } },
            62: { nonModular: { std: 14900, nonStd: 16200}, modular: { std: 9300, nonStd: 10100 } },
            63: { nonModular: { std: 13900, nonStd: 15200}, modular: { std: 8600, nonStd: 9400 } },
            64: { nonModular: { std: 15000, nonStd: 16200}, modular: { std: 9400, nonStd: 10100 } },
            65: { nonModular: { std: 14100, nonStd: 16200}, modular: { std: 10200, nonStd: 11800 } },
            66: { nonModular: { std: 17000, nonStd: 19300}, modular: { std: 11000, nonStd: 12700 } },
            70: { nonModular: { std: 15400, nonStd: 16700}, modular: { std: 9300, nonStd: 10100 } },
            71: { nonModular: { std: 13300, nonStd: 14400}, modular: { std: 7900, nonStd: 8600 } },
            74: { nonModular: { std: 15200, nonStd: 17000}, modular: { std: 8800, nonStd: 10100 } },
            75: { nonModular: { std: 16700, nonStd: 18600}, modular: { std: 9600, nonStd: 10900 } },
            76: { nonModular: { std: 15600, nonStd: 18200}, modular: { std: 8700, nonStd: 11500 } },
            72: { nonModular: { std: 15000, nonStd: 16200}, modular: { std: 9300, nonStd: 10100 } },
            73: { nonModular: { std: 13300, nonStd: 14400}, modular: { std: 7900, nonStd: 8600 } },
            67: { nonModular: { std: 16600, nonStd: 18900}, modular: { std: 10700, nonStd: 12400 } },
            68: { nonModular: { std: 15500, nonStd: 17700}, modular: { std: 9900, nonStd: 11500 } },
            69: { nonModular: { std: 14800, nonStd: 17000}, modular: { std: 9400, nonStd: 11000 } },
        }

        sum = prices[doorConfig.exterior.panelModel ?? 0]?.[isModular ? 'modular' : 'nonModular']?.[isStd ? 'std' : 'nonStd'] ?? 0

        return sum
    }
    
    const novaPriceValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0
        const panelId = doorConfig.exterior.panelModel

        if (panelId === 82) {
            sum += 2.42 * 84 + 22 * 0.59 + 22 * 1.61 + 16 * 0.25
        }

        return sum
    }

    const fzpPriceValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0
        const isStandard = doorConfig.height > 2101 && doorConfig.width > 1001 ? false : true
     
        const directMatches: Record<number, number> = {
            77: 3347,
            78: 6524,
            79: 6825,
            80: 6809,
            81: 6809,
            82: 4124,
            83: 8807,
            
            61: 6602,
            62: 6602,
            72: 6602,
            73: 6602,

            65: 6327,
            74: 6327,
            75: 6327,
            76: 6327,

            66: 4419,
            67: 4419,
            68: 4419,
            69: 4419,
        }

        sum += directMatches[doorConfig.exterior.panelModel ?? 0]
        sum += (doorConfig.metalPainting.undercoat ? 1 : 0) * (230 + 500)
        sum += (doorConfig.hasStainlessSteelDoorsill ? 1 : 0) * (139 + 500)
        //if nova
        sum += (doorConfig.exterior.panelModel === 82 ? 1 : 0) * 400
        sum += (doorConfig.hasThermalCable ? 230 + 500 : 0)

        if (!isStandard) sum = sum + (sum / 100 * 5)
        
        return sum
    }

    const doubleGlazedGlassPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0
        const panelName = doorCalcStore.doorModels?.find((d) => d.id === doorConfig.exterior.panelModel)?.name ?? ''
        let w = 0, h = 0, glassArea = 0

        if (panelName?.includes('Drevos') || panelName?.includes('Darkwood')) {
            w = doorConfig.width - 597, h = doorConfig.height - 415
            glassArea = h / 1000 * w / 1000
            sum += glassArea * 5000 + glassArea * 1500 + glassArea * 1000
        }
        else if (panelName === 'Senator SP') {
            w = doorConfig.width - 570, h = doorConfig.height - 995
            glassArea = h / 1000 * w / 1000
            sum += glassArea * 7000 + glassArea * 1500 + glassArea * 1000
        }
        else if (panelName === 'Senator Max SP') {
            w = doorConfig.width - 570, h = doorConfig.height - 440
            glassArea = h / 1000 * w / 1000
            sum += glassArea * 7000 + glassArea * 1500 + glassArea * 1000
        }
        else if (panelName === 'Credo SP') {
            w = doorConfig.width - 680, h = doorConfig.height - 350
            glassArea = h / 1000 * w / 1000
            sum += glassArea * 7000 + glassArea * 1500 + glassArea * 1000
        }

        sum = sum * (1 + (w < 200 ? 20 : 0) / 100)
        
        return sum
    }

    const metalPriceValue = (doorConfig: TermoDoorConfig, doorCalcStore: ReturnType<typeof useTermoDoorCalc>) => {
        let sum = 0, temp = 0
        const panelName = doorCalcStore.doorModels?.find((d) => d.id === doorConfig.exterior.panelModel)?.name ?? ''
        const height = doorConfig.height, width = doorConfig.width

        if (panelName === 'Optima') {
            if      (doorConfig.height <  2130 && doorConfig.width <= 1030) sum += 64.7625
            else if (doorConfig.height >= 2130 && doorConfig.height < 2300 && doorConfig.width <= 1030) sum += 69.9435
            else if (doorConfig.height >= 2300) sum += 74.77125
            else if (doorConfig.height <  2130 && doorConfig.width  < 1030) sum += 69.9435

            sum *= 84

            sum += (doorConfig.height > 2120 ? 6.91 : 4.8) * 84
        }
        else if (panelName?.includes('Soros') || panelName?.includes('Veles')) {
            if ((doorConfig.height < 2130 || (doorConfig.height >= 2130 && doorConfig.height < 2300)) && doorConfig.width <= 1030) sum += 51.81 * 84
            else if (doorConfig.height >= 2300) sum += 59.817 * 84

            if ((doorConfig.height < 2300 && doorConfig.width <= 1030) || (doorConfig.height >= 2130 && doorConfig.height < 2300 && doorConfig.width <= 1030)) temp = 24.178
            if (doorConfig.height >= 2300) temp = 24.407

            sum += temp * 84
            
            sum += (doorConfig.height > 2120 ? 6.91 : 4.8) * 84
        }
        else if (panelName === 'Credo') {
            if (height < 2300 && width <= 1030) temp = 25.905
            else if (height >= 2300) temp = 29.4375

            sum += temp * 84

            temp = 0

            if (height < 2130 && width <= 1030) temp = 69.51175
            else if (height >= 2130 && height < 2300 && width <= 1030) temp = 75.55625
            else if (height >= 2300) temp = 82.425

            sum += temp * 84

            temp = 0

            if (height < 2130 && width <= 1030) temp = 6.47625
            else if (height >= 2130 && height < 2300 && width <= 1030) temp = 6.47625
            else if (height >= 2300) temp = 7.359375

            sum += temp * 84

            temp = 0
        }
        else if (panelName === 'Credo SP') sum += (25.905 + 68.6875 + 17.27) * 84
        else if (panelName === 'Imperato') {
            if (height < 2130 && width <= 1030) temp = 77.715
            else if (height >= 2130 && height < 2300 && width <= 1030) temp = 77.715
            else if (height >= 2300) temp = 88.3125

            sum += temp * 84

            sum += (doorConfig.height > 2120 ? 6.91 : 4.8) * 84
        }
        else if (panelName?.includes('Senator')) {
            if (height < 2130 && width <= 1030) temp = 64.7625
            else if (height >= 2130 && height < 2300 && width <= 1030) temp = 69.9435
            else if (height >= 2300) temp = 74.77125
            else if (height <= 2130 && width <= 1030) temp = 67.70625

            sum += temp * 84

            sum += (doorConfig.height > 2120 ? 6.91 : 4.8) * 84 + 5.4 * 84
        }
        else if (panelName?.includes('Darkwood') || panelName?.includes('Drevos')) {
            //=Ifs(И('Термо'!B10<2130;'Термо'!B11<=1030);51,81;И('Термо'!B10>=2130;'Термо'!B10<2300;'Термо'!B11<=1030);51,81;'Термо'!B10>=2300;59,817)
            if (height < 2130 && width <= 1030) temp = 51.81
            else if (height >= 2130 && height < 2300 && width <= 1030) temp = 51.81
            else if (height >= 2300) temp = 59.817

            sum += temp * 84

            sum += (doorConfig.height > 2120 ? 6.91 : 4.8) * 84 + 21.5875 * 84
        }

        return sum
    }

    const difficultyPriceValue = (doorConfig: TermoDoorConfig) => {
        let sum = 0
        const panelId = doorConfig.exterior.panelModel
        const group: Record<number, number> = {
            77: 0,
            78: 7000,
            79: 7000,
            80: 7000,
            81: 7000,
            82: 2000,
            83: 7000,
            61: 7000,
            62: 7000,
            70: 7000,
            71: 7000,
            63: 5000,
            64: 5000,
            72: 5000,
            73: 5000,
            65: 7000,
            74: 7000,
            75: 7000,
            76: 7000,
            66: 5000,
            67: 5000,
            68: 5000,
            69: 5000,
        }

        sum += group[panelId ?? 0]

        return sum
    }

    return {
        getTotalPrice,
    };
});
