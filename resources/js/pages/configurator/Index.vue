<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { Head } from '@inertiajs/vue3';
import { computed, ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { useImage } from 'vue-konva';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: dashboard().url,
    },
];

// Door component arrays
const panels = [
    '/assets/конструктор/океанская зелень.webp',
    '/assets/конструктор/полотно чистое.webp',
    '/assets/panels/Шпат грей.png',
];

const millings = [
    '/assets/конструктор/океанская зелень фреза.webp',
    '/assets/конструктор/фреза один.webp',
    '/assets/конструктор/фреза два.webp',
    '/assets/millings/фреза artline.png',
];

const casings = [
    '/assets/конструктор/наличник мдф.webp',
    '/assets/конструктор/наличник.webp',
    '/assets/casings/муар черный.png',
];

const fittings = [
    '/assets/конструктор/фурнитура.webp',
    '/assets/fittings/efitting.png',
];

const decorations = [
    '',
    '/assets/decorative-elements/decoration.png',
];

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
const containerRef = ref<HTMLElement | null>(null);

// Responsive stage width
const updateStageWidth = () => {
    if (containerRef.value) {
        const containerWidth = containerRef.value.clientWidth;
        // Make the stage responsive to container width - adapts from mobile to desktop
        const maxWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 400 : 500;
        stageDesiredWidth.value = Math.min(containerWidth - 32, maxWidth);
    }
};

onMounted(() => {
    updateStageWidth();
    window.addEventListener('resize', updateStageWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateStageWidth);
});

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

const isLoggedIn = computed(() => {
    return usePage().props.auth.user !== null;
});
</script>

<template>
    <Head title="Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 sm:gap-6 lg:gap-8 overflow-x-auto p-4 sm:p-6 lg:p-8 bg-white">
            <!-- Header Section -->
            <div v-if="!isLoggedIn" class="text-center border-b border-black/10 pb-4 sm:pb-6 lg:pb-8">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-2 sm:mb-3">
                    Конфигуратор <span class="italic">дверей</span>
                </h1>
                <p class="font-serif text-base sm:text-lg text-black/60">
                    Создайте идеальную дверь по вашему вкусу
                </p>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-12">
                <!-- Options Panel -->
                <div class="lg:col-span-4 space-y-4 sm:space-y-6">
                    <!-- Panel Selection -->
                    <div class="border-l-2 border-black pl-4 sm:pl-6">
                        <h2 class="font-serif text-xl sm:text-2xl text-black mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">I.</span> Текстура
                        </h2>
                        <div class="space-y-2 sm:space-y-3">
                            <div 
                                v-for="(panel, idx) in panels" 
                                :key="idx"
                                @click="selectedDoorParameters.panel = panel"
                                :class="[
                                    'group cursor-pointer border border-black/20 p-3 sm:p-4 transition-all duration-300',
                                    selectedDoorParameters.panel === panel ? 'bg-black text-white border-black' : 'hover:border-black/40'
                                ]"
                            >
                                <h3 class="font-serif text-sm sm:text-base tracking-wide truncate" :class="selectedDoorParameters.panel === panel ? 'text-white' : 'text-black'">
                                    {{ panel.split('/').pop() }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Milling Selection -->
                    <div class="border-l-2 border-black pl-4 sm:pl-6">
                        <h2 class="font-serif text-xl sm:text-2xl text-black mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">II.</span> Фрезеровка
                        </h2>
                        <div class="space-y-2 sm:space-y-3">
                            <div 
                                v-for="(milling, idx) in millings" 
                                :key="idx"
                                @click="selectedDoorParameters.milling = milling"
                                :class="[
                                    'group cursor-pointer border border-black/20 p-3 sm:p-4 transition-all duration-300',
                                    selectedDoorParameters.milling === milling ? 'bg-black text-white border-black' : 'hover:border-black/40'
                                ]"
                            >
                                <h3 class="font-serif text-sm sm:text-base tracking-wide truncate" :class="selectedDoorParameters.milling === milling ? 'text-white' : 'text-black'">
                                    {{ milling.split('/').pop() }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Casing Selection -->
                    <div class="border-l-2 border-black pl-4 sm:pl-6">
                        <h2 class="font-serif text-xl sm:text-2xl text-black mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">III.</span> Наличник
                        </h2>
                        <div class="space-y-2 sm:space-y-3">
                            <div 
                                v-for="(casing, idx) in casings" 
                                :key="idx"
                                @click="selectedDoorParameters.casing = casing"
                                :class="[
                                    'group cursor-pointer border border-black/20 p-3 sm:p-4 transition-all duration-300',
                                    selectedDoorParameters.casing === casing ? 'bg-black text-white border-black' : 'hover:border-black/40'
                                ]"
                            >
                                <h3 class="font-serif text-sm sm:text-base tracking-wide truncate" :class="selectedDoorParameters.casing === casing ? 'text-white' : 'text-black'">
                                    {{ casing.split('/').pop() }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Decoration Selection -->
                    <div class="border-l-2 border-black pl-4 sm:pl-6">
                        <h2 class="font-serif text-xl sm:text-2xl text-black mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">IV.</span> Декор
                        </h2>
                        <div class="space-y-2 sm:space-y-3">
                            <div 
                                v-for="(decoration, idx) in decorations" 
                                :key="idx"
                                @click="selectedDoorParameters.decoration = decoration"
                                :class="[
                                    'group cursor-pointer border border-black/20 p-3 sm:p-4 transition-all duration-300',
                                    selectedDoorParameters.decoration === decoration ? 'bg-black text-white border-black' : 'hover:border-black/40'
                                ]"
                            >
                                <h3 class="font-serif text-sm sm:text-base tracking-wide truncate" :class="selectedDoorParameters.decoration === decoration ? 'text-white' : 'text-black'">
                                    {{ decoration ? decoration.split('/').pop() : 'Без декора' }}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Fitting Selection -->
                    <div class="border-l-2 border-black pl-4 sm:pl-6">
                        <h2 class="font-serif text-xl sm:text-2xl text-black mb-3 sm:mb-4 tracking-tight">
                            <span class="italic">V.</span> Фурнитура
                        </h2>
                        <div class="space-y-2 sm:space-y-3">
                            <div 
                                v-for="(fitting, idx) in fittings" 
                                :key="idx"
                                @click="selectedDoorParameters.fitting = fitting"
                                :class="[
                                    'group cursor-pointer border border-black/20 p-3 sm:p-4 transition-all duration-300',
                                    selectedDoorParameters.fitting === fitting ? 'bg-black text-white border-black' : 'hover:border-black/40'
                                ]"
                            >
                                <h3 class="font-serif text-sm sm:text-base tracking-wide truncate" :class="selectedDoorParameters.fitting === fitting ? 'text-white' : 'text-black'">
                                    {{ fitting.split('/').pop() }}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preview Panel -->
                <div class="lg:col-span-8">
                    <div class="lg:sticky lg:top-8">
                        <div ref="containerRef" class="border-2 border-black/10 bg-gradient-to-b from-white to-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
                            <!-- Decorative frame -->
                            <div class="absolute inset-4 border border-black/5"></div>
                            
                            <!-- Konva Canvas -->
                            <div class="relative z-10 flex justify-center items-center">
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
                                                // Apply blend modes to overlay layers for better color matching
                                                globalCompositeOperation: imageData.type === 'milling' ? 'luminosity' : 'source-over',
                                            }"
                                        />
                                    </v-layer>
                                </v-stage>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        <div class="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button 
                                class="px-6 sm:px-8 py-2.5 sm:py-3 font-serif text-xs sm:text-sm tracking-[0.15em] uppercase text-white bg-black border border-black transition-all duration-300 hover:tracking-[0.2em]">
                                Сохранить конфигурацию
                            </button>
                            <button 
                                class="px-6 sm:px-8 py-2.5 sm:py-3 font-serif text-xs sm:text-sm tracking-[0.15em] uppercase text-black border border-black transition-all duration-300 hover:bg-black hover:text-white hover:tracking-[0.2em]">
                                Запросить цену
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1, h2, h3, p, button {
    font-family: 'Playfair Display', serif;
}
</style>