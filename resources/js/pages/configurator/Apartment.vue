<script setup lang="ts">
import DoorVisualizer from '@/components/Configurator/DoorVisualizer.vue';
import { useDoorCalc } from '@/composables/useDoorCalc';
import AppLayout from '@/layouts/AppLayout.vue';
import { getDoorModelImage, getImageUrl, hasSecondaryMetalPaint, getFurnitureColorImage } from '@/lib/utils';
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
        href: '/configurator',
    },
    {
        title: 'Для квартиры',
        href: '/configurator/apartment',
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
const cylinders = ref(usePage().props.cylinders as Nomenclature[])
const handles = ref(usePage().props.handles as Nomenclature[])

const doorCalcStore = useDoorCalc()
doorCalcStore.paints = paints.value
doorCalcStore.doorModels = doorModels.value
doorCalcStore.filmColors = filmColors.value
doorCalcStore.furnitures = furnitures.value
doorCalcStore.handles = handles.value
doorCalcStore.locks = locks.value
doorCalcStore.cylinders = cylinders.value
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
const isParametersExpanded = ref(true);

// Door type options
const doorTypeOptions = [
    { label: 'Квартирная', value: 'Apartment' },
    { label: 'Для дома', value: 'Street' }
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

const peepholePositionOptions = [
    { label: 'Нет', value: 'None' },
    { label: 'С боку', value: 'Side' },
    { label: 'По центру', value: 'Center' }
];

const primaryLocks = computed(() => doorCalcStore.locks.primary);
const secondaryLocks = computed(() => doorCalcStore.locks.secondary);

// Cylinders computed properties
const availableCylinders = computed(() => {
    return cylinders.value.map(cylinder => ({
        label: cylinder.name,
        value: cylinder.id
    }));
});

const selectedPrimaryCylinder = computed(() => {
    if (!doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism || doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism === -1) return null;
    return cylinders.value.find(c => c.id === doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism) ?? null;
});

const selectedSecondaryCylinder = computed(() => {
    if (!doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism || doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism === -1) return null;
    return cylinders.value.find(c => c.id === doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism) ?? null;
});

// Furniture computed properties
const availableFurnitureColors = computed(() => {
    const colors = [...new Set(furnitures.value.map(f => f.color))];
    return colors.map(color => ({
        label: color === 'gold' ? 'Золото' : 
               color === 'chrome' ? 'Хром' : 
               color === 'bronze' ? 'Бронза' : 
               color === 'black' ? 'Чёрный' : 
               color === 'matte-black' ? 'Матовый чёрный' :
               color === 'matte-chrome' ? 'Матовый хром' : color,
        value: color
    }));
});

const filteredFurnitures = computed(() => {
    if (!doorCalcStore.doorConfig.furniture.furnitureColor) return [];
    return furnitures.value.filter(f => f.color === doorCalcStore.doorConfig.furniture.furnitureColor);
});

const selectedFurnitureSet = computed(() => {
    if (!doorCalcStore.doorConfig.furniture.furnitureSetId) return null;
    return furnitures.value.find(f => f.id === doorCalcStore.doorConfig.furniture.furnitureSetId) ?? null;
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
const showFurnitureDrawer = ref(false);

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
                                <span class="font-medium font-sans text-xl">{{ doorCalcStore.total_price.toFixed(2) }} ₽</span>
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
                                Дизайн отделки
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
                                    Цвет плёнки
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
                                <div v-if="hasCasingFilmColor" @click="showFilmCasingDrawer = true" 
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
                                </div>
                            </div>
                        </div>

                        <!-- III. Metal Painting Selection -->
                        <div v-if="viewMode === 'exterior' && (hasPrimaryPaint || hasSecondaryPaint)" class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    Покраска металла
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

                        <!-- IV. Locks Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    Замки
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

                                <!-- Primary Cylinder Selection -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Основной цилиндр
                                    </label>
                                    <Select 
                                        v-model="doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism" 
                                        :options="availableCylinders" 
                                        optionLabel="label" 
                                        optionValue="value"
                                        placeholder="Выберите цилиндр"
                                        size="small"
                                        showClear
                                        class="w-full"
                                    />
                                    <p v-if="selectedPrimaryCylinder" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                        {{ selectedPrimaryCylinder.base_price.toLocaleString('ru-RU') }} ₽
                                    </p>
                                </div>

                                <!-- Secondary Cylinder Selection (только если выбран дополнительный замок) -->
                                <div v-if="doorCalcStore.doorConfig.furniture.hasSecondaryLock">
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Дополнительный цилиндр <span class="text-red-500">*</span>
                                    </label>
                                    <Select 
                                        v-model="doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism" 
                                        :options="availableCylinders" 
                                        optionLabel="label" 
                                        optionValue="value"
                                        placeholder="Выберите цилиндр"
                                        size="small"
                                        showClear
                                        class="w-full"
                                        :class="{'border-red-500': doorCalcStore.doorConfig.furniture.hasSecondaryLock && (!doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism || doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism === -1)}"
                                    />
                                    <p v-if="selectedSecondaryCylinder" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                        {{ selectedSecondaryCylinder.base_price.toLocaleString('ru-RU') }} ₽
                                    </p>
                                    <p v-if="doorCalcStore.doorConfig.furniture.hasSecondaryLock && (!doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism || doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism === -1)" 
                                        class="text-xs text-red-500 mt-1">
                                        Обязательное поле при выборе дополнительного замка
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- V. Furniture Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    Фурнитура
                                </h2>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <!-- Furniture Color Selection -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-3">
                                        Цвет фурнитуры
                                    </label>
                                    <div class="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        <div 
                                            v-for="colorOption in availableFurnitureColors" 
                                            :key="colorOption.value"
                                            @click="doorCalcStore.doorConfig.furniture.furnitureColor = colorOption.value"
                                            :class="[
                                                'flex flex-col items-center cursor-pointer group transition-all duration-300',
                                                doorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                            ]">
                                            <div 
                                                :class="[
                                                    'relative p-0.5 rounded-full transition-all duration-300 mb-2',
                                                    doorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value 
                                                        ? 'ring-2 ring-black dark:ring-white' 
                                                        : ''
                                                ]">
                                                <div 
                                                    :class="[
                                                        'rounded-full overflow-hidden border transition-all duration-300',
                                                        doorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value 
                                                            ? 'border-transparent' 
                                                            : 'border-black/10 dark:border-white/10 group-hover:border-black/40 dark:group-hover:border-white/40'
                                                    ]">
                                                    <img 
                                                        :src="getFurnitureColorImage(colorOption.value)" 
                                                        :alt="colorOption.label"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <p 
                                                :class="[
                                                    'text-xs text-center font-serif transition-colors duration-300',
                                                    doorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value 
                                                        ? 'text-black dark:text-white font-semibold' 
                                                        : 'text-neutral-500 dark:text-neutral-400'
                                                ]">
                                                {{ colorOption.label }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Selected Furniture Set Card -->
                                <div v-if="doorCalcStore.doorConfig.furniture.furnitureColor && filteredFurnitures.length > 0"
                                    @click="showFurnitureDrawer = true"
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                        <i class="pi pi-palette text-3xl text-neutral-400"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Набор фурнитуры</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            <template v-if="selectedFurnitureSet">
                                                {{ selectedFurnitureSet.shape === 'rectangular' ? 'Прямоугольная' : 
                                                   selectedFurnitureSet.shape === 'oval' ? 'Овальная' : 'Другая' }} - 
                                                {{ selectedFurnitureSet.color === 'gold' ? 'Золото' : 
                                                   selectedFurnitureSet.color === 'chrome' ? 'Хром' : 
                                                   selectedFurnitureSet.color === 'bronze' ? 'Бронза' : 
                                                   selectedFurnitureSet.color === 'black' ? 'Матовый чёрный' : 
                                                   selectedFurnitureSet.color === 'matte-chrome' ? 'Матовый хром' : selectedFurnitureSet.color }}
                                            </template>
                                            <template v-else>Выберите набор</template>
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>

                                <!-- Peephole Position Selection -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                        Глазок
                                    </label>
                                    <SelectButton :options="peepholePositionOptions"
                                        v-model="doorCalcStore.doorConfig.peepholePosition" optionLabel="label"
                                        optionValue="value" size="small" fluid />
                                </div>

                                <!-- Night Latch Turner Toggle -->
                                <div class="flex items-center justify-between px-1">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Ночная задвижка + поворотник</span>
                                    <ToggleSwitch v-model="doorCalcStore.doorConfig.furniture.hasNightLatchTurner" />
                                </div>
                            </div>
                        </div>

                        <!-- VI. Additional Options -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    Доп. опции
                                </h2>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <!-- Stainless Steel Doorsill Toggle -->
                                <div class="flex items-center justify-between px-1">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Порог из нержавейки</span>
                                    <ToggleSwitch v-model="doorCalcStore.doorConfig.stainlessSteelDoorsill" />
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

    <!-- DRAWER: Furniture Set Selection -->
    <Drawer v-model:visible="showFurnitureDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Выбор набора фурнитуры
            </h2>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
            <div v-for="furniture in filteredFurnitures" :key="furniture.id" 
                @click="() => { 
                    doorCalcStore.doorConfig.furniture.furnitureSetId = furniture.id; 
                    doorCalcStore.doorConfig.furniture.furnitureShape = furniture.shape;
                    showFurnitureDrawer = false; 
                }"
                :class="[
                    'group relative p-3 border-2 cursor-pointer transition-all duration-300',
                    doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black/40 dark:hover:border-white/40'
                ]">
                <!-- Selected Check Icon -->
                <div v-if="doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id" 
                    class="absolute top-2 right-2 z-10">
                    <i class="pi pi-check-circle text-xl text-black dark:text-white"></i>
                </div>

                <!-- Shape Title -->
                <p class="font-medium text-sm text-black dark:text-white mb-3 font-serif">
                    {{ furniture.shape === 'rectangular' ? 'Прямоугольная' : furniture.shape === 'oval' ? 'Овальная' : 'Другая' }}
                </p>
                
                <!-- Furniture Images Compact Grid -->
                <div class="grid grid-cols-3 gap-1.5">
                    <div v-if="furniture.handle_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.handle_cover_image)" alt="Ручка" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Ручка</p>
                        <p v-if="furniture.handle_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.handle_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                    <div v-if="furniture.cylindrical_lock_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.cylindrical_lock_cover_image)" alt="Замок" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Замок</p>
                        <p v-if="furniture.cylindrical_lock_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.cylindrical_lock_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                    <div v-if="furniture.peephole_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.peephole_cover_image)" alt="Глазок" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Глазок</p>
                        <p v-if="furniture.peephole_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.peephole_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                    <div v-if="furniture.night_latch_turner_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.night_latch_turner_cover_image)" alt="Задвижка" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Задвижка</p>
                        <p v-if="furniture.night_latch_turner_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.night_latch_turner_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                    <div v-if="furniture.cylinder_rod_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.cylinder_rod_cover_image)" alt="Цилиндр" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Цилиндр</p>
                        <p v-if="furniture.cylinder_rod_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.cylinder_rod_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                    <div v-if="furniture.lever_lock_cover_image" class="flex flex-col items-center">
                        <div class="w-full aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-black/5 flex items-center justify-center p-1">
                            <img :src="getImageUrl(furniture.lever_lock_cover_image)" alt="Сувальда" class="w-full h-full object-contain" />
                        </div>
                        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 text-center leading-tight">Сувальда</p>
                        <p v-if="furniture.lever_lock_price" class="text-[9px] text-neutral-400 dark:text-neutral-500 text-center">
                            {{ furniture.lever_lock_price.toLocaleString('ru-RU') }} ₽
                        </p>
                    </div>
                </div>
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