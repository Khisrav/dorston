<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
    },
    {
        title: 'Для дома',
        href: '/configurator/termo',
    },
]
</script>

<template>
    <Head title="Для дома — Конфигуратор" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col items-center justify-center gap-6 p-4 sm:p-8 bg-white dark:bg-neutral-900 text-center">
            <div class="border-2 border-black/10 dark:border-white/10 p-10 sm:p-14 max-w-lg w-full">
                <p class="font-serif text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Termo</p>
                <h1 class="font-serif text-2xl sm:text-3xl text-black dark:text-white tracking-tight mb-3">
                    Для дома
                </h1>
                <p class="text-sm text-black/50 dark:text-white/50 font-sans leading-relaxed">
                    Конфигуратор уличных термодверей находится в разработке.<br>
                    Скоро будет доступен.
                </p>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1 {
    font-family: 'Playfair Display', serif;
}
</style>
