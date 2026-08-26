'use client'

import { DollarSign, Wallet, Users, TrendingUp, TrendingDown } from 'lucide-react'

interface KPIProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: 'revenue' | 'profit' | 'users'
}

const iconMap = {
  revenue: DollarSign,
  profit: Wallet,
  users: Users,
}

const colorMap = {
  revenue: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    stroke: '#6366f1',
  },
  profit: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    stroke: '#8b5cf6',
  },
  users: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    stroke: '#3b82f6',
  },
}

// Sparkline SVG paths for each card
const sparklines = {
  revenue: "M0,25 L10,22 L20,24 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,0",
  profit: "M0,28 L15,25 L30,22 L45,18 L60,20 L75,10 L90,12 L100,5",
  users: "M0,5 L10,8 L20,10 L30,7 L40,12 L50,15 L60,18 L70,22 L80,20 L90,25 L100,28",
}

export default function KPICard({ title, value, change, changeLabel, icon }: KPIProps) {
  const Icon = iconMap[icon]
  const colors = colorMap[icon]
  const isPositive = change >= 0
  const pathD = sparklines[icon]

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden shadow-lg shadow-indigo-500/4">
      {/* Background Glow */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-full blur-2xl -mr-10 -mt-10 opacity-60 pointer-events-none`}
      ></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 ${colors.bg} rounded-xl ${colors.text}`}>
          <Icon />
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isPositive ? (
            <TrendingUp className="text-[14px] mr-1" fontSize="inherit" />
          ) : (
            <TrendingDown className="text-[14px] mr-1" fontSize="inherit" />
          )}
          {Math.abs(change)}%
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-400 mt-2">{changeLabel}</p>
      </div>

      {/* Sparkline Chart */}
      <div className="w-full h-12 mt-4 relative z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
          <defs>
            <linearGradient id={`gradient-${icon}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={pathD}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="opacity-70"
          />
          <path
            d={`${pathD} L100,30 L0,30 Z`}
            fill={`url(#gradient-${icon})`}
            opacity={0.3}
          />
        </svg>
      </div>
    </div>
  )
}
