<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';
import { Button } from 'primevue';

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
        image: '/assets/ui/configurator-apartment.jpg',
    },
    {
        title: 'Для дома',
        subtitle: 'Конструктив Termo',
        href: '/configurator/termo',
        tags: ['Termo'],
        image: '/assets/ui/configurator-termo.jpg',
    },
]
</script>

<template>
    <Head title="Конфигуратор" />
    <PublicLayout>
        <div class="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4 sm:p-8 lg:p-12 bg-white dark:bg-neutral-900">
            <div class="flex flex-col items-center gap-8 w-full">
                <div class="text-center">
                    <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black dark:text-white mb-3">
                        Конфигуратор дверей
                    </h1>
                    <p class="font-serif text-base sm:text-lg text-black/50 dark:text-white/50">Настройте дизайн, цвет и фурнитуру за несколько шагов. Конфигуратор рассчитает цену автоматически.</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl">
                    <Link
                        v-for="option in options"
                        :key="option.href"
                        :href="option.href"
                        class="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-0 overflow-hidden border rounded-3xl border-sky-950/25 dark:border-white/10 hover:border-black dark:hover:border-white cursor-pointer transition-all duration-300">
                        <div class="col-span-6 relative">
                            <div class="md:absolute bottom-0 p-6 sm:p-8">
                                <div class="space-y-4">
                                    <h2 class="text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1">
                                        {{ option.title }}
                                    </h2>
                                    <p class="text-sm text-black/50 dark:text-white/50">
                                        Конструктивы:
                                    </p>
                                </div>
                                <div class="flex flex-wrap gap-2 mb-4 mt-2">
                                    <Badge
                                        v-for="tag in option.tags"
                                        :key="tag"
                                        :label="tag"
                                        severity="secondary">
                                        {{ tag }}
                                    </Badge>
                                </div>
                                <Button label="Перейти" size="small" icon="pi pi-arrow-right" icon-pos="right" />
                            </div>
                        </div>
                        <div class="col-span-6">
                            <img :src="option.image" alt="Для квартиры" class="w-full">
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </PublicLayout>
</template>

<style scoped>
h1, h2 {
    font-family: 'Google Sans', sans-serif;
    font-weight: bold;
}
</style>
