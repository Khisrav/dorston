<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { disable, enable, show } from '@/routes/two-factor';
import { BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/vue3';
import { ShieldBan, ShieldCheck } from 'lucide-vue-next';
import { onUnmounted, ref } from 'vue';

interface Props {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Двухфакторная аутентификация',
        href: show.url(),
    },
];

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => {
    clearTwoFactorAuthData();
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Двухфакторная аутентификация" />
        <SettingsLayout>
            <div class="space-y-8">
                <HeadingSmall
                    title="Двухфакторная аутентификация"
                    description="Управление настройками двухфакторной аутентификации"
                />

                <div
                    v-if="!twoFactorEnabled"
                    class="flex flex-col items-start justify-start space-y-6"
                >
                    <Badge variant="destructive" class="font-serif tracking-wider px-3 py-1 rounded-none border border-red-600">Отключено</Badge>

                    <p class="font-serif text-black/70 leading-relaxed">
                        Когда вы включите двухфакторную аутентификацию, вам будет предложено ввести защищенный PIN-код при входе в систему. Этот PIN-код можно получить из приложения с поддержкой TOTP на вашем телефоне.
                    </p>

                    <div>
                        <Button
                            v-if="hasSetupData"
                            @click="showSetupModal = true"
                            class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase hover:tracking-[0.2em]"
                        >
                            <ShieldCheck class="mr-2" />Продолжить настройку
                        </Button>
                        <Form
                            v-else
                            v-bind="enable.form()"
                            @success="showSetupModal = true"
                            #default="{ processing }"
                        >
                            <Button 
                                type="submit" 
                                :disabled="processing"
                                class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase bg-black text-white border border-black hover:tracking-[0.2em]"
                            >
                                <ShieldCheck class="mr-2" />Включить 2FA</Button
                            ></Form
                        >
                    </div>
                </div>

                <div
                    v-else
                    class="flex flex-col items-start justify-start space-y-6"
                >
                    <Badge variant="default" class="font-serif tracking-wider px-3 py-1 rounded-none bg-black text-white border border-black">Включено</Badge>

                    <p class="font-serif text-black/70 leading-relaxed">
                        С включенной двухфакторной аутентификацией вам будет предложено ввести защищенный случайный PIN-код при входе в систему, который можно получить из приложения с поддержкой TOTP на вашем телефоне.
                    </p>

                    <TwoFactorRecoveryCodes />

                    <div class="relative inline">
                        <Form v-bind="disable.form()" #default="{ processing }">
                            <Button
                                variant="destructive"
                                type="submit"
                                :disabled="processing"
                                class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase rounded-none hover:tracking-[0.2em]"
                            >
                                <ShieldBan class="mr-2" />
                                Отключить 2FA
                            </Button>
                        </Form>
                    </div>
                </div>

                <TwoFactorSetupModal
                    v-model:isOpen="showSetupModal"
                    :requiresConfirmation="requiresConfirmation"
                    :twoFactorEnabled="twoFactorEnabled"
                />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-button) {
    font-family: 'Playfair Display', serif;
    border-radius: 0;
    transition: all 0.3s ease;
}
</style>
