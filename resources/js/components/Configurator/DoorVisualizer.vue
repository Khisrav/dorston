<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDoorVisual } from '@/composables/useDoorVisual';
import { useImage } from 'vue-konva';

const doorVisualStore = useDoorVisual();
const visualizerContainerRef = ref<HTMLDivElement | null>(null);
const exteriorStageRef = ref<any>(null);
const interiorStageRef = ref<any>(null);

onMounted(() => {
    if (visualizerContainerRef.value) {
        const width = visualizerContainerRef.value.clientWidth;
        const gap = window.innerWidth > 768 ? 32 : 16;
        doorVisualStore.setStageDimensions((width - gap) / 2, 0);
    }
});

function exportStageImages(): { exteriorImage: string; interiorImage: string } | null {
    const exteriorStage = exteriorStageRef.value?.getNode();
    const interiorStage = interiorStageRef.value?.getNode();

    if (!exteriorStage || !interiorStage) return null;

    // PNG preserves transparency; pixelRatio:1 keeps file size reasonable
    const exteriorImage = exteriorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 1.5 });
    const interiorImage = interiorStage.toDataURL({ mimeType: 'image/png', pixelRatio: 1.5 });

    return { exteriorImage, interiorImage };
}

defineExpose({ exportStageImages });

const [furnitureShadow] = useImage('/storage/furniture/handle-covers/01KMDN6MZFGAZMHE0VGHB1ZJV6.png');
</script>

<template>
    <div class="border border-sky-900/10 bg-gradient-to-b to-white from-sky-900/5 shadow-md shadow-sky-800/5 p-4 md:p-7 pr-2 md:pr-4 flex items-center justify-center relative overflow-hidden rounded-3xl">
        <div ref="visualizerContainerRef" class="w-full h-full">
            <div class="flex justify-center items-start gap-4 md:gap-7">

                <!-- Exterior stage -->
                <div>
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
                            <v-image :config="{
                                ...doorVisualStore.exteriorImageConfig,
                                image: furnitureShadow,
                            }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureExteriorSecondaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furniturePeepholeImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureNightLatchTurnerImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureCylinderRodImage }" />
                            <v-image :config="{ ...doorVisualStore.exteriorImageConfig, image: doorVisualStore.furnitureHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

                <!-- Interior stage -->
                <div>
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
                            <v-image :config="{
                                ...doorVisualStore.interiorImageConfig,
                                image: furnitureShadow,
                            }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorPrimaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorPrimaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorSecondaryCylindricalLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureInteriorSecondaryLeverLockImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furniturePeepholeImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureNightLatchTurnerImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureCylinderRodImage }" />
                            <v-image :config="{ ...doorVisualStore.interiorImageConfig, image: doorVisualStore.furnitureHandleImage }" />
                        </v-layer>
                    </v-stage>
                </div>

            </div>
        </div>
    </div>
</template>
