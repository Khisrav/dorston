<script setup lang="ts">
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { urlIsActive } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';

defineProps<{
    items: NavItem[];
}>();

const page = usePage();
</script>

<template>
    <SidebarGroup class="px-2 py-4">
        <SidebarGroupLabel class="elegant-label text-xs tracking-[0.2em] uppercase text-black/50 dark:text-white/50 mb-3 font-serif">
            ПЛАТФОРМА
        </SidebarGroupLabel>
        <SidebarMenu class="space-y-1">
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="urlIsActive(item.href, page.url)"
                    :tooltip="item.title"
                    class="elegant-menu-button"
                    :class="[
                        urlIsActive(item.href, page.url) 
                            ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white' 
                            : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                    ]"
                >
                    <Link :href="item.href" class="flex items-center gap-3 font-serif">
                        <component :is="item.icon" class="w-4 h-4" />
                        <span class="text-sm tracking-wide">{{ item.title }}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-label) {
    font-family: 'Playfair Display', serif;
}

:deep(.elegant-menu-button) {
    font-family: 'Playfair Display', serif;
    transition: all 0.3s ease;
    border-radius: 0;
}
</style>
