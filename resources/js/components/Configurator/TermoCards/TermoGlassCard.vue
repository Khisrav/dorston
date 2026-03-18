<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { Drawer } from 'primevue'
import { ref } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showExteriorDrawer = ref(false)
const showInteriorDrawer = ref(false)
</script>

<template>
    <ConfiguratorCard :step="5" title="Стекло">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                type="button"
                @click="showExteriorDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                    <img
                        v-if="store.doorConfig.glassColor.exterior && store.doorConfig.glassColor.exterior !== -1"
                        :src="getImageUrl(store.getFilmColor(store.doorConfig.glassColor.exterior)?.image ?? null)"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Снаружи</p>
                    <p class="font-serif font-medium text-sky-900 truncate">
                        {{ store.doorConfig.glassColor.exterior && store.doorConfig.glassColor.exterior !== -1
                            ? store.getFilmColor(store.doorConfig.glassColor.exterior)?.name
                            : 'Не выбрано' }}
                    </p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>

            <button
                type="button"
                @click="showInteriorDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                    <img
                        v-if="store.doorConfig.glassColor.interior && store.doorConfig.glassColor.interior !== -1"
                        :src="getImageUrl(store.getFilmColor(store.doorConfig.glassColor.interior)?.image ?? null)"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Изнутри</p>
                    <p class="font-serif font-medium text-sky-900 truncate">
                        {{ store.doorConfig.glassColor.interior && store.doorConfig.glassColor.interior !== -1
                            ? store.getFilmColor(store.doorConfig.glassColor.interior)?.name
                            : 'Не выбрано' }}
                    </p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>
        </div>

    </ConfiguratorCard>

    <!-- DRAWER: Glass exterior -->
    <Drawer v-model:visible="showExteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Стекло: Снаружи</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="color in store.filmColors"
                :key="color.id"
                @click="() => { store.doorConfig.glassColor.exterior = color.id; showExteriorDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.glassColor.exterior === color.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(color.image ?? null)" :alt="color.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ color.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Glass interior -->
    <Drawer v-model:visible="showInteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Стекло: Изнутри</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="color in store.filmColors"
                :key="color.id"
                @click="() => { store.doorConfig.glassColor.interior = color.id; showInteriorDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.glassColor.interior === color.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(color.image ?? null)" :alt="color.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ color.name }}</p>
            </div>
        </div>
    </Drawer>
</template>
