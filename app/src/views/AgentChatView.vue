<style scoped>
.chat-enter-active {
  transition: all 0.5s ease-out;
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.chat-leave-active {
  transition: all 0.3s ease-out;
}
.chat-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
<template>
  <div class="flex min-h-screen font-display bg-agent-bg text-agent-text">

    <!-- Mobile Menu Button -->
    <button @click="toggleMobileMenu"
      class="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-agent-surface border border-agent-border rounded-lg text-agent-text hover:bg-agent-surface-elevated transition-colors">
      <span v-if="!mobileMenuOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <!-- Mobile Overlay -->
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 bg-black/50 z-30" @click="mobileMenuOpen = false" />

    <!-- Sidebar -->
    <CompanySidebar v-if="!maximized" :current-view="currentView" :mobile-open="mobileMenuOpen"
      :current-subtab="currentSubtab" @update:current-view="currentView = $event; mobileMenuOpen = false"
      @update:current-subtab="currentSubtab = $event" />


    <!-- Main -->
    <main :class="[
      maximized ? 'lg:p-0 pt-16' : 'flex-1 p-0 md:p-4 lg:p-6 overflow-y-auto pt-16 lg:pt-8'
    ]">
      <AgentHeader v-if="!maximized" />

      <!-- Selector agente -->
      <div class="mb-4">
        <template v-if="agentName && agentName !== 'chat'">
          <span class="inline-flex items-center gap-2 bg-agent-surface border border-agent-border text-agent-text px-4 py-2.5 rounded-lg font-semibold">
            <span class="w-2 h-2 rounded-full" :class="connected ? 'bg-agent-500' : 'bg-red-500'" />
            {{ agentName.replace(/_/g, ' ') }}
          </span>
        </template>

        <template v-else>
          <div class="inline-flex flex-wrap items-center gap-2 bg-agent-surface border border-agent-border text-agent-text px-4 py-2.5 rounded-lg">
            <label class="text-agent-text-muted font-medium">Agente:</label>
            <select v-model="selectedAgent" class="bg-agent-surface-elevated border border-agent-border rounded-lg px-3 py-2 text-agent-text font-medium focus:outline-none focus:ring-2 focus:ring-agent-500/50">
              <option v-for="agent in agents" :key="agent.name" :value="agent.name">
                {{ agent.name }}
              </option>
            </select>
            <button @click="goToAgentChat"
              class="px-4 py-2 bg-agent-500 text-white rounded-lg hover:bg-agent-600 font-semibold transition-colors">
              Ir al chat
            </button>
          </div>
        </template>
      </div>

      <!-- Chat + Aside -->
      <main v-if="agentName && agentName !== 'chat'" class="flex-1 min-h-0 flex flex-col md:flex-row gap-6">
        <!-- Chat -->
        <section class="flex-1 min-h-0 flex">
          <div ref="chatContainer" :class="[
            'relative flex flex-col bg-agent-surface border border-agent-border',
            maximized
              ? 'fixed inset-0 z-[9999] rounded-none w-screen h-screen'
              : 'w-full max-w mx-auto rounded-xl p-0 md:p-4'
          ]" :style="maximized ? { width: '99vw', height: '99vh' } : {}"
          >


            <!-- Botón Maximizar -->
            <button @click="toggleMaximize"
              class="absolute top-3 right-3 z-20 p-2 rounded-lg bg-agent-surface-elevated hover:bg-agent-border/50 text-agent-text-muted hover:text-agent-text transition-colors">
              <component :is="maximized ? Minimize : Maximize2" class="w-5 h-5" />
            </button>

            <!-- Opciones superiores -->
            <div v-if="maximized" class="bg-agent-bg border border-agent-border rounded-xl">
              <button @click="showOptions = !showOptions"
                class="w-full flex items-center justify-between px-4 py-3 font-semibold text-agent-text hover:bg-agent-surface transition-colors rounded-xl">
                Opciones de {{ agentName.replace(/_/g, ' ') }}
                <span>{{ showOptions ? '▲' : '▼' }}</span>
              </button>

              <div v-if="showOptions" class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="font-semibold mb-2">Últimos mensajes</h3>
                  <ul class="max-h-32 overflow-y-auto space-y-1 text-xs scrollbar-ag">
                    <li v-for="(msg, i) in lastChats" :key="i" class="flex gap-1">
                      <component :is="msg.role === 'user' ? User : Bot" class="w-3 h-3" />
                      <span class="font-bold">{{ msg.role }}:</span>
                      <span class="max-w-[70%] w-fit break-all">{{ msg.text }}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 class="font-semibold mb-2">Pasos</h3>
                  <ul class="text-xs space-y-2">
                    <li v-for="(step, i) in steps" :key="i" class="flex inline-center gap-2">
                      <component
                        :is="stepIcon(step.status)"
                        class="w-4 h-4"
                        :class="{
                          'text-gray-500': step.status === 'pending',
                          'text-yellow-400 animate-spin': step.status === 'active',
                          'text-green-500': step.status === 'done'
                        }"
                      />
                      <span
                        :class="{
                          'text-300': step.status === 'pending',
                          'text-100 font-semibold': step.status === 'active',
                          'text-green-400': step.status === 'done'
                        }"
                      >
                        {{ step.key }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Mensajes -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 rounded-xl bg-agent-bg/50 scrollbar-ag max-w-[100%] max-h-[70vh]">
              <TransitionGroup
                name="chat"
                tag="div"
                class="flex flex-col gap-1"
              >
                <ChatMessage
                  v-for="(msg, i) in history"
                  :key="i"
                  :msg="msg"
                  :messageError="messageError"
                  :isDocumentationMode="isDocumentationMode"
                />
              </TransitionGroup>
              <div v-if="isProcessing" class="flex items-center gap-2 text-sm text-agent-text-muted px-2 mt-2">
                <Bot class="w-4 h-4 animate-pulse" />
                <span>El agente está escribiendo…</span>
              </div>
            </div>
            <!-- Acciones rápidas -->
            <QuickActions
              v-if="showQuickActions"
              :actions="quickActions"
              @select="runQuickAction"
            />
            <ExecutedActions
              :showExecuteButton="showExecuteButton"
              @executeButton="runAction"
            />
            <!-- Input -->
            <form @submit.prevent="sendMessage" class="flex flex-col gap-3 mt-1">
              <!-- Inputs dinámicos -->
              <TransitionGroup
                name="chat"
                tag="div"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                v-if="showParamForm"
              >
                <div
                  v-for="(value, key) in actionInputs"
                  :key="key"
                >
                  <div 
                  v-if="selectedAction && key != 'id_action'"
                  class="flex flex-col"
                  >
                    <label :for="key" class="text-sm text-agent-text-muted font-medium">
                      {{ key }}
                    </label>
                    <input
                      :id="key"
                      v-model="actionInputs[key]"
                      :readonly="isDocumentationMode"
                      type="text"
                      class="bg-agent-surface-elevated border border-agent-border rounded-lg px-3 py-2 text-agent-text placeholder:text-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-500/50"
                    />
                  </div>
                </div>
              </TransitionGroup>
              <!-- Input normal -->
              
              <div v-if="showChat" class="flex flex-col gap-2">
                <input
                  v-model="input"
                  placeholder="Escribe tu mensaje…"
                  :disabled="isProcessing || selectedAction"
                  class="w-full bg-agent-surface-elevated border border-agent-border rounded-xl px-4 py-3 text-agent-text placeholder:text-agent-text-muted focus:outline-none focus:ring-2 focus:ring-agent-500/50 transition-shadow"
                />
              </div>

              <!-- Botón siempre abajo -->
              <div class="flex justify-end mb-1">
                <button type="submit" class="px-4 py-2.5 bg-agent-500 text-white rounded-xl flex items-center gap-2 font-semibold hover:bg-agent-600 transition-colors">
                  <Send class="w-4 h-4" />
                  <span class="hidden sm:inline">Enviar</span>
                </button>
              </div>
            </form>

            <!-- Acciones -->
            <button @click="clearHistory"
              class="inline-flex items-center gap-2 px-3 py-2 bg-agent-surface-elevated border border-agent-border rounded-lg text-agent-text-muted hover:text-agent-500 hover:border-agent-500/30 transition-colors font-medium">
              <MessageCircle class="w-4 h-4 text-indigo-400"/> Nuevo Chat
            </button>

          </div>
        </section>

        <!-- Aside -->
        <aside v-if="!maximized"
          class="w-full md:w-[420px] bg-agent-surface border border-agent-border rounded-xl p-0 md:p-4 flex flex-col gap-8">
          <div>
            <h2 class="font-bold mb-4 text-agent-text">Opciones de {{ agentName.replace(/_/g, ' ') }}</h2>
            <ul class="max-h-32 overflow-y-auto space-y-1 text-xs scrollbar-ag">
              <li v-for="(msg, i) in lastChats" :key="i" class="flex gap-1">
                <component :is="msg.role === 'user' ? User : Bot" class="w-3 h-3" />
                <span class="font-bold">{{ msg.role }}:</span>
                <span class="max-w-[70%] w-fit break-all">{{ msg.text }}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-2">Pasos</h3>
            <ul class="text-xs space-y-2">
              <li v-for="step in steps" :key="step.id" class="flex items-center gap-2">
                <component
                  :is="stepIcon(step.status)"
                  class="w-4 h-4"
                  :class="{
                    'text-gray-500': step.status === 'pending',
                    'text-yellow-400 animate-spin': step.status === 'active',
                    'text-green-500': step.status === 'done'
                  }"
                />
                <span
                  :class="{
                    'text-300': step.status === 'pending',
                    'text-100 font-semibold': step.status === 'active',
                    'text-green-400': step.status === 'done'
                  }"
                >
                  {{ step.key }}
                </span>
              </li>
            </ul>
          </div>
          <div v-if="mostrarDocumento" class="mt-2">
            <small v-if="!documentoExpirado" class="flex items-center justify-center mb-2 font-semibold">
              <Timer /> Disponible por: {{ tiempoRestante }}
            </small>

            <a
              v-if="!documentoExpirado"
              :href="documentUrl"
              target="_blank"
              class="flex items-center justify-center px-4 py-2.5 bg-agent-500 text-white rounded-lg font-semibold hover:bg-agent-600 transition-colors"
            >
              <Download class="w-4 h-4 mr-2" />
              Descargar documento
            </a>

            <small v-else class="text-red-600 block">
              ❌ El documento ha expirado
            </small>
          </div>
          <!-- Chats recientes -->
          <div class="flex-1">
            <h3 class="font-semibold mb-2">Chats recientes</h3>

            <ul class="space-y-2 text-sm">
              <li
                v-for="chat in chatHistory"
                :key="chat.id"
                @click="loadChat(chat)"
                class="cursor-pointer p-3 rounded-xl border transition-colors"
                :class="[
                  chat.id === activeChatId
                    ? 'bg-agent-500/15 border-agent-500/40 text-agent-text'
                    : 'bg-agent-surface-elevated border-agent-border hover:border-agent-500/30 text-agent-text'
                ]"
              >
                <p class="font-medium truncate">{{ chat.title }}</p>
                <p class="text-xs text-agent-text-muted flex items-center gap-1">
                  <MessageCircle class="w-3 h-3 text-agent-500" />
                  {{ new Date(chat.createdAt).toLocaleTimeString() }}
                </p>
              </li>
            </ul>
          </div>
        </aside>

      </main>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AgentHeader from '../components/AgentHeader.vue'
import CompanySidebar from '../components/CompanySidebar.vue'
import ChatMessage from '../components/ChatMessage.vue'
import QuickActions from '../components/QuickActions.vue'
import ExecutedActions from '../components/ExecutedActions.vue'
import { Bot, User, Send, Maximize2, Minimize, MessageCircle, Timer, Download } from 'lucide-vue-next'
import { mockAgents } from '../data/mockAgents.js'
import { useAgentSocket } from '../services/Company/useAgentSocket.js'
import { MockAgentSocket } from '../services/Company/agentSocket.mock.js'
import { startAgentMock } from '../services/Company/agent.service.mock.js'
import { Clock, Loader2, CheckCircle } from 'lucide-vue-next'
import { FileText, FilePlus } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import { useAuth } from '../utils/useAuth.js'

const { user } = useAuth()
const name = computed(() => {
  const fullName = user.value?.name?.trim()
  if (!fullName) return 'Usuario'

  return fullName.split(' ')[0]
})
//selected_action null -> borrar acciones rápidas

const {
  connected,
  messages,
  sendMessage: sendToSocket,
  connectSocketWorker,
  documentarWorker,
  showQuickActions,
  quickActions,
  selectedAction,
  isProcessing,
  messageError,
  showExecuteButton,
  showChat,
  lastExecutedParams,
  showParamForm,
  currentTaskId,
  documentUrl,
  mostrarDocumento,
  tiempoRestante,
  documentoExpirado,
  updateStepsFromSocket,
  steps
} = useAgentSocket({
  token: 'secret123',
  codeUser: 'USER001',
  fullName: name.value
})

//capturar params y required
const stepIcon = (status) => {
  if (status === 'pending') return Clock
  if (status === 'active') return Loader2
  if (status === 'done') return CheckCircle
}

const route = useRoute()
const agentName = route.params.agentName

const agents = ref(mockAgents)
const selectedAgent = ref(agents.value[0]?.name || '')
const input = ref('')
const currentStep = ref(0)

const history = ref([
  { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?'},
])
const chatHistory = ref([])
const activeChatId = ref(null)

const lastChats = computed(() => history.value.slice(-5))


const maximized = ref(false)
const showOptions = ref(true)

const currentView = ref('agents')
const currentSubtab = ref('chat-agente')
const mobileMenuOpen = ref(false)

const messagesContainer = ref(null)

const actionInputs = ref({})
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function toggleMaximize() {
  maximized.value = !maximized.value
}

watch(
  () => [maximized.value, isProcessing.value, messages.value],
  ([maximizedVal, isProcessingVal, newMessages]) => {
    document.body.style.overflowX = maximizedVal ? 'hidden' : 'auto'


    /*if (isProcessingVal) {
      currentStep.value = 0

      setTimeout(() => {
        steps.value[0].status = 'done'
        steps.value[1].status = 'active'
      }, 300)

      setTimeout(() => {
        steps.value[1].status = 'done'
        steps.value[2].status = 'active'
      }, 700)

      setTimeout(() => {
        steps.value[2].status = 'done'
        steps.value[3].status = 'active'
      }, 1100)

      setTimeout(() => {
        steps.value[3].status = 'done'
        steps.value[4].status = 'active'
      }, 1500)

      setTimeout(() => {
        steps.value[4].status = 'done'
        currentStep.value = 5
      }, 1900)

      //regresar todo a pending
      setTimeout(() => {
        steps.value.forEach(s => s.status = 'pending')
        currentStep.value = 0
      }, 5000)
    }*/

    newMessages.forEach(msg => {
      history.value.push(msg)
    })

    messages.value.length = 0 // limpiamos el buffer
  }
)

watch(
  () => history.value.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

watch(selectedAction, (action) => {
  if (!action?.params) return

  actionInputs.value = {}
  Object.keys(action.params).forEach(key => {
    if (key === 'id_action') {
      actionInputs.value[key] = action.id
    } else {
      actionInputs.value[key] = ''
    }
  })
})

watch(lastExecutedParams, (params) => {
  if (!params) return
  if (!selectedAction.value?.params) return

  actionInputs.value = {}

  // 🔑 USAMOS EL ORDEN DEL SCHEMA
  Object.keys(selectedAction.value.params).forEach(key => {
    if (key === 'id_action') {
      actionInputs.value[key] = selectedAction.value.id
    } else {
      actionInputs.value[key] = params[key] ?? ''
    }
  })
})

//watch error
watch(messageError, (error) => {
  if (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Mensaje no relacionado'
    })
  }
})

//watch de documento
watch(currentTaskId, (id) => {
  if (!id) return
  console.log('task_id recibido, conectando socket2:', id)
})

const isDocumentationMode = computed(() => showExecuteButton.value)

const validateRequired = () => {
  if (!selectedAction.value?.required) return true

  return selectedAction.value.required.every(
    key => actionInputs.value[key]?.trim()
  )
}

function startProcessingSteps() {
  steps.value.forEach(s => s.status = 'pending')
  steps.value[0].status = 'pending'
}

async function sendMessage() {
  if (!validateRequired()) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan campos requeridos',
      text: 'Por favor completa todos los campos requeridos antes de enviar la acción.'
    })
    return
  }
  if (isProcessing.value) return

  // 🟢 CASO 1: acción seleccionada
  if (selectedAction.value) {
    sendToSocket(JSON.stringify({
      id_action: selectedAction.value.id,
      ...actionInputs.value
    }))
    console.log('caso 1')
    return
  }
  const text = input.value.trim()
  if (!text) return

  // 🟢 CASO 2: mensaje de texto
  // caso normal de texto, enviar al socket
  sendToSocket(text, 'client')
  console.log('caso 2')
  input.value = ''

  try {
    isProcessing.value = true

    const res = await startAgentMock(text)

    startProcessingSteps()
    //focus en el input del chat
    setTimeout(() => {
      const inputEl = document.querySelector('input[placeholder="Escribe tu mensaje…"]')
      if (inputEl) inputEl.focus()
    }, 500)
  } catch (err) {
    isProcessing.value = false

    history.value.push({
      role: 'agent',
      text: err.response?.data?.message || 'Ocurrió un error al iniciar el agente'
    })

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'No se pudo procesar la solicitud'
    })
  }
}

function clearHistory() {
  persistCurrentChat()
  if (history.value.length > 1) {
    if (!activeChatId.value){
      const chatId = Date.now() 
      chatHistory.value.unshift({
        id: chatId,
        title: getChatTitle(history.value),
        messages: [...history.value],
        createdAt: new Date()
      })
    }

    // solo 3 recientes
    chatHistory.value = chatHistory.value.slice(0, 3)
  }

  activeChatId.value = null
  history.value = [
    { role: 'agent', text: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]

  input.value = ''
  steps.value.forEach(s => s.status = 'pending')
}

function goToAgentChat() {
  if (!selectedAgent.value) return
  const agentParam = selectedAgent.value.replace(/\s+/g, '_')
  window.location.href = `/company/${agentParam}`
}

async function runQuickAction(action) {
  sendToSocket(action.payload)

  await nextTick()
  scrollToBottom(false)
}

function scrollToBottom(smooth = true) {
  if (!messagesContainer.value) return

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

function getChatTitle(messages) {
  const firstUserMsg = messages.find(m => m.role === 'user')
  return firstUserMsg
    ? firstUserMsg.text.slice(0, 30)
    : 'Nuevo chat'
}

function loadChat(chat) {
  activeChatId.value = chat.id
  history.value = [...chat.messages]
}

function persistCurrentChat() {
  if (!activeChatId.value || history.value.length <= 1) return

  const chat = chatHistory.value.find(c => c.id === activeChatId.value)
  if (chat) {
    chat.messages = [...history.value]
    chat.updatedAt = new Date()
  }
}

function runAction() {
  documentarWorker(JSON.stringify({
    type: 'close',
    message: 'documentar',
    params_required: actionInputs.value
  }))
}
</script>
