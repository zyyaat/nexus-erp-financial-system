'use client'

/**
 * Simple Employee Management Page
 * Stable version with minimal dependencies
 */

import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Plus, 
  Download, 
  Filter,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react'
import { mockEmployees } from '@/lib/data/mockEmployees'
import { DEPARTMENTS, EMPLOYMENT_TYPES, EMPLOYEE_STATUSES } from '@/lib/types/employee'
import type { EmployeeTableRow, DepartmentId, EmployeeStatus, EmploymentType } from '@/lib/types/employee'

// ============ SIMPLE COMPONENTS ============

function StatusBadge({ status }: { status: EmployeeStatus }) {
  const config = EMPLOYEE_STATUSES[status]
  if (!config) return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{status}</span>
  
  return (
    <span 
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      {config.labelAr}
    </span>
  )
}

function DepartmentBadge({ department }: { department: DepartmentId }) {
  const config = DEPARTMENTS[department]
  if (!config) return <span>{department}</span>
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${config.color}20`, color: config.color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
      {config.nameAr}
    </span>
  )
}

// ============ MAIN PAGE ============

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  
  // Convert employees to table rows
  const tableRows: EmployeeTableRow[] = useMemo(() => {
    return mockEmployees.map(emp => ({
      id: emp.id,
      employeeId: emp.employmentInfo.employeeId,
      fullName: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`,
      email: emp.contactInfo.personalEmail || '',
      department: emp.employmentInfo.department,
      jobTitle: emp.employmentInfo.jobTitle,
      status: emp.employmentInfo.status,
      employmentType: emp.employmentInfo.employmentType,
      hireDate: emp.employmentInfo.hireDate,
      phone: emp.contactInfo.phone,
      workLocation: emp.employmentInfo.workLocation,
      profilePictureUrl: emp.profilePictureUrl,
      isActive: emp.employmentInfo.status === 'active',
    }))
  }, [])
  
  // Filter data
  const filteredData = useMemo(() => {
    return tableRows.filter(emp => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = emp.fullName.toLowerCase().includes(query)
        const matchesId = emp.employeeId.toLowerCase().includes(query)
        const matchesEmail = emp.email.toLowerCase().includes(query)
        if (!matchesName && !matchesId && !matchesEmail) return false
      }
      
      // Department filter
      if (departmentFilter !== 'all' && emp.department !== departmentFilter) return false
      
      // Status filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) return false
      
      return true
    })
  }, [tableRows, searchQuery, departmentFilter, statusFilter])
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  
  // Stats
  const stats = {
    total: tableRows.length,
    active: tableRows.filter(e => e.isActive).length,
    onLeave: tableRows.filter(e => e.status === 'on-leave').length,
    departments: new Set(tableRows.map(e => e.department)).size,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          إدارة الموظفين
        </h1>
        <p className="text-gray-500 mt-1">{stats.total} موظف في النظام</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">إجمالي الموظفين</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-green-600">نشطون</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600">في إجازة</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.onLeave}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-sm text-blue-600">الأقسام</p>
          <p className="text-2xl font-bold text-blue-700">{stats.departments}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم، البريد الإلكتروني، أو الرقم الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الأقسام</option>
            {Object.entries(DEPARTMENTS).map(([key, dept]) => (
              <option key={key} value={key}>{dept.nameAr}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(EMPLOYEE_STATUSES).map(([key, status]) => (
              <option key={key} value={key}>{status.labelAr}</option>
            ))}
          </select>

          {/* Actions */}
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            إضافة موظف
          </button>
          
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium">
            <Download className="w-5 h-5" />
            تصدير
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الموظف</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">القسم</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">المسمى الوظيفي</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الحالة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">نوع التوظيف</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{emp.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <DepartmentBadge department={emp.department} />
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-sm text-gray-700">{emp.jobTitle}</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={emp.status} />
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">
                      {EMPLOYMENT_TYPES[emp.employmentType]?.labelAr || emp.employmentType}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="المزيد"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">لا يوجد موظفون</p>
                    <p className="text-gray-400 text-sm mt-1">جرب تغيير معايير البحث أو الفلترة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              عرض {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} من {filteredData.length}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
