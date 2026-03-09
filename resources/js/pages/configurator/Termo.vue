<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/vue3';
import type { DoorModel, Furniture, Nomenclature, TermoDoorConfig, doorHandleSide, peepholePosition } from '@/types/configurator';
import { SelectButton, InputNumber, ToggleSwitch, Button, Drawer, Select } from 'primevue';
import { ref, computed } from 'vue';
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc';
import { getDoorModelImage, getImageUrl, getFurnitureColorImage } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
    },
    {
        title: 'Для дома',
        href: '/configurator/termo',
    },
]

const termoDoorCalcStore = useTermoDoorCalc()
console.log(termoDoorCalcStore.doorConfig.exterior.panelModel)

const paints = ref(usePage().props.paints as Nomenclature[])
const doorModels = ref(usePage().props.doorModels as DoorModel[])
const filmColors = ref(usePage().props.filmColors as Nomenclature[])
const furnitures = ref(usePage().props.furnitures as Furniture[])
const locks = ref(usePage().props.locks as { primary: Nomenclature[], secondary: Nomenclature[] })
const cylinders = ref(usePage().props.cylinders as Nomenclature[])
const handles = ref(usePage().props.handles as Nomenclature[])

termoDoorCalcStore.paints = paints.value
termoDoorCalcStore.doorModels = doorModels.value
termoDoorCalcStore.filmColors = filmColors.value
termoDoorCalcStore.furnitures = furnitures.value
termoDoorCalcStore.handles = handles.value
termoDoorCalcStore.locks = locks.value
termoDoorCalcStore.cylinders = cylinders.value
termoDoorCalcStore.initializeDefaultConfig()

const isParametersExpanded = ref(true)
const viewMode = ref<'exterior' | 'interior'>('exterior')

// Drawers
const showExteriorDesignDrawer = ref(false)
const showInteriorDesignDrawer = ref(false)
const showExteriorFilmPrimaryDrawer = ref(false)
const showExteriorFilmSecondaryDrawer = ref(false)
const showMetalPrimaryDrawer = ref(false)
const showMetalSecondaryDrawer = ref(false)
const showInnerCasingColorDrawer = ref(false)
const showGlassExteriorDrawer = ref(false)
const showGlassInteriorDrawer = ref(false)
const showPrimaryLockDrawer = ref(false)
const showSecondaryLockDrawer = ref(false)
const showFurnitureDrawer = ref(false)

const handleSideOptions = [
    { label: 'Левая', value: 'Left' as doorHandleSide },
    { label: 'Правая', value: 'Right' as doorHandleSide },
]

const peepholePositionOptions = [
    { label: 'Нет', value: 'None' as peepholePosition },
    { label: 'С боку', value: 'Side' as peepholePosition },
    { label: 'По центру', value: 'Center' as peepholePosition },
]

const parametersSummary = computed(() => [
    `${termoDoorCalcStore.doorConfig.width}×${termoDoorCalcStore.doorConfig.height} мм`,
    termoDoorCalcStore.doorConfig.handleSide === 'Left' ? 'Ручка слева' : 'Ручка справа',
    termoDoorCalcStore.doorConfig.peepholePosition === 'None' ? 'Без глазка' : termoDoorCalcStore.doorConfig.peepholePosition === 'Side' ? 'Глазок сбоку' : 'Глазок по центру',
])

// Door model lists
const exteriorDoorModels = computed(() =>
    termoDoorCalcStore.doorModels.filter((m: DoorModel) => m.type === 'exterior')
)
const interiorDoorModels = computed(() =>
    termoDoorCalcStore.doorModels.filter((m: DoorModel) => m.type === 'interior')
)

// Current side config for view mode
const currentExteriorConfig = computed(() => termoDoorCalcStore.doorConfig.exterior)
const currentInteriorConfig = computed(() => termoDoorCalcStore.doorConfig.interior)

// Locks
const primaryLocks = computed(() => termoDoorCalcStore.locks.primary)
const secondaryLocks = computed(() => termoDoorCalcStore.locks.secondary)

// Cylinders
const availableCylinders = computed(() =>
    cylinders.value.map(c => ({ label: c.name, value: c.id }))
)
const selectedPrimaryCylinder = computed(() => {
    const id = termoDoorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism
    if (!id || id === -1) return null
    return cylinders.value.find(c => c.id === id) ?? null
})
const selectedSecondaryCylinder = computed(() => {
    const id = termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism
    if (!id || id === -1) return null
    return cylinders.value.find(c => c.id === id) ?? null
})

// Furniture
const availableFurnitureColors = computed(() => {
    const colors = [...new Set(furnitures.value.map(f => f.color))]
    return colors.map(color => ({
        label: color === 'gold' ? 'Золото' :
               color === 'chrome' ? 'Хром' :
               color === 'bronze' ? 'Бронза' :
               color === 'black' ? 'Чёрный' :
               color === 'matte-black' ? 'Матовый чёрный' :
               color === 'matte-chrome' ? 'Матовый хром' : color,
        value: color,
    }))
})
const filteredFurnitures = computed(() => {
    if (!termoDoorCalcStore.doorConfig.furniture.furnitureColor) return []
    return furnitures.value.filter(f => f.color === termoDoorCalcStore.doorConfig.furniture.furnitureColor)
})
const selectedFurnitureSet = computed(() => {
    const id = termoDoorCalcStore.doorConfig.furniture.furnitureSetId
    if (!id || id === -1) return null
    return furnitures.value.find(f => f.id === id) ?? null
})
</script>

<template>
    <Head title="Для дома — Конфигуратор" />
    <!-- <AppLayout :breadcrumbs="breadcrumbs"> -->
        <div class="flex h-full flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12 lg:items-start">

                <!-- Left Column: Preview & Parameters -->
                <div class="lg:col-span-7 lg:sticky lg:top-6 space-y-4">

                        <!-- Visualization placeholder -->
                        <div class="border-2 border-dashed border-black/10 rounded-3xl dark:border-white/10 flex items-center justify-center min-h-72 bg-neutral-50 dark:bg-neutral-800/50">
                            <div class="text-center">
                                <p class="font-serif text-xs uppercase tracking-widest text-black/30 dark:text-white/30 mb-3">Termo</p>
                                <p class="font-serif text-lg text-black/40 dark:text-white/40">Визуализатор</p>
                                <p class="text-xs text-black/25 dark:text-white/25 font-sans mt-1">В разработке</p>
                            </div>
                        </div>

                        <!-- Door Parameters Accordion -->
                        <div class="border-2 border-black/10 rounded-3xl dark:border-white/10 bg-white dark:bg-neutral-800">
                            <button @click="isParametersExpanded = !isParametersExpanded"
                                class="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700">
                                <div class="flex-1">
                                    <h3 class="font-serif text-base sm:text-lg text-black dark:text-white mb-1">
                                        Параметры двери
                                    </h3>
                                    <p v-if="!isParametersExpanded"
                                        class="text-xs sm:text-sm hidden sm:block text-black/60 dark:text-white/60">
                                        <span v-for="(item, i) in parametersSummary" :key="item">
                                            {{ item }}<span v-if="i < parametersSummary.length - 1" class="mx-2 text-xs">●</span>
                                        </span>
                                    </p>
                                </div>
                                <svg :class="['w-5 h-5 text-black dark:text-white transition-transform duration-300', isParametersExpanded ? 'rotate-180' : '']"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div v-show="isParametersExpanded"
                                class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 rounded-3xl dark:border-white/10 p-4">

                                <!-- Width -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Ширина (мм)</label>
                                    <InputNumber v-model="termoDoorCalcStore.doorConfig.width" :min="800" :max="1200" :step="10"
                                        showButtons buttonLayout="horizontal"
                                        decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                        fluid suffix=" мм" />
                                </div>

                                <!-- Height -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Высота (мм)</label>
                                    <InputNumber v-model="termoDoorCalcStore.doorConfig.height" :min="1900" :max="2400" :step="10"
                                        showButtons buttonLayout="horizontal"
                                        decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                        fluid suffix=" мм" />
                                </div>

                                <!-- Handle Side -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Сторона ручки</label>
                                    <SelectButton :options="handleSideOptions" v-model="termoDoorCalcStore.doorConfig.handleSide"
                                        optionLabel="label" optionValue="value" size="small" fluid />
                                </div>

                                <!-- Peephole Position -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Глазок</label>
                                    <SelectButton :options="peepholePositionOptions" v-model="termoDoorCalcStore.doorConfig.peepholePosition"
                                        optionLabel="label" optionValue="value" size="small" fluid />
                                </div>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                            <span>{{ termoDoorCalcStore.total_price }}</span>
                            <Button label="Сохранить" size="large" class="w-full sm:w-auto" disabled />
                        </div>
                </div>

                <!-- Right Column: Options Panel -->
                <div class="lg:col-span-5 space-y-4">

                    <!-- View Mode Selector -->
                    <div class="sticky top-0 z-10 bg-white dark:bg-neutral-900">
                        <div class="flex items-center justify-center w-full gap-1 border border-black/10 rounded-3xl dark:border-white/10 p-1">
                            <button
                                @click="viewMode = 'exterior'"
                                :class="[
                                    'p-2 sm:p-3 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 w-full flex items-center justify-center font-serif text-sm sm:text-base tracking-wide',
                                    viewMode === 'exterior'
                                        ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white'
                                        : 'text-black/70 dark:text-white/70'
                                ]">
                                Снаружи
                            </button>
                            <button
                                @click="viewMode = 'interior'"
                                :class="[
                                    'p-2 sm:p-3 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 w-full flex items-center justify-center font-serif text-sm sm:text-base tracking-wide',
                                    viewMode === 'interior'
                                        ? 'bg-black/5 dark:bg-white/5 text-black dark:text-white'
                                        : 'text-black/70 dark:text-white/70'
                                ]">
                                Изнутри
                            </button>
                        </div>
                    </div>

                    <!-- I. Panel Design -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 rounded-3xl dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Дизайн отделки</h2>
                            <span class="text-xs font-serif text-neutral-400 italic">{{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}</span>
                        </div>
                        <div
                            @click="viewMode === 'exterior' ? showExteriorDesignDrawer = true : showInteriorDesignDrawer = true"
                            class="group flex items-center gap-4 p-3 border-2 border-black/5 rounded-3xl dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                            <div class="w-16 h-24 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center border border-black/10 overflow-hidden">
                                <img v-if="viewMode === 'exterior' && currentExteriorConfig.panelModel"
                                    :src="getDoorModelImage(termoDoorCalcStore.getDoorModelInfo(currentExteriorConfig.panelModel)?.image ?? '')"
                                    class="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                <img v-else-if="viewMode === 'interior' && currentInteriorConfig.panelModel"
                                    :src="getDoorModelImage(termoDoorCalcStore.getDoorModelInfo(currentInteriorConfig.panelModel)?.image ?? '')"
                                    class="h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                <i v-else class="pi pi-image text-2xl text-neutral-300"></i>
                            </div>
                            <div class="flex flex-col flex-1 items-start justify-center">
                                <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
                                    {{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}
                                </p>
                                <p class="font-medium text-black dark:text-white font-sans">
                                    {{ viewMode === 'exterior'
                                        ? (termoDoorCalcStore.getDoorModelInfo(currentExteriorConfig.panelModel)?.name ?? 'Не выбрано')
                                        : (termoDoorCalcStore.getDoorModelInfo(currentInteriorConfig.panelModel)?.name ?? 'Не выбрано') }}
                                </p>
                                <Button variant="outlined" size="small" class="w-full mt-2" label="Изменить дизайн" />
                            </div>
                        </div>
                    </div>

                    <!-- II. Film Colors (exterior only) -->
                    <div v-if="viewMode === 'exterior'" class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 rounded-3xl dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Цвет плёнки</h2>
                            <span class="text-xs font-serif text-neutral-400 italic">Снаружи</span>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div @click="showExteriorFilmPrimaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="currentExteriorConfig.primaryTexture && currentExteriorConfig.primaryTexture !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getFilmColor(currentExteriorConfig.primaryTexture)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ currentExteriorConfig.primaryTexture && currentExteriorConfig.primaryTexture !== -1
                                            ? termoDoorCalcStore.getFilmColor(currentExteriorConfig.primaryTexture)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>

                            <div @click="showExteriorFilmSecondaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="currentExteriorConfig.secondaryTexture && currentExteriorConfig.secondaryTexture !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getFilmColor(currentExteriorConfig.secondaryTexture)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ currentExteriorConfig.secondaryTexture && currentExteriorConfig.secondaryTexture !== -1
                                            ? termoDoorCalcStore.getFilmColor(currentExteriorConfig.secondaryTexture)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                        </div>
                    </div>

                    <!-- III. Metal Painting -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Покраска металла</h2>
                        </div>

                        <!-- Undercoat -->
                        <div class="flex items-center justify-between px-1">
                            <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Цинкогрунтование</span>
                            <ToggleSwitch v-model="termoDoorCalcStore.doorConfig.metalPainting.undercoat" />
                        </div>

                        <div class="grid grid-cols-1 gap-3">
                            <!-- Primary color -->
                            <div @click="showMetalPrimaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.metalPainting.primaryColor && termoDoorCalcStore.doorConfig.metalPainting.primaryColor !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.primaryColor)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.metalPainting.primaryColor && termoDoorCalcStore.doorConfig.metalPainting.primaryColor !== -1
                                            ? termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.primaryColor)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <!-- Secondary color (Nova only) -->
                            <div @click="showMetalSecondaryDrawer = true"
                                v-if="termoDoorCalcStore.doorConfig.exterior.panelModel === 82"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.metalPainting.secondaryColor && termoDoorCalcStore.doorConfig.metalPainting.secondaryColor !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.secondaryColor)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
                                        Дополнительный цвет
                                    </p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.metalPainting.secondaryColor && termoDoorCalcStore.doorConfig.metalPainting.secondaryColor !== -1
                                            ? termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.secondaryColor)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <!-- Inner casing color -->
                            <div @click="showInnerCasingColorDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor && termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Цвет внутренней рамки</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor && termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor !== -1
                                            ? termoDoorCalcStore.getPaintColor(termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                        </div>
                    </div>

                    <!-- IV. Glass Colors -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Стекло</h2>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div @click="showGlassExteriorDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.glassColor.exterior && termoDoorCalcStore.doorConfig.glassColor.exterior !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getFilmColor(termoDoorCalcStore.doorConfig.glassColor.exterior)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-eye text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Стекло снаружи</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.glassColor.exterior && termoDoorCalcStore.doorConfig.glassColor.exterior !== -1
                                            ? termoDoorCalcStore.getFilmColor(termoDoorCalcStore.doorConfig.glassColor.exterior)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div @click="showGlassInteriorDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.glassColor.interior && termoDoorCalcStore.doorConfig.glassColor.interior !== -1"
                                        :src="getImageUrl(termoDoorCalcStore.getFilmColor(termoDoorCalcStore.doorConfig.glassColor.interior)?.image ?? '')"
                                        class="w-full h-full object-cover" />
                                    <i v-else class="pi pi-eye text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Стекло изнутри</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.glassColor.interior && termoDoorCalcStore.doorConfig.glassColor.interior !== -1
                                            ? termoDoorCalcStore.getFilmColor(termoDoorCalcStore.doorConfig.glassColor.interior)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                        </div>
                    </div>

                    <!-- V. Locks -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Замки</h2>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <!-- Primary lock -->
                            <div @click="showPrimaryLockDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.furniture.primaryLock && termoDoorCalcStore.doorConfig.furniture.primaryLock !== -1"
                                        :src="getImageUrl(primaryLocks.find(l => l.id === termoDoorCalcStore.doorConfig.furniture.primaryLock)?.image ?? '')"
                                        class="w-full h-full object-contain p-1" />
                                    <i v-else class="pi pi-lock text-3xl text-neutral-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной замок</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.furniture.primaryLock && termoDoorCalcStore.doorConfig.furniture.primaryLock !== -1
                                            ? primaryLocks.find(l => l.id === termoDoorCalcStore.doorConfig.furniture.primaryLock)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>

                            <!-- Primary cylinder -->
                            <div>
                                <label class="block font-serif text-sm text-black dark:text-white mb-2">Основной цилиндр</label>
                                <Select
                                    v-model="termoDoorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism"
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

                            <!-- Secondary lock toggle -->
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Дополнительный замок</span>
                                <ToggleSwitch v-model="termoDoorCalcStore.doorConfig.furniture.hasSecondaryLock" />
                            </div>

                            <!-- Secondary lock -->
                            <div v-if="termoDoorCalcStore.doorConfig.furniture.hasSecondaryLock"
                                @click="showSecondaryLockDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <img v-if="termoDoorCalcStore.doorConfig.furniture.secondaryLock && termoDoorCalcStore.doorConfig.furniture.secondaryLock !== -1"
                                        :src="getImageUrl(secondaryLocks.find(l => l.id === termoDoorCalcStore.doorConfig.furniture.secondaryLock)?.image ?? '')"
                                        class="w-full h-full object-contain p-1" />
                                    <i v-else class="pi pi-lock text-3xl text-neutral-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный замок</p>
                                    <p class="font-medium truncate text-black dark:text-white">
                                        {{ termoDoorCalcStore.doorConfig.furniture.secondaryLock && termoDoorCalcStore.doorConfig.furniture.secondaryLock !== -1
                                            ? secondaryLocks.find(l => l.id === termoDoorCalcStore.doorConfig.furniture.secondaryLock)?.name
                                            : 'Не выбрано' }}
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>

                            <!-- Secondary cylinder -->
                            <div v-if="termoDoorCalcStore.doorConfig.furniture.hasSecondaryLock">
                                <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                    Дополнительный цилиндр <span class="text-red-500">*</span>
                                </label>
                                <Select
                                    v-model="termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism"
                                    :options="availableCylinders"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Выберите цилиндр"
                                    size="small"
                                    showClear
                                    class="w-full"
                                    :class="{'border-red-500': termoDoorCalcStore.doorConfig.furniture.hasSecondaryLock && (!termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism || termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism === -1)}"
                                />
                                <p v-if="selectedSecondaryCylinder" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {{ selectedSecondaryCylinder.base_price.toLocaleString('ru-RU') }} ₽
                                </p>
                                <p v-if="termoDoorCalcStore.doorConfig.furniture.hasSecondaryLock && (!termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism || termoDoorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism === -1)"
                                    class="text-xs text-red-500 mt-1">
                                    Обязательное поле при выборе дополнительного замка
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- VI. Furniture -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Фурнитура</h2>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <!-- Furniture color picker -->
                            <div>
                                <label class="block font-serif text-sm text-black dark:text-white mb-3">Цвет фурнитуры</label>
                                <div class="grid grid-cols-6 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    <div
                                        v-for="colorOption in availableFurnitureColors"
                                        :key="colorOption.value"
                                        @click="termoDoorCalcStore.doorConfig.furniture.furnitureColor = colorOption.value"
                                        :class="[
                                            'flex flex-col items-center cursor-pointer group transition-all duration-300',
                                            termoDoorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                                        ]">
                                        <div :class="[
                                            'relative p-0.5 rounded-full transition-all duration-300 mb-2',
                                            termoDoorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value ? 'ring-2 ring-black dark:ring-white' : ''
                                        ]">
                                            <div :class="[
                                                'rounded-full overflow-hidden border transition-all duration-300',
                                                termoDoorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value
                                                    ? 'border-transparent'
                                                    : 'border-black/10 dark:border-white/10 group-hover:border-black/40 dark:group-hover:border-white/40'
                                            ]">
                                                <img :src="getFurnitureColorImage(colorOption.value)" :alt="colorOption.label" class="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <p :class="[
                                            'text-xs text-center font-serif transition-colors duration-300',
                                            termoDoorCalcStore.doorConfig.furniture.furnitureColor === colorOption.value
                                                ? 'text-black dark:text-white font-semibold'
                                                : 'text-neutral-500 dark:text-neutral-400'
                                        ]">{{ colorOption.label }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Furniture set card -->
                            <div v-if="termoDoorCalcStore.doorConfig.furniture.furnitureColor && filteredFurnitures.length > 0"
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
                                               selectedFurnitureSet.shape === 'oval' ? 'Овальная' : 'Другая' }} —
                                            {{ selectedFurnitureSet.color === 'gold' ? 'Золото' :
                                               selectedFurnitureSet.color === 'chrome' ? 'Хром' :
                                               selectedFurnitureSet.color === 'bronze' ? 'Бронза' :
                                               selectedFurnitureSet.color === 'black' ? 'Чёрный' :
                                               selectedFurnitureSet.color === 'matte-chrome' ? 'Матовый хром' : selectedFurnitureSet.color }}
                                        </template>
                                        <template v-else>Выберите набор</template>
                                    </p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>

                            <!-- Peephole toggle -->
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Глазок</span>
                                <ToggleSwitch v-model="termoDoorCalcStore.doorConfig.furniture.hasPeephole" />
                            </div>
                            <!-- Night latch turner toggle -->
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Ночная задвижка + поворотник</span>
                                <ToggleSwitch v-model="termoDoorCalcStore.doorConfig.furniture.hasNightLatchTurner" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    <!-- </AppLayout> -->

    <!-- DRAWER: Exterior Design -->
    <Drawer v-model:visible="showExteriorDesignDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">Дизайн наружной отделки</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
            <div v-for="doorModel in exteriorDoorModels" :key="doorModel.id"
                class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                @click="() => { termoDoorCalcStore.doorConfig.exterior.panelModel = doorModel.id; showExteriorDesignDrawer = false; }">
                <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full rounded-sm" />
                <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1"
                    :class="[termoDoorCalcStore.doorConfig.exterior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400']">
                    {{ doorModel.name }}
                </p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Interior Design -->
    <Drawer v-model:visible="showInteriorDesignDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">Дизайн внутренней отделки</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
            <div v-for="doorModel in interiorDoorModels" :key="doorModel.id"
                class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                @click="() => { termoDoorCalcStore.doorConfig.interior.panelModel = doorModel.id; showInteriorDesignDrawer = false; }">
                <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full h-full object-cover rounded-sm" />
                <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1"
                    :class="[termoDoorCalcStore.doorConfig.interior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-neutral-500 dark:text-neutral-400']">
                    {{ doorModel.name }}
                </p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Primary Film Color -->
    <Drawer v-model:visible="showExteriorFilmPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет плёнки: Основной <span class="text-neutral-400">(Снаружи)</span>
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.exterior.primaryTexture = panel.id; showExteriorFilmPrimaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    currentExteriorConfig.primaryTexture === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary Film Color -->
    <Drawer v-model:visible="showExteriorFilmSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет плёнки: Дополнительный <span class="text-neutral-400">(Снаружи)</span>
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.exterior.secondaryTexture = panel.id; showExteriorFilmSecondaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    currentExteriorConfig.secondaryTexture === panel.id
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
                @click="() => { termoDoorCalcStore.doorConfig.metalPainting.primaryColor = panel.id; showMetalPrimaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    termoDoorCalcStore.doorConfig.metalPainting.primaryColor === panel.id
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
                Покраска металла: Дополнительный цвет (Nova)
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in paints" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.metalPainting.secondaryColor = panel.id; showMetalSecondaryDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    termoDoorCalcStore.doorConfig.metalPainting.secondaryColor === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Inner Casing Color -->
    <Drawer v-model:visible="showInnerCasingColorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Цвет внутреннего обрамления
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in paints" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor = panel.id; showInnerCasingColorDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    termoDoorCalcStore.doorConfig.metalPainting.innerCasingColor === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Glass Exterior -->
    <Drawer v-model:visible="showGlassExteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Стекло: Снаружи
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.glassColor.exterior = panel.id; showGlassExteriorDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    termoDoorCalcStore.doorConfig.glassColor.exterior === panel.id
                        ? 'border-black/40 dark:border-white/40 border-2'
                        : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                ]">
                <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Glass Interior -->
    <Drawer v-model:visible="showGlassInteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                Стекло: Изнутри
            </h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
            <div v-for="(panel, idx) in filmColors" :key="idx"
                @click="() => { termoDoorCalcStore.doorConfig.glassColor.interior = panel.id; showGlassInteriorDrawer = false; }"
                :class="[
                    'group cursor-pointer border transition-all duration-300 aspect-video',
                    termoDoorCalcStore.doorConfig.glassColor.interior === panel.id
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
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">Выбор основного замка</h2>
        </template>
        <div class="space-y-3 p-1">
            <div v-for="lock in primaryLocks" :key="lock.id"
                @click="() => { termoDoorCalcStore.doorConfig.furniture.primaryLock = lock.id; showPrimaryLockDrawer = false; }"
                :class="[
                    'group flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300',
                    termoDoorCalcStore.doorConfig.furniture.primaryLock === lock.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                ]">
                <div class="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                    <img v-if="lock.image" :src="getImageUrl(lock.image)" :alt="lock.name" class="w-full h-full object-contain p-2" />
                    <i v-else class="pi pi-lock text-4xl text-neutral-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-base text-black dark:text-white mb-1">{{ lock.name }}</p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ lock.base_price.toLocaleString('ru-RU') }} ₽</p>
                </div>
                <i v-if="termoDoorCalcStore.doorConfig.furniture.primaryLock === lock.id"
                    class="pi pi-check-circle text-2xl text-black dark:text-white"></i>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary Lock -->
    <Drawer v-model:visible="showSecondaryLockDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">Выбор дополнительного замка</h2>
        </template>
        <div class="space-y-3 p-1">
            <div v-for="lock in secondaryLocks" :key="lock.id"
                @click="() => { termoDoorCalcStore.doorConfig.furniture.secondaryLock = lock.id; showSecondaryLockDrawer = false; }"
                :class="[
                    'group flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300',
                    termoDoorCalcStore.doorConfig.furniture.secondaryLock === lock.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                ]">
                <div class="h-20 w-20 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                    <img v-if="lock.image" :src="getImageUrl(lock.image)" :alt="lock.name" class="w-full h-full object-contain p-2" />
                    <i v-else class="pi pi-lock text-4xl text-neutral-400"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-base text-black dark:text-white mb-1">{{ lock.name }}</p>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ lock.base_price.toLocaleString('ru-RU') }} ₽</p>
                </div>
                <i v-if="termoDoorCalcStore.doorConfig.furniture.secondaryLock === lock.id"
                    class="pi pi-check-circle text-2xl text-black dark:text-white"></i>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Furniture Set -->
    <Drawer v-model:visible="showFurnitureDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">Выбор набора фурнитуры</h2>
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
            <div v-for="furniture in filteredFurnitures" :key="furniture.id"
                @click="() => {
                    termoDoorCalcStore.doorConfig.furniture.furnitureSetId = furniture.id;
                    termoDoorCalcStore.doorConfig.furniture.furnitureShape = furniture.shape;
                    showFurnitureDrawer = false;
                }"
                :class="[
                    'group relative p-3 border-2 cursor-pointer transition-all duration-300',
                    termoDoorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id
                        ? 'border-black dark:border-white bg-black/5 dark:bg-white/5'
                        : 'border-black/10 dark:border-white/10 hover:border-black/40 dark:hover:border-white/40'
                ]">
                <div v-if="termoDoorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id"
                    class="absolute top-2 right-2 z-10">
                    <i class="pi pi-check-circle text-xl text-black dark:text-white"></i>
                </div>
                <p class="font-medium text-sm text-black dark:text-white mb-3 font-serif">
                    {{ furniture.shape === 'rectangular' ? 'Прямоугольная' : furniture.shape === 'oval' ? 'Овальная' : 'Другая' }}
                </p>
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
h1, h2, h3, button {
    font-family: 'Google Sans', sans-serif;
}

:deep(.p-selectbutton) {
    display: flex;
    width: 100%;
}

:deep(.p-selectbutton .p-button) {
    flex: 1;
    font-family: 'Google Sans', sans-serif;
    font-size: 0.875rem;
}

:deep(.p-inputnumber) {
    width: 100%;
    display: flex;
}

:deep(.p-inputnumber-input) {
    font-family: 'Google Sans', sans-serif;
    font-size: 0.875rem;
}

:deep(.p-inputnumber-button .p-icon) {
    width: 1rem;
    height: 1rem;
}
</style>
