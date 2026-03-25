<script setup lang="ts">
import { useTermoDoorCalc } from '@/composables/useTermoDoorCalc'
import { ToggleSwitch } from 'primevue'
import { computed, ref, watch } from 'vue'
import ConfiguratorCard from '../Card/ConfiguratorCard.vue'
import { MoveHorizontalIcon, MoveVerticalIcon } from 'lucide-vue-next'

const store = useTermoDoorCalc()

const MODULE_SIZE_MIN = 300
const MODULE_SIZE_MAX = 1000
const MODULE_SIZE_STEP = 10
const MODULE_DEFAULT = 300

const hasTop   = ref(false)
const hasLeft  = ref(false)
const hasRight = ref(false)

function clampSnapModuleSize(n: number): number {
    if (!Number.isFinite(n)) return MODULE_DEFAULT
    const c = Math.min(MODULE_SIZE_MAX, Math.max(MODULE_SIZE_MIN, n))
    const k = Math.round((c - MODULE_SIZE_MIN) / MODULE_SIZE_STEP)
    return Math.min(MODULE_SIZE_MAX, MODULE_SIZE_MIN + k * MODULE_SIZE_STEP)
}

function ensureSideDefaultWhenEnabled(enabled: boolean, getSize: () => number, setSize: (v: number) => void) {
    if (enabled && getSize() === 0) {
        setSize(MODULE_DEFAULT)
    }
}

watch(() => store.doorConfig.isModular, (enabled) => {
    if (enabled) {
        store.doorConfig.modules ??= {
            top:   { size: 0, withGlass: false },
            left:  { size: 0, withGlass: false },
            right: { size: 0, withGlass: false },
        }
    } else {
        hasTop.value   = false
        hasLeft.value  = false
        hasRight.value = false
    }
}, { immediate: true })

watch(hasTop, (on) => {
    const m = store.doorConfig.modules
    if (!m) return
    ensureSideDefaultWhenEnabled(on, () => m.top.size, (v) => { m.top.size = v })
})
watch(hasLeft, (on) => {
    const m = store.doorConfig.modules
    if (!m) return
    ensureSideDefaultWhenEnabled(on, () => m.left.size, (v) => { m.left.size = v })
})
watch(hasRight, (on) => {
    const m = store.doorConfig.modules
    if (!m) return
    ensureSideDefaultWhenEnabled(on, () => m.right.size, (v) => { m.right.size = v })
})

const extraLeft = computed(() => (hasLeft.value ? store.doorConfig.modules?.left.size ?? 0 : 0))
const extraRight = computed(() => (hasRight.value ? store.doorConfig.modules?.right.size ?? 0 : 0))
const extraTop = computed(() => (hasTop.value ? store.doorConfig.modules?.top.size ?? 0 : 0))

const overallWidth = computed(() => store.doorConfig.width + extraLeft.value + extraRight.value)
const overallHeight = computed(() => store.doorConfig.height + extraTop.value)

function onModuleSizeBlur(side: 'top' | 'left' | 'right') {
    const m = store.doorConfig.modules
    if (!m) return
    m[side].size = clampSnapModuleSize(m[side].size)
}

const moduleSampleImage = computed(() => {
    if (!hasTop.value && !hasLeft.value && !hasRight.value) return null
    const folder = store.doorConfig.handleSide.toLowerCase()
    const l = hasLeft.value  ? 'left'  : 'no'
    const t = hasTop.value   ? 'top'   : 'no'
    const r = hasRight.value ? 'right' : 'no'
    return `/assets/ui/modular-system/${folder}/${l}-${t}-${r}.jpg`
})
</script>

<template>
    <!-- ── Master toggle ─────────────────────────────────────────────── -->
    <div class="bg-sky-50/30 rounded-3xl w-full px-5 md:px-6 py-4 flex items-center justify-between gap-4">
        <div>
            <p class="font-serif font-bold text-sky-900 text-base tracking-tight leading-none mb-1">Модульная система</p>
            <p class="font-serif text-xs text-black/40">Боковые и верхние модули</p>
        </div>
        <ToggleSwitch v-model="store.doorConfig.isModular" />
    </div>

    <!-- ── Module configuration card ─────────────────────────────────── -->
    <Transition name="slide-down">
        <ConfiguratorCard v-if="store.doorConfig.isModular" :step="3" title="Модульная система">

            <div class="flex flex-col items-center gap-3">

                <!-- ── Top module ──────────────────────────────────────── -->
                <div class="flex flex-col items-center gap-2 justify-center">
                    <span class="font-serif text-xs text-sky-900/70">Сверху, мм</span>
                    <ToggleSwitch v-model="hasTop" />
                    <Transition name="fade">
                        <div v-if="hasTop" class="num-input-wrap w-24">
                            <input
                                type="number"
                                v-model.number="store.doorConfig.modules!.top.size"
                                :min="MODULE_SIZE_MIN"
                                :max="MODULE_SIZE_MAX"
                                :step="MODULE_SIZE_STEP"
                                inputmode="numeric"
                                class="num-input"
                                @blur="onModuleSizeBlur('top')"
                                @change="onModuleSizeBlur('top')"
                            />
                            <span class="num-suffix">
                                <MoveVerticalIcon class="w-4 h-4" />
                            </span>
                        </div>
                    </Transition>
                </div>

                <!-- ── Door diagram + side modules ─────────────────────── -->
                <div class="flex items-center justify-between gap-3 w-full">

                    <!-- Left module -->
                    <div class="flex flex-col items-center gap-2 w-[76px] shrink-0">
                        <span class="font-serif text-xs text-sky-900/50">Слева, мм</span>
                        <ToggleSwitch v-model="hasLeft" />
                        <Transition name="fade">
                            <div v-if="hasLeft" class="num-input-wrap w-full">
                                <input
                                    type="number"
                                    v-model.number="store.doorConfig.modules!.left.size"
                                    :min="MODULE_SIZE_MIN"
                                    :max="MODULE_SIZE_MAX"
                                    :step="MODULE_SIZE_STEP"
                                    inputmode="numeric"
                                    class="num-input"
                                    @blur="onModuleSizeBlur('left')"
                                    @change="onModuleSizeBlur('left')"
                                />
                                <span class="num-suffix">
                                    <MoveHorizontalIcon class="w-4 h-4" />
                                </span>
                            </div>
                        </Transition>
                    </div>

                    <!-- Door sample image -->
                    <div class="relative w-[132px] h-[167px] md:w-[202px] md:h-[256px] shrink-0">
                        <Transition name="img-swap">
                            <div
                                v-if="!moduleSampleImage"
                                class="absolute inset-0 rounded-lg border-2 border-dashed border-sky-900/15 flex flex-col items-center justify-center gap-2"
                            >
                                <i class="pi pi-table text-sky-900/20 text-2xl" />
                                <span class="font-serif text-[10px] text-sky-900/30 text-center leading-tight px-2">Выберите<br>модули</span>
                            </div>
                        </Transition>
                        <Transition name="img-swap">
                            <img
                                v-if="moduleSampleImage"
                                :key="moduleSampleImage"
                                :src="moduleSampleImage"
                                alt="Модульная схема"
                                class="absolute inset-0 w-full h-full"
                            />
                        </Transition>
                    </div>

                    <!-- Right module -->
                    <div class="flex flex-col items-center gap-2 w-[76px] shrink-0">
                        <span class="font-serif text-xs text-sky-900/50">Справа, мм</span>
                        <ToggleSwitch v-model="hasRight" />
                        <Transition name="fade">
                            <div v-if="hasRight" class="num-input-wrap w-full">
                                <input
                                    type="number"
                                    v-model.number="store.doorConfig.modules!.right.size"
                                    :min="MODULE_SIZE_MIN"
                                    :max="MODULE_SIZE_MAX"
                                    :step="MODULE_SIZE_STEP"
                                    inputmode="numeric"
                                    class="num-input"
                                    @blur="onModuleSizeBlur('right')"
                                    @change="onModuleSizeBlur('right')"
                                />
                                <span class="num-suffix">
                                    <MoveHorizontalIcon class="w-4 h-4" />
                                </span>
                            </div>
                        </Transition>
                    </div>

                </div>

                <div>
                    <p class="font-serif text-xs text-sky-900/50">{{ overallWidth }}x{{ overallHeight }} мм</p>
                </div>
            </div>

        </ConfiguratorCard>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.img-swap-enter-active,
.img-swap-leave-active {
    transition: opacity 0.2s ease;
    position: absolute;
    inset: 0;
}
.img-swap-enter-from,
.img-swap-leave-to {
    opacity: 0;
}

/* ── Compact number input ──────────────────────────── */
.num-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}
.num-input {
    width: 100%;
    padding: 5px 28px 5px 10px;
    border: 1px solid rgb(12 74 110 / 0.2);
    border-radius: 9999px;  
    font-size: 0.8rem;
    color: rgb(12 74 110);
    background: white;
    outline: none;
    text-align: center;
    appearance: textfield;
    font-family: 'Google Sans', sans-serif;
}
.num-input::-webkit-inner-spin-button,
.num-input::-webkit-outer-spin-button {
    appearance: none;
}
.num-input:focus {
    border-color: rgb(12 74 110 / 0.45);
    box-shadow: 0 0 0 3px rgb(12 74 110 / 0.06);
}
.num-suffix {
    position: absolute;
    right: 10px;
    font-size: 0.7rem;
    color: rgb(12 74 110 / 0.4);
    pointer-events: none;
    user-select: none;
    font-family: 'Google Sans', sans-serif;
}
</style>
