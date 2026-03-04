<script setup>  
  import { ref, onMounted } from "vue";
  import { Menu, X } from "lucide-vue-next";
  import Navbar from "../components/Navbar.vue";
  import AdminSidebar from "../components/AdminSidebar.vue";
  import { adminDashboardNav } from "../config/adminNav.js";
  import StatsGrid from "../components/StatsGrid.vue";
  import CompanyList from "../components/CompanyList.vue";
  import { fetchCompanies, deleteCompany, toggleCompany, fetchDashboard } from '../services/companyService'
  import { showSwalAlert } from '../components/SwalAlert.js'

  const currentView = ref("companies");
  const companies = ref([])
  const mobileMenuOpen = ref(false);
  const stats = ref({})
  const togglingCompanyId = ref(null)

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
    togglingCompanyId.value = company.id
    try {
      const newActive = Number(company.active) === 1 ? 0 : 1
      const payload = { ...company, active: newActive }
      await toggleCompany(company.id, payload)
      companies.value = await fetchCompanies()
    } catch (error) {
      console.error('Error cambiando estado:', error)
    } finally {
      togglingCompanyId.value = null
    }
  }

</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden font-display bg-agent-bg text-agent-text">
    <Navbar
      title="Dashboard de Configuración"
      description="Gestiona las empresas y sus configuraciones de agentes IA"
    >
      <template #leading>
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2.5 bg-agent-surface-elevated border border-agent-border rounded-lg text-agent-text hover:bg-agent-border/50 transition-colors"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </template>
    </Navbar>

    <div
      v-if="mobileMenuOpen"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
      @click="mobileMenuOpen = false"
    />

    <div class="flex flex-1 min-h-0">
      <AdminSidebar
        :current-view="currentView"
        :mobile-open="mobileMenuOpen"
        :nav-items="adminDashboardNav"
        title="Agenteia"
        subtitle="Panel Admin"
        @update:current-view="currentView = $event; mobileMenuOpen = false"
      />

      <main class="flex-1 overflow-y-auto min-w-0 p-4 md:p-6 lg:p-8">
        <StatsGrid :stats="stats" />

      <CompanyList 
        :companies="companies"
        :toggling-company-id="togglingCompanyId"
        @delete="removeCompany"
        @toggle-active="toggleCompanyActive" 
      />
      </main>
    </div>
  </div>
</template>
