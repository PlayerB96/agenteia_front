import { createAuth0 } from '@auth0/auth0-vue'
import { createApp, ref, watch } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import CompanySidebar from './components/CompanySidebar.vue'
import './assets/tailwind.css'
import { APP_VERSION } from './config/app.js'

const app = createApp(App)

// Versión de la app (footer, etc.)
app.provide('appVersion', APP_VERSION)

// Registrar CompanySidebar globalmente
app.component('CompanySidebar', CompanySidebar)

// 🌗 Tema global
const theme = ref(localStorage.getItem('theme') || 'dark')

// Aplicar tema
const applyTheme = (value) => {
  if (value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

applyTheme(theme.value)

// Escuchar cambios
watch(theme, (val) => {
  applyTheme(val)
  localStorage.setItem('theme', val)
})

// Exponer globalmente
app.provide('theme', theme)
app.provide('toggleTheme', () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
})


app.use(router)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true
  })
)


app.mount('#app')
