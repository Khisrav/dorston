<script setup lang="ts">
import { useDoorCalc } from '@/composables/useDoorCalc'
import { getImageUrl } from '@/lib/utils'
import { Drawer, ToggleSwitch, Select } from 'primevue'
import { computed, ref } from 'vue'
import ConfiguratorCard from './ConfiguratorCard.vue'

const doorCalcStore = useDoorCalc()

const showPrimaryLockDrawer = ref(false)
const showSecondaryLockDrawer = ref(false)

const primaryLocks = computed(() => doorCalcStore.locks.primary)
const secondaryLocks = computed(() => doorCalcStore.locks.secondary)

const availableCylinders = computed(() =>
    doorCalcStore.cylinders.map(c => ({ label: c.name, value: c.id }))
)

const selectedPrimaryCylinder = computed(() => {
    const id = doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism
    if (!id || id === -1) return null
    return doorCalcStore.cylinders.find(c => c.id === id) ?? null
})

const selectedSecondaryCylinder = computed(() => {
    const id = doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism
    if (!id || id === -1) return null
    return doorCalcStore.cylinders.find(c => c.id === id) ?? null
})

const selectedPrimaryLock = computed(() =>
    primaryLocks.value.find(l => l.id === doorCalcStore.doorConfig.furniture.primaryLock) ?? null
)

const selectedSecondaryLock = computed(() =>
    secondaryLocks.value.find(l => l.id === doorCalcStore.doorConfig.furniture.secondaryLock) ?? null
)
</script>

<template>
    <ConfiguratorCard :step="5" title="Замки">

        <!-- Primary lock -->
        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Основной замок</p>
        <button
            type="button"
            @click="showPrimaryLockDrawer = true"
            class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200"
        >
            <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                <img
                    v-if="selectedPrimaryLock?.image"
                    :src="getImageUrl(selectedPrimaryLock.image)"
                    :alt="selectedPrimaryLock.name"
                    class="w-full h-full object-contain p-1"
                />
                <i v-else class="pi pi-lock text-xl text-neutral-400" />
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-serif text-xs text-sky-900/40 uppercase tracking-wider mb-0.5">Замок</p>
                <p class="font-serif font-semibold text-sky-900 truncate">
                    {{ selectedPrimaryLock?.name ?? 'Не выбрано' }}
                </p>
            </div>
            <i class="pi pi-chevron-right text-sky-900/30" />
        </button>

        <div class="border-t border-sky-900/5 my-4" />

        <!-- Secondary lock toggle -->
        <div class="flex items-center justify-between gap-4">
            <p class="font-serif text-sm text-sky-900/70">Дополнительный замок</p>
            <ToggleSwitch v-model="doorCalcStore.doorConfig.furniture.hasSecondaryLock" />
        </div>

        <button
            v-if="doorCalcStore.doorConfig.furniture.hasSecondaryLock"
            type="button"
            @click="showSecondaryLockDrawer = true"
            class="w-full flex items-center gap-3 p-3 rounded-2xl border border-sky-900/10 hover:border-sky-900/30 text-left transition-all duration-200 mt-4"
        >
            <div class="w-12 h-12 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                <img
                    v-if="selectedSecondaryLock?.image"
                    :src="getImageUrl(selectedSecondaryLock.image)"
                    :alt="selectedSecondaryLock.name"
                    class="w-full h-full object-contain p-1"
                />
                <i v-else class="pi pi-lock text-xl text-neutral-400" />
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-serif text-xs text-sky-900/40 uppercase tracking-wider mb-0.5">Доп. замок</p>
                <p class="font-serif font-semibold text-sky-900 truncate">
                    {{ selectedSecondaryLock?.name ?? 'Не выбрано' }}
                </p>
            </div>
            <i class="pi pi-chevron-right text-sky-900/30" />
        </button>

        <div class="border-t border-sky-900/5 my-4 mb-2" />

        <!-- Cylinders -->
        <p class="font-serif text-sm inline-block mb-3 text-sky-900/70">Цилиндры</p>
        <div class="grid grid-cols-1 gap-3">
            <div>
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Основной цилиндр</label>
                <Select
                    v-model="doorCalcStore.doorConfig.furniture.primaryCylindricalLockMechanism"
                    :options="availableCylinders"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Выберите цилиндр"
                    size="small"
                    showClear
                    fluid
                />
                <p v-if="selectedPrimaryCylinder" class="mt-1 font-serif text-xs text-sky-900/50">
                    {{ selectedPrimaryCylinder.base_price.toLocaleString('ru-RU') }} ₽
                </p>
            </div>

            <div v-if="doorCalcStore.doorConfig.furniture.hasSecondaryLock">
                <label class="font-serif text-xs inline-block mb-1.5 text-sky-900/70">Дополнительный цилиндр</label>
                <Select
                    v-model="doorCalcStore.doorConfig.furniture.secondaryCylindricalLockMechanism"
                    :options="availableCylinders"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Выберите цилиндр"
                    size="small"
                    showClear
                    fluid
                />
                <p v-if="selectedSecondaryCylinder" class="mt-1 font-serif text-xs text-sky-900/50">
                    {{ selectedSecondaryCylinder.base_price.toLocaleString('ru-RU') }} ₽
                </p>
            </div>
        </div>

    </ConfiguratorCard>

    <!-- DRAWER: Primary lock -->
    <Drawer v-model:visible="showPrimaryLockDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Основной замок</h2>
        </template>
        <div class="space-y-3 p-1">
            <div
                v-for="lock in primaryLocks"
                :key="lock.id"
                @click="() => { doorCalcStore.doorConfig.furniture.primaryLock = lock.id; showPrimaryLockDrawer = false }"
                :class="[
                    'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200',
                    doorCalcStore.doorConfig.furniture.primaryLock === lock.id
                        ? 'border-sky-950 bg-sky-900 text-white'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <div class="h-16 w-16 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                        v-if="lock.image"
                        :src="getImageUrl(lock.image)"
                        :alt="lock.name"
                        class="w-full h-full object-contain p-2"
                    />
                    <i v-else class="pi pi-lock text-2xl text-neutral-400" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif font-semibold truncate">{{ lock.name }}</p>
                    <p
                        class="font-serif text-sm mt-0.5"
                        :class="doorCalcStore.doorConfig.furniture.primaryLock === lock.id ? 'text-white/60' : 'text-sky-900/50'"
                    >
                        {{ lock.base_price.toLocaleString('ru-RU') }} ₽
                    </p>
                </div>
                <i
                    v-if="doorCalcStore.doorConfig.furniture.primaryLock === lock.id"
                    class="pi pi-check-circle text-xl text-white"
                />
            </div>
        </div>
    </Drawer>

    <!-- DRAWER: Secondary lock -->
    <Drawer v-model:visible="showSecondaryLockDrawer" position="right" class="!w-full sm:!w-[90vw] md:!w-[600px] lg:!w-[700px] xl:!w-[800px]">
        <template #header>
            <h2 class="font-serif text-lg tracking-tight">Дополнительный замок</h2>
        </template>
        <div class="space-y-3 p-1">
            <div
                v-for="lock in secondaryLocks"
                :key="lock.id"
                @click="() => { doorCalcStore.doorConfig.furniture.secondaryLock = lock.id; showSecondaryLockDrawer = false }"
                :class="[
                    'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200',
                    doorCalcStore.doorConfig.furniture.secondaryLock === lock.id
                        ? 'border-sky-950 bg-sky-900 text-white'
                        : 'border-sky-900/10 hover:border-sky-900/30'
                ]"
            >
                <div class="h-16 w-16 bg-neutral-100 rounded-md shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                        v-if="lock.image"
                        :src="getImageUrl(lock.image)"
                        :alt="lock.name"
                        class="w-full h-full object-contain p-2"
                    />
                    <i v-else class="pi pi-lock text-2xl text-neutral-400" />
                </div>
                <div class="flex-1 min-w-0">
                    <p class="font-serif font-semibold truncate">{{ lock.name }}</p>
                    <p
                        class="font-serif text-sm mt-0.5"
                        :class="doorCalcStore.doorConfig.furniture.secondaryLock === lock.id ? 'text-white/60' : 'text-sky-900/50'"
                    >
                        {{ lock.base_price.toLocaleString('ru-RU') }} ₽
                    </p>
                </div>
                <i
                    v-if="doorCalcStore.doorConfig.furniture.secondaryLock === lock.id"
                    class="pi pi-check-circle text-xl text-white"
                />
            </div>
        </div>
    </Drawer>
</template>
