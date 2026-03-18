<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { type doorHandleSide, type peepholePosition } from '@/types/configurator'
import { InputNumber } from 'primevue'
import { PanelLeftIcon, PanelRightIcon } from 'lucide-vue-next'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const handleSideOptions: { label: string; value: doorHandleSide; icon: typeof PanelLeftIcon }[] = [
    { label: 'Левая',  value: 'Left',  icon: PanelLeftIcon },
    { label: 'Правая', value: 'Right', icon: PanelRightIcon },
]

const peepholeOptions: { label: string; value: peepholePosition }[] = [
    { label: 'Нет',       value: 'None' },
    { label: 'С боку',    value: 'Side' },
    { label: 'По центру', value: 'Center' },
]
</script>

<template>
    <ConfiguratorCard :step="1" title="Параметры">

        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Размеры проёма</p>
        <div class="grid grid-cols-2 gap-3">
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Ширина</label>
                <InputNumber
                    v-model="store.doorConfig.width"
                    :min="800" :max="1200" :step="10"
                    showButtons buttonLayout="horizontal"
                    decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    fluid suffix=" мм"
                />
            </div>
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Высота</label>
                <InputNumber
                    v-model="store.doorConfig.height"
                    :min="1900" :max="2400" :step="10"
                    showButtons buttonLayout="horizontal"
                    decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                    incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                    fluid suffix=" мм"
                />
            </div>
        </div>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Сторона ручки</p>
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

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Глазок</p>
        <div class="grid grid-cols-3 gap-3">
            <button
                v-for="opt in peepholeOptions"
                :key="opt.value"
                type="button"
                @click="store.doorConfig.peepholePosition = opt.value"
                :class="[
                    'flex items-center justify-center rounded-2xl px-3 py-3 border transition-all duration-200 cursor-pointer font-serif font-semibold text-sky-900',
                    store.doorConfig.peepholePosition === opt.value
                        ? 'border-sky-900/60 border-2 bg-sky-900/5'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                {{ opt.label }}
            </button>
        </div>

    </ConfiguratorCard>
</template>
