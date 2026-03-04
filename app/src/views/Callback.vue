<script setup>
import { watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../utils/useAuth";

const { isAuthenticated, isLoading, error, userRole, user } = useAuth();
const router = useRouter();

const handleRedirect = () => {
  // DEBUG: 5 seconds delay to see the logs
  setTimeout(() => {
    if (isAuthenticated.value) {
      if (userRole.value === "saas_owner") {
        router.push("/admin");
      } else {
        router.push("/company");
      }
    } else if (!isLoading.value && !isAuthenticated.value) {
      router.push("/login");
    }
  }, 5000);
};

watch([isLoading, isAuthenticated], () => {
  if (!isLoading.value) {
    handleRedirect();
  }
});

onMounted(() => {
  if (!isLoading.value) {
    handleRedirect();
  }
});
</script>

<template>
  <div class="min-h-screen bg-agent-bg flex items-center justify-center font-display">
    <div class="text-center">
      <div
        v-if="error"
        class="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg max-w-md mx-auto"
      >
        <h3 class="text-red-400 font-bold mb-2">Error de Autenticación</h3>
        <p class="text-red-300 text-sm">{{ error.message }}</p>
        <button
          @click="router.push('/login')"
          class="mt-4 px-4 py-2.5 bg-agent-500 hover:bg-agent-600 text-white rounded-lg font-semibold transition-colors"
        >
          Volver al Login
        </button>
      </div>

      <div v-else>
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"
        ></div>
        <h2 class="text-2xl font-bold text-white mb-2">
          Verificando sesión...
        </h2>
        <p class="text-agent-text-muted mb-4">Verificando credenciales…</p>

        <div
          class="mt-8 p-4 bg-agent-surface rounded-xl text-left text-xs font-mono text-agent-text-muted overflow-auto max-w-lg max-h-60 mx-auto border border-agent-border"
        >
          <p class="font-bold text-agent-text mb-2">
            Debug Info (Auth0 User Data):
          </p>
          <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
