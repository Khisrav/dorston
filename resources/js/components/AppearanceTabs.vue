<script setup lang="ts">
import { useAppearance } from '@/composables/useAppearance';
import { Monitor, Moon, Sun } from 'lucide-vue-next';

const { appearance, updateAppearance } = useAppearance();

const tabs = [
    { value: 'light', Icon: Sun, label: 'Светлая' },
    { value: 'dark', Icon: Moon, label: 'Темная' },
    { value: 'system', Icon: Monitor, label: 'Системная' },
] as const;
</script>

<template>
    <div
        class="inline-flex gap-2 border border-black/20 p-1 bg-white"
    >
        <button
            v-for="{ value, Icon, label } in tabs"
            :key="value"
            @click="updateAppearance(value)"
            :class="[
                'elegant-tab-button flex items-center px-6 py-3 transition-all duration-300 font-serif text-sm tracking-wide',
                appearance === value
                    ? 'bg-black text-white'
                    : 'text-black/70 hover:bg-black/5 hover:text-black',
            ]"
        >
            <component :is="Icon" class="-ml-1 h-4 w-4" />
            <span class="ml-2">{{ label }}</span>
        </button>
    </div>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

.elegant-tab-button {
    font-family: 'Playfair Display', serif;
    border-radius: 0;
}
</style>
