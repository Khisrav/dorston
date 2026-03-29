<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { type doorConstructive, type doorBoxDesign, type doorHandleSide } from '@/types/configurator'
import ConfiguratorCard from './ConfiguratorCard.vue'
import { InfoIcon, PanelLeftIcon, PanelRightIcon } from 'lucide-vue-next'
import { Select, Popover } from 'primevue'
import { computed, ref } from 'vue'

function generateRange(min: number, max: number, step: number): { label: string; value: number }[] {
    const result: { label: string; value: number }[] = []
    for (let i = min; i <= max; i += step) result.push({ label: `${i} мм`, value: i })
    return result
}

const widthOptions  = generateRange(800, 1050, 10)
const heightOptions = generateRange(1800, 2300, 10)

const doorCalcStore = useDoorCalc()

const constructiveOptions: { value: doorConstructive; label: string; image: string; description: string }[] = [
    {
        value: 'Comfort',
        label: 'Comfort',
        image: '/assets/ui/comfort-constructive.jpg',
        description: 'Короб: 1,2 мм (открытый). Уплотнитель на полотне: 2 шт. (Шлегель). Уплотнитель на коробе: D-образный. Заполнитель двери: Нет (полая)',
    },
    {
        value: 'Absolut',
        label: 'Absolut',
        image: '/assets/ui/absolut-constructive.jpg',
        description: 'Короб: 1,4 мм (открытый). Уплотнитель на полотне: 2 шт. (Шлегель). Уплотнитель на коробе: D-образный. Заполнитель двери: Минеральная вата 11кг/м3 + пенополистирол',
    },
]

const boxDesignOptions: { value: doorBoxDesign; label: string; image: string; description: string }[] = [
    {
        value: 'Closed',
        label: 'Закрытый',
        image: '/assets/ui/box-design-closed.webp',
        description: 'С утеплением',
    },
    {
        value: 'Opened',
        label: 'Открытый',
        image: '/assets/ui/box-design-opened.webp',
        description: 'Без утепления',
    },
]

const handleSideOptions: { value: doorHandleSide; label: string; icon: typeof PanelLeftIcon }[] = [
    { value: 'Left',  label: 'Левая',  icon: PanelLeftIcon },
    { value: 'Right', label: 'Правая', icon: PanelRightIcon },
]

const constructivePopover = ref()
const boxDesignPopover = ref()

const activeConstructiveOpt = ref<typeof constructiveOptions[0] | null>(null)
const activeBoxDesignOpt = ref<typeof boxDesignOptions[0] | null>(null)

function toggleConstructiveInfo(opt: typeof constructiveOptions[0], event: MouseEvent) {
    activeConstructiveOpt.value = opt
    constructivePopover.value.toggle(event)
}

function toggleBoxDesignInfo(opt: typeof boxDesignOptions[0], event: MouseEvent) {
    activeBoxDesignOpt.value = opt
    boxDesignPopover.value.toggle(event)
}

const exteriorSize = computed(() => {
    //forta, kombi, verso, stark
    const isMP = ['Forta', 'Kombi', 'Verso', 'Stark'].includes(doorCalcStore.doorModels?.find((m) => m.id === doorCalcStore.doorConfig.exterior.panelModel)?.name ?? '')
    let size: Record<string, number> = {
        width: 0,
        height: 0,
    };
    
    if (isMP) {
        size.width = doorCalcStore.doorConfig.doorWidth + 114
        size.height = doorCalcStore.doorConfig.doorHeight + 57
    } else {
        size.width = doorCalcStore.doorConfig.doorWidth + 134
        size.height = doorCalcStore.doorConfig.doorHeight + 67
    }
    
    return size
})
</script>

<template>
    <ConfiguratorCard :step="1" title="Конструктив">

        <!-- Constructive type -->
        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Вид конструктива</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                v-for="opt in constructiveOptions"
                :key="opt.value"
                type="button"
                @click="doorCalcStore.doorConfig.doorConstructive = opt.value"
                :class="[
                    'flex items-center gap-3 rounded-2xl p-3 border text-left transition-all duration-200 cursor-pointer',
                    doorCalcStore.doorConfig.doorConstructive === opt.value
                        ? 'border-sky-900/60 border-2 bg-sky-900/5'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <p class="font-serif font-semibold flex-1 text-sky-900">{{ opt.label }}</p>
                <button
                    type="button"
                    @click.stop="toggleConstructiveInfo(opt, $event)"
                    class="p-1 rounded-lg transition-colors cursor-pointer"
                    :class="doorCalcStore.doorConfig.doorConstructive === opt.value
                        ? 'text-sky-900/50 hover:text-sky-900'
                        : 'text-sky-900/30 hover:text-sky-900/60'"
                >
                    <InfoIcon class="size-4" />
                </button>
            </button>
        </div>

        <Popover ref="constructivePopover">
            <div v-if="activeConstructiveOpt" class="max-w-56 space-y-2">
                <img :src="activeConstructiveOpt.image" :alt="activeConstructiveOpt.label" class="w-full rounded-xl object-cover" />
                <p class="font-serif font-semibold text-sky-900">{{ activeConstructiveOpt.label }}</p>
                <p class="text-sm text-sky-900/60 leading-relaxed">{{ activeConstructiveOpt.description }}</p>
            </div>
        </Popover>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <!-- Box design -->
        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Вид короба</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                v-for="opt in boxDesignOptions"
                :key="opt.value"
                type="button"
                @click="doorCalcStore.doorConfig.doorBoxDesign = opt.value"
                :class="[
                    'flex items-center gap-3 rounded-2xl p-3 border text-left transition-all duration-200 cursor-pointer',
                    doorCalcStore.doorConfig.doorBoxDesign === opt.value
                        ? 'border-sky-900/60 border-2 bg-sky-900/5'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <p class="font-serif font-semibold flex-1 text-sky-900">{{ opt.label }}</p>
                <button
                    type="button"
                    @click.stop="toggleBoxDesignInfo(opt, $event)"
                    class="p-1 rounded-lg transition-colors cursor-pointer"
                    :class="doorCalcStore.doorConfig.doorBoxDesign === opt.value
                        ? 'text-sky-900/50 hover:text-sky-900'
                        : 'text-sky-900/30 hover:text-sky-900/60'"
                >
                    <InfoIcon class="size-4" />
                </button>
            </button>
        </div>

        <Popover ref="boxDesignPopover">
            <div v-if="activeBoxDesignOpt" class="max-w-56 space-y-2">
                <img :src="activeBoxDesignOpt.image" :alt="activeBoxDesignOpt.label" class="w-full rounded-xl object-cover" />
                <p class="font-serif font-semibold text-sky-900">{{ activeBoxDesignOpt.label }}</p>
                <p class="text-sm text-sky-900/60 leading-relaxed">{{ activeBoxDesignOpt.description }}</p>
            </div>
        </Popover>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <!-- Dimensions -->
        <p class="font-serif text-sm inline-block mb-0.5 text-sky-900/70">Размеры проёма</p>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Ширина</label>
                <Select
                    v-model="doorCalcStore.doorConfig.doorWidth"
                    :options="widthOptions"
                    optionLabel="label"
                    optionValue="value"
                    fluid
                />
            </div>
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Высота</label>
                <Select
                    v-model="doorCalcStore.doorConfig.doorHeight"
                    :options="heightOptions"
                    optionLabel="label"
                    optionValue="value"
                    fluid
                />
            </div>
        </div>
        <p class="mt-2 text-xs text-sky-900/50 font-serif">Наружный размер двери с наличником: <span class="font-semibold">{{ exteriorSize.width }}x{{ exteriorSize.height }} мм</span></p>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <!-- Door side -->
        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Сторона открывания</p>
        <div class="grid grid-cols-2 gap-3">
            <button
                v-for="opt in handleSideOptions"
                :key="opt.value"
                type="button"
                @click="doorCalcStore.doorConfig.doorHandleSide = opt.value"
                :class="[
                    'flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border transition-all duration-200 cursor-pointer font-serif font-semibold text-sky-900',
                    doorCalcStore.doorConfig.doorHandleSide === opt.value
                        ? 'border-sky-900/60 border-2 bg-sky-900/5'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <component :is="opt.icon" class="size-4 shrink-0" />
                {{ opt.label }}
            </button>
        </div>

    </ConfiguratorCard>
</template>
