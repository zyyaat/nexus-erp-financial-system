'use client'

/**
 * Leave Management Page
 * 
 * Features:
 * - Multiple leave types (annual, sick, maternity, hajj, etc.)
 * - Leave request workflow with approvals
 * - Leave balance tracking
 * - Calendar view of leaves
 * - Team availability overview
 * - MENA-specific leave policies
 */

import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Send,
  Download,
  Users,
  Plane,
  HeartPulse,
  Baby,
  Home,
  UtensilsCrossed,
  GraduationCap,
  PartyPopper,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { mockEmployees } from '@/lib/data/mockEmployees'
import { mockLeaveRequests, mockHRMetrics } from '@/lib/data/mockHRISData'
import { DEPARTMENTS, LEAVE_TYPES } from '@/lib/types/employee'
import type { EmployeeTableRow, LeaveRequest, LeaveType, LeaveStatus } from '@/lib/types/employee'

// ============ LEAVE TYPE ICON ============

function getLeaveIcon(type: LeaveType) {
  const icons: Record<LeaveType, React.ReactNode> = {
    annual: <Plane className="w-4 h-4" />,
    sick: <HeartPulse className="w-4 h-4" />,
    unpaid: <Clock className="w-4 h-4" />,
    emergency: <AlertTriangle className="w-4 h-4" />,
    maternity: <Baby className="w-4 h-4" />,
    paternity: <Heart className="w-4 h-4" />,
    hajj: <Home className="w-4 h-4" />,
    umrah: <Home className="w-4 h-4" />,
    mourning: <Heart className="w-4 h-4" />,
    wedding: <PartyPopper className="w-4 h-4" />,
    study: <GraduationCap className="w-4 h-4" />,
    compensatory: <UtensilsCrossed className="w-4 h-4" />,
  }
  
  return icons[type] || <CalendarIcon className="w-4 h-4" />
}

// ============ LEAVE STATUS BADGE ============

function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const configs: Record<LeaveStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
    approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> },
    cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-700', icon: <XCircle className="w-3 h-3" /> },
    completed: { label: 'مكتمل', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" /> },
  }
  
  const config = configs[status]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

// ============ LEAVE TYPE BADGE ============

function LeaveTypeBadge({ type }: { type: LeaveType }) {
  const config = LEAVE_TYPES[type]
  
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
    >
      {getLeaveIcon(type)}
      {config.labelAr}
    </span>
  )
}

// ============ LEAVE BALANCE CARD ============

interface LeaveBalanceCardProps {
  employeeId: string
  employeeName: string
}

function LeaveBalanceCard({ employeeId, employeeName }: LeaveBalanceCardProps) {
  // Mock leave balance data
  const balances = [
    { type: 'annual' as LeaveType, total: 21, used: 8, remaining: 13 },
    { type: 'sick' as LeaveType, total: 120, used: 5, remaining: 115 },
    { type: 'urgent' as LeaveType, total: 7, used: 2, remaining: 5 },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">رصيد الإجازات</h3>
        <span className="text-sm text-gray-500">{employeeName}</span>
      </div>
      
      <div className="space-y-4">
        {balances.map((balance) => {
          const config = LEAVE_TYPES[balance.type]
          const usagePercent = (balance.used / balance.total) * 100
          
          return (
            <div key={balance.type}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <LeaveTypeBadge type={balance.type} />
                </div>
                <span className="text-xs text-gray-500">
                  {balance.remaining} من {balance.total} يوم
                </span>
              </div>
              
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 right-0 h-full rounded-full transition-all"
                  style={{ width: `${usagePercent}%`, backgroundColor: config.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
      
      <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
        طلب إجازة جديدة
      </button>
    </div>
  )
}

// ============ LEAVE REQUEST CARD ============

interface LeaveRequestCardProps {
  request: LeaveRequest
  employee?: EmployeeTableRow
  onView?: () => void
  onApprove?: () => void
  onReject?: () => void
}

function LeaveRequestCard({ request, employee, onView, onApprove, onReject }: LeaveRequestCardProps) {
  const config = LEAVE_TYPES[request.type]
  const daysUntilStart = Math.ceil((request.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {employee && (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {employee.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{employee?.fullName || request.employeeId}</h3>
            <p className="text-sm text-gray-500">{DEPARTMENTS[employee?.department || 'other'].nameAr}</p>
          </div>
        </div>
        
        <LeaveStatusBadge status={request.status} />
      </div>

      {/* Leave Type & Duration */}
      <div className="mb-4">
        <LeaveTypeBadge type={request.type} />
        
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>{request.startDate.toLocaleDateString('ar-EG')}</span>
          </div>
          <span className="text-gray-400">→</span>
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarIcon className="w-4 h-4" />
            <span>{request.endDate.toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
        
        <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-50 rounded-lg">
          <span className="text-blue-800 font-semibold">{request.totalDays}</span>
          <span className="text-blue-600 text-sm mr-1">يوم</span>
          {config.paid && (
            <span className="text-green-600 text-xs mr-2">• مدفوعة</span>
          )}
        </div>
      </div>

      {/* Timeline Info */}
      {daysUntilStart > 0 && request.status === 'approved' && (
        <div className="mb-3 flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
          <Clock className="w-4 h-4" />
          <span>تبدأ خلال {daysUntilStart} يوم</span>
        </div>
      )}

      {/* Approval Chain */}
      {request.approvals.length > 0 && (
        <div className="mb-4 space-y-2">
          {request.approvals.map((approval, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {approval.status === 'approved' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : approval.status === 'rejected' ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-500" />
              )}
              <span className={
                approval.status === 'approved' ? 'text-green-700' :
                approval.status === 'rejected' ? 'text-red-700' :
                'text-gray-500'
              }>
                موافقة {approval.approverRole}
              </span>
              {approval.comment && (
                <span className="text-gray-400 truncate">- {approval.comment}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">
          طلب في {request.requestedAt.toLocaleDateString('ar-EG')}
        </div>
        
        <div className="flex items-center gap-2">
          {onView && (
            <button
              onClick={onView}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="عرض التفاصيل"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          )}
          
          {request.status === 'pending' && onApprove && (
            <button
              onClick={onApprove}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              موافقة
            </button>
          )}
          
          {request.status === 'pending' && onReject && (
            <button
              onClick={onReject}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 flex items-center gap-1"
            >
              <XCircle className="w-3 h-3" />
              رفض
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ TEAM AVAILABILITY CALENDAR (Mini) ============

function TeamAvailabilityWidget() {
  // Mock team availability for current month
  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  
  const teamLeaves = [
    { date: 15, employees: ['أحمد الخالدي'] }, // Feb 15
    { date: 16, employees: ['أحمد الخالدي'] },
    { date: 17, employees: ['أحمد الخالدي'] },
    { date: 18, employees: ['أحمد الخالدي'] },
    { date: 19, employees: ['أحمد الخالدي'] },
    { date: 20, employees: ['أحمد الخالدي'] },
    { date: 21, employees: ['أحمد الخالدي'] },
    { date: 22, employees: ['أحمد الخالدي'] },
    { date: 5, employees: ['محمد الأحمد', 'فاطمة حسن'] }, // Sick leave
    { date: 6, employees: ['محمد الأحمد', 'فاطمة حسن'] },
    { date: 7, employees: ['محمد الأحمد', 'فاطمة حسن'] },
  ]
  
  const getDayClass = (day: number) => {
    const date = new Date(today.getFullYear(), today.getMonth(), day)
    const dayOfWeek = date.getDay()
    
    // Weekend
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      return 'bg-gray-100 text-gray-400'
    }
    
    // Today
    if (day === today.getDate()) {
      return 'bg-blue-600 text-white ring-2 ring-blue-300'
    }
    
    // Has leaves
    const hasLeaves = teamLeaves.find(l => l.date === day)
    if (hasLeaves) {
      return 'bg-red-100 text-red-700'
    }
    
    return 'hover:bg-gray-50'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          تواجد الفريق
        </h3>
        <span className="text-sm text-gray-500">
          {today.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      
      {/* Mini Calendar */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
          <button
            key={day}
            className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${getDayClass(day)}`}
          >
            {day}
          </button>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-600" />
          <span className="text-gray-600">اليوم</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100" />
          <span className="text-gray-600">إجازة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <span className="text-gray-600">عطلة</span>
        </div>
      </div>
      
      {/* Today's Leaves */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">إجازات اليوم:</p>
        <div className="space-y-1.5">
          {teamLeaves
            .filter(l => l.date === today.getDate())
            .flatMap(l => l.employees)
            .map((emp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="w-3.5 h-3.5" />
                {emp}
              </div>
            ))
          }
          {!teamLeaves.find(l => l.date === today.getDate()) && (
            <p className="text-sm text-green-600 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              كل الفريق متواجد
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ LEAVE STATISTICS ============

function LeaveStatistics() {
  const metrics = mockHRMetrics
  
  const stats = [
    {
      label: 'إجمالي الإجازات المطلوبة',
      value: Object.values(metrics.leaveByType).reduce((a, b) => a + b, 0),
      unit: 'يوم',
      icon: <CalendarIcon className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    {
      label: 'طلبات معلقة',
      value: metrics.pendingLeaveRequests,
      unit: 'طلب',
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'نسبة الاستخدام',
      value: metrics.leaveUtilizationRate,
      unit: '%',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-50',
    },
    {
      label: 'إجازة أمومة نشطة',
      value: metrics.leaveByType.maternity > 0 ? 1 : 0,
      unit: 'موظفة',
      icon: <Baby className="w-5 h-5 text-pink-600" />,
      bgColor: 'bg-pink-50',
    },
  ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-4`}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
            <div className="p-1.5 rounded-lg bg-white/60">
              {stat.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </p>
          <span className="text-xs text-gray-500">{stat.unit}</span>
        </div>
      ))}
    </div>
  )
}

// ============ MAIN LEAVE PAGE ============

export default function LeavePage() {
  const [selectedTab, setSelectedTab] = useState<'requests' | 'balance' | 'calendar'>('requests')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'all'>('all')

  // Combine requests with employee data
  const requestsWithEmployees = useMemo(() => {
    return mockLeaveRequests.map((request) => ({
      request,
      employee: mockEmployees.find(emp => emp.id === request.employeeId),
    }))
  }, [])

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requestsWithEmployees.filter(({ request, employee }) => {
      if (searchQuery && employee) {
        const query = searchQuery.toLowerCase()
        if (!employee.fullName.toLowerCase().includes(query)) return false
      }
      
      if (statusFilter !== 'all' && request.status !== statusFilter) return false
      
      if (typeFilter !== 'all' && request.type !== typeFilter) return false
      
      return true
    })
  }, [requestsWithEmployees, searchQuery, statusFilter, typeFilter])

  // Handlers
  const handleApprove = (requestId: string) => {
    console.log('Approve:', requestId)
  }

  const handleReject = (requestId: string) => {
    console.log('Reject:', requestId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإجازات والطلبات</h1>
            <p className="text-gray-500 mt-1">طلبات الإجازات، الرصيد المتاح، وتواجد الفريق</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              طلب إجازة جديد
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <LeaveStatistics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex">
            <button
              onClick={() => setSelectedTab('requests')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'requests'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                الطلبات ({mockLeaveRequests.length})
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('balance')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'balance'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                الأرصدة
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('calendar')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === 'calendar'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="w-4 h-4" />
                التقويم
              </div>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث باسم الموظف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | 'all')}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
                <option value="completed">مكتمل</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LeaveType | 'all')}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">كل الأنواع</option>
                {Object.entries(LEAVE_TYPES).map(([key, config]) => (
                  <option key={key} value={key}>{config.labelAr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Area */}
          {selectedTab === 'requests' && (
            /* Requests List */
            <div className="space-y-4">
              {filteredRequests.map(({ request, employee }, index) => (
                <LeaveRequestCard
                  key={index}
                  request={request}
                  employee={employee}
                  onView={() => console.log('View:', request.id)}
                  onApprove={() => handleApprove(request.id)}
                  onReject={() => handleReject(request.id)}
                />
              ))}
              
              {filteredRequests.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">لا توجد طلبات</p>
                  <p className="text-gray-400 text-sm mt-1">جرب تغيير معايير البحث أو الفلترة</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'balance' && (
            /* Leave Balances */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEmployees.slice(0, 6).map((employee) => (
                <LeaveBalanceCard
                  key={employee.id}
                  employeeId={employee.id}
                  employeeName={employee.fullName}
                />
              ))}
            </div>
          )}

          {selectedTab === 'calendar' && (
            /* Full Calendar View */
            <TeamAvailabilityWidget />
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Team Availability */}
          <TeamAvailabilityWidget />

          {/* Leave Types Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الإجازات حسب النوع</h3>
            
            <div className="space-y-3">
              {Object.entries(mockHRMetrics.leaveByType)
                .filter(([_, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => {
                  const config = LEAVE_TYPES[type as LeaveType]
                  if (!config) return null
                  
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LeaveTypeBadge type={type as LeaveType} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{count} يوم</span>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-right">
                <Plus className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-900">طلب إجازة سنوية</p>
                  <p className="text-xs text-indigo-600">من رصيدك الحالي</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-right">
                <HeartPulse className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">إجازة مرضية</p>
                  <p className="text-xs text-red-600">تتطلب تقرير طبي</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-right">
                <Home className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">إجازة حج/عمرة</p>
                  <p className="text-xs text-purple-600">موافقة خاصة مطلوبة</p>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Approvals Alert */}
          {mockHRMetrics.pendingLeaveRequests > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">طلبات تحتاج موافقتك</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    لديك {mockHRMetrics.pendingLeaveRequests} إجازة قيد الانتظار
                  </p>
                  <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
                مراجعة الطلبات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
