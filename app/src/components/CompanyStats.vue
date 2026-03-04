<script setup>
defineProps({
  stats: Object,
});

import { TrendingUp, Activity, MessageSquare, Zap } from "lucide-vue-next";
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-agent-500/15 flex items-center justify-center">
          <Activity class="w-5 h-5 text-agent-500" />
        </div>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-agent-text mb-1">
        {{ stats.activeAgents }}
      </p>
      <p class="text-sm text-agent-text-muted font-medium">Agentes Activos</p>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <MessageSquare class="w-5 h-5 text-amber-500" />
        </div>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-agent-text mb-1">
        {{ stats.totalMessages.toLocaleString() }}
      </p>
      <p class="text-sm text-agent-text-muted font-medium">Mensajes Totales</p>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-agent-500/15 flex items-center justify-center">
          <TrendingUp class="w-5 h-5 text-agent-500" />
        </div>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-agent-text mb-1">
        {{ stats.totalAgents }}
      </p>
      <p class="text-sm text-agent-text-muted font-medium">Total Agentes</p>
    </div>

    <div class="bg-agent-surface border border-agent-border rounded-xl p-6 hover:border-agent-500/30 transition-colors">
      <div class="flex items-center justify-between mb-3">
        <div class="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Zap class="w-5 h-5 text-amber-500" />
        </div>
      </div>
      <p class="text-2xl md:text-3xl font-bold text-agent-text mb-1">
        {{ stats.channelsActive }}
      </p>
      <p class="text-sm text-agent-text-muted font-medium">Canales activos</p>
    </div>
  </div>
</template>
