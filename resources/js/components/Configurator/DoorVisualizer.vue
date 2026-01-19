<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDoorVisual } from '@/composables/useDoorVisual';
import { useDoorCalc } from '@/composables/useDoorCalc';
import { useImage } from 'vue-konva';
import { getImageUrl } from '@/lib/utils';

const doorCalcStore = useDoorCalc()
const doorVisualStore = useDoorVisual();
const visualizerContainerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (visualizerContainerRef.value) {
        const width = visualizerContainerRef.value.clientWidth;
        const height = visualizerContainerRef.value.clientHeight;

        let gap = 16;
        if (window.innerWidth > 768) {
            gap = 32;
        }

        doorVisualStore.setStageDimensions((width - gap) / 2, height);
    }
});
</script>

<template>
    <div
        class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-6 flex items-center justify-center relative overflow-hidden min-h-[400px]">
        <div ref="visualizerContainerRef" class="w-full h-full">
            <div class="z-10 flex justify-center items-center gap-6">
                <v-stage :config="{
                    width: doorVisualStore.stageWidth,
                    height: doorVisualStore.stageHeight,
                }">
                    <v-layer>
                        <v-image :config="{
                            ...doorVisualStore.layersPositioning.exterior.background,
                            image: doorVisualStore.layersImages.exterior.background,
                        }" />
                    </v-layer>
                </v-stage>

                <v-stage :config="{
                    width: doorVisualStore.stageWidth,
                    height: doorVisualStore.stageHeight,
                }">
                    <v-layer>
                        <v-rect :x="0" :y="0" :width="doorVisualStore.layersPositioning.interior.background.width"
                            :height="doorVisualStore.layersPositioning.interior.background.height" fill="blue" />
                        <v-rect :x="doorVisualStore.layersPositioning.interior.milling.x"
                            :y="doorVisualStore.layersPositioning.interior.milling.y"
                            :width="doorVisualStore.layersPositioning.interior.milling.width"
                            :height="doorVisualStore.layersPositioning.interior.milling.height" fill="yellow" />
                    </v-layer>
                </v-stage>
            </div>
        </div>
    </div>
</template>