<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ul
    data-slot="sidebar-menu"
    data-sidebar="menu"
    :class="cn('flex w-full items-center lg:items-start lg:justify-between min-w-0 flex-col gap-1', props.class)"
  >
    <slot />
  </ul>
</template>
