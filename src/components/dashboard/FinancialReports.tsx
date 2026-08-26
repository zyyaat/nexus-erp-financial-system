'use client'

import { useState, useMemo } from 'react'
import { 
  FileText, 
  Download, 
  Printer,
  Calendar,
  Filter,
  ChevronDown,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Users,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  FileDown,
  CheckCircle2,
  Clock,
  Scale
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// ============ TYPES ============
interface ReportData {
  id: string
  title: string
  titleAr: string
  type: 'balance-sheet' | 'income-statement' | 'cash-flow' | 'trial-balance' | 'ar-aging' | 'ap-aging'
  dateRange: { from: string; to: string }
  generatedAt: string
  status: 'ready' | 'generating'
}

// ============ MOCK DATA ============
const reportsList: ReportData[] = [
  {
    id: 'RPT-001',
    title: 'Balance Sheet',
    titleAr: 'الميزانية العمومية',
    type: 'balance-sheet',
    dateRange: { from: '2026-01-01', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:30:00Z',
    status: 'ready'
  },
  {
    id: 'RPT-002',
    title: 'Income Statement',
    titleAr: 'قائمة الدخل',
    type: 'income-statement',
    dateRange: { from: '2026-01-01', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:25:00Z',
    status: 'ready'
  },
  {
    id: 'RPT-003',
    title: 'Cash Flow Statement',
    titleAr: 'قائمة التدفق النقدي',
    type: 'cash-flow',
    dateRange: { from: '2026-01-01', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:20:00Z',
    status: 'ready'
  },
  {
    id: 'RPT-004',
    title: 'Trial Balance',
    titleAr: 'ميزان المراجعة',
    type: 'trial-balance',
    dateRange: { from: '2026-08-01', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:15:00Z',
    status: 'ready'
  },
  {
    id: 'RPT-005',
    title: 'Accounts Receivable Aging',
    titleAr: 'تقارير أعمار الذمم المدينة',
    type: 'ar-aging',
    dateRange: { from: '2026-06-26', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:10:00Z',
    status: 'ready'
  },
  {
    id: 'RPT-006',
    title: 'Accounts Payable Aging',
    titleAr: 'تقارير أعمار الذمم الدائنة',
    type: 'ap-aging',
    dateRange: { from: '2026-06-26', to: '2026-08-26' },
    generatedAt: '2026-08-26T10:05:00Z',
    status: 'ready'
  }
]

// Balance Sheet Data
const balanceSheetData = {
  assets: [
    { name: 'Cash & Bank', nameAr: 'النقدية والبنوك', amount: 456890 },
    { name: 'Accounts Receivable', nameAr: 'الذمم المدينة', amount: 128450 },
    { name: 'Inventory', nameAr: 'المخزون', amount: 234500 },
    { name: 'Prepaid Expenses', nameAr: 'مصروفات مدفوعة مقدماً', amount: 25000 },
    { name: 'Fixed Assets (Net)', nameAr: 'الأصول الثابتة (صافي)', amount: 485000 },
  ],
  liabilities: [
    { name: 'Accounts Payable', nameAr: 'الذمم الدائنة', amount: 89200 },
    { name: 'Short-term Loans', nameAr: 'القروض قصيرة الأجل', amount: 75000 },
    { name: 'Accrued Expenses', nameAr: 'مصروفات مستحقة', amount: 35000 },
    { name: 'Long-term Debt', nameAr: 'ديون طويلة الأجل', amount: 200000 },
  ],
  equity: [
    { name: "Owner's Capital", nameAr: 'رأس المالك', amount: 500000 },
    { name: 'Retained Earnings', nameAr: 'الأرباح المحتجزة', amount: 430640 },
  ]
}

// Income Statement Data
const incomeStatementData = {
  revenue: [
    { name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', amount: 847290 },
    { name: 'Service Revenue', nameAr: 'إيرادات الخدمات', amount: 125000 },
    { name: 'Other Income', nameAr: 'إيرادات أخرى', amount: 15000 },
  ],
  cogs: [
    { name: 'Cost of Goods Sold', nameAr: 'تكلفة البضاعة المباعة', amount: -523180 },
  ],
  expenses: [
    { name: 'Salaries & Wages', nameAr: 'الرواتب والأجور', amount: -156200 },
    { name: 'Operating Expenses', nameAr: 'المصاريف التشغيلية', amount: -198500 },
    { name: 'Marketing & Advertising', nameAr: 'التسويق والإعلان', amount: -78400 },
    { name: 'Technology & Software', nameAr: 'التقنية والبرمجيات', amount: -52080 },
    { name: 'Depreciation', nameAr: 'الإهلاك', amount: -35000 },
    { name: 'Other Expenses', nameAr: 'مصروفات أخرى', amount: -40000 },
  ]
}

// Cash Flow Data
const cashFlowData = {
  operating: [
    { name: 'Net Income', nameAr: 'صافي الربح', amount: 324110 },
    { name: 'Depreciation', nameAr: 'الإهلاك', amount: 35000 },
    { name: '(Increase) in AR', nameAr: '(زيادة) في الذمم المدينة', amount: -28450 },
    { name: 'Increase in AP', nameAr: 'زيادة في الذمم الدائنة', amount: 15200 },
    { name: 'Change in Inventory', nameAr: 'تغير المخزون', amount: -18500 },
  ],
  investing: [
    { name: 'Purchase of Equipment', nameAr: 'شراء معدات', amount: -85000 },
    { name: 'Sale of Assets', nameAr: 'بيع أصول', amount: 12000 },
  ],
  financing: [
    { name: 'Loan Proceeds', nameAr: 'عائدات القروض', amount: 100000 },
    { name: 'Principal Payments', nameAr: 'سداد أصل القرض', amount: -50000 },
    { name: 'Dividends Paid', nameAr: 'توزيعات مدفوعة', amount: -75000 },
  ]
}

// Trial Balance Data
const trialBalanceData = [
  { code: '1000', name: 'Cash & Bank', debit: 500000, credit: 43110 },
  { code: '1200', name: 'Accounts Receivable', debit: 145000, credit: 16550 },
  { code: '1500', name: 'Inventory', debit: 250000, credit: 15500 },
  { code: '2000', name: 'Accounts Payable', debit: 15000, credit: 104200 },
  { code: '2100', name: 'Short-term Loans', debit: 25000, credit: 100000 },
  { code: '3000', name: "Owner's Equity", debit: 0, credit: 500000 },
  { code: '4000', name: 'Sales Revenue', debit: 0, credit: 847290 },
  { code: '5000', name: 'Cost of Goods Sold', debit: 523180, credit: 0 },
  { code: '5100', name: 'Operating Expenses', debit: 198500, credit: 0 },
  { code: '5200', name: 'Salaries & Wages', debit: 156200, credit: 0 },
]

// AR Aging Data
const arAgingData = [
  { customer: 'TechCorp Industries', current: 15000, days30: 20000, days60: 8000, days90: 2000, total: 45000 },
  { customer: 'Acme Corporation', current: 5000, days30: 8000, days60: 4000, days50: 1500, total: 18500 },
  { customer: 'Global Manufacturing', current: 0, days30: 0, days60: 23000, days90: 44300, total: 67300 },
  { customer: 'Retail Chain LLC', current: 12000, days30: 9000, days60: 5000, days90: 2900, total: 28900 },
]

// AP Aging Data
const apAgingData = [
  { vendor: 'Office Supplies Co.', current: 5000, days30: 4000, days60: 2500, days90: 1000, total: 12500 },
  { vendor: 'Tech Equipment Ltd.', current: 15000, days30: 18000, days60: 9000, days90: 3000, total: 45000 },
  { vendor: 'Global Logistics', current: 7000, days30: 6000, days60: 4000, days90: 1700, total: 18700 },
  { vendor: 'IT Services Provider', current: 3000, days30: 5000, days60: 3500, days90: 1500, total: 13000 },
]

// ============ SUB-COMPONENTS ============

function ReportTypeIcon({ type }: { type: ReportData['type'] }) {
  const iconMap = {
    'balance-sheet': BarChart3,
    'income-statement': TrendingUp,
    'cash-flow': Activity,
    'trial-balance': Scale,
    'ar-aging': Users,
    'ap-aging': CreditCard,
  }
  
  const Icon = iconMap[type] || FileText
  
  return <Icon size={20} className="text-indigo-500" />
}

function ReportCard({ report, onView, onExportPDF, onExportExcel }: { 
  report: ReportData
  onView: () => void
  onExportPDF: () => void
  onExportExcel: () => void
}) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <ReportTypeIcon type={report.type} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{report.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{report.titleAr}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          report.status === 'ready' 
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        }`}>
          {report.status === 'ready' ? 'Ready' : 'Generating...'}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {report.dateRange.from} → {report.dateRange.to}
        </span>
      </div>
      
      <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button 
          onClick={onView}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <Eye size={14} />
          View
        </button>
        <button 
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          <FileDown size={14} />
          PDF
        </button>
        <button 
          onClick={onExportExcel}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
        >
          <FileSpreadsheet size={14} />
          Excel
        </button>
      </div>
    </div>
  )
}

// Balance Sheet Preview Component
function BalanceSheetPreview() {
  const totalAssets = balanceSheetData.assets.reduce((sum, a) => sum + a.amount, 0)
  const totalLiabilities = balanceSheetData.liabilities.reduce((sum, l) => sum + l.amount, 0)
  const totalEquity = balanceSheetData.equity.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">BALANCE SHEET</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">الميزانية العمومية</p>
        <p className="text-sm text-slate-400">For the Period Ended August 26, 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ASSETS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-xl text-white">
            <h3 className="text-lg font-bold">ASSETS / الأصول</h3>
            <DollarSign size={20} />
          </div>
          
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-b-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
            {balanceSheetData.assets.map((asset, idx) => (
              <div key={idx} className="flex justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{asset.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{asset.nameAr}</p>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">${asset.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between p-4 bg-blue-50 dark:bg-blue-900/20">
              <span className="font-bold text-blue-900 dark:text-blue-100">Total Assets / إجمالي الأصول</span>
              <span className="font-mono font-bold text-blue-900 dark:text-blue-100">${totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* LIABILITIES & EQUITY */}
        <div className="space-y-4">
          {/* Liabilities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-xl text-white">
              <h3 className="text-lg font-bold">LIABILITIES / الالتزامات</h3>
              <CreditCard size={20} />
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-b-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
              {balanceSheetData.liabilities.map((liability, idx) => (
                <div key={idx} className="flex justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{liability.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{liability.nameAr}</p>
                  </div>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">${liability.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between p-4 bg-orange-50 dark:bg-orange-900/20">
                <span className="font-bold text-orange-900 dark:text-orange-100">Total Liabilities / إجمالي الالتزامات</span>
                <span className="font-mono font-bold text-orange-900 dark:text-orange-100">${totalLiabilities.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-t-xl text-white">
              <h3 className="text-lg font-bold">EQUITY / حقوق الملكية</h3>
              <Users size={20} />
            </div>
            
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-b-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
              {balanceSheetData.equity.map((eq, idx) => (
                <div key={idx} className="flex justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{eq.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{eq.nameAr}</p>
                  </div>
                  <span className="font-mono font-bold text-violet-600 dark:text-violet-400">${eq.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between p-4 bg-violet-50 dark:bg-violet-900/20">
                <span className="font-bold text-violet-900 dark:text-violet-100">Total Equity / إجمالي حقوق الملكية</span>
                <span className="font-mono font-bold text-violet-900 dark:text-violet-100">${totalEquity.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Total L&E */}
          <div className="flex justify-between p-4 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 rounded-xl text-white">
            <span className="font-bold">Total Liab. & Equity / إجمالي الالتزامات وحقوق الملكية</span>
            <span className="font-mono font-bold">${(totalLiabilities + totalEquity).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Income Statement Preview Component
function IncomeStatementPreview() {
  const totalRevenue = incomeStatementData.revenue.reduce((sum, r) => sum + r.amount, 0)
  const totalCOGS = Math.abs(incomeStatementData.cogs.reduce((sum, c) => sum + c.amount, 0))
  const grossProfit = totalRevenue - totalCOGS
  const totalExpenses = Math.abs(incomeStatementData.expenses.reduce((sum, e) => sum + e.amount, 0))
  const netIncome = grossProfit - totalExpenses

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">INCOME STATEMENT</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">قائمة الدخل</p>
        <p className="text-sm text-slate-400">For the Period January 1 - August 26, 2026</p>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
        {/* Revenue Section */}
        <div className="p-6 space-y-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} />
            REVENUE / الإيرادات
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200 dark:divide-slate-700 p-6 space-y-3">
          {incomeStatementData.revenue.map((rev, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{rev.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{rev.nameAr}</p>
              </div>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${rev.amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white">Total Revenue / إجمالي الإيرادات</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-lg">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* COGS */}
        <div className="p-6 space-y-3 bg-slate-50 dark:bg-slate-700/30">
          {incomeStatementData.cogs.map((cogs, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{cogs.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cogs.nameAr}</p>
              </div>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">(${Math.abs(cogs.amount).toLocaleString()})</span>
            </div>
          ))}
        </div>

        {/* Gross Profit */}
        <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 flex justify-between items-center">
          <span className="font-bold text-lg text-emerald-900 dark:text-emerald-100">Gross Profit / إجمالي الربح</span>
          <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">${grossProfit.toLocaleString()}</span>
        </div>

        {/* Expenses */}
        <div className="p-6 space-y-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingDown size={20} />
            OPERATING EXPENSES / المصاريف التشغيلية
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200 dark:divide-slate-700 p-6 space-y-3">
          {incomeStatementData.expenses.map((exp, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{exp.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{exp.nameAr}</p>
              </div>
              <span className="font-mono font-bold text-red-600 dark:text-red-400">(${Math.abs(exp.amount).toLocaleString()})</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white">Total Expenses / إجمالي المصروفات</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-lg">(${totalExpenses.toLocaleString()})</span>
          </div>
        </div>

        {/* Net Income */}
        <div className="p-8 bg-gradient-to-r from-indigo-500 to-violet-500 flex justify-between items-center text-white">
          <span className="font-bold text-2xl">NET INCOME / صافي الربح</span>
          <span className="font-mono font-bold text-3xl">${netIncome.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

// Cash Flow Statement Preview Component
function CashFlowPreview() {
  const operatingNet = cashFlowData.operating.reduce((sum, o) => sum + o.amount, 0)
  const investingNet = cashFlowData.investing.reduce((sum, i) => sum + i.amount, 0)
  const financingNet = cashFlowData.financing.reduce((sum, f) => sum + f.amount, 0)
  const netChange = operatingNet + investingNet + financingNet

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">CASH FLOW STATEMENT</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">قائمة التدفق النقدي</p>
        <p className="text-sm text-slate-400">For the Period Ended August 26, 2026</p>
      </div>

      <div className="space-y-6">
        {/* Operating Activities */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold flex items-center gap-2">
            <Activity size={20} />
            CASH FLOWS FROM OPERATING ACTIVITIES / التدفقات النقدية من الأنشطة التشغيلية
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 p-4 space-y-3">
            {cashFlowData.operating.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className={`font-mono font-medium ${item.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 font-bold text-lg">
              <span>Net Cash from Operating / صافي النقد من التشغيل</span>
              <span className={`font-mono ${operatingNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {operatingNet >= 0 ? '+' : ''}${operatingNet.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Investing Activities */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center gap-2">
            <Target size={20} />
            CASH FLOWS FROM INVESTING ACTIVITIES / التدفقات النقدية من الأنشطة الاستثمارية
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 p-4 space-y-3">
            {cashFlowData.investing.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className={`font-mono font-medium ${item.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 font-bold text-lg">
              <span>Net Cash from Investing / صافي النقد من الاستثمار</span>
              <span className={`font-mono ${investingNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {investingNet >= 0 ? '+' : ''}${investingNet.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Financing Activities */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center gap-2">
            <Wallet size={20} />
            CASH FLOWS FROM FINANCING ACTIVITIES / التدفقات النقدية من أنشطة التمويل
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700 p-4 space-y-3">
            {cashFlowData.financing.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className={`font-mono font-medium ${item.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 font-bold text-lg">
              <span>Net Cash from Financing / صافي النقد من التمويل</span>
              <span className={`font-mono ${financingNet >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {financingNet >= 0 ? '+' : ''}${financingNet.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Change in Cash */}
        <div className="p-6 bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 rounded-xl text-white">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">NET CHANGE IN CASH / التغير الصافي في النقدية</span>
            <span className="font-mono font-bold text-2xl">{netChange >= 0 ? '+' : ''}${netChange.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Trial Balance Preview Component
function TrialBalancePreview() {
  const totalDebit = trialBalanceData.reduce((sum, t) => sum + t.debit, 0)
  const totalCredit = trialBalanceData.reduce((sum, t) => sum + t.credit, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">TRIAL BALANCE</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">ميزان المراجعة</p>
        <p className="text-sm text-slate-400">As of August 26, 2026</p>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Account Code</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Account Name</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Debit ($)</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Credit ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {trialBalanceData.map((account, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-indigo-600 dark:text-indigo-400">{account.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-900 dark:text-white font-medium">{account.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-700 dark:text-slate-300">
                    {account.debit > 0 ? account.debit.toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-700 dark:text-slate-300">
                    {account.credit > 0 ? account.credit.toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-700 font-bold">
                <td colSpan={2} className="px-4 py-4 text-slate-900 dark:text-white">TOTAL / الإجمالي</td>
                <td className="px-4 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">${totalDebit.toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-red-600 dark:text-red-400">${totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
          {trialBalanceData.map((account, idx) => (
            <div key={idx} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{account.code}</span>
                  <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">{account.name}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Dr: <strong className="text-emerald-600 dark:text-emerald-400">{account.debit > 0 ? account.debit.toLocaleString() : '-'}</strong></span>
                <span className="text-slate-500 dark:text-slate-400">Cr: <strong className="text-red-600 dark:text-red-400">{account.credit > 0 ? account.credit.toLocaleString() : '-'}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-700 grid grid-cols-3 gap-4 text-center">
          <div className="font-bold text-slate-900 dark:text-white">TOTAL</div>
          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${totalDebit.toLocaleString()}</div>
          <div className="font-mono font-bold text-red-600 dark:text-red-400">${totalCredit.toLocaleString()}</div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
        <span className="font-medium text-emerald-700 dark:text-emerald-300">Trial Balance is Balanced / ميزان المراجعة متوازن ✓</span>
      </div>
    </div>
  )
}

// AR/AP Aging Preview Components
function ARAgingPreview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ACCOUNTS RECEIVABLE AGING</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">تقارير أعمار الذمم المدينة</p>
        <p className="text-sm text-slate-400">As of August 26, 2026</p>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Customer</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Current</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400">1-30 Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-amber-600 dark:text-amber-400">31-60 Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">61+ Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {arAgingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.customer}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">${row.current.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">${row.days30.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400">${row.days60.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">${row.days90.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">${row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-700 font-bold">
                <td className="px-4 py-4 text-slate-900 dark:text-white">TOTAL</td>
                <td className="px-4 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">${arAgingData.reduce((s,r)=>s+r.current,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-blue-600 dark:text-blue-400">${arAgingData.reduce((s,r)=>s+r.days30,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-amber-600 dark:text-amber-400">${arAgingData.reduce((s,r)=>s+r.days60,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-red-600 dark:text-red-400">${arAgingData.reduce((s,r)=>s+r.days90,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-slate-900 dark:text-white">${arAgingData.reduce((s,r)=>s+r.total,0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

function APAgingPreview() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-2 pb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ACCOUNTS PAYABLE AGING</h2>
        <p className="text-lg text-slate-500 dark:text-slate-400">تقارير أعمار الذمم الدائنة</p>
        <p className="text-sm text-slate-400">As of August 26, 2026</p>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Vendor</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Current</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400">1-30 Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-amber-600 dark:text-amber-400">31-60 Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">61+ Days</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white font-bold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {apAgingData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{row.vendor}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">${row.current.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-blue-600 dark:text-blue-400">${row.days30.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-600 dark:text-amber-400">${row.days60.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-red-600 dark:text-red-400">${row.days90.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">${row.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-700 font-bold">
                <td className="px-4 py-4 text-slate-900 dark:text-white">TOTAL</td>
                <td className="px-4 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400">${apAgingData.reduce((s,r)=>s+r.current,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-blue-600 dark:text-blue-400">${apAgingData.reduce((s,r)=>s+r.days30,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-amber-600 dark:text-amber-400">${apAgingData.reduce((s,r)=>s+r.days60,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-red-600 dark:text-red-400">${apAgingData.reduce((s,r)=>s+r.days90,0).toLocaleString()}</td>
                <td className="px-4 py-4 text-right font-mono text-slate-900 dark:text-white">${apAgingData.reduce((s,r)=>s+r.total,0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// PDF Export Function (Simulated)
const exportToPDF = (reportName: string) => {
  // Create a simple text-based "PDF" for demo purposes
  // In production, you'd use libraries like jsPDF or react-pdf
  const content = `
========================================
${reportName.toUpperCase()}
Nexus ERP Financial Management System
Generated: ${new Date().toISOString()}
========================================

This is a demonstration of PDF export functionality.
In a production environment, this would generate a proper PDF file
with all the financial data formatted professionally.

Report Contents:
- Complete financial data tables
- Professional formatting
- Company header and footer
- Page numbers
- Currency formatting

----------------------------------------
© ${new Date.getFullYear()} Nexus ERP System
  `

  // Create blob and download
  const blob = new Blob([content], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Excel Export Function (Simulated)
const exportToExcel = (reportName: string) => {
  const csvContent = `${reportName}\nGenerated: ${new Date().toISOString()}\n\nCategory,Amount\nRevenue,847290\nExpenses,-523180\nNet Profit,324110`
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${reportName.replace(/\s+/g, '_')}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Main Reports Section Component
export default function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState<ReportData['type'] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExportPDF = (reportTitle: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      exportToPDF(reportTitle)
      setIsGenerating(false)
    }, 1000)
  }

  const renderReportPreview = () => {
    switch (selectedReport) {
      case 'balance-sheet':
        return <BalanceSheetPreview />
      case 'income-statement':
        return <IncomeStatementPreview />
      case 'cash-flow':
        return <CashFlowPreview />
      case 'trial-balance':
        return <TrialBalancePreview />
      case 'ar-aging':
        return <ARAgingPreview />
      case 'ap-aging':
        return <APAgingPreview />
      default:
        return null
    }
  }

  if (selectedReport) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedReport(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronDown size={18} className="rotate-90" />
          Back to Reports
        </button>

        {/* Report Preview */}
        {renderReportPreview()}

        {/* Export Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => handleExportPDF(reportsList.find(r => r.type === selectedReport)?.title || '')}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown size={18} />
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-medium shadow-lg transition-all"
          >
            <Printer size={18} />
            Print Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText size={28} className="text-indigo-500" />
            Financial Reports
            <span className="text-lg font-normal text-slate-500">/ التقارير المالية</span>
          </h3>
          <p className="text-slate-500 mt-1">Generate, view, and export professional financial reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Calendar size={16} />
            Date Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <BarChart3 size={18} />
            <span className="text-sm font-medium">Reports Available</span>
          </div>
          <p className="text-2xl font-bold">{reportsList.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">Ready</span>
          </div>
          <p className="text-2xl font-bold">{reportsList.filter(r => r.status === 'ready').length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <FileDown size={18} />
            <span className="text-sm font-medium">Exports Today</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Clock size={18} />
            <span className="text-sm font-medium">Last Updated</span>
          </div>
          <p className="text-2xl font-bold">Now</p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsList.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onView={() => setSelectedReport(report.type)}
            onExportPDF={() => handleExportPDF(report.title)}
            onExportExcel={() => exportToExcel(report.title)}
          />
        ))}
      </div>

      {/* Help Text */}
      <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          💡 Click on any report to view it in full screen, then download as PDF or print directly.
        </p>
      </div>
    </div>
  )
}
