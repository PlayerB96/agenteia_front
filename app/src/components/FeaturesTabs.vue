<script setup>
import { ref } from 'vue'
import { Target, Briefcase, Server, BarChart, ShoppingCart, Laptop, Megaphone, MessageCircleMore } from 'lucide-vue-next'

const props = defineProps({
  activeTab: String
})

const emit = defineEmits(['update:activeTab'])

const tabs = ref([
  { id: 'comercial', label: 'Agente Comercial', icon: ShoppingCart },
  { id: 'sistemas', label: 'Agente Sistemas', icon: Laptop },
  { id: 'soporte', label: 'Agente Soporte', icon: MessageCircleMore },
  { id: 'marketing', label: 'Agente Marketing', icon: Megaphone },
])
</script>

<template>
  <div class="border-b border-agent-border mb-6">
    <div class="flex gap-1 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all whitespace-nowrap',
          activeTab === tab.id
            ? 'text-agent-500 border-b-2 border-agent-500'
            : 'text-agent-text-muted hover:text-agent-text'
        ]"
        @click="emit('update:activeTab', tab.id)"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
