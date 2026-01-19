<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc';
import { useDoorVisual, type LoadedImageConfig } from '@/composables/useDoorVisual';
import { getImageUrl } from '@/lib/utils';
import { DoorConfig } from '@/types/configurator';
import { watch } from 'vue';

const doorCalcStore = useDoorCalc();
const {
    store,
    stageKey,
    loadedLayers,
    layersLoadingStatus,
    setLayerRef,
} = useDoorVisual();

//set images from door config
// watch(doorCalcStore.doorConfig, (newVal: DoorConfig) => {
//     if (newVal.interior.primaryTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.interior.primaryTexture)?.image ?? null);
//     }
//     if (newVal.interior.secondaryTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.interior.secondaryTexture)?.image ?? null);
//     }
//     if (newVal.interior.casingTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.interior.casingTexture)?.image ?? null);
//     }
//     if (newVal.exterior.primaryTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.exterior.primaryTexture)?.image ?? null);
//     }
//     if (newVal.exterior.secondaryTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.exterior.secondaryTexture)?.image ?? null);
//     }
//     if (newVal.exterior.casingTexture !== -1) {
//         store.exteriorDoorLayers[0][0].image = getImageUrl(doorCalcStore.filmColors.find(color => color.id === newVal.exterior.casingTexture)?.image ?? null);
//     }
// });
</script>

<template>
    <div
        class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-4 flex items-center justify-center relative overflow-hidden min-h-[400px]">
        <div ref="containerRef">
            <div class="z-10 flex justify-center items-center">
                <!-- Debug info -->
                <div style="position: absolute; top: 10px; left: 10px; padding: 5px; font-size: 12px; z-index: 1000;">
                    <div>Size: {{ store.stageWidth }}x{{ store.stageHeight }}</div>
                    <div v-for="status in layersLoadingStatus" :key="status.layerIndex">
                        Layer {{ status.layerIndex }}: {{ status.loaded ? '✅' : '⏳' }}
                    </div>
                </div>

                <v-stage :key="stageKey" :config="{
                    width: store.stageWidth,
                    height: store.stageHeight,
                }">
                    <v-layer v-for="(layer, layerIndex) in loadedLayers" :key="layerIndex">
                        <!-- Если слой содержит composite operations (маски) - кэшируем группу -->
                        <v-group v-if="store.layersThatNeedCaching.some(l => l.index === layerIndex)"
                            :ref="(el: any) => setLayerRef(layerIndex, el)">
                            <template v-for="(img, imgIndex) in layer" :key="imgIndex">
                                <v-image v-if="img.loadedImage.value" :config="{
                                    x: img.x,
                                    y: img.y,
                                    image: img.loadedImage.value,
                                    width: img.width ?? store.stageWidth,
                                    height: img.height ?? store.stageHeight,
                                    opacity: img.opacity ?? 1,
                                    globalCompositeOperation: img.globalCompositeOperation,
                                }" />
                            </template>
                        </v-group>

                        <!-- Если слой без composite operations - рендерим напрямую -->
                        <template v-else>
                            <template v-for="(img, imgIndex) in layer" :key="imgIndex">
                                <v-image v-if="img.loadedImage.value" :config="{
                                    x: img.x,
                                    y: img.y,
                                    image: img.loadedImage.value,
                                    width: img.width ?? store.stageWidth,
                                    height: img.height ?? store.stageHeight,
                                    opacity: img.opacity ?? 1,
                                }" />
                            </template>
                        </template>
                    </v-layer>
                </v-stage>
            </div>
        </div>
    </div>
</template>