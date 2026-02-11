import { getComfortTotalSum } from '@/constants/comfort';
import {
    getPaintPrice,
    isDoorPanelStandard,
    isDoorStandard,
    isMetallicDoor,
} from '@/lib/utils';
import { DoorConfig } from '@/types/configurator';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDoorCalc } from '../useDoorCalc';

export const useComfortConstructive = defineStore('comfortConstructive', () => {
    const total_price = ref(0);

    const staticPriceValues = getComfortTotalSum();

    const getTotalPrice = (isStandard: boolean, doorConfig: DoorConfig) => {
        const doorCalcStore = useDoorCalc();

        total_price.value = 0;
        total_price.value += staticPriceValues;
        //цинкогрунт и цвет
        total_price.value += powderPriceValue(doorConfig);
        //Уникальное [Неменяемое]
        total_price.value += changeablePricesValue(doorConfig);
        //Закрыть короб
        total_price.value += closedBoxPriceValue(doorConfig);
        //Дополнительно крепеж если ПП
        total_price.value += isMetallicDoor(doorConfig)
            ? 0
            : 100 * 0.18 + 4 * 1.6;
        //Замок
        total_price.value += locksPriceValue(doorConfig, doorCalcStore);
        //Фурнитура
        total_price.value += furniturePriceValue(doorConfig, doorCalcStore);
        //Наружная МДФ-панель
        total_price.value += exteriorPanelsPriceValue(
            doorConfig,
            doorCalcStore,
        );

        return total_price.value;
    };

    //расчет наружных панелей
    const exteriorPanelsPriceValue = (
        doorConfig: DoorConfig,
        doorCalcStore: ReturnType<typeof useDoorCalc>,
    ) => {
        const doorModel = doorCalcStore.doorModels?.find(
            (m) => m.id === doorConfig.exterior.panelModel,
        );
        const modelName = doorModel?.name;

        //Модуль расчёта панелей на наружнюю отделку [Без вставки]
        let basePriceValue = 0;
        //МДФ t=10 мм, м2
        basePriceValue +=
            (isDoorPanelStandard(
                doorConfig.doorWidth,
                doorConfig.doorHeight,
                true,
            )
                ? 1.932
                : 2.89) * 272;
        console.log(
            isDoorPanelStandard(
                doorConfig.doorWidth,
                doorConfig.doorHeight,
                true,
            )
                ? 1.932
                : 2.89,
            272,
            basePriceValue,
        );
        //клей, Наждачная бумага, м2, Губка шлифовальная, Колер, Упаковка, накладные расходы, Зарплата панель, Заложенная сложность
        basePriceValue +=
            0.15 * 1000 +
            0.005 * 214 +
            0.05 * 60 +
            0.018 * 55 +
            1 * 30 +
            1 * 734 +
            1 * 65;
        //заложенная сложность
        const difficultyPrice = (modelName: string | undefined) => {
            let result = 0;
            switch (modelName) {
                case "ВС-19":
                case "ВС-38":
                case "ВС-6":
                case "ВС-22":
                    result = 800;
                    break;
                case "ВС-17":
                case "ВС-13":
                case "ВС-24":
                case "ВС-45":
                case "ВС-49":
                case "ВС-50":
                case "ВС-43":
                case "ВС-52":
                case "ВС-34":
                    result = 1000;
                    break;
                case "ВС-44":
                case "ВС-41":
                case "ВС-47":
                case "ВС-30":
                    result = 600;
                    break;
                case "Stark":
                case "Verso":
                case "Forta":
                case "Kombi":
                default:
                    result = 0;
                    break;
            }
            return result;
        };
        basePriceValue += difficultyPrice(modelName);
        //цвет выбранной пленки
        const filmColorPrice = doorCalcStore.filmColors?.find(
            (f) => f.id === doorConfig.exterior.primaryTexture,
        )?.base_price;
        basePriceValue +=
            (isDoorPanelStandard(
                doorConfig.doorWidth,
                doorConfig.doorHeight,
                true,
            )
                ? 3.5
                : 4.55) * (filmColorPrice ?? 0);
        console.log(
            isDoorPanelStandard(
                doorConfig.doorWidth,
                doorConfig.doorHeight,
                true,
            )
                ? 3.5
                : 4.55,
            filmColorPrice,
            basePriceValue,
        );

        let sum = basePriceValue;

        if (!isDoorStandard(doorConfig.doorWidth, doorConfig.doorHeight)) {
            switch (modelName) {
                case 'BC-6':
                    sum += 0;
                    break;
                case 'BC-13':
                    sum += 0;
                    break;
                case 'BC-17':
                    sum += 0;
                    break;
                case 'BC-19':
                    sum += 0;
                    break;
                case 'BC-22':
                    sum += 0;
                    break;
                case 'BC-24':
                    sum += 0;
                    break;
                case 'BC-38':
                    sum += 0;
                    break;
                case 'BC-44':
                    sum += 0;
                    break;
                case 'BC-45':
                    sum += 0;
                    break;
            }

            return sum;
        } else {
            const qntTemp =
                modelName === 'BC-6' ||
                modelName === 'BC-13' ||
                modelName === 'BC-17' ||
                modelName === 'BC-19' ||
                modelName === 'BC-22' ||
                modelName === 'BC-24' ||
                modelName === 'BC-38' ||
                modelName === 'BC-44' ||
                modelName === 'BC-45' ||
                modelName === 'Kombi' ||
                modelName === 'Forta' ||
                modelName === 'Verso' ||
                modelName === 'Stark' ||
                modelName === undefined
                    ? 0
                    : 1;
            sum += qntTemp * 0;
            return sum;
        }
    };

    const locksPriceValue = (
        doorConfig: DoorConfig,
        doorCalcStore: ReturnType<typeof useDoorCalc>,
    ) => {
        let sum = 0;

        // Primary lock price
        if (
            doorConfig.furniture.primaryLock &&
            doorConfig.furniture.primaryLock !== -1
        ) {
            const primaryLock = doorCalcStore.locks.primary.find(
                (l) => l.id === doorConfig.furniture.primaryLock,
            );
            if (primaryLock) {
                sum += primaryLock.base_price;
            }
        }

        // Secondary lock price (if enabled)
        if (
            doorConfig.furniture.hasSecondaryLock &&
            doorConfig.furniture.secondaryLock &&
            doorConfig.furniture.secondaryLock !== -1
        ) {
            const secondaryLock = doorCalcStore.locks.secondary.find(
                (l) => l.id === doorConfig.furniture.secondaryLock,
            );
            if (secondaryLock) {
                sum += secondaryLock.base_price;
            }
        }

        // Primary cylinder price
        if (
            doorConfig.furniture.primaryCylindricalLockMechanism &&
            doorConfig.furniture.primaryCylindricalLockMechanism !== -1
        ) {
            const primaryCylinder = doorCalcStore.cylinders.find(
                (c) =>
                    c.id ===
                    doorConfig.furniture.primaryCylindricalLockMechanism,
            );
            if (primaryCylinder) {
                sum += primaryCylinder.base_price;
            }
        }

        // Secondary cylinder price (if enabled)
        if (
            doorConfig.furniture.hasSecondaryLock &&
            doorConfig.furniture.secondaryCylindricalLockMechanism &&
            doorConfig.furniture.secondaryCylindricalLockMechanism !== -1
        ) {
            const secondaryCylinder = doorCalcStore.cylinders.find(
                (c) =>
                    c.id ===
                    doorConfig.furniture.secondaryCylindricalLockMechanism,
            );
            if (secondaryCylinder) {
                sum += secondaryCylinder.base_price;
            }
        }

        return sum;
    };

    const furniturePriceValue = (
        doorConfig: DoorConfig,
        doorCalcStore: ReturnType<typeof useDoorCalc>,
    ) => {
        let sum = 0;

        return sum;
    };

    const changeablePricesValue = (doorConfig: DoorConfig) => {
        let sum = 0;
        //E4
        if (doorConfig.doorHeight <= 2050 && doorConfig.doorWidth <= 960) {
            sum += 43.175;
        } else if (
            doorConfig.doorHeight <= 2050 &&
            doorConfig.doorWidth > 960 &&
            doorConfig.doorWidth <= 1050
        ) {
            sum += 47.4925;
        } else if (
            doorConfig.doorHeight > 2050 &&
            doorConfig.doorHeight <= 2130 &&
            doorConfig.doorWidth <= 1050
        ) {
            sum += 47.4925;
        } else if (doorConfig.doorHeight > 2130) {
            sum += 49.06;
        }
        sum *= 84;
        //E5
        sum += (doorConfig.doorWidth >= 2120 ? 6.91 : 4.8) * 84;
        //E40
        sum +=
            ((((doorConfig.doorHeight - 127) / 1000) *
                (doorConfig.doorWidth - 128)) /
                1000) *
            0.05 *
            2300;
        //E41
        sum +=
            ((((doorConfig.doorHeight - 127) / 1000) *
                (doorConfig.doorWidth - 128)) /
                1000) *
            0.03 *
            3250;
        //E44
        sum += (doorConfig.furniture.hasNightLatchTurner ? 1 : 0) * 64;
        //E60
        sum +=
            (doorConfig.doorHeight <= 2050
                ? 4
                : doorConfig.doorHeight <= 2100
                  ? 6
                  : 9) * 50;
        return sum;
    };

    const powderPriceValue = (doorConfig: DoorConfig) =>
        doorConfig.exterior.panelModel !== 37 ? getPaintPrice(doorConfig) : 0; // verso

    const closedBoxPriceValue = (doorConfig: DoorConfig) =>
        doorConfig.doorBoxDesign === 'Closed' ? 7.56 * 84 + 0.035 * 2300 : 0; // E75+E76

    return {
        getTotalPrice,
    };
});
