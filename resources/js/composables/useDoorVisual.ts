import { defineStore } from "pinia";
import { ref, watch, nextTick, computed, Ref, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";
import { getImageUrl } from "@/lib/utils";

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

    //casing spacer images are constant (applied to exterior only)
    const [casingSideSpacerImage] = useImage('assets/casing-side-spacers.png');
    const [casingTopSpacerImage] = useImage('assets/casing-top-spacers.png');

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
        },
        interior: {
            background: interiorBgImage.value, //may be applied to casing texture
            primary: interiorPrimaryImage.value, //applies to door itself (where milling is)
            secondary: interiorSecondaryImage.value, //applies to decorative element's textured surface (optional)
            millingBackground: interiorMillingBackgroundImage.value, //applies to door itself (where milling is)
            milling: interiorMillingImage.value, //applies to door itself (where milling is)
        }
    }));
    
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
                x: Math.floor(casing_thickness.value / doorDimensions.value.width * stageWidth.value),
                y: Math.floor(casing_thickness.value / doorDimensions.value.height * stageHeight.value),
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: stageHeight.value - (stageHeight.value * (casing_thickness.value / doorDimensions.value.height)),
            },
            topSpacers: {
                x: Math.floor(casing_thickness.value / doorDimensions.value.width * stageWidth.value),
                y: 0,
                width: stageWidth.value - (stageWidth.value * ((casing_thickness.value * 2) / doorDimensions.value.width)),
                height: (casing_thickness.value / doorDimensions.value.height) * stageHeight.value + 6,
            },
            peephole: {
                x: (doorDimensions.value.width / 2) * (stageWidth.value / doorDimensions.value.width),
                y: stageHeight.value - (1400 / doorDimensions.value.height * stageHeight.value),
                width: 40 / doorDimensions.value.width * stageWidth.value,
                height: 40 / doorDimensions.value.height * stageHeight.value,
            }
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