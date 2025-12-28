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
import Nora from '@primeuix/themes/nora';
import { createPinia } from 'pinia';

// Custom preset with muted neutral colors for better eye comfort
const CustomPreset = definePreset(Nora, {
    semantic: {
        primary: {
            50: '{zinc.100}',
            100: '{zinc.200}',
            200: '{zinc.300}',
            300: '{zinc.400}',
            400: '{zinc.500}',
            500: '{zinc.600}',
            600: '{zinc.700}',
            700: '{zinc.800}',
            800: '{zinc.800}',
            900: '{zinc.900}',
            950: '{zinc.900}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{zinc.800}',
                    contrastColor: '{zinc.50}',
                    hoverColor: '{zinc.700}',
                    activeColor: '{zinc.900}'
                }
            },
            dark: {
                primary: {
                    color: '{zinc.300}',
                    contrastColor: '{zinc.900}',
                    hoverColor: '{zinc.400}',
                    activeColor: '{zinc.200}'
                }
            }
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
