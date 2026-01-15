<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc';

const doorCalcStore = useDoorCalc();
</script>

<template>
    <div class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
        <div ref="containerRef"
            class="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
            <div class="z-10 flex justify-center items-center">
                <!-- <img :src="getDoorModelImage(doorModels.find((model: DoorModel) => model.id === doorCalcStore.doorConfig.exterior.panelModel)?.image ?? '')" class="w-32 max-h-[60vh] object-contain drop-shadow-2xl" alt=""> -->
            </div>
        </div>
    </div>
</template>