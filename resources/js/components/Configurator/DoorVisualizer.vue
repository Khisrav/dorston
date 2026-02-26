<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDoorVisual } from '@/composables/useDoorVisual';

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
    <div
        class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-4 md:p-6 flex items-center justify-center relative overflow-hidden"
    >
        <div ref="visualizerContainerRef" class="w-full h-full">
            <div class="flex justify-center items-start gap-4">

                <!-- Exterior stage -->
                <div>
                    <p class="text-xs text-center text-neutral-400 mb-1">Снаружи</p>
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
                    </v-stage>
                </div>

                <!-- Interior stage (placeholder for now) -->
                <div>
                    <p class="text-xs text-center text-neutral-400 mb-1">Изнутри</p>
                    <v-stage :config="{ width: doorVisualStore.stageWidth, height: doorVisualStore.stageHeight }">
                        <!-- Layer 0: Black background -->
                        <v-layer>
                            <v-rect :config="{ ...doorVisualStore.layersConfig.interior.background }" />
                        </v-layer>
                    </v-stage>
                </div>

            </div>
        </div>
    </div>
</template>
