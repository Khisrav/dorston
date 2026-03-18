<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { Drawer, ToggleSwitch } from 'primevue'
import { ref } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showPrimaryDrawer = ref(false)
const showSecondaryDrawer = ref(false)
const showInnerCasingDrawer = ref(false)
</script>

<template>
    <ConfiguratorCard :step="4" title="Покраска металла">

        <div class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10 mb-4">
            <p class="font-serif text-sm text-sky-900/70">Цинкогрунтование</p>
            <ToggleSwitch v-model="store.doorConfig.metalPainting.undercoat" />
        </div>

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

    </ConfiguratorCard>

    <!-- DRAWER: Primary color -->
    <Drawer v-model:visible="showPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Покраска металла: Основной цвет</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="paint in store.paints"
                :key="paint.id"
                @click="() => { store.doorConfig.metalPainting.primaryColor = paint.id; showPrimaryDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.metalPainting.primaryColor === paint.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(paint.image ?? null)" :alt="paint.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ paint.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary color (Nova) -->
    <Drawer v-model:visible="showSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Покраска металла: Дополнительный цвет (Nova)</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="paint in store.paints"
                :key="paint.id"
                @click="() => { store.doorConfig.metalPainting.secondaryColor = paint.id; showSecondaryDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.metalPainting.secondaryColor === paint.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(paint.image ?? null)" :alt="paint.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ paint.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Inner casing color -->
    <Drawer v-model:visible="showInnerCasingDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Цвет внутреннего обрамления</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="paint in store.paints"
                :key="paint.id"
                @click="() => { store.doorConfig.metalPainting.innerCasingColor = paint.id; showInnerCasingDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.metalPainting.innerCasingColor === paint.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(paint.image ?? null)" :alt="paint.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ paint.name }}</p>
            </div>
        </div>
    </Drawer>
</template>
