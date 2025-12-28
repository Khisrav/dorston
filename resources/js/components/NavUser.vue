<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/vue3';
import { ChevronsUpDown } from 'lucide-vue-next';
import UserMenuContent from './UserMenuContent.vue';

const page = usePage();
const user = page.props.auth.user;
const { isMobile, state } = useSidebar();
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        class="elegant-user-button border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 data-[state=open]:bg-black/5 dark:data-[state=open]:bg-white/5 data-[state=open]:border-black/20 dark:data-[state=open]:border-white/20"
                        data-test="sidebar-menu-button"
                    >
                        <UserInfo :user="user" class="elegant-user-info" />
                        <ChevronsUpDown class="ml-auto size-4 text-black/50 dark:text-white/50" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="elegant-dropdown w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-none border-black/20 dark:border-white/20"
                    :side="
                        isMobile
                            ? 'bottom'
                            : state === 'collapsed'
                              ? 'left'
                              : 'bottom'
                    "
                    align="end"
                    :side-offset="4"
                >
                    <UserMenuContent :user="user" />
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-user-button) {
    font-family: 'Playfair Display', serif;
    transition: all 0.3s ease;
    border-radius: 0;
    /* background: white; */
}

:deep(.dark .elegant-user-button) {
    background: rgb(10 10 10);
}

:deep(.elegant-user-info) {
    font-family: 'Playfair Display', serif;
}

:deep(.elegant-dropdown) {
    font-family: 'Playfair Display', serif;
    background: white;
}

:deep(.dark .elegant-dropdown) {
    background: rgb(10 10 10);
}
</style>
