<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toUrl, urlIsActive } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/vue3';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Профиль',
        href: editProfile(),
    },
    {
        title: 'Пароль',
        href: editPassword(),
    },
    // {
    //     title: 'Двухфакторная аутентификация',
    //     href: show(),
    // },
    {
        title: 'Внешний вид',
        href: editAppearance(),
    },
];

const currentPath = typeof window !== undefined ? window.location.pathname : '';
</script>

<template>
    <div class="px-4 py-8 bg-white">
        <Heading
            title="Настройки"
            description="Управление профилем и настройками аккаунта"
        />

        <div class="flex flex-col lg:flex-row lg:space-x-16">
            <aside class="w-full max-w-xl lg:w-56">
                <nav class="flex flex-col space-y-2 space-x-0">
                    <Button
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        variant="ghost"
                        :class="[
                            'elegant-nav-button w-full justify-start font-serif tracking-wide transition-all duration-300',
                            urlIsActive(item.href, currentPath) 
                                ? 'bg-black text-white hover:bg-black' 
                                : 'text-black/70 hover:bg-black/5 hover:text-black',
                        ]"
                        as-child
                    >
                        <Link :href="item.href">
                            <component :is="item.icon" class="h-4 w-4 mr-2" />
                            {{ item.title }}
                        </Link>
                    </Button>
                </nav>
            </aside>

            <div class="h-px bg-black/10 my-8 lg:hidden" />

            <div class="flex-1 md:max-w-3xl">
                <section class="max-w-2xl space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-nav-button) {
    font-family: 'Playfair Display', serif;
    border-radius: 0;
}
</style>
