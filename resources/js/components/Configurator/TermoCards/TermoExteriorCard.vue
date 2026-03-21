<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { getDoorModelImage, getImageUrl } from '@/lib/utils'
import { Drawer } from 'primevue'
import { computed, ref } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showModelDrawer = ref(false)
const showPrimaryFilmDrawer = ref(false)
const showSecondaryFilmDrawer = ref(false)

const exteriorModels = computed(() => {
    const termoPlusModels = ['Optima', 'Credo', 'Credo SP', 'Senator SP', 'Senator Max SP', 'Nova', 'Imperato']

    if (store.doorConfig.constructive === 'Termo+') {
        return store.doorModels.filter(m => m.type === 'exterior' && termoPlusModels.includes(m.name))
    } else {
        return store.doorModels.filter(m => m.type === 'exterior' && !termoPlusModels.includes(m.name))
    }
})

const selectedModel = computed(() =>
    store.getDoorModelInfo(store.doorConfig.exterior.panelModel)
)

const primaryFilmColor = computed(() =>
    store.getFilmColor(store.doorConfig.exterior.primaryTexture ?? -1)
)
const secondaryFilmColor = computed(() =>
    store.getFilmColor(store.doorConfig.exterior.secondaryTexture ?? -1)
)
</script>

<template>
    <ConfiguratorCard :step="2" title="Наружная отделка">

        <label class="font-serif text-sm inline-block mb-3 text-sky-900/70">Вид снаружи</label>
        <div class="w-full flex flex-col md:flex-row items-center md:items-stretch justify-between gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200">
            <div class="flex items-center gap-3 flex-1 w-full">
                <div class="w-24 h-24 bg-neutral-100 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                        v-if="selectedModel"
                        :src="getDoorModelImage(selectedModel.image ?? null)"
                        :alt="selectedModel.name"
                        class="h-full"
                    />
                </div>
                <div class="min-w-0 flex flex-col">
                    <p class="font-serif text-xs text-sky-900/40 uppercase tracking-wider mb-0.5">Вид снаружи</p>
                    <p class="font-serif font-semibold text-sky-900 truncate">
                        {{ selectedModel?.name ?? 'Не выбрано' }}
                    </p>
                </div>
            </div>
            <div class="w-full md:w-auto md:flex md:items-center md:justify-end">
                <Button
                    variant="outlined"
                    size="small"
                    class="mt-2 md:mt-0 md:ml-4 self-start md:self-center"
                    label="Изменить дизайн"
                    @click="showModelDrawer = true"
                />
            </div>
        </div>

        <div v-if="store.doorConfig.constructive !== 'Termo+'" class="border-t border-sky-900/5 my-4 mb-2" />

        <label v-if="store.doorConfig.constructive !== 'Termo+'" class="font-serif text-sm inline-block mb-3 text-sky-900/70">Цвет HPL панели</label>
        <div v-if="store.doorConfig.constructive !== 'Termo+'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
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
        </div>

    </ConfiguratorCard>

    <!-- DRAWER: Panel model -->
    <Drawer v-model:visible="showModelDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Дизайн наружной отделки</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="model in exteriorModels"
                :key="model.id"
                @click="() => { store.doorConfig.exterior.panelModel = model.id; showModelDrawer = false }"
                class="flex flex-col items-center gap-1.5 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
                <img :src="getDoorModelImage(model.image)" :alt="model.name" class="w-full rounded-sm" />
                <p
                    class="font-serif text-sm text-center px-1 transition-colors"
                    :class="store.doorConfig.exterior.panelModel === model.id ? 'font-bold text-sky-900' : 'text-neutral-500'"
                >{{ model.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Primary film color -->
    <Drawer v-model:visible="showPrimaryFilmDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Основной цвет плёнки</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="color in store.filmColors"
                :key="color.id"
                @click="() => { store.doorConfig.exterior.primaryTexture = color.id; showPrimaryFilmDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.exterior.primaryTexture === color.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(color.image ?? null)" :alt="color.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ color.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary film color -->
    <Drawer v-model:visible="showSecondaryFilmDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Дополнительный цвет плёнки</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="color in store.filmColors"
                :key="color.id"
                @click="() => { store.doorConfig.exterior.secondaryTexture = color.id; showSecondaryFilmDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    store.doorConfig.exterior.secondaryTexture === color.id
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
