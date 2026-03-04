<script setup>
import { Sun, MoonStar, LogOut } from 'lucide-vue-next'
import { useAuth } from '../utils/useAuth'
import { inject } from 'vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const theme = inject('theme')
const toggleTheme = inject('toggleTheme')
const { user, userRole, userRoleDescription, logout, isDemoMode, demoCredentials } = useAuth()
</script>

<template>
  <header
    class="h-16 flex-shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-agent-border bg-agent-surface/95 backdrop-blur supports-[backdrop-filter]:bg-agent-surface/80"
  >
    <div class="flex items-center gap-4 min-w-0 flex-1">
      <slot name="leading" />
      <div class="min-w-0">
        <h1 class="text-lg md:text-xl font-bold text-agent-text truncate">
          {{ title }}
        </h1>
        <p v-if="description" class="text-xs text-agent-text-muted truncate">
          {{ description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <div v-if="user?.email || user?.name" class="hidden sm:block text-right min-w-0 max-w-[140px]">
        <p class="text-xs text-agent-text-muted truncate">
          {{ user.name || user.email }}
        </p>
        <p v-if="userRole" class="text-[10px] text-agent-text-muted/80 truncate">
          {{ userRoleDescription || userRole }}
        </p>
      </div>
      <div v-if="isDemoMode && demoCredentials" class="hidden md:block text-xs font-mono text-agent-text-muted">
        {{ demoCredentials.email }} / {{ demoCredentials.password }}
      </div>
      <button
        @click="toggleTheme"
        class="p-2.5 rounded-lg transition-colors bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text-muted hover:text-agent-text border border-agent-border"
        title="Cambiar tema"
      >
        <MoonStar v-if="theme === 'dark'" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>
      <button
        @click="logout"
        class="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
      >
        <LogOut class="w-5 h-5" />
        <span class="hidden sm:inline">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>
