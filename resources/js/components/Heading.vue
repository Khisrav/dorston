<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
}

defineProps<Props>();
</script>

<template>
    <div class="mb-10 space-y-2 text-center border-b border-black/10 pb-8">
        <h2 class="font-serif text-3xl tracking-tight text-black">{{ title }}</h2>
        <p v-if="description" class="font-serif text-base text-black/60">
            {{ description }}
        </p>
    </div>
</template>

<style scoped>
</style>
