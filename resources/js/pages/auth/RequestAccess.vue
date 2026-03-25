<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';
import { ref } from 'vue';
import { lead as bitrixLead } from '@/routes/bitrix24';
import { Button, IconField, InputIcon, InputText } from 'primevue';
import { MailIcon, PhoneIcon, UserIcon } from 'lucide-vue-next';

const form = ref({
    name: '',
    phone: '',
    email: '',
});

const isSubmitting = ref(false);
const submitError = ref('');
const submitSuccess = ref('');

async function submit() {
    if (isSubmitting.value) return;

    submitError.value = '';
    submitSuccess.value = '';

    const name = form.value.name.trim();
    const phone = form.value.phone.trim();
    const email = form.value.email.trim();

    if (!name || !phone || !email) {
        submitError.value = 'Пожалуйста, заполните все поля.';
        return;
    }

    isSubmitting.value = true;
    try {
        await axios.post(bitrixLead.url(), {
            name,
            phone,
            email,
            title: 'Заявка на регистрацию',
        });

        submitSuccess.value = 'Спасибо! Заявка отправлена.';
        form.value.name = '';
        form.value.phone = '';
        form.value.email = '';
    } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            'Не удалось отправить заявку. Попробуйте ещё раз позже.';
        submitError.value = message;
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <Head title="Запрос доступа" />
    <PublicLayout>
        <div class="flex flex-1 items-center justify-center py-16 px-4">
            <div class="w-full max-w-md">
                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-2xl shadow-sky-900/5 p-8 sm:p-10">
                    <div class="flex flex-col items-center gap-3 mb-8">
                        <Link href="/" class="flex items-center justify-center rounded-sm border border-black/20 bg-white size-10">
                            <AppLogoIcon class="size-6" />
                        </Link>
                        <div class="text-center">
                            <h1 class="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-black mb-1">
                                Заявка на регистрацию
                            </h1>
                            <p class="font-serif text-sm text-black/50">Оставьте заявку — мы свяжемся с вами</p>
                        </div>
                    </div>

                    <form class="flex flex-col gap-5" @submit.prevent="submit">
                        <div class="flex flex-col gap-1.5">
                            <label for="name" class="text-sm font-serif font-medium text-black/70">Имя</label>
                            <IconField>
                                <InputIcon>
                                    <UserIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="name"
                                    type="text"
                                    name="name"
                                    v-model="form.name"
                                    required
                                    autofocus
                                    :disabled="isSubmitting || !!submitSuccess"
                                    :tabindex="1"
                                    autocomplete="name"
                                    placeholder="Иван Иванов"
                                    class="w-full"
                                />
                            </IconField>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label for="phone" class="text-sm font-serif font-medium text-black/70">Телефон</label>
                            <IconField>
                                <InputIcon>
                                    <PhoneIcon class="size-4" />
                                </InputIcon>
                                <InputText
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    v-model="form.phone"
                                    required
                                    :disabled="isSubmitting || !!submitSuccess"
                                    :tabindex="2"
                                    autocomplete="tel"
                                    placeholder="+7 (___) ___-__-__"
                                    class="w-full"
                                />
                            </IconField>
                        </div>

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
                                    v-model="form.email"
                                    required
                                    :disabled="isSubmitting || !!submitSuccess"
                                    :tabindex="3"
                                    autocomplete="email"
                                    placeholder="ivan@example.com"
                                    class="w-full"
                                />
                            </IconField>
                        </div>

                        <Button
                            type="submit"
                            label="Отправить заявку"
                            :loading="isSubmitting"
                            :tabindex="4"
                            :disabled="isSubmitting || !!submitSuccess"
                            icon="pi pi-paper-plane"
                            icon-pos="right"
                            class="mt-2 w-full"
                            data-test="request-access-submit"
                        />

                        <p v-if="submitError" class="text-center font-serif text-sm text-red-600">
                            {{ submitError }}
                        </p>
                        <p v-if="submitSuccess" class="text-center font-serif text-sm text-emerald-600">
                            {{ submitSuccess }}
                        </p>

                        <p class="text-center text-xs text-black/40">Нажимая кнопку, вы соглашаетесь с <a href="dorston.ru/politics" class="text-sky-900">политикой конфиденциальности</a> и обработкой персональных данных</p>
                    </form>
                </div>
            </div>
        </div>
    </PublicLayout>
</template>

