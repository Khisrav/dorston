<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from '@inertiajs/vue3';

interface BreadcrumbItemType {
    title: string;
    href?: string;
}

defineProps<{
    breadcrumbs: BreadcrumbItemType[];
}>();
</script>

<template>
    <Breadcrumb class="elegant-breadcrumb">
        <BreadcrumbList class="font-serif">
            <template v-for="(item, index) in breadcrumbs" :key="index">
                <BreadcrumbItem>
                    <template v-if="index === breadcrumbs.length - 1">
                        <BreadcrumbPage class="text-black dark:text-white tracking-wide">{{ item.title }}</BreadcrumbPage>
                    </template>
                    <template v-else>
                        <BreadcrumbLink as-child class="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors tracking-wide">
                            <Link :href="item.href ?? '#'">{{
                                item.title
                            }}</Link>
                        </BreadcrumbLink>
                    </template>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" class="text-black/30 dark:text-white/30">
                    <span class="mx-2">·</span>
                </BreadcrumbSeparator>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>

<style scoped>
</style>
