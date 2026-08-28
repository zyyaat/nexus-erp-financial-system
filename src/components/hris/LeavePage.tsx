'use client'

/**
 * Simple Leave Page
 */

import React, { useState } from 'react'
import { 
  Calendar,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plane,
  HeartPulse,
  Baby,
  Home,
} from 'lucide-react'

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'balance'>('requests')
  
  // Mock leave requests
  const leaveRequests = [
    { id: '1', name: 'أحمد الخالدي', type: 'annual', typeAr: 'إجازة سنوية', startDate: '2025-02-15', endDate: '2025-02-22', days: 6, status: 'approved', color: '#3B82F6' },
    { id: '2', name: 'فاطمة حسن', type: 'sick', typeAr: 'إجازة مرضية', startDate: '2025-02-05', endDate: '2025-02-07', days: 3, status: 'approved', color: '#EF4444' },
    { id: '3', name: 'محمد الأحمد', type: 'hajj', typeAr: 'إجازة حج', startDate: '2025-06-10', endDate: '2025-06-30', days: 21, status: 'pending', color: '#14B8A6' },
    { id: '4', name: 'سارة محمود', type: 'maternity', typeAr: 'إجازة أمومة', startDate: '2025-04-01', endDate: '2025-09-18', days: 170, status: 'approved', color: '#EC4899' },
    { id: '5', name: 'خالد العتيبي', type: 'emergency', typeAr: 'إجازة طارئة', startDate: '2025-02-28', endDate: '2025-02-28', days: 1, status: 'pending', color: '#F59E0B' },
  ]

  // Mock leave balances
  const leaveBalances = [
    { employee: 'أحمد الخالدي', annual: { total: 21, used: 8 }, sick: { total: 120, used: 5 } },
    { employee: 'فاطمة حسن', annual: { total: 21, used: 12 }, sick: { total: 120, used: 8 } },
    { employee: 'محمد الأحمد', annual: { total: 21, used: 3 }, sick: { total: 120, used: 2 } },
    { employee: 'سارة محمود', annual: { total: 21, used: 0 }, sick: { total: 120, used: 0 } },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> موافق عليه</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" /> قيد المراجعة</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> مرفوض</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{status}</span>
    }
  }

  const getLeaveIcon = (type: string) => {
    switch (type) {
      case 'annual': return <Plane className="w-4 h-4" />
      case 'sick': return <HeartPulse className="w-4 h-4" />
      case 'maternity': return <Baby className="w-4 h-4" />
      case 'hajj':
      case 'umrah': return <Home className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-indigo-600" />
          إدارة الإجازات والطلبات
        </h1>
        <p className="text-gray-500 mt-1">طلبات الإجازات، الرصيد المتاح، وتواجد الفريق</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
          <p className="text-sm text-indigo-600 mb-1">إجمالي الإجازات</p>
          <p className="text-2xl font-bold text-indigo-700">201 يوم</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600 mb-1">طلبات معلقة</p>
          <p className="text-2xl font-bold text-yellow-700">8 طلب</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-green-600 mb-1">نسبة الاستخدام</p>
          <p className="text-2xl font-bold text-green-700">65%</p>
        </div>
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-4">
          <p className="text-sm text-pink-600 mb-1">إجازة أمومة نشطة</p>
          <p className="text-2xl font-bold text-pink-700">1 موظفة</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 flex mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          الطلبات ({leaveRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'balance'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          الأرصدة
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' ? (
        /* Requests List */
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="بحث باسم الموظف..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Leave Request Cards */}
          {leaveRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {request.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: `${request.color}20`, color: request.color }}
                      >
                        {getLeaveIcon(request.type)}
                        {request.typeAr}
                      </span>
                    </div>
                  </div>
                </div>
                
                {getStatusBadge(request.status)}
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{request.startDate}</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{request.endDate}</span>
                </div>
              </div>

              {/* Duration */}
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-lg mb-3">
                <span className="text-blue-800 font-semibold">{request.days}</span>
                <span className="text-blue-600 text-sm mr-1">يوم</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">طلب حديثاً</span>
                
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                      موافقة
                    </button>
                    <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                      رفض
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Balance View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaveBalances.map((balance, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{balance.employee}</h3>
              
              <div className="space-y-4">
                {/* Annual Leave */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-blue-600">
                      <Plane className="w-4 h-4" />
                      إجازة سنوية
                    </span>
                    <span className="font-medium text-gray-700">
                      {balance.annual.total - balance.annual.used} من {balance.annual.total} يوم
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 right-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${(balance.annual.used / balance.annual.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Sick Leave */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-red-600">
                      <HeartPulse className="w-4 h-4" />
                      إجازة مرضية
                    </span>
                    <span className="font-medium text-gray-700">
                      {balance.sick.total - balance.sick.used} من {balance.sick.total} يوم
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 right-0 h-full bg-red-500 rounded-full"
                      style={{ width: `${(balance.sick.used / balance.sick.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                طلب إجازة جديدة
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors text-right">
            <Plane className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-medium text-indigo-900">إجازة سنوية</p>
              <p className="text-xs text-indigo-600">من رصيدك الحالي</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-red-50 transition-colors text-right">
            <HeartPulse className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">إجازة مرضية</p>
              <p className="text-xs text-red-600">تتطلب تقرير طبي</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-purple-50 transition-colors text-right">
            <Home className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">إجازة حج/عمرة</p>
              <p className="text-xs text-purple-600">موافقة خاصة مطلوبة</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
