'use client'

interface HealthMetric {
  label: string
  value: number
  displayValue: string
  color: string
}

const healthMetrics: HealthMetric[] = [
  { label: 'Server Load', value: 42, displayValue: '42%', color: 'bg-indigo-500' },
  { label: 'Database Storage', value: 78, displayValue: '78%', color: 'bg-amber-500' },
  { label: 'API Latency', value: 15, displayValue: '24ms', color: 'bg-green-500' },
]

export default function SystemHealth() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col h-[400px] shadow-lg shadow-indigo-500/4">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">System Health</h3>
      
      <div className="space-y-6 flex-1">
        {healthMetrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-slate-500">{metric.label}</span>
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
        <button className="w-full text-center font-medium text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
          View Detailed Logs →
        </button>
      </div>
    </div>
  )
}
