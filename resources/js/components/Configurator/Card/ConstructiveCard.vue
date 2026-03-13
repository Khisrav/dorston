<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { type doorConstructive, type doorBoxDesign } from '@/types/configurator'
import ConfiguratorCard from './ConfiguratorCard.vue'
import { InfoIcon } from 'lucide-vue-next'

const doorCalcStore = useDoorCalc()

const constructiveOptions: { value: doorConstructive; label: string; image: string | null }[] = [
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

const boxDesignOptions: { value: doorBoxDesign; label: string; image: string | null }[] = [
    {
        value: 'Closed',
        label: 'Закрытый',
        image: '/assets/ui/box-design-closed.jpg',
    },
    {
        value: 'Opened',
        label: 'Открытый',
        image: '/assets/ui/box-design-opened.jpg',
    },
]
</script>

<template>
    <ConfiguratorCard :step="1" title="Конструктив">
        <label for="constructive" class="font-serif text-sm inline-block mb-3">Вид конструктива</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                v-for="opt in constructiveOptions"
                :key="opt.value"
                @click="doorCalcStore.doorConfig.doorConstructive = opt.value"
                :class="[
                    'relative rounded-2xl p-3 border overflow-hidden text-left transition-all duration-200 hover:cursor-pointer',
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
                        <div class="flex items-center justify-between gap-2 h-full">
                            <p class="font-serif font-semibold">{{ opt.label }}</p>
                            <InfoIcon class="size-5" :class="[
                                doorCalcStore.doorConfig.doorConstructive === opt.value
                                    ? 'text-neutral-300'
                                    : 'text-neutral-400'
                            ]" />
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center">
                </div>
            </button>
        </div>

        <label for="box-design" class="font-serif text-sm inline-block mt-5 mb-3">Вид короба</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                v-for="opt in boxDesignOptions"
                :key="opt.value"
                @click="doorCalcStore.doorConfig.doorBoxDesign = opt.value"
                :class="[
                    'relative rounded-2xl p-3 border overflow-hidden text-left transition-all duration-200 hover:cursor-pointer',
                    doorCalcStore.doorConfig.doorBoxDesign === opt.value
                        ? 'border-sky-950 bg-sky-900 text-white'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-4">
                        <div v-if="!opt.image" class="w-full aspect-[3/2] rounded-sm bg-sky-900/5" />
                        <img v-else :src="opt.image" :alt="opt.label" class="w-full rounded-sm" />
                    </div>
                    <div class="col-span-8 pt-1">
                        <div class="flex items-center gap-2 h-full">
                            <p class="font-serif font-semibold">{{ opt.label }}</p>
                        </div>
                    </div>
                </div>
                <div class="absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center">
                    <InfoIcon class="size-6" :class="[
                        doorCalcStore.doorConfig.doorBoxDesign === opt.value
                            ? 'text-neutral-300'
                            : 'text-neutral-400'
                    ]" />
                </div>
            </button>
        </div>
    </ConfiguratorCard>
</template>
