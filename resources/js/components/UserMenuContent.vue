<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';
import { Link, router } from '@inertiajs/vue3';
import { LogOut, Settings } from 'lucide-vue-next';

interface Props {
    user: User;
}

const handleLogout = () => {
    router.flushAll();
};

defineProps<Props>();
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal elegant-menu-label">
        <div class="flex items-center gap-2 px-3 py-3 text-left text-sm border-b border-black/10 dark:border-white/10">
            <UserInfo :user="user" :show-email="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuGroup class="elegant-menu-group">
        <DropdownMenuItem :as-child="true" class="elegant-menu-item">
            <Link class="block w-full font-serif tracking-wide text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-3 py-2" :href="edit()" prefetch as="button">
                <Settings class="mr-3 h-4 w-4" />
                <span>Настройки</span>
            </Link>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <div class="h-px bg-black/10 dark:bg-white/10 my-1"></div>
    <DropdownMenuItem :as-child="true" class="elegant-menu-item">
        <Link
            class="block w-full font-serif tracking-wide text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors px-3 py-2"
            :href="logout()"
            @click="handleLogout"
            as="button"
            data-test="logout-button"
        >
            <LogOut class="mr-3 h-4 w-4" />
            <span>Выйти</span>
        </Link>
    </DropdownMenuItem>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-menu-label),
:deep(.elegant-menu-group),
:deep(.elegant-menu-item) {
    font-family: 'Playfair Display', serif;
}

:deep(.elegant-menu-item) {
    border-radius: 0;
}
</style>
