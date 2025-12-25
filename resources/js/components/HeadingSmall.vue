<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
}

defineProps<Props>();
</script>

<template>
    <header class="border-l-2 border-black pl-4 mb-6">
        <h3 class="mb-2 font-serif text-xl tracking-wide text-black">{{ title }}</h3>
        <p v-if="description" class="font-serif text-sm text-black/60 leading-relaxed">
            {{ description }}
        </p>
    </header>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
</style>
