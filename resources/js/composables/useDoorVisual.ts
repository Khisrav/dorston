import { defineStore } from "pinia";
import { ref, watch, nextTick, computed, Ref, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";
import { getImageUrl } from "@/lib/utils";
import { doorHandleSide } from "@/types/configurator";

// Helper to load multiple images
function useImages(paths: string[]) {
    return paths.map(path => {
        const url = computed(() => getImageUrl(path));
        const [image] = useImage(url);
        return image;
    });
}

// Store
export const useDoorVisual = defineStore('doorVisual', () => {
    const doorCalcStore = useDoorCalc();

    const stageWidth = ref<number>(0);
    const stageHeight = ref<number>(0);
    const casing_thickness = ref<number>(85);
    const additionalElementMaskedGroupRef = ref<any>(null);
    const doorDimensions = computed(() => {
        return {
            width: doorCalcStore.doorConfig.doorWidth,
            height: doorCalcStore.doorConfig.doorHeight,
        }
    });

    const setStageDimensions = (width: number, height: number) => {
        stageWidth.value = width;
        stageHeight.value = width * doorDimensions.value.height / doorDimensions.value.width;

        console.log('stage size set to', stageWidth.value, stageHeight.value);
    }

    // Load all images at once
    // exterior images
    const exteriorBgImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.casingTexture ?? -1)?.image ?? ''
    );
    const [exteriorBgImage] = useImage(computed(() => getImageUrl(exteriorBgImageUrl.value)));
    const exteriorMillingBackgroundImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.primaryTexture ?? -1)?.image ?? ''
    );
    const [exteriorMillingBackgroundImage] = useImage(computed(() => getImageUrl(exteriorMillingBackgroundImageUrl.value)));
    const exteriorMillingImageUrl = computed(() => doorCalcStore.getSelectedModel('exterior')?.milling_image ?? '');
    const [exteriorMillingImage] = useImage(computed(() => getImageUrl(exteriorMillingImageUrl.value)));
    const exteriorPrimaryImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.primaryTexture ?? -1)?.image ?? ''
    );
    const [exteriorPrimaryImage] = useImage(computed(() => getImageUrl(exteriorPrimaryImageUrl.value)));
    const exteriorSecondaryImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.secondaryTexture ?? -1)?.image ?? ''
    );
    const [exteriorSecondaryImage] = useImage(computed(() => getImageUrl(exteriorSecondaryImageUrl.value)));
    const additionalElementDecorImageUrl = computed(() => 
        doorCalcStore.getSelectedModel('exterior')?.additional_element_decor_image ?? ''
    );
    const [additionalElementDecorImage] = useImage(computed(() => getImageUrl(additionalElementDecorImageUrl.value)));
    const additionalElementMaskImageUrl = computed(() => 
        doorCalcStore.getSelectedModel('exterior')?.additional_element_mask_image ?? ''
    );
    const [additionalElementMaskImage] = useImage(computed(() => getImageUrl(additionalElementMaskImageUrl.value)));
    const additionalElementTextureImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.exterior.secondaryTexture ?? -1)?.image ?? ''
    );
    const [additionalElementTextureImage] = useImage(computed(() => getImageUrl(additionalElementTextureImageUrl.value)));
    // interior images
    const interiorBgImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.interior.casingTexture ?? -1)?.image ?? ''
    );
    const [interiorBgImage] = useImage(computed(() => getImageUrl(interiorBgImageUrl.value)));
    const interiorMillingBackgroundImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.interior.primaryTexture ?? -1)?.image ?? ''
    );
    const [interiorMillingBackgroundImage] = useImage(computed(() => getImageUrl(interiorMillingBackgroundImageUrl.value)));
    const interiorMillingImageUrl = computed(() => doorCalcStore.getSelectedModel('interior')?.milling_image ?? '');
    const [interiorMillingImage] = useImage(computed(() => getImageUrl(interiorMillingImageUrl.value)));
    const interiorPrimaryImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.interior.primaryTexture ?? -1)?.image ?? ''
    );
    const [interiorPrimaryImage] = useImage(computed(() => getImageUrl(interiorPrimaryImageUrl.value)));
    const interiorSecondaryImageUrl = computed(() => 
        doorCalcStore.getFilmColor(doorCalcStore.doorConfig.interior.secondaryTexture ?? -1)?.image ?? ''
    );
    const [interiorSecondaryImage] = useImage(computed(() => getImageUrl(interiorSecondaryImageUrl.value)));

    //furniture images
    const furniture = computed(() => 
        doorCalcStore.getFurnitureSet(doorCalcStore.doorConfig.furniture.furnitureSetId ?? -1) ?? null
    );
    const furnitureCylindricalLockImageUrl = computed(() => 
        furniture.value?.cylindrical_lock_cover_image ?? ''
    );
    const [furnitureCylindricalLockImage] = useImage(computed(() => getImageUrl(furnitureCylindricalLockImageUrl.value)));
    const furnitureLeverLockImageUrl = computed(() => 
        furniture.value?.lever_lock_cover_image ?? ''
    );
    const [furnitureLeverLockImage] = useImage(computed(() => getImageUrl(furnitureLeverLockImageUrl.value)));
    const furniturePeepholeImageUrl = computed(() => 
        furniture.value?.peephole_cover_image ?? ''
    );
    const [furniturePeepholeImage] = useImage(computed(() => getImageUrl(furniturePeepholeImageUrl.value)));
    const furnitureNightLatchTurnerImageUrl = computed(() => 
        furniture.value?.night_latch_turner_cover_image ?? ''
    );
    const [furnitureNightLatchTurnerImage] = useImage(computed(() => getImageUrl(furnitureNightLatchTurnerImageUrl.value)));
    const furnitureCylinderRodImageUrl = computed(() => 
        furniture.value?.cylinder_rod_cover_image ?? ''
    );
    const [furnitureCylinderRodImage] = useImage(computed(() => getImageUrl(furnitureCylinderRodImageUrl.value)));
    const furnitureHandleImageUrl = computed(() => 
        furniture.value?.handle_cover_image ?? ''
    );
    const [furnitureHandleImage] = useImage(computed(() => getImageUrl(furnitureHandleImageUrl.value)));

    console.log(furniture.value);

    //casing spacer images are constant (applied to exterior only)
    const [casingSideSpacerImage] = useImage('assets/casing-side-spacers.png');
    const [casingTopSpacerImage] = useImage('assets/casing-top-spacers.png');
    const [doorsillImage] = useImage('assets/porog.png');

    // combine all exterior+interior images
    const layersImages = computed(() => ({
        exterior: {
            background: exteriorBgImage.value, //may be applied to casing texture
            millingBackground: exteriorMillingBackgroundImage.value, //applies to door itself (where milling is)
            milling: exteriorMillingImage.value, //applies to door itself (where milling is)
            primary: exteriorPrimaryImage.value, //applies to door itself (where milling is)
            secondary: exteriorSecondaryImage.value, //applies to decorative element's textured surface (optional)
            sideSpacers: casingSideSpacerImage.value,
            topSpacers: casingTopSpacerImage.value,
            additionalElementDecor: additionalElementDecorImage.value,
            additionalElementMask: additionalElementMaskImage.value,
            additionalElementTexture: additionalElementTextureImage.value,
            doorsill: doorsillImage.value,
        },
        interior: {
            background: interiorBgImage.value, //may be applied to casing texture
            primary: interiorPrimaryImage.value, //applies to door itself (where milling is)
            secondary: interiorSecondaryImage.value, //applies to decorative element's textured surface (optional)
            millingBackground: interiorMillingBackgroundImage.value, //applies to door itself (where milling is)
            milling: interiorMillingImage.value, //applies to door itself (where milling is)
        },
        furniture: {
            cylindricalLock: furnitureCylindricalLockImage.value,
            leverLock: furnitureLeverLockImage.value,
            peephole: furniturePeepholeImage.value,
            nightLatchTurner: furnitureNightLatchTurnerImage.value,
            cylinderRod: furnitureCylinderRodImage.value,
            handle: furnitureHandleImage.value,
        },
    }));

    const furniturePositioningOnXAxis = (type: 'exterior' | 'interior', doorHandleSide: doorHandleSide) => {
        const offset = (94 - 63 / 2 + casing_thickness.value) / doorDimensions.value.width * stageWidth.value;
        return offset;
        // if (doorHandleSide === 'Left') {
        //     return type === 'exterior' ? offset : stageWidth.value - offset;
        // } else {
        //     return type === 'exterior' ? stageWidth.value - offset : offset;
        // }
    }
    
    const layersPositioning = computed(() => ({
        exterior: {
            //background is whole door's film color (texture). if door texture differs from casing texture, then background is casing texture.
            background: {
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
            },
            doorItself: {
                x: (casing_thickness.value / doorDimensions.value.width) * stageWidth.value + 1,
                y: (casing_thickness.value / doorDimensions.value.height) * stageHeight.value + 1,
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)) - 2,
                height: stageHeight.value - (stageHeight.value * (casing_thickness.value / doorDimensions.value.height)) - 2,
            },
            milling: {
                x: (casing_thickness.value / doorDimensions.value.width) * stageWidth.value,
                y: (casing_thickness.value / doorDimensions.value.height) * stageHeight.value,
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: stageHeight.value - (stageHeight.value * (casing_thickness.value / doorDimensions.value.height)),
                globalCompositeOperation: 'multiply',
            },
            sideSpacers: {
                x: (casing_thickness.value / doorDimensions.value.width * stageWidth.value),
                y: (casing_thickness.value / doorDimensions.value.height * stageHeight.value),
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: stageHeight.value - (stageHeight.value * (casing_thickness.value / doorDimensions.value.height)),
            },
            topSpacers: {
                x: (casing_thickness.value / doorDimensions.value.width * stageWidth.value),
                y: 0,
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: (casing_thickness.value / doorDimensions.value.height) * stageHeight.value + 6,
            },
            peephole: {
                x: (doorDimensions.value.width / 2 - 40 / 2) * (stageWidth.value / doorDimensions.value.width),
                y: stageHeight.value - (1500 / doorDimensions.value.height * stageHeight.value),
                width: 40 / doorDimensions.value.width * stageWidth.value,
                height: 40 / doorDimensions.value.height * stageHeight.value,
            },
            doorsill: {
                x: (casing_thickness.value / doorDimensions.value.width) * stageWidth.value + 1,
                y: stageHeight.value - (35 / doorDimensions.value.height * stageHeight.value),
                width: (stageWidth.value - 2 * (casing_thickness.value / doorDimensions.value.width) * stageWidth.value) - 3,
                height: 35 / doorDimensions.value.height * stageHeight.value,
            },
            cylindricalLock: {
                x: furniturePositioningOnXAxis('exterior', doorCalcStore.doorConfig.doorHandleSide),
                y: (doorDimensions.value.height - 1000 - 80 / 2 + 92) / doorDimensions.value.height * stageHeight.value,
                width: 63 / doorDimensions.value.width * stageWidth.value,
                height: 80 / doorDimensions.value.height * stageHeight.value,
            },
            leverLock: {
                x: furniturePositioningOnXAxis('exterior', doorCalcStore.doorConfig.doorHandleSide),
                y: (doorDimensions.value.height - 1302 - 80 / 2) / doorDimensions.value.height * stageHeight.value,
                width: 72 / doorDimensions.value.width * stageWidth.value,
                height: 82 / doorDimensions.value.height * stageHeight.value,
            },
            // nightLatchTurner: {
            //     x: furniturePositioningOnXAxis('exterior', doorCalcStore.doorConfig.doorHandleSide),
            //     y: stageHeight.value - (1500 / doorDimensions.value.height * stageHeight.value) - (120 / doorDimensions.value.height * stageHeight.value),
            //     width: 72 / doorDimensions.value.width * stageWidth.value,
            //     height: 82 / doorDimensions.value.height * stageHeight.value,
            // },
            // cylinderRod: {
            //     x: furniturePositioningOnXAxis('exterior', doorCalcStore.doorConfig.doorHandleSide),
            //     y: stageHeight.value - (1500 / doorDimensions.value.height * stageHeight.value) - (160 / doorDimensions.value.height * stageHeight.value),
            //     width: 72 / doorDimensions.value.width * stageWidth.value,
            //     height: 82 / doorDimensions.value.height * stageHeight.value,
            // },
            handle: {
                x: furniturePositioningOnXAxis('exterior', doorCalcStore.doorConfig.doorHandleSide),
                y: (doorDimensions.value.height - 1000 - 61 / 2) / doorDimensions.value.height * stageHeight.value,
                width: 160 / doorDimensions.value.width * stageWidth.value,
                height: 61 / doorDimensions.value.height * stageHeight.value,
            },
        },
        interior: {
            background: {
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
            },
            milling: {
                x: (casing_thickness.value / doorDimensions.value.width) * stageWidth.value,
                y: (casing_thickness.value / doorDimensions.value.height) * stageHeight.value,
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: stageHeight.value - (stageHeight.value * (casing_thickness.value / doorDimensions.value.height)),
            },
        },
    }));

    // Watcher for caching the masked group
    watch(
        () => [
            layersImages.value.exterior.additionalElementTexture,
            layersImages.value.exterior.additionalElementMask,
        ],
        async ([texture, mask]) => {
            if (texture && mask && additionalElementMaskedGroupRef.value) {
                await nextTick();
                await nextTick();

                const group = additionalElementMaskedGroupRef.value.getNode();
                if (group) {
                    group.cache();
                    group.getLayer()?.batchDraw();
                }
            }
        }
    );

    return {
        layersPositioning,
        layersImages,
        setStageDimensions,
        stageWidth,
        stageHeight,
        additionalElementMaskedGroupRef,
    }
});