<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
    },
]

const termoExpanded = ref(false);

const mainOptions = [
    {
        title: 'Для квартиры',
        subtitle: 'Конструктивы Absolut и Comfort',
        href: '/configurator/apartment',
        tags: ['Absolut', 'Comfort'],
    },
]

const termoSubOptions = [
    {
        title: 'Немодульная',
        subtitle: 'Стандартная конструкция без боковых модулей',
        href: '/configurator/termo',
        tags: ['Termo'],
    },
    {
        title: 'Модульная',
        subtitle: 'С боковыми и верхними пристенными модулями',
        href: '/configurator/termo/modular',
        tags: ['Termo', 'Modular'],
    },
]
</script>

<template>
    <Head title="Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4 sm:p-8 lg:p-12 bg-white dark:bg-neutral-900">

            <Transition name="fade" mode="out-in">

                <!-- Main options -->
                <div v-if="!termoExpanded" key="main" class="flex flex-col items-center gap-8 w-full">
                    <div class="text-center">
                        <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black dark:text-white mb-3">
                            Конфигуратор <span class="italic">дверей</span>
                        </h1>
                        <p class="font-serif text-base sm:text-lg text-black/50 dark:text-white/50">
                            Выберите тип двери для начала
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                        <!-- Apartment option -->
                        <Link
                            v-for="option in mainOptions"
                            :key="option.href"
                            :href="option.href"
                            class="group relative flex flex-col gap-4 p-6 sm:p-8 border-2 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white cursor-pointer transition-all duration-300">
                            <div>
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1">
                                    {{ option.title }}
                                </h2>
                                <p class="text-sm text-black/50 dark:text-white/50 font-sans">
                                    {{ option.subtitle }}
                                </p>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-auto">
                                <span
                                    v-for="tag in option.tags"
                                    :key="tag"
                                    class="text-xs uppercase tracking-widest font-sans px-2 py-1 border border-black/15 dark:border-white/15 text-black/50 dark:text-white/50">
                                    {{ tag }}
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 text-sm font-sans text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                <span>Перейти</span>
                                <i class="pi pi-arrow-right text-xs"></i>
                            </div>
                        </Link>

                        <!-- Termo option -->
                        <button
                            @click="termoExpanded = true"
                            class="group relative flex flex-col gap-4 p-6 sm:p-8 border-2 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white cursor-pointer transition-all duration-300 text-left">
                            <div>
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1">
                                    Для дома
                                </h2>
                                <p class="text-sm text-black/50 dark:text-white/50 font-sans">
                                    Конструктив Termo
                                </p>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-auto">
                                <span class="text-xs uppercase tracking-widest font-sans px-2 py-1 border border-black/15 dark:border-white/15 text-black/50 dark:text-white/50">
                                    Termo
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 text-sm font-sans text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                <span>Выбрать</span>
                                <i class="pi pi-arrow-right text-xs"></i>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Termo sub-options -->
                <div v-else key="termo" class="flex flex-col items-center gap-8 w-full">
                    <div class="text-center">
                        <p class="font-serif text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">Termo — Для дома</p>
                        <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black dark:text-white mb-3">
                            Тип <span class="italic">конструкции</span>
                        </h1>
                        <p class="font-serif text-base sm:text-lg text-black/50 dark:text-white/50">
                            Выберите модульную или немодульную дверь
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                        <Link
                            v-for="option in termoSubOptions"
                            :key="option.href"
                            :href="option.href"
                            class="group relative flex flex-col gap-4 p-6 sm:p-8 border-2 border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white cursor-pointer transition-all duration-300">
                            <div>
                                <h2 class="font-serif text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1">
                                    {{ option.title }}
                                </h2>
                                <p class="text-sm text-black/50 dark:text-white/50 font-sans">
                                    {{ option.subtitle }}
                                </p>
                            </div>
                            <div class="flex flex-wrap gap-2 mt-auto">
                                <span
                                    v-for="tag in option.tags"
                                    :key="tag"
                                    class="text-xs uppercase tracking-widest font-sans px-2 py-1 border border-black/15 dark:border-white/15 text-black/50 dark:text-white/50">
                                    {{ tag }}
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 text-sm font-sans text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                                <span>Перейти</span>
                                <i class="pi pi-arrow-right text-xs"></i>
                            </div>
                        </Link>
                    </div>

                    <button
                        @click="termoExpanded = false"
                        class="flex items-center gap-1.5 text-sm font-sans text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors duration-300">
                        <i class="pi pi-arrow-left text-xs"></i>
                        <span>Назад</span>
                    </button>
                </div>

            </Transition>
        </div>
    </AppLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1, h2 {
    font-family: 'Playfair Display', serif;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
    opacity: 0;
    transform: translateY(6px);
}
.fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
