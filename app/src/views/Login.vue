<script setup>
import { watch, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../utils/useAuth";
import { CircleAlert } from "lucide-vue-next";
import mockUsers from "../data/mockUsers.json";

const { login, loginWithCredentials, loginWithPassword, isAuthenticated, userRole, isLoading, error: authError } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const demoUser = mockUsers[0];
const isSubmitting = ref(false);
const localError = ref("");

// Error mostrado: validación local o error de Auth0
const error = computed(() => {
  if (localError.value) return { message: localError.value };
  return authError?.value ?? null;
});

// Validar email + clave en el componente (mock o Auth0)
const handleSubmit = async (e) => {
  e.preventDefault();
  localError.value = "";
  isSubmitting.value = true;

  const em = email.value?.trim();
  const pw = password.value;
  if (!em || !pw) {
    localError.value = "Por favor ingresa email y contraseña";
    isSubmitting.value = false;
    return;
  }

  // 1. Intentar Auth0 primero (cuentas reales: rol desde Auth0 igual que con Google)
  const authResult = await loginWithPassword(em, pw);
  if (authResult.ok) {
    isSubmitting.value = false;
    redirectUser();
    return;
  }

  // 2. Fallback: mock/demo (usuarios de mockUsers.json para pruebas)
  const mockResult = loginWithCredentials(em, pw);
  if (mockResult.ok) {
    isSubmitting.value = false;
    redirectUser();
    return;
  }

  isSubmitting.value = false;
  localError.value = authResult.message || "Email o contraseña incorrectos";
};

const redirectUser = () => {
  if (!isAuthenticated.value) return
  const role = userRole.value || "new_user"
  if (role === "saas_owner") {
    router.push("/admin")
  } else if (role === "company_admin") {
    router.push("/company")
  } else {
    router.push("/onboarding")
  }
};

watch([isAuthenticated, userRole, isLoading], () => {
  if (!isLoading.value) {
    redirectUser();
  }
});

onMounted(() => {
  if (!isLoading.value) {
    redirectUser();
  }
});
</script>

<template>
  <div class="min-h-screen bg-agent-bg flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Grid + noise -->
    <div class="absolute inset-0 bg-[length:48px_48px] bg-grid-pattern opacity-60" />
    <div class="absolute inset-0 bg-noise opacity-[0.02]" />

    <!-- Accent orbs - industrial teal -->
    <div class="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-agent-500/10 rounded-full blur-[120px]" />
    <div class="absolute bottom-1/3 right-1/4 w-[320px] h-[320px] bg-amber-500/5 rounded-full blur-[80px]" />

    <div class="relative w-full max-w-md text-center">
      <!-- Brand -->
      <div class="mb-10 animate-fade-in">
        <h1 class="text-5xl font-bold tracking-tight mb-2">
          <span class="text-agent-500">Agenteia</span>
        </h1>
        <p class="text-agent-text-muted text-base font-medium">Plataforma de Agentes Empresariales</p>
      </div>

      <!-- Card -->
      <div
        class="bg-agent-surface/80 backdrop-blur-xl border border-agent-border rounded-2xl shadow-xl p-8 animate-slide-up"
        style="animation-delay: 0.1s">
        <div v-if="isLoading" class="py-12">
          <div
            class="w-14 h-14 border-2 border-agent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p class="text-agent-text-muted animate-pulse font-medium">Conectando…</p>
        </div>

        <div v-else-if="error" class="py-8">
          <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
            <div class="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4">
              <CircleAlert class="w-6 h-6 text-red-400" />
            </div>
            <p class="text-red-400 font-semibold mb-2">Error de Autenticación</p>
            <p class="text-red-300/90 text-sm">{{ error.message }}</p>
          </div>
          <button @click="localError = ''"
            class="w-full py-3.5 px-6 bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text font-semibold rounded-xl transition-colors border border-agent-border">
            Intentar de nuevo
          </button>
        </div>

        <div v-else class="py-4">
          <h2 class="text-2xl font-bold text-agent-text mb-2">Bienvenido</h2>
          <p class="text-agent-text-muted mb-6">Ingresa con tu cuenta para continuar</p>

          <form @submit="handleSubmit" class="space-y-4">
            <div class="text-left">
              <label class="block text-sm font-medium text-agent-text-muted mb-1.5">Email</label>
              <input v-model="email" type="email" required
                class="w-full px-4 py-3 bg-agent-surface border border-agent-border rounded-xl text-agent-text placeholder-agent-text-muted/60 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent"
                placeholder="tu@email.com" />
            </div>
            <div class="text-left">
              <label class="block text-sm font-medium text-agent-text-muted mb-1.5">Contraseña</label>
              <input v-model="password" type="password" required
                class="w-full px-4 py-3 bg-agent-surface border border-agent-border rounded-xl text-agent-text placeholder-agent-text-muted/60 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent"
                placeholder="••••••••" />
            </div>
            <button type="submit" :disabled="isSubmitting"
              class="w-full py-3.5 px-6 bg-agent-500 hover:bg-agent-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all border border-agent-500 shadow-lg shadow-agent-500/25">
              {{ isSubmitting ? "Entrando…" : "Iniciar sesión" }}
            </button>
          </form>
          <div class="mt-6 pt-4 border-t border-agent-border/50">
            <p class="text-xs text-agent-text-muted">
              Si deseas probar la demo, usa:
            </p>
            <p class="mt-1 font-mono text-sm text-agent-500">
              {{ demoUser.email }} / {{ demoUser.password }}
            </p>
          </div>
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-agent-border"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-agent-surface/80 text-agent-text-muted">o continuar con</span>
            </div>
          </div>

          <button type="button" @click="login({ authorizationParams: { connection: 'google-oauth2' } })"
            class="group w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all border border-slate-200 hover:border-agent-500/30 shadow-sm">
            <div class="p-1 bg-white rounded-full">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <span>Continuar con Google</span>
          </button>


        </div>
      </div>
    </div>
  </div>
</template>
