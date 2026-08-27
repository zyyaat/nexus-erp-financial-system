'use client'

/**
 * Performance & Promotion Management Page
 * 
 * Features:
 * - Performance reviews tracking
 * - 360-degree feedback support
 * - Promotion requests workflow
 * - Goal management (OKRs)
 * - Rating distribution analytics
 * - Career pathing visualization
 */

import React, { useState, useMemo } from 'react'
import {
  Award,
  TrendingUp,
  Star,
  Target,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react'
import { mockEmployees } from '@/lib/data/mockEmployees'
import { mockPerformanceReviews, mockPromotionRequests, mockHRMetrics } from '@/lib/data/mockHRISData'
import { DEPARTMENTS, PERFORMANCE_RATINGS } from '@/lib/types/employee'
import type { 
  EmployeeTableRow, 
  PerformanceReview, 
  PromotionRequest, 
  PerformanceRating,
  GoalStatus 
} from '@/lib/types/employee'

// ============ RATING BADGE ============

function RatingBadge({ rating }: { rating: PerformanceRating }) {
  const config = PERFORMANCE_RATINGS[rating]
  
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      {rating === 'exceptional' && <Star className="w-3 h-3" />}
      {rating === 'exceeds-expectations' && <TrendingUp className="w-3 h-3" />}
      {rating === 'meets-expectations' && <CheckCircle className="w-3 h-3" />}
      {rating === 'needs-improvement' && <AlertCircle className="w-3 h-3" />}
      {rating === 'unsatisfactory' && <ThumbsDown className="w-3 h-3" />}
      {config.labelAr}
    </span>
  )
}

// ============ SCORE CIRCLE ============

function ScoreCircle({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  
  // Color based on score
  const getColor = () => {
    if (score >= 90) return '#8B5CF6' // Purple for exceptional
    if (score >= 75) return '#3B82F6' // Blue for exceeds
    if (score >= 60) return '#10B981' // Green for meets
    if (score >= 40) return '#F59E0B' // Yellow for needs improvement
    return '#EF4444' // Red for unsatisfactory
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className={`absolute text-lg font-bold`} style={{ color: getColor() }}>
        {score}
      </span>
    </div>
  )
}

// ============ PROMOTION STATUS BADGE ============

function PromotionStatusBadge({ status }: { status: PromotionRequest['status'] }) {
  const configs = {
    proposed: { label: 'مقترح', color: 'bg-gray-100 text-gray-700', icon: <Plus className="w-3 h-3" /> },
    'under-review': { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3 h-3" /> },
    approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    effective: { label: 'ساري', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" /> },
    rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-700', icon: <ThumbsDown className="w-3 h-3" /> },
    deferred: { label: 'مؤجل', color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-3 h-3" /> },
  }
  
  const config = configs[status]
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  )
}

// ============ GOAL PROGRESS BAR ============

function GoalProgressBar({ status, progress }: { status: GoalStatus; progress: number }) {
  const getColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'on-track': return 'bg-blue-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'at-risk': return 'bg-orange-500'
      case 'overdue': return 'red-500'
      default: return 'bg-gray-400'
    }
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full rounded-full transition-all ${getColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-left">{progress}%</span>
    </div>
  )
}

// ============ REVIEW CARD COMPONENT ============

interface ReviewCardProps {
  review: PerformanceReview
  employee?: EmployeeTableRow
  onView?: () => void
}

function ReviewCard({ review, employee, onView }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {employee && (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {employee.fullName.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{employee?.fullName || review.employeeId}</h3>
            <p className="text-sm text-gray-500">{employee?.jobTitle || 'موظف'}</p>
          </div>
        </div>
        
        <ScoreCircle score={review.overallScore} size={70} />
      </div>

      {/* Rating Badge */}
      <div className="mb-4">
        <RatingBadge rating={review.rating} />
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-xs text-gray-500">KPIs</p>
          <p className="text-lg font-bold text-blue-600">{review.kpiScore || '-'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">الكفاءات</p>
          <p className="text-lg font-bold text-purple-600">{review.competencyScore || '-'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">الأهداف</p>
          <p className="text-lg font-bold text-green-600">{review.goalsScore || '-'}</p>
        </div>
      </div>

      {/* Strengths Preview */}
      {review.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-700 mb-1">نقاط القوة:</p>
          <div className="flex flex-wrap gap-1.5">
            {review.strengths.slice(0, 2).map((strength, i) => (
              <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                {strength}
              </span>
            ))}
            {review.strengths.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                +{review.strengths.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Manager Comment Preview */}
      {review.managerComments && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 italic line-clamp-2">
            &ldquo;{review.managerComments}&rdquo;
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          {review.completedAt?.toLocaleDateString('ar-EG') || 'غير مكتمل'}
        </div>
        
        <div className="flex items-center gap-2">
          {review.recommendedForPromotion && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              <Zap className="w-3 h-3" />
              يُوصى بالترقية
            </span>
          )}
          
          {onView && (
            <button
              onClick={onView}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              عرض التقييم
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ PROMOTION CARD COMPONENT ============

interface PromotionCardProps {
  promotion: PromotionRequest
  employee?: EmployeeTableRow
  onView?: () => void
}

function PromotionCard({ promotion, employee, onView }: PromotionCardProps) {
  const approvalProgress = (promotion.currentStep / promotion.totalSteps) * 100
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PromotionStatusBadge status={promotion.status} />
            </div>
            <h3 className="font-bold text-lg">{employee?.fullName || promotion.employeeId}</h3>
            <p className="text-purple-200 text-sm">{promotion.currentTitle} → {promotion.proposedTitle}</p>
          </div>
          
          <div className="text-left">
            <p className="text-2xl font-bold">+{promotion.salaryIncreasePercent}%</p>
            <p className="text-xs text-purple-200">زيادة الراتب</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Salary Change */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-xs text-red-600 mb-1">الراتب الحالي</p>
            <p className="text-lg font-bold text-red-700">{promotion.currentSalary.toLocaleString()} ج.م</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-600 mb-1">الراتب المقترح</p>
            <p className="text-lg font-bold text-green-700">{promotion.proposedSalary.toLocaleString()} ج.م</p>
          </div>
        </div>

        {/* Approval Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">سير الموافقات</span>
            <span className="text-sm text-gray-500">{promotion.currentStep}/{promotion.totalSteps}</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
              style={{ width: `${approvalProgress}%` }}
            />
          </div>
          
          {/* Approval Steps */}
          <div className="mt-3 space-y-2">
            {promotion.approvals.map((approval, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {approval.status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : approval.status === 'rejected' ? (
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
                <span className={
                  approval.status === 'approved' ? 'text-green-700' :
                  approval.status === 'rejected' ? 'text-red-700' :
                  'text-gray-500'
                }>
                  موافقة {approval.approverRole === 'manager' ? 'المدير' :
                          approval.approverRole === 'hr' ? 'الموارد البشرية' :
                          approval.approverRole === 'finance' ? 'المالية' :
                          'الإدارة التنفيذية'}
                </span>
                {approval.comment && (
                  <span className="text-gray-400 truncate">- {approval.comment}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reasons */}
        {promotion.reasons.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">أسباب الترقية:</p>
            <ul className="space-y-1">
              {promotion.reasons.slice(0, 2).map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <ChevronRight className="w-3 h-3 mt-0.5 text-purple-500 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onView}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          عرض تفاصيل الطلب
        </button>
      </div>
    </div>
  )
}

// ============ RATING DISTRIBUTION CHART ============

function RatingDistributionChart() {
  const metrics = mockHRMetrics
  
  const distribution = [
    { label: 'استثنائي', count: 2, maxCount: 12, color: '#8B5CF6' },
    { label: 'يتجاوز التوقعات', count: 4, maxCount: 12, color: '#3B82F6' },
    { label: 'يلبي التوقعات', count: 12, maxCount: 12, color: '#10B981' },
    { label: 'يحتاج تحسين', count: 4, maxCount: 12, color: '#F59E0B' },
    { label: 'غير مرضي', count: 2, maxCount: 12, color: '#EF4444' },
  ]
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        توزيع التقييمات
      </h3>
      
      <div className="space-y-4">
        {distribution.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-semibold text-gray-900">{item.count} موظف</span>
            </div>
            <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="absolute top-0 right-0 h-full rounded-lg transition-all flex items-center justify-end px-2"
                style={{ 
                  width: `${(item.count / item.maxCount) * 100}%`,
                  backgroundColor: item.color 
                }}
              >
                <span className="text-xs font-medium text-white">
                  {Math.round((item.count / 24) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">{metrics.highPerformersCount}</p>
          <p className="text-xs text-gray-500">متميزون</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-700">{metrics.averagePerformanceScore}</p>
          <p className="text-xs text-gray-500">متوسط التقييم</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-500">{metrics.lowPerformersCount}</p>
          <p className="text-xs text-gray-500">يحتاجون تطوير</p>
        </div>
      </div>
    </div>
  )
}

// ============ MAIN PERFORMANCE PAGE ============

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'promotions'>('reviews')
  const [searchQuery, setSearchQuery] = useState('')
  const [ratingFilter, setRatingFilter] = useState<PerformanceRating | 'all'>('all')

  const metrics = mockHRMetrics

  // Combine reviews with employee data
  const reviewsWithEmployees = useMemo(() => {
    return mockPerformanceReviews.map((review) => ({
      review,
      employee: mockEmployees.find(emp => emp.id === review.employeeId),
    }))
  }, [])

  // Combine promotions with employee data
  const promotionsWithEmployees = useMemo(() => {
    return mockPromotionRequests.map((promotion) => ({
      promotion,
      employee: mockEmployees.find(emp => emp.id === promotion.employeeId),
    }))
  }, [])

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviewsWithEmployees.filter(({ review, employee }) => {
      if (searchQuery && employee) {
        const query = searchQuery.toLowerCase()
        if (!employee.fullName.toLowerCase().includes(query)) return false
      }
      
      if (ratingFilter !== 'all' && review.rating !== ratingFilter) return false
      
      return true
    })
  }, [reviewsWithEmployees, searchQuery, ratingFilter])

  // Summary stats
  const summaryStats = [
    {
      label: 'متوسط الأداء',
      value: metrics.averagePerformanceScore,
      suffix: '/100',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      label: 'المتميزون',
      value: metrics.highPerformersCount,
      suffix: 'موظف',
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
    {
      label: 'ترقيات هذا الفترة',
      value: metrics.promotionsThisPeriod,
      suffix: 'ترقية',
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      label: 'طلبات معلقة',
      value: metrics.pendingPromotions,
      suffix: 'طلب',
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تقييم الأداء والترقيات</h1>
            <p className="text-gray-500 mt-1">متابعة تقييمات الموظفين وطلبات الترقية</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              تقييم جديد
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              تصدير التقارير
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.suffix}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/60">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                التقييمات ({mockPerformanceReviews.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('promotions')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'promotions'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                الترقيات ({mockPromotionRequests.length})
              </div>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث باسم الموظف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {activeTab === 'reviews' && (
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value as PerformanceRating | 'all')}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">كل التقييمات</option>
                  {Object.entries(PERFORMANCE_RATINGS).map(([key, config]) => (
                    <option key={key} value={key}>{config.labelAr}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Content Area */}
          {activeTab === 'reviews' ? (
            /* Reviews Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map(({ review, employee }, index) => (
                <ReviewCard
                  key={index}
                  review={review}
                  employee={employee}
                  onView={() => console.log('View review:', review.id)}
                />
              ))}
              
              {filteredReviews.length === 0 && (
                <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">لا توجد نتائج</p>
                  <p className="text-gray-400 text-sm mt-1">جرب تغيير معايير البحث أو الفلترة</p>
                </div>
              )}
            </div>
          ) : (
            /* Promotions List */
            <div className="space-y-4">
              {promotionsWithEmployees.map(({ promotion, employee }, index) => (
                <PromotionCard
                  key={index}
                  promotion={promotion}
                  employee={employee}
                  onView={() => console.log('View promotion:', promotion.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Rating Distribution */}
          <RatingDistributionChart />

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">نسبة تحقيق الأهداف</span>
                </div>
                <span className="font-semibold text-blue-600">78%</span>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">تقييمات مكتملة</span>
                </div>
                <span className="font-semibold text-green-600">
                  {mockPerformanceReviews.filter(r => r.status === 'completed').length}/{mockPerformanceReviews.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">موصى بهم للترقية</span>
                </div>
                <span className="font-semibold text-purple-600">
                  {mockPerformanceReviews.filter(r => r.recommendedForPromotion).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">يحتاجون متابعة</span>
                </div>
                <span className="font-semibold text-orange-600">
                  {mockPerformanceReviews.filter(r => r.rating === 'needs-improvement' || r.rating === 'unsatisfactory').length}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Reviews */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              تقييمات قادمة
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'خالد العتيبي', date: '15 مارس 2025', type: 'دورية ربع سنوية' },
                { name: 'سارة محمود', date: '20 مارس 2025', type: 'تقييم اختباري' },
                { name: 'أحمد سعيد', date: '1 أبريل 2025', type: 'تقييم سنوي' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
