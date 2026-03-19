<script setup lang="ts">
defineProps<{
    step: number
    title: string
}>()
</script>

<template>
    <div class="border border-sky-700/10 w-full rounded-3xl overflow-hidden shadow-md shadow-sky-700/5">
        <div class="px-4 md:px-6 pt-6 pb-3 flex items-center gap-3 font-bold">
            <span class="font-serif text-xl text-sky-900">Шаг {{ step }}.</span>
            <h2 class="font-serif text-xl tracking-tight text-black">{{ title }}</h2>
        </div>
        <div class="border-t border-sky-900/10 mx-4 md:mx-4"></div>
        <div class="p-4 md:p-4 pt-3 md:pt-3">
            <slot />
        </div>
    </div>
</template>
