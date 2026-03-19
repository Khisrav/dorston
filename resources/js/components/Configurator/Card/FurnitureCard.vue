<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { type Furniture, type peepholePosition } from '@/types/configurator'
import { Drawer, SelectButton, ToggleSwitch } from 'primevue'
import { computed, ref } from 'vue'
import ConfiguratorCard from './ConfiguratorCard.vue'

const doorCalcStore = useDoorCalc()

const showSetDrawer = ref(false)

// ─── Color definitions ────────────────────────────────────────────────────────

const colorOptions: {
    value: Furniture['color']
    label: string
    image: string
}[] = [
    { value: 'black',        label: 'Матовый чёрный', image: '/assets/furniture-colors/matte-black.png' },
    { value: 'chrome',       label: 'Хром',           image: '/assets/furniture-colors/chrome.png' },
    { value: 'matte-chrome', label: 'Матовый хром',   image: '/assets/furniture-colors/matte-chrome.png' },
    { value: 'gold',         label: 'Золото',          image: '/assets/furniture-colors/gold.png' },
    { value: 'bronze',       label: 'Бронза',          image: '/assets/furniture-colors/bronze.png' },
]

// ─── Shape labels ─────────────────────────────────────────────────────────────

const shapeLabel: Record<Furniture['shape'], string> = {
    rectangular: 'Прямоугольная',
    oval:        'Овальная',
    other:       'Другая',
}

const shapeOrder: Furniture['shape'][] = ['rectangular', 'oval', 'other']

// ─── Computed ─────────────────────────────────────────────────────────────────

const selectedColor = computed(() => doorCalcStore.doorConfig.furniture.furnitureColor as Furniture['color'] | undefined)

const selectedColorLabel = computed(() =>
    colorOptions.find(c => c.value === selectedColor.value)?.label ?? ''
)

const selectedSet = computed(() =>
    doorCalcStore.getFurnitureSet(doorCalcStore.doorConfig.furniture.furnitureSetId ?? -1)
)

/** Furniture sets filtered by currently selected color, grouped by shape */
const setsByShape = computed(() => {
    const color = selectedColor.value
    if (!color) return []

    const filtered = doorCalcStore.furnitures.filter(f => f.color === color)

    return shapeOrder
        .map(shape => ({
            shape,
            label: shapeLabel[shape],
            sets: filtered.filter(f => f.shape === shape),
        }))
        .filter(group => group.sets.length > 0)
})

// ─── Actions ──────────────────────────────────────────────────────────────────

function selectColor(color: Furniture['color']) {
    doorCalcStore.doorConfig.furniture.furnitureColor = color
}

function selectSet(furniture: Furniture) {
    doorCalcStore.doorConfig.furniture.furnitureSetId = furniture.id
    doorCalcStore.doorConfig.furniture.furnitureShape = furniture.shape
    doorCalcStore.doorConfig.furniture.furnitureColor = furniture.color
    showSetDrawer.value = false
}

function openSetDrawer() {
    showSetDrawer.value = true
}

// ─── Peephole options ─────────────────────────────────────────────────────────

const peepholeOptions: { label: string; value: peepholePosition }[] = [
    { label: 'Нет',       value: 'None'   },
    { label: 'Сбоку',     value: 'Side'   },
    { label: 'По центру', value: 'Center' },
]
</script>

<template>
    <ConfiguratorCard :step="4" title="Фурнитура">

        <!-- ── Color selector ──────────────────────────────────────── -->
        <p class="font-serif text-sm text-sky-900/70 mb-3">Цвет фурнитуры</p>

        <div class="flex flex-wrap justify-center md:justify-start gap-6 mb-5">
            <button
                v-for="opt in colorOptions"
                :key="opt.value"
                type="button"
                :title="opt.label"
                @click="selectColor(opt.value)"
                :class="[
                    'relative flex flex-col items-center gap-2 group transition-all duration-200',
                ]"
            >
                <div
                    :class="[
                        'size-16 rounded-full transition-all duration-200 p-0.5',
                        selectedColor === opt.value
                            ? 'ring-2 ring-sky-900 ring-offset-2'
                            : 'ring-1 ring-black/10 hover:ring-sky-900/40 hover:ring-offset-1'
                    ]"
                >
                    <img
                        :src="opt.image"
                        :alt="opt.label"
                        class="size-full object-contain drop-shadow-sm"
                    />
                </div>
                <!-- <span
                    :class="[
                        'text-xs font-serif leading-none text-center max-w-[56px] transition-colors duration-200',
                        selectedColor === opt.value ? 'text-sky-900' : 'text-black/50'
                    ]"
                >
                    {{ opt.label }}
                </span> -->
            </button>
        </div>

        <!-- ── Selected set preview / picker ──────────────────────── -->
        <div class="border-t border-sky-900/5 pt-4">
            <p class="font-serif text-sm text-sky-900/70 mb-3">Набор фурнитуры</p>

            <!-- When a set is selected: show preview card -->
            <div v-if="selectedSet" class="flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 mb-3">
                <div class="size-20 shrink-0 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center">
                    <img
                        v-if="selectedSet.preview_image"
                        :src="getImageUrl(selectedSet.preview_image)"
                        :alt="selectedSet.title ?? 'Набор фурнитуры'"
                        class="size-full object-cover"
                    />
                    <span v-else class="text-xs text-neutral-400 font-serif text-center px-1">Нет фото</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif font-semibold text-sky-900 truncate">
                        {{ selectedSet.title ?? 'Набор без названия' }}
                    </p>
                    <div class="flex flex-wrap gap-1.5 mt-1.5">
                        <span class="inline-flex items-center rounded-full bg-sky-900/8 px-2 py-0.5 text-[11px] font-serif text-sky-900">
                            {{ shapeLabel[selectedSet.shape] }}
                        </span>
                        <span class="inline-flex items-center rounded-full bg-sky-900/8 px-2 py-0.5 text-[11px] font-serif text-sky-900">
                            {{ selectedColorLabel }}
                        </span>
                    </div>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    @click="openSetDrawer"
                    class="shrink-0 text-xs font-serif text-sky-900/60 hover:text-sky-900 transition-colors border border-sky-900/20 rounded-xl px-3 py-1.5 hover:border-sky-900/40"
                >
                    Изменить
                </Button>
            </div>

            <!-- When no set selected: placeholder + pick button -->
            <div
                v-else
                class="flex items-center gap-3 p-3 rounded-xl border border-sky-900/10 cursor-pointer hover:border-sky-900/40 transition-colors"
                @click="openSetDrawer"
            >
                <div class="size-20 shrink-0 rounded bg-neutral-100 flex items-center justify-center">
                    <!-- <span class="text-2xl">🔩</span> -->
                </div>
                <div>
                    <p class="font-serif font-semibold text-sky-900/60">Набор не выбран</p>
                    <p class="font-serif text-xs text-black/40 mt-0.5">
                        {{ setsByShape.length ? 'Нажмите, чтобы выбрать' : 'Нет наборов для выбранного цвета' }}
                    </p>
                </div>
            </div>
        </div>

        <div class="border-t border-sky-900/5 my-4" />

        <!-- ── Night latch turner toggle ──────────────────────────── -->
        <div class="flex items-center justify-between gap-4">
            <div>
                <p class="font-serif text-sm text-sky-900/70">Ночная задвижка + вертушок</p>
            </div>
            <ToggleSwitch v-model="doorCalcStore.doorConfig.furniture.hasNightLatchTurner" />
        </div>

        <div class="border-t border-sky-900/5 my-4" />

        <!-- ── Peephole position ───────────────────────────────────── -->
        <p class="font-serif text-sm text-sky-900/70 mb-3">Глазок</p>
        <div class="w-full">
            <SelectButton
                v-model="doorCalcStore.doorConfig.peepholePosition"
                :options="peepholeOptions"
                option-label="label"
                option-value="value"
                size="small"
                fluid
                class="text-xs"
            />
        </div>

    </ConfiguratorCard>

    <!-- ── Drawer: furniture set picker ───────────────────────────────── -->
    <Drawer
        v-model:visible="showSetDrawer"
        position="right"
        class="!w-full sm:!w-[90vw] md:!w-[520px]"
    >
        <template #header>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <img
                        v-if="selectedColor"
                        :src="colorOptions.find(c => c.value === selectedColor)?.image"
                        :alt="selectedColorLabel"
                        class="size-7 object-contain drop-shadow-sm"
                    />
                </div>
                <div>
                    <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                        Наборы фурнитуры
                    </h2>
                    <p class="font-serif text-sm text-black/50 mt-0.5">{{ selectedColorLabel }}</p>
                </div>
            </div>
        </template>

        <div class="p-1 space-y-6">
            <div v-for="group in setsByShape" :key="group.shape">

                <!-- Shape section header -->
                <div class="flex items-center gap-2 mb-3">
                    <h3 class="font-serif font-semibold text-sky-900 text-sm">{{ group.label }}</h3>
                    <div class="flex-1 h-px bg-sky-900/10"></div>
                    <span class="text-xs font-serif text-black/40">{{ group.sets.length }} шт.</span>
                </div>

                <!-- Sets grid -->
                <div class="grid grid-cols-1 gap-3">
                    <button
                        v-for="furniture in group.sets"
                        :key="furniture.id"
                        type="button"
                        @click="selectSet(furniture)"
                        :class="[
                            'flex items-center gap-4 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer w-full',
                            doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id
                                ? 'border-sky-900/60 border-2 bg-sky-900/5'
                                : 'border-sky-900/10 hover:border-sky-900/30 hover:bg-sky-900/2'
                        ]"
                    >
                        <!-- Preview image -->
                        <div class="size-20 shrink-0 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center">
                            <img
                                v-if="furniture.preview_image"
                                :src="getImageUrl(furniture.preview_image)"
                                :alt="furniture.title ?? 'Набор фурнитуры'"
                                class="size-full object-cover"
                            />
                            <span v-else class="text-xs text-neutral-400 font-serif text-center px-1">Нет фото</span>
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0 space-y-1.5">
                            <p class="font-serif font-semibold text-sky-900 leading-snug">
                                {{ furniture.title ?? 'Набор без названия' }}
                            </p>
                            <div class="flex flex-wrap gap-1.5">
                                <span class="inline-flex items-center rounded-full bg-sky-900/8 px-2 py-0.5 text-[11px] font-serif text-sky-900">
                                    {{ shapeLabel[furniture.shape] }}
                                </span>
                                <span class="inline-flex items-center rounded-full bg-sky-900/8 px-2 py-0.5 text-[11px] font-serif text-sky-900">
                                    {{ colorOptions.find(c => c.value === furniture.color)?.label ?? furniture.color }}
                                </span>
                            </div>
                        </div>

                        <!-- Selected checkmark -->
                        <div class="shrink-0">
                            <div
                                v-if="doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id"
                                class="size-6 rounded-full bg-sky-900 flex items-center justify-center"
                            >
                                <span class="pi pi-check text-white text-xs"></span>
                            </div>
                            <div v-else class="size-6 rounded-full border border-sky-900/20"></div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="!setsByShape.length" class="flex flex-col items-center justify-center py-12 text-center">
                <span class="text-4xl mb-3">🔩</span>
                <p class="font-serif font-semibold text-black/50">Наборов не найдено</p>
                <p class="font-serif text-sm text-black/30 mt-1">Для выбранного цвета нет доступных наборов</p>
            </div>
        </div>
    </Drawer>
</template>
