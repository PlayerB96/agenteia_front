<script setup>  
  import { ref, onMounted } from "vue";
  import { Sun, MoonStar, Menu, X, LogOut } from "lucide-vue-next";
  import { useAuth } from "../utils/useAuth";
  import AdminSidebar from "../components/AdminSidebar.vue";
  import StatsGrid from "../components/StatsGrid.vue";
  import CompanyList from "../components/CompanyList.vue";
  import { fetchCompanies, deleteCompany, toggleCompany, fetchDashboard } from '../services/companyService'
  import { showSwalAlert } from '../components/SwalAlert.js'
  import { inject } from 'vue'

  const theme = inject('theme')
  const toggleTheme = inject('toggleTheme')
  
  const { user, logout } = useAuth();
  const currentView = ref("companies");
  const companies = ref([])
  const mobileMenuOpen = ref(false);
  const stats = ref({})

  const loadStats = async () => {
    const data = await fetchDashboard()
    if (data) stats.value = data
  }

  const loadCompanies = async () => {
    companies.value = await fetchCompanies()
  }
  
  onMounted(() => {
    loadCompanies()
  })

  const removeCompany = async (company) => {
    const confirm = await showSwalAlert({
      title: '¿Eliminar empresa?',
      text: `Se eliminará "${company.razonsocial}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!confirm.isConfirmed) return

    try {
      await deleteCompany(company.id)
      await loadCompanies()
      showSwalAlert({
        icon: 'success',
        title: 'Eliminado',
        text: 'Empresa eliminada correctamente'
      })
    } catch (e) {
      console.error(e)
      showSwalAlert({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar'
      })
    }
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const toggleCompanyActive = async (company) => {
    try {
      company.active = company.active ? 0 : 1
      await toggleCompany(company.id, company)
      await loadCompanies()
    } catch (error) {
      console.error('Error cambiando estado:', error)
    }
  }

  const handleLogout = () => {
    logout();
  };
</script>

<template>
  <div class="flex min-h-screen font-display bg-agent-bg text-agent-text">
    <button
      @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-agent-surface border border-agent-border rounded-lg text-agent-text hover:bg-agent-surface-elevated transition-colors"
    >
      <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
      <X v-else class="w-6 h-6" />
    </button>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    />

    <AdminSidebar
      :current-view="currentView"
      :mobile-open="mobileMenuOpen"
      @update:current-view="currentView = $event; mobileMenuOpen = false"
    />

    <main class="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pt-16 lg:pt-8">
      <header class="mb-6 md:mb-8 flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-agent-text mb-2 tracking-tight">
            Dashboard de Configuración
          </h1>
          <p class="text-agent-text-muted text-sm md:text-base">
            Gestiona las empresas y sus configuraciones de agentes IA
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

      <StatsGrid :stats="stats" />

      <CompanyList 
        :companies="companies" 
        @delete="removeCompany"
        @toggle-active="toggleCompanyActive" 
      />
    </main>
  </div>
</template>
