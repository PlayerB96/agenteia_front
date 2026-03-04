<template>
  <div class="flex flex-wrap justify-center gap-1.5">
    <button
      v-for="action in actions"
      :key="action.id"
      @click="$emit('select', action)"
      class="px-3 py-1.5 rounded-md text-xs font-medium bg-agent-surface-elevated border border-agent-border text-agent-text hover:border-agent-500/50 hover:text-agent-500"
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
