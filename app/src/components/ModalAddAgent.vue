<script setup>
import { reactive, ref, watch } from "vue";
import { X, ClipboardList, Loader, MessageSquare, Mail, Smartphone, Webhook, Brain } from "lucide-vue-next";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  agent: { type: Object, default: null }
});

// Canales disponibles (hardcodeados)
const AVAILABLE_FEATURES = [
  { name: 'WhatsApp', icon: MessageSquare },
  { name: 'Email', icon: Mail },
  { name: 'SMS', icon: Smartphone },
  { name: 'Webhooks', icon: Webhook },
  { name: 'AI Custom', icon: Brain },
];

const modalAgent = reactive({
  id: null,
  name: "",
  description: "",
  active: true,
  features: [],
});

const saving = ref(false);
const emit = defineEmits(["update:modelValue", "saved"]);

function isFeatureEnabled(featureName) {
  const f = modalAgent.features.find(x => x.name === featureName);
  return f ? f.enabled : false;
}

function setFeatureEnabled(featureName, enabled) {
  const idx = modalAgent.features.findIndex(x => x.name === featureName);
  if (idx >= 0) {
    modalAgent.features[idx].enabled = enabled;
  } else {
    const feat = AVAILABLE_FEATURES.find(x => x.name === featureName);
    if (feat) modalAgent.features.push({ ...feat, enabled });
  }
}

function resetForm() {
  modalAgent.id = null;
  modalAgent.name = "";
  modalAgent.description = "";
  modalAgent.active = true;
  modalAgent.features = AVAILABLE_FEATURES.map(f => ({ ...f, enabled: false }));
}

watch(
  () => props.agent,
  (agent) => {
    if (agent) {
      modalAgent.id = agent.id;
      modalAgent.name = agent.name;
      modalAgent.description = agent.description || "";
      modalAgent.active = agent.active ?? true;
      modalAgent.features = (agent.features || []).map(f => ({
        name: f.name,
        icon: f.icon,
        enabled: f.enabled ?? false
      }));
      // Asegurar que todos los canales disponibles estén en la lista
      AVAILABLE_FEATURES.forEach(f => {
        if (!modalAgent.features.some(x => x.name === f.name)) {
          modalAgent.features.push({ ...f, enabled: false });
        }
      });
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const handleSave = () => {
  saving.value = true;
  setTimeout(() => {
    saving.value = false;
    emit("saved");
    emit("update:modelValue", false);
  }, 1000);
};
</script>
<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
    <div class="bg-agent-surface border border-agent-border rounded-xl md:rounded-2xl w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
      <div class="p-4 md:p-6 lg:p-8 border-b border-agent-border flex justify-between items-center sticky top-0 bg-agent-surface z-10">
        <h2 class="text-lg md:text-xl  font-bold text-agent-text">{{ modalAgent.id ? 'Editar Agente' : 'Nuevo Agente' }}</h2>
        <button class="p-2 rounded-lg text-agent-text-muted hover:text-agent-text hover:bg-agent-border/50" @click="emit('update:modelValue', false)">
          <X class="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      <!-- OVERLAY DE LOADING -->
      <div
        v-if="saving"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
      >
        <Loader class="h-10 w-10 text-agent-500 animate-spin" />
        <p class="text-sm text-agent-text-muted font-medium">
          Guardando agente…
        </p>
      </div>

      <div class="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <ClipboardList class="w-4 h-4 md:w-5 md:h-5" />
            Información General
          </h3>
          <div class="space-y-2">
            <label class="text-sm font-medium text-agent-text-muted">Nombre del agente</label>
            <input
              v-model="modalAgent.name"
              type="text"
              class="w-full bg-agent-surface-elevated border border-agent-border rounded-xl px-4 py-3 text-agent-text placeholder-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent"
              placeholder="Ej: Agente Soporte"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-agent-text-muted">Descripción</label>
            <textarea
              v-model="modalAgent.description"
              class="w-full bg-agent-surface-elevated border border-agent-border rounded-xl px-4 py-3 text-agent-text placeholder-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent"
              placeholder="Descripción del agente"
              rows="2"
            ></textarea>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-agent-text-muted">Estado</label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="modalAgent.active"
                class="w-5 h-5 rounded border-agent-border bg-agent-surface-elevated text-agent-500 focus:ring-agent-500"
              />
              <span class="text-agent-text">{{ modalAgent.active ? 'Activo' : 'Inactivo' }}</span>
            </label>
          </div>

          <!-- Canales / Features (mismos que en el card) -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-agent-text-muted">Canales configurados</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="feat in AVAILABLE_FEATURES"
                :key="feat.name"
                type="button"
                @click="setFeatureEnabled(feat.name, !isFeatureEnabled(feat.name))"
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium',
                  isFeatureEnabled(feat.name)
                    ? 'bg-agent-500/15 text-agent-500 border-agent-500/30'
                    : 'bg-agent-surface-elevated text-agent-text-muted border-agent-border hover:border-agent-500/30'
                ]"
              >
                <component :is="feat.icon" class="w-4 h-4" />
                {{ feat.name }}
              </button>
            </div>
          </div>
      </div>
      <div class="p-4 md:p-6 lg:p-8 border-t border-agent-border bg-agent-surface flex flex-col sm:flex-row justify-end md:gap-4 sticky bottom-0">
        <button 
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-medium text-agent-text-muted hover:text-agent-text hover:bg-agent-surface-elevated border border-agent-border order-2 sm:order-1"
          @click="emit('update:modelValue', false)"
        >
          Cancelar
        </button>
        <button 
          :disabled="saving"
          @click="handleSave"
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-semibold text-white bg-agent-500 hover:bg-agent-600 order-1 sm:order-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <!-- Spinner -->
          <Loader
            v-if="saving"
            class="animate-spin h-5 w-5 text-white"
          />

          <!-- Texto -->
          <span>
            <template v-if="saving">
              Guardando...
            </template>
            <template v-else>
              {{ modalAgent.id ? 'Guardar Cambios' : 'Crear Agente' }}
            </template>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>