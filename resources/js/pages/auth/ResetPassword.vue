<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import InputError from '@/components/InputError.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { update } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/vue3';
import { LockIcon, MailIcon } from 'lucide-vue-next';
import { Button, IconField, InputIcon, InputText } from 'primevue';
import { ref } from 'vue';

const props = defineProps<{
    token: string;
    email: string;
}>();

const inputEmail = ref(props.email);
</script>

<template>
    <Head title="Новый пароль" />
    <PublicLayout>
        <div class="flex flex-1 items-center justify-center py-16 px-4">
            <div class="w-full max-w-md">

                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-2xl shadow-sky-900/5 p-8 sm:p-10">

                    <div class="flex flex-col items-center gap-3 mb-8">
                        <Link href="/" class="flex items-center justify-center rounded-sm border border-black/20 bg-white size-10">
                            <AppLogoIcon class="size-6" />
                        </Link>
                        <div class="text-center">
                            <h1 class="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-black mb-1">Новый пароль</h1>
                            <p class="font-serif text-sm text-black/50">Придумайте надёжный пароль для вашего аккаунта</p>
                        </div>
                    </div>

                    <Form
                        v-bind="update.form()"
                        :transform="(data) => ({ ...data, token, email })"
                        :reset-on-success="['password', 'password_confirmation']"
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
                                    autocomplete="email"
                                    v-model="inputEmail"
                                    readonly
                                    class="w-full opacity-60"
                                />
                            </IconField>
                            <InputError :message="errors.email" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="password" class="text-sm font-serif font-medium text-black/70">Новый пароль</label>
                            <IconField>
                                <InputIcon>
                                    <LockIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="password"
                                    type="password"
                                    name="password"
                                    autocomplete="new-password"
                                    autofocus
                                    placeholder="Новый пароль"
                                    class="w-full"
                                />
                            </IconField>
                            <InputError :message="errors.password" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="password_confirmation" class="text-sm font-serif font-medium text-black/70">Подтверждение пароля</label>
                            <IconField>
                                <InputIcon>
                                    <LockIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autocomplete="new-password"
                                    placeholder="Повторите пароль"
                                    class="w-full"
                                />
                            </IconField>
                            <InputError :message="errors.password_confirmation" />
                        </div>

                        <Button
                            type="submit"
                            label="Сохранить пароль"
                            :loading="processing"
                            :disabled="processing"
                            icon="pi pi-check"
                            icon-pos="right"
                            class="mt-2 w-full"
                            data-test="reset-password-button"
                        />
                    </Form>

                </div>
            </div>
        </div>
    </PublicLayout>
</template>
