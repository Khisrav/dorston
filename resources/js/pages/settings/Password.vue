<script setup lang="ts">
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/user-password';
import { Form, Head } from '@inertiajs/vue3';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Настройки пароля',
        href: edit().url,
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Настройки пароля" />

        <SettingsLayout>
            <div class="space-y-8">
                <HeadingSmall
                    title="Обновление пароля"
                    description="Убедитесь, что ваш аккаунт использует длинный случайный пароль для безопасности"
                />

                <Form
                    v-bind="PasswordController.update.form()"
                    :options="{
                        preserveScroll: true,
                    }"
                    reset-on-success
                    :reset-on-error="[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]"
                    class="space-y-6"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="grid gap-3">
                        <Label for="current_password" class="font-serif text-sm tracking-wide text-black/70">Текущий пароль</Label>
                        <Input
                            id="current_password"
                            name="current_password"
                            type="password"
                            class="elegant-input mt-1 block w-full font-serif border-black/20 focus:border-black"
                            autocomplete="current-password"
                            placeholder="Текущий пароль"
                        />
                        <InputError :message="errors.current_password" />
                    </div>

                    <div class="grid gap-3">
                        <Label for="password" class="font-serif text-sm tracking-wide text-black/70">Новый пароль</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            class="elegant-input mt-1 block w-full font-serif border-black/20 focus:border-black"
                            autocomplete="new-password"
                            placeholder="Новый пароль"
                        />
                        <InputError :message="errors.password" />
                    </div>

                    <div class="grid gap-3">
                        <Label for="password_confirmation" class="font-serif text-sm tracking-wide text-black/70"
                            >Подтверждение пароля</Label
                        >
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            class="elegant-input mt-1 block w-full font-serif border-black/20 focus:border-black"
                            autocomplete="new-password"
                            placeholder="Подтвердите пароль"
                        />
                        <InputError :message="errors.password_confirmation" />
                    </div>

                    <div class="flex items-center gap-6 pt-2">
                        <Button
                            :disabled="processing"
                            data-test="update-password-button"
                            class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase text-white bg-black border border-black hover:tracking-[0.2em]"
                            >Сохранить пароль</Button
                        >

                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p
                                v-show="recentlySuccessful"
                                class="text-sm font-serif text-black/60"
                            >
                                Сохранено.
                            </p>
                        </Transition>
                    </div>
                </Form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-input) {
    font-family: 'Playfair Display', serif;
    border-radius: 0;
}

:deep(.elegant-button) {
    font-family: 'Playfair Display', serif;
    border-radius: 0;
    transition: all 0.3s ease;
}
</style>
