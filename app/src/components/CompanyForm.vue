<script setup>
import { ref, watch } from 'vue'
import { ClipboardList, 
  Database, 
  Settings, 
  X, 
  Users, 
  Zap, 
  TrendingUp, 
  MessageCircle, 
  Activity, 
  Brain,
  MessageCircleCode,
  FileText,
  Download,
  RefreshCw,
  Loader
 } from 'lucide-vue-next'
import FeaturesTabs from './FeaturesTabs.vue'
import FeatureAccordion from './FeatureAccordion.vue'
import StatsAgent from './StatsAgent.vue'
import { showSwalAlert } from './SwalAlert.js'
import { computed } from 'vue'

const props = defineProps({
  company: Object,
  dashboard: Object,
  saving: Boolean
})

const activeTab = ref('marketing')

const getEmptyModalData = () => ({
  id: null,
  ruc: '',
  razonsocial: '',
  nombre_comercial: '',
  actividad_economica: '',
  representante_legal: '',
  tipo_empresa: '',

  active: 1,
  options: {
    max_tokens: '',
  },
  channels: {
    whatsapp: '',
    email: '',
    sms: '',
    webhook: '',
    aicustom: ''
  },
  featureCategories: {
    marketing: {
      comunicacion: {
        enabled: false,
        features: {
          whatsapp: { enabled: false, config: { apiKey: '', templateId: '' } },
          email: { enabled: false, config: { provider: 'sendgrid', apiKey: '' } },
          sms: { enabled: false, config: { provider: 'twilio' } }
        }
      },
      analisis: {
        enabled: false,
        features: {
          recomendaciones: { enabled: false, config: { algorithm: 'hybrid' } },
          segmentacion: { enabled: false, config: { autoUpdate: true } },
          pricing: { enabled: false, config: { strategy: 'dynamic' } }
        }
      }
    },
    comercial: {
      atencion: {
        enabled: false,
        features: {
          chatbot: { enabled: false, config: { channels: ['web'], language: 'es' } },
          reclamos: { enabled: false, config: { autoEscalate: true } },
          postventa: { enabled: false, config: { surveyDelay: '24h' } }
        }
      },
      ventas: {
        enabled: false,
        features: {
          leadScoring: { enabled: false, config: { threshold: 70 } },
          crossSelling: { enabled: false, config: { maxSuggestions: 3 } },
          carrito: { enabled: false, config: { sequence: 'aggressive' } }
        }
      }
    },
    sistemas: {
      inventario: {
        enabled: false,
        features: {
          prediccion: { enabled: false, config: { horizon: '30d' } },
          alertas: { enabled: false, config: { minStock: 10 } },
          compras: { enabled: false, config: { approvalRequired: true } }
        }
      },
      logistica: {
        enabled: false,
        features: {
          tracking: { enabled: false, config: { provider: 'dhl' } },
          rutas: { enabled: false, config: { optimization: 'distance' } },
          rma: { enabled: false, config: { autoApprove: false } }
        }
      }
    },
    analisis: {
      bi: {
        enabled: false,
        features: {
          dashboards: { enabled: false, config: { refreshRate: '1h' } },
          sentimientos: { enabled: false, config: { sources: ['twitter', 'facebook'] } },
          tendencias: { enabled: false, config: { model: 'lstm' } }
        }
      }
    },
    ecommerce: {
      compra: {
        enabled: false,
        features: {
          asistente: { enabled: false, config: { personality: 'friendly' } },
          busqueda: { enabled: false, config: { semantic: true } },
          comparador: { enabled: false, config: { attributes: ['price', 'specs'] } }
        }
      },
      omnicanal: {
        enabled: false,
        features: {
          sync: { enabled: false, config: { interval: '5m' } },
          clickCollect: { enabled: false, config: { locations: [] } },
          fidelizacion: { enabled: false, config: { pointsRatio: 0.1 } }
        }
      }
    }
  }
})

const modalData = ref(getEmptyModalData())

const emit = defineEmits(['save', 'cancel'])
const form = ref({ ...props.company })

watch(() => props.company, (newCompany) => {
  if (newCompany) {
    // Deep copy to avoid reference issues
    const data = JSON.parse(JSON.stringify(newCompany))

    // Ensure all structure exists even if old data format
    const empty = getEmptyModalData()
    
    if (!data.featureCategories) {
      data.featureCategories = empty.featureCategories

      // Ensure options structure exists
      if (!data.options) {
        data.options = empty.options
      }

      if(!data.channels) {
        data.channels = empty.channels
      }

      // Map legacy features if they exist and is Array
      if (Array.isArray(data.features)) {
        console.log('Features found (Array):', data.features)
        
        data.features.forEach(f => {
          const name = f.name.toLowerCase()
          
          if (name === 'whatsapp') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.whatsapp = {
              enabled: f.enabled,
              config: { apiKey: '', templateId: '' }
            }
          }
          
          if (name === 'email') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.email = {
              enabled: f.enabled,
              config: { provider: 'sendgrid', apiKey: '' }
            }
          }
          
          if (name === 'sms') {
            data.featureCategories.marketing.comunicacion.enabled = true
            data.featureCategories.marketing.comunicacion.features.sms = {
              enabled: f.enabled,
              config: { provider: 'twilio' }
            }
          }
          
          if (name === 'ai custom' || name === 'aimodel') {
            data.featureCategories.ecommerce.compra.enabled = true
            data.featureCategories.ecommerce.compra.features.asistente = {
              enabled: f.enabled,
              config: { personality: 'friendly' }
            }
          }
        })
      }
    }

    modalData.value = data
  } else {
    modalData.value = getEmptyModalData()
  }
}, { immediate: true })

const updateSubcategory = (category, subcategory, field, value) => {
  if (field === 'enabled') {
    modalData.value.featureCategories[category][subcategory].enabled = value
  } else if (field === 'features') {
    modalData.value.featureCategories[category][subcategory].features = value
  }
}
const handleSave = () => {
  if (!modalData.value.ruc || !modalData.value.razonsocial || !modalData.value.actividad_economica || !modalData.value.representante_legal || !modalData.value.tipo_empresa) {
    showSwalAlert({
      icon: 'warning',
      title: 'Error',
      text: 'Por favor, complete todos los campos obligatorios.'
    })
    return
  }
  emit('save', {
    id: modalData.value.id ?? null,

    // datos reales de empresa
    ruc: String(modalData.value.ruc).trim(),
    razonsocial: modalData.value.razonsocial,
    nombre_comercial: modalData.value.nombre_comercial,
    actividad_economica: modalData.value.actividad_economica,
    representante_legal: modalData.value.representante_legal,
    tipo_empresa: modalData.value.tipo_empresa,

    active: true,
    options: {
      max_tokens: modalData.value.options.max_tokens,
      timeout: modalData.value.options.timeout,
    },
    channels: {
      whatsapp: '',
      email: '',
      sms: '',
      webhook: '',
      aicustom: ''
    }
  })
}

const handleCancel = () => {
  emit('cancel')
}

const statsAgent = computed(() => {
  if (!props.dashboard?.data) return []

  return [
    {
      label: 'Agentes Activos',
      value: Number(props.dashboard.data.agentes_activos ?? 0),
      icon: Activity,
      color: 'from-green-500 to-teal-500'
    },
    {
      label: 'Mensajes totales',
      value: Number(props.dashboard.data.mensajes_totales ?? 0),
      icon: MessageCircle,
      color: 'from-purple-500 to-fuchsia-500'
    },
    {
      label: 'Tasa Éxito (%)',
      value: Number(props.dashboard.data.tasa_exito ?? 0),
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500'
    },
    {
      label: 'Servicios Activos',
      value: Number(props.dashboard.data.servicios_activos ?? 0),
      icon: Zap,
      color: 'from-blue-500 to-sky-500'
    }
  ]
})
</script>

<template>
  <div class="relative bg-agent-surface border border-agent-border rounded-xl p-6">
    <div class="flex flex-col h-full">
      <!-- OVERLAY DE LOADING -->
      <div
        v-if="saving"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm
              z-50 flex flex-col items-center justify-center gap-4"
      >
        <Loader class="h-10 w-10 text-agent-500 animate-spin" />

        <p class="text-sm text-agent-text-muted font-medium">
          Guardando empresa…
        </p>
      </div>

      <div class="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <!-- Información General -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <ClipboardList class="w-4 h-4 md:w-5 md:h-5" />
            Información General
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Ruc de la Empresa</label>
              <input 
                type="number" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.ruc"
                placeholder="Ej: 1234567890"
                inputmode="numeric"
                max-length="11"
              >
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Razon Social de la Empresa</label>
              <input 
                type="text" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.razonsocial"
                placeholder="Ej: Tech Solutions Inc."
              >
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Nombre Comercial de la Empresa</label>
              <input 
                type="text" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.nombre_comercial"
                placeholder="Ej: Tech Solutions"
              >
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Actividad Economica de la Empresa</label>
              <input 
                type="text" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.actividad_economica"
                placeholder="Ej: Desarrollo de Software"
              >
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Representante Legal</label>
              <input 
                type="text" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.representante_legal"
                placeholder="Ej: Juan Perez"
              >
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-agent-text-muted">Tipo de Empresa</label>
              <input 
                type="text" 
                class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" 
                v-model="modalData.tipo_empresa"
                placeholder="Ej: S.A."
              >
            </div>
          </div>
        </div>

        <!-- Funcionalidades por Categoría -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <Users class="w-4 h-4 md:w-5 md:h-5" />
            Vista General de Agentes
          </h3>
          <StatsAgent :stats-agent="statsAgent" />
        </div>
        
        <!-- Opciones Avanzadas -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <Brain class="w-4 h-4 md:w-5 md:h-5" />
            Opciones Avanzadas
          </h3>
          <div class="space-y-2">
            <label class="text-sm font-medium text-agent-text-muted">Max Tokens</label>
            <input type="number" class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" v-model="modalData.options.max_tokens" placeholder="maximo tokens">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-agent-text-muted">Timeout (segundos)</label>
            <input type="number" class="w-full bg-agent-surface-elevated border border-agent-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-agent-500 focus:border-transparent text-agent-text" v-model="modalData.options.timeout" placeholder="timeout">
          </div>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.options.debug" id="debug">
              <label for="debug" class="text-sm font-medium text-agent-text-muted w-full h-full">Modo Debug</label>
            </div>
          </div>
        </div>
        <!-- Acciones -->
         <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <Activity class="w-4 h-4 md:w-5 md:h-5" />
            Acciones
          </h3>
          <div class="flex gap-2">
            <button
              @click="probeAgent"
              class="
                w-full
                flex items-center justify-center gap-2
                bg-agent-500 hover:bg-agent-600
                text-white font-bold
                py-2.5 rounded-lg
              "
            >
              <MessageCircleCode class="w-4 h-4 md:w-5 md:h-5" />
              <span>Probar Agente</span>
            </button>
            <button @click="viewLogs"
              class="
                w-full
                flex items-center justify-center gap-2
                bg-agent-500/80 hover:bg-agent-500
                text-white font-bold
                py-2.5 rounded-lg
              "
            >
              <FileText class="w-4 h-4 md:w-5 md:h-5" />
              Ver Logs
            </button>
          </div>
          <div class="flex gap-2">
            <button @click="exportConfig"
              class="
                w-full
                flex items-center justify-center gap-2
                bg-agent-500 hover:bg-agent-600
                text-white font-bold
                py-2.5 rounded-lg
              "
            >
              <Download class="w-4 h-4 md:w-5 md:h-5" />
              Exportar Config
            </button>
            <button @click="resetConfig"
              class="
                w-full
                flex items-center justify-center gap-2
                bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text border border-agent-border font-bold
                py-2.5 rounded-lg
              "
            >
              <RefreshCw class="w-4 h-4 md:w-5 md:h-5" />
              Reestablecer
            </button>
          </div>
        </div>
        
        <!-- Opciones Avanzadas -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <MessageCircle class="w-4 h-4 md:w-5 md:h-5" />
            Canales de Comunicacion
          </h3>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.channels.whatsapp" id="whatsapp">
              <label for="whatsapp" class="font-medium text-agent-text-muted w-full h-full">Whatsapp</label>
            </div>
          </div>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.channels.email" id="email">
              <label for="email" class="font-medium text-agent-text-muted w-full h-full">Email</label>
            </div>
          </div>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.channels.sms" id="sms">
              <label for="sms" class="font-medium text-agent-text-muted w-full h-full">SMS</label>
            </div>
          </div>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.channels.webhook" id="webhook">
              <label for="webhook" class="font-medium text-agent-text-muted w-full h-full">Webhook</label>
            </div>
          </div>
          <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
            <div class="flex items-center gap-3">
              <input type="checkbox" class="bg-agent-surface-elevated" v-model="modalData.channels.aicustom" id="aicustom">
              <label for="aicustom" class="font-medium text-agent-text-muted w-full h-full">AICustom</label>
            </div>
          </div>
        </div>
        <!-- Funcionalidades por Categoría -->
        <div class="space-y-3 md:space-y-4">
          <h3 class="text-base md:text-lg font-semibold text-agent-500 flex items-center gap-2">
            <Settings class="w-4 h-4 md:w-5 md:h-5" />
            Funcionalidades e Inteligencia
          </h3>
          
          <FeaturesTabs 
            :active-tab="activeTab" 
            @update:activeTab="activeTab = $event" 
          />

          <!-- MARKETING TABS -->
          <div v-if="activeTab === 'marketing'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-agent-text">
            <FeatureAccordion 
              title="Comunicación Automatizada"
              :enabled="modalData.featureCategories.marketing.comunicacion.enabled"
              :features="modalData.featureCategories.marketing.comunicacion.features"
              @update:enabled="updateSubcategory('marketing', 'comunicacion', 'enabled', $event)"
              @update:features="updateSubcategory('marketing', 'comunicacion', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="space-y-4">
                  <!-- WhatsApp -->
                  <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-medium text-agent-text">Campañas WhatsApp/Telegram</span>
                      <input type="checkbox" :checked="features.whatsapp?.enabled" @change="updateFeature('whatsapp', 'enabled', $event.target.checked)">
                    </div>
                    <div v-if="features.whatsapp?.enabled" class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-agent-500/30">
                      <input type="text" placeholder="API Key" class="bg-agent-surface border-agent-border rounded px-3 py-1.5 text-sm w-full" :value="features.whatsapp.config.apiKey" @input="updateFeature('whatsapp', 'apiKey', $event.target.value)">
                      <input type="text" placeholder="Template ID" class="bg-agent-surface border-agent-border rounded px-3 py-1.5 text-sm w-full" :value="features.whatsapp.config.templateId" @input="updateFeature('whatsapp', 'templateId', $event.target.value)">
                    </div>
                  </div>
                  <!-- Email -->
                  <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-medium text-agent-text">Email Marketing Inteligente</span>
                      <input type="checkbox" :checked="features.email?.enabled" @change="updateFeature('email', 'enabled', $event.target.checked)">
                    </div>
                    <div v-if="features.email?.enabled" class="pl-4 border-l-2 border-agent-500/30">
                      <select class="bg-agent-surface border-agent-border rounded px-3 py-1.5 text-sm w-full" :value="features.email.config.provider" @change="updateFeature('email', 'provider', $event.target.value)">
                        <option value="sendgrid">SendGrid</option>
                        <option value="aws">AWS SES</option>
                        <option value="mailgun">Mailgun</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </FeatureAccordion>

            <FeatureAccordion 
              title="Análisis y Personalización"
              :enabled="modalData.featureCategories.marketing.analisis.enabled"
              :features="modalData.featureCategories.marketing.analisis.features"
              @update:enabled="updateSubcategory('marketing', 'analisis', 'enabled', $event)"
              @update:features="updateSubcategory('marketing', 'analisis', 'features', $event)"
            >
               <template #default="{ updateFeature, features }">
                <div class="space-y-4">
                  <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border flex items-center justify-between mb-3">
                    <span class="font-medium text-agent-text">Recomendación de Productos</span>
                    <input type="checkbox" :checked="features.recomendaciones?.enabled" @change="updateFeature('recomendaciones', 'enabled', $event.target.checked)">
                  </div>
                  <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border flex items-center justify-between mb-3">
                    <span class="font-medium text-agent-text">Segmentación de Clientes</span>
                    <input type="checkbox" :checked="features.segmentacion?.enabled" @change="updateFeature('segmentacion', 'enabled', $event.target.checked)">
                  </div>
                  <div class="p-3 bg-agent-surface-elevated rounded-lg border border-agent-border flex items-center justify-between mb-3">
                    <span class="font-medium text-agent-text">Optimización de Precios</span>
                    <input type="checkbox" :checked="features.pricing?.enabled" @change="updateFeature('pricing', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
          </div>

          <!-- COMERCIAL TABS -->
          <div v-if="activeTab === 'comercial'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-agent-text">
            <FeatureAccordion 
              title="Atención al Cliente"
              :enabled="modalData.featureCategories.comercial.atencion.enabled"
              :features="modalData.featureCategories.comercial.atencion.features"
               @update:enabled="updateSubcategory('comercial', 'atencion', 'enabled', $event)"
              @update:features="updateSubcategory('comercial', 'atencion', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                <div class="space-y-3">
                   <div class="p-3 bg-agent-surface-elevated/30 rounded-lg border border-agent-border">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">Chatbot Multicanal 24/7</span>
                      <input type="checkbox" :checked="features.chatbot?.enabled" @change="updateFeature('chatbot', 'enabled', $event.target.checked)">
                    </div>
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Gestión de Reclamos Auto</span>
                    <input type="checkbox" :checked="features.reclamos?.enabled" @change="updateFeature('reclamos', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template> -->
            </FeatureAccordion>

             <FeatureAccordion 
              title="Ventas y Conversión"
              :enabled="modalData.featureCategories.comercial.ventas.enabled"
              :features="modalData.featureCategories.comercial.ventas.features"
               @update:enabled="updateSubcategory('comercial', 'ventas', 'enabled', $event)"
              @update:features="updateSubcategory('comercial', 'ventas', 'features', $event)"
            >
              <template #default="{ updateFeature, features }">
                <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Lead Scoring</span>
                    <input type="checkbox" :checked="features.leadScoring?.enabled" @change="updateFeature('leadScoring', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Cross-selling / Up-selling</span>
                    <input type="checkbox" :checked="features.crossSelling?.enabled" @change="updateFeature('crossSelling', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Recuperación de Carritos</span>
                    <input type="checkbox" :checked="features.carrito?.enabled" @change="updateFeature('carrito', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template>
            </FeatureAccordion>
          </div>

          <!-- SISTEMAS TABS -->
           <div v-if="activeTab === 'sistemas'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-agent-text">
             <FeatureAccordion 
              title="Gestión de Inventario"
              :enabled="modalData.featureCategories.sistemas.inventario.enabled"
              :features="modalData.featureCategories.sistemas.inventario.features"
               @update:enabled="updateSubcategory('sistemas', 'inventario', 'enabled', $event)"
              @update:features="updateSubcategory('sistemas', 'inventario', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                 <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Predicción de Demanda</span>
                    <input type="checkbox" :checked="features.prediccion?.enabled" @change="updateFeature('prediccion', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Alertas de Stock</span>
                    <input type="checkbox" :checked="features.alertas?.enabled" @change="updateFeature('alertas', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Optimización de Compras</span>
                    <input type="checkbox" :checked="features.compras?.enabled" @change="updateFeature('compras', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template> -->
            </FeatureAccordion>

             <FeatureAccordion 
              title="Logística y Envíos"
              :enabled="modalData.featureCategories.sistemas.logistica.enabled"
              :features="modalData.featureCategories.sistemas.logistica.features"
               @update:enabled="updateSubcategory('sistemas', 'logistica', 'enabled', $event)"
              @update:features="updateSubcategory('sistemas', 'logistica', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                 <div class="space-y-2">
                   <div class="flex items-center justify-between p-2">
                    <span>Tracking Inteligente (WhatsApp/SMS)</span>
                    <input type="checkbox" :checked="features.tracking?.enabled" @change="updateFeature('tracking', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Optimización de Rutas</span>
                    <input type="checkbox" :checked="features.rutas?.enabled" @change="updateFeature('rutas', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template> -->
            </FeatureAccordion>
           </div>

           <!-- SOPORTE TABS -->
           <div v-if="activeTab === 'soporte'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-agent-text">
             <FeatureAccordion 
              title="Experiencia de Compra"
              :enabled="modalData.featureCategories.ecommerce.compra.enabled"
              :features="modalData.featureCategories.ecommerce.compra.features"
               @update:enabled="updateSubcategory('ecommerce', 'compra', 'enabled', $event)"
              @update:features="updateSubcategory('ecommerce', 'compra', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                 <div class="space-y-3">
                   <div class="p-3 bg-agent-surface-elevated/30 rounded-lg border border-agent-border">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">Asistente de Compras IA</span>
                      <input type="checkbox" :checked="features.asistente?.enabled" @change="updateFeature('asistente', 'enabled', $event.target.checked)">
                    </div>
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Búsqueda Inteligente (NLP)</span>
                    <input type="checkbox" :checked="features.busqueda?.enabled" @change="updateFeature('busqueda', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template> -->
            </FeatureAccordion>

             <FeatureAccordion 
              title="Omnicanalidad"
              :enabled="modalData.featureCategories.ecommerce.omnicanal.enabled"
              :features="modalData.featureCategories.ecommerce.omnicanal.features"
               @update:enabled="updateSubcategory('ecommerce', 'omnicanal', 'enabled', $event)"
              @update:features="updateSubcategory('ecommerce', 'omnicanal', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                <div class="flex items-center justify-between p-2">
                    <span>Sincronización Online/Offline</span>
                    <input type="checkbox" :checked="features.sync?.enabled" @change="updateFeature('sync', 'enabled', $event.target.checked)">
                </div>
                 <div class="flex items-center justify-between p-2">
                    <span>Click & Collect</span>
                    <input type="checkbox" :checked="features.clickCollect?.enabled" @change="updateFeature('clickCollect', 'enabled', $event.target.checked)">
                </div>
                <div class="flex items-center justify-between p-2">
                    <span>Programa de Fidelización</span>
                    <input type="checkbox" :checked="features.fidelizacion?.enabled" @change="updateFeature('fidelizacion', 'enabled', $event.target.checked)">
                </div>
              </template> -->
            </FeatureAccordion>
           </div>
        
            <!-- MARKETING TABS -->
           <div v-if="activeTab === 'marketing'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 text-agent-text">
             <FeatureAccordion 
              title="Business Intelligence y Reportes"
              :enabled="modalData.featureCategories.analisis.bi.enabled"
              :features="modalData.featureCategories.analisis.bi.features"
               @update:enabled="updateSubcategory('analisis', 'bi', 'enabled', $event)"
              @update:features="updateSubcategory('analisis', 'bi', 'features', $event)"
            >
              <!-- <template #default="{ updateFeature, features }">
                 <div class="space-y-3">
                   <div class="flex items-center justify-between p-2">
                    <span>Dashboards Automáticos (KPIs)</span>
                    <input type="checkbox" :checked="features.dashboards?.enabled" @change="updateFeature('dashboards', 'enabled', $event.target.checked)">
                  </div>
                   <div class="flex items-center justify-between p-2">
                    <span>Análisis de Sentimientos (RRSS)</span>
                    <input type="checkbox" :checked="features.sentimientos?.enabled" @change="updateFeature('sentimientos', 'enabled', $event.target.checked)">
                  </div>
                  <div class="flex items-center justify-between p-2">
                    <span>Predicción de Tendencias</span>
                    <input type="checkbox" :checked="features.tendencias?.enabled" @change="updateFeature('tendencias', 'enabled', $event.target.checked)">
                  </div>
                </div>
              </template> -->
            </FeatureAccordion>
           </div>

        </div>
      </div>

      <div class="p-4 md:p-6 lg:p-8 border-t border-agent-border bg-agent-surface flex flex-col sm:flex-row justify-end md:gap-4 sticky bottom-0">
        <button 
          class="w-full sm:w-auto px-4 md:px-6 py-2.5 rounded-xl font-medium text-agent-text-muted hover:text-agent-text hover:bg-agent-surface-elevated transition-colors order-2 sm:order-1"
          @click="handleCancel"
        >
          Cancelar
        </button>
        <button 
          :disabled="saving"
          @click="handleSave"
          class="
            w-full sm:w-auto
            px-4 md:px-6 py-2.5
            rounded-xl font-medium text-white
            bg-agent-500 hover:bg-agent-600
            shadow-lg shadow-agent-500/25
            transition-all
            order-1 sm:order-2
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          <!-- Spinner -->
          <Loader
            v-if="saving"
            class="animate-spin h-5 w-5 text-white"
          />

          <!-- Texto -->
          <span>
            <template v-if="saving">
              Guardando...
            </template>
            <template v-else>
              {{ modalData.id ? 'Guardar Cambios' : 'Crear Empresa' }}
            </template>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
