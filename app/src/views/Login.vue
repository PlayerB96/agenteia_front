<script setup>
import { watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../utils/useAuth";
import { CircleAlert } from "lucide-vue-next";

const { login, isAuthenticated, userRole, isLoading, error } = useAuth();
const router = useRouter();
const route = useRoute();

const redirectUser = () => {
  if (isAuthenticated.value && userRole.value) {
    if (userRole.value === "saas_owner") {
      router.push("/admin");
    } else if (userRole.value === "company_admin") {
      router.push("/company");
    } else if (userRole.value === "new_user") {
      router.push("/onboarding");
    }
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
      <div class="bg-agent-surface/80 backdrop-blur-xl border border-agent-border rounded-2xl shadow-xl p-8 animate-slide-up" style="animation-delay: 0.1s">
        <div v-if="isLoading" class="py-12">
          <div class="w-14 h-14 border-2 border-agent-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
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
          <button
            @click="login"
            class="w-full py-3.5 px-6 bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text font-semibold rounded-xl transition-colors border border-agent-border"
          >
            Intentar de nuevo
          </button>
        </div>

        <div v-else class="py-4">
          <h2 class="text-2xl font-bold text-agent-text mb-2">Bienvenido</h2>
          <p class="text-agent-text-muted mb-8">Selecciona tu cuenta para continuar</p>

          <div class="space-y-3">
            <button
              @click="login({ authorizationParams: { connection: 'google-oauth2' } })"
              class="group w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all border border-slate-200 hover:border-agent-500/30 shadow-sm"
            >
              <div class="p-1 bg-white rounded-full">
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <span>Continuar con Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
