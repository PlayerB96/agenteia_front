import { Building2, BarChart3, Settings, FileText, ArrowBigLeftDash } from 'lucide-vue-next'

export const adminDashboardNav = [
  { id: 'companies', label: 'Empresas', icon: Building2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'logs', label: 'Logs', icon: FileText },
]

export const adminEditNav = [
  { id: 'back', label: 'Volver a Empresas', icon: ArrowBigLeftDash, to: '/admin' },
]
