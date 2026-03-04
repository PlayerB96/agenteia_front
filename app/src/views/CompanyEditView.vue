<script setup>  
  import { ref, markRaw, onMounted, watch } from "vue";
  import { ArrowBigLeftDash, Menu, X } from "lucide-vue-next";
  import Navbar from "../components/Navbar.vue";
  import AdminSidebar from "../components/AdminSidebar.vue";
  import { adminEditNav } from "../config/adminNav.js";
  import CompanyList from "../components/CompanyList.vue";
  import CompanyForm from "../components/CompanyForm.vue";
  import { fetchCompanyById, updateCompany, createCompany, fetchDashboardCompany } from '../services/companyService'
  import { showSwalAlert } from '../components/SwalAlert.js'
  import { useRouter, useRoute } from 'vue-router'
  import { computed } from 'vue'

  const isEdit = computed(() => !!route.params.id)
  const currentView = ref("companies");
  const companies = ref([])
  const showModal = ref(false);
  const mobileMenuOpen = ref(false);
  const StatsAgent = ref({})
  const router = useRouter()
  const route = useRoute()
  const company = ref({})
  const dashboard = ref({})
  const saving = ref(false)
  const loadCompany = async () => {
    company.value = await fetchCompanyById(route.params.id)
  }

  const loadDashboardCompany = async () => {
    dashboard.value = await fetchDashboardCompany(route.params.id)
  }

  
  onMounted(async () => {
    if (isEdit.value) {
      company.value = await fetchCompanyById(route.params.id)
      dashboard.value = await fetchDashboardCompany(route.params.id)
    }
  })

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const goBack = () => {
    router.push('/admin')
  }

  const saveCompany = async (companyData) => {
    if (saving.value) return
    try {
      saving.value = true

      if (companyData.id) {
        // ✏️ UPDATE
        await updateCompany(companyData.id, companyData)
        goBack()
      } else {
        // ➕ CREATE
        await createCompany(companyData)
        goBack()
      }
      showSwalAlert({
        icon: 'success',
        title: 'Guardado',
        text: 'La empresa fue guardada correctamente',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      showSwalAlert({
        icon: 'error',
        title: 'Error',
        text: error.message,
        timer: 1500,
        showConfirmButton: false
      })
    } finally {
      saving.value = false
    }
  }
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden font-display bg-agent-bg text-agent-text">
    <Navbar
      :title="isEdit ? 'Editar Empresa' : 'Nueva Empresa'"
      description="Configura los datos de la empresa"
    >
      <template #leading>
        <button
          @click="goBack"
          class="p-2.5 bg-agent-surface-elevated border border-agent-border rounded-lg text-agent-text hover:bg-agent-border/50 transition-colors mr-2"
          title="Volver"
        >
          <ArrowBigLeftDash class="w-5 h-5"/>
        </button>
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
        :nav-items="adminEditNav"
        title="Agenteia"
        subtitle="Editar Empresa"
        @update:current-view="currentView = $event; mobileMenuOpen = false"
      />

      <main class="flex-1 overflow-y-auto min-w-0 p-4 md:p-6 lg:p-8">
      <CompanyForm
        :company="company"
        :dashboard="dashboard"
        :saving="saving"
        @save="saveCompany"
        @cancel="goBack"
      />
      </main>
    </div>
  </div>
</template>
