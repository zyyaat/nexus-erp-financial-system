'use client'

import { useState, useEffect } from 'react'
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
  MoreVertical,
  Warehouse,
  Truck,
  BarChart3,
  RefreshCw,
  // New icons for advanced features
  MapPin,
  QrCode,
  Radio,
  Brain,
  Hash,
  Clock,
  Activity,
  Zap,
  Shield,
  ArrowRightLeft,
  ScanLine,
  Layers,
  Target,
  LineChart,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff
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
  // New fields for advanced features
  batchNumber?: string
  serialNumber?: string
  expiryDate?: string
  warehouse?: string
  zone?: string
  bin?: string
}

interface CategoryData {
  name: string
  count: number
  value: number
  percentage: number
  color: string
}

interface WarehouseLocation {
  id: string
  name: string
  totalItems: number
  capacity: number
  status: 'active' | 'maintenance' | 'full'
}

interface ForecastData {
  month: string
  predicted: number
  actual?: number
  confidence: number
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

// Enhanced products with advanced tracking data
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
    lastUpdated: '2026-08-26',
    batchNumber: 'BTH-2026-0845',
    serialNumber: 'SN-WKP-001-245',
    warehouse: 'Warehouse A',
    zone: 'Zone B',
    bin: 'B2'
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
    lastUpdated: '2026-08-25',
    batchNumber: 'BTH-2026-0789',
    expiryDate: '2027-12-31',
    warehouse: 'Warehouse A',
    zone: 'Zone C',
    bin: 'C1'
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
    lastUpdated: '2026-08-24',
    warehouse: 'Warehouse B',
    zone: 'Zone A',
    bin: 'A3'
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
    lastUpdated: '2026-08-26',
    batchNumber: 'BTH-2026-0901',
    warehouse: 'Warehouse B',
    zone: 'Zone D',
    bin: 'D1'
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
    lastUpdated: '2026-08-25',
    batchNumber: 'BTH-2026-0912',
    serialNumber: 'SN-WCH-156',
    warehouse: 'Warehouse A',
    zone: 'Zone A',
    bin: 'A2'
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
    lastUpdated: '2026-08-23',
    batchNumber: 'BTH-2026-0678',
    warehouse: 'Warehouse C',
    zone: 'Zone B',
    bin: 'B1'
  }
]

const categories: CategoryData[] = [
  { name: 'Electronics', count: 423, value: 892000, percentage: 37, color: 'bg-indigo-500' },
  { name: 'Accessories', count: 312, value: 456000, percentage: 19, color: 'bg-violet-500' },
  { name: 'Furniture', count: 189, value: 678000, percentage: 28, color: 'bg-blue-500' },
  { name: 'Packaging', count: 223, value: 234000, percentage: 10, color: 'bg-emerald-500' },
  { name: 'Other', count: 100, value: 140000, percentage: 6, color: 'bg-slate-400' }
]

// Warehouse locations data
const warehouseLocations: WarehouseLocation[] = [
  { id: 'WH-A', name: 'Warehouse A', totalItems: 523, capacity: 800, status: 'active' },
  { id: 'WH-B', name: 'Warehouse B', totalItems: 398, capacity: 600, status: 'active' },
  { id: 'WH-C', name: 'Warehouse C', totalItems: 326, capacity: 400, status: 'full' }
]

// AI Forecast data
const forecastData: ForecastData[] = [
  { month: 'Sep', predicted: 145, actual: 142, confidence: 92 },
  { month: 'Oct', predicted: 168, actual: null, confidence: 88 },
  { month: 'Nov', predicted: 195, actual: null, confidence: 85 },
  { month: 'Dec', predicted: 230, actual: null, confidence: 82 },
  { month: 'Jan', predicted: 180, actual: null, confidence: 78 },
  { month: 'Feb', predicted: 155, actual: null, confidence: 75 }
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
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex flex-col gap-1">
          {product.batchNumber && (
            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">#{product.batchNumber}</span>
          )}
          {product.warehouse && (
            <span className="text-xs text-slate-500"><MapPin size={10} className="inline mr-1" />{product.warehouse}</span>
          )}
        </div>
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

// NEW: Multi-Location Tracker Component
function MultiLocationTracker() {
  const { t } = useI18n()
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all')
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(new Date())

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setLastSync(new Date())
    }, 2000)
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <MapPin size={18} className="text-emerald-500" />
          {t('inv.multiLocation')}
        </h3>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isSyncing 
              ? 'bg-amber-100 text-amber-600 animate-pulse' 
              : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
          }`}
        >
          {isSyncing ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <Wifi size={14} />
              {t('inv.realTimeSync')}
            </>
          )}
        </button>
      </div>

      {/* Warehouse Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedWarehouse('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            selectedWarehouse === 'all'
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('inv.allLocations')}
        </button>
        {warehouseLocations.map((wh) => (
          <button
            key={wh.id}
            onClick={() => setSelectedWarehouse(wh.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedWarehouse === wh.id
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Warehouse size={14} />
            {wh.name}
            <span className={`w-2 h-2 rounded-full ${
              wh.status === 'active' ? 'bg-green-500' :
              wh.status === 'full' ? 'bg-red-500' : 'bg-amber-500'
            }`} />
          </button>
        ))}
      </div>

      {/* Location Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {warehouseLocations.map((wh) => (
          <div key={wh.id} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 text-sm">{wh.name}</span>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t('inventory.items')}</span>
                <span className="font-medium text-slate-900">{wh.totalItems}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${(wh.totalItems / wh.capacity) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{Math.round((wh.totalItems / wh.capacity) * 100)}% full</span>
                <span>{wh.capacity} capacity</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Last Sync Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>{t('inv.lastUpdated')}: {lastSync.toLocaleTimeString()}</span>
        <span className="flex items-center gap-1">
          <Wifi size={12} className="text-green-500" />
          Connected
        </span>
      </div>
    </div>
  )
}

// NEW: Barcode/RFID Scanner Component
function BarcodeScanner() {
  const { t } = useI18n()
  const [scanningMode, setScanningMode] = useState<'barcode' | 'rfid'>('barcode')
  const [lastScan, setLastScan] = useState<string>('')
  const [scanHistory, setScanHistory] = useState<string[]>([])

  const simulateScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    setLastScan(randomProduct.sku)
    setScanHistory(prev => [randomProduct.sku, ...prev.slice(0, 4)])
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
        <ScanLine size={18} className="text-violet-500" />
        {t('inv.barcodeScan')} / {t('inv.rfidScan')}
      </h3>

      {/* Mode Toggle */}
      <div className="flex bg-slate-100 rounded-lg p-1 mb-4">
        <button
          onClick={() => setScanningMode('barcode')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            scanningMode === 'barcode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
          }`}
        >
          <QrCode size={16} />
          Barcode
        </button>
        <button
          onClick={() => setScanningMode('rfid')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
            scanningMode === 'rfid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Radio size={16} />
          RFID
        </button>
      </div>

      {/* Scanner Area */}
      <div 
        onClick={simulateScan}
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 mb-4 cursor-pointer hover:from-slate-800 hover:to-slate-700 transition-all group"
      >
        <div className="absolute inset-4 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ScanLine size={48} className="mx-auto mb-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            <p className="text-slate-300 text-sm">{t('inv.scanItem')}</p>
            <p className="text-slate-500 text-xs mt-1">Click to simulate scan</p>
          </div>
        </div>
        
        {/* Animated scan line */}
        <div className="absolute left-4 right-4 h-0.5 bg-indigo-500 opacity-50 animate-pulse" style={{ top: '50%' }} />
      </div>

      {/* Last Result */}
      {lastScan && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-xs text-indigo-600 font-medium mb-1">{t('inv.scanResult')}</p>
          <p className="font-mono text-lg font-bold text-indigo-900">{lastScan}</p>
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium">Recent Scans</p>
          {scanHistory.map((sku, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={14} className="text-green-500" />
              <code className="font-mono text-slate-700">{sku}</code>
              <span className="text-xs text-slate-400 ml-auto">{i === 0 ? 'Just now' : `${i + 1}s ago`}</span>
            </div>
          ))}
        </div>
      )}

      {/* Generate Barcode Button */}
      <button className="w-full mt-4 py-2.5 bg-violet-100 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-200 transition-all flex items-center justify-center gap-2">
        <QrCode size={16} />
        {t('inv.generateBarcode')}
      </button>
    </div>
  )
}

// NEW: AI Forecast Dashboard Component
function AIForecastDashboard() {
  const { t } = useI18n()

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Brain size={18} className="text-purple-500" />
          {t('inv.aiForecast')}
        </h3>
        <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          <Zap size={12} />
          AI Powered
        </span>
      </div>

      {/* Confidence Score */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">{t('inv.confidenceLevel')}</span>
          <span className="text-lg font-bold text-purple-600">87%</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full" style={{ width: '87%' }} />
        </div>
      </div>

      {/* Forecast Chart (Simplified) */}
      <div className="space-y-3 mb-4">
        {forecastData.map((data, i) => (
          <div key={data.month} className="flex items-center gap-3">
            <span className="w-8 text-xs font-medium text-slate-500">{data.month}</span>
            <div className="flex-1 relative">
              <div className="h-6 bg-slate-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded flex items-center justify-end pr-2"
                  style={{ width: `${(data.predicted / 250) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">{data.predicted}</span>
                </div>
              </div>
              {data.actual && (
                <div 
                  className="absolute top-0 h-6 bg-green-500/30 rounded"
                  style={{ width: `${(data.actual / 250) * 100}%` }}
                />
              )}
            </div>
            <span className="text-xs text-slate-400">{data.confidence}%</span>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-2 text-sm">
          <TrendingUp size={16} className="text-green-500 mt-0.5" />
          <div>
            <p className="font-medium text-slate-900">{t('inv.seasonalTrend')}: +23%</p>
            <p className="text-xs text-slate-500">Expected peak in December</p>
          </div>
        </div>
        <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all flex items-center justify-center gap-2 mt-3">
          <Target size={16} />
          {t('inv.reorderSuggestion')}
        </button>
      </div>
    </div>
  )
}

// NEW: Batch & Serial Tracking Component
function BatchSerialTracker() {
  const { t } = useI18n()

  const trackedProducts = products.filter(p => p.batchNumber || p.serialNumber)

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-5 shadow-lg shadow-indigo-500/4">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
        <Hash size={18} className="text-amber-500" />
        {t('inv.traceability')}
      </h3>

      <div className="space-y-3">
        {trackedProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-slate-900">{product.name}</span>
              <StatusBadge status={product.status} />
            </div>
            
            <div className="space-y-1 text-xs">
              {product.batchNumber && (
                <div className="flex items-center gap-2">
                  <Layers size={12} className="text-amber-600" />
                  <span className="text-slate-500">{t('inv.batchNumber')}:</span>
                  <code className="font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">{product.batchNumber}</code>
                </div>
              )}
              
              {product.serialNumber && (
                <div className="flex items-center gap-2">
                  <Hash size={12} className="text-amber-600" />
                  <span className="text-slate-500">{t('inv.serialNumber')}:</span>
                  <code className="font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">{product.serialNumber}</code>
                </div>
              )}

              {product.expiryDate && (
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-red-500" />
                  <span className="text-slate-500">{t('inv.expiryDate')}:</span>
                  <span className="text-red-600 font-medium">{product.expiryDate}</span>
                </div>
              )}

              {product.zone && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-slate-500">{t('inv.binLocation')}:</span>
                  <span className="text-slate-700">{product.warehouse} → {product.zone} → {product.bin}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-all flex items-center justify-center gap-2">
        <Shield size={16} />
        View Full Traceability Report
      </button>
    </div>
  )
}

// NEW: Quick Actions Toolbar
function QuickActionsToolbar() {
  const { t } = useI18n()
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const actions = [
    { id: 'transfer', icon: ArrowRightLeft, label: t('inv.transferStock'), color: 'blue' },
    { id: 'cyclecount', icon: Activity, label: t('inv.cycleCount'), color: 'green' },
    { id: 'picklist', icon: Target, label: t('inv.pickList'), color: 'purple' },
    { id: 'pack', icon: Package, label: t('inv.packOrder'), color: 'orange' }
  ]

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-lg shadow-indigo-500/4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => setActiveAction(activeAction === action.id ? null : action.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeAction === action.id
                ? `bg-${action.color}-500 text-white`
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <action.icon size={16} />
            {action.label}
          </button>
        ))}
      </div>
      
      {activeAction && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">
            {actions.find(a => a.id === activeAction)?.label} panel is now active. 
            Select items from the table to proceed.
          </p>
        </div>
      )}
    </div>
  )
}

// ============ MAIN COMPONENT ============
export default function InventoryPage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(true)

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

      {/* Quick Actions Toolbar */}
      <QuickActionsToolbar />

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
                
                {/* Toggle Advanced Features */}
                <button
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className={`p-1.5 rounded-md transition-colors ${showAdvancedFeatures ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}
                  title="Toggle advanced features"
                >
                  <Layers size={16} />
                </button>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                      Tracking
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

          {/* ADVANCED FEATURES - Conditionally Rendered */}
          {showAdvancedFeatures && (
            <>
              {/* Multi-Location Tracker */}
              <MultiLocationTracker />

              {/* AI Forecast Dashboard */}
              <AIForecastDashboard />

              {/* Barcode Scanner */}
              <BarcodeScanner />

              {/* Batch & Serial Tracking */}
              <BatchSerialTracker />
            </>
          )}

          {/* Warehouse Locations (Original - shown when advanced features off) */}
          {!showAdvancedFeatures && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-xl">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Warehouse size={18} />
                {t('inventory.warehouses')}
              </h4>
              
              <div className="space-y-3">
                {warehouseLocations.map((warehouse, i) => (
                  <div key={warehouse.id} className="flex items-center justify-between p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      <span className="text-sm font-medium">{warehouse.name}</span>
                    </div>
                    <span className="text-sm bg-white/30 px-2 py-0.5 rounded-full">{warehouse.totalItems} {t('inventory.items')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
