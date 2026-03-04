<script setup>
import { ref, computed } from "vue";
import { Menu, X, LogOut, Users, Settings, MoonStar, Sun } from "lucide-vue-next";
import { useAuth } from "../utils/useAuth";
import AgentConfig from "../components/AgentConfig.vue";
import CompanyStats from "../components/CompanyStats.vue";
import { mockAgents } from "../data/mockAgents.js";
import { inject } from 'vue'

const { user, logout } = useAuth();
const currentView = ref("agents");
const currentSubtab = ref("chat-agente");
const mobileMenuOpen = ref(false);
const agents = ref(mockAgents);
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')

const stats = computed(() => ({
  totalAgents: agents.value.length,
  activeAgents: agents.value.filter((a) => a.active).length,
  totalMessages: agents.value.reduce((sum, a) => sum + a.messagesHandled, 0),
  channelsActive: "2",
}));

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = () => {
  logout();
};
</script>

<template>
  <div class="flex min-h-screen bg-agent-bg text-agent-text font-display">
    <button
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-agent-surface border border-agent-border rounded-lg text-agent-text hover:bg-agent-surface-elevated transition-colors"
    >
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    />

    <CompanySidebar
      :current-view="currentView"
      :mobile-open="mobileMenuOpen"
      :current-subtab="currentSubtab"
      @update:current-view="currentView = $event; mobileMenuOpen = false"
      @update:current-subtab="currentSubtab = $event"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
      <header class="mb-6 md:mb-8 flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-agent-text mb-2 tracking-tight">
            Centro de Control
          </h1>
          <p class="text-agent-text-muted text-sm md:text-base">
            Gestiona tus agentes IA y configuraciones
          </p>
          <p v-if="user" class="text-agent-text-muted/80 text-xs mt-1 font-mono">
            {{ user.name || user.email }}
          </p>
        </div>
        <div class="flex items-center gap-2 self-center">
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-lg transition-colors bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text-muted hover:text-agent-text border border-agent-border"
            title="Cambiar tema"
          >
            <MoonStar v-if="theme === 'dark'" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5" />
          </button>
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <CompanyStats :stats="stats" />

      <div class="mt-8">
        <AgentConfig v-if="currentView === 'agents'" :agents="agents" />

        <div
          v-else-if="currentView === 'users'"
          class="bg-agent-surface border border-agent-border rounded-xl p-10 text-center"
        >
          <Users class="w-16 h-16 mx-auto text-agent-text-muted mb-4" />
          <h3 class="text-xl font-semibold text-agent-text mb-2">
            Gestión de Usuarios
          </h3>
          <p class="text-agent-text-muted">
            Próximamente: Invita y gestiona usuarios de tu empresa
          </p>
        </div>

        <div
          v-else-if="currentView === 'settings'"
          class="bg-agent-surface border border-agent-border rounded-xl p-10 text-center"
        >
          <Settings class="w-16 h-16 mx-auto text-agent-text-muted mb-4" />
          <h3 class="text-xl font-semibold text-agent-text mb-2">
            Configuración
          </h3>
          <p class="text-agent-text-muted">
            Próximamente: Configura tu empresa y preferencias
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
