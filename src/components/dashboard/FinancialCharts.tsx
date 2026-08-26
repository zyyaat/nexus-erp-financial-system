'use client'

import { useState, useMemo } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// Mock Data for Charts
const monthlyData = [
  { month: 'Jan', revenue: 65000, expenses: 42000, profit: 23000 },
  { month: 'Feb', revenue: 72000, expenses: 45000, profit: 27000 },
  { month: 'Mar', revenue: 68000, expenses: 43000, profit: 25000 },
  { month: 'Apr', revenue: 85000, expenses: 48000, profit: 37000 },
  { month: 'May', revenue: 92000, expenses: 52000, profit: 40000 },
  { month: 'Jun', revenue: 88000, expenses: 49000, profit: 39000 },
  { month: 'Jul', revenue: 95000, expenses: 54000, profit: 41000 },
  { month: 'Aug', revenue: 107850, expenses: 55250, profit: 52600 },
]

const weeklyCashFlow = [
  { week: 'W1', inflow: 32000, outflow: 28000, net: 4000 },
  { week: 'W2', inflow: 45000, outflow: 35000, net: 10000 },
  { week: 'W3', inflow: 38000, outflow: 42000, net: -4000 },
  { week: 'W4', inflow: 52000, outflow: 39000, net: 13000 },
]

const categoryBreakdown = [
  { name: 'Operations', amount: 198500, percentage: 38, color: '#6366f1' },
  { name: 'Salaries', amount: 156200, percentage: 30, color: '#8b5cf6' },
  { name: 'Marketing', amount: 78400, percentage: 15, color: '#3b82f6' },
  { name: 'Technology', amount: 52080, percentage: 10, color: '#10b981' },
  { name: 'Other', amount: 40000, percentage: 7, color: '#64748b' },
]

// Simple Bar Chart Component (CSS-based)
function BarChart({ data, type = 'revenue' }: { data: typeof monthlyData, type?: 'revenue' | 'profit' }) {
  const maxValue = Math.max(...data.map(d => type === 'revenue' ? d.revenue : d.profit))
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const value = type === 'revenue' ? item.revenue : item.profit
        const height = (value / maxValue) * 100
        
        return (
          <div key={item.month} className="flex items-center gap-3 group">
            <span className="text-xs font-medium text-slate-500 w-8">{item.month}</span>
            <div className="flex-1 h-8 bg-slate-100 dark:bg-white/[0.03] rounded-lg overflow-hidden relative">
              <div 
                className={`h-full rounded-lg transition-all duration-500 ease-out ${
                  type === 'revenue' 
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${height}%` }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                ${(value / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Line Chart Component (SVG-based)
function LineChart({ data }: { data: typeof monthlyData }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const width = 300
  const height = 150
  const padding = 20
  
  const maxValue = Math.max(...data.map(d => d.revenue))
  const minValue = Math.min(...data.map(d => d.expenses))
  
  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding)
  const getY = (value: number) => height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
  
  const revenuePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.revenue)}`).join(' ')
  const expensePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.expenses)}`).join(' ')
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <line
          key={i}
          x1={padding}
          y1={padding + (i * (height - 2 * padding) / 4)}
          x2={width - padding}
          y2={padding + (i * (height - 2 * padding) / 4)}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}
      
      {/* Expense Line */}
      <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      
      {/* Revenue Line */}
      <path d={revenuePath} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Data Points */}
      {data.map((d, i) => (
        <g key={i}>
          <circle
            cx={getX(i)}
            cy={getY(d.revenue)}
            r={hoveredIndex === i ? 6 : 4}
            fill="#6366f1"
            className="transition-all cursor-pointer"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
          {hoveredIndex === i && (
            <g>
              <rect
                x={getX(i) - 30}
                y={getY(d.revenue) - 35}
                width="60"
                height="25"
                rx="4"
                fill="#6366f1"
              />
              <text
                x={getX(i)}
                y={getY(d.revenue) - 18}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="bold"
              >
                ${(d.revenue / 1000).toFixed(0)}k
              </text>
            </g>
          )}
        </g>
      ))}
      
      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={getX(i)}
          y={height - 5}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          {d.month}
        </text>
      ))}
    </svg>
  )
}

// Donut Chart Component (CSS/SVG hybrid)
function DonutChart({ data }: { data: typeof categoryBreakdown }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  let cumulativePercentage = 0
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.amount / total
            const startAngle = cumulativePercentage * 360
            const endAngle = (cumulativePercentage + percentage) * 360
            
            cumulativePercentage += percentage
            
            const startX = 50 + 35 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 50 + 35 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 50 + 35 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 50 + 35 * Math.sin((endAngle * Math.PI) / 180)
            
            const largeArcFlag = percentage > 0.5 ? 1 : 0
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={item.color}
                opacity="0.85"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              />
            )
          })}
          {/* Inner circle for donut effect */}
          <circle cx="50" cy="50" r="22" fill="white" className="dark:fill-slate-900" />
          <text
            x="50"
            y="48"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#1e293b"
            className="dark:fill-slate-100"
          >
            Total
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fontSize="10"
            fill="#64748b"
          >
            ${(total / 1000).toFixed(0)}k
          </text>
        </svg>
      </div>
    </div>
  )
}

// Main Financial Charts Component
export default function FinancialCharts() {
  const { t } = useI18n()
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')
  const [dataType, setDataType] = useState<'revenue' | 'profit'>('revenue')
  
  // Calculate totals
  const totalRevenue = useMemo(() => monthlyData.reduce((sum, m) => sum + m.revenue, 0), [])
  const totalExpenses = useMemo(() => monthlyData.reduce((sum, m) => sum + m.expenses, 0), [])
  const totalProfit = useMemo(() => totalRevenue - totalExpenses, [totalRevenue, totalExpenses])
  const avgMonthlyProfit = Math.round(totalProfit / monthlyData.length)
  const growthRate = (((monthlyData[7].revenue - monthlyData[0].revenue) / monthlyData[0].revenue) * 100).toFixed(1)
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 size={28} className="text-indigo-500" />
            Financial Analytics
            <span className="text-base font-normal text-slate-500">/ التحليلات المالية</span>
          </h2>
          <p className="text-slate-500 mt-1">Interactive charts and performance metrics</p>
        </div>
        
        {/* Chart Controls */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#1A1D26] rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === 'bar' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === 'line' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
            }`}
          >
            Line Chart
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <TrendingUp size={18} />
            <span className="text-sm font-medium">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1 opacity-80">+{growthRate}% YTD</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <TrendingDown size={18} />
            <span className="text-sm font-medium">Total Expenses</span>
          </div>
          <p className="text-2xl font-bold">${(totalExpenses / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1 opacity-80">8 months</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <DollarSign size={18} />
            <span className="text-sm font-medium">Net Profit</span>
          </div>
          <p className="text-2xl font-bold">${(totalProfit / 1000).toFixed(0)}K</p>
          <p className="text-xs mt-1 opacity-80">${avgMonthlyProfit}K/mo avg</p>
        </div>
        
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Calendar size={18} />
            <span className="text-sm font-medium">Period</span>
          </div>
          <p className="text-2xl font-bold">8 Mo</p>
          <p className="text-xs mt-1 opacity-80">Jan - Aug 2026</p>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D26] border border-white/10 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Monthly Performance / الأداء الشهري
            </h3>
            
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dataType"
                  checked={dataType === 'revenue'}
                  onChange={() => setDataType('revenue')}
                  className="accent-indigo-500"
                />
                <span className="text-slate-600 dark:text-slate-400">Revenue</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dataType"
                  checked={dataType === 'profit'}
                  onChange={() => setDataType('profit')}
                  className="accent-emerald-500"
                />
                <span className="text-slate-600 dark:text-slate-400">Profit</span>
              </label>
            </div>
          </div>
          
          {chartType === 'bar' ? (
            <BarChart data={monthlyData} type={dataType} />
          ) : (
            <LineChart data={monthlyData} />
          )}
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Expenses</span>
            </div>
          </div>
        </div>

        {/* Donut Chart - Category Breakdown */}
        <div className="bg-white dark:bg-[#1A1D26] border border-white/10 rounded-xl p-6 shadow-md">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Expense Breakdown / توزيع المصروفات
          </h3>
          
          <DonutChart data={categoryBreakdown} />
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {categoryBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Flow Section */}
      <div className="bg-white dark:bg-[#1A1D26] border border-white/10 rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <ArrowUpRight size={20} className="text-emerald-500" />
          Weekly Cash Flow / التدفق النقدي الأسبوعي
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {weeklyCashFlow.map((week) => (
            <div 
              key={week.week}
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                week.net >= 0 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white">{week.week}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  week.net >= 0 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                }`}>
                  {week.net >= 0 ? '+' : ''}${(week.net / 1000).toFixed(1)}k
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Inflow</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    +${(week.inflow / 1000).toFixed(1)}k
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Outflow</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -${(week.outflow / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
              
              {/* Mini bar visualization */}
              <div className="mt-3 h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500"
                  style={{ width: `${(week.inflow / (week.inflow + week.outflow)) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500"
                  style={{ width: `${(week.outflow / (week.inflow + week.outflow)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
