<script setup lang="ts">
import { ref } from 'vue';
import { useDoorCalc } from '@/composables/useDoorCalc';
import { useDoorVisual } from '@/composables/useDoorVisual';
import { useImage } from 'vue-konva';

const doorVisualStore = useDoorVisual();
const doorCalcStore = useDoorCalc();
const exteriorStageRef = ref<any>(null);
const interiorStageRef = ref<any>(null);

function exportStageImages(): { exteriorImage: string; interiorImage: string } | null {
    const exteriorStage = exteriorStageRef.value?.getNode();
    const interiorStage = interiorStageRef.value?.getNode();

    if (!exteriorStage || !interiorStage) return null;

    // Buffer is already 960×2050; pixelRatio 2 → 1920×4100 for PDF / sharp zoom
    const exteriorImage = exteriorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 0.5 });
    const interiorImage = interiorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 0.5 });

    return { exteriorImage, interiorImage };
}

defineExpose({ exportStageImages });

// const [furnitureShadow] = useImage('/storage/furniture/handle-covers/01KMDN6MZFGAZMHE0VGHB1ZJV6.png');
</script>

<template>
    <div class="border border-sky-900/10 bg-gradient-to-b to-white from-sky-900/5 shadow-md shadow-sky-800/5 p-4 md:p-7 pr-2 md:pr-4 flex items-center justify-center relative overflow-hidden rounded-3xl">
        <div class="w-full h-full">
            <div class="flex justify-center items-start gap-4 md:gap-7">

                <!-- Exterior stage — high-res buffer, CSS-scaled to fit -->
                <div class="door-stage-fit min-w-0 flex-1">
                    <v-stage ref="exteriorStageRef" :config="{ width: doorVisualStore.stageWidth, height: doorVisualStore.stageHeight }">
                        <!-- Black background -->
                        <v-layer>
                            <v-rect :config="doorVisualStore.backgroundConfig" />
                        </v-layer>
                        <!-- Hinges -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.exteriorHingeImage }" />
                        </v-layer>
                        <!-- Casing (Наличник) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.casingImage }" />
                        </v-layer>
                        <!-- Additional casing element (Вставка наличника) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.additionalCasingElementImage }" />
                        </v-layer>
                        <!-- Door panel (Полотно) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.doorImage }" />
                        </v-layer>
                        <!-- Additional door element (Вставка полотна) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.additionalDoorElementImage }" />
                        </v-layer>
                        <!-- Furniture overlays -->
                        <v-layer>
                            <!-- <v-image :config="{
                                ...doorVisualStore.exteriorImageConfig,
                                image: furnitureShadow,
                            }" /> -->
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorSecondaryLeverLockImage }" />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None'"
                                :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorPeepholeImage }"
                            />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

                <!-- Interior stage -->
                <div class="door-stage-fit min-w-0 flex-1">
                    <v-stage ref="interiorStageRef" :config="{ width: doorVisualStore.stageWidth, height: doorVisualStore.stageHeight }">
                        <!-- Door panel -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.interiorDoorImage }" />
                        </v-layer>
                        <!-- Casing / box (Короб) -->
                        <v-layer>
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.interiorCasingImage }" />
                        </v-layer>
                        <!-- Furniture overlays (mirrored) -->
                        <v-layer>
                            <!-- <v-image :config="{
                                ...doorVisualStore.interiorImageConfig,
                                image: furnitureShadow,
                            }" /> -->
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorSecondaryLeverLockImage }" />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None'"
                                :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorPeepholeImage }"
                            />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasNightLatchTurner"
                                :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureNightLatchTurnerImage }"
                            />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureCylinderRodImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Konva draws at 960×2050; shrink for layout without losing backing-store resolution */
.door-stage-fit :deep(.konvajs-content) {
    width: 100% !important;
    height: auto !important;
}

.door-stage-fit :deep(canvas) {
    width: 100% !important;
    height: auto !important;
    display: block;
}

.door-stage-fit {
    aspect-ratio: 960 / 2050;
}
</style>
