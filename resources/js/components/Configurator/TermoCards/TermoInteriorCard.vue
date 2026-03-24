<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { getDoorModelImage, getImageUrl } from '@/lib/utils'
import { Drawer } from 'primevue'
import { Pencil } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showModelDrawer = ref(false)
const showPrimaryFilmDrawer = ref(false)

const interiorModels = computed(() =>
    store.doorModels.filter(m => m.type === 'interior')
)

const selectedModel = computed(() =>
    store.getDoorModelInfo(store.doorConfig.interior.panelModel)
)

const primaryFilmColor = computed(() =>
    store.getFilmColor(store.doorConfig.interior.primaryTexture ?? -1)
)
</script>

<template>
    <ConfiguratorCard :step="3" title="Внутренняя отделка">

        <label class="font-serif text-sm inline-block mb-3 text-sky-900/70">Вид изнутри</label>
        <div class="w-full flex flex-col md:flex-row items-stretch justify-between gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200">
            <div class="flex items-center gap-3 flex-1 min-w-0 w-full">
                <div class="w-24 h-24 bg-neutral-100 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                        v-if="selectedModel"
                        :src="getDoorModelImage(selectedModel.image ?? null)"
                        :alt="selectedModel.name"
                        class="h-full"
                    />
                </div>
                <div class="min-w-0 flex flex-col flex-1">
                    <p class="font-serif text-xs text-sky-900/40 uppercase tracking-wider mb-0.5">Вид изнутри</p>
                    <p class="font-serif font-semibold text-sky-900 truncate">
                        {{ selectedModel?.name ?? 'Не выбрано' }}
                    </p>
                </div>
                <button
                    type="button"
                    class="md:hidden shrink-0 ml-auto inline-flex items-center justify-center size-9 rounded-xl border border-sky-900/20 text-sky-900/55 hover:border-sky-900/40 hover:text-sky-900 transition-colors"
                    aria-label="Изменить дизайн"
                    @click="showModelDrawer = true"
                >
                    <Pencil class="size-4" stroke-width="2" />
                </button>
            </div>
            <div class="hidden md:flex md:items-center md:justify-end md:shrink-0">
                <Button
                    variant="outlined"
                    size="small"
                    class="md:ml-4"
                    label="Изменить дизайн"
                    @click="showModelDrawer = true"
                />
            </div>
        </div>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <label class="font-serif text-sm inline-block mb-3 text-sky-900/70">Цвет плёнки</label>
        <button
            type="button"
            @click="showPrimaryFilmDrawer = true"
            class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
        >
            <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                <img
                    v-if="primaryFilmColor"
                    :src="getImageUrl(primaryFilmColor.image ?? null)"
                    :alt="primaryFilmColor.name"
                    class="w-full h-full object-cover rounded-md"
                />
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-serif text-sm text-sky-900/40 tracking-wider">Основной</p>
                <p class="font-serif font-medium text-sky-900 truncate">
                    {{ primaryFilmColor?.name ?? 'Не выбрано' }}
                </p>
            </div>
            <i class="pi pi-chevron-right text-sky-900/30" />
        </button>

    </ConfiguratorCard>

    <!-- DRAWER: Panel model -->
    <Drawer v-model:visible="showModelDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[520px]">
        <template #header>
            <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                Дизайн внутренней отделки
            </h2>
        </template>
        <div class="p-1">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                    v-for="model in interiorModels"
                    :key="model.id"
                    type="button"
                    @click="() => { store.doorConfig.interior.panelModel = model.id; showModelDrawer = false }"
                    :class="[
                        'flex flex-col overflow-hidden rounded-none border text-left transition-all duration-200 cursor-pointer',
                        store.doorConfig.interior.panelModel === model.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full bg-neutral-100 flex items-start justify-center px-0.5 pt-0.5">
                        <img
                            :src="getDoorModelImage(model.image)"
                            :alt="model.name"
                            class="w-full h-auto max-h-[min(70vh,520px)] object-contain object-top block"
                        />
                    </div>
                    <div class="flex items-center gap-2 p-2 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ model.name }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="store.doorConfig.interior.panelModel === model.id"
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

    <!-- DRAWER: Primary film color -->
    <Drawer v-model:visible="showPrimaryFilmDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[520px]">
        <template #header>
            <h2 class="font-serif text-lg font-bold text-black tracking-tight leading-none">
                Основной цвет плёнки
            </h2>
        </template>
        <div class="p-1">
            <div class="grid grid-cols-2 gap-3">
                <button
                    v-for="color in store.filmColors"
                    :key="color.id"
                    type="button"
                    @click="() => { store.doorConfig.interior.primaryTexture = color.id; showPrimaryFilmDrawer = false }"
                    :class="[
                        'flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 cursor-pointer',
                        store.doorConfig.interior.primaryTexture === color.id
                            ? 'border-sky-900/60 border-2 bg-sky-900/5'
                            : 'border-sky-900/10 hover:border-sky-900/30'
                    ]"
                >
                    <div class="w-full aspect-[4/3] bg-neutral-100 overflow-hidden">
                        <img
                            :src="getImageUrl(color.image ?? null)"
                            :alt="color.name ?? ''"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="flex items-center gap-2 p-2.5 min-w-0">
                        <p class="font-serif font-medium text-sky-900 text-xs leading-snug line-clamp-2 flex-1 min-w-0">
                            {{ color.name }}
                        </p>
                        <div class="shrink-0">
                            <div
                                v-if="store.doorConfig.interior.primaryTexture === color.id"
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
