import { defineStore } from "pinia";
import { ref, watch, nextTick, computed, Ref, ComputedRef } from 'vue';
import { useImage } from 'vue-konva';

// Types
export interface ImageConfig {
    type: string;
    image: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    opacity?: number;
    globalCompositeOperation?: string;
}

export interface LoadedImageConfig extends ImageConfig {
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
    // Оригинальные размеры
    const ORIGINAL_WIDTH = 1878;
    const ORIGINAL_HEIGHT = 4096;
    const ASPECT_RATIO = ORIGINAL_HEIGHT / ORIGINAL_WIDTH;
    
    const maxWidth = ref<number>(240);

    // Computed размеры
    const stageWidth = computed(() => maxWidth.value);
    const stageHeight = computed(() => Math.round(maxWidth.value * ASPECT_RATIO));

    // Слои двери - каждый слой это массив изображений
    const doorLayers = ref<ImageConfig[][]>([
        // Слой 0: Фон
        [
            {
                type: 'background',
                image: '/assets/test/film-colors/filmcolor1.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            }
        ],
        // Слой 1: Фрезеровка
        [
            {
                type: 'milling',
                image: '/assets/test/millings/milling1.png',
                // x: 85 * (stageWidth.value / 1878),
                // y: 85 * (stageHeight.value / 4096),
                // width: stageWidth.value - 170 * (stageWidth.value / 1878),
                // height: stageHeight.value - 85 * (stageHeight.value / 4096),
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 0.75,
                globalCompositeOperation: 'multiply',
            }
        ],
        // Слой 2: Декоративный элемент (текстура + маска)
        [
            {
                type: 'decor-texture',
                image: '/assets/test/decorative-elements/el1/texture.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
                globalCompositeOperation: 'destination-in',
            },
            {
                type: 'decor-mask',
                image: '/assets/test/decorative-elements/el1/texture.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            },
            {
                type: 'decor-detail',
                image: '/assets/test/decorative-elements/el1/decor.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            }
        ],
        // Слой 3: Силуэт корпуса
        [
            {
                type: 'case-silhouette',
                image: '/assets/test/case-silhouette.png',
                x: 0,
                y: 0,
                width: stageWidth.value,
                height: stageHeight.value,
                opacity: 1,
            }
        ]
    ]);

    // Определяем какие слои нужно кэшировать (группировать)
    const layersThatNeedCaching = computed<LayerCacheInfo[]>(() => {
        return doorLayers.value.map((layer, index) => {
            // Если в слое есть composite operations, его нужно кэшировать
            const hasCompositeOps = layer.some(img => img.globalCompositeOperation);
            return { index, needsCache: hasCompositeOps };
        }).filter(l => l.needsCache);
    });

    // Actions
    function setDoorLayers(layers: ImageConfig[][]) {
        doorLayers.value = layers;
    }

    function updateLayer(layerIndex: number, images: ImageConfig[]) {
        doorLayers.value[layerIndex] = images;
    }

    function setMaxWidth(width: number) {
        maxWidth.value = width;
    }

    return {
        // State
        doorLayers,
        maxWidth,
        
        // Computed
        stageWidth,
        stageHeight,
        layersThatNeedCaching,
        ASPECT_RATIO,
        
        // Actions
        setDoorLayers,
        updateLayer,
        setMaxWidth,
    };
});

// Composable
export function useDoorVisual() {
    const store = useDoorVisualStore();
    const stageKey = ref<number>(0);
    const layerRefs = ref<any[]>([]);

    // Загружаем все изображения из всех слоев
    const loadedLayers: ComputedRef<LoadedImageConfig[][]> = computed(() => {
        return store.doorLayers.map(layer => {
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

    // Пересоздаем stage при изменении размера
    watch(() => store.maxWidth, () => {
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