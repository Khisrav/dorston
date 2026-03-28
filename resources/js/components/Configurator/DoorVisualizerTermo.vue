<script setup lang="ts">
import { ref } from 'vue';
import { useTermoDoorVisual } from '@/composables/useTermoDoorVisual';
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc';

const visualStore = useTermoDoorVisual();
const doorCalcStore = useTermoDoorCalc();

const exteriorStageRef = ref<any>(null);
const interiorStageRef = ref<any>(null);

function exportStageImages(): { exteriorImage: string; interiorImage: string } | null {
    const exteriorStage = exteriorStageRef.value?.getNode();
    const interiorStage = interiorStageRef.value?.getNode();
    if (!exteriorStage || !interiorStage) return null;
    return {
        exteriorImage: exteriorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 0.5 }),
        interiorImage: interiorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 0.5 }),
    };
}

defineExpose({ exportStageImages });
</script>

<template>
    <div class="border border-sky-900/10 bg-gradient-to-b to-white from-sky-900/5 shadow-md shadow-sky-800/5 p-4 md:p-7 pr-2 md:pr-4 flex items-center justify-center relative overflow-hidden rounded-3xl">
        <div class="w-full h-full">
            <div class="flex justify-center items-start gap-4 md:gap-7">

                <!-- Exterior stage -->
                <div class="door-stage-fit min-w-0 flex-1">
                    <v-stage ref="exteriorStageRef" :config="{ width: visualStore.stageWidth, height: visualStore.stageHeight }">
                        <!-- Background -->
                        <v-layer>
                            <v-rect :config="visualStore.backgroundConfig" />
                        </v-layer>

                        <!-- Наличник (casing / trim) — behind door panel -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.casingImage }" />
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.doorsillImage }" />
                        </v-layer>

                        <!-- Полотно (door panel) -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.doorImage }" />
                        </v-layer>

                        <!-- Петли (hinges) -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.hingeImage }" />
                        </v-layer>

                        <!-- Furniture overlays -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.furnitureExteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.furnitureExteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.furnitureExteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.furnitureExteriorSecondaryLeverLockImage }" />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None'"
                                :config="{ ...visualStore.exteriorPeepholeImageConfig, image: visualStore.furnitureExteriorPeepholeImage }"
                            />
                            <v-image :config="{ ...visualStore.exteriorImageConfig, image: visualStore.furnitureExteriorHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

                <!-- Interior stage -->
                <div class="door-stage-fit min-w-0 flex-1">
                    <v-stage ref="interiorStageRef" :config="{ width: visualStore.stageWidth, height: visualStore.stageHeight }">
                        <!-- Door panel -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.interiorDoorImage }" />
                        </v-layer>

                        <!-- Casing / box (Короб) -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.interiorCasingImage }" />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.interiorDoorsillImage }" />
                        </v-layer>

                        <!-- Furniture overlays (mirrored) -->
                        <v-layer>
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureInteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureInteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureInteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureInteriorSecondaryLeverLockImage }" />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasPeephole && doorCalcStore.doorConfig.peepholePosition !== 'None'"
                                :config="{ ...visualStore.interiorPeepholeImageConfig, image: visualStore.furnitureInteriorPeepholeImage }"
                            />
                            <v-image
                                v-if="doorCalcStore.doorConfig.furniture.hasNightLatchTurner"
                                :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureNightLatchTurnerImage }"
                            />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureCylinderRodImage }" />
                            <v-image :config="{ ...visualStore.interiorImageConfig, image: visualStore.furnitureInteriorHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Konva draws at 960×2050; CSS scales it down to fit without losing resolution */
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
