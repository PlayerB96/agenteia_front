<script setup>
import { ref, computed } from "vue";
import { Menu, X, Users, Settings } from "lucide-vue-next";
import AgentConfig from "../components/AgentConfig.vue";
import CompanyStats from "../components/CompanyStats.vue";
import Navbar from "../components/Navbar.vue";
import { mockAgents } from "../data/mockAgents.js";
const currentView = ref("agents");
const currentSubtab = ref("chat-agente");
const mobileMenuOpen = ref(false);
const agents = ref(mockAgents);

const stats = computed(() => ({
  totalAgents: agents.value.length,
  activeAgents: agents.value.filter((a) => a.active).length,
  totalMessages: agents.value.reduce((sum, a) => sum + a.messagesHandled, 0),
  channelsActive: "2",
}));

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-agent-bg text-agent-text font-display">
    <Navbar
      title="Centro de Control"
      description="Gestiona tus agentes IA y configuraciones"
    >
      <template #leading>
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2.5 bg-agent-surface-elevated border border-agent-border rounded-lg text-agent-text hover:bg-agent-border/50 transition-colors"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </template>
    </Navbar>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    />

    <div class="flex flex-1 min-h-0">
      <CompanySidebar
        :current-view="currentView"
        :mobile-open="mobileMenuOpen"
        :current-subtab="currentSubtab"
        @update:current-view="currentView = $event; mobileMenuOpen = false"
        @update:current-subtab="currentSubtab = $event"
      />

      <main class="flex-1 overflow-y-auto min-w-0 p-4 md:p-6 lg:p-8">
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
  </div>
</template>
