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
import { SelectButton, InputNumber, Drawer, Button } from 'primevue';
import { computed, ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { generate as generatePdf } from '@/routes/pdf';
import ExteriorCard from '@/components/Configurator/Card/ExteriorCard.vue';
import InteriorCard from '@/components/Configurator/Card/InteriorCard.vue';
import FurnitureCard from '@/components/Configurator/Card/FurnitureCard.vue';
import LockerCard from '@/components/Configurator/Card/LockerCard.vue'
import AdditionalsCard from '@/components/Configurator/Card/AdditionalsCard.vue';

const paints = ref(usePage().props.paints as Nomenclature[])
const doorModels = ref(usePage().props.doorModels as DoorModel[])
const filmColors = ref(usePage().props.filmColors as Nomenclature[])
const furnitures = ref(usePage().props.furnitures as Furniture[])
const locks = ref(usePage().props.locks as { primary: Nomenclature[], secondary: Nomenclature[] })
const cylinders = ref(usePage().props.cylinders as Nomenclature[])
const handles = ref(usePage().props.handles as Nomenclature[])
const pricing = ref(usePage().props.pricing as { [key: string]: number })

const doorCalcStore = useDoorCalc()
doorCalcStore.paints = paints.value
doorCalcStore.doorModels = doorModels.value
doorCalcStore.filmColors = filmColors.value
doorCalcStore.furnitures = furnitures.value
doorCalcStore.handles = handles.value
doorCalcStore.locks = locks.value
doorCalcStore.cylinders = cylinders.value
doorCalcStore.pricing = pricing.value
// Computed properties to filter door models
const exteriorDoorModels = computed(() => {
    return doorCalcStore.doorModels.filter((model: DoorModel) => model.type === 'exterior');
});

const interiorDoorModels = computed(() => {
    return doorCalcStore.doorModels.filter((model: DoorModel) => model.type === 'interior');
});

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

const doorVisualStore = useDoorVisual();
const doorVisualizerRef = ref<InstanceType<typeof DoorVisualizer> | null>(null);
const isGeneratingPdf = ref(false);

async function downloadPdf() {
    if (!doorVisualizerRef.value) return;

    const images = doorVisualizerRef.value.exportStageImages();
    if (!images) return;

    const doorConfig = doorCalcStore.doorConfig;

    const dash = (v: string | null | undefined) => (v && v.trim() !== '' ? v : '—');
    const yesNo = (v: boolean | undefined) => (v === undefined ? '—' : v ? 'Да' : 'Нет');
    const resolveFilmName = (id: number | undefined) =>
        id !== undefined && id !== -1 ? doorCalcStore.getFilmColor(id)?.name ?? null : null;
    const resolvePaintName = (id: number | undefined) =>
        id !== undefined && id !== -1 ? doorCalcStore.getPaintColor(id)?.name ?? null : null;
    const resolveDoorModelName = (id: number) => doorCalcStore.getDoorModelInfo(id)?.name ?? null;

    const exteriorModelName = resolveDoorModelName(doorConfig.exterior.panelModel);
    const interiorModelName = resolveDoorModelName(doorConfig.interior.panelModel);

    const furnitureSet = doorConfig.furniture.furnitureSetId !== undefined && doorConfig.furniture.furnitureSetId !== -1
        ? doorCalcStore.getFurnitureSet(doorConfig.furniture.furnitureSetId) ?? null
        : null;

    const selectedPrimaryLock =
        doorConfig.furniture.primaryLock !== undefined && doorConfig.furniture.primaryLock !== -1
            ? doorCalcStore.locks.primary.find((l) => l.id === doorConfig.furniture.primaryLock) ?? null
            : null;
    const selectedSecondaryLock =
        doorConfig.furniture.hasSecondaryLock && doorConfig.furniture.secondaryLock !== undefined && doorConfig.furniture.secondaryLock !== -1
            ? doorCalcStore.locks.secondary.find((l) => l.id === doorConfig.furniture.secondaryLock) ?? null
            : null;

    const selectedPrimaryCylinder =
        doorConfig.furniture.primaryCylindricalLockMechanism !== undefined &&
        doorConfig.furniture.primaryCylindricalLockMechanism !== -1
            ? doorCalcStore.cylinders.find(
                  (c) => c.id === doorConfig.furniture.primaryCylindricalLockMechanism,
              ) ?? null
            : null;

    const selectedSecondaryCylinder =
        doorConfig.furniture.hasSecondaryLock &&
        doorConfig.furniture.secondaryCylindricalLockMechanism !== undefined &&
        doorConfig.furniture.secondaryCylindricalLockMechanism !== -1
            ? doorCalcStore.cylinders.find(
                  (c) => c.id === doorConfig.furniture.secondaryCylindricalLockMechanism,
              ) ?? null
            : null;

    const config = {
        sections: [
            {
                title: 'Конструктив',
                rows: [
                    { label: 'Конструктив', value: dash(doorConfig.doorConstructive) },
                    { label: 'Размеры', value: `${doorConfig.doorWidth} x ${doorConfig.doorHeight} мм` },
                    { label: 'Сторона открывания', value: dash(doorConfig.doorHandleSide) },
                    { label: 'Вид короба', value: dash(doorConfig.doorBoxDesign) },
                    {
                        label: 'Глазок',
                        value: doorConfig.furniture.hasPeephole
                            ? `Да (${dash(doorConfig.peepholePosition ?? 'Center')})`
                            : 'Нет',
                    },
                    { label: 'Порог из нержавейки', value: yesNo(doorConfig.stainlessSteelDoorsill) },
                ],
            },
            {
                title: 'Внешняя отделка',
                rows: [
                    { label: 'Модель', value: dash(exteriorModelName) },
                    { label: 'Плёнка основная', value: dash(resolveFilmName(doorConfig.exterior.primaryTexture)) },
                    { label: 'Плёнка дополнительная', value: dash(resolveFilmName(doorConfig.exterior.secondaryTexture)) },
                    { label: 'Наличник', value: dash(resolveFilmName(doorConfig.exterior.casingTexture)) },
                ],
            },
            {
                title: 'Внутренняя отделка',
                rows: [
                    { label: 'Модель', value: dash(interiorModelName) },
                    { label: 'Плёнка основная', value: dash(resolveFilmName(doorConfig.interior.primaryTexture)) },
                    { label: 'Плёнка дополнительная', value: dash(resolveFilmName(doorConfig.interior.secondaryTexture)) },
                    { label: 'Наличник', value: dash(resolveFilmName(doorConfig.interior.casingTexture)) },
                ],
            },
            {
                title: 'Покраска металла',
                rows: [
                    { label: 'Подложка (цинкогрунт)', value: yesNo(doorConfig.metalPainting.undercoat) },
                    { label: 'Основной цвет', value: dash(resolvePaintName(doorConfig.metalPainting.primaryColor)) },
                    { label: 'Дополнительный цвет', value: dash(resolvePaintName(doorConfig.metalPainting.secondaryColor)) },
                ],
            },
            {
                title: 'Фурнитура',
                rows: [
                    { label: 'Комплект', value: dash(furnitureSet?.title ?? null) },
                    { label: 'Тип фурнитуры', value: dash(doorConfig.furniture.furnitureType ?? null) },
                    { label: 'Цвет фурнитуры', value: dash(doorConfig.furniture.furnitureColor ?? null) },
                    { label: 'Форма', value: dash(doorConfig.furniture.furnitureShape ?? null) },
                    { label: 'Ночник', value: yesNo(doorConfig.furniture.hasNightLatchTurner) },
                    { label: 'Дополнительный замок', value: yesNo(doorConfig.furniture.hasSecondaryLock) },
                ],
            },
            {
                title: 'Замки и цилиндры',
                rows: [
                    { label: 'Основной замок', value: dash(selectedPrimaryLock?.name) },
                    {
                        label: 'Цилиндр (основной)',
                        value: dash(selectedPrimaryCylinder?.name ?? null),
                    },
                    { label: 'Дополнительный замок', value: dash(selectedSecondaryLock?.name ?? null) },
                    {
                        label: 'Цилиндр (дополнительный)',
                        value: dash(selectedSecondaryCylinder?.name ?? null),
                    },
                ],
            },
        ],
    };

    isGeneratingPdf.value = true;
    try {
        const response = await axios.post(generatePdf.url(), {
            exterior_image: images.exteriorImage,
            interior_image: images.interiorImage,
            exterior_model_name: exteriorModelName ?? '',
            interior_model_name: interiorModelName ?? '',
            constructive_name: doorConfig.doorConstructive,
            config,
        }, { responseType: 'blob' });

        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'door-config.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } finally {
        isGeneratingPdf.value = false;
    }
}

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
    doorCalcStore.initializeDefaultConfig()
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
                                <DoorVisualizer ref="doorVisualizerRef" />
                            </div>
                        </div>

                        <div class="border border-sky-900/10 shadow-md shadow-sky-800/5 rounded-3xl p-4">
                            <div class="border-b border-sky-900/10 pb-2">
                                <p class="font-bold text-xl"><span class="font-bold text-sky-900">Итого: </span> <span>{{ doorCalcStore.total_price.toFixed(2) }} ₽</span></p>
                            </div>
                            <div class="flex gap-4 mt-4">
                                <Button label="Оформить заказ" variant="" icon="pi pi-shopping-cart" size="small" />
                                <Button label="Скачать PDF" variant="outlined" icon="pi pi-file-pdf" size="small" :loading="isGeneratingPdf" @click="downloadPdf" />
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
                        <AdditionalsCard />
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