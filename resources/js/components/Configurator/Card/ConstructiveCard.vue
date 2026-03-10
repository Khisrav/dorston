<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { type doorConstructive } from '@/types/configurator'
import ConfiguratorCard from './ConfiguratorCard.vue'
import { CheckIcon } from 'lucide-vue-next'

const doorCalcStore = useDoorCalc()

const options: { value: doorConstructive; label: string; image: string | null }[] = [
    {
        value: 'Comfort',
        label: 'Comfort',
        image: '/assets/ui/comfort-constructive.jpg',
    },
    {
        value: 'Absolut',
        label: 'Absolut',
        image: '/assets/ui/absolut-constructive.jpg',
    },
]
</script>

<template>
    <ConfiguratorCard :step="1" title="Конструктив">
        <label for="constructive" class="font-serif text-sm inline-block mb-3">Вид конструктива</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                v-for="opt in options"
                :key="opt.value"
                @click="doorCalcStore.doorConfig.doorConstructive = opt.value"
                :class="[
                    'relative rounded-2xl p-3 border-2 overflow-hidden text-left transition-all duration-200 hover:cursor-pointer',
                    doorCalcStore.doorConfig.doorConstructive === opt.value
                        ? 'border-sky-950 bg-sky-900 text-white'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                        <img v-if="opt.image" :src="opt.image" :alt="opt.label" class="w-full rounded-sm" />
                    </div>
                    <div class="col-span-8 pt-1">
                        <div>
                            <span class="font-serif text-sm">Конструктив</span>
                            <p class="font-serif font-semibold">{{ opt.label }}</p>
                        </div>
                    </div>
                </div>
                <div
                    v-if="doorCalcStore.doorConfig.doorConstructive === opt.value"
                    class="absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    :class="[
                        doorCalcStore.doorConfig.doorConstructive === opt.value
                            ? 'bg-white text-sky-900'
                            : 'bg-sky-900 text-white'
                    ]"
                >
                    <CheckIcon class="size-3" />
                </div>
            </button>
        </div>
    </ConfiguratorCard>
</template>
