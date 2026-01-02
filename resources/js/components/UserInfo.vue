<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/composables/useInitials';
import type { User } from '@/types';
import { computed } from 'vue';

interface Props {
    user?: User | null;
    showEmail?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showEmail: false,
    user: null,
});

const { getInitials } = useInitials();

// Compute whether we should show the avatar image
const showAvatar = computed(
    () => !!props.user && props.user.avatar && props.user.avatar !== '',
);

const hasUser = computed(() => !!props.user);
</script>

<template>
    <template v-if="hasUser">
        <Avatar class="h-8 w-8 overflow-hidden rounded-none border border-black/20 dark:border-white/20">
            <AvatarImage v-if="showAvatar" :src="user!.avatar!" :alt="user!.name" />
            <AvatarFallback class="rounded-none text-black dark:text-white bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/10 font-serif">
                {{ getInitials(user!.name) }}
            </AvatarFallback>
        </Avatar>

        <div class="grid flex-1 text-left text-sm leading-tight font-serif">
            <span class="truncate font-medium tracking-wide text-black dark:text-white/50">{{ user!.name }}</span>
            <span v-if="showEmail" class="truncate text-xs text-black/50 dark:text-white/50 tracking-wide">{{
                user!.email
            }}</span>
        </div>
    </template>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
</style>
