'use client'

/**
 * HRIS Dashboard - Enterprise HR Analytics
 * 
 * Comprehensive dashboard with:
 * - KPI cards (headcount, turnover, costs, attendance, performance)
 * - Attendance summary widget
 * - Pending approvals widget
 * - Upcoming events widget
 * - Department breakdown chart
 * - Trend charts
 */

import React, { useState, useMemo } from 'react'
import {
  Users,
  UserPlus,
  UserMinus,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MoreHorizontal,
} from 'lucide-react'
import { mockHRMetrics, mockDepartmentAnalytics, getTodayAttendanceSummary, getPendingApprovalsCount, getUpcomingEvents } from '@/lib/data/mockHRISData'
import { DEPARTMENTS } from '@/lib/types/employee'

// ============ KPI CARD COMPONENT ============

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
  color: string
  bgColor: string
}

function KPICard({ title, value, subtitle, icon, trend, color, bgColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && trend.direction === 'up' && (
                <span className="flex items-center text-red-500 text-sm">
                  <ArrowUpRight className="w-4 h-4 ml-0.5" />
                  {Math.abs(trend.value)}%
                </span>
              )}
              {trend && trend.direction === 'down' && (
                <span className="flex items-center text-green-500 text-sm">
                  <ArrowDownRight className="w-4 h-4 ml-0.5" />
                  {Math.abs(trend.value)}%
                </span>
              )}
              {trend?.direction === 'neutral' && (
                <span className="flex items-center text-gray-500 text-sm">
                  <Minus className="w-4 h-4 ml-0.5" />
                  0%
                </span>
              )}
              {subtitle && (
                <span className="text-gray-400 text-sm">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// ============ ATTENDANCE WIDGET ============

interface AttendanceWidgetProps {
  data: ReturnType<typeof getTodayAttendanceSummary>
}

function AttendanceWidget({ data }: AttendanceWidgetProps) {
  const total = data.present + data.absent + data.late + data.onLeave
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        ملخص الحضور اليوم
      </h3>
      
      {/* Progress bar */}
      <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all"
          style={{ width: `${(data.present / total) * 100}%` }}
        />
        <div 
          className="absolute top-0 h-full bg-yellow-500 transition-all"
          style={{ 
            left: `${(data.present / total) * 100}%`,
            width: `${(data.late / total) * 100}%` 
          }}
        />
        <div 
          className="absolute top-0 h-full bg-purple-500 transition-all"
          style={{ 
            left: `${((data.present + data.late) / total) * 100}%`,
            width: `${(data.onLeave / total) * 100}%` 
          }}
        />
        <div 
          className="absolute top-0 h-full bg-red-500 transition-all"
          style={{ 
            left: `${((data.present + data.late + data.onLeave) / total) * 100}%`,
            width: `${(data.absent / total) * 100}%` 
          }}
        />
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-gray-800">{data.present}</span>
          </div>
          <span className="text-xs text-gray-500">حاضر</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-800">{data.late}</span>
          </div>
          <span className="text-xs text-gray-500">متأخر</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-semibold text-gray-800">{data.onLeave}</span>
          </div>
          <span className="text-xs text-gray-500">إجازة</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-gray-800">{data.absent}</span>
          </div>
          <span className="text-xs text-gray-500">غائب</span>
        </div>
      </div>
      
      {/* Rate */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">نسبة الحضور</span>
          <span className="text-lg font-bold text-green-600">
            {Math.round((data.present / total) * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ============ PENDING APPROVALS WIDGET ============

function PendingApprovalsWidget() {
  const pending = getPendingApprovalsCount()
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-500" />
        طلبات معلقة
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">إجازات</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{pending.leaveRequests}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">ترقيات</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{pending.promotions}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">إضافي</span>
          </div>
          <span className="text-lg font-bold text-orange-600">{pending.overtimeRequests}</span>
        </div>
      </div>
      
      <button className="w-full mt-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
        عرض كل الطلبات ({pending.total})
      </button>
    </div>
  )
}

// ============ UPCOMING EVENTS WIDGET ============

function UpcomingEventsWidget() {
  const events = getUpcomingEvents()
  
  const eventTypeConfig = {
    birthday: { icon: '🎂', label: 'عيد ميلاد', color: 'bg-pink-50 text-pink-600' },
    anniversary: { icon: '🏆', label: 'ذكرى سنوية', color: 'bg-yellow-50 text-yellow-600' },
    'review-due': { icon: '📋', label: 'تقييم', color: 'bg-blue-50 text-blue-600' },
    'contract-end': { icon: '📄', label: 'انتهاء عقد', color: 'bg-red-50 text-red-600' },
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-500" />
        أحداث قادمة
      </h3>
      
      <div className="space-y-3">
        {events.map((event, index) => {
          const config = eventTypeConfig[event.type]
          return (
            <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-2xl">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{event.employeeName}</p>
                <p className="text-xs text-gray-500">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {event.date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============ DEPARTMENT BREAKDOWN CHART ============

function DepartmentBreakdownChart() {
  const analytics = mockDepartmentAnalytics
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل الأقسام</h3>
      
      <div className="space-y-4">
        {analytics.map((dept) => {
          const deptConfig = DEPARTMENTS[dept.department]
          const maxHeadcount = Math.max(...analytics.map(d => d.headcount))
          const widthPercent = (dept.headcount / maxHeadcount) * 100
          
          return (
            <div key={dept.department} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: deptConfig.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{deptConfig.nameAr}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{dept.headcount} موظف</span>
                  <span>{dept.avgSalary.toLocaleString()} ج.م</span>
                </div>
              </div>
              
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all group-hover:opacity-80"
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: deptConfig.color 
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>معدل الدوران: {dept.turnoverRate}%</span>
                <span>الأداء: {dept.avgPerformanceScore}/100</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============ PERFORMANCE DISTRIBUTION ============

function PerformanceDistribution() {
  const metrics = mockHRMetrics
  
  const distribution = [
    { label: 'استثنائي', count: 2, color: '#8B5CF6' },
    { label: 'يتجاوز التوقعات', count: 4, color: '#3B82F6' },
    { label: 'يلبي التوقعات', count: 12, color: '#10B981' },
    { label: 'يحتاج تحسين', count: 4, color: '#F59E0B' },
    { label: 'غير مرضي', count: 2, color: '#EF4444' },
  ]
  
  const total = distribution.reduce((sum, d) => sum + d.count, 0)
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-500" />
        توزيع الأداء
      </h3>
      
      <div className="space-y-3">
        {distribution.map((item) => {
          const percent = Math.round((item.count / total) * 100)
          
          return (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">{item.count} ({percent}%)</span>
              </div>
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-full transition-all"
                  style={{ width: `${percent}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{metrics.highPerformersCount}</p>
            <p className="text-xs text-gray-500">متميزون</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">{metrics.averagePerformanceScore}</p>
            <p className="text-xs text-gray-500">متوسط الأداء</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{metrics.lowPerformersCount}</p>
            <p className="text-xs text-gray-500">يحتاجون تطوير</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ COST BREAKDOWN ============

function CostBreakdown() {
  const metrics = mockHRMetrics
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-500" />
        التكاليف الشهرية
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-green-700">صافي الرواتب</span>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-700">
            {metrics.payrollCost.toLocaleString('ar-EG')} ج.م
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">المزايا</p>
            <p className="text-lg font-bold text-blue-700">
              {metrics.benefitsCost.toLocaleString('ar-EG')}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">تكلفة/موظف</p>
            <p className="text-lg font-bold text-purple-700">
              {metrics.costPerEmployee.toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">متوسط الراتب</span>
            <span className="font-medium text-gray-800">{metrics.averageSalary.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">متوسط الراتب (وسيط)</span>
            <span className="font-medium text-gray-800">{metrics.medianSalary.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">تكلفة التوظيف</span>
            <span className="font-medium text-gray-800">{metrics.costPerHire.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">إيراد/موظف</span>
            <span className="font-medium text-green-600">{metrics.revenuePerEmployee?.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN DASHBOARD COMPONENT ============

export default function HRISDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')
  
  const metrics = useMemo(() => mockHRMetrics, [])
  const attendanceSummary = useMemo(() => getTodayAttendanceSummary(), [])
  
  // Calculate trends (mock)
  const kpiData = [
    {
      title: 'إجمالي الموظفين',
      value: metrics.totalHeadcount,
      subtitle: `+${metrics.newHiresThisMonth} جديد`,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      trend: { value: 8.3, direction: 'up' as const },
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'معدل الدوران',
      value: `${metrics.turnoverRate}%`,
      subtitle: 'شهري',
      icon: <UserMinus className="w-6 h-6 text-red-600" />,
      trend: { value: -0.5, direction: 'down' as const },
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'نسبة الحضور',
      value: `${metrics.averageAttendanceRate}%`,
      subtitle: 'متوسط شهري',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      trend: { value: 1.2, direction: 'up' as const },
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'التكلفة الشهرية',
      value: `${(metrics.payrollCost / 1000).toFixed(0)}K`,
      subtitle: 'ج.م',
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      trend: { value: 2.5, direction: 'up' as const },
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'متوسط الأداء',
      value: metrics.averagePerformanceScore,
      subtitle: '/ 100 نقطة',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      trend: { value: 3.1, direction: 'up' as const },
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'طلبات معلقة',
      value: getPendingApprovalsCount().total,
      subtitle: 'تحتاج موافقة',
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الموارد البشرية</h1>
            <p className="text-gray-500 mt-1">نظرة شاملة على أداء المؤسسة ومواردها البشرية</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Period selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {[
                { value: 'month' as const, label: 'شهري' },
                { value: 'quarter' as const, label: 'ربع سنوي' },
                { value: 'year' as const, label: 'سنوي' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
            
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              تصدير التقرير
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Attendance & Approvals Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttendanceWidget data={attendanceSummary} />
            <PendingApprovalsWidget />
          </div>

          {/* Department Breakdown */}
          <DepartmentBreakdownChart />

          {/* Performance Distribution */}
          <PerformanceDistribution />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Cost Breakdown */}
          <CostBreakdown />

          {/* Upcoming Events */}
          <UpcomingEventsWidget />

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">إحصائيات سريعة</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">موظفون جدد هذا الشهر</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  +{metrics.newHiresThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">إنهاء تعاقدات</span>
                <span className="font-semibold text-red-600 flex items-center gap-1">
                  <UserMinus className="w-4 h-4" />
                  {metrics.terminationsThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">ترقيات هذا الفترة</span>
                <span className="font-semibold text-purple-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {metrics.promotionsThisPeriod}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">ساعات العمل الإضافي</span>
                <span className="font-semibold text-orange-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {metrics.overtimeHoursThisMonth} ساعة
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">درجة رضا الموظفين</span>
                <span className="font-semibold text-green-600">{metrics.engagementScore}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
