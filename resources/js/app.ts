import '../css/app.css';
import 'primeicons/primeicons.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { initializeTheme } from './composables/useAppearance';
import VueKonva from 'vue-konva';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';

// Design system preset — brand color #105072 (deep teal-navy), see DESIGN.md
const CustomPreset = definePreset(Aura, {
    primitive: {
        // Custom brand palette derived from #105072
        dorston: {
            50:  '#e8f4f8',
            100: '#c5e3ef',
            200: '#9ecfe4',
            300: '#6db8d6',
            400: '#3da4c8',
            500: '#105072',
            600: '#0e4764',
            700: '#0b3c55',
            800: '#093047',
            900: '#062538',
            950: '#041a28',
        },
    },
    semantic: {
        primary: {
            50:  '{dorston.50}',
            100: '{dorston.100}',
            200: '{dorston.200}',
            300: '{dorston.300}',
            400: '{dorston.400}',
            500: '{dorston.500}',
            600: '{dorston.600}',
            700: '{dorston.700}',
            800: '{dorston.800}',
            900: '{dorston.900}',
            950: '{dorston.950}',
        },
        formField: {
            // 12px border radius — matches number stepper and input design
            borderRadius: '{border.radius.xl}',
        },
        colorScheme: {
            light: {
                primary: {
                    color:         '{dorston.500}',
                    contrastColor: '#ffffff',
                    hoverColor:    '{dorston.600}',
                    activeColor:   '{dorston.700}',
                },
                formField: {
                    // Subtle primary-tinted border to match Figma (sky-900/25)
                    borderColor:       'color-mix(in srgb, #105072 25%, transparent)',
                    hoverBorderColor:  'color-mix(in srgb, #105072 45%, transparent)',
                    focusBorderColor:  '#105072',
                },
            },
            dark: {
                primary: {
                    color:         '{dorston.300}',
                    contrastColor: '#ffffff',
                    hoverColor:    '{dorston.200}',
                    activeColor:   '{dorston.100}',
                },
                formField: {
                    borderColor:       'color-mix(in srgb, {dorston.300} 30%, transparent)',
                    hoverBorderColor:  'color-mix(in srgb, {dorston.300} 50%, transparent)',
                    focusBorderColor:  '{dorston.300}',
                },
            },
        },
    },
    components: {
        // ── Button ─────────────────────────────────────────────────────────
        // Primary   : solid #105072 fill, white text, rounded-md (6px)
        // Secondary : gray-50 bg, primary text, subtle primary border
        // Outlined  : transparent bg, primary border/25, primary text
        // Note: shadow-sm on secondary buttons requires `pt` passthrough
        button: {
            root: {
                borderRadius: '{border.radius.md}', // 6px
            },
            colorScheme: {
                light: {
                    root: {
                        secondary: {
                            background:        '{surface.50}',
                            hoverBackground:   '{surface.100}',
                            activeBackground:  '{surface.200}',
                            borderColor:       'color-mix(in srgb, #105072 25%, transparent)',
                            hoverBorderColor:  'color-mix(in srgb, #105072 45%, transparent)',
                            activeBorderColor: 'color-mix(in srgb, #105072 60%, transparent)',
                            color:             '#105072',
                            hoverColor:        '{dorston.600}',
                            activeColor:       '{dorston.700}',
                            focusRing: { color: '#105072', shadow: 'none' },
                        },
                    },
                    outlined: {
                        primary: {
                            hoverBackground:  '{dorston.50}',
                            activeBackground: '{dorston.100}',
                            borderColor:      'color-mix(in srgb, #105072 25%, transparent)',
                            color:            '#105072',
                        },
                    },
                },
                dark: {
                    root: {
                        secondary: {
                            background:        '{surface.800}',
                            hoverBackground:   '{surface.700}',
                            activeBackground:  '{surface.600}',
                            borderColor:       'color-mix(in srgb, {dorston.300} 30%, transparent)',
                            hoverBorderColor:  'color-mix(in srgb, {dorston.300} 50%, transparent)',
                            activeBorderColor: 'color-mix(in srgb, {dorston.300} 70%, transparent)',
                            color:             '{dorston.300}',
                            hoverColor:        '{dorston.200}',
                            activeColor:       '{dorston.100}',
                            focusRing: { color: '{dorston.300}', shadow: 'none' },
                        },
                    },
                    outlined: {
                        primary: {
                            hoverBackground:  'color-mix(in srgb, {dorston.500} 15%, transparent)',
                            activeBackground: 'color-mix(in srgb, {dorston.500} 25%, transparent)',
                            borderColor:      'color-mix(in srgb, {dorston.300} 40%, transparent)',
                            color:            '{dorston.300}',
                        },
                    },
                },
            },
        },

        // ── Toggle Switch ──────────────────────────────────────────────────
        // Flat / square style (developer preference, not from Figma)
        toggleswitch: {
            root: {
                borderRadius: '99px',
            },
            handle: {
                borderRadius: '99px',
            },
        },

        // ── InputNumber stepper ────────────────────────────────────────────
        // Stepper buttons use primary-tinted style (see DESIGN.md for details
        // on asymmetric minus/plus styling — that requires pt passthrough)
        inputnumber: {
            button: {
                borderRadius: '{border.radius.md}', // 4px for ± buttons
            },
            colorScheme: {
                light: {
                    button: {
                        background:        'color-mix(in srgb, #105072 20%, transparent)',
                        hoverBackground:   'color-mix(in srgb, #105072 35%, transparent)',
                        activeBackground:  'color-mix(in srgb, #105072 50%, transparent)',
                        borderColor:       'color-mix(in srgb, #105072 25%, transparent)',
                        hoverBorderColor:  'color-mix(in srgb, #105072 40%, transparent)',
                        activeBorderColor: 'color-mix(in srgb, #105072 55%, transparent)',
                        color:             '#105072',
                        hoverColor:        '{dorston.600}',
                        activeColor:       '{dorston.700}',
                    },
                },
                dark: {
                    button: {
                        background:        'color-mix(in srgb, {dorston.300} 15%, transparent)',
                        hoverBackground:   'color-mix(in srgb, {dorston.300} 25%, transparent)',
                        activeBackground:  'color-mix(in srgb, {dorston.300} 40%, transparent)',
                        borderColor:       'color-mix(in srgb, {dorston.300} 30%, transparent)',
                        color:             '{dorston.300}',
                        hoverColor:        '{dorston.200}',
                        activeColor:       '{dorston.100}',
                    },
                },
            },
        },

        // ── Tag / Badge ────────────────────────────────────────────────────
        // Matches Figma badge design: rounded-md (6px), small padding, muted bg
        tag: {
            root: {
                borderRadius: '{border.radius.md}', // 6px
                padding:      '0.125rem 0.375rem',   // ~h-5 px-1.5
                fontSize:     '0.75rem',
                fontWeight:   '500',
            },
            colorScheme: {
                light: {
                    // primary tag → light brand bg + brand text (info badge style)
                    primary: {
                        background: '{dorston.50}',
                        color:      '{dorston.700}',
                    },
                    // secondary tag → neutral gray-50 + muted text
                    secondary: {
                        background: '{surface.50}',
                        color:      '{surface.500}',
                    },
                },
                dark: {
                    primary: {
                        background: 'color-mix(in srgb, {dorston.500} 20%, transparent)',
                        color:      '{dorston.300}',
                    },
                    secondary: {
                        background: '{surface.800}',
                        color:      '{surface.300}',
                    },
                },
            },
        },
    },
});

const appName = import.meta.env.VITE_APP_NAME || 'Dorston';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(VueKonva)
            .use(PrimeVue, {
                theme: {
                    preset: CustomPreset,
                    options: {
                        darkModeSelector: '.dark',
                    }
                },
            })
            .use(createPinia())
            .mount(el);
    },
    progress: {
        color: '#105072',
    },
});

// This will set light / dark mode on page load...
// initializeTheme();
