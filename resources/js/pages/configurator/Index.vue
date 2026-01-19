<script setup lang="ts">
    import DoorVisualizer from '@/components/Configurator/DoorVisualizer.vue';
import { useDoorCalc } from '@/composables/useDoorCalc';
    import AppLayout from '@/layouts/AppLayout.vue';
    import { getDoorModelImage, getImageUrl } from '@/lib/utils';
    import { dashboard } from '@/routes';
    import { type BreadcrumbItem } from '@/types';
    import { DoorModel, Nomenclature } from '@/types/configurator';
    import { usePage } from '@inertiajs/vue3';
    import { Head } from '@inertiajs/vue3';
    import { SelectButton, InputNumber, Dialog, Drawer, ToggleSwitch, Button, Timeline } from 'primevue';
    import { computed, ref, watchEffect, onMounted, onUnmounted } from 'vue';
    import { useImage } from 'vue-konva';
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Конфигуратор',
            href: dashboard().url,
        },
    ]
    
    const steps = ref([
        {
            label: 'Дизайн',
            icon: 'pi pi-palette',
        },
        {
            label: 'Цвет плёнки',
            icon: 'pi pi-palette',
        },
        {
            label: 'Цвет металла',
            icon: 'pi pi-palette',
        },
        {
            label: 'Цвет металла',
            icon: 'pi pi-palette',
        },
    ])
    
    const paints = ref(usePage().props.paints as Nomenclature[])
    const doorModels = ref(usePage().props.doorModels as DoorModel[])
    const filmColors = ref(usePage().props.filmColors as Nomenclature[])
    
    const doorCalcStore = useDoorCalc()
    doorCalcStore.paints = paints.value
    doorCalcStore.doorModels = doorModels.value
    doorCalcStore.filmColors = filmColors.value
    
    // Door component arrays (Static assets for rendering if needed, though store drives config)
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
    
    // Computed properties to filter door models
    const exteriorDoorModels = computed(() => {
        return doorModels.value.filter((model: DoorModel) => model.type === 'exterior');
    });
    
    const interiorDoorModels = computed(() => {
        return doorModels.value.filter((model: DoorModel) => model.type === 'interior');
    });
    
    const isLoggedIn = computed(() => {
        if (!usePage().props.auth) return null;
        return usePage().props.auth.user !== null;
    });
    
    // Accordion state for door parameters
    const isParametersExpanded = ref(false);
    
    // Door type options
    const doorTypeOptions = [
        { label: 'Квартирная', value: 'Apartment' },
        { label: 'Уличная', value: 'Street' }
    ];
    
    const doorConstructiveOptions = [
        { label: 'Comfort', value: 'Comfort' },
        { label: 'Absolut', value: 'Absolut' },
        { label: 'Termo', value: 'Termo' }
    ];
    
    const handleSideOptions = [
        { label: 'Левая', value: 'Left' },
        { label: 'Правая', value: 'Right' }
    ];
    
    const boxDesignOptions = [
        { label: 'Открытый', value: 'Opened' },
        { label: 'Закрытый', value: 'Closed' }
    ];
    
    const parametersSummary = computed(() => {
        let doorWidth = doorCalcStore.doorConfig.doorWidth
        let doorHeight = doorCalcStore.doorConfig.doorHeight
        let handleSide = 'Ручка ' + (doorCalcStore.doorConfig.doorHandleSide === 'Left' ? 'слева' : 'справа')
        let boxDesign = (doorCalcStore.doorConfig.doorBoxDesign === 'Opened' ? 'Открытый' : 'Закрытый') + ' короб'
        let doorType = doorCalcStore.doorConfig.doorType === 'Apartment' ? 'Квартирная' : 'Уличная'
        let doorConstructive = doorCalcStore.doorConfig.doorConstructive
        
        return [
            `${doorWidth}x${doorHeight} мм`,
            doorType,
            doorConstructive,
            handleSide,
            boxDesign,
        ]
    })
    
    // Drawer States
    const showOuterDesignDialog = ref(false);
    const showInnerDesignDialog = ref(false);
    const showFilmPrimaryDrawer = ref(false);
    const showFilmSecondaryDrawer = ref(false);
    const showFilmCasingDrawer = ref(false);
    const showMetalPrimaryDrawer = ref(false);
    const showMetalSecondaryDrawer = ref(false);
    
    // Helper to get current selection details for UI cards
    const getSelectedModel = (id?: number) => doorModels.value.find(m => m.id === id);
    const getSelectedFilm = (id?: number) => filmColors.value.find(f => f.id === id);
    const getSelectedPaint = (id?: number) => paints.value.find(p => p.id === id);
    
    </script>
    
    <template>
        <Head title="Конфигуратор" />
        <AppLayout :breadcrumbs="breadcrumbs">
            <div class="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">
                
                <!-- Header Section -->
                <div v-if="!isLoggedIn" class="text-center border-b border-black/10 dark:border-white/10 pb-4 sm:pb-6 lg:pb-8">
                    <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black dark:text-white mb-2 sm:mb-3">
                        Конфигуратор <span class="italic">дверей</span>
                    </h1>
                    <p class="font-serif text-base sm:text-lg text-black/60 dark:text-white/60">
                        Создайте идеальную дверь по вашему вкусу
                    </p>
                </div>
    
                <!-- Main Grid -->
                <div class="grid gap-4 lg:grid-cols-12">
                    
                    <!-- Left Column: Preview & Parameters -->
                    <div class="lg:col-span-7">
                        <div class="sticky top-0 space-y-4">
                            <!-- Visualization Area -->
                            <div class="relative min-h-[400px]">
                                <div class="sticky top-0">
                                    <DoorVisualizer />
                                </div>
                            </div>

                            <!-- Door Parameters Accordion -->
                            <div class="border-2 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800">
                                <!-- Accordion Header -->
                                <button @click="isParametersExpanded = !isParametersExpanded"
                                    class="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700">
                                    <div class="flex-1">
                                        <h3 class="font-serif text-base sm:text-lg text-black dark:text-white mb-1">
                                            Параметры двери
                                        </h3>
                                        <p v-if="!isParametersExpanded"
                                            class="text-xs sm:text-sm hidden sm:block text-black/60 dark:text-white/60">
                                            <span v-for="item in parametersSummary" :key="item">{{ item }} <span class="mx-2 text-xs" v-if="item !== parametersSummary[parametersSummary.length - 1]">●</span></span>
                                        </p>
                                    </div>
                                    <svg :class="['w-5 h-5 text-black dark:text-white transition-transform duration-300', isParametersExpanded ? 'rotate-180' : '']"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                <!-- Accordion Content -->
                                <div v-show="isParametersExpanded"
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/10 dark:border-white/10 p-4">
                                    
                                    <!-- Door Type -->
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Тип двери
                                        </label>
                                        <SelectButton :options="doorTypeOptions" v-model="doorCalcStore.doorConfig.doorType"
                                            optionLabel="label" optionValue="value" size="small" fluid />
                                    </div>
    
                                    <!-- Door Constructive -->
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Конструктив
                                        </label>
                                        <SelectButton :options="doorConstructiveOptions"
                                            v-model="doorCalcStore.doorConfig.doorConstructive" optionLabel="label"
                                            optionValue="value" size="small" fluid />
                                    </div>
    
                                    <!-- Dimensions -->
                                    <div>
                                        <div>
                                            <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                                Ширина (мм)
                                            </label>
                                            <InputNumber v-model="doorCalcStore.doorConfig.doorWidth" :min="600" :max="3000"
                                                :step="10" showButtons buttonLayout="horizontal"
                                                decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                                fluid suffix="мм" />
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                                Высота (мм)
                                            </label>
                                            <InputNumber v-model="doorCalcStore.doorConfig.doorHeight" :min="600"
                                                :max="3000" :step="10" showButtons buttonLayout="horizontal"
                                                decrementButtonClass="p-button-text" incrementButtonClass="p-button-text"
                                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                                fluid suffix="мм" />
                                        </div>
                                    </div>
    
                                    <!-- Handle Side -->
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Сторона ручки
                                        </label>
                                        <SelectButton :options="handleSideOptions"
                                            v-model="doorCalcStore.doorConfig.doorHandleSide" optionLabel="label"
                                            optionValue="value" size="small" fluid />
                                    </div>
    
                                    <!-- Box Design -->
                                    <div>
                                        <label class="block font-serif text-sm text-black dark:text-white mb-2">
                                            Дизайн короба
                                        </label>
                                        <SelectButton :options="boxDesignOptions"
                                            v-model="doorCalcStore.doorConfig.doorBoxDesign" optionLabel="label"
                                            optionValue="value" size="small" fluid />
                                    </div>
                                </div>
                            </div>
    
                            <!-- Action buttons -->
                            <div class="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                                <div>
                                    <span class="font-medium font-sans text-xl">{{ doorCalcStore.total_price }} ₽</span>
                                </div>
                                <button
                                    class="px-6 sm:px-8 py-2.5 sm:py-3 font-serif text-xs sm:text-sm tracking-[0.15em] uppercase text-white bg-black dark:bg-white dark:text-black border border-black dark:border-white transition-all duration-300 hover:tracking-[0.2em]">
                                    Сохранить конфигурацию
                                </button>
                            </div>
                        </div>
                    </div>
    
                    <!-- Right Column: Options Panel -->
                    <div class="lg:col-span-4 space-y-4">
                        
                        <!-- I. Design Selection -->
                        <div class="space-y-4">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight border-b pb-2 border-black/10 dark:border-white/10">
                                <span class="italic text-gray-400 mr-2">I.</span> Дизайн отделки
                            </h2>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <div @click="showOuterDesignDialog = true" 
                                    class="group flex flex-col items-center gap-2 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    
                                    <div class="w-full aspect-[2/3] relative flex-shrink-0 rounded-sm overflow-hidden flex items-center justify-center">
                                        <img v-if="doorCalcStore.doorConfig.exterior.panelModel" 
                                            :src="getDoorModelImage(getSelectedModel(doorCalcStore.doorConfig.exterior.panelModel)?.image ?? '')" 
                                            
                                            class="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>

                                    <div class="text-center w-full">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Снаружи</p>
                                        <p class="font-medium truncate text-black dark:text-white font-sans">
                                            {{ getSelectedModel(doorCalcStore.doorConfig.exterior.panelModel)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <Button variant="outlined" size="small" class="w-full" label="Изменить" />
                                </div>

                                <div @click="showInnerDesignDialog = true" 
                                    class="group flex flex-col items-center gap-2 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    
                                    <div class="w-full aspect-[2/3] relative flex-shrink-0 rounded-sm overflow-hidden flex items-center justify-center">
                                        <img v-if="doorCalcStore.doorConfig.interior.panelModel" 
                                            :src="getDoorModelImage(getSelectedModel(doorCalcStore.doorConfig.interior.panelModel)?.image ?? '')" 
                                            
                                            class="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>

                                    <div class="text-center w-full">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Изнутри</p>
                                        <p class="font-medium truncate text-black dark:text-white font-sans">
                                            {{ getSelectedModel(doorCalcStore.doorConfig.interior.panelModel)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <Button variant="outlined" size="small" class="w-full" label="Изменить" />
                                </div>
                            </div>
                        </div>
    
                        <!-- II. Film Colors Selection -->
                        <div class="space-y-4">
                            <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight border-b pb-2 border-black/10 dark:border-white/10">
                                <span class="italic text-gray-400 mr-2">II.</span> Цвет плёнки
                            </h2>
    
                            <div class="grid grid-cols-1 gap-3">
                                <!-- Primary Texture Card -->
                                <div @click="showFilmPrimaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-gray-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.exterior.primaryTexture" 
                                             :src="getImageUrl(getSelectedFilm(doorCalcStore.doorConfig.exterior.primaryTexture)?.image ?? '')" 
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ getSelectedFilm(doorCalcStore.doorConfig.exterior.primaryTexture)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                                <!-- Secondary Texture Card -->
                                <div @click="showFilmSecondaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-gray-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.exterior.secondaryTexture" 
                                             :src="getImageUrl(getSelectedFilm(doorCalcStore.doorConfig.exterior.secondaryTexture)?.image ?? '')" 
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ getSelectedFilm(doorCalcStore.doorConfig.exterior.secondaryTexture)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
    
                                <!-- Casing Texture Card -->
                                <div @click="showFilmCasingDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-gray-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.exterior.casingTexture" 
                                             :src="getImageUrl(getSelectedFilm(doorCalcStore.doorConfig.exterior.casingTexture)?.image ?? '')" 
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Цвет наличника</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ getSelectedFilm(doorCalcStore.doorConfig.exterior.casingTexture)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                            </div>
                        
    
                        <!-- III. Metal Painting Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between border-b pb-2 border-black/10 dark:border-white/10">
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight">
                                    <span class="italic text-gray-400 mr-2">III.</span> Покраска металла
                                </h2>
                            </div>
                            
                            <!-- Undercoat Toggle -->
                            <div class="flex items-center justify-between py-2">
                                <span class="font-serif text-sm text-gray-700 dark:text-gray-300">Цинкогрунтование</span>
                                <ToggleSwitch v-model="doorCalcStore.doorConfig.metalPainting!.undercoat" />
                            </div>
    
                            <div class="grid grid-cols-1 gap-3">
                                <!-- Primary Metal Color Card -->
                                <div @click="showMetalPrimaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-gray-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.metalPainting?.primaryColor" 
                                             :src="getImageUrl(getSelectedPaint(doorCalcStore.doorConfig.metalPainting.primaryColor)?.image ?? '')" 
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Основной цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ getSelectedPaint(doorCalcStore.doorConfig.metalPainting?.primaryColor)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
    
                                <!-- Secondary Metal Color Card -->
                                <div @click="showMetalSecondaryDrawer = true" 
                                    class="group flex items-center gap-4 p-3 border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-white bg-white dark:bg-white/5 transition-all duration-300 cursor-pointer">
                                    <div class="h-16 w-16 bg-gray-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden border border-black/10">
                                        <img v-if="doorCalcStore.doorConfig.metalPainting?.secondaryColor" 
                                             :src="getImageUrl(getSelectedPaint(doorCalcStore.doorConfig.metalPainting.secondaryColor)?.image ?? '')" 
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="font-serif text-xs text-gray-500 uppercase tracking-wider mb-0.5">Дополнительный цвет</p>
                                        <p class="font-medium truncate text-black dark:text-white">
                                            {{ getSelectedPaint(doorCalcStore.doorConfig.metalPainting?.secondaryColor)?.name || 'Не выбрано' }}
                                        </p>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- Step timeline -->
                    <div class="lg:col-span-1 border-2 border-black/10 dark:border-white/10 pt-4">
                        <Timeline :value="steps" align="center" :pt="{
                            item: {
                                class: 'flex items-center justify-between'
                            }
                        }"></Timeline>
                    </div>
                </div>
            </div>
        </AppLayout>
    
        <!-- DRAWER: Outer Design -->
        <Drawer v-model:visible="showOuterDesignDialog" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <div class="flex items-center gap-2">
                    <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                        Дизайн наружной отделки
                    </h2>
                </div>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
                <div v-for="doorModel in exteriorDoorModels" :key="doorModel.id"
                    class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    @click="() => { doorCalcStore.doorConfig.exterior.panelModel = doorModel.id; showOuterDesignDialog = false; }">
                    <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full rounded-sm">
                    <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1" 
                       :class="[doorCalcStore.doorConfig.exterior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400']">
                        {{ doorModel.name }}
                    </p>
                </div>
            </div>
        </Drawer>
    
        <!-- DRAWER: Inner Design -->
        <Drawer v-model:visible="showInnerDesignDialog" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <div class="flex items-center gap-2">
                    <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                        Дизайн внутренней отделки
                    </h2>
                </div>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-1">
                <div v-for="doorModel in interiorDoorModels" :key="doorModel.id"
                    class="flex flex-col items-center justify-center gap-1.5 sm:gap-2 pb-2 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    @click="() => { doorCalcStore.doorConfig.interior.panelModel = doorModel.id; showInnerDesignDialog = false; }">
                    <img :src="getDoorModelImage(doorModel.image)" :alt="doorModel.name" class="w-full h-full object-cover rounded-sm">
                    <p class="font-medium tracking-tight text-center text-sm transition-colors duration-300 px-1"
                       :class="[doorCalcStore.doorConfig.interior.panelModel === doorModel.id ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400']">
                        {{ doorModel.name }}
                    </p>
                </div>
            </div>
        </Drawer>

        <!-- DRAWER: Primary Film Color -->
        <Drawer v-model:visible="showFilmPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Цвет плёнки: Основной
                </h2>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
                <div v-for="(panel, idx) in filmColors" :key="idx" 
                    @click="() => { doorCalcStore.doorConfig.exterior.primaryTexture = panel.id; showFilmPrimaryDrawer = false; }"
                    :class="[
                        'group cursor-pointer border transition-all duration-300 aspect-video',
                        doorCalcStore.doorConfig.exterior.primaryTexture === panel.id
                            ? 'border-black/40 dark:border-white/40 border-2'
                            : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                    ]">
                    <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                    <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
                </div>
            </div>
        </Drawer>
    
        <!-- DRAWER: Secondary Film Color -->
        <Drawer v-model:visible="showFilmSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Цвет плёнки: Дополнительный
                </h2>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
                <div v-for="(panel, idx) in filmColors" :key="idx" 
                    @click="() => { doorCalcStore.doorConfig.exterior.secondaryTexture = panel.id; showFilmSecondaryDrawer = false; }"
                    :class="[
                        'group cursor-pointer border transition-all duration-300 aspect-video',
                        doorCalcStore.doorConfig.exterior.secondaryTexture === panel.id
                            ? 'border-black/40 dark:border-white/40 border-2'
                            : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                    ]">
                    <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                    <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
                </div>
            </div>
        </Drawer>
    
        <!-- DRAWER: Casing Film Color -->
        <Drawer v-model:visible="showFilmCasingDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Цвет плёнки: Наличник
                </h2>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
                <div v-for="(panel, idx) in filmColors" :key="idx" 
                    @click="() => { doorCalcStore.doorConfig.exterior.casingTexture = panel.id; showFilmCasingDrawer = false; }"
                    :class="[
                        'group cursor-pointer border transition-all duration-300 aspect-video',
                        doorCalcStore.doorConfig.exterior.casingTexture === panel.id
                            ? 'border-black/40 dark:border-white/40 border-2'
                            : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                    ]">
                    <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                    <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
                </div>
            </div>
        </Drawer>
    
        <!-- DRAWER: Metal Primary Color -->
        <Drawer v-model:visible="showMetalPrimaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Покраска металла: Основной цвет
                </h2>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
                <div v-for="(panel, idx) in paints" :key="idx" 
                    @click="() => { doorCalcStore.doorConfig.metalPainting!.primaryColor = panel.id; showMetalPrimaryDrawer = false; }"
                    :class="[
                        'group cursor-pointer border transition-all duration-300 aspect-video',
                        doorCalcStore.doorConfig.metalPainting?.primaryColor === panel.id
                            ? 'border-black/40 dark:border-white/40 border-2'
                            : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                    ]">
                    <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                    <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
                </div>
            </div>
        </Drawer>
    
        <!-- DRAWER: Metal Secondary Color -->
        <Drawer v-model:visible="showMetalSecondaryDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
            <template #header>
                <h2 class="text-base sm:text-lg md:text-xl text-black dark:text-white tracking-tight font-serif">
                    Покраска металла: Дополнительный цвет
                </h2>
            </template>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 p-1">
                <div v-for="(panel, idx) in paints" :key="idx" 
                    @click="() => { doorCalcStore.doorConfig.metalPainting!.secondaryColor = panel.id; showMetalSecondaryDrawer = false; }"
                    :class="[
                        'group cursor-pointer border transition-all duration-300 aspect-video',
                        doorCalcStore.doorConfig.metalPainting?.secondaryColor === panel.id
                            ? 'border-black/40 dark:border-white/40 border-2'
                            : 'border-transparent dark:border-transparent hover:border-black/40 dark:hover:border-white/40 border-2'
                    ]">
                    <img :src="getImageUrl(panel.image ?? null)" :alt="panel.name ?? ''" class="w-full h-full object-cover" />
                    <div class="text-xs text-center p-1 truncate">{{ panel.name }}</div>
                </div>
            </div>
        </Drawer>
    </template>
<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1,
h2,
h3,
button {
    font-family: 'Playfair Display', serif;
}

/* PrimeVue SelectButton customization */
:deep(.p-selectbutton) {
    display: flex;
    width: 100%;
}

:deep(.p-selectbutton .p-button) {
    flex: 1;
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
}

/* PrimeVue InputNumber customization */
:deep(.p-inputnumber) {
    width: 100%;
    display: flex;
}

:deep(.p-inputnumber-input) {
    font-family: 'Playfair Display', serif;
    font-size: 0.875rem;
}

:deep(.p-inputnumber-button .p-icon) {
    width: 1rem;
    height: 1rem;
}
</style>