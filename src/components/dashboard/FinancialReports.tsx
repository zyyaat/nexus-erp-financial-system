'use client'

import { useState, useRef } from 'react'
import {
  FileText,
  Download,
  Printer,
  Calendar,
  ChevronDown,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Wallet,
  Scale,
  BarChart3,
  Filter,
  Eye,
  Loader2
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// ============ TYPES ============
type ReportType = 'balance-sheet' | 'income-statement' | 'cash-flow' | 'trial-balance'

interface ReportConfig {
  id: ReportType
  title: string
  titleAr: string
  icon: React.ReactNode
  description: string
}

interface FinancialData {
  balanceSheet: BalanceSheetData
  incomeStatement: IncomeStatementData
  cashFlow: CashFlowData
  trialBalance: TrialBalanceItem[]
}

interface BalanceSheetData {
  assets: AssetCategory[]
  liabilities: LiabilityCategory[]
  equity: EquityItem[]
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
}

interface AssetCategory {
  category: string
  items: { name: string; amount: number }[]
  total: number
}

interface LiabilityCategory {
  category: string
  items: { name: string; amount: number }[]
  total: number
}

interface EquityItem {
  name: string
  amount: number
}

interface IncomeStatementData {
  revenue: RevenueItem[]
  expenses: ExpenseItem[]
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  grossProfit: number
  operatingIncome: number
}

interface RevenueItem {
  category: string
  amount: number
}

interface ExpenseItem {
  category: string
  amount: number
}

interface CashFlowData {
  operatingActivities: CashFlowItem[]
  investingActivities: CashFlowItem[]
  financingActivities: CashFlowItem[]
  netCashFlow: number
  beginningCash: number
  endingCash: number
}

interface CashFlowItem {
  description: string
  amount: number
}

interface TrialBalanceItem {
  accountCode: string
  accountName: string
  debit: number
  credit: number
}

// ============ MOCK DATA ============
const generateFinancialData = (): FinancialData => ({
  balanceSheet: {
    assets: [
      {
        category: 'Current Assets',
        items: [
          { name: 'Cash and Cash Equivalents', amount: 1250000 },
          { name: 'Accounts Receivable', amount: 890000 },
          { name: 'Inventory', amount: 1450000 },
          { name: 'Prepaid Expenses', amount: 120000 }
        ],
        total: 3710000
      },
      {
        category: 'Non-Current Assets',
        items: [
          { name: 'Property, Plant & Equipment', amount: 4500000 },
          { name: 'Accumulated Depreciation', amount: -1200000 },
          { name: 'Long-term Investments', amount: 750000 },
          { name: 'Intangible Assets', amount: 500000 }
        ],
        total: 4550000
      }
    ],
    liabilities: [
      {
        category: 'Current Liabilities',
        items: [
          { name: 'Accounts Payable', amount: 680000 },
          { name: 'Short-term Debt', amount: 400000 },
          { name: 'Accrued Expenses', amount: 220000 },
          { name: 'Current Portion of Long-term Debt', amount: 150000 }
        ],
        total: 1450000
      },
      {
        category: 'Long-term Liabilities',
        items: [
          { name: 'Long-term Debt', amount: 2000000 },
          { name: 'Deferred Tax Liability', amount: 180000 },
          { name: 'Other Long-term Liabilities', amount: 95000 }
        ],
        total: 2275000
      }
    ],
    equity: [
      { name: 'Common Stock', amount: 1500000 },
      { name: 'Retained Earnings', amount: 2835000 },
      { name: 'Additional Paid-in Capital', amount: 200000 }
    ],
    totalAssets: 8260000,
    totalLiabilities: 3725000,
    totalEquity: 4535000
  },
  incomeStatement: {
    revenue: [
      { category: 'Sales Revenue', amount: 8500000 },
      { category: 'Service Revenue', amount: 1200000 },
      { category: 'Other Operating Income', amount: 150000 }
    ],
    expenses: [
      { category: 'Cost of Goods Sold', amount: 4200000 },
      { category: 'Sales & Marketing', amount: 850000 },
      { category: 'General & Administrative', amount: 620000 },
      { category: 'Research & Development', amount: 480000 },
      { category: 'Depreciation & Amortization', amount: 180000 },
      { category: 'Interest Expense', amount: 95000 },
      { category: 'Income Tax Expense', amount: 520000 }
    ],
    totalRevenue: 9850000,
    totalExpenses: 6945000,
    netIncome: 2905000,
    grossProfit: 5650000,
    operatingIncome: 3520000
  },
  cashFlow: {
    operatingActivities: [
      { description: 'Net Income', amount: 2905000 },
      { description: 'Depreciation & Amortization', amount: 180000 },
      { description: 'Accounts Receivable Change', amount: -95000 },
      { description: 'Inventory Change', amount: -180000 },
      { description: 'Accounts Payable Change', amount: 65000 },
      { description: 'Accrued Expenses Change', amount: 35000 }
    ],
    investingActivities: [
      { description: 'Capital Expenditures', amount: -420000 },
      { description: 'Purchase of Investments', amount: -250000 },
      { description: 'Proceeds from Sale of Equipment', amount: 85000 }
    ],
    financingActivities: [
      { description: 'Proceeds from Long-term Debt', amount: 500000 },
      { description: 'Repayment of Short-term Debt', amount: -300000 },
      { description: 'Dividends Paid', amount: -350000 },
      { description: 'Stock Repurchases', amount: -200000 }
    ],
    netCashFlow: 2365000,
    beginningCash: 985000,
    endingCash: 3350000
  },
  trialBalance: [
    { accountCode: '1000', accountName: 'Cash', debit: 1250000, credit: 0 },
    { accountCode: '1100', accountName: 'Accounts Receivable', debit: 890000, credit: 0 },
    { accountCode: '1200', accountName: 'Inventory', debit: 1450000, credit: 0 },
    { accountCode: '1300', accountName: 'Prepaid Expenses', debit: 120000, credit: 0 },
    { accountCode: '1500', accountName: 'Property, Plant & Equipment', debit: 4500000, credit: 0 },
    { accountCode: '1510', accountName: 'Accumulated Depreciation', debit: 0, credit: 1200000 },
    { accountCode: '1600', accountName: 'Long-term Investments', debit: 750000, credit: 0 },
    { accountCode: '1700', accountName: 'Intangible Assets', debit: 500000, credit: 0 },
    { accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 680000 },
    { accountCode: '2100', accountName: 'Short-term Debt', debit: 0, credit: 400000 },
    { accountCode: '2200', accountName: 'Accrued Expenses', debit: 0, credit: 220000 },
    { accountCode: '2300', accountName: 'Current Portion of LTD', debit: 0, credit: 150000 },
    { accountCode: '2500', accountName: 'Long-term Debt', debit: 0, credit: 2000000 },
    { accountCode: '2600', accountName: 'Deferred Tax Liability', debit: 0, credit: 180000 },
    { accountCode: '3000', accountName: 'Common Stock', debit: 0, credit: 1500000 },
    { accountCode: '3100', accountName: 'Retained Earnings', debit: 0, credit: 2835000 },
    { accountCode: '3200', accountName: 'Additional Paid-in Capital', debit: 0, credit: 200000 },
    { accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 8500000 },
    { accountCode: '4100', accountName: 'Service Revenue', debit: 0, credit: 1200000 },
    { accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 4200000, credit: 0 },
    { accountCode: '5100', accountName: 'Sales & Marketing Expense', debit: 850000, credit: 0 },
    { accountCode: '5200', accountName: 'G&A Expense', debit: 620000, credit: 0 },
    { accountCode: '5300', accountName: 'R&D Expense', debit: 480000, credit: 0 },
    { accountCode: '5400', accountName: 'Depreciation Expense', debit: 180000, credit: 0 },
    { accountCode: '5500', accountName: 'Interest Expense', debit: 95000, credit: 0 },
    { accountCode: '5600', accountName: 'Income Tax Expense', debit: 520000, credit: 0 }
  ]
})

// ============ REPORT CONFIGURATIONS ============
const reportConfigs: ReportConfig[] = [
  {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    titleAr: 'الميزانية العمومية',
    icon: <Scale size={20} />,
    description: 'Assets, liabilities, and equity position'
  },
  {
    id: 'income-statement',
    title: 'Income Statement',
    titleAr: 'قائمة الدخل',
    icon: <TrendingUp size={20} />,
    description: 'Revenue, expenses, and profitability'
  },
  {
    id: 'cash-flow',
    title: 'Cash Flow Statement',
    titleAr: 'قائمة التدفقات النقدية',
    icon: <Wallet size={20} />,
    description: 'Cash inflows and outflows analysis'
  },
  {
    id: 'trial-balance',
    title: 'Trial Balance',
    titleAr: 'ميزان المراجعة',
    icon: <BarChart3 size={20} />,
    description: 'All accounts with debit/credit balances'
  }
]

// ============ UTILITY FUNCTIONS ============
const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount)
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(absAmount)
  
  return amount < 0 ? `(${formatted})` : formatted
}

const formatDateRange = (start: Date, end: Date): string => {
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
}

// ============ MAIN COMPONENT ============
export default function FinancialReports() {
  const { t, dir, locale } = useI18n()
  const isRTL = dir === 'rtl'
  
  // State
  const [selectedReport, setSelectedReport] = useState<ReportType>('balance-sheet')
  const [dateRange, setDateRange] = useState<'this-month' | 'this-quarter' | 'this-year' | 'custom'>('this-year')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  
  // Refs
  const reportRef = useRef<HTMLDivElement>(null)
  
  // Data
  const data = generateFinancialData()
  
  const currentConfig = reportConfigs.find(r => r.id === selectedReport)!
  
  // PDF Export Handler
  const handleExportPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Dynamic import for smaller bundle size
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = reportRef.current
      if (!element) throw new Error('Report element not found')
      
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${selectedReport.replace('-', '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: selectedReport === 'trial-balance' ? 'landscape' : 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      
      await html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }
  
  // Print Handler
  const handlePrint = () => {
    window.print()
  }

  // ============ RENDER REPORT CONTENT ============
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'balance-sheet':
        return <BalanceSheetReport data={data.balanceSheet} isRTL={isRTL} locale={locale} />
      case 'income-statement':
        return <IncomeStatementReport data={data.incomeStatement} isRTL={isRTL} locale={locale} />
      case 'cash-flow':
        return <CashFlowReport data={data.cashFlow} isRTL={isRTL} locale={locale} />
      case 'trial-balance':
        return <TrialBalanceReport data={data.trialBalance} isRTL={isRTL} locale={locale} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold text-slate-900 dark:text-slate-100 ${isRTL ? '' : ''}`}>
            <FileText className="inline-block mr-2 mb-1" size={28} />
            {locale === 'ar' ? 'التقارير المالية' : 'Financial Reports'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {locale === 'ar' 
              ? 'إنشاء وتصدير التقارير المالية الاحترافية' 
              : 'Generate and export professional financial reports'}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="
              flex items-center gap-2 px-4 py-2.5 
              bg-white dark:bg-slate-800 
              border border-slate-200 dark:border-slate-700 
              rounded-xl text-slate-700 dark:text-slate-300 
              hover:bg-slate-50 dark:hover:bg-slate-700 
              transition-colors duration-200
              font-medium text-sm
            "
          >
            <Eye size={18} />
            {showPreview ? (locale === 'ar' ? 'إخفاء' : 'Hide') : (locale === 'ar' ? 'عرض' : 'Preview')}
          </button>
          
          <button
            onClick={handlePrint}
            className="
              flex items-center gap-2 px-4 py-2.5 
              bg-white dark:bg-slate-800 
              border border-slate-200 dark:border-slate-700 
              rounded-xl text-slate-700 dark:text-slate-300 
              hover:bg-slate-50 dark:hover:bg-slate-700 
              transition-colors duration-200
              font-medium text-sm
            "
          >
            <Printer size={18} />
            {locale === 'ar' ? 'طباعة' : 'Print'}
          </button>
          
          <button
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className="
              flex items-center gap-2 px-5 py-2.5 
              bg-gradient-to-r from-indigo-600 to-purple-600 
              hover:from-indigo-700 hover:to-purple-700 
              rounded-xl text-white 
              shadow-lg shadow-indigo-500/25 
              transition-all duration-200
              font-medium text-sm
              disabled:opacity-70 disabled:cursor-not-allowed
            "
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {locale === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
              </>
            ) : (
              <>
                <Download size={18} />
                {locale === 'ar' ? 'تصدير PDF' : 'Export PDF'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
        {/* Report Type Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <FileText size={16} className="inline mr-1" />
            {locale === 'ar' ? 'نوع التقرير' : 'Report Type'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {reportConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => setSelectedReport(config.id)}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-xl 
                  transition-all duration-200 font-medium text-sm
                  ${selectedReport === config.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }
                `}
              >
                {config.icon}
                <span className="hidden lg:inline">{locale === 'ar' ? config.titleAr : config.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="sm:w-64">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Calendar size={16} className="inline mr-1" />
            {locale === 'ar' ? 'الفترة الزمنية' : 'Period'}
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="
              w-full px-4 py-2.5 
              bg-white dark:bg-slate-700 
              border border-slate-200 dark:border-slate-600 
              rounded-xl text-slate-900 dark:text-slate-100 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
              transition-colors duration-200
            "
          >
            <option value="this-month">{locale === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
            <option value="this-quarter">{locale === 'ar' ? 'هذا الربع' : 'This Quarter'}</option>
            <option value="this-year">{locale === 'ar' ? 'هذه السنة' : 'This Year'}</option>
            <option value="custom">{locale === 'ar' ? 'مخصص' : 'Custom Range'}</option>
          </select>
        </div>
      </div>

      {/* Report Description */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            {currentConfig.icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {locale === 'ar' ? currentConfig.titleAr : currentConfig.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentConfig.description}
            </p>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {showPreview && (
        <div 
          ref={reportRef}
          className="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl overflow-hidden"
        >
          {/* Report Header */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50 print:bg-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Nexus ERP Solutions
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {locale === 'ar' ? 'نكس لإدارة الموارد' : 'Enterprise Resource Management'}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    123 Business District, Tech City, TC 12345
                  </p>
                </div>
              </div>
              
              <div className={`${isRTL ? 'md:text-left' : 'md:text-right'} space-y-1`}>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {locale === 'ar' ? currentConfig.titleAr : currentConfig.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === 'ar' ? 'الفترة: ' : 'Period: '}
                  {dateRange === 'this-month' && (locale === 'ar' ? 'يناير 2026' : 'January 2026')}
                  {dateRange === 'this-quarter' && (locale === 'ar' ? 'الربع الأول 2026' : 'Q1 2026')}
                  {dateRange === 'this-year' && (locale === 'ar' ? 'السنة المالية 2026' : 'Fiscal Year 2026')}
                  {dateRange === 'custom' && (locale === 'ar' ? 'مخصص' : 'Custom')}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {locale === 'ar' ? 'تاريخ الإصدار: ' : 'Generated: '}
                  {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-6 md:p-8">
            {renderReportContent()}
          </div>

          {/* Report Footer */}
          <div className="px-6 md:px-8 py-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
              <p>
                © {new Date().getFullYear()} Nexus ERP Solutions — {locale === 'ar' ? 'تقرير سري' : 'Confidential Report'}
              </p>
              <p className="font-mono text-xs">
                {locale === 'ar' ? 'معرف التقرير: ' : 'Report ID: '}
                RPT-{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ BALANCE SHEET REPORT ============
function BalanceSheetReport({ data, isRTL, locale }: { data: BalanceSheetData; isRTL: boolean; locale: string }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-indigo-600 dark:border-indigo-400">
            <DollarSign size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {locale === 'ar' ? 'الأصول' : 'ASSETS'}
            </h3>
          </div>
          
          {data.assets.map((category) => (
            <div key={category.category} className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                {category.category}
              </h4>
              <table className="w-full">
                <tbody>
                  {category.items.map((item) => (
                    <tr key={item.name} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2.5 pr-2 text-slate-700 dark:text-slate-300">{item.name}</td>
                      <td className={`py-2.5 text-right font-mono ${item.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-300 dark:border-slate-600">
                    <td className="py-3 pr-2 font-bold text-slate-900 dark:text-slate-100">
                      Total {category.category.split(' ')[0]}
                    </td>
                    <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-slate-100">
                      {formatCurrency(category.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-indigo-900 dark:text-indigo-100">
                {locale === 'ar' ? 'إجمالي الأصول' : 'TOTAL ASSETS'}
              </span>
              <span className="font-bold text-xl font-mono text-indigo-900 dark:text-indigo-100">
                {formatCurrency(data.totalAssets)}
              </span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity Section */}
        <div>
          {/* Liabilities */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-500 dark:border-orange-400">
              <TrendingDown size={20} className="text-orange-500 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {locale === 'ar' ? 'الالتزامات' : 'LIABILITIES'}
              </h3>
            </div>
            
            {data.liabilities.map((category) => (
              <div key={category.category} className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                  {category.category}
                </h4>
                <table className="w-full">
                  <tbody>
                    {category.items.map((item) => (
                      <tr key={item.name} className="border-b border-slate-100 dark:border-slate-700/50">
                        <td className="py-2.5 pr-2 text-slate-700 dark:text-slate-300">{item.name}</td>
                        <td className="py-2.5 text-right font-mono text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-300 dark:border-slate-600">
                      <td className="py-3 pr-2 font-bold text-slate-900 dark:text-slate-100">
                        Total {category.category.split(' ')[0]}
                      </td>
                      <td className="py-3 text-right font-bold font-mono text-slate-900 dark:text-slate-100">
                        {formatCurrency(category.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800/50">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-orange-900 dark:text-orange-100">
                  {locale === 'ar' ? 'إجمالي الالتزامات' : 'TOTAL LIABILITIES'}
                </span>
                <span className="font-bold text-xl font-mono text-orange-900 dark:text-orange-100">
                  {formatCurrency(data.totalLiabilities)}
                </span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-green-600 dark:border-green-400">
              <ArrowRightLeft size={20} className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {locale === 'ar' ? 'حقوق الملكية' : "OWNER'S EQUITY"}
              </h3>
            </div>
            
            <table className="w-full mb-4">
              <tbody>
                {data.equity.map((item) => (
                  <tr key={item.name} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2.5 pr-2 text-slate-700 dark:text-slate-300">{item.name}</td>
                    <td className="py-2.5 text-right font-mono text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800/50">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-green-900 dark:text-green-100">
                  {locale === 'ar' ? 'إجمالي حقوق الملكية' : 'TOTAL EQUITY'}
                </span>
                <span className="font-bold text-xl font-mono text-green-900 dark:text-green-100">
                  {formatCurrency(data.totalEquity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification */}
      <div className="mt-8 p-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-around gap-4 text-center">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatCurrency(data.totalAssets)}
            </p>
          </div>
          <div className="text-3xl font-light text-slate-400">=</div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Liab. + Equity</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatCurrency(data.totalLiabilities + data.totalEquity)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}>
            {Math.abs(data.totalAssets - (data.totalLiabilities + data.totalEquity)) < 0.01
              ? '✓ Balanced'
              : '⚠ Imbalanced'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ INCOME STATEMENT REPORT ============
function IncomeStatementReport({ data, isRTL, locale }: { data: IncomeStatementData; isRTL: boolean; locale: string }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Revenue Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-green-600 dark:border-green-400">
          <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'الإيرادات' : 'REVENUE'}
          </h3>
        </div>
        
        <table className="w-full">
          <tbody>
            {data.revenue.map((item) => (
              <tr key={item.category} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.category}</td>
                <td className="py-3 pl-4 text-right font-mono text-green-600 dark:text-green-400 font-semibold">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-green-50 dark:bg-green-950/20">
              <td className="py-4 pr-4 font-bold text-lg text-green-900 dark:text-green-100">
                {locale === 'ar' ? 'إجمالي الإيرادات' : 'TOTAL REVENUE'}
              </td>
              <td className="py-4 pl-4 text-right font-bold text-lg font-mono text-green-900 dark:text-green-100">
                {formatCurrency(data.totalRevenue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost of Goods Sold */}
      <div className="pl-4 md:pl-8 border-l-4 border-slate-300 dark:border-slate-600">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">
                {locale === 'ar' ? 'تكلفة البضاعة المباعة' : 'Cost of Goods Sold (COGS)'}
              </td>
              <td className="py-3 pl-4 text-right font-mono text-red-600 dark:text-red-400 font-semibold">
                ({formatCurrency(data.expenses[0].amount)})
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-900 dark:text-blue-100">
              {locale === 'ar' ? 'إجمالي الربح' : 'GROSS PROFIT'}
            </span>
            <span className="font-bold text-xl font-mono text-blue-900 dark:text-blue-100">
              {formatCurrency(data.grossProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* Operating Expenses */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-500 dark:border-orange-400">
          <TrendingDown size={20} className="text-orange-500 dark:text-orange-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'المصاريف التشغيلية' : 'OPERATING EXPENSES'}
          </h3>
        </div>
        
        <table className="w-full">
          <tbody>
            {data.expenses.slice(1, 5).map((item) => (
              <tr key={item.category} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.category}</td>
                <td className="py-3 pl-4 text-right font-mono text-red-600 dark:text-red-400">
                  ({formatCurrency(item.amount)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-900 dark:text-purple-100">
              {locale === 'ar' ? 'ربح التشغيل' : 'OPERATING INCOME'}
            </span>
            <span className="font-bold text-xl font-mono text-purple-900 dark:text-purple-100">
              {formatCurrency(data.operatingIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Other Expenses */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
          {locale === 'ar' ? 'مصاريف أخرى' : 'Other Expenses'}
        </h4>
        
        <table className="w-full">
          <tbody>
            {data.expenses.slice(5).map((item) => (
              <tr key={item.category} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.category}</td>
                <td className="py-3 pl-4 text-right font-mono text-red-600 dark:text-red-400">
                  ({formatCurrency(item.amount)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Net Income */}
      <div className="mt-8 p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30">
        <div className="text-center">
          <p className="text-indigo-100 text-lg mb-2">
            {locale === 'ar' ? 'صافي الربح' : 'NET INCOME'}
          </p>
          <p className="text-4xl md:text-5xl font-bold text-white font-mono">
            {formatCurrency(data.netIncome)}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm">
            <TrendingUp size={16} />
            <span>{locale === 'ar' ? 'ربحي' : 'Profitable'}</span>
            <span className="font-bold">
              {((data.netIncome / data.totalRevenue) * 100).toFixed(1)}% Margin
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ CASH FLOW REPORT ============
function CashFlowReport({ data, isRTL, locale }: { data: CashFlowData; isRTL: boolean; locale: string }) {
  const calculateTotal = (items: CashFlowItem[]) => 
    items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Operating Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-blue-600 dark:border-blue-400">
          <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'الأنشطة التشغيلية' : 'CASH FLOW FROM OPERATING ACTIVITIES'}
          </h3>
        </div>
        
        <table className="w-full">
          <tbody>
            {data.operatingActivities.map((item) => (
              <tr key={item.description} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.description}</td>
                <td className={`py-3 pl-4 text-right font-mono font-semibold ${
                  item.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border-l-4 border-blue-600 dark:border-blue-400">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-900 dark:text-blue-100">
              {locale === 'ar' ? 'صافي التدفق التشغيلي' : 'Net Cash from Operations'}
            </span>
            <span className="font-bold text-xl font-mono text-blue-900 dark:text-blue-100">
              {formatCurrency(calculateTotal(data.operatingActivities))}
            </span>
          </div>
        </div>
      </div>

      {/* Investing Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-purple-600 dark:border-purple-400">
          <div className="w-3 h-3 rounded-full bg-purple-600 dark:bg-purple-400"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'أنشطة الاستثمار' : 'CASH FLOW FROM INVESTING ACTIVITIES'}
          </h3>
        </div>
        
        <table className="w-full">
          <tbody>
            {data.investingActivities.map((item) => (
              <tr key={item.description} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.description}</td>
                <td className={`py-3 pl-4 text-right font-mono font-semibold ${
                  item.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border-l-4 border-purple-600 dark:border-purple-400">
          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-900 dark:text-purple-100">
              {locale === 'ar' ? 'صافي تدفق الاستثمار' : 'Net Cash from Investing'}
            </span>
            <span className="font-bold text-xl font-mono text-purple-900 dark:text-purple-100">
              {formatCurrency(calculateTotal(data.investingActivities))}
            </span>
          </div>
        </div>
      </div>

      {/* Financing Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-orange-500 dark:border-orange-400">
          <div className="w-3 h-3 rounded-full bg-orange-500 dark:bg-orange-400"></div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {locale === 'ar' ? 'أنشطة التمويل' : 'CASH FLOW FROM FINANCING ACTIVITIES'}
          </h3>
        </div>
        
        <table className="w-full">
          <tbody>
            {data.financingActivities.map((item) => (
              <tr key={item.description} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{item.description}</td>
                <td className={`py-3 pl-4 text-right font-mono font-semibold ${
                  item.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border-l-4 border-orange-500 dark:border-orange-400">
          <div className="flex justify-between items-center">
            <span className="font-bold text-orange-900 dark:text-orange-100">
              {locale === 'ar' ? 'صافي تدفق التمويل' : 'Net Cash from Financing'}
            </span>
            <span className="font-bold text-xl font-mono text-orange-900 dark:text-orange-100">
              {formatCurrency(calculateTotal(data.financingActivities))}
            </span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-100 dark:bg-slate-700/50">
            <tr>
              <th className="py-4 px-6 text-left font-bold text-slate-900 dark:text-slate-100">
                {locale === 'ar' ? 'ملخص النقدية' : 'CASH SUMMARY'}
              </th>
              <th className="py-4 px-6 text-right font-bold text-slate-900 dark:text-slate-100"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-700">
              <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                {locale === 'ar' ? 'رصيد النقدية في بداية الفترة' : 'Beginning Cash Balance'}
              </td>
              <td className="py-4 px-6 text-right font-mono text-slate-900 dark:text-slate-100">
                {formatCurrency(data.beginningCash)}
              </td>
            </tr>
            <tr className="bg-indigo-50 dark:bg-indigo-950/20 border-t border-b border-indigo-200 dark:border-indigo-800/50">
              <td className="py-4 px-6 font-bold text-indigo-900 dark:text-indigo-100">
                {locale === 'ar' ? 'صافي التغير في النقدية' : 'Net Change in Cash'}
              </td>
              <td className="py-4 px-6 text-right font-bold font-mono text-indigo-900 dark:text-indigo-100">
                {formatCurrency(data.netCashFlow)}
              </td>
            </tr>
            <tr className="bg-gradient-to-r from-green-500 to-emerald-500">
              <td className="py-5 px-6 font-bold text-white text-lg">
                {locale === 'ar' ? 'رصيد النقدية في نهاية الفترة' : 'Ending Cash Balance'}
              </td>
              <td className="py-5 px-6 text-right font-bold font-mono text-white text-xl">
                {formatCurrency(data.endingCash)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============ TRIAL BALANCE REPORT ============
function TrialBalanceReport({ data, isRTL, locale }: { data: TrialBalanceItem[]; isRTL: boolean; locale: string }) {
  const totalDebits = data.reduce((sum, item) => sum + item.debit, 0)
  const totalCredits = data.reduce((sum, item) => sum + item.credit, 0)

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {locale === 'ar' ? `إجمالي الحسابات: ${data.length}` : `Total Accounts: ${data.length}`}
        </p>
        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
          Math.abs(totalDebits - totalCredits) < 0.01
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {Math.abs(totalDebits - totalCredits) < 0.01 ? '✓ In Balance' : '⚠ Out of Balance'}
        </div>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700/50">
            <th className={`py-3 px-4 text-left font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-600`}>
              {locale === 'ar' ? 'رمز الحساب' : 'Account Code'}
            </th>
            <th className={`py-3 px-4 text-left font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-600`}>
              {locale === 'ar' ? 'اسم الحساب' : 'Account Name'}
            </th>
            <th className={`py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-600`}>
              {locale === 'ar' ? 'مدين' : 'Debit ($)'}
            </th>
            <th className={`py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-300 dark:border-slate-600`}>
              {locale === 'ar' ? 'دائن' : 'Credit ($)'}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item.accountCode}
              className={`
                border-b border-slate-100 dark:border-slate-700/50
                ${index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/50 dark:bg-slate-800/30'}
                hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors
              `}
            >
              <td className="py-3 px-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                {item.accountCode}
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                {item.accountName}
              </td>
              <td className="py-3 px-4 text-right font-mono text-slate-900 dark:text-slate-100">
                {item.debit > 0 ? formatCurrency(item.debit) : '-'}
              </td>
              <td className="py-3 px-4 text-right font-mono text-slate-900 dark:text-slate-100">
                {item.credit > 0 ? formatCurrency(item.credit) : '-'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800">
            <td colSpan={2} className="py-4 px-4 font-bold text-white text-lg">
              {locale === 'ar' ? 'المجموع' : 'TOTALS'}
            </td>
            <td className="py-4 px-4 text-right font-bold font-mono text-white text-lg">
              {formatCurrency(totalDebits)}
            </td>
            <td className="py-4 px-4 text-right font-bold font-mono text-white text-lg">
              {formatCurrency(totalCredits)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
