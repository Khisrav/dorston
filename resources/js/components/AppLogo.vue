<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-none border border-black/20 dark:border-white/20 bg-white dark:bg-neutral-950"
    >
        <AppLogoIcon class="size-5 fill-current text-black dark:text-white" />
    </div>
    <div class="ml-2 grid flex-1 text-left text-sm">
        <span class="mb-0.5 truncate leading-tight font-serif tracking-wide font-medium text-black dark:text-white"
            >Dorston</span
        >
    </div>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
</style>
