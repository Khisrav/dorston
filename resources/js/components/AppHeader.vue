<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { Link, router, usePage } from '@inertiajs/vue3';
import { ChevronDown, ChevronRight, ExternalLink, LogOutIcon, Menu, SettingsIcon, UserIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const settingsUrl = editProfile().url;

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
    type: 'link';
    title: string;
    href: string;
    /** If true, renders as <a target="_blank"> instead of an Inertia <Link> */
    external?: boolean;
    /** Override the URL prefix used for active-state matching */
    activeMatch?: string;
}

interface NavDropdown {
    type: 'dropdown';
    title: string;
    children: {
        title: string;
        description?: string;
        href: string;
    }[];
}

type NavItem = NavLink | NavDropdown;

// ─── Navigation definition ────────────────────────────────────────────────────

const navItems: NavItem[] = [
    {
        type: 'link',
        title: 'Главная',
        href: 'https://dorston.ru/',
    },
    {
        type: 'link',
        title: 'Конфигуратор',
        href: 'https://config.dorston.ru/',
    },
    {
        type: 'dropdown',
        title: 'Каталог',
        children: [
            {
                title: 'COMFORT',
                description: 'Входные квартирные двери',
                href: 'https://dorston.ru/comfortmp',
            },
            {
                title: 'COMFORT',
                description: 'Входные квартирные двери с внешней панелью',
                href: 'https://dorston.ru/comfortpp',
            },
            {
                title: 'MONOLIT',
                description: 'Квартирные двери с широким наличником',
                href: 'https://dorston.ru/monolit',
            },
            {
                title: 'MONOLIT LIGHT',
                description: 'Квартирные двери',
                href: 'https://dorston.ru/monolitlight',
            },
            {
                title: 'ABSOLUT',
                description: 'Входные квартирные двери',
                href: 'https://dorston.ru/absolutmp',
            },
            {
                title: 'ABSOLUT',
                description: 'Входные квартирные двери с панелью',
                href: 'https://dorston.ru/absolutpp',
            },
            {
                title: 'ECOTERM',
                description: 'Уличные двери с терморазрывом',
                href: 'https://dorston.ru/ecoterm',
            },
            {
                title: 'TERMO+',
                description: 'Улучшенные двери для домов',
                href: 'https://dorston.ru/termoplus',
            },
            {
                title: 'TERMO PREMIUM',
                description: 'Уличные двери для c наружной панелью',
                href: 'https://dorston.ru/hpl',
            },
        ],
    },
    {
        type: 'link',
        title: 'Где купить',
        href: 'https://dorston.ru/maps',
    },
    {
        type: 'link',
        title: 'Партнерам',
        href: 'https://dorston.ru/cooperation',
    },
    {
        type: 'link',
        title: 'Объекты',
        href: 'https://dorston.ru/works',
    },
    {
        type: 'link',
        title: 'Видеообзоры',
        href: 'https://dorston.ru/video',
    },
    {
        type: 'link',
        title: 'Контакты',
        href: 'https://dorston.ru/contacts',
    },
];

// ─── Auth ─────────────────────────────────────────────────────────────────────

const page = usePage();

const user = computed(() => page.props.auth?.user ?? null);

function signOut() {
    router.post(logout().url);
}

// ─── Active state ─────────────────────────────────────────────────────────────

const mobileMenuOpen = ref(false);
const openDropdowns = ref<Set<string>>(new Set());

const toggleDropdown = (title: string) => {
    if (openDropdowns.value.has(title)) {
        openDropdowns.value.delete(title);
    } else {
        openDropdowns.value.add(title);
    }
};

const isActive = (href: string) =>
    page.url === href || page.url.startsWith(href + '/');

const isDropdownActive = (item: NavDropdown) =>
    item.children.some((child) => isActive(child.href));

const linkActiveClass = (href: string) =>
    isActive(href)
        ? 'text-black bg-black/5'
        : 'text-black/60 hover:text-black hover:bg-black/5';
</script>

<template>
    <header class="sticky md:static top-0 z-50 border-b border-black/5 bg-white">
        <div class="mx-auto flex h-16 max-w-7xl items-center px-4 lg:px-6">

            <!-- Logo -->
            <Link href="/" class="mr-8 flex shrink-0 items-center gap-2.5">
                <div class="flex size-8 items-center rounded-sm justify-center border border-black/20 bg-white">
                    <AppLogoIcon class="size-5" />
                </div>
                <span class="font-serif text-sm font-medium tracking-widest text-black">
                    DORSTON
                </span>
            </Link>

            <!-- ── Desktop Navigation ────────────────────────────────────── -->
            <nav class="hidden flex-1 items-center lg:flex">
                <NavigationMenu>
                    <NavigationMenuList class="gap-1">
                        <template v-for="item in navItems" :key="item.title">

                            <!-- Simple link -->
                            <NavigationMenuItem v-if="item.type === 'link'">
                                <a
                                    v-if="item.external"
                                    :href="item.href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :class="[
                                        navigationMenuTriggerStyle(),
                                        'font-serif tracking-wide text-sm transition-colors',
                                        'text-black/60 hover:text-black hover:bg-black/5',
                                    ]"
                                >
                                    {{ item.title }}
                                    <ExternalLink class="ml-1.5 size-3 opacity-60" />
                                </a>
                                <a
                                    v-else
                                    :href="item.href"
                                    :class="[
                                        navigationMenuTriggerStyle(),
                                        'font-serif tracking-wide text-sm transition-colors',
                                        linkActiveClass(item.activeMatch ?? item.href),
                                    ]"
                                >
                                    {{ item.title }}
                                </a>
                            </NavigationMenuItem>

                            <!-- Dropdown -->
                            <NavigationMenuItem v-else-if="item.type === 'dropdown'">
                                <NavigationMenuTrigger
                                    :class="[
                                        'font-serif tracking-wide text-sm transition-colors',
                                        isDropdownActive(item)
                                            ? 'text-black bg-black/5'
                                            : 'text-black/60 hover:text-black',
                                    ]"
                                >
                                    {{ item.title }}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul class=" w-[600px] grid grid-cols-2 gap-2">
                                        <li v-for="child in item.children" :key="child.href">
                                            <a
                                                :href="child.href"
                                                :class="[
                                                    'group flex flex-col gap-0.5 rounded-md px-3 py-2.5 text-sm transition-colors',
                                                    isActive(child.href)
                                                        ? 'bg-black/5'
                                                        : 'hover:bg-black/5',
                                                ]"
                                            >
                                                <span class="flex items-center justify-between font-serif font-medium text-black">
                                                    {{ child.title }}
                                                    <ChevronRight class="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                                                </span>
                                                <span v-if="child.description" class="text-xs leading-snug text-black/50">
                                                    {{ child.description }}
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                        </template>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>

            <!-- ── Desktop right: user button ───────────────────────────── -->
            <div class="ml-auto hidden items-center gap-2 lg:flex">
                <!-- Logged in: dropdown with user info -->
                <DropdownMenu v-if="user">
                    <DropdownMenuTrigger as-child>
                        <button
                            class="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-serif text-black/70 transition-colors hover:border-black/20 hover:text-black"
                        >
                            <div class="flex size-6 items-center justify-center rounded-full bg-sky-900 text-white">
                                <UserIcon class="size-3.5" />
                            </div>
                            <span class="max-w-[120px] truncate">{{ user.name }}</span>
                            <ChevronDown class="size-3.5 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-56">
                        <DropdownMenuLabel class="font-normal">
                            <p class="font-serif font-medium text-black">{{ user.name }}</p>
                            <p class="mt-0.5 truncate text-xs text-black/50 font-serif">{{ user.email }}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem as-child>
                            <Link :href="settingsUrl" class="flex cursor-pointer items-center gap-2 font-serif text-sm">
                                <SettingsIcon class="size-4 opacity-60" />
                                Настройки
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 font-serif text-sm text-red-600 focus:text-red-600"
                            @click="signOut"
                        >
                            <LogOutIcon class="size-4 opacity-70" />
                            Выйти
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <!-- Not logged in: login link -->
                <Link
                    v-else
                    href="/login"
                    class="flex items-center gap-1.5 rounded-full border border-sky-900/20 bg-sky-900 px-4 py-1.5 text-sm font-serif text-white transition-colors hover:bg-sky-800"
                >
                    <UserIcon class="size-3.5" />
                    Войти
                </Link>
            </div>

            <!-- ── Mobile hamburger ──────────────────────────────────────── -->
            <div class="ml-auto lg:hidden">
                <Sheet v-model:open="mobileMenuOpen" @update:open="(v) => { if (!v) openDropdowns.clear() }">
                    <SheetTrigger as-child>
                        <Button variant="ghost" size="icon" class="h-9 w-9">
                            <Menu class="size-5" />
                            <span class="sr-only">Открыть меню</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" class="flex w-72 flex-col p-0">
                        <SheetTitle class="sr-only">Навигация</SheetTitle>

                        <!-- Mobile logo -->
                        <div class="flex shrink-0 items-center gap-2.5 border-b border-black/10 px-5 py-4">
                            <div class="flex size-8 items-center justify-center border border-black/20 dark:border-white/20">
                                <AppLogoIcon class="size-5" />
                            </div>
                            <span class="font-serif text-sm font-medium tracking-widest text-black">
                                DORSTON
                            </span>
                        </div>

                        <nav class="flex flex-col gap-1 overflow-y-auto px-3 py-4">
                            <template v-for="item in navItems" :key="item.title">

                                <!-- Simple link -->
                                <template v-if="item.type === 'link'">
                                    <a
                                        v-if="item.external"
                                        :href="item.href"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-serif tracking-wide text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                                        @click="mobileMenuOpen = false"
                                    >
                                        {{ item.title }}
                                        <ExternalLink class="size-3.5 opacity-60" />
                                    </a>
                                    <a
                                        v-else
                                        :href="item.href"
                                        class="flex items-center rounded-md px-3 py-2.5 text-sm font-serif tracking-wide transition-colors"
                                        :class="linkActiveClass(item.activeMatch ?? item.href)"
                                        @click="mobileMenuOpen = false"
                                    >
                                        {{ item.title }}
                                    </a>
                                </template>

                                <!-- Dropdown — collapsible sub-list -->
                                <div v-else-if="item.type === 'dropdown'" class="mt-1">
                                    <button
                                        type="button"
                                        class="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-serif tracking-wide transition-colors"
                                        :class="
                                            isDropdownActive(item)
                                                ? 'text-black'
                                                : 'text-black/60 hover:text-black hover:bg-black/5'
                                        "
                                        @click="toggleDropdown(item.title)"
                                    >
                                        {{ item.title }}
                                        <ChevronDown
                                            class="size-3.5 opacity-50 transition-transform duration-200"
                                            :class="openDropdowns.has(item.title) ? 'rotate-180' : ''"
                                        />
                                    </button>
                                    <div
                                        v-show="openDropdowns.has(item.title)"
                                        class="mt-0.5 flex flex-col gap-0.5 pl-3"
                                    >
                                        <a
                                            v-for="child in item.children"
                                            :key="child.href"
                                            :href="child.href"
                                            class="flex items-center justify-between rounded-md px-3 py-2 text-sm font-serif tracking-wide transition-colors"
                                            :class="linkActiveClass(child.href)"
                                            @click="mobileMenuOpen = false"
                                        >
                                            {{ child.title }}
                                            <ChevronRight class="size-3.5 opacity-40" />
                                        </a>
                                    </div>
                                </div>

                            </template>
                        </nav>

                        <!-- ── Mobile: user section at bottom ──────────── -->
                        <div class="mt-auto border-t border-black/10">
                            <!-- Logged in -->
                            <div v-if="user" class="px-3 py-4 space-y-1">
                                <div class="flex items-center gap-3 px-3 py-2">
                                    <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-900 text-white">
                                        <UserIcon class="size-4" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="truncate text-sm font-serif font-medium text-black">{{ user.name }}</p>
                                        <p class="truncate text-xs font-serif text-black/50">{{ user.email }}</p>
                                    </div>
                                </div>
                                <Link
                                    :href="settingsUrl"
                                    class="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-serif tracking-wide text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                                    @click="mobileMenuOpen = false"
                                >
                                    <SettingsIcon class="size-4 opacity-60" />
                                    Настройки
                                </Link>
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-serif tracking-wide text-red-600 transition-colors hover:bg-red-50"
                                    @click="() => { mobileMenuOpen = false; signOut(); }"
                                >
                                    <LogOutIcon class="size-4 opacity-70" />
                                    Выйти
                                </button>
                            </div>

                            <!-- Not logged in -->
                            <div v-else class="px-3 py-4">
                                <Link
                                    href="/login"
                                    class="flex items-center justify-center gap-2 rounded-2xl bg-sky-900 px-4 py-2.5 text-sm font-serif text-white transition-colors hover:bg-sky-800"
                                    @click="mobileMenuOpen = false"
                                >
                                    <UserIcon class="size-4" />
                                    Войти в кабинет
                                </Link>
                            </div>
                        </div>

                    </SheetContent>
                </Sheet>
            </div>

        </div>
    </header>
</template>
