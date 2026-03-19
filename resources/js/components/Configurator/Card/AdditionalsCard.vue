<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { ToggleSwitch } from 'primevue'
import ConfiguratorCard from './ConfiguratorCard.vue'

const doorCalcStore = useDoorCalc()
</script>

<template>
    <ConfiguratorCard :step="6" title="Доп. опции">
        <div class="space-y-3">
            <label class="flex items-center justify-between gap-4 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/20 transition-colors duration-200 cursor-pointer">
                <div class="flex flex-col gap-0.5">
                    <span class="font-serif text-sm font-medium text-sky-900">Порог из нержавейки</span>
                    <span class="font-serif text-xs text-sky-900/50">Накладной порог из шлифованной нержавеющей стали</span>
                </div>
                <ToggleSwitch v-model="doorCalcStore.doorConfig.stainlessSteelDoorsill" />
            </label>
        </div>
    </ConfiguratorCard>
</template>
