'use client'

import { useState } from 'react'
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
  Clock
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
}

interface Invoice {
  id: string
  client: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'draft'
  issuedDate: string
  dueDate: string
}

// ============ MOCK DATA ============
const financialKPIs = [
  {
    titleKey: 'financials.totalRevenue',
    value: '$847,290',
    change: 15.3,
    icon: TrendingUp,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    titleKey: 'financials.totalExpenses',
    value: '$523,180',
    change: -4.2,
    icon: TrendingDown,
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600'
  },
  {
    titleKey: 'financials.netProfit',
    value: '$324,110',
    change: 28.7,
    icon: DollarSign,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    titleKey: 'financials.pendingInvoices',
    value: '$128,450',
    change: -12.1,
    icon: FileText,
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  }
]

const recentTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    type: 'income',
    description: 'Payment received - TechCorp Industries',
    amount: 45000,
    category: 'Sales',
    date: '2026-08-26',
    status: 'completed',
    invoice: 'INV-2026-089'
  },
  {
    id: 'TXN-002',
    type: 'expense',
    description: 'Office rent payment - August',
    amount: 8500,
    category: 'Operations',
    date: '2026-08-25',
    status: 'completed'
  },
  {
    id: 'TXN-003',
    type: 'income',
    description: 'Product sales - Online Store',
    amount: 12350,
    category: 'E-commerce',
    date: '2026-08-25',
    status: 'completed',
    invoice: 'INV-2026-090'
  },
  {
    id: 'TXN-004',
    type: 'expense',
    description: 'Software licenses renewal',
    amount: 2400,
    category: 'Technology',
    date: '2026-08-24',
    status: 'pending'
  },
  {
    id: 'TXN-005',
    type: 'income',
    description: 'Consulting services - Acme Corp',
    amount: 18500,
    category: 'Services',
    date: '2026-08-24',
    status: 'pending',
    invoice: 'INV-2026-091'
  },
  {
    id: 'TXN-006',
    type: 'expense',
    description: 'Marketing campaign Q3',
    amount: 15000,
    category: 'Marketing',
    date: '2026-08-23',
    status: 'completed'
  }
]

const invoices: Invoice[] = [
  { id: 'INV-2026-089', client: 'TechCorp Industries', amount: 45000, status: 'paid', issuedDate: '2026-08-20', dueDate: '2026-09-20' },
  { id: 'INV-2026-090', client: 'Online Store Customer', amount: 12350, status: 'paid', issuedDate: '2026-08-22', dueDate: '2026-09-22' },
  { id: 'INV-2026-091', client: 'Acme Corporation', amount: 18500, status: 'pending', issuedDate: '2026-08-24', dueDate: '2026-09-24' },
  { id: 'INV-2026-092', client: 'Global Manufacturing', amount: 67300, status: 'overdue', issuedDate: '2026-07-15', dueDate: '2026-08-15' },
  { id: 'INV-2026-093', client: 'SupplyChain Ltd', amount: 28900, status: 'draft', issuedDate: '2026-08-26', dueDate: '2026-09-26' }
]

const expenseBreakdown = [
  { name: 'Operations', amount: 198500, percentage: 38, color: 'bg-indigo-500' },
  { name: 'Salaries', amount: 156200, percentage: 30, color: 'bg-violet-500' },
  { name: 'Marketing', amount: 78400, percentage: 15, color: 'bg-blue-500' },
  { name: 'Technology', amount: 52080, percentage: 10, color: 'bg-emerald-500' },
  { name: 'Other', amount: 40000, percentage: 7, color: 'bg-slate-400' }
]

// ============ SUB-COMPONENTS ============

function TransactionTypeBadge({ type }: { type: Transaction['type'] }) {
  const { t } = useI18n()
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      type === 'income' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      {type === 'income' ? <ArrowUpLeft size={12} /> : <ArrowDownRight size={12} />}
      {type === 'income' ? t('txn.type.income') : t('txn.type.expense')}
    </span>
  )
}

function TransactionStatusBadge({ status }: { status: Transaction['status'] }) {
  const { t } = useI18n()
  
  const config = {
    completed: { icon: CheckCircle2, labelKey: 'txnStatus.completed', className: 'text-green-600 bg-green-100' },
    pending: { icon: Clock, labelKey: 'txnStatus.pending', className: 'text-amber-600 bg-amber-100' },
    failed: { icon: AlertCircle, labelKey: 'txnStatus.failed', className: 'text-red-600 bg-red-100' }
  }

  const { icon: Icon, labelKey, className } = config[status]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon size={12} />
      {t(labelKey)}
    </span>
  )
}

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const { t } = useI18n()
  
  const config = {
    paid: { labelKey: 'invStatus.paid', className: 'bg-green-100 text-green-700 border-green-200' },
    pending: { labelKey: 'invStatus.pending', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    overdue: { labelKey: 'invStatus.overdue', className: 'bg-red-100 text-red-700 border-red-200' },
    draft: { labelKey: 'invStatus.draft', className: 'bg-slate-100 text-slate-600 border-slate-200' }
  }

  const { labelKey, className } = config[status]
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {t(labelKey)}
    </span>
  )
}

function FinancialKPICard({ kpi }: { kpi: typeof financialKPIs[0] }) {
  const { t } = useI18n()
  const Icon = kpi.icon
  const isPositive = kpi.change >= 0

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-lg shadow-indigo-500/4">
      <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bgColor} rounded-full blur-2xl -mr-10 -mt-10 opacity-60 pointer-events-none`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 ${kpi.bgColor} rounded-xl ${kpi.textColor}`}>
          <Icon size={24} />
        </div>
        {kpi.change !== 0 && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(kpi.change)}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 mb-1">{t(kpi.titleKey)}</p>
        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============
export default function FinancialsPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions')

  // Calculate totals
  const totalIncome = recentTransactions.filter(tr => tr.type === 'income').reduce((sum, tr) => sum + tr.amount, 0)
  const totalExpenses = recentTransactions.filter(tr => tr.type === 'expense').reduce((sum, tr) => sum + tr.amount, 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            {t('financials.title').split(' ')[0]}{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              {t('financials.title').split(' ')[1] || ''}
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            {t('financials.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2 backdrop-blur-md shadow-sm">
            <Download size={16} />
            {t('financials.exportReport')}
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            {t('financials.createInvoice')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {financialKPIs.map((kpi) => (
          <FinancialKPICard key={kpi.titleKey} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transactions / Invoices Section - Takes 2 columns on XL */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-2 shadow-lg shadow-indigo-500/4 flex gap-2">
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'transactions' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Receipt size={16} className="inline mr-2" />
              {t('tab.transactions')}
            </button>
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'invoices' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText size={16} className="inline mr-2" />
              {t('tab.invoices')} ({invoices.length})
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4 min-h-[500px]">
            {activeTab === 'transactions' ? (
              /* Transactions List */
              <div className="space-y-4">
                {/* Summary Bar */}
                <div className="flex items-center gap-6 pb-4 mb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-600">{t('txn.type.income')}: <strong className="text-green-700">${totalIncome.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-600">{t('txn.type.expense')}: <strong className="text-red-700">${totalExpenses.toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Transaction Items */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors group">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-xl ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'income' ? <ArrowUpLeft size={18} className="text-green-600" /> : <ArrowDownRight size={18} className="text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <TransactionStatusBadge status={transaction.status} />
                            <span className="text-xs text-slate-400">{transaction.date}</span>
                            {transaction.invoice && (
                              <span className="text-xs text-indigo-500 font-mono">{transaction.invoice}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Invoices List */
              <div className="space-y-4">
                {/* Invoices Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 uppercase">
                  <div className="col-span-3">{t('table.invoice')}</div>
                  <div className="col-span-3">{t('table.client')}</div>
                  <div className="col-span-2 text-right">{t('table.amount')}</div>
                  <div className="col-span-2 text-center">{t('table.status')}</div>
                  <div className="col-span-2 text-right">{t('table.dueDate')}</div>
                </div>

                {/* Invoice Items */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors items-center group">
                      <div className="md:col-span-3 flex items-center gap-3">
                        <FileText size={18} className="text-indigo-500 flex-shrink-0" />
                        <span className="font-mono text-sm font-medium text-slate-900">{invoice.id}</span>
                      </div>
                      <div className="md:col-span-3">
                        <span className="text-sm text-slate-600 truncate block">{invoice.client}</span>
                      </div>
                      <div className="md:col-span-2 text-right">
                        <span className="font-bold text-slate-900">${invoice.amount.toLocaleString()}</span>
                      </div>
                      <div className="md:col-span-2 text-center">
                        <InvoiceStatusBadge status={invoice.status} />
                      </div>
                      <div className="md:col-span-2 text-right">
                        <span className="text-sm text-slate-500">{invoice.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Takes 1 column on XL */}
        <div className="space-y-4">
          {/* Expense Breakdown */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <PieChart size={18} className="text-violet-500" />
              {t('financials.expenseBreakdown')}
            </h3>

            <div className="space-y-4">
              {expenseBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
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
                <span className="text-sm font-semibold text-slate-700">{t('financials.totalExpensesLabel')}</span>
                <span className="text-lg font-bold text-slate-900">$523,180</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 text-white shadow-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wallet size={18} />
              {t('financials.cashFlowSummary')}
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm">{t('time.thisMonth')}</span>
                <span className="text-lg font-bold">$124,110</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <span className="text-sm">{t('time.lastMonth')}</span>
                <span className="text-lg font-bold">$98,430</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg backdrop-blur-sm mt-2">
                <span className="text-sm font-medium">{t('time.growth')}</span>
                <span className="text-lg font-bold flex items-center gap-1">
                  <TrendingUp size={18} />
                  +26.1%
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-amber-500" />
              {t('financials.upcomingPayments')}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <div>
                  <p className="text-sm font-medium text-slate-900">Office Rent</p>
                  <p className="text-xs text-amber-700">{t('time.dueInDays').replace('{days}', '5')}</p>
                </div>
                <span className="font-bold text-amber-700">$8,500</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Software Licenses</p>
                  <p className="text-xs text-slate-500">{t('time.dueInDays').replace('{days}', '12')}</p>
                </div>
                <span className="font-bold text-slate-900">$2,400</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
