<template>
  <div v-if="showExecuteButton" class="flex flex-wrap justify-center gap-1.5 mb-0.5">
    <button
      @click="$emit('executeButton')"
      class="px-3 py-1.5 rounded-md text-xs font-semibold bg-agent-500 hover:bg-agent-600 text-white"
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
