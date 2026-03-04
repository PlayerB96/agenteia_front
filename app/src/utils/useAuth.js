import { computed, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import mockUsers from '../data/mockUsers.json'

const DEMO_STORAGE_KEY = 'agenteia_demo_session'
const PASSWORD_GRANT_KEY = 'agenteia_password_session'

// Estado global del modo demo (persiste en sessionStorage)
const demoSession = ref(null)

// Sesión por Resource Owner Password (Auth0 token endpoint)
const passwordSessionRef = ref(null)
try {
  const stored = sessionStorage.getItem(PASSWORD_GRANT_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    if (data.expires_at > Date.now()) passwordSessionRef.value = data
    else sessionStorage.removeItem(PASSWORD_GRANT_KEY)
  }
} catch (_) {}
try {
  const stored = sessionStorage.getItem(DEMO_STORAGE_KEY)
  if (stored) demoSession.value = JSON.parse(stored)
} catch (_) {}

export function useAuth() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0()

  const isDemoMode = computed(() => !!demoSession.value)
  const isPasswordSession = computed(() => !!passwordSessionRef.value)

  const effectiveIsAuthenticated = computed(() =>
    isDemoMode.value || isPasswordSession.value ? true : isAuthenticated.value
  )
  const effectiveIsLoading = computed(() =>
    isDemoMode.value || isPasswordSession.value ? false : isLoading.value
  )
  const effectiveUser = computed(() => {
    if (isDemoMode.value && demoSession.value) {
      const m = demoSession.value
      return { email: m.email, name: m.name, sub: `demo|${m.id}` }
    }
    if (isPasswordSession.value && passwordSessionRef.value) {
      return passwordSessionRef.value.user
    }
    return user.value
  })

  const userRole = computed(() => {
    let role
    if (isDemoMode.value && demoSession.value) {
      // Solo demo usa mockUsers
      role = demoSession.value.role
    } else if (isPasswordSession.value && passwordSessionRef.value?.user) {
      const u = passwordSessionRef.value.user
      const r = u['https://agenteia.com/role']
      role = typeof r === 'object' ? r?.name : r
      // No usar mockUsers como fallback: rol viene solo de Auth0
    } else if (user.value?.email) {
      const auth0Role = user.value['https://agenteia.com/role']
      role = auth0Role ? (typeof auth0Role === 'object' ? auth0Role?.name : auth0Role) : null
      // No usar mockUsers como fallback: rol viene solo de Auth0
    }
    // Sin rol en Auth0 = usuario nuevo (vista por defecto)
    return role && String(role).trim() ? role : 'new_user'
  })

  /** Descripción del rol desde Auth0 (cuando el claim incluye description). Para demo/mock usa el nombre. */
  const userRoleDescription = computed(() => {
    const u = effectiveUser.value
    if (!u) return ''
    const r = u['https://agenteia.com/role']
    // Auth0: rol como objeto { name, description }
    if (r && typeof r === 'object' && r.description) return r.description
    // Auth0: claim separado para descripción
    const desc = u['https://agenteia.com/role_description']
    if (desc) return desc
    // Demo/mock: sin descripción de Auth0
    return userRole.value || ''
  })

  const hasRole = (role) => userRole.value === role

  const handleLogin = (options) => {
    loginWithRedirect(options)
  }

  const loginDemo = (userType = 'saas_owner') => {
    const demo = mockUsers.find(u => u.role === userType) || mockUsers[0]
    const sess = {
      id: demo.id,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      password: demo.password
    }
    demoSession.value = sess
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sess))
  }

  const loginWithCredentials = (email, password) => {
    const demo = mockUsers.find(u => u.email === email && u.password === password)
    if (!demo) return { ok: false, message: 'Credenciales incorrectas' }
    const sess = {
      id: demo.id,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      password: demo.password
    }
    demoSession.value = sess
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sess))
    return { ok: true }
  }

  const loginWithPassword = async (email, password) => {
    try {
      const domain = import.meta.env.VITE_AUTH0_DOMAIN
      const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
      const connection = import.meta.env.VITE_AUTH0_DATABASE_CONNECTION || 'Username-Password-Authentication'

      const tokenRes = await fetch(`https://${domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
          username: email,
          password,
          client_id: clientId,
          realm: connection
        })
      })

      const tokenData = await tokenRes.json()

      if (!tokenRes.ok) {
        const msg = tokenData.error_description || tokenData.error || 'Email o contraseña incorrectos'
        return { ok: false, message: msg }
      }

      const userRes = await fetch(`https://${domain}/userinfo`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      })
      if (!userRes.ok) return { ok: false, message: 'Error al obtener datos del usuario' }
      const userData = await userRes.json()

      const session = {
        access_token: tokenData.access_token,
        id_token: tokenData.id_token,
        expires_at: Date.now() + (tokenData.expires_in || 86400) * 1000,
        user: userData
      }
      passwordSessionRef.value = session
      sessionStorage.setItem(PASSWORD_GRANT_KEY, JSON.stringify(session))
      return { ok: true }
    } catch (err) {
      return { ok: false, message: 'Error de conexión. Intenta de nuevo.' }
    }
  }

  const handleLogout = () => {
    if (isDemoMode.value) {
      demoSession.value = null
      sessionStorage.removeItem(DEMO_STORAGE_KEY)
    } else if (isPasswordSession.value) {
      passwordSessionRef.value = null
      sessionStorage.removeItem(PASSWORD_GRANT_KEY)
      window.location.href = '/login'
    } else {
      logout({ logoutParams: { returnTo: window.location.origin } })
    }
  }

  return {
    isAuthenticated: effectiveIsAuthenticated,
    isLoading: effectiveIsLoading,
    user: effectiveUser,
    error,
    userRole,
    userRoleDescription,
    hasRole,
    login: handleLogin,
    loginDemo,
    loginWithCredentials,
    loginWithPassword,
    logout: handleLogout,
    isDemoMode,
    demoCredentials: computed(() => (isDemoMode.value ? demoSession.value : null))
  }
}
