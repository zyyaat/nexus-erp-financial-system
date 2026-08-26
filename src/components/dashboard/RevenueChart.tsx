'use client'

import { useI18n } from '@/lib/i18n'

export default function RevenueChart() {
  const { t, language } = useI18n()
  
  // Month labels based on language
  const monthLabels = {
    ar: ['يناير', 'مارس', 'مايو', 'يوليو', 'سبتمبر', 'نوفمبر'],
    en: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
    fr: ['Jan', 'Mai', 'Jui', 'Sep', 'Nov'],
    es: ['Ene', 'Mar', 'May', 'Jul', 'Sep', 'Nov']
  }

  // Time period options based on language
  const timeOptions = {
    ar: ['هذا العام', 'آخر 6 أشهر', 'آخر 30 يوم'],
    en: ['This Year', 'Last 6 Months', 'Last 30 Days'],
    fr: ['Cette année', '6 derniers mois', '30 derniers jours'],
    es: ['Este año', 'Últimos 6 meses', 'Últimos 30 días']
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col h-[400px] shadow-lg shadow-indigo-500/4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">{t('chart.revenueVsTarget')}</h3>
        <select className="bg-slate-100/30 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 backdrop-blur-sm">
          {timeOptions[language]?.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative w-full h-full bg-white/50 rounded-lg overflow-hidden border border-white/40 p-6 flex flex-col">
        {/* Legend */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span className="text-xs text-slate-500">{t('chart.revenue')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400"></span>
            <span className="text-xs text-slate-500">{t('chart.target')}</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 relative group">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-slate-900 w-full"></div>
            ))}
          </div>

          {/* SVG Chart */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 100">
            {/* Target Line (Dashed) */}
            <path
              d="M0,50 L200,45 L400,48 L600,42 L800,45 L1000,40"
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="6,4"
              strokeWidth="2"
              className="opacity-40"
            />
            
            {/* Revenue Line (Smooth Curve) */}
            <path
              d="M0,80 C100,80 150,20 250,30 C350,40 450,70 550,50 C650,30 750,10 850,20 C950,30 1000,10 1000,10"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]"
            />

            {/* Data Points */}
            <circle cx="250" cy="30" r="4" fill="#6366f1" className="hover:r-6 transition-all cursor-pointer" />
            <circle cx="550" cy="50" r="4" fill="#6366f1" className="hover:r-6 transition-all cursor-pointer" />
            <circle cx="850" cy="20" r="4" fill="#6366f1" className="hover:r-6 transition-all cursor-pointer" />
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-4 px-2">
          {monthLabels[language]?.map((month, i) => (
            <span key={i} className="text-xs text-slate-400">{month}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
