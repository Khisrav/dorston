<script setup lang="ts">
defineProps<{
    message?: string;
}>();
</script>

<template>
    <div v-show="message">
        <p class="font-serif text-sm text-red-700 tracking-wide">
            {{ message }}
        </p>
    </div>
</template>

<style scoped>
</style>
