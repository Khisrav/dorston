export const comfortItems = [
    { name: 'Навес каплевидный', unit: 'шт', price: 49, quantity: 3 },
    { name: 'Заклепки вытяжные диам.4*10 мм, алюминий/сталь', unit: 'шт', price: 0.65, quantity: 4 },
    { name: 'Проволока для полуавтомата', unit: 'кг', price: 130, quantity: 0.4 },
    { name: 'Противосъём приварной', unit: 'шт', price: 3.8, quantity: 3 },
    { name: 'заклепки гаечные М4', unit: 'шт', price: 1, quantity: 1.6 },
    { name: 'обезжириватель, ацетон', unit: 'л', price: 125, quantity: 0.13 },
    { name: 'Уплотнитель на полотне YJ-A302 (10,8*15)', unit: 'пог. м.', price: 12, quantity: 21 },
    { name: 'Уплотнитель на коробе 12*14', unit: 'пог. м.', price: 23, quantity: 6 },
    { name: 'Заклепки вытяжные диам.4*10 мм, сталь/сталь', unit: '', price: 1.6, quantity: 4 },
    { name: 'Эксцентрик', unit: 'шт', price: 31.4, quantity: 1 },
    { name: 'Нержавейка для эксцентрика', unit: 'шт', price: 4.94, quantity: 1 },
    { name: 'Винт 4*10', unit: 'шт', price: 0.37, quantity: 1 },
    { name: 'Винт 4*40 (под эксцентрик)', unit: '', price: 0.66, quantity: 1 },
    { name: 'Винт 6*100', unit: 'шт', price: 4.6, quantity: 2 },
    { name: 'заглушки под анкерные болты, ЗАП 25', unit: 'шт', price: 2.75, quantity: 6 },
    { name: '', unit: '', price: 0, quantity: 0 },

    { name: '', unit: '', price: 0, quantity: 0 },
];

// Function to calculate the total sum of all items
export const getComfortTotalSum = () => {
    // return comfortItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return 4360.5;
};
