'use client'

/**
 * Simple HRIS Dashboard
 * Stable version with minimal dependencies
 */

import React from 'react'
import { 
  Users, 
  UserPlus, 
  UserMinus,
  DollarSign, 
  Clock, 
  Award, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Calendar,
} from 'lucide-react'
import { mockHRMetrics } from '@/lib/data/mockHRISData'

export default function HRISDashboard() {
  const metrics = mockHRMetrics

  const kpiCards = [
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
      value: 10,
      subtitle: 'تحتاج موافقة',
      icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">لوحة تحكم الموارد البشرية</h1>
        <p className="text-gray-500 mt-1">نظرة شاملة على أداء المؤسسة ومواردها البشرية</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                {(kpi.subtitle || kpi.trend) && (
                  <div className="mt-2 flex items-center gap-2">
                    {kpi.trend && kpi.trend.direction === 'up' && (
                      <span className="flex items-center text-red-500 text-sm">
                        <TrendingUp className="w-4 h-4 ml-0.5" />
                        {Math.abs(kpi.trend.value)}%
                      </span>
                    )}
                    {kpi.trend && kpi.trend.direction === 'down' && (
                      <span className="flex items-center text-green-500 text-sm">
                        <TrendingDown className="w-4 h-4 ml-0.5" />
                        {Math.abs(kpi.trend.value)}%
                      </span>
                    )}
                    {kpi.subtitle && (
                      <span className="text-gray-400 text-sm">{kpi.subtitle}</span>
                    )}
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            ملخص الحضور اليوم
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">24</p>
                <p className="text-xs text-gray-500">إجمالي</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">19</p>
                <p className="text-xs text-gray-500">حاضر</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">3</p>
                <p className="text-xs text-gray-500">متأخر</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-xs text-gray-500">غائب</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">نسبة الحضور</span>
                <span className="text-lg font-bold text-green-600">79%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
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
              <span className="text-lg font-bold text-blue-600">3</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">ترقيات</span>
              </div>
              <span className="text-lg font-bold text-purple-600">2</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">عمل إضافي</span>
              </div>
              <span className="text-lg font-bold text-orange-600">5</span>
            </div>
            
            <button className="w-full mt-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
              عرض كل الطلبات (10)
            </button>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            التكاليف الشهرية
          </h3>
          
          <div className="space-y-3">
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
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            توزيع الأداء
          </h3>
          
          <div className="space-y-3">
            {[
              { label: 'استثنائي', count: 2, color: '#8B5CF6', percent: 8 },
              { label: 'يتجاوز التوقعات', count: 4, color: '#3B82F6', percent: 17 },
              { label: 'يلبي التوقعات', count: 12, color: '#10B981', percent: 50 },
              { label: 'يحتاج تحسين', count: 4, color: '#F59E0B', percent: 17 },
              { label: 'غير مرضي', count: 2, color: '#EF4444', percent: 8 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{item.count} ({item.percent}%)</span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xl font-bold text-green-600">{metrics.highPerformersCount}</p>
              <p className="text-xs text-gray-500">متميزون</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-600">{metrics.averagePerformanceScore}</p>
              <p className="text-xs text-gray-500">المتوسط</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-500">{metrics.lowPerformersCount}</p>
              <p className="text-xs text-gray-500">يحتاجون تطوير</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
