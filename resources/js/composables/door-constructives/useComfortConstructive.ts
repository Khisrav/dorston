import { getComfortTotalSum } from '@/constants/comfort';
import { getPaintPrice, isDoorPanelStandard, isDoorStandard, isMetallicDoor } from '@/lib/utils';
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
        console.log('Стандартное [Неменяемое]', staticPriceValues);
        //цинкогрунт и цвет
        total_price.value += powderPriceValue(doorConfig);
        console.log('Цинкогрунт и цвет', powderPriceValue(doorConfig));
        //Уникальное [Неменяемое]
        total_price.value += changeablePricesValue(doorConfig);
        console.log('Уникальное [Неменяемое]', changeablePricesValue(doorConfig));
        //Закрыть короб
        total_price.value += closedBoxPriceValue(doorConfig);
        console.log('Закрыть короб', closedBoxPriceValue(doorConfig));
        //Дополнительно крепеж если ПП
        total_price.value += isMetallicDoor(doorConfig) ? 0 : 100 * 0.18 + 4 * 1.6;
        console.log('Дополнительно крепеж если ПП', isMetallicDoor(doorConfig) ? 0 : 100 * 0.18 + 4 * 1.6);
        //Замок
        total_price.value += locksPriceValue(doorConfig, doorCalcStore);
        console.log('Замок', locksPriceValue(doorConfig, doorCalcStore));
        //Фурнитура
        total_price.value += furniturePriceValue(doorConfig, doorCalcStore);
        console.log('Фурнитура', furniturePriceValue(doorConfig, doorCalcStore));
        //Наружная МДФ-панель
        total_price.value += exteriorPanelsPriceValue(doorConfig, doorCalcStore);
        console.log('Наружная МДФ-панель', exteriorPanelsPriceValue(doorConfig, doorCalcStore));
        //Внутренняя МДФ-панель
        total_price.value += interiorPanelsPriceValue(doorConfig, doorCalcStore);
        console.log('Внутренняя МДФ-панель', interiorPanelsPriceValue(doorConfig, doorCalcStore));
        //Модуль расчёта МДФ-наличников [Г-Образные]
        total_price.value += mdfGObraznyeNalichnikiPriceValue(doorConfig, doorCalcStore);
        console.log('Модуль расчёта МДФ-наличников [Г-Образные]', mdfGObraznyeNalichnikiPriceValue(doorConfig, doorCalcStore));
        //доп элементы отделки
        total_price.value += additionalElementsOfDecorationPriceValue(doorConfig, doorCalcStore);
        console.log('Доп элементы отделки', additionalElementsOfDecorationPriceValue(doorConfig, doorCalcStore));
        //Цинкогрунт если Verso и ZN
        total_price.value += doorConfig.exterior.panelModel === 37 && doorConfig.metalPainting.undercoat ? (isDoorStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 1 : 1.1) * 420 : 0;
        console.log('Цинкогрунт если Verso и ZN', doorConfig.exterior.panelModel === 37 && doorConfig.metalPainting.undercoat ? (isDoorStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 1 : 1.1) * 420 : 0);

        return total_price.value;
    };

    //расчет наружных панелей
    const exteriorPanelsPriceValue = ( doorConfig: DoorConfig, doorCalcStore: ReturnType<typeof useDoorCalc> ) => {
        const doorModel = doorCalcStore.doorModels?.find((m) => m.id === doorConfig.exterior.panelModel);
        const modelName = doorModel?.name;

        //Модуль расчёта панелей на наружнюю отделку [Без вставки]
        let basePriceValue = (includeMDF: boolean = true) => {
            let result = 0;

            //МДФ t=10 мм, м2
            if (includeMDF) {
                // console.log('МДФ t=10 мм, м2', (isDoorPanelStandard( doorConfig.doorWidth, doorConfig.doorHeight, true ) ? 1.932 : 2.89) * 272);
                result += (isDoorPanelStandard( doorConfig.doorWidth, doorConfig.doorHeight, true ) ? 1.932 : 2.89) * 272;
            }
            //клей, Наждачная бумага, м2, Губка шлифовальная, Колер, Упаковка, накладные расходы, Зарплата панель, Заложенная сложность
            result += 0.15 * 1000 + 0.005 * 214 + 0.05 * 60 + 0.018 * 55 + 1 * 30 + 1 * 734 + 1 * 65;
            // console.log('Мелочь', 0.15 * 1000 + 0.005 * 214 + 0.05 * 60 + 0.018 * 55 + 1 * 30 + 1 * 734 + 1 * 65);
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
            result += difficultyPrice(modelName);
            // console.log('Заложенная сложность', difficultyPrice(modelName));
            //цвет выбранной пленки
            let filmColorPrice = doorCalcStore.filmColors?.find((f) => f.id === doorConfig.exterior.primaryTexture)?.base_price;
            result += (isDoorPanelStandard( doorConfig.doorWidth, doorConfig.doorHeight, true, ) ? 3.5 : 4.55) * (filmColorPrice ?? 0);
            // console.log('Цвет выбранной пленки', (isDoorPanelStandard( doorConfig.doorWidth, doorConfig.doorHeight, true, ) ? 3.5 : 4.55) * (filmColorPrice ?? 0));
            return result;
        };

        let sum = 0

        if (['ВС-6', 'ВС-13', 'ВС-17', 'ВС-19', 'ВС-22', 'ВС-24', 'ВС-38', 'ВС-44', 'ВС-45', 'Kombi', 'Forta', 'Verso', 'Stark'].includes(modelName ?? '') || modelName === undefined) {
            const secondaryFilmColorPrice = doorCalcStore.filmColors?.find((f) => f.id === doorConfig.exterior.secondaryTexture)?.base_price;
            switch (modelName) {
                case "ВС-6":
                    sum += basePriceValue(true);
                    //МДФ t=6 мм, м2
                    sum += 0.645 * 154.59
                    // console.log('МДФ t=6 мм, м2', 0.645 * 154.59);
                    //Стекло
                    sum += (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 0.0612 : 0.0669) * 1400
                    // console.log('Стекло', (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 0.0612 : 0.0669) * 1400);
                    //Обработка
                    sum += (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 4.14 : 4.52) * 60
                    // console.log('Обработка', (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 4.14 : 4.52) * 60);
                    //Цвет выбранной доп пленки
                    sum += (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 3.5 : 4.9) * (secondaryFilmColorPrice ?? 0);
                    // console.log('Цвет выбранной доп пленки', (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 3.5 : 4.9) * (secondaryFilmColorPrice ?? 0));
                    //Клей 88, Скотч двухсторонний
                    sum += 0.1 * 430 + 1 * 2.1
                    // console.log('Клей 88, Скотч двухсторонний', 0.1 * 430 + 1 * 2.1);
                    break;
                case "ВС-13":
                    sum += basePriceValue(true);
                    //МДФ t=6 мм, м2
                    sum += 0.966 * 154.59
                    // console.log('МДФ t=6 мм, м2', 0.966 * 154.59);
                    //зарплата [плюс к стандарту A182]
                    sum += 1 * 25
                    // console.log('зарплата [плюс к стандарту A182]', 1 * 25);
                    //Клей 88
                    sum += 0.1 * 430
                    break;
                case "ВС-17":
                    sum += 0;
                    break;
                case "ВС-19":
                    sum += 0;
                    break;
                case "ВС-22":
                    sum += 0;
                    break;
                case "ВС-24":
                    sum += 0;
                    break;
                case "ВС-38":
                    sum += 0;
                    break;
                case "ВС-44":
                    sum += 0;
                    break;
                case "ВС-45":
                    sum += 0;
                    break;
                default:
                    sum += 0;
                    break;
            }

            return sum;
        } else {
            sum = basePriceValue(true);
            return sum;
        }
    };

    //расчет внутренних панелей
    const interiorPanelsPriceValue = (doorConfig: DoorConfig, doorCalcStore: ReturnType<typeof useDoorCalc>) => {
        let sum = 0;
        const isStandard = doorConfig.doorHeight > 2052 ? false : true;
    
        // МДФ t=10 мм, м2 - сюда же вшита 12мм мдф под панели с зеркалами, upd вшита 16мм
        const modelName = doorCalcStore.doorModels?.find((m) => m.id === doorConfig.interior.panelModel)?.name;
        const mdfPriceConditions = [
            {
                check: ['Ф-3', 'Ф-11', 'Ф-20', 'Ф-31', 'Ф-36', 'Ф-37', 'Ф-48', 'Ф-64', 'Ф-71', 'Ф-75', 'Ф-88', 'Ф-95', 'Ф-99',
                        'Ф-21', 'Ф-22', 'Ф-23', 'Ф-26', 'Ф-42', 'Ф-24', 'Ф-30', 'Ф-32', 'Ф-76', 'Ф-79', 'ГЛ-1'],
                price: 272 //'Управление'!.E64
            },
            {
                check: ['ФЗ-1', 'ФЗ-6', 'ФЗ-7', 'ФЗ-8'],
                price: 290.89 //'Управление'!.E78
            },
            {
                check: ['Без панели'],
                price: 0
            },
            {
                check: ['Ф-62'],
                price: 375 //'Управление'!.B159
            }
        ];
        function getMdfPrice(value: string | undefined) {
            if (!value) return 0
            for (const condition of mdfPriceConditions) {
                if (condition.check.includes(value)) return condition.price
            }
            return 0
        }
        const mdf_price = getMdfPrice(modelName);
        sum += (isStandard ? 1.932 : 2.89) * mdf_price;
        // console.log('МДФ t=10 мм, м2', (isStandard ? 1.932 : 2.89) * mdf_price);

        //Клей, Наждачная бумага, м2, Губка шлифовальная, Колер, Упаковка, накладные расходы, Зарплата панель
        sum += 0.15 * 1000 + 0.005 * 214 + 0.05 * 60 + 0.018 * 55 + 1 * 20 + 1 * 734 + 1 * 65;

        //Заложенная сложность
        const difficultyPrice = (modelName: string | undefined) => {
            let result = 0;
            switch(modelName) {
                case 'Ф-3':
                case 'Ф-11':
                case 'Ф-20':
                case 'Ф-31':
                case 'Ф-37':
                case 'Ф-88':
                case 'Ф-95':
                case 'Ф-99':
                case 'Ф-26':
                case 'Ф-42':
                case 'Ф-24':
                case 'Ф-79':
                    return 700;
                case 'Ф-36':
                case 'Ф-48':
                case 'Ф-64':
                case 'Ф-21':
                case 'Ф-22':
                case 'Ф-23':
                case 'Ф-30':
                case 'ГЛ-1':
                case 'Ф-62':
                    return 500;
                case 'Ф-76':
                case 'ФЗ-1':
                case 'ФЗ-6':
                case 'ФЗ-7':
                case 'ФЗ-8':
                    return 900;
                default:
                    return 0; // or a default value if needed
            }
        };
        sum += 1 * difficultyPrice(modelName);

        //Цвет выбранной пленки
        const primaryFilmColorPrice = doorCalcStore.filmColors?.find((f) => f.id === doorConfig.interior.primaryTexture)?.base_price;
        sum += (isStandard ? 3.5 : 4.55) * (primaryFilmColorPrice ?? 0);
        // console.log('Цвет выбранной пленки', (isStandard ? 3.5 : 4.55) * (primaryFilmColorPrice ?? 0));

        //Стекло+обработка
        const qntTemp = (modelName: string | undefined) => {
            switch(modelName) {
                case 'Ф-24':
                case 'Ф-30':
                    return 2
                case 'Ф-32':
                    return 1.5
                case 'Ф-79':
                    return 1
                default:
                    return 0
            }
        }
        sum += qntTemp(modelName) * (isStandard ? 315 : 366)
        // console.log('Стекло+обработка', qntTemp(modelName) * (isStandard ? 315 : 366))

        //Клей 88
        const glueConsumption = (modelName: string | undefined) => {
            switch(modelName) {
                case 'Ф-24':
                case 'Ф-30':
                    return 0.1;
                case 'Ф-32':
                    return 0.15;
                case 'Ф-79':
                    return 0.05;
                case 'ФЗ-1':
                case 'ФЗ-6':
                case 'ФЗ-7':
                case 'ФЗ-8':
                    return 0.4;
                default:
                    return 0;
            }
        }
        sum += glueConsumption(modelName) * 430
        // console.log('Клей 88', glueConsumption(modelName) * 430)

        //Стекло Ф-30
        if (modelName === 'Ф-30') {
            sum += (isStandard ? 0.12084 : 0.12864) * 1400
            // console.log('Стекло Ф-30', (isStandard ? 0.12084 : 0.12864) * 1400)
        }

        return sum;
    };

    //Модуль расчёта МДФ-наличников [Г-Образные]
    const mdfGObraznyeNalichnikiPriceValue = (doorConfig: DoorConfig, doorCalcStore: ReturnType<typeof useDoorCalc>) => {
        let sum = 0;
        const modelName = doorCalcStore.doorModels?.find((m) => m.id === doorConfig.interior.panelModel)?.name;
        //МДФ t=10 мм, м2
        sum += (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight, true) ? 0.82 : 1) * 272
        // console.log('МДФ t=10 мм, м2', (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight, true) ? 0.82 : 1) * 272)

        //Цвет пленки наличника
        const primaryFilmColorPrice = doorCalcStore.filmColors?.find((f) => f.id === doorConfig.interior.primaryTexture)?.base_price;
        sum += (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight, true) ? 3.5 : 4.55) * (primaryFilmColorPrice ?? 0);
        // console.log('Цвет пленки наличника', (isDoorPanelStandard(doorConfig.doorWidth, doorConfig.doorHeight, true) ? 3.5 : 4.55) * (primaryFilmColorPrice ?? 0))

        //Клей, Наждачная бумага, м2, Губка шлифовальная, Колер, Упаковка, накладные расходы, Зарплата
        sum += 0.15 * 1000 + 0.001 * 214 + 0.05 * 60 + 0.018 * 55 + 1 * 20 + 1 * 734 + 1 * 75;
        // console.log('Мелочь', 0.15 * 1000 + 0.001 * 214 + 0.05 * 60 + 0.018 * 55 + 1 * 20 + 1 * 734 + 1 * 75);

        const difficultyPrice = (modelName: string) => ({'BC-45':500, 'BC-24':400, 'BC-13':400, 'BC-6':300, 'BC-22':300, 'BC-41':300, 'BC-46':300, 'BC-47':300, 'BC-32':300, 'BC-48':300, 'BC-49':300, 'BC-50':300, 'BC-43':300, 'BC-51':300, 'НФ-6':300, 'BC-52':300, 'BC-34':300, 'BC-30':300, 'BC-44':300, 'BC-19':300, 'BC-38':300, 'ВС-17':300}[modelName] || 0)
        sum += 1 * difficultyPrice(modelName ?? '');
        // console.log('Заложенная сложность', difficultyPrice(modelName ?? ''));

        return sum;
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

    const noChangeablePricesValue = (doorConfig: DoorConfig) => {
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

    const powderPriceValue = (doorConfig: DoorConfig) => doorConfig.exterior.panelModel !== 37 ? getPaintPrice(doorConfig) : 0; // verso

    const closedBoxPriceValue = (doorConfig: DoorConfig) =>
        doorConfig.doorBoxDesign === 'Closed' ? 7.56 * 84 + 0.035 * 2300 : 0; // E75+E76

    const additionalElementsOfDecorationPriceValue = (doorConfig: DoorConfig, doorCalcStore: ReturnType<typeof useDoorCalc>) => {
        let sum = 0;
        const modelName = doorCalcStore.doorModels?.find((m) => m.id === doorConfig.interior.panelModel)?.name;
        const primaryMetalColorPrice = doorCalcStore.paints?.find((f) => f.id === doorConfig.metalPainting.primaryColor)?.base_price;
        const secondaryMetalColorPrice = doorCalcStore.paints?.find((f) => f.id === doorConfig.metalPainting.secondaryColor)?.base_price;

        switch(modelName) {
            case 'Verso':
                //Накладка N1 1,4 мм (2200*1250)
                sum += (doorConfig.doorHeight > 2250 ? 6.86875 : 6.0445) * 84
                //Основной цвет металла
                sum += 1 * (primaryMetalColorPrice ?? 0)
                //Доп цвет металла
                sum += 1 * (secondaryMetalColorPrice ?? 0)
                //Шпильки+гайки
                sum += 25 * 2.52
                break;
            case 'Forta':
                //Элемент нержавейка(матовая ) Форта 0,6 мм (895*226) с листа 2000*1000
                sum += 1.82 * 187
                //Накладной элемент Форта 1 мм (2200*1250)
                sum += 2.15875 * 84
                //Доп цвет металла
                sum += 0.1 * (secondaryMetalColorPrice ?? 0)
                //Шпильки+Гайка М4+Шайба М4
                sum += 12 * (1.93 + 0.59 + 1.61)
                break;
            case 'Stark':
                //Накладка N2 1,4мм
                sum += 6.04 * 84
                //Доп цвет металла
                sum += 0.1 * (secondaryMetalColorPrice ?? 0)
                //Шпильки+Гайки 
                sum += 38 * 2.52
                break;
            default:
                sum += 0
                break;
        }

        return sum;
    };

    return {
        getTotalPrice,
    };
});
