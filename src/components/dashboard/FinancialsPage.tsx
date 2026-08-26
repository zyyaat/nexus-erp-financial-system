'use client'

import { useState, useMemo } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  Download,
  Plus,
  Filter,
  Calendar,
  PieChart,
  Receipt,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  Landmark,
  Calculator,
  BarChart3,
  Globe,
  Banknote,
  Target,
  Activity,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Printer,
  RefreshCw,
  Upload,
  MoreHorizontal,
  X,
  AlertTriangle,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  Scale,
  ClipboardList,
  BookOpen,
  Coins,
  PiggyBank,
  CreditCard as CreditCardIcon,
  ArrowRightLeft,
  Percent,
  LineChart,
  TrendingUpIcon
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// ============ TYPES ============
interface Transaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  category: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  invoice?: string
  currency?: string
}

interface Invoice {
  id: string
  client: string
  clientAr?: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft'
  issuedDate: string
  dueDate: string
  currency?: string
}

interface GLAccount {
  id: string
  code: string
  name: string
  nameAr?: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: number
  debit: number
  credit: number
  currency: string
}

interface Vendor {
  id: string
  code: string
  name: string
  nameAr?: string
  email: string
  totalDue: number
  currency: string
  status: 'active' | 'inactive'
}

interface Customer {
  id: string
  code: string
  name: string
  nameAr?: string
  email: string
  totalReceivable: number
  currency: string
  status: 'active' | 'inactive'
}

interface BankAccount {
  id: string
  name: string
  bankName: string
  accountNumber: string
  balance: number
  availableBalance: number
  currency: string
  type: 'checking' | 'savings' | 'investment'
  status: 'active'
}

// ============ MOCK DATA ============
const financialKPIs = [
  {
    titleKey: 'financials.totalRevenue',
    titleAr: 'إجمالي الإيرادات',
    value: '$847,290',
    change: 15.3,
    icon: TrendingUp,
    color: 'emerald',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    titleKey: 'financials.totalExpenses',
    titleAr: 'إجمالي المصروفات',
    value: '$523,180',
    change: -4.2,
    icon: TrendingDown,
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    titleKey: 'financials.netProfit',
    titleAr: 'صافي الربح',
    value: '$324,110',
    change: 28.7,
    icon: DollarSign,
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    titleKey: 'financials.cashPosition',
    titleAr: 'مركز النقدية',
    value: '$456,890',
    change: 12.5,
    icon: Wallet,
    color: 'violet',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-600'
  }
]

const liquidityKPIs = [
  { label: 'Current Ratio', labelAr: 'نسبة التداول', value: '1.85', status: 'good', target: '1.5+' },
  { label: 'Quick Ratio', labelAr: 'نسبة السيولة السريعة', value: '1.42', status: 'good', target: '1.0+' },
  { label: 'Cash Ratio', labelAr: 'نسبة النقدية', value: '0.87', status: 'warning', target: '0.5+' },
  { label: 'Working Capital', labelAr: 'رأس العامل', value: '$245K', status: 'good', target: '+' }
]

const profitabilityKPIs = [
  { label: 'Gross Margin', labelAr: 'هامش الربح الإجمالي', value: '38.2%', change: '+2.1%' },
  { label: 'Operating Margin', labelAr: 'هامش الربح التشغيلي', value: '24.5%', change: '+3.8%' },
  { label: 'Net Profit Margin', labelAr: 'هامش صافي الربح', value: '18.9%', change: '+5.2%' },
  { label: 'ROE', labelAr: 'العائد على حقوق الملكية', value: '22.4%', change: '+4.1%' },
  { label: 'ROA', labelAr: 'العائد على الأصول', value: '14.7%', change: '+2.8%' },
  { label: 'ROIC', labelAr: 'العائد على رأس المال المستثمر', value: '19.2%', change: '+3.5%' }
]

const recentTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'income', description: 'Payment received - TechCorp Industries', amount: 45000, category: 'Sales', date: '2026-08-26', status: 'completed', invoice: 'INV-2026-089', currency: 'USD' },
  { id: 'TXN-002', type: 'expense', description: 'Office rent payment - August', amount: 8500, category: 'Operations', date: '2026-08-25', status: 'completed', currency: 'USD' },
  { id: 'TXN-003', type: 'income', description: 'Product sales - Online Store', amount: 12350, category: 'E-commerce', date: '2026-08-25', status: 'completed', invoice: 'INV-2026-090', currency: 'EUR' },
  { id: 'TXN-004', type: 'expense', description: 'Software licenses renewal', amount: 2400, category: 'Technology', date: '2026-08-24', status: 'pending', currency: 'USD' },
  { id: 'TXN-005', type: 'income', description: 'Consulting services - Acme Corp', amount: 18500, category: 'Services', date: '2026-08-24', status: 'pending', invoice: 'INV-2026-091', currency: 'SAR' },
  { id: 'TXN-006', type: 'expense', description: 'Marketing campaign Q3', amount: 15000, category: 'Marketing', date: '2026-08-23', status: 'completed', currency: 'USD' },
  { id: 'TXN-007', type: 'income', description: 'Export sales - Gulf Region', amount: 32000, category: 'International', date: '2026-08-22', status: 'completed', invoice: 'INV-2026-092', currency: 'AED' },
  { id: 'TXN-008', type: 'expense', description: 'Employee salaries August', amount: 156200, category: 'Payroll', date: '2026-08-20', status: 'completed', currency: 'SAR' }
]

const invoices: Invoice[] = [
  { id: 'INV-2026-089', client: 'TechCorp Industries', clientAr: 'تيك كورب للصناعات', amount: 45000, status: 'paid', issuedDate: '2026-08-20', dueDate: '2026-09-20', currency: 'USD' },
  { id: 'INV-2026-090', client: 'Online Store Customer', clientAr: 'عميل المتجر الإلكتروني', amount: 12350, status: 'paid', issuedDate: '2026-08-22', dueDate: '2026-09-22', currency: 'EUR' },
  { id: 'INV-2026-091', client: 'Acme Corporation', clientAr: 'أكيم كوربوريشن', amount: 18500, status: 'pending', issuedDate: '2026-08-24', dueDate: '2026-09-24', currency: 'SAR' },
  { id: 'INV-2026-092', client: 'Global Manufacturing', clientAr: 'التصنيع العالمي', amount: 67300, status: 'overdue', issuedDate: '2026-07-15', dueDate: '2026-08-15', currency: 'AED' },
  { id: 'INV-2026-093', client: 'SupplyChain Ltd', clientAr: 'سلاسل التوريد المحدودة', amount: 28900, status: 'draft', issuedDate: '2026-08-26', dueDate: '2026-09-26', currency: 'USD' }
]

const glAccounts: GLAccount[] = [
  { id: '1', code: '1000', name: 'Cash & Bank', nameAr: 'النقدية والبنوك', type: 'asset', balance: 456890, debit: 500000, credit: 43110, currency: 'USD' },
  { id: '2', code: '1200', name: 'Accounts Receivable', nameAr: 'الذمم المدينة', type: 'asset', balance: 128450, debit: 145000, credit: 16550, currency: 'USD' },
  { id: '3', code: '1500', name: 'Inventory', nameAr: 'المخزون', type: 'asset', balance: 234500, debit: 250000, credit: 15500, currency: 'USD' },
  { id: '4', code: '2000', name: 'Accounts Payable', nameAr: 'الذمم الدائنة', type: 'liability', balance: -89200, debit: 15000, credit: 104200, currency: 'USD' },
  { id: '5', code: '2100', name: 'Short-term Loans', nameAr: 'القروض قصيرة الأجل', type: 'liability', balance: -75000, debit: 25000, credit: 100000, currency: 'USD' },
  { id: '6', code: '3000', name: 'Owner\'s Equity', nameAr: 'حقوق المالك', type: 'equity', balance: 500000, debit: 0, credit: 500000, currency: 'USD' },
  { id: '7', code: '4000', name: 'Sales Revenue', nameAr: 'إيرادات المبيعات', type: 'revenue', balance: 847290, debit: 0, credit: 847290, currency: 'USD' },
  { id: '8', code: '5000', name: 'Cost of Goods Sold', nameAr: 'تكلفة البضاعة المباعة', type: 'expense', balance: -523180, debit: 523180, credit: 0, currency: 'USD' },
  { id: '9', code: '5100', name: 'Operating Expenses', nameAr: 'المصاريف التشغيلية', type: 'expense', balance: -198500, debit: 198500, credit: 0, currency: 'USD' },
  { id: '10', code: '5200', name: 'Salaries & Wages', nameAr: 'الرواتب والأجور', type: 'expense', balance: -156200, debit: 156200, credit: 0, currency: 'USD' }
]

const vendors: Vendor[] = [
  { id: 'V001', code: 'V001', name: 'Office Supplies Co.', nameAr: 'شركة المكتبات', email: 'procurement@officesupplies.com', totalDue: 12500, currency: 'USD', status: 'active' },
  { id: 'V002', code: 'V002', name: 'Tech Equipment Ltd.', nameAr: 'معدات التقنية المحدودة', email: 'orders@techequip.com', totalDue: 45000, currency: 'EUR', status: 'active' },
  { id: 'V003', code: 'V003', name: 'Global Logistics', nameAr: 'الخدمات اللوجستية العالمية', email: 'shipping@globallogistics.com', totalDue: 18700, currency: 'USD', status: 'active' },
  { id: 'V004', code: 'V004', name: 'IT Services Provider', nameAr: 'مقدم خدمات تقنية المعلومات', email: 'support@itservices.com', totalDue: 13000, currency: 'SAR', status: 'inactive' }
]

const customers: Customer[] = [
  { id: 'C001', code: 'C001', name: 'TechCorp Industries', nameAr: 'تيك كورب للصناعات', email: 'ap@techcorp.com', totalReceivable: 45000, currency: 'USD', status: 'active' },
  { id: 'C002', code: 'C002', name: 'Acme Corporation', nameAr: 'أكيم كوربوريشن', email: 'finance@acme.com', totalReceivable: 18500, currency: 'SAR', status: 'active' },
  { id: 'C003', code: 'C003', name: 'Global Manufacturing', nameAr: 'التصنيع العالمي', email: 'ar@globalmfg.com', totalReceivable: 67300, currency: 'AED', status: 'active' },
  { id: 'C004', code: 'C004', name: 'Retail Chain LLC', nameAr: 'سلسلة التجزئة', email: 'accounts@retailchain.com', totalReceivable: 28900, currency: 'EUR', status: 'active' }
]

const bankAccounts: BankAccount[] = [
  { id: 'BA001', name: 'Main Operating Account', bankName: 'First National Bank', accountNumber: '****4582', balance: 285000, availableBalance: 275000, currency: 'USD', type: 'checking', status: 'active' },
  { id: 'BA002', name: 'Payroll Account', bankName: 'First National Bank', accountNumber: '****7891', balance: 95890, availableBalance: 95890, currency: 'USD', type: 'checking', status: 'active' },
  { id: 'BA003', name: 'Euro Account', bankName: 'European Central Bank', accountNumber: '****3344', balance: 75900, availableBalance: 75900, currency: 'EUR', type: 'savings', status: 'active' },
  { id: 'BA004', name: 'SAR Account', bankName: 'Saudi National Bank', accountNumber: '****6677', balance: 142350, availableBalance: 140000, currency: 'SAR', type: 'checking', status: 'active' }
]

const expenseBreakdown = [
  { name: 'Operations', nameAr: 'العمليات', amount: 198500, percentage: 38, color: 'bg-indigo-500' },
  { name: 'Salaries', nameAr: 'الرواتب', amount: 156200, percentage: 30, color: 'bg-violet-500' },
  { name: 'Marketing', nameAr: 'التسويق', amount: 78400, percentage: 15, color: 'bg-blue-500' },
  { name: 'Technology', nameAr: 'التقنية', amount: 52080, percentage: 10, color: 'bg-emerald-500' },
  { name: 'Other', nameAr: 'أخرى', amount: 40000, percentage: 7, color: 'bg-slate-400' }
]

const currencies = [
  { code: 'USD', name: 'US Dollar', nameAr: 'دولار أمريكي', symbol: '$', rate: 1.0000, balance: 456890 },
  { code: 'EUR', name: 'Euro', nameAr: 'يورو', symbol: '€', rate: 1.0875, balance: 98240 },
  { code: 'SAR', name: 'Saudi Riyal', nameAr: 'ريال سعودي', symbol: '﷼', rate: 0.2667, balance: 178550 },
  { code: 'AED', name: 'UAE Dirham', nameAr: 'درهم إماراتي', symbol: 'د.إ', rate: 0.2723, balance: 18320 },
  { code: 'GBP', name: 'British Pound', nameAr: 'جنيه إسترليني', symbol: '£', rate: 1.2742, balance: 12450 }
]

// ============ SUB-COMPONENTS ============

function TransactionTypeBadge({ type }: { type: Transaction['type'] }) {
  const { t } = useI18n()
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      type === 'income' 
        ? 'bg-emerald-100 text-emerald-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {type === 'income' ? <ArrowUpLeft size={12} /> : <ArrowDownRight size={12} />}
      {type === 'income' ? t('txn.type.income') : t('txn.type.expense')}
    </span>
  )
}

function TransactionStatusBadge({ status }: { status: Transaction['status'] }) {
  const config = {
    completed: { icon: CheckCircle2, className: 'text-emerald-600 bg-emerald-100' },
    pending: { icon: Clock, className: 'text-amber-600 bg-amber-100' },
    failed: { icon: AlertCircle, className: 'text-red-600 bg-red-100' }
  }

  const { icon: Icon, className } = config[status]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const config = {
    paid: { className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pending: { className: 'bg-blue-100 text-blue-700 border-blue-200' },
    overdue: { className: 'bg-red-100 text-red-700 border-red-200' },
    draft: { className: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config[status].className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function CurrencyBadge({ code }: { code: string }) {
  const curr = currencies.find(c => c.code === code)
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-600">
      <Globe size={10} />
      {code}
    </span>
  )
}

function KPICard({ kpi }: { kpi: typeof financialKPIs[0] }) {
  const Icon = kpi.icon
  const isPositive = kpi.change >= 0

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-lg shadow-slate-200/50">
      <div className={`absolute top-0 right-0 w-28 h-28 ${kpi.bgColor} rounded-full blur-2xl -mr-10 -mt-10 opacity-60 pointer-events-none`}></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={`p-2.5 ${kpi.bgColor} rounded-xl ${kpi.textColor}`}>
          <Icon size={20} />
        </div>
        {kpi.change !== 0 && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {Math.abs(kpi.change)}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-xs font-medium text-slate-500 mb-1">{kpi.titleAr || kpi.titleKey}</p>
        <h3 className="text-xl font-bold text-slate-900">{kpi.value}</h3>
      </div>
    </div>
  )
}

// Tab Navigation Component
type FinanceTab = 'overview' | 'gl' | 'ap' | 'ar' | 'treasury' | 'reports' | 'budget'

function TabNavigation({ activeTab, setActiveTab }: { activeTab: FinanceTab; setActiveTab: (tab: FinanceTab) => void }) {
  const tabs = [
    { id: 'overview' as FinanceTab, icon: BarChart3, label: 'Overview', labelAr: 'نظرة عامة' },
    { id: 'gl' as FinanceTab, icon: BookOpen, label: 'General Ledger', labelAr: 'دفتر الأستاذ العام' },
    { id: 'ap' as FinanceTab, icon: CreditCard, label: 'Accounts Payable', labelAr: 'حسابات الدائنة' },
    { id: 'ar' as FinanceTab, icon: Users, label: 'Accounts Receivable', labelAr: 'حسابات القبض' },
    { id: 'treasury' as FinanceTab, icon: Landmark, label: 'Treasury', labelAr: 'الخزينة' },
    { id: 'reports' as FinanceTab, icon: FileText, label: 'Reports', labelAr: 'التقارير' },
    { id: 'budget' as FinanceTab, icon: Target, label: 'Budget', labelAr: 'الميزانية' }
  ]

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-1.5 shadow-lg flex gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === tab.id 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <tab.icon size={16} />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.labelAr?.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  )
}

// Overview Section
function OverviewSection() {
  const totalIncome = recentTransactions.filter(tr => tr.type === 'income').reduce((sum, tr) => sum + tr.amount, 0)
  const totalExpenses = recentTransactions.filter(tr => tr.type === 'expense').reduce((sum, tr) => sum + tr.amount, 0)

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {financialKPIs.map((kpi) => (
          <KPICard key={kpi.titleKey} kpi={kpi} />
        ))}
      </div>

      {/* Secondary KPIs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Metrics */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            Liquidity Metrics / مؤشرات السيولة
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {liquidityKPIs.map((kpi) => (
              <div key={kpi.label} className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">{kpi.labelAr}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${
                    kpi.status === 'good' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{kpi.value}</span>
                  <span className="text-xs text-slate-400">{kpi.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profitability Metrics */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUpIcon size={18} className="text-emerald-500" />
            Profitability Metrics / مؤشرات الربحية
          </h3>
          <div className="space-y-3">
            {profitabilityKPIs.map((kpi) => (
              <div key={kpi.label} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{kpi.labelAr}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{kpi.value}</span>
                  <span className="text-xs font-medium text-emerald-600">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions and Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Receipt size={18} className="text-indigo-500" />
                Recent Transactions / آخر المعاملات
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Filter size={16} className="text-slate-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <Download size={16} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center gap-6 pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Income: <strong className="text-emerald-700">${totalIncome.toLocaleString()}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-600">Expense: <strong className="text-red-700">${totalExpenses.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Transaction List - Mobile Responsive */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-all group border border-slate-100 hover:border-slate-200 hover:shadow-md">
                  {/* Main Row: Icon + Description + Amount */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'} flex-shrink-0 mt-0.5`}>
                      {transaction.type === 'income' ? <ArrowUpLeft size={16} className="text-emerald-600" /> : <ArrowDownRight size={16} className="text-red-600" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Description - Full text, no truncate */}
                      <p className="font-medium text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {transaction.description}
                      </p>
                      
                      {/* Meta Info Row */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                        <TransactionStatusBadge status={transaction.status} />
                        <span className="text-xs text-slate-500 font-mono">{transaction.date}</span>
                        {transaction.invoice && (
                          <span className="text-xs text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">{transaction.invoice}</span>
                        )}
                        {transaction.currency && <CurrencyBadge code={transaction.currency} />}
                      </div>
                    </div>
                    
                    {/* Amount - Right side */}
                    <div className="flex-shrink-0 text-right ml-2">
                      <p className={`font-bold text-base whitespace-nowrap ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{transaction.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Expense Breakdown */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <PieChart size={18} className="text-violet-500" />
              Expense Breakdown / توزيع المصروفات
            </h3>

            <div className="space-y-4">
              {expenseBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{item.nameAr}</span>
                    <span className="text-xs text-slate-500">${(item.amount / 1000).toFixed(1)}k ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700">Total / الإجمالي</span>
                <span className="text-lg font-bold text-slate-900">$523,180</span>
              </div>
            </div>
          </div>

          {/* Cash Position */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white shadow-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wallet size={18} />
              Cash Position / مركز النقدية
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm">This Month</span>
                <span className="text-lg font-bold">$124,110</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm">Last Month</span>
                <span className="text-lg font-bold">$98,430</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg backdrop-blur-sm mt-2">
                <span className="text-sm font-medium">Growth / النمو</span>
                <span className="text-lg font-bold flex items-center gap-1">
                  <TrendingUp size={18} />
                  +26.1%
                </span>
              </div>
            </div>
          </div>

          {/* Currencies */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Globe size={18} className="text-cyan-500" />
              Multi-Currency / تعدد العملات
            </h3>

            <div className="space-y-2">
              {currencies.slice(0, 4).map((curr) => (
                <div key={curr.code} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-700">{curr.symbol}</span>
                    <span className="text-sm text-slate-600">{curr.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${curr.balance.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 block">{curr.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// General Ledger Section
function GLSection() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return glAccounts
    return glAccounts.filter(acc => 
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.code.includes(searchTerm) ||
      acc.nameAr?.includes(searchTerm)
    )
  }, [searchTerm])

  const totalDebits = filteredAccounts.reduce((sum, acc) => sum + acc.debit, 0)
  const totalCredits = filteredAccounts.reduce((sum, acc) => sum + acc.credit, 0)

  return (
    <div className="space-y-6">
      {/* GL Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen size={28} className="text-indigo-500" />
            General Ledger
            <span className="text-lg font-normal text-slate-500">/ دفتر الأستاذ العام</span>
          </h3>
          <p className="text-slate-500 mt-1">Chart of accounts with balances and activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Plus size={16} />
            New Entry
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
            <Printer size={16} />
            Print Trial Balance
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-sm bg-white">
          <option>All Types</option>
          <option>Assets</option>
          <option>Liabilities</option>
          <option>Equity</option>
          <option>Revenue</option>
          <option>Expenses</option>
        </select>
      </div>

      {/* Trial Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <ArrowDownLeft size={18} />
            <span className="text-sm font-medium">Total Debits / إجمالي المدين</span>
          </div>
          <p className="text-2xl font-bold">${totalDebits.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <ArrowDownRight size={18} />
            <span className="text-sm font-medium">Total Credits / إجمالي الدائن</span>
          </div>
          <p className="text-2xl font-bold">${totalCredits.toLocaleString()}</p>
        </div>
        <div className={`rounded-xl p-5 text-white shadow-lg ${
          Math.abs(totalDebits - totalCredits) < 0.01 
            ? 'from-emerald-500 to-green-600' 
            : 'from-amber-500 to-orange-600'
        } bg-gradient-to-br`}>
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Scale size={18} />
            <span className="text-sm font-medium">Difference / الفرق</span>
          </div>
          <p className="text-2xl font-bold">${Math.abs(totalDebits - totalCredits).toLocaleString()}</p>
        </div>
      </div>

      {/* Accounts Table - Mobile Responsive */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Account Name</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Type</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Debit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Credit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-medium text-indigo-600">{account.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{account.name}</p>
                      {account.nameAr && <p className="text-xs text-slate-500">{account.nameAr}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      account.type === 'asset' ? 'bg-blue-100 text-blue-700' :
                      account.type === 'liability' ? 'bg-orange-100 text-orange-700' :
                      account.type === 'equity' ? 'bg-purple-100 text-purple-700' :
                      account.type === 'revenue' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {account.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-700">
                    {account.debit > 0 ? `$${account.debit.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-slate-700">
                    {account.credit > 0 ? `$${account.credit.toLocaleString()}` : '-'}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-sm font-bold ${
                    account.balance >= 0 ? 'text-slate-900' : 'text-red-600'
                  }`}>
                    ${Math.abs(account.balance).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-indigo-600">{account.code}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    account.type === 'asset' ? 'bg-blue-100 text-blue-700' :
                    account.type === 'liability' ? 'bg-orange-100 text-orange-700' :
                    account.type === 'equity' ? 'bg-purple-100 text-purple-700' :
                    account.type === 'revenue' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {account.type}
                  </span>
                </div>
                <span className={`font-mono text-sm font-bold ${
                  account.balance >= 0 ? 'text-slate-900' : 'text-red-600'
                }`}>
                  ${Math.abs(account.balance).toLocaleString()}
                </span>
              </div>
              <p className="font-medium text-sm text-slate-900 mb-1">{account.name}</p>
              {account.nameAr && <p className="text-xs text-slate-500 mb-2">{account.nameAr}</p>}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Dr: <strong className="text-slate-700">${account.debit.toLocaleString()}</strong></span>
                <span>Cr: <strong className="text-slate-700">${account.credit.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Accounts Payable Section
function APSection() {
  const totalDue = vendors.reduce((sum, v) => sum + v.totalDue, 0)
  const overdueCount = 2 // Mock data

  return (
    <div className="space-y-6">
      {/* AP Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <CreditCard size={28} className="text-orange-500" />
            Accounts Payable
            <span className="text-lg font-normal text-slate-500">/ حسابات الدائنة</span>
          </h3>
          <p className="text-slate-500 mt-1">Manage vendor invoices and payments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Upload size={16} />
            Import Invoice
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      {/* AP Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <FileText size={20} />
            </div>
            <span className="text-sm text-slate-500">Pending Invoices</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">12</p>
          <p className="text-xs text-emerald-600 mt-1">↓ 8% from last month</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
            <span className="text-sm text-slate-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          <p className="text-xs text-slate-500 mt-1">Requires attention</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <span className="text-sm text-slate-500">Total Due</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalDue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Across {vendors.length} vendors</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-sm text-slate-500">This Month Paid</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">$34,500</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 12% from last month</p>
        </div>
      </div>

      {/* Vendors Table - Mobile Responsive */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Building2 size={18} className="text-orange-500" />
            Vendors / الموردون
          </h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Vendor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Due</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Currency</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{vendor.name}</p>
                        <p className="text-xs text-slate-500">{vendor.nameAr || vendor.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[150px]">{vendor.email}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">${vendor.totalDue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <CurrencyBadge code={vendor.currency} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {vendor.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{vendor.name}</p>
                      <p className="text-xs text-slate-500">{vendor.nameAr || vendor.code}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ml-2 ${
                      vendor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {vendor.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-2">{vendor.email}</p>
                  <div className="flex items-center justify-between">
                    <CurrencyBadge code={vendor.currency} />
                    <span className="font-bold text-sm text-slate-900">${vendor.totalDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Accounts Receivable Section
function ARSection() {
  const totalReceivable = customers.reduce((sum, c) => sum + c.totalReceivable, 0)
  const overdueAmount = 67300 // From Global Manufacturing

  return (
    <div className="space-y-6">
      {/* AR Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Users size={28} className="text-blue-500" />
            Accounts Receivable
            <span className="text-lg font-normal text-slate-500">/ حسابات القبض</span>
          </h3>
          <p className="text-slate-500 mt-1">Manage customer invoices and collections</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <RefreshCw size={16} />
            Send Reminders
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      {/* AR Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FileText size={20} />
            </div>
            <span className="text-sm text-slate-500">Outstanding</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
          <p className="text-xs text-slate-500 mt-1">Active invoices</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
            <span className="text-sm text-slate-500">Overdue Amount</span>
          </div>
          <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">1 invoice overdue</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
              <Coins size={20} />
            </div>
            <span className="text-sm text-slate-500">Total Receivable</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalReceivable.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Across {customers.length} customers</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <PiggyBank size={20} />
            </div>
            <span className="text-sm text-slate-500">Collected (MTD)</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">$76,050</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 18% from last month</p>
        </div>
      </div>

      {/* Customers Table - Mobile Responsive */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            Customers / العملاء
          </h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Receivable</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Currency</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.nameAr || customer.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 truncate max-w-[150px]">{customer.email}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">${customer.totalReceivable.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <CurrencyBadge code={customer.currency} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {customers.map((customer) => (
            <div key={customer.id} className="p-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-sm text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.nameAr || customer.code}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ml-2 ${
                      customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mb-2">{customer.email}</p>
                  <div className="flex items-center justify-between">
                    <CurrencyBadge code={customer.currency} />
                    <span className="font-bold text-sm text-slate-900">${customer.totalReceivable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Treasury Section
function TreasurySection() {
  const totalBalance = bankAccounts.reduce((sum, ba) => sum + ba.balance, 0)
  const totalAvailable = bankAccounts.reduce((sum, ba) => sum + ba.availableBalance, 0)

  return (
    <div className="space-y-6">
      {/* Treasury Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Landmark size={28} className="text-emerald-500" />
            Treasury Management
            <span className="text-lg font-normal text-slate-500">/ إدارة الخزينة</span>
          </h3>
          <p className="text-slate-500 mt-1">Monitor cash positions and bank accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <RefreshCw size={16} />
            Reconcile
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            Transfer Funds
          </button>
        </div>
      </div>

      {/* Cash Position Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-semibold text-lg opacity-90">Total Cash Position</h4>
              <p className="text-sm opacity-75">Combined balance across all accounts</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Banknote size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm opacity-75 mb-1">Total Balance</p>
              <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Available Balance</p>
              <p className="text-3xl font-bold">${totalAvailable.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs opacity-75">Checking</p>
              <p className="text-lg font-semibold">$380,890</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Savings</p>
              <p className="text-lg font-semibold">$75,900</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Investment</p>
              <p className="text-lg font-semibold">$0</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500" />
              Cash Flow (MTD)
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Inflows</span>
                <span className="font-bold text-emerald-600">$156,780</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Outflows</span>
                <span className="font-bold text-red-600">$132,450</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-900">Net Flow</span>
                <span className="font-bold text-emerald-600">+$24,330</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800 mb-1">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">Attention Required</span>
            </div>
            <p className="text-xs text-amber-700">1 account not reconciled in 30+ days</p>
          </div>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Banknote size={18} className="text-emerald-500" />
            Bank Accounts / الحساب البكية
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {bankAccounts.map((account) => (
            <div key={account.id} className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${
                    account.type === 'checking' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Landmark size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900">{account.name}</p>
                    <p className="text-xs text-slate-500">{account.bankName}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  account.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {account.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">{account.accountNumber}</span>
                <CurrencyBadge code={account.currency} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Balance</p>
                  <p className="font-bold text-slate-900">${account.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Available</p>
                  <p className="font-bold text-emerald-600">${account.availableBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Reports Placeholder
function ReportsSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FileText size={28} className="text-violet-500" />
            Financial Reports
            <span className="text-lg font-normal text-slate-500">/ التقارير المالية</span>
          </h3>
          <p className="text-slate-500 mt-1">Generate and export financial statements</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2">
          <Printer size={16} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Balance Sheet', titleAr: 'الميزانية العمومية', desc: 'Assets, liabilities, and equity statement', icon: Scale, color: 'blue' },
          { title: 'Income Statement', titleAr: 'قائمة الدخل', desc: 'Revenue, expenses, and profit summary', icon: BarChart3, color: 'emerald' },
          { title: 'Cash Flow Statement', titleAr: 'قائمة التدفق النقدي', desc: 'Operating, investing, financing activities', icon: LineChart, color: 'cyan' },
          { title: 'Trial Balance', titleAr: 'ميزان المراجعة', desc: 'All accounts with debit/credit totals', icon: BookOpen, color: 'violet' },
          { title: 'Aging Report', titleAr: 'تقرير الاستحقاق', desc: 'AR/AP aging by period', icon: Clock, color: 'orange' },
          { title: 'Tax Summary', titleAr: 'ملخص ضريبي', desc: 'Tax liabilities and obligations', icon: Shield, color: 'red' }
        ].map((report) => (
          <div key={report.title} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
            <div className={`p-3 rounded-xl bg-${report.color}-100 text-${report.color}-600 w-fit mb-3 group-hover:scale-110 transition-transform`}>
              <report.icon size={24} />
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">{report.title}</h4>
            <p className="text-xs text-slate-500 mb-3">{report.desc}</p>
            <span className="text-xs font-medium text-${report.color}-600">{report.titleAr}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Budget Placeholder
function BudgetSection() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Target size={28} className="text-teal-500" />
            Budget & Forecasting
            <span className="text-lg font-normal text-slate-500">/ الميزانية والتنبؤ</span>
          </h3>
          <p className="text-slate-500 mt-1">Plan, monitor, and analyze budget performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Upload size={16} />
            Import
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            Create Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <Calculator size={20} />
            </div>
            <span className="text-sm text-slate-500">Annual Budget</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">$2.4M</p>
          <p className="text-xs text-slate-500 mt-1">FY 2026</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Activity size={20} />
            </div>
            <span className="text-sm text-slate-500">Actual YTD</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">$1.87M</p>
          <p className="text-xs text-emerald-600 mt-1">78% of budget</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="text-sm text-slate-500">Variance</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">$530K</p>
          <p className="text-xs text-slate-500 mt-1">Under budget ✓</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
              <Percent size={20} />
            </div>
            <span className="text-sm text-slate-500">% Used</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">78%</p>
          <p className="text-xs text-slate-500 mt-1">8 months remaining</p>
        </div>
      </div>

      {/* Budget by Department Chart Placeholder */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg">
        <h3 className="text-base font-semibold text-slate-900 mb-6">Budget vs Actual by Department</h3>
        <div className="space-y-4">
          {[
            { dept: 'Sales & Marketing', deptAr: 'المبيع والتسويق', budget: 600000, actual: 585000, pct: 97 },
            { dept: 'Operations', deptAr: 'العمليات', budget: 850000, actual: 820000, pct: 96 },
            { dept: 'Technology', deptAr: 'التقنية', budget: 450000, actual: 320000, pct: 71 },
            { dept: 'HR & Admin', deptAr: 'الموارد البشرية والإدارة', budget: 350000, actual: 145000, pct: 41 },
            { dept: 'R&D', deptAr: 'البحث والتطوير', budget: 150000, actual: 0, pct: 0 }
          ].map((item) => (
            <div key={item.dept}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">{item.deptAr}</span>
                <span className="text-xs text-slate-500">{item.pct}% used</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-full flex">
                  <div 
                    className="bg-emerald-500 transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                  <div 
                    className="bg-blue-500 transition-all duration-500"
                    style={{ width: `${Math.min(item.actual / item.budget * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>${(item.actual / 1000).toFixed(0)}k / ${(item.budget / 1000).toFixed(0)}k</span>
                <span>Variance: ${((item.budget - item.actual) / 1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
export default function FinancialsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />
      case 'gl':
        return <GLSection />
      case 'ap':
        return <APSection />
      case 'ar':
        return <ARSection />
      case 'treasury':
        return <TreasurySection />
      case 'reports':
        return <ReportsSection />
      case 'budget':
        return <BudgetSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            Financial Management
            <span className="block text-xl md:text-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent mt-1">
              نظام إدارة المالية المتكامل
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 mt-2">
            Enterprise-grade financial management with multi-currency support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2 backdrop-blur-md shadow-sm">
            <Download size={16} />
            Export
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            Quick Entry
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  )
}
