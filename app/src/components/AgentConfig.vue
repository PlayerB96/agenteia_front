<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();

const goToAgentChat = (agent) => {
  if (agent && agent.name) {
    const agentUrl = agent.name.replace(/\s+/g, '_');
    router.push(`/company/${encodeURIComponent(agentUrl)}`);
  }
};
import { showSwalAlert } from './SwalAlert.js';
import { Plus, Power, PowerOff, Edit, Trash2 } from "lucide-vue-next";
import ModalAddAgent from "./ModalAddAgent.vue";
const props = defineProps({
  agents: Array,
});

const showAddModal = ref(false);
const modalMode = ref("add");
const selectedAgent = ref(null);

const openAdd = () => {
  if (props.agents && props.agents.length >= 4) {
    showSwalAlert({
      icon: 'warning',
      title: 'Límite alcanzado',
      text: 'Ya tienes creados todos los agentes permitidos (4).',
    });
    return;
  }
  modalMode.value = "add";
  selectedAgent.value = null;
  showAddModal.value = true;
};

const openEdit = (agent) => {
  modalMode.value = "edit";
  selectedAgent.value = { ...agent };
  showAddModal.value = true;
};

const reloadAgents = () => {}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-agent-text">Mis Agentes IA</h2>
      <button
        @click="openAdd"
        class="flex items-center gap-2 px-4 py-2.5 bg-agent-500 hover:bg-agent-600 text-white rounded-xl font-semibold transition-colors"
      >
        <Plus class="w-4 h-4" />
        Nuevo Agente
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="agent in agents"
        :key="agent.id"
        class="bg-agent-surface border border-agent-border rounded-xl p-4 sm:p-6 hover:border-agent-500/40 cursor-pointer transition-all duration-200"
        @click="goToAgentChat(agent)"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-agent-text mb-1 break-words">
              {{ agent.name }}
            </h3>
            <p class="text-sm text-agent-text-muted break-words">{{ agent.description }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0',
              agent.active
                ? 'bg-agent-500/20 text-agent-500 border border-agent-500/30'
                : 'bg-agent-surface-elevated text-agent-text-muted border border-agent-border',
            ]"
          >
            {{ agent.active ? "Activo" : "Inactivo" }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <div v-if="agent.features.length === 0">
            <span class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-agent-surface-elevated text-agent-text-muted border border-agent-border">
              Sin canales configurados
            </span>
          </div>
          <span
            v-else
            v-for="feature in agent.features"
            :key="feature.name"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs',
              feature.enabled
                ? 'bg-agent-500/15 text-agent-500 border border-agent-500/30'
                : 'bg-agent-surface-elevated text-agent-text-muted border border-agent-border',
            ]"
          >
            <component :is="feature.icon" class="w-3.5 h-3.5" />
            {{ feature.name }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-agent-border">
          <div>
            <p class="text-xs text-agent-text-muted mb-1 font-medium">Mensajes</p>
            <p class="text-lg font-semibold text-agent-text">
              {{ agent.messagesHandled.toLocaleString() }}
            </p>
          </div>
          <div>
            <p class="text-xs text-agent-text-muted mb-1 font-medium">Tiempo Resp.</p>
            <p class="text-lg font-semibold text-agent-text">
              {{ agent.avgResponseTime }}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text rounded-lg text-sm font-medium border border-agent-border transition-colors"
            @click.stop="openEdit(agent)"
          >
            <Edit class="w-4 h-4" />
            Editar
          </button>
          <button
            :class="[
              'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors',
              agent.active
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30'
                : 'bg-agent-500/10 hover:bg-agent-500/20 text-agent-500 border-agent-500/30',
            ]"
          >
            <component :is="agent.active ? PowerOff : Power" class="w-4 h-4" />
          </button>
          <button
            class="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm transition-colors"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="agents.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-agent-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-agent-border">
        <Plus class="w-10 h-10 text-agent-text-muted" />
      </div>
      <h3 class="text-xl font-semibold text-agent-text mb-2">
        No tienes agentes aún
      </h3>
      <p class="text-agent-text-muted mb-6">Crea tu primer agente IA para comenzar</p>
      <button
        @click="openAdd"
        class="px-6 py-3 bg-agent-500 hover:bg-agent-600 text-white rounded-xl font-semibold transition-colors"
      >
        Crear Agente
      </button>
    </div>

    <ModalAddAgent
      v-model="showAddModal"
      :mode="'modalMode'"
      :agent="selectedAgent"
      @handleSave="reloadAgents"
    />
  </div>
</template>
