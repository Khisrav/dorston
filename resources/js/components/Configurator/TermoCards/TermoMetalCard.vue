<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { Drawer, ToggleSwitch } from 'primevue'
import { ref, computed, watch } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showPrimaryDrawer = ref(false)
const showSecondaryDrawer = ref(false)
const showInnerCasingDrawer = ref(false)

const isUndercoatActive = computed(() => {
    const primaryPaintName = store.getPaintColor(store.doorConfig.metalPainting.primaryColor ?? -1)?.name
    const secondaryPaintName = store.getPaintColor(store.doorConfig.metalPainting.secondaryColor ?? -1)?.name
    const innerCasingPaintName = store.getPaintColor(store.doorConfig.metalPainting.innerCasingColor ?? -1)?.name
    return !!(primaryPaintName?.includes('Муар') || secondaryPaintName?.includes('Муар') || innerCasingPaintName?.includes('Муар'))
})

watch(isUndercoatActive, (active) => {
    if (active) {
        store.doorConfig.metalPainting.undercoat = true
    }
}, { immediate: true })
</script>

<template>
    <ConfiguratorCard :step="4" title="Покраска металла">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                type="button"
                @click="showPrimaryDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                    <img
                        v-if="store.doorConfig.metalPainting.primaryColor && store.doorConfig.metalPainting.primaryColor !== -1"
                        :src="getImageUrl(store.getPaintColor(store.doorConfig.metalPainting.primaryColor)?.image ?? null)"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Основной</p>
                    <p class="font-serif font-medium text-sky-900 truncate">
                        {{ store.doorConfig.metalPainting.primaryColor && store.doorConfig.metalPainting.primaryColor !== -1
                            ? store.getPaintColor(store.doorConfig.metalPainting.primaryColor)?.name
                            : 'Не выбрано' }}
                    </p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>

            <button
                v-if="store.doorConfig.exterior.panelModel === 82"
                type="button"
                @click="showSecondaryDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                    <img
                        v-if="store.doorConfig.metalPainting.secondaryColor && store.doorConfig.metalPainting.secondaryColor !== -1"
                        :src="getImageUrl(store.getPaintColor(store.doorConfig.metalPainting.secondaryColor)?.image ?? null)"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Дополнительный</p>
                    <p class="font-serif font-medium text-sky-900 truncate">
                        {{ store.doorConfig.metalPainting.secondaryColor && store.doorConfig.metalPainting.secondaryColor !== -1
                            ? store.getPaintColor(store.doorConfig.metalPainting.secondaryColor)?.name
                            : 'Не выбрано' }}
                    </p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>

            <button
                type="button"
                @click="showInnerCasingDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                    <img
                        v-if="store.doorConfig.metalPainting.innerCasingColor && store.doorConfig.metalPainting.innerCasingColor !== -1"
                        :src="getImageUrl(store.getPaintColor(store.doorConfig.metalPainting.innerCasingColor)?.image ?? null)"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Внутренняя рамка</p>
                    <p class="font-serif font-medium text-sky-900 truncate">
                        {{ store.doorConfig.metalPainting.innerCasingColor && store.doorConfig.metalPainting.innerCasingColor !== -1
                            ? store.getPaintColor(store.doorConfig.metalPainting.innerCasingColor)?.name
                            : 'Не выбрано' }}
                    </p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>
        </div>

        <div class="border-t border-sky-900/5 my-4"></div>

        <div class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10">
            <div>
                <p class="font-serif text-sm text-sky-900/70">Цинкогрунтование</p>
            </div>
            <ToggleSwitch v-model="store.doorConfig.metalPainting.undercoat" :disabled="isUndercoatActive" />
        </div>
    </ConfiguratorCard>

    <!-- DRAWER: Primary color -->
    <Drawer v-model:visible="showPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[720px]">
        <template #header>
            <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                Покраска металла: основной цвет
            </h2>
        </template>
        <div class="p-1">
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="paint in store.paints"
                    :key="paint.id"
                    type="button"
                    @click="() => { store.doorConfig.metalPainting.primaryColor = paint.id; showPrimaryDrawer = false }"
                    :class="[
                        'flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                        store.doorConfig.metalPainting.primaryColor === paint.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                            :src="getImageUrl(paint.image ?? null)"
                            :alt="paint.name ?? ''"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="flex items-center gap-2 p-2.5 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ paint.name }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="store.doorConfig.metalPainting.primaryColor === paint.id"
                                class="size-6 rounded-full bg-sky-900 flex items-center justify-center"
                            >
                                <i class="pi pi-check text-white text-xs" />
                            </div>
                            <div v-else class="size-6 rounded-full border border-sky-900/20" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary color (Nova) -->
    <Drawer v-model:visible="showSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[720px]">
        <template #header>
            <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                Дополнительный цвет (Nova)
            </h2>
        </template>
        <div class="p-1">
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="paint in store.paints"
                    :key="paint.id"
                    type="button"
                    @click="() => { store.doorConfig.metalPainting.secondaryColor = paint.id; showSecondaryDrawer = false }"
                    :class="[
                        'flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                        store.doorConfig.metalPainting.secondaryColor === paint.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                            :src="getImageUrl(paint.image ?? null)"
                            :alt="paint.name ?? ''"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="flex items-center gap-2 p-2.5 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ paint.name }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="store.doorConfig.metalPainting.secondaryColor === paint.id"
                                class="size-6 rounded-full bg-sky-900 flex items-center justify-center"
                            >
                                <i class="pi pi-check text-white text-xs" />
                            </div>
                            <div v-else class="size-6 rounded-full border border-sky-900/20" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Inner casing color -->
    <Drawer v-model:visible="showInnerCasingDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[720px]">
        <template #header>
            <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                Цвет внутреннего обрамления
            </h2>
        </template>
        <div class="p-1">
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="paint in store.paints"
                    :key="paint.id"
                    type="button"
                    @click="() => { store.doorConfig.metalPainting.innerCasingColor = paint.id; showInnerCasingDrawer = false }"
                    :class="[
                        'flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                        store.doorConfig.metalPainting.innerCasingColor === paint.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                            :src="getImageUrl(paint.image ?? null)"
                            :alt="paint.name ?? ''"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="flex items-center gap-2 p-2.5 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ paint.name }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="store.doorConfig.metalPainting.innerCasingColor === paint.id"
                                class="size-6 rounded-full bg-sky-900 flex items-center justify-center"
                            >
                                <i class="pi pi-check text-white text-xs" />
                            </div>
                            <div v-else class="size-6 rounded-full border border-sky-900/20" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </Drawer>
</template>
