'use client'

/**
 * Enterprise Employee Management Page
 * Full CRUD Operations + PDF Export + Real Interactions
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react'
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
  Edit3,
  Trash2,
  X,
  Save,
  UserPlus,
  FileText,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import { DEPARTMENTS, EMPLOYMENT_TYPES, EMPLOYEE_STATUSES } from '@/lib/types/employee'
import type { EmployeeTableRow, DepartmentId, EmployeeStatus, EmploymentType } from '@/lib/types/employee'

// ============ TYPES ============

interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: DepartmentId
  jobTitle: string
  status: EmployeeStatus
  employmentType: EmploymentType
  salary: number
  hireDate: string
  workLocation: string
}

interface Employee extends EmployeeTableRow {
  firstName: string
  lastName: string
  notes?: string
}

const emptyForm: EmployeeFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: 'it',
  jobTitle: '',
  status: 'active',
  employmentType: 'full-time',
  salary: 0,
  hireDate: new Date().toISOString().split('T')[0],
  workLocation: 'الرياض',
}

// ============ LOCAL STORAGE ============

const STORAGE_KEY = 'hris_employees'

function loadEmployees(): Employee[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Error loading employees:', e)
  }
  // Default sample data
  return [
    {
      id: '1',
      employeeId: 'EMP-001',
      fullName: 'أحمد محمد العلي',
      firstName: 'أحمد',
      lastName: 'محمد العلي',
      email: 'ahmed.ali@company.com',
      phone: '+966501234567',
      department: 'it',
      jobTitle: 'مطور برمجيات أول',
      status: 'active',
      employmentType: 'full-time',
      hireDate: '2023-01-15',
      workLocation: 'الرياض',
      profilePictureUrl: '',
      isActive: true,
      salary: 15000,
      notes: 'موظف متميز',
    },
    {
      id: '2',
      employeeId: 'EMP-002',
      fullName: 'سارة عبدالله الخالد',
      firstName: 'سارة',
      lastName: 'عبدالله الخالد',
      email: 'sara.khaled@company.com',
      phone: '+966509876543',
      department: 'hr',
      jobTitle: 'أخصائي موارد بشرية',
      status: 'active',
      employmentType: 'full-time',
      hireDate: '2023-03-01',
      workLocation: 'الجدة',
      profilePictureUrl: '',
      isActive: true,
      salary: 12000,
    },
    {
      id: '3',
      employeeId: 'EMP-003',
      fullName: 'خالد سعد الدوسري',
      firstName: 'خالد',
      lastName: 'سعد الدوسري',
      email: 'khaled.dosari@company.com',
      phone: '+966555555555',
      department: 'finance',
      jobTitle: 'محاسب مالي',
      status: 'on-leave',
      employmentType: 'full-time',
      hireDate: '2022-06-15',
      workLocation: 'الدمام',
      profilePictureUrl: '',
      isActive: false,
      salary: 11000,
    },
  ]
}

function saveEmployees(employees: Employee[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  } catch (e) {
    console.error('Error saving employees:', e)
  }
}

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

// ============ PDF EXPORT ============

async function exportToPDF(employees: Employee[], title: string = 'تقرير الموظفين') {
  // Dynamic import for smaller bundle size
  const { default: jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })
  
  // RTL support
  doc.setR2L(true)
  
  // Colors
  const primaryColor = [41, 98, 255] // Blue
  const headerBgColor = [248, 250, 252] // Light gray
  
  // Title
  doc.setFontSize(20)
  doc.setTextColor(...primaryColor)
  doc.text(title, 148, 20, { align: 'center' })
  
  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}`, 148, 28, { align: 'center' })
  
  // Stats summary
  doc.setFontSize(12)
  doc.setTextColor(50, 50, 50)
  doc.text(`إجمالي الموظفين: ${employees.length}`, 20, 40)
  
  const activeCount = employees.filter(e => e.status === 'active').length
  doc.text(`الموظفون النشطون: ${activeCount}`, 120, 40)
  
  // Table headers
  const startY = 50
  const colWidths = [25, 35, 45, 30, 30, 30, 25, 30]
  const headers = ['الرقم', 'الاسم', 'البريد الإلكتروني', 'القسم', 'المسمى الوظيفي', 'الحالة', 'نوع التوظيف', 'الراتب']
  let x = 20
  
  // Header row
  doc.setFillColor(...headerBgColor)
  doc.rect(20, startY - 5, 267, 10, 'F')
  doc.setFontSize(9)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(50, 50, 50)
  
  headers.forEach((header, i) => {
    doc.text(header, x + colWidths[i] / 2, startY, { align: 'center' })
    x += colWidths[i]
  })
  
  // Data rows
  doc.setFontSize(8)
  doc.setFont(undefined, 'normal')
  
  employees.forEach((emp, rowIndex) => {
    const y = startY + 8 + (rowIndex * 12)
    
    // Alternate row colors
    if (rowIndex % 2 === 0) {
      doc.setFillColor(255, 255, 255)
    } else {
      doc.setFillColor(252, 252, 252)
    }
    doc.rect(20, y - 5, 267, 10, 'F')
    
    const rowData = [
      emp.employeeId,
      emp.fullName,
      emp.email,
      DEPARTMENTS[emp.department]?.nameAr || emp.department,
      emp.jobTitle,
      EMPLOYEE_STATUSES[emp.status]?.labelAr || emp.status,
      EMPLOYMENT_TYPES[emp.employmentType]?.labelAr || emp.employmentType,
      `${emp.salary || 0} ر.س`,
    ]
    
    x = 20
    doc.setTextColor(60, 60, 60)
    rowData.forEach((cell, i) => {
      // Truncate long text
      const text = cell.length > 20 ? cell.substring(0, 18) + '...' : cell
      doc.text(text, x + colWidths[i] / 2, y, { align: 'center' })
      x += colWidths[i]
    })
    
    // New page if needed
    if (y > 180) {
      doc.addPage()
    }
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`صفحة ${i} من ${pageCount}`, 148, 200, { align: 'center' })
  }
  
  // Save
  doc.save(`employees-report-${new Date().toISOString().split('T')[0]}.pdf`)
}

// ============ MODAL COMPONENTS ============

function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  employee,
  title,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EmployeeFormData) => void
  employee?: Employee | null
  title: string
}) {
  const [form, setForm] = useState<EmployeeFormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({})

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        jobTitle: employee.jobTitle,
        status: employee.status,
        employmentType: employee.employmentType,
        salary: employee.salary || 0,
        hireDate: employee.hireDate,
        workLocation: employee.workLocation,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [employee, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {}
    
    if (!form.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب'
    if (!form.lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب'
    if (!form.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'بريد إلكتروني غير صالح'
    }
    if (!form.jobTitle.trim()) newErrors.jobTitle = 'المسمى الوظيفي مطلوب'
    if (form.salary <= 0) newErrors.salary = 'الرقب يجب أن يكون أكبر من صفر'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSave(form)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الأول *
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أحمد"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العائلة *
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="محمد العلي"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline ml-1" />
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                dir="ltr"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline ml-1" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                dir="ltr"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+9665XXXXXXXX"
              />
            </div>
          </div>

          {/* Job Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="w-4 h-4 inline ml-1" />
                القسم *
              </label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value as DepartmentId })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                  <option key={key} value={key}>{dept.nameAr}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المسمى الوظيفي *
              </label>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.jobTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="مطور برمجيات"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EmployeeStatus })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(EMPLOYEE_STATUSES).map(([key, status]) => (
                  <option key={key} value={key}>{status.labelAr}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع التوظيف</label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value as EmploymentType })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(EMPLOYMENT_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>{type.labelAr}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline ml-1" />
                تاريخ التعيين
              </label>
              <input
                type="date"
                value={form.hireDate}
                onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Salary & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4 inline ml-1" />
                الراتب الشهري (ر.س) *
              </label>
              <input
                type="number"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
                min="0"
                step="100"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.salary ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="15000"
              />
              {errors.salary && (
                <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline ml-1" />
                موقع العمل
              </label>
              <input
                type="text"
                value={form.workLocation}
                onChange={(e) => setForm({ ...form, workLocation: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="الرياض"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {employee ? 'تحديث البيانات' : 'إضافة الموظف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
}: {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
}) {
  if (!isOpen || !employee) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{employee.fullName}</h2>
              <p className="text-blue-100">{employee.jobTitle}</p>
              <p className="text-blue-200 text-sm mt-1">{employee.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> البريد الإلكتروني
              </p>
              <p className="font-medium text-sm truncate" dir="ltr">{employee.email}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> الهاتف
              </p>
              <p className="font-medium text-sm" dir="ltr">{employee.phone}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3" /> القسم
              </p>
              <DepartmentBadge department={employee.department} />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">الحالة</p>
              <StatusBadge status={employee.status} />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> تاريخ التعيين
              </p>
              <p className="font-medium text-sm">{new Date(employee.hireDate).toLocaleDateString('ar-SA')}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> الراتب
              </p>
              <p className="font-medium text-sm">{employee.salary?.toLocaleString() || 0} ر.س</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">نوع التوظيف</p>
              <p className="font-medium text-sm">{EMPLOYMENT_TYPES[employee.employmentType]?.labelAr}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> موقع العمل
              </p>
              <p className="font-medium text-sm">{employee.workLocation}</p>
            </div>
          </div>

          {employee.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-xs text-yellow-700 mb-1">ملاحظات</p>
              <p className="text-sm text-yellow-800">{employee.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  employeeName: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">حذف الموظف</h3>
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف موظف <span className="font-bold">{employeeName}</span>؟
            <br />
            <span className="text-red-600 text-sm">هذا الإجراء لا يمكن التراجع عنه</span>
          </p>
          
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              تأكيد الحذف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ TOAST NOTIFICATION ============

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300 z-50 ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="mr-auto p-1 hover:bg-white/20 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ============ MAIN PAGE ============

export default function EmployeesPage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Load employees on mount
  useEffect(() => {
    setEmployees(loadEmployees())
  }, [])

  // Save employees whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      saveEmployees(employees)
    }
  }, [employees])

  // Convert employees to table rows
  const tableRows: EmployeeTableRow[] = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      email: emp.email,
      department: emp.department,
      jobTitle: emp.jobTitle,
      status: emp.status,
      employmentType: emp.employmentType,
      hireDate: emp.hireDate,
      phone: emp.phone,
      workLocation: emp.workLocation,
      profilePictureUrl: emp.profilePictureUrl,
      isActive: emp.isActive,
    }))
  }, [employees])
  
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, departmentFilter, statusFilter])
  
  // Stats
  const stats = {
    total: tableRows.length,
    active: tableRows.filter(e => e.isActive).length,
    onLeave: tableRows.filter(e => e.status === 'on-leave').length,
    departments: new Set(tableRows.map(e => e.department)).size,
  }

  // Handlers
  const handleAddEmployee = useCallback((data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      employeeId: `EMP-${String(tableRows.length + 1).padStart(3, '0')}`,
      fullName: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      jobTitle: data.jobTitle,
      status: data.status,
      employmentType: data.employmentType,
      salary: data.salary,
      hireDate: data.hireDate,
      workLocation: data.workLocation,
      profilePictureUrl: '',
      isActive: data.status === 'active',
    }

    setEmployees(prev => [...prev, newEmployee])
    setIsAddModalOpen(false)
    setToast({ message: 'تم إضافة الموظف بنجاح ✓', type: 'success' })
  }, [tableRows.length])

  const handleEditEmployee = useCallback((data: EmployeeFormData) => {
    if (!selectedEmployee) return

    setEmployees(prev => prev.map(emp => 
      emp.id === selectedEmployee.id 
        ? {
            ...emp,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone,
            department: data.department,
            jobTitle: data.jobTitle,
            status: data.status,
            employmentType: data.employmentType,
            salary: data.salary,
            hireDate: data.hireDate,
            workLocation: data.workLocation,
            isActive: data.status === 'active',
          }
        : emp
    ))
    setIsEditModalOpen(false)
    setSelectedEmployee(null)
    setToast({ message: 'تم تحديث بيانات الموظف بنجاح ✓', type: 'success' })
  }, [selectedEmployee])

  const handleDeleteEmployee = useCallback(() => {
    if (!selectedEmployee) return
    
    setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id))
    setSelectedEmployee(null)
    setToast({ message: 'تم حذف الموظف بنجاح', type: 'success' })
  }, [selectedEmployee])

  const handleExportPDF = useCallback(async () => {
    try {
      await exportToPDF(filteredData)
      setToast({ message: 'تم تصدير التقرير بنجاح ✓', type: 'success' })
    } catch (error) {
      console.error('Export error:', error)
      setToast({ message: 'حدث خطأ أثناء التصدير', type: 'error' })
    }
  }, [filteredData])

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const openViewModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewModalOpen(true)
  }

  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteModalOpen(true)
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
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">إجمالي الموظفين</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-green-600">نشطون</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-yellow-600">في إجازة</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.onLeave}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-blue-600">الأقسام</p>
          <p className="text-2xl font-bold text-blue-700">{stats.departments}</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">كل الأقسام</option>
              {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                <option key={key} value={key}>{dept.nameAr}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">كل الحالات</option>
              {Object.entries(EMPLOYEE_STATUSES).map(([key, status]) => (
                <option key={key} value={key}>{status.labelAr}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">إضافة موظف</span>
              <span className="sm:hidden">إضافة</span>
            </button>
            
            <button 
              onClick={handleExportPDF}
              className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">تصدير PDF</span>
              <span className="sm:inline">تصدير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
              {paginatedData.map((emp) => {
                // Find full employee object for actions
                const fullEmp = employees.find(e => e.id === emp.id)!
                
                return (
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
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => openViewModal(fullEmp)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                        </button>
                        <button 
                          onClick={() => openEditModal(fullEmp)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                          title="تعديل"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(fullEmp)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">لا يوجد موظفون</p>
                    <p className="text-gray-400 text-sm mt-1">جرب تغيير معايير البحث أو الفلترة</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة موظف جديد
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-500">
              عرض {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} من {filteredData.length}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEmployee}
        title="إضافة موظف جديد"
      />
      
      <EmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedEmployee(null)
        }}
        onSave={handleEditEmployee}
        employee={selectedEmployee}
        title="تعديل بيانات الموظف"
      />

      <EmployeeDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedEmployee(null)
        }}
        employee={selectedEmployee}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedEmployee(null)
        }}
        onConfirm={handleDeleteEmployee}
        employeeName={selectedEmployee?.fullName || ''}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
