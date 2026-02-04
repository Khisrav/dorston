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
        class="border-2 border-black/10 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 p-4 md:p-6 flex items-center justify-center relative overflow-hidden">
        <div ref="visualizerContainerRef" class="w-full h-full">
            <div class="z-10 flex justify-center items-center gap-4 md:gap-6">
                <!-- Exterior stage -->
                <div :class="{ '-scale-x-100': doorCalcStore.doorConfig.doorHandleSide === 'Right' }">
                    <v-stage
                        :config="{
                            width: doorVisualStore.stageWidth,
                            height: doorVisualStore.stageHeight,
                        }"
                    >
                        <!-- Наличник (фон) -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.background,
                                image: doorVisualStore.layersImages.exterior.background,
                            }" />
                        </v-layer>
                        <!-- Фрезеровка -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorItself,
                                image: doorVisualStore.layersImages.exterior.millingBackground,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorItself,
                                image: doorVisualStore.layersImages.exterior.milling,
                                globalCompositeOperation: 'multiply',
                                opacity: 0.5,
                            }" />
                        </v-layer>
                        <!-- Доп элемент -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorItself,
                                image: doorVisualStore.layersImages.exterior.additionalElementDecor,
                            }" />
                        </v-layer>
                        <v-layer>
                            <v-group :ref="doorVisualStore.additionalElementMaskedGroupRef" v-if="doorVisualStore.layersImages.exterior.additionalElementTexture && doorVisualStore.layersImages.exterior.additionalElementMask">
                                <v-image :config="{
                                    ...doorVisualStore.layersPositioning.exterior.doorItself,
                                    image: doorVisualStore.layersImages.exterior.additionalElementTexture,
                                }" />
                                
                                <v-image :config="{
                                    ...doorVisualStore.layersPositioning.exterior.doorItself,
                                    image: doorVisualStore.layersImages.exterior.additionalElementMask,
                                    globalCompositeOperation: 'destination-in',
                                }" />
                            </v-group>
                        </v-layer>
                        <!-- Зазоры между наличником и дверью -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorsill,
                                image: doorVisualStore.layersImages.exterior.doorsill,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.sideSpacers,
                                image: doorVisualStore.layersImages.exterior.sideSpacers,
                                // opacity: 0.75,
                                globalCompositeOperation: 'multiply',
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.topSpacers,
                                image: doorVisualStore.layersImages.exterior.topSpacers,
                                // opacity: 0.75,
                                globalCompositeOperation: 'multiply',
                            }" />
                        </v-layer>

                        <!-- Глазок, ручка, петли, ночник и т.д. -->
                        <v-layer>
                            <!-- <v-circle :config="{
                                ...doorVisualStore.layersPositioning.exterior.peephole,
                                fill: 'red',
                            }" /> -->
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.cylindricalLock,
                                image: doorVisualStore.layersImages.furniture.cylindricalLock,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.leverLock,
                                image: doorVisualStore.layersImages.furniture.leverLock,
                            }" />
                            <v-image v-if="doorCalcStore.doorConfig.furniture.hasPeephole" :config="{
                                ...doorVisualStore.layersPositioning.exterior.peephole,
                                image: doorVisualStore.layersImages.furniture.peephole,
                            }" />
                            <!-- <v-image v-if="doorCalcStore.doorConfig.furniture.hasNightLatchTurner" :config="{
                                ...doorVisualStore.layersPositioning.exterior.nightLatchTurner,
                                image: doorVisualStore.layersImages.furniture.nightLatchTurner,
                            }" />
                            <v-image v-if="doorCalcStore.doorConfig.furniture.hasCylinderRod" :config="{
                                ...doorVisualStore.layersPositioning.exterior.cylinderRod,
                                image: doorVisualStore.layersImages.furniture.cylinderRod,
                            }" /> -->
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.handle,
                                image: doorVisualStore.layersImages.furniture.handle,
                            }" />
                        </v-layer>
                    </v-stage>
                </div>
                
                <!-- Interior stage -->
                <div :class="{ '-scale-x-100': doorCalcStore.doorConfig.doorHandleSide === 'Left' }">
                    <v-stage :config="{
                        width: doorVisualStore.stageWidth,
                        height: doorVisualStore.stageHeight,
                    }">
                        <!-- Наличник (фон) -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.interior.background,
                                image: doorVisualStore.layersImages.interior.background,
                            }" />
                        </v-layer>
                        <!-- Фрезеровка -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorItself,
                                image: doorVisualStore.layersImages.interior.millingBackground,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.doorItself,
                                image: doorVisualStore.layersImages.interior.milling,
                                globalCompositeOperation: 'multiply',
                                opacity: 0.5,
                            }" />
                        </v-layer>
                        <!-- Зазоры между наличником и дверью -->
                        <v-layer>
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.interior.doorsill,
                                image: doorVisualStore.layersImages.exterior.doorsill,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.sideSpacers,
                                image: doorVisualStore.layersImages.exterior.sideSpacers,
                                // opacity: 0.75,
                                globalCompositeOperation: 'multiply',
                            }" />
                        </v-layer>
                        <!-- Глазок, ручка, петли, ночник и т.д. -->
                        <v-layer>
                            <!-- <v-circle :config="{
                                ...doorVisualStore.layersPositioning.exterior.peephole,
                                fill: 'red',
                            }" /> -->
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.cylindricalLock,
                                image: doorVisualStore.layersImages.furniture.cylindricalLock,
                            }" />
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.leverLock,
                                image: doorVisualStore.layersImages.furniture.leverLock,
                            }" />
                            <v-image v-if="doorCalcStore.doorConfig.furniture.hasPeephole" :config="{
                                ...doorVisualStore.layersPositioning.exterior.peephole,
                                image: doorVisualStore.layersImages.furniture.peephole,
                            }" />
                            <!-- <v-image v-if="doorCalcStore.doorConfig.furniture.hasNightLatchTurner" :config="{
                                ...doorVisualStore.layersPositioning.exterior.nightLatchTurner,
                                image: doorVisualStore.layersImages.furniture.nightLatchTurner,
                            }" />
                            <v-image v-if="doorCalcStore.doorConfig.furniture.hasCylinderRod" :config="{
                                ...doorVisualStore.layersPositioning.exterior.cylinderRod,
                                image: doorVisualStore.layersImages.furniture.cylinderRod,
                            }" /> -->
                            <v-image :config="{
                                ...doorVisualStore.layersPositioning.exterior.handle,
                                image: doorVisualStore.layersImages.furniture.handle,
                            }" />
                        </v-layer>
                    </v-stage>
                </div>
            </div>
        </div>
    </div>
</template>