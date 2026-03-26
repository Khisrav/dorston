<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue';
import DoorVisualizerTermo from '@/components/Configurator/DoorVisualizerTermo.vue';
import OrderDialog from '@/components/Configurator/OrderDialog.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/vue3';
import type { DoorModel, Furniture, Nomenclature, DoorCombinationImage } from '@/types/configurator';
import { Button } from 'primevue';
import { ref, reactive, watch, onMounted } from 'vue';
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc';
import { useTermoDoorVisual } from '@/composables/useTermoDoorVisual';
import TermoParametersCard from '@/components/Configurator/TermoCards/TermoParametersCard.vue';
import TermoExteriorCard from '@/components/Configurator/TermoCards/TermoExteriorCard.vue';
import TermoInteriorCard from '@/components/Configurator/TermoCards/TermoInteriorCard.vue';
import TermoMetalCard from '@/components/Configurator/TermoCards/TermoMetalCard.vue';
import TermoGlassCard from '@/components/Configurator/TermoCards/TermoGlassCard.vue';
import TermoLockerCard from '@/components/Configurator/TermoCards/TermoLockerCard.vue';
import TermoFurnitureCard from '@/components/Configurator/TermoCards/TermoFurnitureCard.vue';
import TermoModularCard from '@/components/Configurator/TermoCards/TermoModularCard.vue';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Конфигуратор', href: '/configurator' },
    { title: 'Для дома', href: '/configurator/termo' },
]

const store = useTermoDoorCalc()
const visualStore = useTermoDoorVisual()
const showOrderDialog = ref(false)
const isGeneratingPdf = ref(false)

const paints = ref(usePage().props.paints as Nomenclature[])
const doorModels = ref(usePage().props.doorModels as DoorModel[])
const filmColors = ref(usePage().props.filmColors as Nomenclature[])
const furnitures = ref(usePage().props.furnitures as Furniture[])
const locks = ref(usePage().props.locks as { primary: Nomenclature[], secondary: Nomenclature[] })
const cylinders = ref(usePage().props.cylinders as Nomenclature[])
const handles = ref(usePage().props.handles as Nomenclature[])

store.paints = paints.value
store.doorModels = doorModels.value
store.filmColors = filmColors.value
store.furnitures = furnitures.value
store.handles = handles.value
store.locks = locks.value
store.cylinders = cylinders.value
store.initializeDefaultConfig()

// ── Tweened price animation ───────────────────────────────────────────────────

const tweenedPrice = reactive({ value: 0 });

watch(
    () => store.total_price,
    (newPrice) => {
        const start = tweenedPrice.value;
        const end = newPrice;
        const duration = 400;
        const startTime = performance.now();

        function step(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            tweenedPrice.value = start + (end - start) * ease;
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    },
);

// ── PDF download ──────────────────────────────────────────────────────────────

async function downloadPdf() {
    // TODO: implement Termo PDF generation (route + controller not yet built)
    isGeneratingPdf.value = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        showOrderDialog.value = false;
    } finally {
        isGeneratingPdf.value = false;
    }
}

// ── Combination image fetching ────────────────────────────────────────────────

function fetchDoorCombinations(exteriorModelId: number | undefined, interiorModelId: number | undefined) {
    const modelIds = [exteriorModelId, interiorModelId].filter((id): id is number => !!id && id !== -1);
    if (!modelIds.length) return;

    visualStore.isCombinationsLoading = true;

    router.reload({
        data: { door_model_ids: modelIds },
        only: ['doorCombinationImages'],
        onSuccess: (page) => {
            visualStore.doorCombinationImages = (page.props.doorCombinationImages as DoorCombinationImage[]) ?? [];
        },
        onFinish: () => {
            visualStore.isCombinationsLoading = false;
        },
    });
}

onMounted(() => {
    store.initializeDefaultConfig();
    tweenedPrice.value = store.total_price;
    fetchDoorCombinations(store.doorConfig.exterior.panelModel, store.doorConfig.interior.panelModel);
});

watch(
    [
        () => store.doorConfig.exterior.panelModel,
        () => store.doorConfig.interior.panelModel,
    ],
    ([exteriorModelId, interiorModelId]) => {
        fetchDoorCombinations(exteriorModelId, interiorModelId);
    },
);
</script>

<template>
    <Head title="Для дома — Конфигуратор" />
    <PublicLayout>
        <div class="flex h-full max-w-7xl mx-auto flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">

            <!-- Header -->
            <div class="text-center pb-4 sm:pb-6 lg:pb-8">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-2 sm:mb-3 font-bold">Конфигуратор дверей</h1>
                <p class="font-serif text-base sm:text-lg text-black/60">
                    Создайте идеальную дверь для дома по вашему вкусу
                </p>
                <div class="flex gap-2 flex-col sm:flex-row items-center justify-center mt-4">
                    <Link href="/configurator/apartment">
                        <Button label="Для квартиры" variant="outlined" size="small" />
                    </Link>
                    <Link href="/configurator/termo">
                        <Button label="Для дома" variant="contrast" size="small" />
                    </Link>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12">

                <!-- Left Column: Visualizer & Price -->
                <div class="lg:col-span-6 lg:sticky lg:top-4 lg:self-start space-y-4">

                    <!-- Visualizer -->
                    <DoorVisualizerTermo />

                    <!-- Price & actions -->
                    <div class="border border-sky-900/10 shadow-md shadow-sky-800/5 rounded-3xl p-4">
                        <div class="border-b border-sky-900/10 pb-2">
                            <p class="font-bold text-xl">
                                <span class="font-bold text-sky-900">Итого: </span>
                                <span>{{ tweenedPrice.value.toFixed(2) }} ₽</span>
                            </p>
                        </div>
                        <div class="flex gap-4 mt-4">
                            <Button label="Оформить заказ" icon="pi pi-shopping-cart" size="small" @click="showOrderDialog = true" />
                            <Button label="Скачать PDF" variant="outlined" icon="pi pi-file-pdf" size="small" @click="showOrderDialog = true" />
                        </div>
                    </div>
                </div>

                <!-- Right Column: Cards -->
                <div class="lg:col-span-6 space-y-4">
                    <TermoParametersCard />
                    <TermoModularCard />
                    <TermoExteriorCard />
                    <TermoInteriorCard />
                    <TermoMetalCard />
                    <TermoGlassCard />
                    <TermoFurnitureCard />
                    <TermoLockerCard />
                </div>
            </div>
        </div>
    </PublicLayout>

    <OrderDialog
        v-model:visible="showOrderDialog"
        :is-generating-pdf="isGeneratingPdf"
        @download-pdf="downloadPdf"
    />
</template>
