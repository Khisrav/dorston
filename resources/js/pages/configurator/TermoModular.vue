<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import type { ModularTermoDoorConfig, doorHandleSide, peepholePosition } from '@/types/configurator';
import { SelectButton, InputNumber, ToggleSwitch, Button, Drawer } from 'primevue';
import { reactive, ref, computed } from 'vue';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
    },
    {
        title: 'Для дома',
        href: '/configurator/termo',
    },
    {
        title: 'Модульная',
        href: '/configurator/termo/modular',
    },
]

const config = reactive<ModularTermoDoorConfig>({
    hasTopModule: false,
    hasLeftModule: false,
    hasRightModule: false,
    topSize: 400,
    leftSize: 300,
    rightSize: 300,
    topWithGlass: true,
    leftWithGlass: true,
    rightWithGlass: true,
    config: {
        width: 960,
        height: 2050,
        handleSide: 'Right',
        peepholePosition: 'Side',
        interior: { panelModel: 0 },
        exterior: { panelModel: 0, primaryTexture: 0, secondaryTexture: 0 },
        metalPainting: { undercoat: false, primaryColor: 0, innerCasingColor: 0 },
        glassColor: { exterior: 0, interior: 0 },
        furniture: {
            hasSecondaryLock: false,
            hasPeephole: true,
            hasNightLatchTurner: false,
        },
    },
})

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

const handleSideOptions = [
    { label: 'Левая', value: 'Left' as doorHandleSide },
    { label: 'Правая', value: 'Right' as doorHandleSide },
]

const peepholePositionOptions = [
    { label: 'Нет', value: 'None' as peepholePosition },
    { label: 'С боку', value: 'Side' as peepholePosition },
    { label: 'По центру', value: 'Center' as peepholePosition },
]

const activeModuleCount = computed(() =>
    [config.hasTopModule, config.hasLeftModule, config.hasRightModule].filter(Boolean).length
)

const parametersSummary = computed(() => [
    `${config.config.width}×${config.config.height} мм`,
    config.config.handleSide === 'Left' ? 'Ручка слева' : 'Ручка справа',
    `${activeModuleCount.value} модул${activeModuleCount.value === 1 ? 'ь' : activeModuleCount.value < 5 ? 'я' : 'ей'}`,
])
</script>

<template>
    <Head title="Для дома Модульная — Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12">

                <!-- Left Column: Preview & Parameters -->
                <div class="lg:col-span-7">
                    <div class="sticky top-0 space-y-4">

                        <!-- Visualization placeholder -->
                        <div class="border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center min-h-72 bg-neutral-50 dark:bg-neutral-800/50">
                            <div class="text-center">
                                <p class="font-serif text-xs uppercase tracking-widest text-black/30 dark:text-white/30 mb-3">Termo — Модульная</p>
                                <p class="font-serif text-lg text-black/40 dark:text-white/40">Визуализатор</p>
                                <p class="text-xs text-black/25 dark:text-white/25 font-sans mt-1">В разработке</p>
                            </div>
                        </div>

                        <!-- Door Parameters Accordion -->
                        <div class="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800">
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
                                class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 p-4">

                                <!-- Width -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Ширина (мм)</label>
                                    <InputNumber v-model="config.config.width" :min="800" :max="1200" :step="10"
                                        showButtons buttonLayout="horizontal"
                                        decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                        fluid suffix=" мм" />
                                </div>

                                <!-- Height -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Высота (мм)</label>
                                    <InputNumber v-model="config.config.height" :min="1900" :max="2400" :step="10"
                                        showButtons buttonLayout="horizontal"
                                        decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                        incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                        fluid suffix=" мм" />
                                </div>

                                <!-- Handle Side -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Сторона ручки</label>
                                    <SelectButton :options="handleSideOptions" v-model="config.config.handleSide"
                                        optionLabel="label" optionValue="value" size="small" fluid />
                                </div>

                                <!-- Peephole Position -->
                                <div>
                                    <label class="block font-serif text-sm text-black dark:text-white mb-2">Глазок</label>
                                    <SelectButton :options="peepholePositionOptions" v-model="config.config.peepholePosition"
                                        optionLabel="label" optionValue="value" size="small" fluid />
                                </div>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                            <Button label="Сохранить" size="large" class="w-full sm:w-auto" disabled />
                        </div>
                    </div>
                </div>

                <!-- Right Column: Options Panel -->
                <div class="lg:col-span-5 space-y-4">

                    <!-- View Mode Selector -->
                    <div class="sticky top-0 z-10 bg-white dark:bg-neutral-900">
                        <div class="flex items-center justify-center w-full gap-1 border border-black/10 dark:border-white/10 p-1">
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

                    <!-- 0. Modules -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Модули</h2>
                            <span class="text-xs font-serif text-neutral-400 italic">
                                {{ activeModuleCount > 0 ? `${activeModuleCount} активн${activeModuleCount === 1 ? 'ый' : 'ых'}` : 'Не выбраны' }}
                            </span>
                        </div>

                        <div class="space-y-3">
                            <!-- Top module -->
                            <div class="border-2 border-black/5 dark:border-white/5 p-3 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Верхний модуль</span>
                                    <ToggleSwitch v-model="config.hasTopModule" />
                                </div>
                                <Transition name="slide">
                                    <div v-if="config.hasTopModule" class="grid grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label class="block font-serif text-xs text-black/60 dark:text-white/60 mb-1">Высота (мм)</label>
                                            <InputNumber v-model="config.topSize" :min="200" :max="700" :step="10"
                                                showButtons buttonLayout="horizontal"
                                                decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                                fluid />
                                        </div>
                                        <div class="flex items-end pb-1">
                                            <div class="flex items-center justify-between w-full">
                                                <span class="font-serif text-xs text-neutral-700 dark:text-neutral-300">Со стеклом</span>
                                                <ToggleSwitch v-model="config.topWithGlass" />
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Left module -->
                            <div class="border-2 border-black/5 dark:border-white/5 p-3 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Левый модуль</span>
                                    <ToggleSwitch v-model="config.hasLeftModule" />
                                </div>
                                <Transition name="slide">
                                    <div v-if="config.hasLeftModule" class="grid grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label class="block font-serif text-xs text-black/60 dark:text-white/60 mb-1">Ширина (мм)</label>
                                            <InputNumber v-model="config.leftSize" :min="100" :max="500" :step="10"
                                                showButtons buttonLayout="horizontal"
                                                decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                                fluid />
                                        </div>
                                        <div class="flex items-end pb-1">
                                            <div class="flex items-center justify-between w-full">
                                                <span class="font-serif text-xs text-neutral-700 dark:text-neutral-300">Со стеклом</span>
                                                <ToggleSwitch v-model="config.leftWithGlass" />
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Right module -->
                            <div class="border-2 border-black/5 dark:border-white/5 p-3 space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Правый модуль</span>
                                    <ToggleSwitch v-model="config.hasRightModule" />
                                </div>
                                <Transition name="slide">
                                    <div v-if="config.hasRightModule" class="grid grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label class="block font-serif text-xs text-black/60 dark:text-white/60 mb-1">Ширина (мм)</label>
                                            <InputNumber v-model="config.rightSize" :min="100" :max="500" :step="10"
                                                showButtons buttonLayout="horizontal"
                                                decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                                fluid />
                                        </div>
                                        <div class="flex items-end pb-1">
                                            <div class="flex items-center justify-between w-full">
                                                <span class="font-serif text-xs text-neutral-700 dark:text-neutral-300">Со стеклом</span>
                                                <ToggleSwitch v-model="config.rightWithGlass" />
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>

                    <!-- I. Panel Design -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Дизайн отделки</h2>
                            <span class="text-xs font-serif text-neutral-400 italic">{{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}</span>
                        </div>
                        <div
                            @click="viewMode === 'exterior' ? showExteriorDesignDrawer = true : showInteriorDesignDrawer = true"
                            class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                            <div class="w-16 h-24 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center border border-black/10">
                                <i class="pi pi-image text-2xl text-neutral-300"></i>
                            </div>
                            <div class="flex flex-col flex-1 items-start justify-center">
                                <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
                                    {{ viewMode === 'exterior' ? 'Снаружи' : 'Изнутри' }}
                                </p>
                                <p class="font-medium text-black dark:text-white font-sans">Не выбрано</p>
                                <Button variant="outlined" size="small" class="w-full mt-2" label="Выбрать дизайн" />
                            </div>
                        </div>
                    </div>

                    <!-- II. Film Colors (exterior only) -->
                    <div v-if="viewMode === 'exterior'" class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Цвет плёнки</h2>
                            <span class="text-xs font-serif text-neutral-400 italic">Снаружи</span>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div @click="showExteriorFilmPrimaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div @click="showExteriorFilmSecondaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
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
                        <div class="flex items-center justify-between px-1">
                            <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Цинкогрунтование</span>
                            <ToggleSwitch v-model="config.config.metalPainting.undercoat" />
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div @click="showMetalPrimaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div @click="showMetalSecondaryDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">
                                        Дополнительный цвет <span class="text-neutral-400 normal-case">(Nova)</span>
                                    </p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div @click="showInnerCasingColorDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Цвет внутреннего обрамления</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
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
                                    <i class="pi pi-eye text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Стекло снаружи</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div @click="showGlassInteriorDrawer = true"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-eye text-2xl text-neutral-300"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Стекло изнутри</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
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
                            <div class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-lock text-3xl text-neutral-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Основной замок</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Дополнительный замок</span>
                                <ToggleSwitch v-model="config.config.furniture.hasSecondaryLock" />
                            </div>
                            <div v-if="config.config.furniture.hasSecondaryLock"
                                class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-lock text-3xl text-neutral-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Дополнительный замок</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                        </div>
                    </div>

                    <!-- VI. Furniture -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">Фурнитура</h2>
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                <div class="h-16 w-16 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10 flex items-center justify-center">
                                    <i class="pi pi-palette text-3xl text-neutral-400"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-serif text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Набор фурнитуры</p>
                                    <p class="font-medium truncate text-black dark:text-white">Не выбрано</p>
                                </div>
                                <i class="pi pi-chevron-right text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                            </div>
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Глазок</span>
                                <ToggleSwitch v-model="config.config.furniture.hasPeephole" />
                            </div>
                            <div class="flex items-center justify-between px-1">
                                <span class="font-serif text-sm text-neutral-700 dark:text-neutral-300">Ночная задвижка + поворотник</span>
                                <ToggleSwitch v-model="config.config.furniture.hasNightLatchTurner" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </AppLayout>

    <!-- Placeholder drawers -->
    <Drawer v-model:visible="showExteriorDesignDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Дизайн наружной отделки</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showInteriorDesignDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Дизайн внутренней отделки</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showExteriorFilmPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Цвет плёнки: Основной</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showExteriorFilmSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Цвет плёнки: Дополнительный</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showMetalPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Покраска металла: Основной цвет</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showMetalSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Покраска металла: Дополнительный цвет (Nova)</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showInnerCasingColorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Цвет внутреннего обрамления</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showGlassExteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Стекло: Снаружи</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
    </Drawer>

    <Drawer v-model:visible="showGlassInteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px]">
        <template #header>
            <h2 class="text-base sm:text-lg text-black dark:text-white tracking-tight font-serif">Стекло: Изнутри</h2>
        </template>
        <div class="flex items-center justify-center h-48 text-neutral-400 font-serif">В разработке</div>
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

.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.2s ease, max-height 0.25s ease;
    max-height: 200px;
    overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    max-height: 0;
}
</style>
