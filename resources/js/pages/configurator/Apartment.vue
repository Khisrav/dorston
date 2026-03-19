<script setup lang="ts">
import DoorVisualizer from '@/components/Configurator/DoorVisualizer.vue';
import ConstructiveCard from '@/components/Configurator/Card/ConstructiveCard.vue';
import { useDoorCalc } from '@/composables/useDoorCalc';
import { useDoorVisual } from '@/composables/useDoorVisual';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { getDoorModelImage, getImageUrl } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { DoorModel, Nomenclature, Furniture, DoorCombinationImage } from '@/types/configurator';
import { Link, router, usePage } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import { SelectButton, InputNumber, Drawer, ToggleSwitch, Button } from 'primevue';
import { computed, ref, watch, onMounted } from 'vue';
import ExteriorCard from '@/components/Configurator/Card/ExteriorCard.vue';
import InteriorCard from '@/components/Configurator/Card/InteriorCard.vue';
import FurnitureCard from '@/components/Configurator/Card/FurnitureCard.vue';
import LockerCard from '@/components/Configurator/Card/LockerCard.vue';

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


const parametersSummary = computed(() => {
    let doorWidth = doorCalcStore.doorConfig.doorWidth
    let doorHeight = doorCalcStore.doorConfig.doorHeight
    let handleSide = 'Ручка ' + (doorCalcStore.doorConfig.doorHandleSide === 'Left' ? 'слева' : 'справа')
    let boxDesign = (doorCalcStore.doorConfig.doorBoxDesign === 'Opened' ? 'Открытый' : 'Закрытый') + ' короб'
    // let doorType = doorCalcStore.doorConfig.doorType === 'Apartment' ? 'Квартирная' : 'Уличная'
    let doorConstructive = doorCalcStore.doorConfig.doorConstructive
    
    return [
        `${doorWidth}x${doorHeight} мм`,
        // doorType,
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

const doorVisualStore = useDoorVisual();

function fetchDoorCombinations(exteriorModelId: number | undefined, interiorModelId: number | undefined) {
    const modelIds = [exteriorModelId, interiorModelId].filter((id): id is number => !!id);

    if (modelIds.length === 0) return;

    doorVisualStore.isCombinationsLoading = true;

    router.reload({
        data: { door_model_ids: modelIds },
        only: ['doorCombinationImages'],
        onSuccess: (page) => {
            doorVisualStore.doorCombinationImages = (page.props.doorCombinationImages as DoorCombinationImage[]) ?? [];
            console.log('doorCombinationImages set to', doorVisualStore.doorCombinationImages);
        },
        onFinish: () => {
            doorVisualStore.isCombinationsLoading = false;
        },
    });
}

onMounted(() => {
    fetchDoorCombinations(doorCalcStore.doorConfig.exterior.panelModel, doorCalcStore.doorConfig.interior.panelModel);
});

watch(
    [
        () => doorCalcStore.doorConfig.exterior.panelModel,
        () => doorCalcStore.doorConfig.interior.panelModel,
    ],
    ([exteriorModelId, interiorModelId]) => {
        fetchDoorCombinations(exteriorModelId, interiorModelId);
    },
);
</script>

<template>
    <Head title="Конфигуратор" />
    <PublicLayout>
        <div class="flex h-full max-w-7xl mx-auto flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">
            
            <!-- Header Section -->
            <div class="text-center pb-4 sm:pb-6 lg:pb-8">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-2 sm:mb-3 font-bold">Конфигуратор дверей</h1>
                <p class="font-serif text-base sm:text-lg text-black/60">
                    Создайте идеальную дверь в квартиру по вашему вкусу
                </p>
                <div class="flex gap-2 flex-col sm:flex-row items-center justify-center mt-4">
                    <Link href="/configurator/apartment">
                        <Button label="Для квартиры" variant="contrast" size="small" />
                    </Link>
                    <Link href="/configurator/termo">
                        <Button label="Для дома" variant="outlined" size="small" />
                    </Link>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12">
                
                <!-- Left Column: Preview & Parameters -->
                <div class="lg:col-span-6 lg:sticky lg:top-4 lg:self-start space-y-4">
                    <div class=" space-y-4">
                        <!-- Visualization Area -->
                        <div class="relative">
                            <div class="">
                                <DoorVisualizer />
                            </div>
                        </div>

                        <div class="border border-sky-900/10 shadow-md shadow-sky-800/5 rounded-3xl p-4">
                            <div class="border-b border-sky-900/10 pb-2">
                                <p class="font-bold text-xl"><span class="font-bold text-sky-900">Итого: </span> <span>{{ doorCalcStore.total_price.toFixed(2) }} ₽</span></p>
                            </div>
                            <div class="flex gap-4 mt-4">
                                <Button label="Оформить заказ" variant="" icon="pi pi-shopping-cart" size="small" />
                                <Button label="Скачать PDF" variant="outlined" icon="pi pi-file-pdf" size="small" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Options Panel -->
                <div class="lg:col-span-6 space-y-4">
                    <div class="space-y-4">
                        <ConstructiveCard />
                        <ExteriorCard />
                        <InteriorCard />

                        <FurnitureCard />
                        <LockerCard />

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
    </PublicLayout>

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

</template>
<style scoped>
/* Import elegant serif fonts */
h1,
h2,
h3,
button {
    font-family: 'Google Sans', sans-serif;
}

/* PrimeVue SelectButton customization */
:deep(.p-selectbutton) {
    display: flex;
    width: 100%;
}

:deep(.p-selectbutton .p-button) {
    flex: 1;
    font-size: 0.875rem;
}

/* PrimeVue InputNumber customization */
:deep(.p-inputnumber) {
    width: 100%;
    display: flex;
}

:deep(.p-inputnumber-input) {
    font-size: 0.875rem;
}

:deep(.p-inputnumber-button .p-icon) {
    width: 1rem;
    height: 1rem;
}
</style>