<script setup>
import { ref } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  enabled: Boolean,
  features: Object
})

const emit = defineEmits(['update:enabled', 'update:features'])

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const toggleEnabled = () => {
  emit('update:enabled', !props.enabled)
}

const updateFeature = (featureKey, field, value) => {
  const updated = { ...props.features }
  if (!updated[featureKey]) {
    updated[featureKey] = { enabled: false, config: {} }
  }
  if (field === 'enabled') {
    updated[featureKey].enabled = value
  } else {
    if (!updated[featureKey].config) {
      updated[featureKey].config = {}
    }
    updated[featureKey].config[field] = value
  }
  emit('update:features', updated)
}
</script>

<template>
  <div class="bg-agent-surface-elevated border border-agent-border rounded-xl overflow-hidden mb-4">
    <!-- Header -->
    <div class="p-4 flex justify-between items-center bg-agent-surface-elevated">
      <div class="flex items-center gap-3 flex-1 cursor-pointer" @click="toggleExpand">
        <component :is="isExpanded ? ChevronDown : ChevronRight" class="w-4 h-4 text-agent-text transition-transform" />
        <h4 class="font-medium text-sm md:text-base text-agent-text">{{ title }}</h4>
      </div>
      
      <label class="relative inline-flex items-center cursor-pointer ml-4">
        <input 
          type="checkbox" 
          :checked="enabled"
          @change="toggleEnabled"
          class="sr-only peer"
        >
        <div class="w-11 h-6 bg-agent-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-agent-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-agent-500"></div>
      </label>
    </div>

    <!-- Content -->
    <div 
      v-if="isExpanded && enabled"
      class="p-4 md:p-6 border-t border-agent-border bg-agent-surface space-y-4"
    >
      <slot :updateFeature="updateFeature" :features="features"></slot>
    </div>
  </div>
</template>
