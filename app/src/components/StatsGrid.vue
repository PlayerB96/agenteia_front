<script setup>
import { Building2, Bot, MessageSquare, Zap } from 'lucide-vue-next'

defineProps({
  stats: Object
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex justify-between items-center mb-4">
        <span class="text-agent-text-muted text-sm uppercase tracking-wider font-semibold">Empresas Activas</span>
        <div class="w-10 h-10 rounded-lg bg-agent-500/15 flex items-center justify-center">
          <Building2 class="w-5 h-5 text-agent-500" />
        </div>
      </div>
      <div class="text-3xl font-bold text-agent-text mb-1">{{ stats.activeCompanies ?? 0 }}</div>
      <div class="text-sm text-agent-500 flex items-center gap-1 font-medium">
        <span>↑</span> 12% este mes
      </div>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex justify-between items-center mb-4">
        <span class="text-agent-text-muted text-sm uppercase tracking-wider font-semibold">Canales conectados</span>
        <div class="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Bot class="w-5 h-5 text-amber-500" />
        </div>
      </div>
      <div class="text-3xl font-bold text-agent-text mb-1">{{ stats.totalAgents ?? 0 }}</div>
      <div class="text-sm text-agent-500 flex items-center gap-1 font-medium">
        <span>↑</span> 8% este mes
      </div>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex justify-between items-center mb-4">
        <span class="text-agent-text-muted text-sm uppercase tracking-wider font-semibold">Última interacción</span>
        <div class="w-10 h-10 rounded-lg bg-agent-500/15 flex items-center justify-center">
          <MessageSquare class="w-5 h-5 text-agent-500" />
        </div>
      </div>
      <div class="text-3xl font-bold text-agent-text mb-1">{{ stats.messagesTotal ?? 0 }}</div>
      <div class="text-sm text-agent-500 flex items-center gap-1 font-medium">
        <span>↑</span> 24% vs ayer
      </div>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex justify-between items-center mb-4">
        <span class="text-agent-text-muted text-sm uppercase tracking-wider font-semibold">Conversaciones</span>
        <div class="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Zap class="w-5 h-5 text-amber-500" />
        </div>
      </div>
      <div class="text-3xl font-bold text-agent-text mb-1">{{ stats.uptime ?? 0 }}%</div>
      <div class="text-sm text-agent-500 font-medium">Óptimo</div>
    </div>
  </div>
</template>
