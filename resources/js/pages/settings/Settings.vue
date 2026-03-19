<script setup lang="ts">
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import InputError from '@/components/InputError.vue';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { send } from '@/routes/verification';
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { KeyRoundIcon, LockIcon, MailIcon, SaveIcon, Trash2Icon, UserIcon } from 'lucide-vue-next';
import { Button, IconField, InputIcon, InputText } from 'primevue';
import { ref, useTemplateRef } from 'vue';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

defineProps<Props>();

const page = usePage();
const user = page.props.auth.user;

const passwordInput = useTemplateRef('passwordInput');
</script>

<template>
    <Head title="Настройки" />
    <PublicLayout>
        <div class="flex flex-1 flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div class="mx-auto w-full max-w-2xl space-y-6">

                <!-- Page header -->
                <div class="mb-8">
                    <h1 class="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-black">Настройки аккаунта</h1>
                    <p class="font-serif text-sm text-black/50 mt-1">Управление профилем и настройками безопасности</p>
                </div>

                <!-- ── Profile section ─────────────────────────────────── -->
                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-md shadow-sky-800/5 overflow-hidden">
                    <div class="flex items-center gap-3 border-b border-sky-950/10 px-6 py-4">
                        <div class="flex size-9 items-center justify-center rounded-2xl bg-sky-900/10">
                            <UserIcon class="size-4 text-sky-900" />
                        </div>
                        <div>
                            <h2 class="font-serif font-bold text-base tracking-tight text-black">Профиль</h2>
                            <p class="font-serif text-xs text-black/50">Обновите имя и адрес электронной почты</p>
                        </div>
                    </div>

                    <div class="px-6 py-6">
                        <Form
                            v-bind="ProfileController.update.form()"
                            class="space-y-5"
                            v-slot="{ errors, processing, recentlySuccessful }"
                        >
                            <div class="flex flex-col gap-1.5">
                                <label for="name" class="text-sm font-serif font-medium text-black/70">Имя</label>
                                <IconField>
                                    <InputIcon>
                                        <UserIcon class="size-4" />
                                    </InputIcon>
                                    <InputText
                                        id="name"
                                        name="name"
                                        :default-value="user.name"
                                        required
                                        autocomplete="name"
                                        placeholder="Полное имя"
                                        class="w-full"
                                    />
                                </IconField>
                                <InputError :message="errors.name" />
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
                                        :default-value="user.email"
                                        required
                                        autocomplete="username"
                                        placeholder="Адрес электронной почты"
                                        class="w-full"
                                    />
                                </IconField>
                                <InputError :message="errors.email" />
                            </div>

                            <div v-if="mustVerifyEmail && !user.email_verified_at">
                                <p class="text-sm font-serif text-black/60">
                                    Ваш адрес электронной почты не подтверждён.
                                    <Link
                                        :href="send()"
                                        as="button"
                                        class="text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                                    >
                                        Отправить письмо повторно.
                                    </Link>
                                </p>
                                <div
                                    v-if="status === 'verification-link-sent'"
                                    class="mt-2 text-sm font-serif font-medium text-green-700"
                                >
                                    Новая ссылка подтверждения отправлена на вашу почту.
                                </div>
                            </div>

                            <div class="flex items-center gap-4 pt-1">
                                <Button
                                    type="submit"
                                    label="Сохранить"
                                    :loading="processing"
                                    :disabled="processing"
                                    icon="pi pi-save"
                                    icon-pos="right"
                                    size="small"
                                    data-test="update-profile-button"
                                />
                                <Transition
                                    enter-active-class="transition ease-in-out"
                                    enter-from-class="opacity-0"
                                    leave-active-class="transition ease-in-out"
                                    leave-to-class="opacity-0"
                                >
                                    <p v-show="recentlySuccessful" class="text-sm font-serif text-black/60">Сохранено.</p>
                                </Transition>
                            </div>
                        </Form>
                    </div>
                </div>

                <!-- ── Password section ────────────────────────────────── -->
                <div class="bg-white border border-sky-950/10 rounded-3xl shadow-md shadow-sky-800/5 overflow-hidden">
                    <div class="flex items-center gap-3 border-b border-sky-950/10 px-6 py-4">
                        <div class="flex size-9 items-center justify-center rounded-2xl bg-sky-900/10">
                            <KeyRoundIcon class="size-4 text-sky-900" />
                        </div>
                        <div>
                            <h2 class="font-serif font-bold text-base tracking-tight text-black">Смена пароля</h2>
                            <p class="font-serif text-xs text-black/50">Используйте длинный случайный пароль для безопасности</p>
                        </div>
                    </div>

                    <div class="px-6 py-6">
                        <Form
                            v-bind="PasswordController.update.form()"
                            :options="{ preserveScroll: true }"
                            reset-on-success
                            :reset-on-error="['password', 'password_confirmation', 'current_password']"
                            class="space-y-5"
                            v-slot="{ errors, processing, recentlySuccessful }"
                        >
                            <div class="flex flex-col gap-1.5">
                                <label for="current_password" class="text-sm font-serif font-medium text-black/70">Текущий пароль</label>
                                <IconField>
                                    <InputIcon>
                                        <LockIcon class="size-4" />
                                    </InputIcon>
                                    <InputText
                                        id="current_password"
                                        name="current_password"
                                        type="password"
                                        autocomplete="current-password"
                                        placeholder="Текущий пароль"
                                        class="w-full"
                                    />
                                </IconField>
                                <InputError :message="errors.current_password" />
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label for="password" class="text-sm font-serif font-medium text-black/70">Новый пароль</label>
                                <IconField>
                                    <InputIcon>
                                        <LockIcon class="size-4" />
                                    </InputIcon>
                                    <InputText
                                        id="password"
                                        name="password"
                                        type="password"
                                        autocomplete="new-password"
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
                                        name="password_confirmation"
                                        type="password"
                                        autocomplete="new-password"
                                        placeholder="Подтвердите новый пароль"
                                        class="w-full"
                                    />
                                </IconField>
                                <InputError :message="errors.password_confirmation" />
                            </div>

                            <div class="flex items-center gap-4 pt-1">
                                <Button
                                    type="submit"
                                    label="Сохранить пароль"
                                    :loading="processing"
                                    :disabled="processing"
                                    icon="pi pi-save"
                                    icon-pos="right"
                                    size="small"
                                    data-test="update-password-button"
                                />
                                <Transition
                                    enter-active-class="transition ease-in-out"
                                    enter-from-class="opacity-0"
                                    leave-active-class="transition ease-in-out"
                                    leave-to-class="opacity-0"
                                >
                                    <p v-show="recentlySuccessful" class="text-sm font-serif text-black/60">Сохранено.</p>
                                </Transition>
                            </div>
                        </Form>
                    </div>
                </div>

                <!-- ── Delete account section ──────────────────────────── -->
                <div class="bg-white border border-red-200 rounded-3xl overflow-hidden">
                    <div class="flex items-center gap-3 border-b border-red-100 px-6 py-4">
                        <div class="flex size-9 items-center justify-center rounded-2xl bg-red-50">
                            <Trash2Icon class="size-4 text-red-600" />
                        </div>
                        <div>
                            <h2 class="font-serif font-bold text-base tracking-tight text-black">Удаление аккаунта</h2>
                            <p class="font-serif text-xs text-black/50">Безвозвратное удаление аккаунта и всех данных</p>
                        </div>
                    </div>

                    <div class="px-6 py-6">
                        <p class="font-serif text-sm text-black/60 mb-4">
                            После удаления аккаунта все данные будут безвозвратно удалены. Это действие нельзя отменить.
                        </p>

                        <Dialog>
                            <DialogTrigger as-child>
                                <Button
                                    label="Удалить аккаунт"
                                    severity="danger"
                                    icon="pi pi-trash"
                                    icon-pos="right"
                                    size="small"
                                    data-test="delete-user-button"
                                />
                            </DialogTrigger>
                            <DialogContent class="border border-black/20 rounded-3xl">
                                <Form
                                    v-bind="ProfileController.destroy.form()"
                                    reset-on-success
                                    @error="() => passwordInput?.$el?.focus()"
                                    :options="{ preserveScroll: true }"
                                    class="space-y-6"
                                    v-slot="{ errors, processing, reset, clearErrors }"
                                >
                                    <DialogHeader class="space-y-3">
                                        <DialogTitle class="font-serif text-xl font-bold tracking-tight text-black">
                                            Удалить аккаунт?
                                        </DialogTitle>
                                        <DialogDescription class="font-serif text-black/60 leading-relaxed">
                                            После удаления аккаунта все данные будут безвозвратно удалены. Введите пароль для подтверждения.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div class="flex flex-col gap-1.5">
                                        <label for="delete-password" class="sr-only">Пароль</label>
                                        <IconField>
                                            <InputIcon>
                                                <LockIcon class="size-4" />
                                            </InputIcon>
                                            <InputText
                                                id="delete-password"
                                                type="password"
                                                name="password"
                                                ref="passwordInput"
                                                placeholder="Введите пароль для подтверждения"
                                                class="w-full"
                                            />
                                        </IconField>
                                        <InputError :message="errors.password" />
                                    </div>

                                    <DialogFooter class="gap-3">
                                        <DialogClose as-child>
                                            <Button
                                                label="Отменить"
                                                variant="outlined"
                                                size="small"
                                                @click="() => { clearErrors(); reset(); }"
                                            />
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            label="Удалить аккаунт"
                                            severity="danger"
                                            size="small"
                                            :loading="processing"
                                            :disabled="processing"
                                            data-test="confirm-delete-user-button"
                                        />
                                    </DialogFooter>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

            </div>
        </div>
    </PublicLayout>
</template>
