<script setup lang="ts">
import { useAppearance } from '@/composables/useAppearance';
import { ComputerIcon, MoonIcon, SunIcon } from 'lucide-vue-next';

const { appearance, updateAppearance } = useAppearance();
</script>

<template>
    <div class="flex items-center justify-center w-full gap-1 border border-black/10 dark:border-white/10 p-1 rounded-none">
        <button 
            @click="updateAppearance('light')"
            class="p-2 rounded-none bg-none dark:bg-none hover:bg-black/10 dark:hover:bg-white/10 dark:text-white/70 transition-all duration-300 w-full flex items-center justify-center"
            :class="[appearance === 'light' ? 'bg-black/5 dark:bg-white/5' : 'text-black/70 hover:bg-black/5 hover:text-black']"
        >
            <SunIcon class="w-4 h-4" />
        </button>
        <button @click="updateAppearance('dark')"
            class="p-2 rounded-none bg-none dark:bg-none hover:bg-black/10 dark:hover:bg-white/10 dark:text-white/70 transition-all duration-300 w-full flex items-center justify-center"
            :class="[appearance === 'dark' ? 'bg-black/5 dark:bg-white/5' : 'text-black/70 hover:bg-black/5 hover:text-black']"
        >
            <MoonIcon class="w-4 h-4" />
        </button>
        <button @click="updateAppearance('system')"
            class="p-2 rounded-none bg-none dark:bg-none hover:bg-black/10 dark:hover:bg-white/10 dark:text-white/70 transition-all duration-300 w-full flex items-center justify-center"
            :class="[appearance === 'system' ? 'bg-black/5 dark:bg-white/5' : 'text-black/70 hover:bg-black/5 hover:text-black']"
        >
            <ComputerIcon class="w-4 h-4" />
        </button>
    </div>
</template>