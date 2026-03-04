<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="action in actions"
      :key="action.id"
      @click="$emit('select', action)"
      class="px-4 py-2 rounded-lg text-sm font-medium bg-agent-surface-elevated border border-agent-border text-agent-text hover:border-agent-500/50 hover:text-agent-500 transition-colors"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  actions: { type: Array, required: true }
})
</script>
