'use client'

/**
 * Simple Attendance Page
 */

import React, { useState } from 'react'
import { 
  Clock,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  ChevronRight,
  ChevronLeft,
  UserCheck,
} from 'lucide-react'

export default function AttendancePage() {
  const [selectedDate] = useState(new Date())
  
  // Mock attendance data
  const attendanceData = [
    { id: '1', name: 'أحمد الخالدي', department: 'الإدارة', status: 'present', time: '09:00', outTime: '17:00' },
    { id: '2', name: 'فاطمة حسن', department: 'تقنية المعلومات', status: 'late', time: '09:25', outTime: null, lateMinutes: 25 },
    { id: '3', name: 'محمد الأحمد', department: 'المبيعات', status: 'absent', time: null, outTime: null },
    { id: '4', name: 'سارة محمود', department: 'الموارد البشرية', status: 'on-leave', time: null, outTime: null, leaveType: 'إجازة سنوية' },
    { id: '5', name: 'خالد العتيبي', department: 'المالية', status: 'present', time: '08:55', outTime: '17:10' },
    { id: '6', name: 'نورا سعيد', department: 'التسويق', status: 'present', time: '09:05', outTime: null },
    { id: '7', name: 'عمر حسن', department: 'خدمة العملاء', status: 'late', time: '09:45', outTime: null, lateMinutes: 45 },
    { id: '8', name: 'ليلى أحمد', department: 'العمليات', status: 'absent', time: null, outTime: null },
  ]

  const summary = {
    total: attendanceData.length,
    present: attendanceData.filter(a => a.status === 'present').length,
    late: attendanceData.filter(a => a.status === 'late').length,
    absent: attendanceData.filter(a => a.status === 'absent').length,
    onLeave: attendanceData.filter(a => a.status === 'on-leave').length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> حاضر</span>
      case 'late':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><AlertTriangle className="w-3 h-3" /> متأخر</span>
      case 'absent':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> غائب</span>
      case 'on-leave':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><Calendar className="w-3 h-3" /> إجازة</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-600" />
          إدارة الحضور والغياب
        </h1>
        <p className="text-gray-500 mt-1">تتبع ومتابعة حضور وانصراف الموظفين</p>
        
        {/* Date Display */}
        <div className="mt-4 inline-flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-2">
          <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          <span className="font-medium text-gray-900">
            {selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-600 mb-1">إجمالي الموظفين</p>
          <p className="text-3xl font-bold text-blue-700">{summary.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-sm text-green-600 mb-1">حاضرون</p>
          <p className="text-3xl font-bold text-green-700">{summary.present}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-sm text-yellow-600 mb-1">متأخرون</p>
          <p className="text-3xl font-bold text-yellow-700">{summary.late}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-sm text-red-600 mb-1">غائبون</p>
          <p className="text-3xl font-bold text-red-700">{summary.absent}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <p className="text-sm text-purple-600 mb-1">في إجازة</p>
          <p className="text-3xl font-bold text-purple-700">{summary.onLeave}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الموظف</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">القسم</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">وقت الحضور</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">وقت الانصراف</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{emp.department}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-mono">
                    {emp.time || '-'}
                    {emp.lateMinutes && (
                      <span className="mr-2 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        +{emp.lateMinutes}د
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-mono">{emp.outTime || '-'}</td>
                  <td className="px-4 py-4">{getStatusBadge(emp.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-green-600">{summary.present}</p>
          <p className="text-xs text-gray-500">حاضر</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-yellow-600">{summary.late}</p>
          <p className="text-xs text-gray-500">متأخر</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-red-600">{summary.absent}</p>
          <p className="text-xs text-gray-500">غائب</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-purple-600">{summary.onLeave}</p>
          <p className="text-xs text-gray-500">إجازة</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-xl font-bold text-green-600">
            {Math.round((summary.present / summary.total) * 100)}%
          </p>
          <p className="text-xs text-gray-500">نسبة الحضور</p>
        </div>
      </div>
    </div>
  )
}
