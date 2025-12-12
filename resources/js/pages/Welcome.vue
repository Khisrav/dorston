<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useImage } from 'vue-konva';

const panels = [
    '/assets/конструктор/океанская зелень.webp',
    '/assets/конструктор/полотно чистое.webp',
    '/assets/panels/Шпат грей.png',
]

const millings = [
    '/assets/конструктор/океанская зелень фреза.webp',
    '/assets/конструктор/фреза один.webp',
    '/assets/конструктор/фреза два.webp',
    '/assets/millings/фреза artline.png',
]

const casings = [
    '/assets/конструктор/наличник мдф.webp',
    '/assets/конструктор/наличник.webp',
    '/assets/casings/муар черный.png',
]

const fittings = [
    '/assets/конструктор/фурнитура.webp',
    '/assets/fittings/efitting.png',
]

const decorations = [
    '',
    '/assets/decorative-elements/decoration.png',
]

const selectedDoorParameters = ref({
    panel: panels[0],
    milling: millings[0],
    casing: casings[0],
    decoration: decorations[0],
    fitting: fittings[0],
});

const doorLayerImages = computed(() => [
    selectedDoorParameters.value.panel,
    selectedDoorParameters.value.milling,
    selectedDoorParameters.value.casing,
    selectedDoorParameters.value.decoration,
    selectedDoorParameters.value.fitting,
]);

const imageRefs = ref<Array<ReturnType<typeof useImage>>>([]);

// Watch for changes in doorLayerImages and reload
watchEffect(() => {
    imageRefs.value = doorLayerImages.value.map((src) => useImage(src));
});

const imagesData = ref<
    Array<{ type: string, image: HTMLImageElement | null; width: number; height: number; originalWidth: number; originalHeight: number; position: { x: number; y: number } }>
>(doorLayerImages.value.map(() => ({ type: '', image: null, width: 0, height: 0, originalWidth: 0, originalHeight: 0, position: { x: 0, y: 0 } })));

const stageDesiredWidth = ref(300);

const maxWH = computed(() => {
    const maxWidth = Math.max(...imageRefs.value.map((imgRef) => imgRef[0].value?.width ?? 0));
    const maxHeight = Math.max(...imageRefs.value.map((imgRef) => imgRef[0].value?.height ?? 0));
    return {
        width: maxWidth,
        height: maxHeight,
    };
});

const stageScaleFactor = computed(() => {
    return stageDesiredWidth.value / maxWH.value.width;
});

const stageSize = computed(() => {
    return {
        width: maxWH.value.width * stageScaleFactor.value,
        height: maxWH.value.height * stageScaleFactor.value,
    };
});

watchEffect(() => {
    // Define layer types based on index order: panel, milling, casing, decoration, fitting
    const layerTypes = ['panel', 'milling', 'casing', 'decoration', 'fitting'];
    
    imageRefs.value.forEach((imgRef, index) => {
        const image = imgRef[0].value;
        if (image) {
            const layerType = layerTypes[index] || 'unknown';
            
            // All images use the same scale factor for consistency
            let scaledWidth = image.width * stageScaleFactor.value;
            let scaledHeight = image.height * stageScaleFactor.value;
            
            // Scale up smaller images (except fitting) to match the desired width
            if (scaledWidth < stageDesiredWidth.value && layerType !== 'fitting') {
                scaledWidth = stageDesiredWidth.value;
                scaledHeight = scaledWidth * (image.height / image.width);
            }

            imagesData.value[index] = {
                type: layerType,
                image,
                width: scaledWidth,
                height: scaledHeight,
                originalWidth: image.width,
                originalHeight: image.height,
                position: {
                    // Center each image within the stage
                    x: (stageSize.value.width - scaledWidth) / 2,
                    y: (stageSize.value.height - scaledHeight) / 2,
                },
            };
        } else {
            imagesData.value[index] = { type: '', image: null, width: 0, height: 0, originalWidth: 0, originalHeight: 0, position: { x: 0, y: 0 } };
        }
    });
});

</script>

<template>
    <div class="flex gap-4 p-4">
        <div class="w-80 p-4 space-y-4 h-fit">  
            <input type="number" v-model="stageDesiredWidth" class="space-y-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">          
            <div class="space-y-2">
                <select 
                    v-model="selectedDoorParameters.panel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option v-for="(panel, idx) in panels" :key="idx" :value="panel">
                        {{ panel.split('/').pop() }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <select 
                    v-model="selectedDoorParameters.milling"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option v-for="(milling, idx) in millings" :key="idx" :value="milling">
                        {{ milling.split('/').pop() }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <select 
                    v-model="selectedDoorParameters.casing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option v-for="(casing, idx) in casings" :key="idx" :value="casing">
                        {{ casing.split('/').pop() }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <select 
                    v-model="selectedDoorParameters.decoration"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option v-for="(decoration, idx) in decorations" :key="idx" :value="decoration">
                        {{ decoration.split('/').pop() }}
                    </option>
                </select>
            </div>

            <div class="space-y-2">
                <select 
                    v-model="selectedDoorParameters.fitting"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option v-for="(fitting, idx) in fittings" :key="idx" :value="fitting">
                        {{ fitting.split('/').pop() }}
                    </option>
                </select>
            </div>
        </div>

        <div class="flex-1">
            <div id="container" class="p-4 ">
                <v-stage :config="stageSize">
                    <v-layer>
                        <v-image
                            v-for="(imageData, index) in imagesData"
                            :key="index"
                            :config="{
                                image: imageData.image,
                                x: imageData.position.x,
                                y: imageData.position.y,
                                width: imageData.width,
                                height: imageData.height,
                                depth: index + 1,
                            }"
                        >
                        </v-image>
                    </v-layer>
                </v-stage>
            </div>

            <div class="p-4">
                <div v-for="(imageData, index) in imagesData" :key="index" class="mb-4 pb-4 border-b last:border-b-0">
                    <h4 class="">
                        Слой {{ index + 1 }}: {{ doorLayerImages[index] }}
                    </h4>
                    <div class="">
                        <div><span>X:</span> {{ imageData.position.x }}</div>
                        <div><span>Y:</span> {{ imageData.position.y }}</div>
                        <div><span>Width:</span> {{ imageData.width }}</div>
                        <div><span>Height:</span> {{ imageData.height }}</div>
                        <div><span>Original W:</span> {{ imageData.originalWidth }}</div>
                        <div><span>Original H:</span> {{ imageData.originalHeight }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
