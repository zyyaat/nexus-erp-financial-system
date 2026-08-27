'use client'

/**
 * Attendance Management Page
 * 
 * Features:
 * - Daily attendance overview
 * - Employee clock in/out
 * - Attendance calendar view
 * - Late/Absent tracking
 * - Overtime management
 * - Attendance reports
 */

import React, { useState, useMemo } from 'react'
import {
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Edit,
  MapPin,
} from 'lucide-react'
import { mockEmployees } from '@/lib/data/mockEmployees'
import { generateMockAttendance, mockShiftPatterns, getTodayAttendanceSummary } from '@/lib/data/mockHRISData'
import { ATTENDANCE_STATUSES, SHIFT_TYPES, DEPARTMENTS } from '@/lib/types/employee'
import type { AttendanceRecord, AttendanceStatus, ShiftType, EmployeeTableRow } from '@/lib/types/employee'

// ============ ATTENDANCE STATUS BADGE ============

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const config = ATTENDANCE_STATUSES[status]
  
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${config.color}15`, color: config.color }}
    >
      <span>{config.icon}</span>
      {config.labelAr}
    </span>
  )
}

// ============ TIME DISPLAY COMPONENT ============

function TimeDisplay({ time }: { time: Date }) {
  return (
    <span className="text-sm font-mono">
      {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
    </span>
  )
}

// ============ ATTENDANCE ROW COMPONENT ============

interface AttendanceRowProps {
  employee: EmployeeTableRow
  attendance: AttendanceRecord | null
  onClockIn?: (employeeId: string) => void
  onClockOut?: (employeeId: string) => void
}

function AttendanceRow({ employee, attendance, onClockIn, onClockOut }: AttendanceRowProps) {
  const isClockedIn = attendance?.clockIn && !attendance?.clockOut
  
  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      {/* Employee Info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {employee.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{employee.fullName}</p>
            <p className="text-xs text-gray-500">{employee.employeeId}</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">{DEPARTMENTS[employee.department].nameAr}</span>
      </td>

      {/* Shift */}
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">
          {attendance ? SHIFT_TYPES[attendance.scheduledShift].timeRange : '-'}
        </span>
      </td>

      {/* Scheduled Time */}
      <td className="px-4 py-4">
        <span className="text-sm font-mono text-gray-500">
          {attendance ? `${attendance.scheduledStartTime} - ${attendance.scheduledEndTime}` : '-'}
        </span>
      </td>

      {/* Clock In */}
      <td className="px-4 py-4">
        {attendance?.clockIn ? (
          <div className="flex items-center gap-2">
            <TimeDisplay time={attendance.clockIn} />
            {attendance.isLate && (
              <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" />
                +{attendance.lateMinutes}د
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={() => onClockIn?.(employee.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            تسجيل حضور
          </button>
        )}
      </td>

      {/* Clock Out */}
      <td className="px-4 py-4">
        {attendance?.clockOut ? (
          <TimeDisplay time={attendance.clockOut} />
        ) : isClockedIn ? (
          <button
            onClick={() => onClockOut?.(employee.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
          >
            <UserX className="w-4 h-4" />
            تسجيل انصراف
          </button>
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </td>

      {/* Hours Worked */}
      <td className="px-4 py-4">
        <div className="text-sm">
          <span className="font-semibold text-gray-900">{attendance?.actualHours || 0}</span>
          <span className="text-gray-500"> ساعة</span>
          {attendance && attendance.overtimeMinutes > 0 && (
            <span className="mr-2 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              +{Math.round(attendance.overtimeMinutes / 60)}س إضافي
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        {attendance ? <StatusBadge status={attendance.status} /> : <span className="text-gray-300">-</span>}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="عرض التفاصيل">
            <Eye className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="تعديل">
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          {attendance?.clockInLocation && (
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="الموقع">
              <MapPin className="w-4 h-4 text-blue-500" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

// ============ SUMMARY CARDS ============

function SummaryCards() {
  const summary = getTodayAttendanceSummary()
  
  const cards = [
    {
      label: 'إجمالي الموظفين',
      value: summary.total,
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'حاضرون',
      value: summary.present,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    },
    {
      label: 'متأخرون',
      value: summary.late,
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'غائبون',
      value: summary.absent,
      icon: <XCircle className="w-5 h-5" />,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
    },
    {
      label: 'في إجازة',
      value: summary.onLeave,
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bgColor} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${card.textColor}`}>{card.label}</span>
            <div className={`${card.color} p-1.5 rounded-lg text-white`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

// ============ MAIN ATTENDANCE PAGE ============

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  
  // Generate attendance data for selected date
  const attendanceData = useMemo(() => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    
    return mockEmployees.map((emp) => ({
      employee: emp,
      attendance: generateMockAttendance(emp.id, year, month).find(
        (a) => a.date.toDateString() === selectedDate.toDateString()
      ) || null,
    }))
  }, [selectedDate])

  // Filter data
  const filteredData = useMemo(() => {
    return attendanceData.filter(({ employee, attendance }) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          employee.fullName.toLowerCase().includes(query) ||
          employee.employeeId.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (!attendance || attendance.status !== statusFilter) return false
      }

      // Department filter
      if (departmentFilter !== 'all' && employee.department !== departmentFilter) {
        return false
      }

      return true
    })
  }, [attendanceData, searchQuery, statusFilter, departmentFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredData.length
    const present = filteredData.filter(({ a }) => a?.status === 'present').length
    const late = filteredData.filter(({ a }) => a?.status === 'late').length
    const absent = filteredData.filter(({ a }) => a?.status === 'absent').length
    const onLeave = filteredData.filter(({ a }) => a?.status === 'on-leave').length
    
    return { total, present, late, absent, onLeave }
  }, [filteredData])

  // Handlers
  const handleClockIn = (employeeId: string) => {
    console.log('Clock in:', employeeId)
    // TODO: Implement actual clock-in logic
  }

  const handleClockOut = (employeeId: string) => {
    console.log('Clock out:', employeeId)
    // TODO: Implement actual clock-out logic
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الحضور والغياب</h1>
            <p className="text-gray-500 mt-1">تتبع ومتابعة حضور وانصراف الموظفين</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير التقرير
            </button>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <div className="text-center min-w-[200px]">
              <p className="text-xl font-bold text-gray-900">
                {selectedDate.toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <button
                onClick={goToToday}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
              >
                اليوم
              </button>
            </div>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">اليوم:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedDate.getDay() === 5 || selectedDate.getDay() === 6
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {selectedDate.getDay() === 5 || selectedDate.getDay() === 6 ? 'عطلة' : 'عمل'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو الرقم الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | 'all')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(ATTENDANCE_STATUSES).map(([key, config]) => (
              <option key={key} value={key}>{config.labelAr}</option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الأقسام</option>
            {Object.entries(DEPARTMENTS).map(([key, config]) => (
              <option key={key} value={key}>{config.nameAr}</option>
            ))}
          </select>

          {/* Results count */}
          <span className="text-sm text-gray-500">
            عرض {filteredData.length} من {stats.total} موظف
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الموظف
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  القسم
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  المناوبة
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الوقت المقرر
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  وقت الحضور
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  وقت الانصراف
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ساعات العمل
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(({ employee, attendance }) => (
                <AttendanceRow
                  key={employee.id}
                  employee={employee}
                  attendance={attendance}
                  onClockIn={handleClockIn}
                  onClockOut={handleClockOut}
                />
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">لا توجد نتائج</p>
                      <p className="text-gray-400 text-sm">جرب تغيير معايير البحث أو الفلترة</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
          <p className="text-xs text-gray-500">حاضر</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          <p className="text-xs text-gray-500">متأخر</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          <p className="text-xs text-gray-500">غائب</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.onLeave}</p>
          <p className="text-xs text-gray-500">في إجازة</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500">نسبة الحضور</p>
        </div>
      </div>
    </div>
  )
}
