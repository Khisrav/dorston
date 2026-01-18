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
            50: '{neutral.100}',
            100: '{neutral.200}',
            200: '{neutral.300}',
            300: '{neutral.400}',
            400: '{neutral.500}',
            500: '{neutral.600}',
            600: '{neutral.700}',
            700: '{neutral.800}',
            800: '{neutral.800}',
            900: '{neutral.900}',
            950: '{neutral.900}'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{neutral.800}',
                    contrastColor: '{neutral.50}',
                    hoverColor: '{neutral.700}',
                    activeColor: '{neutral.900}'
                }
            },
            dark: {
                primary: {
                    color: '{neutral.300}',
                    contrastColor: '{neutral.950}',
                    hoverColor: '{neutral.400}',
                    activeColor: '{neutral.200}',
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
        },
    },
    components: {
        toggleswitch: {
            handle: {
                borderRadius: '0'
            },
            colorScheme: {
                light: {
                    root: {
                        borderRadius: '0'
                    }
                },
                dark: {
                    root: {
                        borderRadius: '0'
                    }
                }
            }
        },
        button: {
            colorScheme: {
                light: {
                    root: {
                    }
                },
                dark: {
                    outlined: {
                        primary: {
                            borderColor: '{neutral.700}',
                        }
                    }
                }
            }
        }
    }
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
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();
