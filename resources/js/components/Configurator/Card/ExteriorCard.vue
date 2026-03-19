<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { getDoorModelImage, getImageUrl } from '@/lib/utils'
import { Drawer, ToggleSwitch } from 'primevue'
import { computed, ref } from 'vue'
import ConfiguratorCard from './ConfiguratorCard.vue'

const doorCalcStore = useDoorCalc()

const showModelDrawer = ref(false)
const showPrimaryFilmDrawer = ref(false)
const showSecondaryFilmDrawer = ref(false)
const showCasingFilmDrawer = ref(false)
const showPrimaryPaintDrawer = ref(false)
const showSecondaryPaintDrawer = ref(false)

const exteriorModels = computed(() =>
    doorCalcStore.doorModels.filter(m => m.type === 'exterior')
)

const selectedModel = computed(() =>
    doorCalcStore.getDoorModelInfo(doorCalcStore.doorConfig.exterior.panelModel)
)

const hasPrimaryFilm = computed(() => selectedModel.value?.has_primary_film_color ?? false)
const hasSecondaryFilm = computed(() => selectedModel.value?.has_secondary_film_color ?? false)
const hasCasingFilm = computed(() => selectedModel.value?.has_casing_film_color ?? false)
const hasPrimaryPaint = computed(() => selectedModel.value?.has_primary_paint ?? false)
const hasSecondaryPaint = computed(() => selectedModel.value?.has_secondary_paint ?? false)

const isUndercoatDisabled = computed(() => {
    const primaryPaintName = doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.primaryColor ?? -1)?.name
    const secondaryPaintName = doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.secondaryColor ?? -1)?.name
    return primaryPaintName?.includes('Муар') || secondaryPaintName?.includes('Муар')
})

const primaryFilmColor = computed(() =>
    doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.primaryTexture ?? -1)
)
const secondaryFilmColor = computed(() =>
    doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.secondaryTexture ?? -1)
)
const casingFilmColor = computed(() =>
    doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.casingTexture ?? -1)
)
const primaryPaintColor = computed(() =>
    doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.primaryColor ?? -1)
)
const secondaryPaintColor = computed(() =>
    doorCalcStore.getPaintColor(doorCalcStore.doorConfig.metalPainting.secondaryColor ?? -1)
)
</script>

<template>
    <ConfiguratorCard :step="2" title="Наружная отделка">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div class="col-span-2">
                <label for="exterior-model" class="font-serif text-sky-900/70 text-sm inline-block mb-3">Наружная панель</label>
                <!-- Model selector row -->
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
                            <p class="font-serif text-xs text-sky-900/70 uppercase tracking-wider mb-0.5">Модель</p>
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
            </div>

            <div class="col-span-2">
                <label for="primary-film-color" class="font-serif text-sm text-sky-900/70 inline-block mb-3">Цвет пленки</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Primary film color row -->
                    <button
                        v-if="hasPrimaryFilm"
                        @click="showPrimaryFilmDrawer = true"
                        class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
                    >
                        <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0">
                            <img
                                v-if="primaryFilmColor"
                                :src="getImageUrl(primaryFilmColor.image ?? null)"
                                :alt="primaryFilmColor.name"
                                class="w-full rounded-md"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-serif text-sm text-sky-900/70 tracking-wider">Основной</p>
                            <p class="font-serif font-medium text-sky-900 truncate">
                                {{ primaryFilmColor?.name ?? 'Не выбрано' }}
                            </p>
                        </div>
                        <i class="pi pi-chevron-right text-sky-900/30" />
                    </button>

                    <!-- Secondary film color row -->
                    <button
                        v-if="hasSecondaryFilm"
                        @click="showSecondaryFilmDrawer = true"
                        class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
                    >
                        <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0">
                            <img
                                v-if="secondaryFilmColor"
                                :src="getImageUrl(secondaryFilmColor.image ?? null)"
                                :alt="secondaryFilmColor.name"
                                class="w-full rounded-md"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-serif text-sm text-sky-900/70 tracking-wider">Дополнительный</p>
                            <p class="font-serif font-medium text-sky-900 truncate">
                                {{ secondaryFilmColor?.name ?? 'Не выбрано' }}
                            </p>
                        </div>
                        <i class="pi pi-chevron-right text-sky-900/30" />
                    </button>

                    <!-- Casing film color row -->
                    <button
                        v-if="hasCasingFilm"
                        @click="showCasingFilmDrawer = true"
                        class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
                    >
                        <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0">
                            <img
                                v-if="casingFilmColor"
                                :src="getImageUrl(casingFilmColor.image ?? null)"
                                :alt="casingFilmColor.name"
                                class="w-full rounded-md"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-serif text-sm text-sky-900/70 tracking-wider">Наличник</p>
                            <p class="font-serif font-medium text-sky-900 truncate">
                                {{ casingFilmColor?.name ?? 'Не выбрано' }}
                            </p>
                        </div>
                        <i class="pi pi-chevron-right text-sky-900/30" />
                    </button>
                </div>
           </div>

            <!-- Metal painting -->
            <div class="col-span-2">
                <label class="font-serif text-sm text-sky-900/70 inline-block mb-3">Покраска металла</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Primary paint color -->
                    <button
                        v-if="hasPrimaryPaint"
                        @click="showPrimaryPaintDrawer = true"
                        class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
                    >
                        <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                            <img
                                v-if="primaryPaintColor"
                                :src="getImageUrl(primaryPaintColor.image ?? null)"
                                :alt="primaryPaintColor.name"
                                class="w-full h-full object-cover rounded-md"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-serif text-sm text-sky-900/70 tracking-wider">Основной</p>
                            <p class="font-serif font-medium text-sky-900 truncate">
                                {{ primaryPaintColor?.name ?? 'Не выбрано' }}
                            </p>
                        </div>
                        <i class="pi pi-chevron-right text-sky-900/30" />
                    </button>

                    <!-- Secondary paint color -->
                    <button
                        v-if="hasSecondaryPaint"
                        @click="showSecondaryPaintDrawer = true"
                        class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
                    >
                        <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden">
                            <img
                                v-if="secondaryPaintColor"
                                :src="getImageUrl(secondaryPaintColor.image ?? null)"
                                :alt="secondaryPaintColor.name"
                                class="w-full h-full object-cover rounded-md"
                            />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="font-serif text-sm text-sky-900/70 tracking-wider">Дополнительный</p>
                            <p class="font-serif font-medium text-sky-900 truncate">
                                {{ secondaryPaintColor?.name ?? 'Не выбрано' }}
                            </p>
                        </div>
                        <i class="pi pi-chevron-right text-sky-900/30" />
                    </button>
                </div>
            </div>

            <!-- Undercoat -->
            <div class="col-span-2">
                <div class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10">
                    <div>
                        <p class="font-serif text-sky-900">Предварительное цинкогрунтование</p>
                    </div>
                    <ToggleSwitch v-model="doorCalcStore.doorConfig.metalPainting.undercoat" :disabled="isUndercoatDisabled" />
                </div>
            </div>

        </div>
    </ConfiguratorCard>

    <!-- DRAWER: Panel model -->
    <Drawer v-model:visible="showModelDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Модель наружной панели</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="model in exteriorModels"
                :key="model.id"
                @click="() => { doorCalcStore.doorConfig.exterior.panelModel = model.id; showModelDrawer = false }"
                class="flex flex-col items-center gap-1.5 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
                <img :src="getDoorModelImage(model.image)" :alt="model.name" class="w-full rounded-sm" />
                <p
                    class="font-serif text-sm text-center px-1 transition-colors"
                    :class="doorCalcStore.doorConfig.exterior.panelModel === model.id ? 'font-bold text-sky-900' : 'text-neutral-500'"
                >
                    {{ model.name }}
                </p>
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
                v-for="color in doorCalcStore.filmColors"
                :key="color.id"
                @click="() => { doorCalcStore.doorConfig.exterior.primaryTexture = color.id; showPrimaryFilmDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    doorCalcStore.doorConfig.exterior.primaryTexture === color.id
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
                v-for="color in doorCalcStore.filmColors"
                :key="color.id"
                @click="() => { doorCalcStore.doorConfig.exterior.secondaryTexture = color.id; showSecondaryFilmDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    doorCalcStore.doorConfig.exterior.secondaryTexture === color.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(color.image ?? null)" :alt="color.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ color.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Casing film color -->
    <Drawer v-model:visible="showCasingFilmDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Цвет плёнки наличника</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="color in doorCalcStore.filmColors"
                :key="color.id"
                @click="() => { doorCalcStore.doorConfig.exterior.casingTexture = color.id; showCasingFilmDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    doorCalcStore.doorConfig.exterior.casingTexture === color.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(color.image ?? null)" :alt="color.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ color.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Primary paint color -->
    <Drawer v-model:visible="showPrimaryPaintDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Основной цвет покраски</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="paint in doorCalcStore.paints"
                :key="paint.id"
                @click="() => { doorCalcStore.doorConfig.metalPainting.primaryColor = paint.id; showPrimaryPaintDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    doorCalcStore.doorConfig.metalPainting.primaryColor === paint.id
                        ? 'border-sky-900'
                        : 'border-transparent hover:border-sky-900/30'
                ]"
            >
                <img :src="getImageUrl(paint.image ?? null)" :alt="paint.name ?? ''" class="w-full h-full object-cover" />
                <p class="text-xs text-center p-1 truncate">{{ paint.name }}</p>
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary paint color -->
    <Drawer v-model:visible="showSecondaryPaintDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Дополнительный цвет покраски</h2>
        </template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
            <div
                v-for="paint in doorCalcStore.paints"
                :key="paint.id"
                @click="() => { doorCalcStore.doorConfig.metalPainting.secondaryColor = paint.id; showSecondaryPaintDrawer = false }"
                :class="[
                    'cursor-pointer border transition-all duration-200 aspect-video',
                    doorCalcStore.doorConfig.metalPainting.secondaryColor === paint.id
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
