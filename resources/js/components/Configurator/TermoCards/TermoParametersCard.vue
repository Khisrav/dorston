<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { type doorHandleSide } from '@/types/configurator'
import { Select, Popover } from 'primevue'
import { PanelLeftIcon, PanelRightIcon, InfoIcon } from 'lucide-vue-next'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'
import { computed, ref } from 'vue'

function generateRange(min: number, max: number, step: number): { label: string; value: number }[] {
    const result: { label: string; value: number }[] = []
    for (let i = min; i <= max; i += step) result.push({ label: `${i} мм`, value: i })
    return result
}

const widthOptions  = generateRange(800, 1030, 10)
const heightOptions = generateRange(1800, 2300, 10)

const store = useTermoDoorCalc()

const handleSideOptions: { label: string; value: doorHandleSide; icon: typeof PanelLeftIcon }[] = [
    { label: 'Левая',  value: 'Left',  icon: PanelLeftIcon },
    { label: 'Правая', value: 'Right', icon: PanelRightIcon },
]

const exteriorSize = computed(() => {
    //forta, kombi, verso, stark
    const isMP = ['Forta', 'Kombi', 'Verso', 'Stark'].includes(store.doorModels?.find((m) => m.id === store.doorConfig.exterior.panelModel)?.name ?? '')
    let size: Record<string, number> = {
        width: 0,
        height: 0,
    };
    
    if (isMP) {
        size.width = store.doorConfig.width + 114
        size.height = store.doorConfig.height + 57
    } else {
        size.width = store.doorConfig.width + 134
        size.height = store.doorConfig.height + 67
    }
    
    return size
})

const constructiveOptions: { label: string; value: 'Termo+' | 'Termo Premium'; image: string; description: string }[] = [
    {
        label: 'Termo+',
        value: 'Termo+',
        image: '/assets/ui/termo-plus-constructive.jpg',
        description: 'Короб: 1,5 мм (закрытый). Уплотнитель на полотне: 2 шт. (Шлегель). Уплотнитель на коробе: D-образный. Заполнитель двери: Минеральная вата 11кг/м3 + пенополистирол',
    },
    {
        label: 'Termo Premium',
        value: 'Termo Premium',
        image: '/assets/ui/termo-premium-constructive.jpg',
        description: 'Короб: 1,6 мм (закрытый). Уплотнитель на полотне: 2 шт. (Шлегель). Уплотнитель на коробе: D-образный. Заполнитель двери: Минеральная вата 11кг/м3 + пенополистирол',
    },
]

const constructivePopover = ref<InstanceType<typeof Popover> | null>(null)
const activeConstructiveOpt = ref<typeof constructiveOptions[0] | null>(null)

function toggleConstructiveInfo(opt: typeof constructiveOptions[0], event: MouseEvent) {
    activeConstructiveOpt.value = opt
    constructivePopover.value?.toggle(event)
}
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
                :disabled="opt.value === 'Termo Premium'"
                @click="opt.value !== 'Termo Premium' && (store.doorConfig.constructive = opt.value)"
                :class="[
                    'flex items-center gap-3 rounded-2xl p-3 border text-left transition-all duration-200',
                    opt.value === 'Termo Premium'
                        ? 'cursor-not-allowed opacity-40 border-sky-900/5 select-none'
                        : 'cursor-pointer',
                    store.doorConfig.constructive === opt.value
                        ? 'border-sky-900/60 border-2 bg-sky-900/5'
                        : opt.value !== 'Termo Premium' ? 'border-sky-900/10 hover:border-sky-900/30' : 'border-sky-900/5'
                ]"
            >
                <div class="flex-1">
                    <p class="font-serif font-semibold text-sky-900">{{ opt.label }}</p>
                    <p v-if="opt.value === 'Termo Premium'" class="font-serif text-xs text-sky-900/40 mt-0.5">Скоро</p>
                </div>
                <button
                    v-if="opt.value !== 'Termo Premium'"
                    type="button"
                    @click.stop="toggleConstructiveInfo(opt, $event)"
                    class="p-1 rounded-lg transition-colors cursor-pointer"
                    :class="store.doorConfig.constructive === opt.value
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

        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Размеры проёма</p>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Ширина</label>
                <Select
                    v-model="store.doorConfig.width"
                    :options="widthOptions"
                    optionLabel="label"
                    optionValue="value"
                    fluid
                />
            </div>
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Высота</label>
                <Select
                    v-model="store.doorConfig.height"
                    :options="heightOptions"
                    optionLabel="label"
                    optionValue="value"
                    fluid
                />
            </div>
        </div>
        <p class="mt-2 text-xs text-sky-900/50 font-serif">Наружный размер двери с наличником: <span class="font-semibold">{{ exteriorSize.width }}x{{ exteriorSize.height }} мм</span></p>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Сторона открывания</p>
        <div class="grid grid-cols-2 gap-3">
            <button
                v-for="opt in handleSideOptions"
                :key="opt.value"
                type="button"
                @click="store.doorConfig.handleSide = opt.value"
                :class="[
                    'flex items-center justify-center gap-2 rounded-2xl px-4 py-3 border transition-all duration-200 cursor-pointer font-serif font-semibold text-sky-900',
                    store.doorConfig.handleSide === opt.value
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
