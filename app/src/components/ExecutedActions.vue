<template>
  <div v-if="showExecuteButton" class="flex flex-wrap justify-center gap-2 mb-1">
    <button
      @click="$emit('executeButton')"
      class="px-4 py-2.5 rounded-lg bg-agent-500 hover:bg-agent-600 text-white font-semibold transition-colors"
    >
      DOCUMENTAR
    </button>
  </div>
</template>
<script setup>
defineProps({
  showExecuteButton: { type: Boolean, required: true },
})
</script>
