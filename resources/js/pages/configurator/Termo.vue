<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/vue3';
import type { DoorModel, Furniture, Nomenclature } from '@/types/configurator';
import { Button } from 'primevue';
import { ref } from 'vue';
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc';
import TermoParametersCard from '@/components/Configurator/TermoCards/TermoParametersCard.vue';
import TermoExteriorCard from '@/components/Configurator/TermoCards/TermoExteriorCard.vue';
import TermoInteriorCard from '@/components/Configurator/TermoCards/TermoInteriorCard.vue';
import TermoMetalCard from '@/components/Configurator/TermoCards/TermoMetalCard.vue';
import TermoGlassCard from '@/components/Configurator/TermoCards/TermoGlassCard.vue';
import TermoLockerCard from '@/components/Configurator/TermoCards/TermoLockerCard.vue';
import TermoFurnitureCard from '@/components/Configurator/TermoCards/TermoFurnitureCard.vue';
import TermoModularCard from '@/components/Configurator/TermoCards/TermoModularCard.vue';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Конфигуратор', href: '/configurator' },
    { title: 'Для дома', href: '/configurator/termo' },
]

const store = useTermoDoorCalc()

const paints = ref(usePage().props.paints as Nomenclature[])
const doorModels = ref(usePage().props.doorModels as DoorModel[])
const filmColors = ref(usePage().props.filmColors as Nomenclature[])
const furnitures = ref(usePage().props.furnitures as Furniture[])
const locks = ref(usePage().props.locks as { primary: Nomenclature[], secondary: Nomenclature[] })
const cylinders = ref(usePage().props.cylinders as Nomenclature[])
const handles = ref(usePage().props.handles as Nomenclature[])

store.paints = paints.value
store.doorModels = doorModels.value
store.filmColors = filmColors.value
store.furnitures = furnitures.value
store.handles = handles.value
store.locks = locks.value
store.cylinders = cylinders.value
store.initializeDefaultConfig()
</script>

<template>
    <Head title="Для дома — Конфигуратор" />
    <PublicLayout>
        <div class="flex h-full max-w-7xl mx-auto flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 bg-white dark:bg-neutral-900">

            <!-- Header -->
            <div class="text-center pb-4 sm:pb-6 lg:pb-8">
                <h1 class="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-2 sm:mb-3 font-bold">Конфигуратор дверей</h1>
                <p class="font-serif text-base sm:text-lg text-black/60">
                    Создайте идеальную дверь для дома по вашему вкусу
                </p>
                <div class="flex gap-2 flex-col sm:flex-row items-center justify-center mt-4">
                    <Link href="/configurator/apartment">
                        <Button label="Для квартиры" variant="outlined" size="small" />
                    </Link>
                    <Link href="/configurator/termo">
                        <Button label="Для дома" variant="contrast" size="small" />
                    </Link>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid gap-4 lg:grid-cols-12">

                <!-- Left Column: Preview & Price -->
                <div class="lg:col-span-6 lg:sticky lg:top-4 lg:self-start space-y-4">

                    <!-- Visualization placeholder -->
                    <div class="border border-sky-900/10 rounded-3xl flex items-center justify-center min-h-72 bg-sky-900/[0.03] shadow-md shadow-sky-800/5">
                        <!-- <div class="text-center">
                            <p class="font-serif text-xs uppercase tracking-widest text-sky-900/30 mb-3">Termo</p>
                            <p class="font-serif text-lg text-sky-900/40">Визуализатор</p>
                            <p class="text-xs text-sky-900/25 font-sans mt-1">В разработке</p>
                        </div> -->
                    </div>

                    <!-- Price & actions -->
                    <div class="border border-sky-900/10 shadow-md shadow-sky-800/5 rounded-3xl p-4">
                        <div class="border-b border-sky-900/10 pb-2">
                            <p class="font-bold text-xl">
                                <span class="font-bold text-sky-900">Итого: </span>
                                <span>{{ store.total_price.toFixed(2) }} ₽</span>
                            </p>
                        </div>
                        <div class="flex gap-4 mt-4">
                            <Button label="Оформить заказ" icon="pi pi-shopping-cart" size="small" />
                            <Button label="Скачать PDF" variant="outlined" icon="pi pi-file-pdf" size="small" />
                        </div>
                    </div>
                </div>

                <!-- Right Column: Cards -->
                <div class="lg:col-span-6 space-y-4">
                    <TermoParametersCard />
                    <TermoModularCard />
                    <TermoExteriorCard />
                    <TermoInteriorCard />
                    <TermoMetalCard />
                    <TermoGlassCard />
                    <TermoFurnitureCard />
                    <TermoLockerCard />
                </div>
            </div>
        </div>
    </PublicLayout>
</template>
