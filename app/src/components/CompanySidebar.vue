<script setup>
const props = defineProps({
  currentView: String,
  mobileOpen: Boolean,
  currentSubtab: String
});

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const emit = defineEmits(["update:current-view", "update:current-subtab"]);
const router = useRouter();
const route = useRoute();

const agents = ref([])
const selectedAgent = ref('')

onMounted(() => {
  try {
    const stored = localStorage.getItem('agents')
    if (stored) {
      agents.value = JSON.parse(stored)
      if (agents.value.length > 0) selectedAgent.value = agents.value[0].name
    }
  } catch {}
})

import { Bot, Users, Settings } from "lucide-vue-next";

const menuItems = [
  { id: "agents", label: "Agentes IA", icon: Bot, subtabs: [
    { id: "chat-agente", label: "Chat Agente" }
  ] },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "settings", label: "Configuración", icon: Settings },
];
</script>

<template>
  <aside
    :class="[
      'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-agent-surface border-r border-agent-border transform transition-transform duration-300 ease-out',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex flex-col h-full p-4">
      <!-- Logo -->
      <div class="mb-10 pt-4">
        <h2 class="text-xl font-bold text-agent-500 tracking-tight">
          Agenteia
        </h2>
        <p class="text-xs text-agent-text-muted mt-1 font-medium">Centro de Control</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 space-y-1">
        <div v-for="item in menuItems" :key="item.id">
          <button
            @click="() => {
              emit('update:current-view', item.id);
              if (item.id === 'agents') router.push('/company');
            }"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
              currentView === item.id
                ? 'bg-agent-500/15 text-agent-500 border border-agent-500/30'
                : 'text-agent-text-muted hover:bg-agent-surface-elevated hover:text-agent-text border border-transparent',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span>{{ item.label }}</span>
          </button>
          <!-- Subtabs -->
          <div v-if="item.subtabs && currentView === item.id" class="ml-6 mt-1 flex flex-col gap-0.5 pl-4 border-l border-agent-border">
            <div v-for="sub in item.subtabs" :key="sub.id">
              <div v-if="sub.id === 'chat-agente'">
                <button
                  @click="() => {
                    emit('update:current-subtab', sub.id);
                    router.push('/company/chat');
                  }"
                  :class="[
                    'w-full text-left px-3 py-2 rounded-lg transition-all text-sm',
                    (props.currentSubtab === sub.id && route.path.startsWith('/company/chat'))
                      ? 'bg-agent-500/10 text-agent-500 font-medium'
                      : 'text-agent-text-muted hover:text-agent-text hover:bg-agent-surface-elevated/50',
                  ]"
                >
                  {{ sub.label }}
                </button>
              </div>
              <button
                v-else
                @click="() => emit('update:current-subtab', sub.id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-all text-sm',
                  props.currentSubtab === sub.id
                    ? 'bg-agent-500/10 text-agent-500 font-medium'
                    : 'text-agent-text-muted hover:text-agent-text hover:bg-agent-surface-elevated/50',
                ]"
              >
                {{ sub.label }}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Footer -->
      <div class="pt-4 border-t border-agent-border">
        <p class="text-xs text-agent-text-muted text-center font-mono">v1.0</p>
      </div>
    </div>
  </aside>
</template>
