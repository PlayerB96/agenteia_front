<template>
  <div class="mb-3 flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div class="flex items-end gap-2 min-w-0 max-w-[85%] sm:max-w-[75%]" :class="msg.role === 'user' && 'flex-row-reverse'">
      <div class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" :class="isUser ? 'bg-agent-500/20' : 'bg-agent-surface-elevated border border-agent-border'">
        <component :is="msg.role === 'user' ? User : Bot" class="w-4 h-4" :class="isUser ? 'text-agent-500' : 'text-agent-text-muted'" />
      </div>
      <span
        class="px-4 py-2.5 rounded-xl text-sm font-medium
          break-words whitespace-pre-wrap leading-relaxed
          transition-colors"
        :class="bubbleClass"
      >
        {{ msg.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { User, Bot } from 'lucide-vue-next'
const props = defineProps({
  msg: { type: Object, required: true },
  messageError: { type: Boolean, default: false },
})

const isUser = computed(() => props.msg.role === 'user')

const bubbleClass = computed(() => {
  if (props.messageError) {
    return isUser.value
      ? 'bg-agent-500 text-white'
      : 'bg-red-500/20 text-red-400 border border-red-500/30'
  }
  return isUser.value
    ? 'bg-agent-500 text-white shadow-sm'
    : 'bg-agent-surface-elevated text-agent-text border border-agent-border'
})
</script>
