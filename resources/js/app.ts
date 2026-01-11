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
import Lara from '@primeuix/themes/lara';
import { createPinia } from 'pinia';

// Custom preset with muted neutral colors for better eye comfort
const CustomPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{gray.100}',
            100: '{gray.200}',
            200: '{gray.300}',
            300: '{gray.400}',
            400: '{gray.500}',
            500: '{gray.600}',
            600: '{gray.700}',
            700: '{gray.800}',
            800: '{gray.800}',
            900: '{gray.900}',
            950: '{gray.900}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{gray.800}',
                    contrastColor: '{gray.50}',
                    hoverColor: '{gray.700}',
                    activeColor: '{gray.900}'
                }
            },
            dark: {
                primary: {
                    color: '{gray.300}',
                    contrastColor: '{gray.900}',
                    hoverColor: '{gray.400}',
                    activeColor: '{gray.200}'
                }
            }
        },
        borderRadius: {
            none: '0',
            xs: '0',
            sm: '0',
            md: '0',
            lg: '0',
            xl: '0'
        }
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();
