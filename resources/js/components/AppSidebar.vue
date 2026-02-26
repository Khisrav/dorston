<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';
import { LockIcon, ScrollTextIcon, WrenchIcon } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const mainNavItems: NavItem[] = [
    {
        title: 'Конфигуратор',
        href: '/configurator',
        icon: WrenchIcon,
    },
    {
        title: 'Заявки',
        href: '/orders',
        icon: ScrollTextIcon,
    }
];

const footerNavItems: NavItem[] = [];

//if signed in then show admin link
if (usePage().props.auth.user) {
    footerNavItems.push({
        title: 'Админ панель',
        href: '/admin',
        icon: LockIcon,
    });
}
</script>

<template>
    <Sidebar collapsible="icon" variant="inset" class="elegant-sidebar border-r border-black/10 dark:border-white/5">
        <SidebarHeader class="border-b border-black/10 dark:border-white/10">
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link href="/" class="flex items-center justify-center">
                            <AppLogo class="elegant-logo" />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent class="bg-white dark:bg-neutral-950 elegant-content">
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="border-t border-black/10 dark:border-white/10 pt-4 elegant-footer">
            <NavFooter :items="footerNavItems" />
            <NavUser />
            <!-- THEME SWITCHER -->
            <ThemeSwitcher />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-sidebar) {
    background: none;
    font-family: 'Playfair Display', serif;
}

:deep(.dark .elegant-sidebar) {
    background: rgb(10 10 10);
}

:deep(.elegant-logo) {
    font-family: 'Playfair Display', serif;
}
</style>
