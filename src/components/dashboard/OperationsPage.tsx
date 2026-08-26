'use client'

import { useState } from 'react'
import { 
  Factory, 
  ShoppingCart, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Package,
  Users
} from 'lucide-react'
import { useI18n, Language } from '@/lib/i18n'

// ============ TYPES ============
interface Workflow {
  id: string
  title: string
  client: string
  type: 'order' | 'production' | 'maintenance'
  status: 'in-progress' | 'completed' | 'pending' | 'on-hold'
  progress: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
}

interface Activity {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  messageKey: string
  timeKey: string
}

// ============ MOCK DATA ============
const operationsKPIs = [
  {
    titleKey: 'ops.activeProduction',
    value: '8',
    change: 12.5,
    icon: Factory,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    titleKey: 'ops.pendingOrders',
    value: '15',
    change: -3.2,
    icon: ShoppingCart,
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-600'
  },
  {
    titleKey: 'ops.maintenanceTasks',
    value: '4',
    change: 0,
    icon: Wrench,
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  }
]

const workflows: Workflow[] = [
  {
    id: 'WF-001',
    title: 'Order #1234 - Electronics Batch',
    client: 'TechCorp Industries',
    type: 'order',
    status: 'in-progress',
    progress: 67,
    priority: 'high',
    dueDate: '2026-08-28'
  },
  {
    id: 'WF-002',
    title: 'Production #567 - Widget Assembly',
    client: 'Global Manufacturing Co.',
    type: 'production',
    status: 'in-progress',
    progress: 34,
    priority: 'medium',
    dueDate: '2026-09-02'
  },
  {
    id: 'WF-003',
    title: 'Maintenance #890 - CNC Machine A',
    client: 'Internal',
    type: 'maintenance',
    status: 'on-hold',
    progress: 45,
    priority: 'urgent',
    dueDate: '2026-08-27'
  },
  {
    id: 'WF-004',
    title: 'Order #5678 - Raw Materials',
    client: 'SupplyChain Ltd',
    type: 'order',
    status: 'pending',
    progress: 0,
    priority: 'low',
    dueDate: '2026-09-05'
  },
  {
    id: 'WF-005',
    title: 'Production #910 - Quality Check',
    client: 'AutoParts Inc',
    type: 'production',
    status: 'completed',
    progress: 100,
    priority: 'high',
    dueDate: '2026-08-25'
  }
]

// ============ SUB-COMPONENTS ============

// Status Badge Component
function StatusBadge({ status }: { status: Workflow['status'] }) {
  const { t } = useI18n()
  
  const config = {
    'in-progress': { 
      icon: PlayCircle, 
      labelKey: 'status.inProgress', 
      className: 'bg-blue-100 text-blue-700 border-blue-200' 
    },
    'completed': { 
      icon: CheckCircle2, 
      labelKey: 'status.completed', 
      className: 'bg-green-100 text-green-700 border-green-200' 
    },
    'pending': { 
      icon: Clock, 
      labelKey: 'status.pending', 
      className: 'bg-slate-100 text-slate-600 border-slate-200' 
    },
    'on-hold': { 
      icon: PauseCircle, 
      labelKey: 'status.onHold', 
      className: 'bg-amber-100 text-amber-700 border-amber-200' 
    }
  }

  const { icon: Icon, labelKey, className } = config[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
      <Icon size={14} />
      {t(labelKey)}
    </span>
  )
}

// Priority Badge Component
function PriorityBadge({ priority }: { priority: Workflow['priority'] }) {
  const { t } = useI18n()
  
  const config = {
    low: { labelKey: 'priority.low', className: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
    medium: { labelKey: 'priority.medium', className: 'bg-blue-100 text-blue-600', dot: 'bg-blue-500' },
    high: { labelKey: 'priority.high', className: 'bg-orange-100 text-orange-600', dot: 'bg-orange-500' },
    urgent: { labelKey: 'priority.urgent', className: 'bg-red-100 text-red-600', dot: 'bg-red-500 animate-pulse' }
  }

  const { labelKey, className, dot } = config[priority]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {t(labelKey)}
    </span>
  )
}

// Activity Icon Component
function ActivityIcon({ type }: { type: 'success' | 'warning' | 'info' | 'error' }) {
  const config = {
    success: { icon: CheckCircle2, className: 'text-green-500 bg-green-100' },
    warning: { icon: AlertCircle, className: 'text-amber-500 bg-amber-100' },
    info: { icon: Package, className: 'text-blue-500 bg-blue-100' },
    error: { icon: AlertCircle, className: 'text-red-500 bg-red-100' }
  }

  const { icon: Icon, className } = config[type]

  return (
    <div className={`p-2 rounded-lg ${className}`}>
      <Icon size={16} />
    </div>
  )
}

// KPI Card Component for Operations
function OpsKPICard({ kpi }: { kpi: typeof operationsKPIs[0] }) {
  const { t } = useI18n()
  const Icon = kpi.icon
  const isPositive = kpi.change >= 0

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-lg shadow-indigo-500/4">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bgColor} rounded-full blur-2xl -mr-10 -mt-10 opacity-60 pointer-events-none`}></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 ${kpi.bgColor} rounded-xl ${kpi.textColor}`}>
          <Icon size={24} />
        </div>
        {kpi.change !== 0 && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <TrendingUp size={14} className={`mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
            {Math.abs(kpi.change)}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 mb-1">{t(kpi.titleKey)}</p>
        <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
      </div>
    </div>
  )
}

// Workflow Card Component
function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const { t } = useI18n()
  
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-500/4 group">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{workflow.id}</span>
            <PriorityBadge priority={workflow.priority} />
          </div>
          <h4 className="font-semibold text-slate-900 truncate">{workflow.title}</h4>
          <p className="text-sm text-slate-500 mt-0.5">{workflow.client}</p>
        </div>
        <StatusBadge status={workflow.status} />
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-slate-500">{t('ops.progress')}</span>
          <span className="text-xs font-bold text-slate-700">{workflow.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              workflow.status === 'completed' ? 'bg-green-500' :
              workflow.status === 'on-hold' ? 'bg-amber-500' :
              'bg-gradient-to-r from-indigo-500 to-violet-500'
            }`}
            style={{ width: `${workflow.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">{t('ops.due')} {workflow.dueDate}</span>
        <button className="text-indigo-600 hover:text-indigo-700 transition-colors">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
export default function OperationsPage() {
  const { t } = useI18n()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredWorkflows = filterStatus === 'all' 
    ? workflows 
    : workflows.filter(w => w.status === filterStatus)

  // Get filter button labels
  const getFilterLabel = (status: string) => {
    switch(status) {
      case 'all': return t('ops.allStatuses')
      case 'in-progress': return t('ops.inProgressStatus')
      case 'on-hold': return t('ops.onHoldStatus')
      default: return t(`status.${status}` as any)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            {t('ops.title').split(' ')[0]}{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              {t('ops.title').split(' ')[1] || ''}
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            {t('ops.subtitle')}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-slate-600"><strong>{workflows.filter(w => w.status === 'in-progress').length}</strong> {t('ops.activeCount')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-slate-600"><strong>{workflows.filter(w => w.status === 'completed').length}</strong> {t('ops.doneCount')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <span className="text-slate-600"><strong>{workflows.filter(w => w.status === 'pending').length}</strong> {t('ops.pendingCount')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {operationsKPIs.map((kpi) => (
          <OpsKPICard key={kpi.titleKey} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Workflows Section - Takes 2 columns on XL */}
        <div className="xl:col-span-2 space-y-4">
          {/* Workflows Header with Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Factory size={20} className="text-indigo-500" />
              {t('ops.activeWorkflows')}
            </h3>
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['all', 'in-progress', 'pending', 'completed', 'on-hold'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {getFilterLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Workflows List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredWorkflows.length > 0 ? (
              filteredWorkflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow} />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Factory size={48} className="mx-auto mb-3 text-slate-300" />
                <p>{t('ops.noWorkflows')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed Sidebar - Takes 1 column on XL */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock size={20} className="text-violet-500" />
            {t('ops.activityFeed')}
          </h3>

          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-lg shadow-indigo-500/4">
            <div className="space-y-4">
              {[
                { id: 'ACT-001', type: 'success' as const, messageKey: 'activity.shipmentCompleted', timeKey: 'time.justNow' },
                { id: 'ACT-002', type: 'warning' as const, messageKey: 'activity.inventoryAlert', timeKey: 'time.minutesAgo' },
                { id: 'ACT-003', type: 'info' as const, messageKey: 'activity.newOrder', timeKey: 'time.hoursAgo' },
                { id: 'ACT-004', type: 'success' as const, messageKey: 'activity.qualityCheck', timeKey: 'time.hoursAgo' },
                { id: 'ACT-005', type: 'error' as const, messageKey: 'activity.maintenanceOverdue', timeKey: 'time.hoursAgo' }
              ].map((activity) => (
                <div key={activity.id} className="flex gap-3 group">
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                      {t(activity.messageKey)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">10 {t(activity.timeKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <button className="w-full mt-4 pt-3 border-t border-slate-100 text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              {t('ops.viewAllActivity')}
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl p-5 text-white shadow-xl">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp size={18} />
              {t('ops.quickActions')}
            </h4>
            <p className="text-sm text-indigo-100 mb-4">{t('ops.commonTasks')}</p>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all flex items-center justify-between backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <ShoppingCart size={16} />
                  {t('ops.newOrder')}
                </span>
                <ArrowRight size={16} />
              </button>
              
              <button className="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all flex items-center justify-between backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <Factory size={16} />
                  {t('ops.startProduction')}
                </span>
                <ArrowRight size={16} />
              </button>
              
              <button className="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all flex items-center justify-between backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <Wrench size={16} />
                  {t('ops.scheduleMaintenance')}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
