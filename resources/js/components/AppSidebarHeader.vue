<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItemType } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItemType[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);
</script>

<template>
    <header
        class="elegant-header flex shrink-0 items-center gap-2 border-b border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
    >
        <div class="flex items-center gap-4">
            <!-- <SidebarTrigger class="-ml-1 elegant-trigger" /> -->
            
            <!-- Decorative divider -->
            <!-- <div v-if="breadcrumbs && breadcrumbs.length > 0" class="h-6 w-px bg-black/10 dark:bg-white/10"></div> -->
            
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>
    </header>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

.elegant-header {
    font-family: 'Playfair Display', serif;
    /* padding-bottom: 18px;
    padding-top: 18px; */
    padding-top: 22px;
    padding-bottom: 22px;
}

:deep(.elegant-trigger) {
    color: black;
    transition: all 0.3s ease;
}

:deep(.dark .elegant-trigger) {
    color: white;
}

:deep(.elegant-trigger:hover) {
    background-color: rgba(0, 0, 0, 0.05);
}

:deep(.dark .elegant-trigger:hover) {
    background-color: rgba(255, 255, 255, 0.05);
}
</style>
