<script setup>
import { useRouter } from 'vue-router'
import { Building2, BarChart3, Settings, FileText, ArrowBigLeftDash } from 'lucide-vue-next'

defineProps({
  currentView: { type: String, default: '' },
  mobileOpen: { type: Boolean, default: false },
  title: { type: String, default: 'Agenteia' },
  subtitle: { type: String, default: 'Panel Admin' },
  navItems: {
    type: Array,
    default: () => [
      { id: 'companies', label: 'Empresas', icon: Building2 },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'settings', label: 'Configuración', icon: Settings },
      { id: 'logs', label: 'Logs', icon: FileText },
    ]
  }
})

const emit = defineEmits(['update:currentView'])
const router = useRouter()

const handleItemClick = (item) => {
  if (item.to) {
    router.push(item.to)
  } else {
    emit('update:currentView', item.id)
  }
}
</script>

<template>
  <aside
    :class="[
      'flex flex-col w-72 bg-agent-surface border-r border-agent-border py-8 transition-transform duration-300 ease-out flex-shrink-0',
      'fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="px-8 pb-8">
      <h1 class="text-xl font-bold text-agent-500 tracking-tight flex items-center gap-2">
        <Settings class="w-6 h-6 md:w-7 md:h-7" />
        {{ title }}
      </h1>
      <p class="text-xs text-agent-text-muted mt-1 font-medium pl-10">{{ subtitle }}</p>
    </div>

    <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
      <div
        v-for="item in navItems"
        :key="item.id"
        :class="[
          'flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-medium',
          currentView === item.id && !item.to
            ? 'bg-agent-500/15 text-agent-500 border border-agent-500/30'
            : 'text-agent-text-muted hover:bg-agent-surface-elevated hover:text-agent-text border border-transparent'
        ]"
        @click="handleItemClick(item)"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span>{{ item.label }}</span>
      </div>
    </nav>
  </aside>
</template>
