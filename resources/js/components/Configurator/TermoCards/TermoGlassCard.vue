<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { Drawer } from 'primevue'
import { ref } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'

const store = useTermoDoorCalc()

const showExteriorDrawer = ref(false)
const showInteriorDrawer = ref(false)
</script>

<template>
    <ConfiguratorCard :step="5" title="Выбор тонировки">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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

    <!-- DRAWER: Glass exterior (tinted glass options — coming soon) -->
    <Drawer v-model:visible="showExteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Тонировка стекла: Снаружи</h2>
        </template>
        <div class="flex flex-col items-center justify-center py-16 text-center">
            <i class="pi pi-clock text-4xl text-neutral-300 mb-3" />
            <p class="font-serif font-semibold text-black/40">Скоро</p>
            <p class="font-serif text-sm text-black/30 mt-1">Варианты тонировки появятся в ближайшее время</p>
        </div>
    </Drawer>

    <!-- DRAWER: Glass interior (tinted glass options — coming soon) -->
    <Drawer v-model:visible="showInteriorDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
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
