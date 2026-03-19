<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import InputError from '@/components/InputError.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/vue3';
import { MailIcon } from 'lucide-vue-next';
import { Button, IconField, InputIcon, InputText } from 'primevue';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <Head title="Восстановление пароля" />
    <PublicLayout>
        <div class="flex flex-1 items-center justify-center py-16 px-4">
            <div class="w-full max-w-md">

                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-2xl shadow-sky-900/5 p-8 sm:p-10">

                    <div class="flex flex-col items-center gap-3 mb-8">
                        <Link href="/" class="flex items-center justify-center rounded-sm border border-black/20 bg-white size-10">
                            <AppLogoIcon class="size-6" />
                        </Link>
                        <div class="text-center">
                            <h1 class="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-black mb-1">Восстановление пароля</h1>
                            <p class="font-serif text-sm text-black/50">Укажите почту — мы отправим ссылку для сброса</p>
                        </div>
                    </div>

                    <div
                        v-if="status"
                        class="mb-6 rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-center text-sm font-serif text-green-700"
                    >
                        {{ status }}
                    </div>

                    <Form v-bind="email.form()" v-slot="{ errors, processing }" class="flex flex-col gap-5">
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
                                    autocomplete="off"
                                    autofocus
                                    placeholder="ivan@example.com"
                                    class="w-full"
                                />
                            </IconField>
                            <InputError :message="errors.email" />
                        </div>

                        <Button
                            type="submit"
                            label="Отправить ссылку"
                            :loading="processing"
                            :disabled="processing"
                            icon="pi pi-send"
                            icon-pos="right"
                            class="mt-2 w-full"
                            data-test="email-password-reset-link-button"
                        />
                    </Form>

                    <p class="mt-6 text-center text-sm font-serif text-black/40">
                        Вспомнили пароль?
                        <Link :href="login()" class="text-black/70 hover:text-black transition-colors underline underline-offset-2">
                            Войти
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    </PublicLayout>
</template>
