import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2E7D32',
          secondary: '#424242',
          success: '#4CAF50',
          warning: '#FB8C00',
          error: '#FF5252',
          info: '#1976D2',
        },
      },
    },
  },
})
