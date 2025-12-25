<script setup lang="ts">
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Form, Head, Link, usePage } from '@inertiajs/vue3';

import DeleteUser from '@/components/DeleteUser.vue';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem } from '@/types';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Настройки профиля',
        href: edit().url,
    },
];

const page = usePage();
const user = page.props.auth.user;
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Настройки профиля" />

        <SettingsLayout>
            <div class="flex flex-col space-y-8">
                <HeadingSmall
                    title="Информация профиля"
                    description="Обновите ваше имя и адрес электронной почты"
                />

                <Form
                    v-bind="ProfileController.update.form()"
                    class="space-y-6"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="grid gap-3">
                        <Label for="name" class="font-serif text-sm tracking-wide text-black/70">Имя</Label>
                        <Input
                            id="name"
                            class="elegant-input mt-1 block w-full font-serif border-black/20 focus:border-black"
                            name="name"
                            :default-value="user.name"
                            required
                            autocomplete="name"
                            placeholder="Полное имя"
                        />
                        <InputError class="mt-2" :message="errors.name" />
                    </div>

                    <div class="grid gap-3">
                        <Label for="email" class="font-serif text-sm tracking-wide text-black/70">Адрес электронной почты</Label>
                        <Input
                            id="email"
                            type="email"
                            class="elegant-input mt-1 block w-full font-serif border-black/20 focus:border-black"
                            name="email"
                            :default-value="user.email"
                            required
                            autocomplete="username"
                            placeholder="Адрес электронной почты"
                        />
                        <InputError class="mt-2" :message="errors.email" />
                    </div>

                    <div v-if="mustVerifyEmail && !user.email_verified_at">
                        <p class="-mt-4 text-sm font-serif text-black/60">
                            Ваш адрес электронной почты не подтверждён.
                            <Link
                                :href="send()"
                                as="button"
                                class="text-black underline decoration-black/30 underline-offset-4 transition-colors duration-300 hover:decoration-black"
                            >
                                Нажмите здесь, чтобы отправить письмо подтверждения повторно.
                            </Link>
                        </p>

                        <div
                            v-if="status === 'verification-link-sent'"
                            class="mt-2 text-sm font-serif font-medium text-green-700"
                        >
                            Новая ссылка подтверждения была отправлена на ваш адрес электронной почты.
                        </div>
                    </div>

                    <div class="flex items-center gap-6 pt-2">
                        <Button
                            :disabled="processing"
                            data-test="update-profile-button"
                            class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase text-white bg-black border border-black hover:tracking-[0.2em]"
                            >Сохранить</Button
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

            <DeleteUser />
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
