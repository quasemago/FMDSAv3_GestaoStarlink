/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import VueTheMask from 'vue-the-mask'
import VueApexCharts from "vue3-apexcharts";

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(VueTheMask)
    .use(VueApexCharts)
}
