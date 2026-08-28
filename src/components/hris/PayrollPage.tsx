'use client'

/**
 * Simple Payroll Page
 */

import React from 'react'
import { 
  DollarSign,
  Download,
  Eye,
  CreditCard,
  Building2,
  TrendingUp,
  CheckCircle,
} from 'lucide-react'

export default function PayrollPage() {
  // Mock payslip data
  const payslips = [
    { id: '1', name: 'أحمد الخالدي', department: 'الإدارة', base: 45000, earnings: 53000, deductions: 4500, net: 48500, status: 'paid' },
    { id: '2', name: 'فاطمة حسن', department: 'تقنية المعلومات', base: 28000, earnings: 33000, deductions: 2800, net: 30200, status: 'paid' },
    { id: '3', name: 'محمد الأحمد', department: 'المبيعات', base: 35000, earnings: 41000, deductions: 3500, net: 37500, status: 'paid' },
    { id: '4', name: 'سارة محمود', department: 'الموارد البشرية', base: 25000, earnings: 29000, deductions: 2500, net: 26500, status: 'pending' },
    { id: '5', name: 'خالد العتيبي', department: 'المالية', base: 32000, earnings: 37500, deductions: 3200, net: 34300, status: 'paid' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          إدارة المرتبات والرواتب
        </h1>
        <p className="text-gray-500 mt-1">كشوف المرتبات، الهياكل الوظيفية، وتتبع المدفوعات</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <p className="text-sm font-medium text-emerald-700 mb-1">إجمالي الرواتب</p>
          <p className="text-2xl font-bold text-emerald-700">768,000 ج.م</p>
          <span className="text-xs text-emerald-600">شهري</span>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
          <p className="text-sm font-medium text-blue-700 mb-1">المزايا والبدلات</p>
          <p className="text-2xl font-bold text-blue-700">153,600 ج.م</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-5">
          <p className="text-sm font-medium text-purple-700 mb-1">متوسط الراتب</p>
          <p className="text-2xl font-bold text-purple-700">32,000 ج.م</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-5">
          <p className="text-sm font-medium text-orange-700 mb-1">تكلفة/موظف</p>
          <p className="text-2xl font-bold text-orange-700">38,400 ج.م</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-6 gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium">
          <CreditCard className="w-4 h-4" />
          تشغيل صرف الرواتب
        </button>
        <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium">
          <Download className="w-4 h-4" />
          تصدير
        </button>
      </div>

      {/* Payslips Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">كشوف الرواتب - يناير 2025</h3>
          <span className="text-sm text-gray-500">{payslips.length} موظف</span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payslips.map((payslip) => (
                <tr key={payslip.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {payslip.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{payslip.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payslip.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payslip.base.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">+{payslip.earnings.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-red-600">-{payslip.deductions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{payslip.net.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">
                    {payslip.status === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        مدفوع
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        قيد المعالجة
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Structure Preview */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">هياكل الرواتب</h3>
        
        <div className="space-y-3">
          {[
            { grade: 'G8', title: 'مدير تنفيذي', min: 55000, max: 75000, employees: 3 },
            { grade: 'G7', title: 'مدير قسم', min: 40000, max: 55000, employees: 5 },
            { grade: 'G6', title: 'مدير أول / قائد فريق', min: 30000, max: 42000, employees: 7 },
            { grade: 'G5', title: 'متخصص أول', min: 25000, max: 35000, employees: 8 },
            { grade: 'G4', title: 'متخصص', min: 18000, max: 28000, employees: 10 },
          ].map((row) => (
            <div key={row.grade} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold w-12 justify-center">
                {row.grade}
              </span>
              <span className="flex-1 font-medium text-gray-800">{row.title}</span>
              <span className="text-sm text-gray-600">{row.min.toLocaleString()} - {row.max.toLocaleString()} ج.م</span>
              <span className="text-sm font-semibold text-gray-900 bg-white px-2 py-1 rounded">{row.employees} موظف</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
