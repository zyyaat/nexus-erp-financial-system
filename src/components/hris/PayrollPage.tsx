'use client'

/**
 * Payroll Management Page
 * 
 * Features:
 * - Salary structures & components
 * - Payslip generation & viewing
 * - Payroll run processing
 * - Earnings & deductions breakdown
 * - Bank transfer tracking
 * - GOSI/Social insurance calculations
 */

import React, { useState, useMemo } from 'react'
import {
  DollarSign,
  Download,
  Search,
  Filter,
  Eye,
  FileText,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calculator,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  Printer,
  Send,
} from 'lucide-react'
import { mockEmployees } from '@/lib/data/mockEmployees'
import { mockPayslips, mockHRMetrics } from '@/lib/data/mockHRISData'
import { DEPARTMENTS, formatCurrency, SALARY_COMPONENT_TEMPLATES } from '@/lib/types/employee'
import type { EmployeeTableRow, Payslip as PayslipType } from '@/lib/types/employee'

// ============ PAYS CARD COMPONENT ============

interface PaySummaryCardProps {
  title: string
  amount: number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; direction: 'up' | 'down' }
  color: string
  bgColor: string
}

function PaySummaryCard({ title, amount, subtitle, icon, trend, color, bgColor }: PaySummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{formatCurrency(amount)}</p>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span className={`flex items-center text-sm ${
                  trend.direction === 'up' ? 'text-red-500' : 'text-green-500'
                }`}>
                  {trend.direction === 'up' ? 
                    <TrendingUp className="w-4 h-4 ml-0.5" /> : 
                    <TrendingDown className="w-4 h-4 ml-0.5" />
                  }
                  {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && <span className="text-gray-400 text-sm">{subtitle}</span>}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>{icon}</div>
      </div>
    </div>
  )
}

// ============ PAYSLIP DETAIL MODAL ============

interface PayslipModalProps {
  payslip: PayslipType | null
  employee: EmployeeTableRow | null
  isOpen: boolean
  onClose: () => void
}

function PayslipModal({ payslip, employee, isOpen, onClose }: PayslipModalProps) {
  if (!isOpen || !payslip || !employee) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">كشف الراتب</h2>
              <p className="text-gray-500 mt-1">
                {payslip.payPeriodStart.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              ×
            </button>
          </div>
          
          {/* Employee Info */}
          <div className="mt-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {employee.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{employee.fullName}</p>
              <p className="text-sm text-gray-500">{employee.employeeId} • {DEPARTMENTS[employee.department].nameAr}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              الاستحقاقات
            </h3>
            <div className="space-y-2">
              {payslip.earnings.map((earning, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{earning.componentNameAr}</p>
                    <p className="text-xs text-gray-500">{earning.componentName}</p>
                  </div>
                  <p className="font-semibold text-green-700">+{formatCurrency(earning.amount)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t-2 border-green-200 flex justify-between items-center">
              <span className="font-semibold text-gray-700">إجمالي الاستحقاقات</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(payslip.totalEarnings)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              الخصومات
            </h3>
            <div className="space-y-2">
              {payslip.deductions.map((deduction, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{deduction.componentNameAr}</p>
                    <p className="text-xs text-gray-500">{deduction.componentName}</p>
                  </div>
                  <p className="font-semibold text-red-700">-{formatCurrency(deduction.amount)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t-2 border-red-200 flex justify-between items-center">
              <span className="font-semibold text-gray-700">إجمالي الخصومات</span>
              <span className="text-xl font-bold text-red-600">{formatCurrency(payslip.totalDeductions)}</span>
            </div>
          </div>

          {/* Net Salary */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100">صافي الراتب</p>
                <p className="text-xs text-blue-200 mt-1">Net Salary</p>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(payslip.netSalary)}</p>
            </div>
          </div>

          {/* Work Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{payslip.workingDays}</p>
              <p className="text-xs text-gray-500">أيام العمل</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">{payslip.presentDays}</p>
              <p className="text-xs text-gray-500">أيام الحضور</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-lg font-bold text-yellow-600">{payslip.leaveDays}</p>
              <p className="text-xs text-gray-500">أيام الإجازة</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-lg font-bold text-blue-600">{payslip.overtimeHours}</p>
              <p className="text-xs text-gray-500">ساعات إضافية</p>
            </div>
          </div>

          {/* YTD Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">ملخص السنة حتى الآن (YTD)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">إجمالي المستحق</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(payslip.ytdGross)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">الضرائب</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(payslip.ytdTax)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">صافي YTD</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(payslip.ytdNet)}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">طريقة الدفع</span>
              <span className="font-medium text-gray-900 capitalize">
                {payslip.paymentMethod.replace('-', ' ')}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">الحساب البنكي</span>
              <span className="font-medium text-gray-900">{payslip.bankAccount}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">تاريخ الصرف</span>
              <span className="font-medium text-gray-900">
                {payslip.paymentDate.toLocaleDateString('ar-EG')}
              </span>
            </div>
            {payslip.transactionRef && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">رقم المرجع</span>
                <span className="font-mono text-sm text-blue-600">{payslip.transactionRef}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            تحميل PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ============ SALARY STRUCTURE TABLE ============

function SalaryStructureTable() {
  const salaryData = [
    {
      grade: 'G8',
      title: 'مدير تنفيذي',
      minSalary: 55000,
      maxSalary: 75000,
      avgSalary: 65000,
      employees: 3,
    },
    {
      grade: 'G7',
      title: 'مدير قسم',
      minSalary: 40000,
      maxSalary: 55000,
      avgSalary: 47500,
      employees: 5,
    },
    {
      grade: 'G6',
      title: 'مدير أول / قائد فريق',
      minSalary: 30000,
      maxSalary: 42000,
      avgSalary: 36000,
      employees: 7,
    },
    {
      grade: 'G5',
      title: 'متخصص أول',
      minSalary: 25000,
      maxSalary: 35000,
      avgSalary: 30000,
      employees: 8,
    },
    {
      grade: 'G4',
      title: 'متخصص',
      minSalary: 18000,
      maxSalary: 28000,
      avgSalary: 23000,
      employees: 10,
    },
    {
      grade: 'G3',
      title: 'منسق / مساعد',
      minSalary: 12000,
      maxSalary: 20000,
      avgSalary: 16000,
      employees: 8,
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">هياكل الرواتب</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          تعديل الهيكل
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">المستوى</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">المسمى الوظيفي</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الحد الأدنى</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الحد الأقصى</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">المتوسط</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">عدد الموظفين</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">التوزيع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {salaryData.map((row) => (
              <tr key={row.grade} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {row.grade}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{row.title}</td>
                <td className="px-6 py-4 text-gray-600">{formatCurrency(row.minSalary)}</td>
                <td className="px-6 py-4 text-gray-600">{formatCurrency(row.maxSalary)}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(row.avgSalary)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium text-sm">
                    {row.employees}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${(row.employees / 10) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============ MAIN PAYROLL PAGE ============

export default function PayrollPage() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipType | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableRow | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const metrics = mockHRMetrics

  // Combine payslips with employee data
  const payrollData = useMemo(() => {
    return mockPayslips.map((payslip) => {
      const employee = mockEmployees.find(emp => emp.id === payslip.employeeId)
      return { payslip, employee: employee || null }
    })
  }, [])

  // Filter data
  const filteredPayroll = useMemo(() => {
    if (!searchQuery && departmentFilter === 'all') return payrollData
    
    return payrollData.filter(({ employee }) => {
      if (!employee) return false
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!employee.fullName.toLowerCase().includes(query) && 
            !employee.employeeId.toLowerCase().includes(query)) {
          return false
        }
      }
      
      if (departmentFilter !== 'all' && employee.department !== departmentFilter) {
        return false
      }
      
      return true
    })
  }, [payrollData, searchQuery, departmentFilter])

  // Handlers
  const handleViewPayslip = (payslip: PayslipType, employee: EmployeeTableRow) => {
    setSelectedPayslip(payslip)
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const summaryCards = [
    {
      title: 'إجمالي الرواتب',
      amount: metrics.payrollCost,
      subtitle: 'شهري',
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      trend: { value: 2.5, direction: 'up' as const },
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'المزايا والبدلات',
      amount: metrics.benefitsCost,
      subtitle: 'شهري',
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'متوسط الراتب',
      amount: metrics.averageSalary,
      subtitle: 'للموظف',
      icon: <Calculator className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'تكلفة/موظف',
      amount: metrics.costPerEmployee,
      subtitle: 'شامل المزايا',
      icon: <Building2 className="w-6 h-6 text-orange-600" />,
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
            <h1 className="text-3xl font-bold text-gray-900">إدارة المرتبات والرواتب</h1>
            <p className="text-gray-500 mt-1">كشوف المرتبات، الهياكل الوظيفية، وتتبع المدفوعات</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Send className="w-4 h-4" />
              تشغيل صرف الرواتب
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <PaySummaryCard key={index} {...card} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Payslips List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الرقم الوظيفي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>يناير 2025</span>
              </div>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">كشوف الرواتب</h3>
              <span className="text-sm text-gray-500">{filteredPayroll.length} موظف</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الموظف</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">القسم</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الراتب الأساسي</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الاستحقاقات</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الخصومات</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">صافي الراتب</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayroll.map(({ payslip, employee }) => (
                    <tr key={payslip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {employee && (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {employee.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.fullName}</p>
                              <p className="text-xs text-gray-500">{employee.employeeId}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {employee && (
                          <span className="text-sm text-gray-600">
                            {DEPARTMENTS[employee.department].nameAr}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(payslip.grossSalary - payslip.earnings.reduce((sum, e) => sum + (e.amount - (payslip.grossSalary - payslip.totalEarnings)), 0))}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        +{formatCurrency(payslip.totalEarnings)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        -{formatCurrency(payslip.totalDeductions)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {formatCurrency(payslip.netSalary)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          مدفوع
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {employee && (
                          <button
                            onClick={() => handleViewPayslip(payslip, employee)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="عرض الكشف"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-right">
                <Send className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">تشغيل صرف الرواتب</p>
                  <p className="text-xs text-blue-600">معالجة رواتب الشهر الحالي</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-right">
                <CreditCard className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">تحويل بنكي</p>
                  <p className="text-xs text-green-600">تصدير ملف التحويلات</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-right">
                <FileText className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">تقرير الرواتب</p>
                  <p className="text-xs text-purple-600">تقرير شهري شامل</p>
                </div>
              </button>
            </div>
          </div>

          {/* Salary Structure Preview */}
          <SalaryStructureTable />

          {/* Payroll Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات الرواتب</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">إجمالي المدفوعات</span>
                <span className="font-semibold text-gray-900">{formatCurrency(metrics.payrollCost)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">نسبة المزايا من الراتب</span>
                <span className="font-semibold text-gray-900">
                  {Math.round((metrics.benefitsCost / metrics.payrollCost) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">متوسط الزيادة السنوية</span>
                <span className="font-semibold text-green-600">+8.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">تكلفة ساعات العمل الإضافي</span>
                <span className="font-semibold text-orange-600">
                  ~{formatCurrency(metrics.overtimeHoursThisMonth * 150)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      <PayslipModal
        payslip={selectedPayslip}
        employee={selectedEmployee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
