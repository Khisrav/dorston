import { defineStore } from "pinia";
import { ref, watch, nextTick, computed, Ref, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';
import { useDoorCalc } from "./useDoorCalc";

// Types
export interface ImageConfig {
    type: string;
    image: string;
    x: number | ((stageWidth: number, stageHeight: number) => number);
    y: number | ((stageWidth: number, stageHeight: number) => number);
    width?: number | ((stageWidth: number, stageHeight: number) => number);
    height?: number | ((stageWidth: number, stageHeight: number) => number);
    opacity?: number;
    globalCompositeOperation?: string;
}

export interface ResolvedImageConfig {
    type: string;
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity?: number;
    globalCompositeOperation?: string;
}

export interface LoadedImageConfig extends ResolvedImageConfig {
    loadedImage: Ref<HTMLImageElement | null>;
}

export interface LayerCacheInfo {
    index: number;
    needsCache: boolean;
}

export interface LayerLoadingStatus {
    layerIndex: number;
    loaded: boolean;
}

// Store
export const useDoorVisualStore = defineStore('doorVisual', () => {
    const doorCalc = useDoorCalc();
    
    // Оригинальные размеры двери
    const ORIGINAL_WIDTH = computed(() => doorCalc.doorConfig.doorWidth as number);
    const ORIGINAL_HEIGHT = computed(() => doorCalc.doorConfig.doorHeight as number);
    const ASPECT_RATIO = computed(() => ORIGINAL_HEIGHT.value / ORIGINAL_WIDTH.value);    
    let casing_thickness = 85;
    // Максимальная ширина для визуализации
    const maxWidth = ref<number>(240);
    
    // Адаптивная ширина (ограничена контейнером)
    const containerWidth = ref<number>(800); // будет обновляться из компонента
    const adaptiveMaxWidth = computed(() => Math.min(maxWidth.value, containerWidth.value - 40)); // -40 для padding

    // Computed размеры stage
    const stageWidth = computed(() => adaptiveMaxWidth.value);
    const stageHeight = computed(() => Math.round(adaptiveMaxWidth.value * ASPECT_RATIO.value));
    
    // Коэффициенты масштабирования
    const scaleX = computed(() => stageWidth.value / ORIGINAL_WIDTH.value);
    const scaleY = computed(() => stageHeight.value / ORIGINAL_HEIGHT.value);

    // Helper для разрешения динамических значений
    function resolveValue(value: number | ((w: number, h: number) => number)): number {
        return typeof value === 'function' 
            ? value(stageWidth.value, stageHeight.value) 
            : value;
    }

    // Слои двери - каждый слой это массив изображений
    const exteriorDoorLayers = ref<ImageConfig[][]>([
        // Слой 0: Фон
        [
            {
                type: 'background',
                image: '/assets/panels/Шпат грей.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            }
        ],
        // Слой 1: Фрезеровка (с отступами от краев)
        [
            {
                type: 'milling',
                image: '/assets/test/millings/milling1.png',
                x: casing_thickness * (stageWidth.value / ORIGINAL_WIDTH.value),
                y: casing_thickness * (stageHeight.value / ORIGINAL_HEIGHT.value),
                width: (ORIGINAL_WIDTH.value - casing_thickness * 2) * (stageWidth.value / ORIGINAL_WIDTH.value),
                height: (ORIGINAL_HEIGHT.value - casing_thickness) * (stageHeight.value / ORIGINAL_HEIGHT.value),
                opacity: 1,
                globalCompositeOperation: 'multiply',
            }
        ],
        // Слой 2: Декоративный элемент (текстура + маска)
        [
            {
                type: 'decor-texture',
                image: '/assets/panels/океанская зелень.webp',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            },
            {
                type: 'decor-mask',
                image: '/assets/test/decorative-elements/el1/texture.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
                globalCompositeOperation: 'destination-in',
            },
            {
                type: 'decor-detail',
                image: '/assets/test/decorative-elements/el1/decor.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
                // globalCompositeOperation: 'multiply',
            }
        ],
        // Слой 3: Силуэт наличника
        [
            {
                type: 'case-silhouette',
                // image: '/assets/test/case-silhouette.png',
                image: '/assets/casings/наличник мдф.webp',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            }
        ]
    ]);

    // Resolved layers (с вычисленными значениями)
    const resolvedLayers = computed<ResolvedImageConfig[][]>(() => {
        return exteriorDoorLayers.value.map(layer => {
            return layer.map(img => ({
                type: img.type,
                image: img.image,
                x: resolveValue(img.x),
                y: resolveValue(img.y),
                width: img.width ? resolveValue(img.width) : stageWidth.value,
                height: img.height ? resolveValue(img.height) : stageHeight.value,
                opacity: img.opacity,
                globalCompositeOperation: img.globalCompositeOperation,
            }));
        });
    });

    // Определяем какие слои нужно кэшировать
    const layersThatNeedCaching = computed<LayerCacheInfo[]>(() => {
        return resolvedLayers.value.map((layer, index) => {
            const hasCompositeOps = layer.some(img => img.globalCompositeOperation);
            return { index, needsCache: hasCompositeOps };
        }).filter(l => l.needsCache);
    });

    // Actions
    function setDoorLayers(layers: ImageConfig[][]) {
        exteriorDoorLayers.value = layers;
    }

    function updateLayer(layerIndex: number, images: ImageConfig[]) {
        exteriorDoorLayers.value[layerIndex] = images;
    }

    function setMaxWidth(width: number) {
        maxWidth.value = width;
    }

    function setContainerWidth(width: number) {
        containerWidth.value = width;
    }

    function setCasingThickness(thickness: number) {
        casing_thickness = thickness;
    }

    return {
        // State
        exteriorDoorLayers,
        maxWidth,
        containerWidth,
        
        // Computed
        stageWidth,
        stageHeight,
        resolvedLayers,
        layersThatNeedCaching,
        ASPECT_RATIO,
        scaleX,
        scaleY,
        casing_thickness,
        setCasingThickness,
        ORIGINAL_WIDTH,
        ORIGINAL_HEIGHT,

        // Actions
        setDoorLayers,
        updateLayer,
        setMaxWidth,
        setContainerWidth,
    };
});

// Composable
export function useDoorVisual() {
    const store = useDoorVisualStore();
    const stageKey = ref<number>(0);
    const layerRefs = ref<any[]>([]);

    // Загружаем все изображения из всех слоев
    const loadedLayers: ComputedRef<LoadedImageConfig[][]> = computed(() => {
        return store.resolvedLayers.map(layer => {
            return layer.map(imageConfig => {
                const [loadedImage] = useImage(imageConfig.image);
                return {
                    ...imageConfig,
                    loadedImage,
                };
            });
        });
    });

    // Проверяем загрузку каждого слоя
    const layersLoadingStatus: ComputedRef<LayerLoadingStatus[]> = computed(() => {
        return loadedLayers.value.map((layer, idx) => {
            const allLoaded = layer.every(img => img.loadedImage.value);
            return { layerIndex: idx, loaded: allLoaded };
        });
    });

    // Кэшируем слои которым это нужно
    watch(
        () => loadedLayers.value,
        async () => {
            await nextTick();
            await nextTick();

            store.layersThatNeedCaching.forEach(({ index }) => {
                const layerRef = layerRefs.value[index];
                if (layerRef) {
                    const group = layerRef.getNode();
                    if (group) {
                        group.clearCache();
                        group.cache();
                        group.getLayer()?.batchDraw();
                    }
                }
            });
        },
        { deep: true }
    );

    // Пересоздаем stage при изменении размеров
    watch([() => store.stageWidth, () => store.stageHeight], () => {
        stageKey.value++;
    });

    // Helper для установки ref
    function setLayerRef(index: number, el: any) {
        if (el) {
            layerRefs.value[index] = el;
        }
    }

    return {
        store,
        stageKey,
        loadedLayers,
        layersLoadingStatus,
        setLayerRef,
    };
}