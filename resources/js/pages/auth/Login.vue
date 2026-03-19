<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import InputError from '@/components/InputError.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/vue3';
import { LockIcon, MailIcon } from 'lucide-vue-next';
import { Button, IconField, InputIcon, InputText } from 'primevue';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();
</script>

<template>
    <Head title="Вход" />
    <PublicLayout>
        <div class="flex flex-1 items-center justify-center py-16 px-4">
            <div class="w-full max-w-md">

                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-2xl shadow-sky-900/5 p-8 sm:p-10">

                    <div class="flex flex-col items-center gap-3 mb-8">
                        <Link href="/" class="flex items-center justify-center rounded-sm border border-black/20 bg-white size-10">
                            <AppLogoIcon class="size-6" />
                        </Link>
                        <div class="text-center">
                            <h1 class="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-black mb-1">Личный кабинет</h1>
                            <p class="font-serif text-sm text-black/50">Войдите для доступа к конфигуратору</p>
                        </div>
                    </div>

                    <div
                        v-if="status"
                        class="mb-6 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-center text-sm font-serif text-green-700"
                    >
                        {{ status }}
                    </div>

                    <Form
                        v-bind="store.form()"
                        :reset-on-success="['password']"
                        v-slot="{ errors, processing }"
                        class="flex flex-col gap-5"
                    >
                        <div class="flex flex-col gap-1.5">
                            <label for="email" class="text-sm font-serif font-medium text-black/70">Электронная почта</label>
                            <IconField>
                                <InputIcon>
                                    <MailIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autofocus
                                    :tabindex="1"
                                    autocomplete="email"
                                    placeholder="ivan@example.com"
                                    class="w-full"
                                />
                            </IconField>
                            <InputError :message="errors.email" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <div class="flex items-center justify-between">
                                <label for="password" class="text-sm font-serif font-medium text-black/70">Пароль</label>
                                <Link
                                    v-if="canResetPassword"
                                    :href="request()"
                                    class="text-xs font-serif text-black/40 hover:text-black transition-colors"
                                    :tabindex="5"
                                >
                                    Забыли пароль?
                                </Link>
                            </div>
                            <IconField>
                                <InputIcon>
                                    <LockIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    :tabindex="2"
                                    autocomplete="current-password"
                                    placeholder="Пароль"
                                    class="w-full"
                                />
                            </IconField>
                            <InputError :message="errors.password" />
                        </div>

                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                id="remember"
                                name="remember"
                                type="checkbox"
                                :tabindex="3"
                                class="size-4 rounded border-black/20 text-sky-900 focus:ring-sky-900"
                            />
                            <span class="text-sm font-serif text-black/60">Запомнить меня</span>
                        </label>

                        <Button
                            type="submit"
                            label="Войти"
                            :loading="processing"
                            :tabindex="4"
                            :disabled="processing"
                            icon="pi pi-sign-in"
                            icon-pos="right"
                            class="mt-2 w-full"
                            data-test="login-button"
                        />
                    </Form>
                </div>

            </div>
        </div>
    </PublicLayout>
</template>
