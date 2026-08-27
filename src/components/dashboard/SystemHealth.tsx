'use client'

import { useI18n } from '@/lib/i18n'
import { Activity } from 'lucide-react'

interface HealthMetric {
  labelKey: string
  value: number
  displayValue: string
  color: string
}

const healthMetricsBase: Omit<HealthMetric, 'labelKey'>[] = [
  { value: 42, displayValue: '42%', color: 'bg-indigo-500' },
  { value: 78, displayValue: '78%', color: 'bg-amber-500' },
  { value: 15, displayValue: '24ms', color: 'bg-green-500' },
]

const metricLabelKeys = ['system.serverLoad', 'system.databaseStorage', 'system.apiLatency']

export default function SystemHealth() {
  const { t } = useI18n()
  
  const healthMetrics: HealthMetric[] = healthMetricsBase.map((metric, index) => ({
    ...metric,
    labelKey: metricLabelKeys[index]
  }))

  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-white/40 rounded-xl p-6 flex flex-col h-[400px] shadow-lg shadow-indigo-500/4">
      <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        <Activity size={20} className="text-indigo-500" />
        {t('system.systemHealth')}
      </h3>
      
      <div className="space-y-6 flex-1">
        {healthMetrics.map((metric) => (
          <div key={metric.labelKey}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">{t(metric.labelKey)}</span>
              <span 
                className={`text-sm font-semibold ${
                  metric.color === 'bg-indigo-500' ? 'text-indigo-600' :
                  metric.color === 'bg-amber-500' ? 'text-amber-600' :
                  'text-green-600'
                }`}
              >
                {metric.displayValue}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-white/40">
        <button className="w-full text-center font-medium text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-1">
          {t('ops.viewLogs')} →
        </button>
      </div>
    </div>
  )
}
