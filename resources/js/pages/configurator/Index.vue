<script setup lang="ts">
import DoorVisualizer from '@/components/Configurator/DoorVisualizer.vue';
import { useDoorCalc } from '@/composables/useDoorCalc';
import AppLayout from '@/layouts/AppLayout.vue';
import { getDoorModelImage, getImageUrl, hasSecondaryMetalPaint } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { DoorModel, Nomenclature, Furniture } from '@/types/configurator';
import { usePage } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import { PlusIcon } from 'lucide-vue-next';
import { SelectButton, InputNumber, Dialog, Drawer, ToggleSwitch, Button, Timeline, Select } from 'primevue';
import { computed, ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useImage } from 'vue-konva';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: dashboard().url,
    },
]

const steps = ref([
    {
        label: 'Дизайн',
        icon: 'pi pi-palette',
    },
    {
        label: 'Цвет плёнки',
        icon: 'pi pi-palette',
    },
    {
        label: 'Цвет металла',
        icon: 'pi pi-palette',
    },
    {
        label: 'Цвет металла',
        icon: 'pi pi-palette',
    },
])

const paints = ref(usePage().props.paints as Nomenclature[])
const doorModels = ref(usePage().props.doorModels as DoorModel[])
const filmColors = ref(usePage().props.filmColors as Nomenclature[])
const furnitures = ref(usePage().props.furnitures as Furniture[])
const locks = ref(usePage().props.locks as { primary: Nomenclature[], secondary: Nomenclature[] })
const handles = ref(usePage().props.handles as Nomenclature[])

const doorCalcStore = useDoorCalc()
doorCalcStore.paints = paints.value
doorCalcStore.doorModels = doorModels.value
doorCalcStore.filmColors = filmColors.value
doorCalcStore.furnitures = furnitures.value
doorCalcStore.handles = handles.value
doorCalcStore.locks = locks.value
doorCalcStore.initializeDefaultConfig()

// Computed properties to filter door models
const exteriorDoorModels = computed(() => {
    return doorCalcStore.doorModels.filter((model: DoorModel) => model.type === 'exterior');
});

const interiorDoorModels = computed(() => {
    return doorCalcStore.doorModels.filter((model: DoorModel) => model.type === 'interior');
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

const primaryLocks = computed(() => doorCalcStore.locks.primary);
const secondaryLocks = computed(() => doorCalcStore.locks.secondary);

// Furniture computed properties
const availableFurnitureShapes = computed(() => {
    const shapes = [...new Set(furnitures.value.map(f => f.shape))];
    return shapes.map(shape => ({
        label: shape === 'rectangular' ? 'Прямоугольная' : shape === 'oval' ? 'Овальная' : shape,
        value: shape
    }));
});

const availableFurnitureColors = computed(() => {
    const colors = [...new Set(furnitures.value.map(f => f.color))];
    return colors.map(color => ({
        label: color === 'gold' ? 'Золото' : 
               color === 'chrome' ? 'Хром' : 
               color === 'bronze' ? 'Бронза' : 
               color === 'black' ? 'Чёрный' : color,
        value: color
    }));
});

const selectedFurnitureSet = computed(() => {
    if (!doorCalcStore.doorConfig.furniture.furnitureSetId) return null;
    return furnitures.value.find(f => f.id === doorCalcStore.doorConfig.furniture.furnitureSetId) ?? null;
});

const filteredFurniture = computed(() => {
    let filtered = furnitures.value;
    
    if (doorCalcStore.doorConfig.furniture.furnitureShape) {
        filtered = filtered.filter(f => f.shape === doorCalcStore.doorConfig.furniture.furnitureShape);
    }
    
    if (doorCalcStore.doorConfig.furniture.furnitureColor) {
        filtered = filtered.filter(f => f.color === doorCalcStore.doorConfig.furniture.furnitureColor);
    }
    
    return filtered;
});

const parametersSummary = computed(() => {
    let doorWidth = doorCalcStore.doorConfig.doorWidth
    let doorHeight = doorCalcStore.doorConfig.doorHeight
    let handleSide = 'Ручка ' + (doorCalcStore.doorConfig.doorHandleSide === 'Left' ? 'слева' : 'справа')
    let boxDesign = (doorCalcStore.doorConfig.doorBoxDesign === 'Opened' ? 'Открытый' : 'Закрытый') + ' короб'
    let doorType = doorCalcStore.doorConfig.doorType === 'Apartment' ? 'Квартирная' : 'Уличная'
    let doorConstructive = doorCalcStore.doorConfig.doorConstructive
    
    return [
        `${doorWidth}x${doorHeight} мм`,
        doorType,
        doorConstructive,
        handleSide,
        boxDesign,
    ]
})

// View mode: exterior or interior
const viewMode = ref<'exterior' | 'interior'>('exterior');

// Drawer States
const showOuterDesignDialog = ref(false);
const showInnerDesignDialog = ref(false);
const showFilmPrimaryDrawer = ref(false);
const showFilmSecondaryDrawer = ref(false);
const showFilmCasingDrawer = ref(false);
const showMetalPrimaryDrawer = ref(false);
const showMetalSecondaryDrawer = ref(false);
const showPrimaryLockDrawer = ref(false);
const showSecondaryLockDrawer = ref(false);

// Computed properties for current side configuration
const currentSideConfig = computed(() => {
    return viewMode.value === 'exterior' ? doorCalcStore.doorConfig.exterior : doorCalcStore.doorConfig.interior;
});

// Computed properties to check if current door model has color options
const currentDoorModel = computed(() => {
    const modelId = currentSideConfig.value.panelModel;
    return doorCalcStore.getDoorModelInfo(modelId);
});

const exteriorDoorModel = computed(() => {
    const modelId = doorCalcStore.doorConfig.exterior.panelModel;
    return doorCalcStore.getDoorModelInfo(modelId);
});

const hasPrimaryFilmColor = computed(() => currentDoorModel.value?.has_primary_film_color ?? false);
const hasSecondaryFilmColor = computed(() => currentDoorModel.value?.has_secondary_film_color ?? false);
const hasCasingFilmColor = computed(() => currentDoorModel.value?.has_casing_film_color ?? false);
const hasPrimaryPaint = computed(() => exteriorDoorModel.value?.has_primary_paint ?? false);
const hasSecondaryPaint = computed(() => exteriorDoorModel.value?.has_secondary_paint ?? false);
</script>

<template>
    <Head title="Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">
            
            <!-- Header Section -->
            <div v-if="!isLoggedIn" class="text-center border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6 lg:pb-8">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black dark:text-white mb-2 sm:mb-3">
                    Конфигуратор <span class="italic">дверей</span>
                </h1>
                <p class="font-serif text-base sm:text-lg text-black/60 dark:text-white/60">
                    Создайте идеальную дверь по вашему вкусу
                </p>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12">
                
                <!-- Left Column: Preview & Parameters -->
                <div class="lg:col-span-7">
                    <div class="sticky top-0 space-y-4">
                        <!-- Visualization Area -->
                        <div class="relative">
                            <div class="sticky top-0">
                                <DoorVisualizer />
                            </div>
                        </div>

                        <!-- Door Parameters Accordion -->
                        <div class="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800">
                            <!-- Accordion Header -->
                            <button @click="isParametersExpanded = !isParametersExpanded"
                                class="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700">
                                <div class="flex-1">
                                    <h3 class="font-serif text-base sm:text-lg text-black dark:text-white mb-1">
                                        Параметры двери
                                    </h3>
                                    <p v-if="!isParametersExpanded"
                                        class="text-xs sm:text-sm hidden sm:block text-black/60 dark:text-white/60">
                                        <span v-for="item in parametersSummary" :key="item">{{ item }} <span class="mx-2 text-xs" v-if="item !== parametersSummary[parametersSummary.length - 1]">●</span></span>
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
                                class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 p-4">
                                
                                <!-- Door Type -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Тип двери
                                    </label>
                                    <SelectButton :options="doorTypeOptions" v-model="doorCalcStore.doorConfig.doorType"
                                        optionLabel="label" optionValue="value" size="small" fluid />
                                </div>

                                <!-- Door Constructive -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Конструктив
                                    </label>
                                    <SelectButton :options="doorConstructiveOptions"
                                        v-model="doorCalcStore.doorConfig.doorConstructive" optionLabel="label"
                                        optionValue="value" size="small" fluid />
                                </div>

                                <!-- Dimensions -->
                                <div>
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Ширина (мм)
                                        </label>
                                        <InputNumber v-model="doorCalcStore.doorConfig.doorWidth" :min="600" :max="3000"
                                            :step="10" showButtons buttonLayout="horizontal"
                                            decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                            fluid suffix="мм" />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Высота (мм)
                                        </label>
                                        <InputNumber v-model="doorCalcStore.doorConfig.doorHeight" :min="600"
                                            :max="3000" :step="10" showButtons buttonLayout="horizontal"
                                            decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                            fluid suffix="мм" />
                                    </div>
                                </div>

                                <!-- Handle Side -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Сторона ручки
                                    </label>
                                    <SelectButton :options="handleSideOptions"
                                        v-model="doorCalcStore.doorConfig.doorHandleSide" optionLabel="label"
                                        optionValue="value" size="small" fluid />
                                </div>

                                <!-- Box Design -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Дизайн короба
                                    </label>
                                    <SelectButton :options="boxDesignOptions"
                                        v-model="doorCalcStore.doorConfig.doorBoxDesign" optionLabel="label"
                                        optionValue="value" size="small" fluid />
                                </div>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                            <div>
                                <span class="font-medium font-sans text-xl">{{ doorCalcStore.total_price }} ₽</span>
                            </div>
                            <Button label="Сохранить конфигурацию" size="large" class="w-full sm:w-auto" />
                        </div>
                    </div>
                </div>

                <!-- Right Column: Options Panel -->
                <div class="lg:col-span-5 space-y-4">
                    <div class="space-y-4">   
                        <!-- View Mode Selector -->
                        <div class="sticky top-0 z-10 bg-white dark:bg-neutral-900">
                            <div class="flex items-center justify-center w-full gap-1 border border-black/10 dark:border-white/10 p-1 rounded-none">
                                <button
                                    @click="viewMode = 'exterior'"
                                    :class="[
                                        'p-2 sm:p-3 rounded-none bg-none dark:bg-none hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 w-full flex items-center justify-center font-serif text-sm sm:text-base tracking-wide',
                                        viewMode === 'exterior' 
                                            ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white' 
                                            : 'text-black/70 dark:text-white/70 hover:bg-black/5 hover:text-black dark:hover:text-white'
                                    ]">
                                    Снаружи
                                </button>
                                <button
                                    @click="viewMode = 'interior'"
                                    :class="[
                                        'p-2 sm:p-3 rounded-none bg-none dark:bg-none hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 w-full flex items-center justify-center font-serif text-sm sm:text-base tracking-wide',
                                        viewMode === 'interior' 
                                            ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white' 
                                            : 'text-black/70 dark:text-white/70 hover:bg-black/5 hover:text-black dark:hover:text-white'
                                    ]">
                                    Изнутри
                                </button>
                            </div>
                        </div>
                        
                        <!-- I. Design Selection -->
                        <div class="space-y-4">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight border-b pb-2 border-black/10 dark:border-white/10">
                                <span class="italic text-neutral-400 mr-2">I.</span> Дизайн отделки
                            </h2>
                            
                            <!-- Single Design Card that changes based on view mode -->
                            <div 
                                @click="viewMode === 'exterior' ? showOuterDesignDialog = true : showInnerDesignDialog = true" 
                                class="group flex flex-row items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                
                                <div class="w-16 bg-neutral-100 dark:bg-neutral-800 relative flex-shrink-0 flex items-center justify-center">
                                    <img v-if="currentSideConfig.panelModel" 
                                        :src="getDoorModelImage(doorCalcStore.getDoorModelInfo(currentSideConfig.panelModel)?.image ?? '')" 
                                        class="h-24 object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </div>

                                <div class="flex flex-col flex-1 items-start justify-center">
                                    <div class="w-full">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5 text-left">
                                            {{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}
                                        </p>
                                        <p class="font-medium text-black dark:text-white font-sans text-left">
                                            {{ doorCalcStore.getDoorModelInfo(currentSideConfig.panelModel)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <Button variant="outlined" size="small" class="w-full mt-2" label="Изменить дизайн" />
                                </div>
                            </div>
                        </div>

                        <!-- II. Film Colors Selection -->
                        <div v-if="hasPrimaryFilmColor || hasSecondaryFilmColor || hasCasingFilmColor" class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    <span class="italic text-neutral-400 mr-2">II.</span> Цвет плёнки
                                </h2>
                                <span class="text-xs font-serif text-neutral-400 italic">
                                    {{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}
                                </span>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <!-- Primary Texture Card -->
                                <div v-if="hasPrimaryFilmColor" @click="showFilmPrimaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="currentSideConfig.primaryTexture" 
                                                :src="getImageUrl(doorCalcStore.getFilmColor(currentSideConfig.primaryTexture)?.image ?? '')" 
                                                class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ currentSideConfig.primaryTexture ? doorCalcStore.getFilmColor(currentSideConfig.primaryTexture)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                                <!-- Secondary Texture Card -->
                                <div v-if="hasSecondaryFilmColor" @click="showFilmSecondaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="currentSideConfig.secondaryTexture" 
                                                :src="getImageUrl(doorCalcStore.getFilmColor(currentSideConfig.secondaryTexture)?.image ?? '')" 
                                                class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ currentSideConfig.secondaryTexture ? doorCalcStore.getFilmColor(currentSideConfig.secondaryTexture)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>

                                <!-- Casing Texture Card -->
                                <!-- <div v-if="hasCasingFilmColor" @click="showFilmCasingDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="currentSideConfig.casingTexture" 
                                                :src="getImageUrl(doorCalcStore.getFilmColor(currentSideConfig.casingTexture)?.image ?? '')" 
                                                class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Цвет наличника</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ currentSideConfig.casingTexture ? doorCalcStore.getFilmColor(currentSideConfig.casingTexture)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div> -->
                            </div>
                        </div>

                        <!-- III. Metal Painting Selection -->
                        <div v-if="viewMode === 'exterior' && (hasPrimaryPaint || hasSecondaryPaint)" class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    <span class="italic text-neutral-400 mr-2">III.</span> Покраска металла
                                </h2>
                            </div>
                            
                            <!-- Undercoat Toggle -->
                            <div v-if="hasPrimaryPaint || hasSecondaryPaint" class="flex items-center justify-between py-2">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Цинкогрунтование</span>
                                <ToggleSwitch v-model="doorCalcStore.doorConfig.metalPainting!.undercoat" />
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <!-- Primary Metal Color Card -->
                                <div v-if="hasPrimaryPaint" @click="showMetalPrimaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.metalPainting?.primaryColor" 
                                                :src="getImageUrl(doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.primaryColor)?.image ?? '')" 
                                                class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ doorCalcStore.doorConfig.metalPainting?.primaryColor ? doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.primaryColor)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>

                                <!-- Secondary Metal Color Card -->
                                <div v-if="hasSecondaryPaint"
                                    @click="showMetalSecondaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.metalPainting?.secondaryColor" 
                                                :src="getImageUrl(doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.secondaryColor)?.image ?? '')" 
                                                class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ doorCalcStore.doorConfig.metalPainting?.secondaryColor ? doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.secondaryColor)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                            </div>
                        </div>

                        <!-- IV. Furniture Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    <span class="italic text-neutral-400 mr-2">IV.</span> Фурнитура
                                </h2>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <!-- Primary Lock Card -->
                                <div @click="showPrimaryLockDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                        <img v-if="doorCalcStore.doorConfig.furniture.primaryLock && doorCalcStore.doorConfig.furniture.primaryLock !== -1" 
                                                :src="getImageUrl(primaryLocks.find(l => l.id === doorCalcStore.doorConfig.furniture.primaryLock)?.image ?? '')" 
                                                class="w-full h-full object-contain p-1" />
                                        <i v-else class="pi pi-lock text-3xl text-neutral-400"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной замок</p>
                                        <p 
                                            v-if="doorCalcStore.doorConfig.furniture.primaryLock && doorCalcStore.doorConfig.furniture.primaryLock !== -1"
                                            class="font-medium truncate text-black dark:text-white">
                                            {{ primaryLocks.find(l => l.id === doorCalcStore.doorConfig.furniture.primaryLock)?.name }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>

                                <!-- Secondary Lock Toggle -->
                                <div class="flex items-center justify-between px-1">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Дополнительный замок</span>
                                    <ToggleSwitch v-model="doorCalcStore.doorConfig.furniture.hasSecondaryLock" />
                                </div>

                                <!-- Secondary Lock Card -->
                                <div v-if="doorCalcStore.doorConfig.furniture.hasSecondaryLock" 
                                    @click="showSecondaryLockDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                        <img v-if="doorCalcStore.doorConfig.furniture.secondaryLock && doorCalcStore.doorConfig.furniture.secondaryLock !== -1" 
                                                :src="getImageUrl(secondaryLocks.find(l => l.id === doorCalcStore.doorConfig.furniture.secondaryLock)?.image ?? '')" 
                                                class="w-full h-full object-contain p-1" />
                                        <i v-else class="pi pi-lock text-3xl text-neutral-400"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный замок</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ doorCalcStore.doorConfig.furniture.secondaryLock && doorCalcStore.doorConfig.furniture.secondaryLock !== -1 ? secondaryLocks.find(l => l.id === doorCalcStore.doorConfig.furniture.secondaryLock)?.name : 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                                <!-- Furniture Shape Selection -->
                                <div>
                                    <Select 
                                        v-model="doorCalcStore.doorConfig.furniture.furnitureShape" 
                                        :options="availableFurnitureShapes" 
                                        optionLabel="label" 
                                        optionValue="value"
                                        placeholder="Выберите форму"
                                        showClear
                                        class="w-full"
                                    />
                                </div>

                                <!-- Furniture Color Selection -->
                                <div>
                                    <Select 
                                        v-model="doorCalcStore.doorConfig.furniture.furnitureColor" 
                                        :options="availableFurnitureColors" 
                                        optionLabel="label" 
                                        optionValue="value"
                                        placeholder="Выберите цвет"
                                        showClear
                                        class="w-full"
                                    />
                                </div>

                                <div class="flex items-center justify-between px-1">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Ночная задвижка + поворотник</span>
                                    <ToggleSwitch />
                                </div>

                                <div class="flex items-center justify-between px-1">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Глазок</span>
                                    <ToggleSwitch />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step timeline -->
                <!-- <div class="lg:col-span-1 border-2 border-black/10 dark:border-white/10 pt-4">
                    <Timeline :value="steps" align="center" :pt="{
                        item: {
                            class: 'flex items-center justify-between'
                        }
                    }"></Timeline>
                </div> -->
            </div>
        </div>
    </AppLayout>

    <!-- DRAWER: Outer Design -->
    <Drawer v-model:visible="showOuterDesignDialog" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Дизайн наружной отделки
                </h2>
            </div>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
            <div v-for="doorModel in exteriorDoorModels" :key="doorModel.id"
                class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                @click="() => { doorCalcStore.doorConfig.exterior.panelModel = doorModel.id; showOuterDesignDialog = false; }">
                <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full rounded-sm">
                <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1" 
                    :class="[doorCalcStore.doorConfig.exterior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400']">
                    {{ doorModel.name }}
                </p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Inner Design -->
    <Drawer v-model:visible="showInnerDesignDialog" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Дизайн внутренней отделки
                </h2>
            </div>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
            <div v-for="doorModel in interiorDoorModels" :key="doorModel.id"
                class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                @click="() => { doorCalcStore.doorConfig.interior.panelModel = doorModel.id; showInnerDesignDialog = false; }">
                <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full h-full object-cover rounded-sm">
                <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1"
                    :class="[doorCalcStore.doorConfig.interior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400']">
                    {{ doorModel.name }}
                </p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Primary Film Color -->
    <Drawer v-model:visible="showFilmPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет плёнки: Основной <span class="text-neutral-400">({{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }})</span>
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx" 
                @click="() => { 
                    if (viewMode === 'exterior') {
                        doorCalcStore.doorConfig.exterior.primaryTexture = panel.id;
                    } else {
                        doorCalcStore.doorConfig.interior.primaryTexture = panel.id;
                    }
                    showFilmPrimaryDrawer = false; 
                }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    currentSideConfig.primaryTexture === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary Film Color -->
    <Drawer v-model:visible="showFilmSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет плёнки: Дополнительный <span class="text-neutral-400">({{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }})</span>
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx" 
                @click="() => { 
                    if (viewMode === 'exterior') {
                        doorCalcStore.doorConfig.exterior.secondaryTexture = panel.id;
                    } else {
                        doorCalcStore.doorConfig.interior.secondaryTexture = panel.id;
                    }
                    showFilmSecondaryDrawer = false; 
                }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    currentSideConfig.secondaryTexture === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Casing Film Color -->
    <Drawer v-model:visible="showFilmCasingDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет плёнки: Наличник <span class="text-neutral-400">({{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }})</span>
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx" 
                @click="() => { 
                    if (viewMode === 'exterior') {
                        doorCalcStore.doorConfig.exterior.casingTexture = panel.id;
                    } else {
                        doorCalcStore.doorConfig.interior.casingTexture = panel.id;
                    }
                    showFilmCasingDrawer = false; 
                }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    currentSideConfig.casingTexture === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Metal Primary Color -->
    <Drawer v-model:visible="showMetalPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Покраска металла: Основной цвет
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in paints" :key="idx" 
                @click="() => { doorCalcStore.doorConfig.metalPainting!.primaryColor = panel.id; showMetalPrimaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    doorCalcStore.doorConfig.metalPainting?.primaryColor === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Metal Secondary Color -->
    <Drawer v-model:visible="showMetalSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Покраска металла: Дополнительный цвет
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in paints" :key="idx" 
                @click="() => { doorCalcStore.doorConfig.metalPainting!.secondaryColor = panel.id; showMetalSecondaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    doorCalcStore.doorConfig.metalPainting?.secondaryColor === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Primary Lock -->
    <Drawer v-model:visible="showPrimaryLockDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Выбор основного замка
            </h2>
        </template>
        <div class="space-y-3 p-1">
            <div v-for="lock in primaryLocks" :key="lock.id" 
                @click="() => { doorCalcStore.doorConfig.furniture.primaryLock = lock.id; showPrimaryLockDrawer = false; }"
                :class="[
                    'group flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300',
                    doorCalcStore.doorConfig.furniture.primaryLock === lock.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                ]">
                <div class="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                    <img v-if="lock.image" 
                            :src="getImageUrl(lock.image)" 
                            :alt="lock.name"
                            class="w-full h-full object-contain p-2" />
                    <i v-else class="pi pi-lock text-4xl text-neutral-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-base text-black dark:text-white mb-1">
                        {{ lock.name }}
                    </p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                        {{ lock.base_price.toLocaleString('ru-RU') }} ₽
                    </p>
                </div>
                <i v-if="doorCalcStore.doorConfig.furniture.primaryLock === lock.id" 
                    class="pi pi-check-circle text-2xl text-black dark:text-white"></i>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary Lock -->
    <Drawer v-model:visible="showSecondaryLockDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Выбор дополнительного замка
            </h2>
        </template>
        <div class="space-y-3 p-1">
            <div v-for="lock in secondaryLocks" :key="lock.id" 
                @click="() => { doorCalcStore.doorConfig.furniture.secondaryLock = lock.id; showSecondaryLockDrawer = false; }"
                :class="[
                    'group flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300',
                    doorCalcStore.doorConfig.furniture.secondaryLock === lock.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                ]">
                <div class="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                    <img v-if="lock.image" 
                            :src="getImageUrl(lock.image)" 
                            :alt="lock.name"
                            class="w-full h-full object-contain p-2" />
                    <i v-else class="pi pi-lock text-4xl text-neutral-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-base text-black dark:text-white mb-1">
                        {{ lock.name }}
                    </p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                        {{ lock.base_price.toLocaleString('ru-RU') }} ₽
                    </p>
                </div>
                <i v-if="doorCalcStore.doorConfig.furniture.secondaryLock === lock.id" 
                    class="pi pi-check-circle text-2xl text-black dark:text-white"></i>
            </div>
        </div>
    </Drawer>
</template>
<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1,
h2,
h3,
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