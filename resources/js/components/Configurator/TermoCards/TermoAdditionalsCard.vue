<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { ToggleSwitch } from 'primevue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()
</script>

<template>
    <ConfiguratorCard :step="8" title="Доп. опции">
        <div class="space-y-3">
            <label class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/20 transition-colors duration-200 cursor-pointer">
                <div class="flex flex-col gap-0.5">
                    <span class="font-serif text-sm font-medium text-sky-900">Порог из нержавейки</span>
                </div>
                <ToggleSwitch v-model="store.doorConfig.hasStainlessSteelDoorsill" />
            </label>
            <label class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/20 transition-colors duration-200 cursor-pointer">
                <div class="flex flex-col gap-0.5">
                    <span class="font-serif text-sm font-medium text-sky-900">Термокабель по периметру короба</span>
                </div>
                <ToggleSwitch v-model="store.doorConfig.hasThermalCable" />
            </label>
        </div>
    </ConfiguratorCard>
</template>
