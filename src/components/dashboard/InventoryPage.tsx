'use client'

import { useState } from 'react'
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Plus,
  Edit3,
  Eye,
  ArrowUpDown,
  MoreVertical,
  Warehouse,
  Truck,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

// ============ TYPES ============
interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  unitCost: number
  totalValue: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock'
  location: string
  lastUpdated: string
}

interface CategoryData {
  name: string
  count: number
  value: number
  percentage: number
  color: string
}

// ============ MOCK DATA ============
const inventoryKPIs = [
  {
    titleKey: 'inventory.totalProducts',
    value: '1,247',
    change: 5.2,
    icon: Package,
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  {
    titleKey: 'inventory.lowStockItems',
    value: '23',
    change: -8.1,
    icon: AlertTriangle,
    color: 'amber',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600'
  },
  {
    titleKey: 'inventory.totalValue',
    value: '$2.4M',
    change: 12.7,
    icon: TrendingUp,
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  }
]

const products: Product[] = [
  {
    id: 'PRD-001',
    name: 'Wireless Keyboard Pro',
    sku: 'WKP-001',
    category: 'Electronics',
    quantity: 245,
    unitCost: 45.99,
    totalValue: 11267.55,
    status: 'in-stock',
    location: 'Warehouse A - Shelf B2',
    lastUpdated: '2026-08-26'
  },
  {
    id: 'PRD-002',
    name: 'USB-C Hub 7-in-1',
    sku: 'UCH-007',
    category: 'Electronics',
    quantity: 12,
    unitCost: 29.99,
    totalValue: 359.88,
    status: 'low-stock',
    location: 'Warehouse A - Shelf C1',
    lastUpdated: '2026-08-25'
  },
  {
    id: 'PRD-003',
    name: 'Ergonomic Mouse',
    sku: 'EMG-002',
    category: 'Accessories',
    quantity: 0,
    unitCost: 34.50,
    totalValue: 0,
    status: 'out-of-stock',
    location: 'Warehouse B - Shelf A3',
    lastUpdated: '2026-08-24'
  },
  {
    id: 'PRD-004',
    name: 'Monitor Stand Adjustable',
    sku: 'MSA-003',
    category: 'Furniture',
    quantity: 89,
    unitCost: 67.00,
    totalValue: 5963.00,
    status: 'in-stock',
    location: 'Warehouse B - Shelf D1',
    lastUpdated: '2026-08-26'
  },
  {
    id: 'PRD-005',
    name: 'Webcam HD 1080p',
    sku: 'WCH-1080',
    category: 'Electronics',
    quantity: 156,
    unitCost: 54.99,
    totalValue: 8578.44,
    status: 'in-stock',
    location: 'Warehouse A - Shelf A2',
    lastUpdated: '2026-08-25'
  },
  {
    id: 'PRD-006',
    name: 'Cable Management Kit',
    sku: 'CMK-001',
    category: 'Accessories',
    quantity: 423,
    unitCost: 12.99,
    totalValue: 4946.77,
    status: 'overstock',
    location: 'Warehouse C - Shelf B1',
    lastUpdated: '2026-08-23'
  }
]

const categories: CategoryData[] = [
  { name: 'Electronics', count: 423, value: 892000, percentage: 37, color: 'bg-indigo-500' },
  { name: 'Accessories', count: 312, value: 456000, percentage: 19, color: 'bg-violet-500' },
  { name: 'Furniture', count: 189, value: 678000, percentage: 28, color: 'bg-blue-500' },
  { name: 'Packaging', count: 223, value: 234000, percentage: 10, color: 'bg-emerald-500' },
  { name: 'Other', count: 100, value: 140000, percentage: 6, color: 'bg-slate-400' }
]

// ============ SUB-COMPONENTS ============

function StatusBadge({ status }: { status: Product['status'] }) {
  const { t } = useI18n()
  
  const config = {
    'in-stock': { labelKey: 'invStatus.inStock', className: 'bg-green-100 text-green-700 border-green-200' },
    'low-stock': { labelKey: 'invStatus.lowStock', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    'out-of-stock': { labelKey: 'invStatus.outOfStock', className: 'bg-red-100 text-red-700 border-red-200' },
    'overstock': { labelKey: 'invStatus.overstock', className: 'bg-blue-100 text-blue-700 border-blue-200' }
  }

  const { labelKey, className } = config[status]

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {t(labelKey)}
    </span>
  )
}

function InventoryKPICard({ kpi }: { kpi: typeof inventoryKPIs[0] }) {
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
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1 rotate-180" />}
            {Math.abs(kpi.change)}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-sm font-medium text-slate-500 mb-1">{t(kpi.titleKey)}</p>
        <h3 className="text-3xl font-bold text-slate-900">{kpi.value}</h3>
      </div>
    </div>
  )
}

function ProductRow({ product }: { product: Product }) {
  const { t } = useI18n()
  
  return (
    <tr className="group hover:bg-white/60 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <Package size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{product.name}</p>
            <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-600">{product.category}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`font-semibold text-sm ${
          product.quantity === 0 ? 'text-red-600' :
          product.quantity < 20 ? 'text-amber-600' :
          'text-slate-900'
        }`}>
          {product.quantity.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-slate-900">${product.unitCost.toFixed(2)}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-slate-900">${product.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title={t('common.view')}>
            <Eye size={16} className="text-slate-500" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title={t('common.edit')}>
            <Edit3 size={16} className="text-slate-500" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="More">
            <MoreVertical size={16} className="text-slate-500" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ============ MAIN COMPONENT ============
export default function InventoryPage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get low stock alerts
  const lowStockAlerts = products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            {t('inventory.title').split(' ')[0]}{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              {t('inventory.title').split(' ')[1] || ''}
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            {t('inventory.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white/70 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all flex items-center gap-2 backdrop-blur-md shadow-sm">
            <RefreshCw size={16} />
            {t('inventory.sync')}
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
            <Plus size={16} />
            {t('inventory.addProduct')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {inventoryKPIs.map((kpi) => (
          <InventoryKPICard key={kpi.titleKey} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Products Table - Takes 2 columns on XL */}
        <div className="xl:col-span-2 space-y-4">
          {/* Table Header with Controls */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-lg shadow-indigo-500/4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Package size={20} className="text-indigo-500" />
                {t('inventory.products')} ({filteredProducts.length})
              </h3>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex bg-slate-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                  >
                    <Warehouse size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('inventory.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="all">{t('filter.allStatus')}</option>
                <option value="in-stock">{t('invStatus.inStock')}</option>
                <option value="low-stock">{t('invStatus.lowStock')}</option>
                <option value="out-of-stock">{t('invStatus.outOfStock')}</option>
                <option value="overstock">{t('invStatus.overstock')}</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl shadow-lg shadow-indigo-500/4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {t('table.product')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                      {t('table.category')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {t('table.quantity')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                      {t('table.cost')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                      {t('table.value')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {t('table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Package size={48} className="mx-auto mb-3 text-slate-300" />
                <p>{t('inventory.noProducts')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Takes 1 column on XL */}
        <div className="space-y-4">
          {/* Low Stock Alerts */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-500" />
              {t('inventory.lowStockAlerts')} ({lowStockAlerts.length})
            </h3>

            <div className="space-y-3">
              {lowStockAlerts.map((product) => (
                <div key={product.id} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <div className="p-2 bg-amber-100 rounded-lg mt-0.5">
                    <AlertTriangle size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">{product.name}</p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      {product.quantity === 0 ? t('inventory.outOfStockMsg') : t('inventory.onlyLeft').replace('{count}', String(product.quantity))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 pt-3 border-t border-slate-100 text-center text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
              {t('inventory.viewAllAlerts')}
            </button>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-violet-500" />
              {t('inventory.categories')}
            </h3>

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{category.name}</span>
                    <span className="text-xs text-slate-500">{category.count} {t('inventory.items')} • ${(category.value / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${category.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Locations */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-xl">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Warehouse size={18} />
              {t('inventory.warehouses')}
            </h4>
            
            <div className="space-y-3">
              {['Warehouse A', 'Warehouse B', 'Warehouse C'].map((warehouse, i) => (
                <div key={warehouse} className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <span className="text-sm font-medium">{warehouse}</span>
                  </div>
                  <span className="text-sm bg-white/30 px-2 py-0.5 rounded-full">{[523, 398, 326][i]} {t('inventory.items')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
