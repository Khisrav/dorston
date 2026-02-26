<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
    },
]

const options = [
    {
        title: 'Для квартиры',
        subtitle: 'Конструктивы Absolut и Comfort',
        href: '/configurator/apartment',
        tags: ['Absolut', 'Comfort'],
    },
    {
        title: 'Для дома',
        subtitle: 'Конструктив Termo',
        href: '/configurator/termo',
        tags: ['Termo'],
        comingSoon: true,
    },
]
</script>

<template>
    <Head title="Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4 sm:p-8 lg:p-12 bg-white dark:bg-neutral-900">

            <div class="text-center">
                <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black dark:text-white mb-3">
                    Конфигуратор <span class="italic">дверей</span>
                </h1>
                <p class="font-serif text-base sm:text-lg text-black/50 dark:text-white/50">
                    Выберите тип двери для начала
                </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
                <component
                    v-for="option in options"
                    :key="option.href"
                    :is="option.comingSoon ? 'div' : Link"
                    :href="option.comingSoon ? undefined : option.href"
                    :class="[
                        'group relative flex flex-col gap-4 p-6 sm:p-8 border-2 transition-all duration-300',
                        option.comingSoon
                            ? 'border-black/10 dark:border-white/10 opacity-60 cursor-not-allowed'
                            : 'border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white cursor-pointer'
                    ]">

                    <div v-if="option.comingSoon"
                        class="absolute top-3 right-3 text-[10px] uppercase tracking-widest font-sans text-black/40 dark:text-white/40 border border-black/20 dark:border-white/20 px-2 py-0.5">
                        Скоро
                    </div>

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

                    <div v-if="!option.comingSoon"
                        class="flex items-center gap-1.5 text-sm font-sans text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                        <span>Перейти</span>
                        <i class="pi pi-arrow-right text-xs"></i>
                    </div>
                </component>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1, h2 {
    font-family: 'Playfair Display', serif;
}
</style>
