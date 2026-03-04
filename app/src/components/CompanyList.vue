<script setup>
import { computed } from 'vue'
import { MessageSquare, Mail, Smartphone, Brain, Trash2, Loader2 } from 'lucide-vue-next';
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const error = ref(null)

const props = defineProps({
  companies: Array,
  togglingCompanyId: { type: [Number, String], default: null }
})

const activeCompanies = computed(() =>
  props.companies?.filter(c => Number(c.active) === 1) ?? []
)

const inactiveCompanies = computed(() =>
  props.companies?.filter(c => Number(c.active) === 0) ?? []
)

const emit = defineEmits(['openModal', 'delete', 'toggle-active'])

const getActiveFeatures = (company) => {
  const active = []
  if (company.featureCategories) {
    const cats = company.featureCategories
    if (cats.marketing?.comunicacion?.features) {
      if (cats.marketing.comunicacion.features.whatsapp?.enabled) {
        active.push({ name: 'WhatsApp', icon: MessageSquare, enabled: true })
      }
      if (cats.marketing.comunicacion.features.email?.enabled) {
        active.push({ name: 'Email', icon: Mail, enabled: true })
      }
      if (cats.marketing.comunicacion.features.sms?.enabled) {
        active.push({ name: 'SMS', icon: Smartphone, enabled: true })
      }
    }
    if (cats.ecommerce?.compra?.features?.asistente?.enabled) {
      active.push({ name: 'AI Custom', icon: Brain, enabled: true })
    }
  } else if (Array.isArray(company.features)) {
    return company.features
  }
  return active  
}

const router = useRouter()

const goEdit = (id) => {
  router.push(`/companies/${id}/edit`)
}
</script>

<template>
  <section class="bg-agent-surface border border-agent-border rounded-xl p-4 md:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-xl font-bold text-agent-text">Empresas Configuradas</h2>
      <button 
        class="w-full sm:w-auto bg-agent-500 hover:bg-agent-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        @click="router.push({ name: 'NewCompany' })"
      >
        <span class="text-lg">+</span>
        Nueva Empresa
      </button>
    </div>

    <div class="space-y-4">
      <h3 class="text-sm uppercase text-agent-500 font-bold tracking-wider mb-2">
        Empresas Activas ({{ activeCompanies.length }})
      </h3>

      <div class="space-y-4">
        <div
          v-for="company in activeCompanies"
          :key="company.id"
          class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <div
            @click="goEdit(company.id)"
            class="flex-1 min-w-0 bg-agent-surface-elevated border border-agent-border hover:border-agent-500/40 rounded-xl p-4 md:p-6 cursor-pointer"
          >
            <h3 class="text-lg md:text-xl font-semibold text-agent-text mb-1">{{ company.razonsocial }}</h3>
            <p class="text-agent-text-muted text-sm">{{ company.actividad_economica }}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span 
              :class="[
                'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap',
                company.active == 1 ? 'bg-agent-500/15 text-agent-500 border border-agent-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              ]"
            >
              {{ company.active == 1 ? 'Activo' : 'Inactivo' }}
            </span>
            <button
              @click="togglingCompanyId !== company.id && $emit('toggle-active', company)"
              :disabled="togglingCompanyId === company.id"
              class="relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 disabled:cursor-wait"
              :class="[
                togglingCompanyId === company.id ? 'bg-agent-500/50 justify-center' : company.active ? 'bg-agent-500 justify-end' : 'bg-agent-border justify-start',
                togglingCompanyId === company.id ? 'cursor-wait' : ''
              ]"
              title="Activar / Desactivar"
            >
              <span
                v-if="togglingCompanyId === company.id"
                class="flex h-4 w-4 items-center justify-center"
              >
                <Loader2 class="h-3 w-3 text-white animate-spin" />
              </span>
              <span
                v-else
                class="block h-4 w-4 shrink-0 rounded-full bg-white shadow-sm"
              />
            </button>
            <button
              @click="$emit('delete', company)"
              class="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <h3 class="text-sm uppercase text-red-400 font-bold tracking-wider mt-8 mb-2">
        Empresas Inactivas ({{ inactiveCompanies.length }})
      </h3>

      <div class="space-y-4">
        <div
          v-for="company in inactiveCompanies"
          :key="company.id"
          class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        >
          <div
            @click="goEdit(company.id)"
            class="flex-1 min-w-0 bg-agent-surface-elevated border border-agent-border hover:border-red-500/30 rounded-xl p-4 md:p-6 cursor-pointer"
          >
            <h3 class="text-lg md:text-xl font-semibold text-agent-text mb-1">{{ company.razonsocial }}</h3>
            <p class="text-agent-text-muted text-sm">{{ company.actividad_economica }}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span 
              :class="[
                'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap',
                company.active == 1 ? 'bg-agent-500/15 text-agent-500 border border-agent-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
              ]"
            >
              {{ company.active == 1 ? 'Activo' : 'Inactivo' }}
            </span>
            <button
              @click="togglingCompanyId !== company.id && $emit('toggle-active', company)"
              :disabled="togglingCompanyId === company.id"
              class="relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 disabled:cursor-wait"
              :class="[
                togglingCompanyId === company.id ? 'bg-agent-500/50 justify-center' : company.active ? 'bg-agent-500 justify-end' : 'bg-agent-border justify-start',
                togglingCompanyId === company.id ? 'cursor-wait' : ''
              ]"
              title="Activar / Desactivar"
            >
              <span
                v-if="togglingCompanyId === company.id"
                class="flex h-4 w-4 items-center justify-center"
              >
                <Loader2 class="h-3 w-3 text-white animate-spin" />
              </span>
              <span
                v-else
                class="block h-4 w-4 shrink-0 rounded-full bg-white shadow-sm"
              />
            </button>
            <button
              @click="$emit('delete', company)"
              class="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
