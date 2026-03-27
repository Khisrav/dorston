<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { type Furniture, type peepholePosition } from '@/types/configurator'
import { Button, Drawer, RadioButton, SelectButton, ToggleSwitch } from 'primevue'
import { computed, ref, watch } from 'vue'
import ConfiguratorCard from './ConfiguratorCard.vue'

const doorCalcStore = useDoorCalc()

const showSetDrawer = ref(false)

// ─── Type definitions ─────────────────────────────────────────────────────────

const typeOptions: { value: Furniture['furniture_type']; label: string }[] = [
    { value: 'push',       label: 'Нажимная'    },
    { value: 'pull',       label: 'Бугельная'   },
    { value: 'electronic', label: 'Электронная' },
]

// ─── Color definitions ────────────────────────────────────────────────────────

const colorOptions: { value: Furniture['color']; label: string; image: string }[] = [
    { value: 'black',        label: 'Матовый чёрный', image: '/assets/furniture-colors/matte-black.png'  },
    { value: 'chrome',       label: 'Хром',           image: '/assets/furniture-colors/chrome.png'       },
    { value: 'matte-chrome', label: 'Матовый хром',   image: '/assets/furniture-colors/matte-chrome.png' },
    { value: 'gold',         label: 'Золото',         image: '/assets/furniture-colors/gold.png'         },
    { value: 'bronze',       label: 'Бронза',         image: '/assets/furniture-colors/bronze.png'       },
]

// ─── Shape definitions ────────────────────────────────────────────────────────

const drawerShapeOptions: { value: 'rectangular' | 'oval'; label: string }[] = [
    { value: 'rectangular', label: 'Квадратный' },
    { value: 'oval',        label: 'Круглый'    },
]
const drawerShape = ref<'rectangular' | 'oval'>('rectangular')

// ─── Peephole options ─────────────────────────────────────────────────────────

const peepholeOptions: { label: string; value: peepholePosition }[] = [
    { label: 'Нет',       value: 'None'   },
    { label: 'Сбоку',     value: 'Side'   },
    { label: 'По центру', value: 'Center' },
]

// ─── Computed ─────────────────────────────────────────────────────────────────

const selectedType  = computed(() => doorCalcStore.doorConfig.furniture.furnitureType)
const selectedColor = computed(() => doorCalcStore.doorConfig.furniture.furnitureColor as Furniture['color'] | undefined)
const selectedSet   = computed(() => doorCalcStore.getFurnitureSet(doorCalcStore.doorConfig.furniture.furnitureSetId ?? -1))

const selectedColorLabel = computed(() =>
    colorOptions.find(c => c.value === selectedColor.value)?.label ?? ''
)
const selectedTypeLabel = computed(() =>
    typeOptions.find(t => t.value === selectedType.value)?.label ?? ''
)

// Colors that have at least one furniture for the current type
const availableColorOptions = computed(() => {
    if (!selectedType.value) return colorOptions
    return colorOptions.filter(opt =>
        doorCalcStore.furnitures.some(
            f => f.furniture_type === selectedType.value && f.color === opt.value
        )
    )
})

/** Sets shown in the drawer, filtered by type + color + (shape if push) */
const drawerSets = computed(() => {
    const type  = selectedType.value
    const color = selectedColor.value
    if (!type || !color) return []

    let sets = doorCalcStore.furnitures.filter(f => f.furniture_type === type && f.color === color)

    if (type === 'push') {
        sets = sets.filter(f => f.shape === drawerShape.value)
    }

    return sets
})

// ─── Actions ──────────────────────────────────────────────────────────────────

function autoSelectFirst() {
    const type  = selectedType.value
    const color = selectedColor.value
    if (!type || !color) return

    let candidates = doorCalcStore.furnitures.filter(
        f => f.furniture_type === type && f.color === color
    )
    if (type === 'push') {
        candidates = candidates.filter(f => f.shape === drawerShape.value)
        if (!candidates.length) {
            candidates = doorCalcStore.furnitures.filter(
                f => f.furniture_type === type && f.color === color
            )
        }
    }
    const first = candidates[0]
    if (first) {
        doorCalcStore.doorConfig.furniture.furnitureSetId = first.id
        doorCalcStore.doorConfig.furniture.furnitureShape = first.shape
    } else {
        doorCalcStore.doorConfig.furniture.furnitureSetId = -1
        doorCalcStore.doorConfig.furniture.furnitureShape = undefined
    }
}

function selectType(type: Furniture['furniture_type']) {
    doorCalcStore.doorConfig.furniture.furnitureType = type
    drawerShape.value = 'rectangular'

    // If the currently selected color has no furniture for the new type, fall back
    const colorStillValid = availableColorOptions.value.some(c => c.value === selectedColor.value)
    if (!colorStillValid) {
        doorCalcStore.doorConfig.furniture.furnitureColor = availableColorOptions.value[0]?.value
    }

    autoSelectFirst()
}

function selectColor(color: Furniture['color']) {
    doorCalcStore.doorConfig.furniture.furnitureColor = color
    autoSelectFirst()
}

function selectSet(furniture: Furniture) {
    doorCalcStore.doorConfig.furniture.furnitureSetId = furniture.id
    doorCalcStore.doorConfig.furniture.furnitureShape = furniture.shape
    doorCalcStore.doorConfig.furniture.furnitureColor = furniture.color
    doorCalcStore.doorConfig.furniture.furnitureType  = furniture.furniture_type
    showSetDrawer.value = false
}

function openSetDrawer() {
    const current = selectedSet.value
    if (current && selectedType.value === 'push' && (current.shape === 'rectangular' || current.shape === 'oval')) {
        drawerShape.value = current.shape
    }
    showSetDrawer.value = true
}

// Re-run auto-select when shape filter changes inside the drawer
watch(drawerShape, autoSelectFirst)
</script>

<template>
    <ConfiguratorCard :step="4" title="Фурнитура">

        <!-- ── Step 1: Type ────────────────────────────────────────── -->
        <p class="font-serif text-sm text-sky-900/70 mb-3">Тип ручки</p>

        <!-- Mobile: radio buttons -->
        <div class="flex flex-col gap-2 mb-5 md:hidden">
            <label
                v-for="opt in typeOptions"
                :key="opt.value"
                class="flex items-center gap-3 cursor-pointer select-none"
            >
                <RadioButton
                    :model-value="selectedType"
                    :value="opt.value"
                    @update:model-value="selectType"
                />
                <span class="text-sm text-sky-900/80">{{ opt.label }}</span>
            </label>
        </div>

        <!-- Desktop: segmented SelectButton -->
        <div class="hidden md:flex mb-5">
        <SelectButton
            :model-value="selectedType"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="selectType"
        />
        </div>

        <!-- ── Step 2: Color (only when type is selected) ─────────── -->
        <template v-if="selectedType">
            <div class="border-t border-sky-900/5 pt-4 mb-5">
                <p class="font-serif text-sm text-sky-900/70 mb-3">Цвет фурнитуры</p>
                <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
                    <button
                        v-for="opt in availableColorOptions"
                        :key="opt.value"
                        type="button"
                        :title="opt.label"
                        @click="selectColor(opt.value)"
                        class="flex flex-col items-center gap-1.5 transition-all duration-200"
                    >
                        <div
                            :class="[
                                'size-14 rounded-full transition-all duration-200',
                                selectedColor === opt.value
                                    ? 'ring-2 ring-sky-900 ring-offset-2'
                                    : 'ring-1 ring-black/10 hover:ring-sky-900/40 hover:ring-offset-1'
                            ]"
                        >
                            <img :src="opt.image" :alt="opt.label" class="size-full object-contain drop-shadow-sm" />
                        </div>
                        <p class="text-xs text-sky-900/50 mt-1 text-center">{{ opt.label }}</p>
                    </button>
                </div>
            </div>

            <!-- ── Step 3: Set picker (only when color is selected) ── -->
            <div v-if="selectedColor" class="border-t border-sky-900/5 pt-4">
                <p class="font-serif text-sm text-sky-900/70 mb-3">Модель фурнитуры</p>

                <!-- Selected set preview -->
                <div
                    v-if="selectedSet"
                    class="flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 mb-3 cursor-pointer hover:border-sky-900/30 transition-colors w-[calc(100vw-64px)] md:w-auto"
                    @click="openSetDrawer"
                >
                    <div class="size-16 shrink-0 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <img
                            v-if="selectedSet.preview"
                            :src="getImageUrl(selectedSet.preview)"
                            :alt="selectedSet.title ?? 'Модель'"
                            class="size-full object-cover"
                        />
                        <span v-else class="text-xs text-neutral-400 font-serif text-center px-1">Нет фото</span>
                    </div>
                    <div class="flex-1 min-w-0 overflow-hidden">
                        <p class="font-serif font-semibold text-sky-900 text-sm truncate line-clamp-1">
                            {{ selectedSet.title ?? 'Модель без названия' }}
                        </p>
                    </div>
                    <!-- <Button variant="outlined" size="small" label="Изменить" class="shrink-0" /> -->
                    <i class="pi pi-chevron-right text-sky-900/20 ml-auto text-sm" />
                </div>

                <!-- No set selected -->
                <div
                    v-else
                    class="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-sky-900/20 cursor-pointer hover:border-sky-900/40 transition-colors"
                    @click="openSetDrawer"
                >
                    <div class="size-16 shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center">
                        <i class="pi pi-wrench text-neutral-300 text-lg" />
                    </div>
                    <div>
                        <p class="font-serif font-semibold text-sky-900/50 text-sm">Модель не выбрана</p>
                        <p class="font-serif text-xs text-black/30 mt-0.5">Нажмите, чтобы выбрать</p>
                    </div>
                    <i class="pi pi-chevron-right text-sky-900/20 ml-auto text-sm" />
                </div>
            </div>
        </template>

        <div class="border-t border-sky-900/5 my-4" />

        <!-- ── Night latch turner ──────────────────────────────────── -->
        <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
                <!-- Placeholder: actual night latch turner image will be different -->
                <div
                    class="size-14 rounded-xl bg-neutral-100 shrink-0"
                    :class="doorCalcStore.doorConfig.furniture.hasNightLatchTurner ? 'opacity-100' : 'opacity-60'"
                    aria-hidden="true"
                />
                <p class="font-serif text-sm text-sky-900/70">Ночная задвижка + вертушок</p>
            </div>
            <ToggleSwitch v-model="doorCalcStore.doorConfig.furniture.hasNightLatchTurner" />
        </div>

        <div class="border-t border-sky-900/5 my-4" />

        <div class="flex items-center gap-4">
            <div
                v-if="selectedSet?.peephole_preview"
                class="flex-shrink-0"
            >
                <img
                    :src="getImageUrl(selectedSet.peephole_preview)"
                    :alt="selectedSet.title ? `Глазок — ${selectedSet.title}` : 'Глазок'"
                    class="w-24 h-24 md:w-20 md:h-20 rounded-xl object-cover border border-sky-100 shadow-sm bg-white"
                />
            </div>
            <div class="flex-1">
                <p class="font-serif text-sm text-sky-900/70 mb-2">Глазок</p>
                <!-- Mobile: radio buttons -->
                <div class="flex flex-col gap-2 md:hidden">
                    <label
                        v-for="opt in peepholeOptions"
                        :key="opt.value"
                        class="flex items-center gap-3 cursor-pointer select-none"
                    >
                        <RadioButton
                            v-model="doorCalcStore.doorConfig.peepholePosition"
                            :value="opt.value"
                        />
                        <span class="text-sm text-sky-900/80">{{ opt.label }}</span>
                    </label>
                </div>
                <!-- Desktop: segmented SelectButton -->
                <div class="hidden md:flex">
                    <SelectButton
                        v-model="doorCalcStore.doorConfig.peepholePosition"
                        :options="peepholeOptions"
                        option-label="label"
                        option-value="value"
                        size="small"
                        fluid
                    />
                </div>
            </div>
        </div>

    </ConfiguratorCard>

    <!-- ── Drawer: furniture set picker ───────────────────────────────── -->
    <Drawer
        v-model:visible="showSetDrawer"
        position="right"
        class="!w-full sm:!w-[90vw] md:!w-[720px]"
    >
        <template #header>
            <div class="flex items-center gap-3">
                <img
                    v-if="selectedColor"
                    :src="colorOptions.find(c => c.value === selectedColor)?.image"
                    :alt="selectedColorLabel"
                    class="size-8 object-contain drop-shadow-sm"
                />
                <div>
                    <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                        Модели фурнитуры
                    </h2>
                    <p class="font-serif text-sm text-black/50 mt-0.5">
                        {{ selectedTypeLabel }} · {{ selectedColorLabel }}
                    </p>
                </div>
            </div>
        </template>

        <div class="p-1 space-y-5">

            <!-- Shape picker — push type only ───────────────────────── -->
            <div v-if="selectedType === 'push'" class="pb-1">
                <p class="font-serif text-xs text-black/50 mb-2">Форма накладки</p>
                <SelectButton
                    v-model="drawerShape"
                    :options="drawerShapeOptions"
                    option-label="label"
                    option-value="value"
                    size="small"
                    fluid
                />
            </div>

            <!-- Sets grid ────────────────────────────────────────────── -->
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="furniture in drawerSets"
                    :key="furniture.id"
                    type="button"
                    @click="selectSet(furniture)"
                    :class="[
                        'flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                        doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <img
                            v-if="furniture.preview"
                            :src="getImageUrl(furniture.preview)"
                            :alt="furniture.title ?? 'Модель'"
                            class="w-full h-full"
                        />
                        <span v-else class="text-xs text-neutral-400 font-serif text-center px-2">Нет фото</span>
                    </div>
                    <div class="flex items-center gap-2 p-2.5 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ furniture.title ?? 'Модель без названия' }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="doorCalcStore.doorConfig.furniture.furnitureSetId === furniture.id"
                                class="size-6 rounded-full bg-sky-900 flex items-center justify-center"
                            >
                                <i class="pi pi-check text-white text-xs" />
                            </div>
                            <div v-else class="size-6 rounded-full border border-sky-900/20" />
                        </div>
                    </div>
                </button>
            </div>

            <!-- Empty state ──────────────────────────────────────────── -->
            <div v-if="!drawerSets.length" class="flex flex-col items-center justify-center py-12 text-center">
                <i class="pi pi-wrench text-4xl text-neutral-300 mb-3" />
                <p class="font-serif font-semibold text-black/40">Моделей не найдено</p>
                <p class="font-serif text-sm text-black/30 mt-1">
                    Для выбранного типа и цвета<span v-if="selectedType === 'push'"> и формы</span> нет доступных моделей
                </p>
            </div>

        </div>
    </Drawer>
</template>
