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
import TermoAdditionalsCard from '@/components/Configurator/TermoCards/TermoAdditionalsCard.vue';
import TermoFurnitureCard from '@/components/Configurator/TermoCards/TermoFurnitureCard.vue';
import TermoModularCard from '@/components/Configurator/TermoCards/TermoModularCard.vue';
import axios from 'axios';
import { generate as generatePdf } from '@/routes/pdf';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Конфигуратор', href: '/configurator' },
    { title: 'Для дома', href: '/configurator/termo' },
]

const store = useTermoDoorCalc()
const visualStore = useTermoDoorVisual()
const showOrderDialog = ref(false)
const isGeneratingPdf = ref(false)
const doorVisualizerRef = ref<InstanceType<typeof DoorVisualizerTermo> | null>(null)

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

async function downloadPdf(form: { fullname: string; phone: string; address: string }) {
    if (!doorVisualizerRef.value) return;

    const images = doorVisualizerRef.value.exportStageImages();
    if (!images) return;

    const cfg = store.doorConfig;
    const isTermoPlus   = cfg.constructive === 'Termo+';
    const isModular     = cfg.isModular;

    // ── Module sizes (0 when module is not active) ────────────────────────
    const leftSize  = isModular ? (cfg.modules?.left.size  ?? 0) : 0;
    const rightSize = isModular ? (cfg.modules?.right.size ?? 0) : 0;
    const topSize   = isModular ? (cfg.modules?.top.size   ?? 0) : 0;

    const mountWidth  = cfg.width  + leftSize + rightSize;
    const mountHeight = cfg.height + topSize;

    // ── Exterior size with casing ────────────────────────────────────────
    const exteriorModelName = store.getDoorModelInfo(cfg.exterior.panelModel)?.name ?? '';
    const interiorModelName = store.getDoorModelInfo(cfg.interior.panelModel)?.name ?? '';
    const mpCasingModels    = ['Forta', 'Kombi', 'Verso', 'Stark'];
    const isMPModel         = mpCasingModels.includes(exteriorModelName);
    const extW = cfg.width  + (isMPModel ? 114 : 134);
    const extH = cfg.height + (isMPModel ?  57 :  67);

    const isNova = exteriorModelName === 'Nova';

    // ── Lookup helpers ───────────────────────────────────────────────────
    const dash = (v: string | null | undefined) => (v && v.trim() !== '' ? v : '—');
    const yesNo = (v: boolean | undefined)      => (v ? 'Есть' : 'Нет');

    const translateHandleSide = (v: string): string => {
        if (v === 'Left')  return 'Левое';
        if (v === 'Right') return 'Правое';
        return v || '—';
    };
    const translateFurnitureType = (v: unknown): string => {
        if (v === 'push')       return 'Нажимная';
        if (v === 'pull')       return 'Бугельная';
        if (v === 'electronic') return 'Электронная';
        return typeof v === 'string' && v.trim() !== '' ? v : '—';
    };
    const translateFurnitureColor = (v: unknown): string => {
        if (v === 'black')        return 'Матовый чёрный';
        if (v === 'chrome')       return 'Хром';
        if (v === 'matte-chrome') return 'Матовый хром';
        if (v === 'gold')         return 'Золото';
        if (v === 'bronze')       return 'Бронза';
        return typeof v === 'string' && v.trim() !== '' ? v : '—';
    };
    const translatePeepholePosition = (v: unknown): string => {
        if (v === 'None')   return 'Нет';
        if (v === 'Side')   return 'Сбоку';
        if (v === 'Center') return 'По центру';
        return typeof v === 'string' && v.trim() !== '' ? v : '—';
    };

    const resolvePaintName = (id: number | undefined) =>
        id !== undefined && id !== -1 ? store.getPaintColor(id)?.name ?? null : null;
    const resolveFilmName = (id: number | undefined) =>
        id !== undefined && id !== -1 ? store.getFilmColor(id)?.name ?? null : null;

    const primaryPaintName      = resolvePaintName(cfg.metalPainting.primaryColor);
    const secondaryPaintName    = resolvePaintName(cfg.metalPainting.secondaryColor);
    const innerCasingPaintName  = resolvePaintName(cfg.metalPainting.innerCasingColor);
    const interiorFilmColorName = resolveFilmName(cfg.interior.primaryTexture);
    const hplColorName          = resolveFilmName(cfg.exterior.primaryTexture);

    const furnitureSet = cfg.furniture.furnitureSetId !== undefined && cfg.furniture.furnitureSetId !== -1
        ? store.getFurnitureSet(cfg.furniture.furnitureSetId)
        : null;

    const primaryLockName = cfg.furniture.primaryLock !== undefined && cfg.furniture.primaryLock !== -1
        ? store.locks.primary.find(l => l.id === cfg.furniture.primaryLock)?.name ?? null
        : null;
    const secondaryLockName =
        cfg.furniture.hasSecondaryLock &&
        cfg.furniture.secondaryLock !== undefined &&
        cfg.furniture.secondaryLock !== -1
            ? store.locks.secondary.find(l => l.id === cfg.furniture.secondaryLock)?.name ?? null
            : null;
    const primaryCylinderName =
        cfg.furniture.primaryCylindricalLockMechanism !== undefined &&
        cfg.furniture.primaryCylindricalLockMechanism !== -1
            ? store.cylinders.find(c => c.id === cfg.furniture.primaryCylindricalLockMechanism)?.name ?? null
            : null;
    const secondaryCylinderName =
        cfg.furniture.hasSecondaryLock &&
        cfg.furniture.secondaryCylindricalLockMechanism !== undefined &&
        cfg.furniture.secondaryCylindricalLockMechanism !== -1
            ? store.cylinders.find(c => c.id === cfg.furniture.secondaryCylindricalLockMechanism)?.name ?? null
            : null;

    // ── Section: Конструктив ─────────────────────────────────────────────
    type Row = { label: string; value: string };

    const constructiveRows: Row[] = [
        { label: 'Вид конструктива',  value: cfg.constructive },
        { label: 'Вид короба',        value: 'Закрытый' },
        { label: 'Открывание',        value: translateHandleSide(cfg.handleSide) },
        { label: 'Монтажные размеры (В*Ш), мм', value: `${mountHeight}*${mountWidth}` },
        { label: 'Размер двери',      value: `${cfg.height}*${cfg.width}` },
    ];
    if (isModular && leftSize  > 0) constructiveRows.push({ label: 'Размер левого модуля',   value: `${cfg.height}*${leftSize}` });
    if (isModular && rightSize > 0) constructiveRows.push({ label: 'Размер правого модуля',  value: `${cfg.height}*${rightSize}` });
    if (isModular && topSize   > 0) constructiveRows.push({ label: 'Размер верхнего модуля', value: `${topSize}*${mountWidth}` });
    constructiveRows.push({ label: 'Наружный размер двери с наличником (В*Ш), мм', value: `${extH}*${extW}` });

    // ── Section: Наружная отделка ────────────────────────────────────────
    const exteriorRows: Row[] = [
        { label: 'Отделка снаружи', value: dash(exteriorModelName) },
    ];
    if (!isTermoPlus) {
        exteriorRows.push({ label: 'Цвет основной',      value: dash(hplColorName) });
        exteriorRows.push({ label: 'Цвет дополнительный', value: '—' });
        exteriorRows.push({ label: 'Цвет наличника',     value: '—' });
    }
    exteriorRows.push(
        { label: 'Покраска металла полотна',    value: dash(primaryPaintName) },
        { label: 'Покраска металла наличника',  value: dash(innerCasingPaintName) },
    );
    if (isNova) {
        exteriorRows.push({ label: 'Покраска металла дополнительного элемента', value: dash(secondaryPaintName) });
    }
    exteriorRows.push({ label: 'Предварительное цинкогрунтование', value: yesNo(cfg.metalPainting.undercoat) });

    // ── Sections array ───────────────────────────────────────────────────
    const sections: { title: string; rows: Row[] }[] = [
        { title: 'Конструктив',     rows: constructiveRows },
        { title: 'Наружная отделка', rows: exteriorRows },
    ];

    // Glass section — Termo Premium only
    if (!isTermoPlus) {
        const glassRows: Row[] = [
            { label: 'Стеклопакет полотна',           value: '4-х камерный' },
            { label: 'Тонировка (наружний слой)',      value: '—' },
            { label: 'Тонировка (внутренний слой)',    value: '—' },
        ];
        if (isModular) {
            glassRows.push(
                { label: 'Стеклопакет модулей',                 value: '4-х камерный' },
                { label: 'Тонировка модулей (наружний слой)',   value: '—' },
                { label: 'Тонировка модулей (внутренний слой)', value: '—' },
            );
        }
        sections.push({ title: 'Стеклопакет', rows: glassRows });
    }

    sections.push(
        {
            title: 'Внутренняя отделка',
            rows: [
                { label: 'Внутренняя панель',                          value: dash(interiorModelName) },
                { label: 'Цвет',                                       value: dash(interiorFilmColorName) },
                { label: 'Покраска металла внутр. рамок и модулей',    value: dash(innerCasingPaintName) },
            ],
        },
        {
            title: 'Фурнитура',
            rows: [
                { label: 'Тип ручки',                     value: translateFurnitureType(cfg.furniture.furnitureType) },
                { label: 'Цвет фурнитуры',                value: translateFurnitureColor(cfg.furniture.furnitureColor) },
                { label: 'Модель фурнитуры',              value: dash(furnitureSet?.title ?? null) },
                { label: 'Ночная задвижка + вертушок',    value: yesNo(cfg.furniture.hasNightLatchTurner) },
                { label: 'Глазок',                        value: translatePeepholePosition(cfg.peepholePosition) },
            ],
        },
        {
            title: 'Замки',
            rows: [
                { label: 'Основной замок',                   value: dash(primaryLockName) },
                { label: 'Цилиндр основного замка',          value: dash(primaryCylinderName) },
                { label: 'Дополнительный замок',             value: cfg.furniture.hasSecondaryLock ? dash(secondaryLockName) : 'Нет' },
                { label: 'Цилиндр дополнительного замка',    value: cfg.furniture.hasSecondaryLock ? dash(secondaryCylinderName) : 'Нет' },
            ],
        },
        {
            title: 'Дополнительные опции',
            rows: [
                { label: 'Порог из нержавейки',          value: yesNo(cfg.hasStainlessSteelDoorsill) },
                { label: 'Термокабель по периметру короба', value: yesNo(cfg.hasThermalCable) },
            ],
        },
    );

    isGeneratingPdf.value = true;
    try {
        const response = await axios.post(generatePdf.url(), {
            exterior_image:      images.exteriorImage,
            interior_image:      images.interiorImage,
            exterior_model_name: exteriorModelName,
            interior_model_name: interiorModelName,
            constructive_name:   cfg.constructive,
            buyer_name:          form.fullname,
            buyer_phone:         form.phone,
            object_address:      form.address,
            config: { sections },
        }, { responseType: 'blob' });

        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'termo-door-config.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                    <DoorVisualizerTermo ref="doorVisualizerRef" />

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
                    <TermoAdditionalsCard />
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
