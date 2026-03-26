<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { Drawer } from 'primevue'
import { ref, computed } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showExteriorDrawer = ref(false)
const showInteriorDrawer = ref(false)

const isTermoPlus = computed(() => store.doorConfig.constructive === 'Termo+')
</script>

<template>
    <ConfiguratorCard :step="5" title="Выбор тонировки">

        <!-- Termo+: glass tinting is not applicable -->
        <div v-if="isTermoPlus" class="flex items-center gap-3 p-3 rounded-2xl border border-sky-900/5 bg-sky-900/[0.02]">
            <div class="w-10 h-10 rounded-xl bg-sky-900/5 flex items-center justify-center shrink-0">
                <i class="pi pi-ban text-sky-900/25 text-base" />
            </div>
            <div class="min-w-0">
                <p class="font-serif font-medium text-sky-900/50 text-sm">Тонировка недоступна для Termo+</p>
                <p class="font-serif text-xs text-sky-900/30 mt-0.5 leading-snug">
                    Тонировка стекла доступна только для конструктива Termo Premium
                </p>
            </div>
        </div>

        <!-- Termo Premium: tinting options -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
                type="button"
                @click="showExteriorDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                    <i class="pi pi-sun text-neutral-300 text-lg" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Снаружи</p>
                    <p class="font-serif font-medium text-sky-900 truncate">Без тонировки</p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>

            <button
                type="button"
                @click="showInteriorDrawer = true"
                class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
            >
                <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                    <i class="pi pi-home text-neutral-300 text-lg" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif text-sm text-sky-900/40 tracking-wider">Внутри</p>
                    <p class="font-serif font-medium text-sky-900 truncate">Без тонировки</p>
                </div>
                <i class="pi pi-chevron-right text-sky-900/30" />
            </button>
        </div>

    </ConfiguratorCard>

    <!-- DRAWER: Glass exterior -->
    <Drawer v-model:visible="showExteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[720px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Тонировка стекла: Снаружи</h2>
        </template>
        <div class="flex flex-col items-center justify-center py-16 text-center">
            <i class="pi pi-clock text-4xl text-neutral-300 mb-3" />
            <p class="font-serif font-semibold text-black/40">Скоро</p>
            <p class="font-serif text-sm text-black/30 mt-1">Варианты тонировки появятся в ближайшее время</p>
        </div>
    </Drawer>

    <!-- DRAWER: Glass interior -->
    <Drawer v-model:visible="showInteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[720px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Тонировка стекла: Внутри</h2>
        </template>
        <div class="flex flex-col items-center justify-center py-16 text-center">
            <i class="pi pi-clock text-4xl text-neutral-300 mb-3" />
            <p class="font-serif font-semibold text-black/40">Скоро</p>
            <p class="font-serif text-sm text-black/30 mt-1">Варианты тонировки появятся в ближайшее время</p>
        </div>
    </Drawer>
</template>
