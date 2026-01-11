<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Nomenclature } from '@/types/configurator';
import { usePage } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import { SelectButton, InputNumber, Dialog, Drawer } from 'primevue';
import { computed, ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useImage } from 'vue-konva';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: dashboard().url,
    },
]

const paints = usePage().props.paints
// const doorModels = usePage().props.doorModels
const doorModels = [
    {
        name: 'Kombi',
        image: '/assets/door-models/apartment/Kombi.png',
    },
    {
        name: 'Verso',
        image: '/assets/door-models/apartment/Verso.png',
    },
    {
        name: 'Forta',
        image: '/assets/door-models/apartment/Forta.png',
    },
    {
        name: 'Stark',
        image: '/assets/door-models/apartment/Stark.png',
    },
    {
        name: 'ВС-6',
        image: '/assets/door-models/apartment/ВС-6.png',
    },
    {
        name: 'ВС-45',
        image: '/assets/door-models/apartment/ВС-45.png',
    },
]

const doorCalcStore = useDoorCalc()
doorCalcStore.paints = paints as Nomenclature[]

// Door component arrays
const panels = [
    '/assets/конструктор/океанская зелень.webp',
    '/assets/конструктор/полотно чистое.webp',
    '/assets/panels/Шпат грей.png',
];

const millings = [
    '/assets/конструктор/океанская зелень фреза.webp',
    '/assets/конструктор/фреза один.webp',
    '/assets/конструктор/фреза два.webp',
    '/assets/millings/фреза artline.png',
];

const casings = [
    '/assets/конструктор/наличник мдф.webp',
    '/assets/конструктор/наличник.webp',
    '/assets/casings/муар черный.png',
];

const fittings = [
    '/assets/конструктор/фурнитура.webp',
    '/assets/fittings/efitting.png',
];

const decorations = [
    '',
    '/assets/decorative-elements/decoration.png',
];

const selectedDoorParameters = ref({
    panel: panels[0],
    milling: millings[0],
    casing: casings[0],
    decoration: decorations[0],
    fitting: fittings[0],
});

const isLoggedIn = computed(() => {
    if (!usePage().props.auth) return null;
    return usePage().props.auth.user !== null;
});

// Accordion state for door parameters
const isParametersExpanded = ref(false);

// Door type options
const doorTypeOptions = [
    { label: 'Квартирная', value: 'Apartment' },
    { label: 'Уличная', value: 'Street' }
];

const doorConstructiveOptions = [
    { label: 'Comfort', value: 'Comfort' },
    { label: 'Absolut', value: 'Absolut' },
    { label: 'Termo', value: 'Termo' }
];

const handleSideOptions = [
    { label: 'Левая', value: 'Left' },
    { label: 'Правая', value: 'Right' }
];

const boxDesignOptions = [
    { label: 'Открытый', value: 'Opened' },
    { label: 'Закрытый', value: 'Closed' }
];

const showOuterDesignDialog = ref(false);
const showInnerDesignDialog = ref(false);
</script>

<template>

    <Head title="Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div
            class="flex h-full flex-1 flex-col gap-4 sm:gap-6 lg:gap-8 overflow-x-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">
            <!-- Header Section -->
            <div v-if="!isLoggedIn"
                class="text-center border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6 lg:pb-8">
                <h1
                    class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black dark:text-white mb-2 sm:mb-3">
                    Конфигуратор <span class="italic">дверей</span>
                </h1>
                <p class="font-serif text-base sm:text-lg text-black/60 dark:text-white/60">
                    Создайте идеальную дверь по вашему вкусу
                </p>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-12">
                <!-- Preview Panel -->
                <div class="lg:col-span-7">
                    <div class="sticky top-0 space-y-4">
                        <!-- Door Parameters Accordion -->
                        <div class="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800">
                            <!-- Accordion Header -->
                            <button @click="isParametersExpanded = !isParametersExpanded"
                                class="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700">
                                <div class="flex-1">
                                    <h3 class="font-serif text-base sm:text-lg text-black dark:text-white mb-1">
                                        Параметры двери
                                    </h3>
                                    <p v-if="!isParametersExpanded"
                                        class="font-serif text-xs sm:text-sm text-black/60 dark:text-white/60">
                                        {{ parametersSummary }}
                                    </p>
                                </div>
                                <svg :class="['w-5 h-5 text-black dark:text-white transition-transform duration-300', isParametersExpanded ? 'rotate-180' : '']"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Accordion Content -->
                            <div v-show="isParametersExpanded"
                                class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 p-4 sm:p-6 space-y-4 sm:space-y-5">
                                <!-- Door Type -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Тип двери
                                    </label>
                                    <SelectButton :options="doorTypeOptions" v-model="doorCalcStore.doorConfig.doorType"
                                        optionLabel="label" optionValue="value" class="w-full" />
                                </div>

                                <!-- Door Constructive -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Конструктив
                                    </label>
                                    <SelectButton :options="doorConstructiveOptions"
                                        v-model="doorCalcStore.doorConfig.doorConstructive" optionLabel="label"
                                        optionValue="value" class="w-full" />
                                </div>

                                <!-- Dimensions -->
                                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Ширина (мм)
                                        </label>
                                        <InputNumber v-model="doorCalcStore.doorConfig.doorWidth" :min="600" :max="3000"
                                            :step="10" showButtons buttonLayout="horizontal"
                                            decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                            class="w-full" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Высота (мм)
                                        </label>
                                        <InputNumber v-model="doorCalcStore.doorConfig.doorHeight" :min="600"
                                            :max="3000" :step="10" showButtons buttonLayout="horizontal"
                                            decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                            class="w-full" />
                                    </div>
                                </div>

                                <!-- Handle Side -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Сторона ручки
                                    </label>
                                    <SelectButton :options="handleSideOptions"
                                        v-model="doorCalcStore.doorConfig.doorHandleSide" optionLabel="label"
                                        optionValue="value" class="w-full" />
                                </div>

                                <!-- Box Design -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Дизайн короба
                                    </label>
                                    <SelectButton :options="boxDesignOptions"
                                        v-model="doorCalcStore.doorConfig.doorBoxDesign" optionLabel="label"
                                        optionValue="value" class="w-full" />
                                </div>
                            </div>
                        </div>

                        <div ref="containerRef"
                            class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                            <!-- Decorative frame -->
                            <!-- <div class="absolute inset-4 border border-black/5 dark:border-white/5"></div> -->

                            <!-- Konva Canvas -->
                            <div class=" z-10 flex justify-center items-center">
                                <img :src="`/assets/door-models/apartment/${doorCalcStore.doorConfig.exterior.panelModel}.png`" class="w-32" alt="">
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                            <div>
                                <span class="font-medium font-sans">{{ doorCalcStore.total_price }} ₽</span>
                            </div>

                            <button
                                class="px-6 sm:px-8 py-2.5 sm:py-3 font-serif text-xs sm:text-sm tracking-[0.15em] uppercase text-white bg-black dark:bg-white dark:text-black border border-black dark:border-white transition-all duration-300 hover:tracking-[0.2em]">
                                Сохранить конфигурацию
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Options Panel -->
                <div class="lg:col-span-5 space-y-4 sm:space-y-6">
                    <!-- Model Selection -->
                    <div class="border-l-2 border-black dark:border-white pl-4 sm:pl-6 space-y-2">
                        <h2
                            class="font-serif text-xl sm:text-2xl text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">I.</span> Дизайн отделки
                        </h2>
                        <div class="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <Button variant="outlined" label="Наружная" class="w-full"
                                    @click="showOuterDesignDialog = true" />
                            </div>
                            <div>
                                <Button variant="outlined" label="Внутренняя" class="w-full"
                                    @click="showInnerDesignDialog = true" />
                            </div>
                        </div>
                        <p class="text-black sm:text-sm dark:text-white tracking-tight">
                            Выбрано: <span class="font-medium instrument-sans">{{ doorCalcStore.doorConfig.exterior.panelModel }}</span>
                        </p>
                    </div>

                    <!-- Texture Selection -->
                    <div class="border-l-2 border-black dark:border-white pl-4 sm:pl-6">
                        <h2
                            class="font-serif text-xl sm:text-2xl text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">II.</span> Цвет плёнки
                        </h2>
                        <div>
                            <label
                                class="block font-serif text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Основной
                                цвет</label>
                        </div>
                        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div v-for="(panel, idx) in panels" :key="idx" @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border overflow-hidden transition-all duration-300 aspect-video',
                                    selectedDoorParameters.panel === panel
                                        ? 'border-black dark:border-white border-4'
                                        : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 border-2'
                                ]">
                                <img :src="panel" :alt="panel.split('/').pop()" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <!-- <br> -->
                        <div><label
                                class="block font-serif text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Дополнительный
                                цвет</label></div>
                        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div v-for="(panel, idx) in panels" :key="idx" @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border overflow-hidden transition-all duration-300 aspect-video',
                                    selectedDoorParameters.panel === panel
                                        ? 'border-black dark:border-white border-4'
                                        : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 border-2'
                                ]">
                                <img :src="panel" :alt="panel.split('/').pop()" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div><label
                                class="block font-serif text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Цвет
                                наличника</label></div>
                        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                            <div v-for="(panel, idx) in panels" :key="idx" @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border overflow-hidden transition-all duration-300 aspect-video',
                                    selectedDoorParameters.panel === panel
                                        ? 'border-black dark:border-white border-4'
                                        : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 border-2'
                                ]">
                                <img :src="panel" :alt="panel.split('/').pop()" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <!-- Metal Painting Selection -->
                    <div class="border-l-2 border-black dark:border-white pl-4 sm:pl-6">
                        <h2
                            class="font-serif text-xl sm:text-2xl text-black dark:text-white mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">III.</span> Покраска металла
                        </h2>
                        <!-- undercoat toggle -->
                        <SelectButton :options="['Цинкогрунтование', 'Нет']"
                            v-model="doorCalcStore.doorConfig.metalPainting.undercoat" class="w-full mb-4" />
                        <div>
                            <label
                                class="block font-serif text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Основной
                                цвет</label>
                        </div>
                        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div v-for="(panel, idx) in panels" :key="idx" @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border overflow-hidden transition-all duration-300 aspect-video',
                                    selectedDoorParameters.panel === panel
                                        ? 'border-black dark:border-white border-4'
                                        : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 border-2'
                                ]">
                                <img :src="panel" :alt="panel.split('/').pop()" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <!-- <br> -->
                        <div><label
                                class="block font-serif text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">Дополнительный
                                цвет</label></div>
                        <div class="grid grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                            <div v-for="(panel, idx) in panels" :key="idx" @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border overflow-hidden transition-all duration-300 aspect-video',
                                    selectedDoorParameters.panel === panel
                                        ? 'border-black dark:border-white border-4'
                                        : 'border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 border-2'
                                ]">
                                <img :src="panel" :alt="panel.split('/').pop()" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <p>Замок</p>
                    <p>Механизм замка</p>
                    <p>Фурнитура</p>
                </div>
            </div>
        </div>
    </AppLayout>

    <Drawer v-model:visible="showOuterDesignDialog" position="right" class="md:!min-w-256">
        <template #header>
            <div class="flex items-center gap-2">
                <h2 class="text-black sm:text-xl dark:text-white tracking-tight">
                    Дизайн наружной отделки
                </h2>
            </div>
        </template>
        <div class="grid grid-cols-5 gap-3 sm:gap-4">
            <div v-for="doorModel in doorModels" :key="doorModel.name"
                class="flex flex-col items-center justify-center gap-2 pb-2 cursor-pointer"
                @click="() => {
                    doorCalcStore.doorConfig.exterior.panelModel = doorModel.name;
                    showOuterDesignDialog = false;
                }">
                <img :src="doorModel.image" :alt="doorModel.name" class="w-full h-full object-cover">
                <p class="font-medium tracking-tight text-center transition-colors duration-300" :class="[
                    doorCalcStore.doorConfig.exterior.panelModel === doorModel.name
                        ? 'text-black dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                ]">
                    {{ doorModel.name }}
                </p>
            </div>
        </div>

    </Drawer>

    <Drawer v-model:visible="showInnerDesignDialog" position="right">
        <h2 class="text-black dark:text-white tracking-tight">
            Дизайн внутренней отделки
        </h2>
    </Drawer>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1,
h2,
h3,
p,
button {
    font-family: 'Playfair Display', serif;
}

/* PrimeVue SelectButton customization */
:deep(.p-selectbutton) {
    display: flex;
    width: 100%;
}

:deep(.p-selectbutton .p-button) {
    flex: 1;
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
}

/* PrimeVue InputNumber customization */
:deep(.p-inputnumber) {
    width: 100%;
    display: flex;
}

:deep(.p-inputnumber-input) {
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
}

:deep(.p-inputnumber-button .p-icon) {
    width: 1rem;
    height: 1rem;
}
</style>