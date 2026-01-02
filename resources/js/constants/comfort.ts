export const comfortItems = [
    { name: 'Навес каплевидный', unit: 'шт', price: 49, quantity: 3 },
    { name: 'Заклепки вытяжные диам.4*10 мм, алюминий/сталь', unit: 'шт', price: 0.65, quantity: 4 },
    { name: 'Проволока для полуавтомата', unit: 'кг', price: 130, quantity: 0.4 },
    { name: 'Противосъём приварной', unit: 'шт', price: 3.8, quantity: 3 },
    { name: 'заклепки гаечные М4', unit: 'шт', price: 1, quantity: 1.6 },
    { name: 'обезжириватель, ацетон', unit: 'л', price: 125, quantity: 0.13 },

    { name: '', unit: '', price: 0, quantity: 0 },
];

// Function to calculate the total sum of all items
export const getComfortTotalSum = () => {
    return comfortItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
