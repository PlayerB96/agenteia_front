<template>
  <header class="mb-6 md:mb-8 flex flex-wrap justify-between items-start gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-agent-text mb-2 tracking-tight">
        Centro de Control
      </h1>
      <p class="text-agent-text-muted text-sm md:text-base">
        Gestiona tus agentes y configuraciones
      </p>
      <p v-if="user" class="text-agent-text-muted/80 text-xs mt-1 font-mono">
        {{ user.name || user.email }}
      </p>
    </div>
    <div class="flex items-center gap-2 self-center">
      <button
        @click="toggleTheme"
        class="p-2.5 rounded-lg transition-colors bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text-muted hover:text-agent-text border border-agent-border"
        title="Cambiar tema"
      >
        <MoonStar v-if="theme === 'dark'" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>
      <button
        @click="handleLogout"
        class="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
      >
        <LogOut class="w-4 h-4" />
        <span class="hidden sm:inline">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { MoonStar, Sun, LogOut } from 'lucide-vue-next'
import { useAuth } from '../utils/useAuth'

const { user, logout } = useAuth()
const theme = inject('theme')
const toggleTheme = inject('toggleTheme')

const handleLogout = () => {
  logout()
}
</script>
