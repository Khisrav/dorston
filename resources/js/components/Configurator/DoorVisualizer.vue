<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDoorVisual } from '@/composables/useDoorVisual';
import { DoorCombinationImage } from '@/types/configurator';
import { usePage } from '@inertiajs/vue3';
import { Button } from 'primevue';

const doorVisualStore = useDoorVisual();
const visualizerContainerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (visualizerContainerRef.value) {
        const width = visualizerContainerRef.value.clientWidth;
        const gap = window.innerWidth > 768 ? 32 : 16;
        doorVisualStore.setStageDimensions((width - gap) / 2, 0);
    }
});
</script>

<template>
    <div class="border border-sky-900/10 bg-gradient-to-b to-white from-sky-900/5 shadow-md shadow-sky-800/5 p-4 md:p-7 pr-2 md:pr-4 flex items-center justify-center relative overflow-hidden rounded-3xl">
        <div ref="visualizerContainerRef" class="w-full h-full">
            <div class="flex justify-center items-start gap-4 md:gap-7 pb-4">

                <!-- Exterior stage -->
                <div class="relative">
                    <v-stage :config="{ width: doorVisualStore.stageWidth, height: doorVisualStore.stageHeight }">
                        <!-- Layer 0: Black background -->
                        <v-layer>
                            <v-rect :config="{ ...doorVisualStore.layersConfig.exterior.background }" />
                        </v-layer>
                        <!-- Layer 1: Casing (Наличник) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.layersConfig.exterior.casing, image: doorVisualStore.casingImage }" />
                        </v-layer>
                        <!-- Layer 1.1: Additional casing element -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.fullStageRect, image: doorVisualStore.additionalCasingElementImage }" />
                        </v-layer>
                        <!-- Layer 2: Door itself (Полотно) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.fullStageRect, image: doorVisualStore.doorImage }" />
                        </v-layer>
                        <!-- Layer 3: Additional door element -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.fullStageRect, image: doorVisualStore.additionalDoorElementImage }" />
                        </v-layer>
                        <!-- Layer 4: Hinges -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.fullStageRect, image: doorVisualStore.hingeImage }" />
                        </v-layer>
                    </v-stage>
                    <div class="absolute -bottom-6 right-0 left-0 text-center">
                        <Button variant="outline" class="" size="small">Снаружи</Button>
                    </div>
                </div>

                <!-- Interior stage (placeholder for now) -->
                <div class="relative">
                    <v-stage :config="{ width: doorVisualStore.stageWidth, height: doorVisualStore.stageHeight }">
                        <!-- Layer 0: Black background -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.universalConfig, image: doorVisualStore.interiorDoorImage }" />
                        </v-layer>
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.universalConfig, image: doorVisualStore.interiorCasingImage }" />
                        </v-layer>
                    </v-stage>
                    <div class="absolute -bottom-6 right-0 left-0 text-center">
                        <Button variant="outline" class="" size="small">Изнутри</Button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
