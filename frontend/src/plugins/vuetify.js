/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#304FFD',
          'on-primary': '#fff',
          secondary: '#FF965D',
          'on-secondary': '#fff',
          success: '#28C76F',
          'on-success': '#fff',
          info: '#00CFE8',
          'on-info': '#fff',
          warning: '#FF9F43',
          'on-warning': '#fff',
          error: '#EA5455',
          background: '#F8F7FA',
          'on-background': '#2F2B3D',
          'on-surface': '#2F2B3D',
          'on-surface-variant': '#FFF',
          'grey-50': '#FAFAFA',
          'grey-100': '#F5F5F5',
          'grey-200': '#EEEEEE',
          'grey-300': '#E0E0E0',
          'grey-400': '#BDBDBD',
          'grey-500': '#9E9E9E',
          'grey-600': '#757575',
          'grey-700': '#616161',
          'grey-800': '#424242',
          'grey-900': '#212121',
          'perfect-scrollbar-thumb': '#DBDADE',
          'skin-bordered-background': '#fff',
          'skin-bordered-surface': '#fff'
        },

        variables: {
          'code-color': '#d400ff',
          'overlay-scrim-background': '#4C4E64',
          'tooltip-background': '#4A5072',
          'overlay-scrim-opacity': 0.5,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.06,
          'activated-opacity': 0.16,
          'pressed-opacity': 0.14,
          'dragged-opacity': 0.1,
          'disabled-opacity': 0.42,
          'border-color': '#2F2B3D',
          'border-opacity': 0.16,
          'high-emphasis-opacity': 0.78,
          'medium-emphasis-opacity': 0.68,
          'switch-opacity': 0.2,
          'switch-disabled-track-opacity': 0.3,
          'switch-disabled-thumb-opacity': 0.4,
          'switch-checked-disabled-opacity': 0.3,

          // Shadows
          'shadow-key-umbra-color': '#2F2B3D'
        }
      }
    }
  },
})
