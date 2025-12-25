<script setup lang="ts">
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { Form } from '@inertiajs/vue3';
import { useTemplateRef } from 'vue';

// Components
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const passwordInput = useTemplateRef('passwordInput');
</script>

<template>
    <div class="space-y-8">
        <HeadingSmall
            title="Удаление аккаунта"
            description="Удалить ваш аккаунт и все его ресурсы"
        />
        <div
            class="space-y-4 border border-red-600/30 bg-red-50/50 p-6"
        >
            <div class="relative space-y-2 text-red-700">
                <p class="font-serif font-medium tracking-wide">Предупреждение</p>
                <p class="font-serif text-sm">
                    Пожалуйста, действуйте с осторожностью, это действие не может быть отменено.
                </p>
            </div>
            <Dialog>
                <DialogTrigger as-child>
                    <Button 
                        variant="destructive" 
                        data-test="delete-user-button"
                        class="elegant-button px-8 py-2 font-serif text-sm tracking-[0.15em] uppercase rounded-none hover:tracking-[0.2em]"
                        >Удалить аккаунт</Button
                    >
                </DialogTrigger>
                <DialogContent class="elegant-dialog border border-black/20 rounded-none">
                    <Form
                        v-bind="ProfileController.destroy.form()"
                        reset-on-success
                        @error="() => passwordInput?.$el?.focus()"
                        :options="{
                            preserveScroll: true,
                        }"
                        class="space-y-6"
                        v-slot="{ errors, processing, reset, clearErrors }"
                    >
                        <DialogHeader class="space-y-4">
                            <DialogTitle class="font-serif text-2xl tracking-tight text-black"
                                >Вы уверены, что хотите удалить свой аккаунт?</DialogTitle
                            >
                            <DialogDescription class="font-serif text-black/70 leading-relaxed">
                                После удаления вашего аккаунта все его ресурсы и данные также будут безвозвратно удалены. Пожалуйста, введите ваш пароль для подтверждения того, что вы хотите безвозвратно удалить свой аккаунт.
                            </DialogDescription>
                        </DialogHeader>

                        <div class="grid gap-3">
                            <Label for="password" class="sr-only"
                                >Пароль</Label
                            >
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref="passwordInput"
                                placeholder="Пароль"
                                class="elegant-input font-serif border-black/20 focus:border-black rounded-none"
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <DialogFooter class="gap-3">
                            <DialogClose as-child>
                                <Button
                                    variant="secondary"
                                    @click="
                                        () => {
                                            clearErrors();
                                            reset();
                                        }
                                    "
                                    class="elegant-button px-6 py-2 font-serif text-sm tracking-[0.15em] uppercase rounded-none border border-black/20 hover:tracking-[0.2em]"
                                >
                                    Отменить
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                variant="destructive"
                                :disabled="processing"
                                data-test="confirm-delete-user-button"
                                class="elegant-button px-6 py-2 font-serif text-sm tracking-[0.15em] uppercase rounded-none hover:tracking-[0.2em]"
                            >
                                Удалить аккаунт
                            </Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

:deep(.elegant-button) {
    font-family: 'Playfair Display', serif;
    transition: all 0.3s ease;
}

:deep(.elegant-input) {
    font-family: 'Playfair Display', serif;
}

:deep(.elegant-dialog) {
    font-family: 'Playfair Display', serif;
}
</style>
