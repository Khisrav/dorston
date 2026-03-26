<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Dialog, IconField, InputIcon, InputMask, InputText } from 'primevue'
import { MapPinIcon, PhoneIcon, UserIcon } from 'lucide-vue-next'

const props = defineProps<{
    visible: boolean
    isGeneratingPdf?: boolean
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
    'download-pdf': [form: { fullname: string; phone: string; address: string }]
}>()

const form = ref({ fullname: '', phone: '', address: '' })
const ordered = ref(false)

// Reset to form state a moment after the dialog closes (lets the close animation finish)
watch(
    () => props.visible,
    (open) => {
        if (!open) {
            setTimeout(() => {
                form.value = { fullname: '', phone: '', address: '' }
                ordered.value = false
            }, 300)
        }
    },
)

function handleOrder() {
    ordered.value = true
}

function handleDownloadPdf() {
    emit('download-pdf', { ...form.value })
}
</script>

<template>
    <Dialog
        :visible="visible"
        @update:visible="emit('update:visible', $event)"
        modal
        :closable="!isGeneratingPdf"
        :pt="{
            root: { class: '!rounded-3xl w-full max-w-md mx-4' },
            header: { class: '!pb-2 !px-6 !pt-6' },
            content: { class: '!px-6 !pb-6' },
        }"
    >
        <template #header>
            <div>
                <h2 class="font-serif text-xl font-bold text-black tracking-tight">Еще чуть чуть...</h2>
                <p class="font-serif text-sm text-black/40 mt-0.5">Заполните данные</p>
            </div>
        </template>

        <!-- ── Success state ─────────────────────────────────────────────── -->
        <div v-if="ordered" class="flex flex-col items-center justify-center py-8 text-center">
            <div class="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <i class="pi pi-check text-2xl text-green-500" />
            </div>
            <h3 class="font-serif font-bold text-black text-lg">Заявка принята!</h3>
            <p class="font-serif text-sm text-black/50 mt-1.5 leading-relaxed max-w-xs">
                Наш менеджер свяжется с вами в ближайшее время
            </p>
            <Button
                label="Закрыть"
                variant="outlined"
                size="small"
                class="mt-6"
                @click="emit('update:visible', false)"
            />
        </div>

        <!-- ── Form state ────────────────────────────────────────────────── -->
        <div v-else class="flex flex-col gap-4 pt-2">

            <!-- Fullname -->
            <div class="flex flex-col gap-1.5">
                <label class="font-serif text-sm font-medium text-black/70">ФИО покупателя</label>
                <IconField>
                    <InputIcon>
                        <UserIcon class="size-4" />
                    </InputIcon>
                    <InputText
                        v-model="form.fullname"
                        placeholder="Иванов Иван Иванович"
                        autocomplete="name"
                        class="w-full"
                    />
                </IconField>
            </div>

            <!-- Phone -->
            <div class="flex flex-col gap-1.5">
                <label class="font-serif text-sm font-medium text-black/70">Телефон</label>
                <IconField>
                    <InputIcon>
                        <PhoneIcon class="size-4" />
                    </InputIcon>
                    <InputMask
                        v-model="form.phone"
                        mask="+7 (999) 999-99-99"
                        placeholder="+7 (___) ___-__-__"
                        autocomplete="tel"
                        class="w-full"
                    />
                </IconField>
            </div>

            <!-- Address -->
            <div class="flex flex-col gap-1.5">
                <label class="font-serif text-sm font-medium text-black/70">Адрес</label>
                <IconField>
                    <InputIcon>
                        <MapPinIcon class="size-4" />
                    </InputIcon>
                    <InputText
                        v-model="form.address"
                        placeholder="г. Город, ул. Улица, д. 1"
                        autocomplete="street-address"
                        class="w-full"
                    />
                </IconField>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-1">
                <Button
                    label="Оформить заказ"
                    icon="pi pi-shopping-cart"
                    size="small"
                    class="flex-1"
                    @click="handleOrder"
                />
                <Button
                    label="Скачать PDF"
                    variant="outlined"
                    icon="pi pi-file-pdf"
                    size="small"
                    class="flex-1"
                    :loading="isGeneratingPdf"
                    @click="handleDownloadPdf"
                />
            </div>
        </div>
    </Dialog>
</template>
