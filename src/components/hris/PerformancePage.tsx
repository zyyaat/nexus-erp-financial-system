'use client'

/**
 * Simple Performance Page
 */

import React from 'react'
import { 
  Award,
  TrendingUp,
  Star,
  Target,
  Search,
} from 'lucide-react'

export default function PerformancePage() {
  // Mock reviews data
  const reviews = [
    { id: '1', name: 'أحمد الخالدي', department: 'الإدارة', score: 91, rating: 'exceptional', strengths: ['قيادة فريق بتميز', 'تحقيق أهداف المبيعات'], recommended: true },
    { id: '2', name: 'فاطمة حسن', department: 'تقنية المعلومات', score: 85, rating: 'exceeds-expectations', strengths: ['برمجة متقنة', 'حل المشكلات بسرعة'], recommended: false },
    { id: '3', name: 'محمد الأحمد', department: 'المبيعات', score: 78, rating: 'meets-expectations', strengths: ['مهارات تواصل جيدة'], recommended: false },
    { id: '4', name: 'سارة محمود', department: 'الموارد البشرية', score: 55, rating: 'needs-improvement', strengths: ['المعرفة المحاسبية'], recommended: false },
    { id: '5', name: 'خالد العتيبي', department: 'المالية', score: 72, rating: 'meets-expectations', strengths: ['الدقة في الحسابات'], recommended: false },
  ]

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'exceptional':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><Star className="w-3 h-3" /> استثنائي</span>
      case 'exceeds-expectations':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"><TrendingUp className="w-3 h-3" /> يتجاوز التوقعات</span>
      case 'meets-expectations':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">يلبي التوقعات</span>
      case 'needs-improvement':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">يحتاج تحسين</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{rating}</span>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-purple-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="w-8 h-8 text-purple-600" />
          تقييم الأداء والترقيات
        </h1>
        <p className="text-gray-500 mt-1">متابعة تقييمات الموظفين وطلبات الترقية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-5">
          <p className="text-sm font-medium text-purple-700 mb-1">متوسط الأداء</p>
          <p className="text-2xl font-bold text-purple-700">73.5</p>
          <span className="text-xs text-purple-600">/ 100 نقطة</span>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5">
          <p className="text-sm font-medium text-yellow-700 mb-1">المتميزون</p>
          <p className="text-2xl font-bold text-yellow-700">6</p>
          <span className="text-xs text-yellow-600">موظف</span>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <p className="text-sm font-medium text-green-700 mb-1">ترقيات هذا الفترة</p>
          <p className="text-2xl font-bold text-green-700">2</p>
          <span className="text-xs text-green-600">ترقية</span>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-5">
          <p className="text-sm font-medium text-orange-700 mb-1">طلبات معلقة</p>
          <p className="text-2xl font-bold text-orange-700">3</p>
          <span className="text-xs text-orange-600">طلب</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث باسم الموظف..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.department}</p>
                </div>
              </div>
              
              {/* Score Circle */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-4 ${
                review.score >= 90 ? 'border-purple-200 text-purple-600' :
                review.score >= 75 ? 'border-blue-200 text-blue-600' :
                review.score >= 60 ? 'border-green-200 text-green-600' :
                'border-yellow-200 text-yellow-600'
              }`}>
                {review.score}
              </div>
            </div>

            {/* Rating Badge */}
            <div className="mb-3">{getRatingBadge(review.rating)}</div>

            {/* Strengths */}
            {review.strengths.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-green-700 mb-1">نقاط القوة:</p>
                <div className="flex flex-wrap gap-1">
                  {review.strengths.map((strength, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {review.recommended && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  يُوصى بالترقية
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          توزيع التقييمات
        </h3>
        
        <div className="space-y-3">
          {[
            { label: 'استثنائي', count: 2, color: '#8B5CF6' },
            { label: 'يتجاوز التوقعات', count: 4, color: '#3B82F6' },
            { label: 'يلبي التوقعات', count: 12, color: '#10B981' },
            { label: 'يحتاج تحسين', count: 4, color: '#F59E0B' },
            { label: 'غير مرضي', count: 2, color: '#EF4444' },
          ].map((item) => {
            const percent = Math.round((item.count / 24) * 100)
            return (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{item.count} ({percent}%)</span>
                </div>
                <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 h-full rounded-full"
                    style={{ width: `${percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
