/**
 * Enterprise HRIS Mock Data
 * 
 * Comprehensive mock data for testing all HRIS features:
 * - Attendance records
 * - Payroll & salary data
 * - Performance reviews & promotions
 * - Leave requests
 * - Analytics metrics
 */

import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PerformanceReview,
  PromotionRequest,
  Payslip,
  HRMetrics,
  DepartmentAnalytics,
  TrendDataPoint,
  ShiftPattern,
} from '../types/employee'

// ============ ATTENDANCE DATA ============

export const mockShiftPatterns: ShiftPattern[] = [
  { id: 'shift-1', name: 'Regular', nameAr: 'عادي', type: 'regular', startTime: '09:00', endTime: '17:00', hours: 8, graceMinutes: 15, allowOvertime: true, maxOvertimeHours: 2, isActive: true },
  { id: 'shift-2', name: 'Morning', nameAr: 'صباحي', type: 'morning', startTime: '07:00', endTime: '15:00', hours: 8, graceMinutes: 10, allowOvertime: true, maxOvertimeHours: 3, isActive: true },
  { id: 'shift-3', name: 'Evening', nameAr: 'مسائي', type: 'evening', startTime: '15:00', endTime: '23:00', hours: 8, graceMinutes: 15, allowOvertime: false, maxOvertimeHours: 0, isActive: true },
  { id: 'shift-4', name: 'Flexible', nameAr: 'مرن', type: 'flexible', startTime: '08:00', endTime: '20:00', hours: 8, graceMinutes: 30, allowOvertime: true, maxOvertimeHours: 4, isActive: true },
]

/**
 * Generate attendance records for a month for all employees
 */
export function generateMockAttendance(employeeId: string, year: number, month: number): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayOfWeek = date.getDay()
    
    // Skip weekends (Friday & Saturday in MENA)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      records.push({
        id: `att-${employeeId}-${day}`,
        employeeId,
        date,
        scheduledShift: 'regular',
        scheduledStartTime: '09:00',
        scheduledEndTime: '17:00',
        scheduledHours: 8,
        actualHours: 0,
        status: 'weekend',
        isLate: false,
        createdAt: date,
        updatedAt: date,
      })
      continue
    }
    
    // Random attendance simulation (80% present, 10% late, 5% absent, 5% leave)
    const rand = Math.random()
    let record: AttendanceRecord
    
    if (rand < 0.75) {
      // Present on time
      const clockInHour = 9 + Math.floor(Math.random() * 5) // Some variation
      const clockInMin = Math.floor(Math.random() * 60)
      const clockOutHour = 17 + Math.floor(Math.random() * 2) // Some overtime
      const clockOutMin = Math.floor(Math.random() * 60)
      
      record = {
        id: `att-${employeeId}-${day}`,
        employeeId,
        date,
        scheduledShift: 'regular',
        scheduledStartTime: '09:00',
        scheduledEndTime: '17:00',
        scheduledHours: 8,
        clockIn: new Date(year, month, day, clockInHour, clockInMin),
        clockOut: new Date(year, month, day, clockOutHour, clockOutMin),
        actualHours: 8 + (clockOutHour > 17 ? clockOutHour - 17 : 0),
        status: 'present',
        isLate: false,
        overtimeMinutes: clockOutHour > 17 ? (clockOutHour - 17) * 60 + clockOutMin : 0,
        createdAt: date,
        updatedAt: date,
      }
    } else if (rand < 0.88) {
      // Late arrival
      const lateMinutes = 5 + Math.floor(Math.random() * 45)
      const clockInMin = lateMinutes
      
      record = {
        id: `att-${employeeId}-${day}`,
        employeeId,
        date,
        scheduledShift: 'regular',
        scheduledStartTime: '09:00',
        scheduledEndTime: '17:00',
        scheduledHours: 8,
        clockIn: new Date(year, month, day, 9, clockInMin),
        clockOut: new Date(year, month, day, 17, Math.floor(Math.random() * 60)),
        actualHours: 7.5,
        status: 'late',
        isLate: true,
        lateMinutes,
        createdAt: date,
        updatedAt: date,
      }
    } else if (rand < 0.94) {
      // On leave
      record = {
        id: `att-${employeeId}-${day}`,
        employeeId,
        date,
        scheduledShift: 'regular',
        scheduledStartTime: '09:00',
        scheduledEndTime: '17:00',
        scheduledHours: 8,
        actualHours: 0,
        status: 'on-leave',
        isLate: false,
        notes: 'إجازة سنوية',
        createdAt: date,
        updatedAt: date,
      }
    } else {
      // Absent
      record = {
        id: `att-${employeeId}-${day}`,
        employeeId,
        date,
        scheduledShift: 'regular',
        scheduledStartTime: '09:00',
        scheduledEndTime: '17:00',
        scheduledHours: 8,
        actualHours: 0,
        status: 'absent',
        isLate: false,
        notes: 'غياب بدون إذن',
        createdAt: date,
        updatedAt: date,
      }
    }
    
    records.push(record)
  }
  
  return records
}

// ============ LEAVE REQUESTS DATA ============

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'EMP-001',
    type: 'annual',
    startDate: new Date(2025, 1, 15), // Feb 15
    endDate: new Date(2025, 1, 22),   // Feb 22
    totalDays: 6,
    emergencyContact: '+966501234567',
    status: 'approved',
    requestedAt: new Date(2025, 0, 20),
    reviewedBy: 'HR-001',
    reviewedAt: new Date(2025, 0, 25),
    usedFromBalance: true,
    remainingBalance: 15,
    approvals: [
      { approverId: 'MGR-001', approverRole: 'Manager', status: 'approved', comment: 'موفق', actionAt: new Date(2025, 0, 22) },
      { approverId: 'HR-001', approverRole: 'HR', status: 'approved', actionAt: new Date(2025, 0, 25) },
    ],
  },
  {
    id: 'leave-2',
    employeeId: 'EMP-002',
    type: 'sick',
    startDate: new Date(2025, 1, 5),
    endDate: new Date(2025, 1, 7),
    totalDays: 3,
    status: 'approved',
    requestedAt: new Date(2025, 1, 5),
    reviewedBy: 'MGR-001',
    reviewedAt: new Date(2025, 1, 5),
    attachments: ['medical-cert-002.pdf'],
    usedFromBalance: true,
    remainingBalance: 27,
    approvals: [
      { approverId: 'MGR-001', approverRole: 'Manager', status: 'approved', comment: 'نتمنى الشفاء العاجل', actionAt: new Date(2025, 1, 5) },
    ],
  },
  {
    id: 'leave-3',
    employeeId: 'EMP-003',
    type: 'hajj',
    startDate: new Date(2025, 5, 10), // June
    endDate: new Date(2025, 5, 30),
    totalDays: 21,
    status: 'pending',
    requestedAt: new Date(2025, 1, 1),
    approvals: [
      { approverId: 'MGR-001', approverRole: 'Manager', status: 'pending' },
      { approverId: 'HR-001', approverRole: 'HR', status: 'pending' },
    ],
  },
  {
    id: 'leave-4',
    employeeId: 'EMP-005',
    type: 'emergency',
    startDate: new Date(2025, 1, 28),
    endDate: new Date(2025, 1, 28),
    totalDays: 1,
    status: 'pending',
    requestedAt: new Date(2025, 1, 27),
    handoverNotes: 'المهام الموكلة لي تم نقلها لأحمد',
    approvals: [
      { approverId: 'MGR-002', approverRole: 'Manager', status: 'pending' },
    ],
  },
  {
    id: 'leave-5',
    employeeId: 'EMP-007',
    type: 'maternity',
    startDate: new Date(2025, 3, 1), // April
    endDate: new Date(2025, 8, 18), // September (170 days)
    totalDays: 170,
    status: 'approved',
    requestedAt: new Date(2025, 0, 15),
    reviewedBy: 'HR-001',
    reviewedAt: new Date(2025, 0, 20),
    attachments: ['medical-report.pdf'],
    usedFromBalance: false,
    approvals: [
      { approverId: 'MGR-003', approverRole: 'Manager', status: 'approved' },
      { approverId: 'HR-001', approverRole: 'HR', status: 'approved', comment: 'تطبق سياسة إجازة الأمومة بالكامل' },
    ],
  },
]

// ============ PERFORMANCE REVIEWS DATA ============

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: 'review-1',
    employeeId: 'EMP-001',
    reviewerId: 'MGR-001',
    cycleId: 'cycle-2024-annual',
    kpiScore: 92,
    competencyScore: 88,
    goalsScore: 95,
    overallScore: 91,
    rating: 'exceptional',
    strengths: ['قيادة فريق بتميز', 'تحقيق أهداف المبيعات بنسبة 120%', 'تطوير مهارات الفريق'],
    areasForImprovement: ['تحسين التوثيق', 'تفويض المهام أكثر'],
    achievements: ['أفضل مدير للربع السنوي', 'زيادة المبيعات 30%'],
    managerComments: 'أداء استثنائي خلال العام. يستحق ترقية.',
    hrComments: 'موافق على الترقية المقترحة',
    goals: [
      {
        id: 'goal-1',
        title: 'زيادة المبيعات',
        description: 'تحقيق نمو 25% في المبيعات السنوية',
        category: 'individual',
        objective: 'نمو الأعمال',
        keyResults: [
          { id: 'kr-1', description: 'إبرام 50 عقد جديد', targetValue: 50, currentValue: 58, unit: 'عقد', isCompleted: true },
          { id: 'kr-2', description: 'زيادة الإيرادات 25%', targetValue: 25, currentValue: 32, unit: '%', isCompleted: true },
        ],
        progress: 100,
        status: 'completed',
        weight: 40,
        dueDate: new Date(2024, 11, 31),
        completedAt: new Date(2024, 11, 30),
      },
    ],
    trainingRecommendations: ['دورة القيادة المتقدمة', 'شهادة PMP'],
    careerPathDiscussion: 'مهئ لمنصب مدير منطقة خلال 2025',
    status: 'completed',
    submittedAt: new Date(2024, 11, 15),
    completedAt: new Date(2024, 12, 1),
    recommendedForPromotion: true,
    recommendedSalaryIncrease: 15000,
  },
  {
    id: 'review-2',
    employeeId: 'EMP-002',
    reviewerId: 'MGR-001',
    cycleId: 'cycle-2024-annual',
    kpiScore: 85,
    competencyScore: 82,
    goalsScore: 88,
    overallScore: 85,
    rating: 'exceeds-expectations',
    strengths: ['برمجة متقنة', 'حل المشكلات بسرعة', 'مساعدة الزملاء'],
    areasForImprovement: ['التوثيق التقني', 'العرض التقديمي'],
    achievements: ['تطوير نظام CRM', 'تقليل وقت التحميل 40%'],
    managerComments: 'مطور ممتاز، يحتاج تطوير مهارات التواصل',
    status: 'completed',
    submittedAt: new Date(2024, 11, 20),
    completedAt: new Date(2024, 12, 5),
    recommendedForPromotion: false,
    recommendedSalaryIncrease: 8000,
  },
  {
    id: 'review-3',
    employeeId: 'EMP-004',
    reviewerId: 'MGR-002',
    cycleId: 'cycle-2024-annual',
    kpiScore: 55,
    competencyScore: 60,
    goalsScore: 50,
    overallScore: 55,
    rating: 'needs-improvement',
    strengths: ['المعرفة المحاسبية', 'الدقة في الحسابات'],
    areasForImprovement: ['سرعة إنجاز المهام', 'استخدام البرمجيات الحديثة', 'العمل تحت الضغط'],
    achievements: [],
    managerComments: 'يحتاج خطة تحسين أداء وتدريب مكثف',
    status: 'completed',
    submittedAt: new Date(2024, 11, 18),
    completedAt: new Date(2024, 12, 3),
    recommendedForPromotion: false,
    recommendedSalaryIncrease: 2000,
    trainingRecommendations: ['دورة Excel متقدمة', 'تدريب على ERP System'],
  },
]

// ============ PROMOTION REQUESTS DATA ============

export const mockPromotionRequests: PromotionRequest[] = [
  {
    id: 'promo-1',
    employeeId: 'EMP-001',
    proposedBy: 'MGR-001',
    currentTitle: 'مدير مبيعات',
    currentGrade: 'G7',
    currentSalary: 45000,
    proposedTitle: 'مدير منطقة المبيعات',
    proposedGrade: 'G8',
    proposedSalary: 60000,
    salaryIncreaseAmount: 15000,
    salaryIncreasePercent: 33.3,
    effectiveDate: new Date(2025, 2, 1),
    reasons: ['أداء استثنائي لمدة عامين', 'قيادة ناجحة لفريق 8 أشخاص', 'تحقيق 120% من الهدف'],
    achievements: ['أفضل مدير Q3 2024', 'زيادة حصة السوق 15%'],
    performanceReviews: ['review-1'],
    budgetApprovalRequired: true,
    budgetApproved: true,
    status: 'approved',
    currentStep: 3,
    totalSteps: 3,
    approvals: [
      { approverId: 'MGR-001', approverRole: 'manager', status: 'approved', comment: 'يستحق هذه الترقية عن جدارة', actionAt: new Date(2025, 0, 10) },
      { approverId: 'HR-001', approverRole: 'hr', status: 'approved', comment: 'متوافق مع سياسات الترقية', actionAt: new Date(2025, 0, 15) },
      { approverId: 'CEO-001', approverRole: 'executive', status: 'approved', actionAt: new Date(2025, 0, 20) },
    ],
    createdAt: new Date(2025, 0, 5),
    effectiveAsOf: new Date(2025, 2, 1),
  },
  {
    id: 'promo-2',
    employeeId: 'EMP-002',
    proposedBy: 'MGR-001',
    currentTitle: 'مطور برمجيات وسيط',
    currentGrade: 'G5',
    currentSalary: 28000,
    proposedTitle: 'مطور أول',
    proposedGrade: 'G6',
    proposedSalary: 35000,
    salaryIncreaseAmount: 7000,
    salaryIncreasePercent: 25,
    effectiveDate: new Date(2025, 3, 1),
    reasons: ['تحسين أداء النظام 40%', 'قيادة مشروع CRM بنجاح'],
    achievements: ['مطور الشهر 3 مرات'],
    performanceReviews: ['review-2'],
    budgetApprovalRequired: false,
    budgetApproved: true,
    status: 'under-review',
    currentStep: 1,
    totalSteps: 3,
    approvals: [
      { approverId: 'MGR-001', approverRole: 'manager', status: 'approved', comment: 'مطور ممتاز، يستحق الترقية', actionAt: new Date(2025, 1, 1) },
      { approverId: 'HR-001', approverRole: 'hr', status: 'pending' },
      { approverId: 'FIN-001', approverRole: 'executive', status: 'pending' },
    ],
    createdAt: new Date(2025, 1, 1),
  },
  {
    id: 'promo-3',
    employeeId: 'EMP-006',
    proposedBy: 'MGR-003',
    currentTitle: 'منسق تسويق',
    currentGrade: 'G4',
    currentSalary: 18000,
    proposedTitle: 'أخصائي تسويق',
    proposedGrade: 'G5',
    proposedSalary: 22000,
    salaryIncreaseAmount: 4000,
    salaryIncreasePercent: 22.2,
    effectiveDate: new Date(2025, 4, 1),
    reasons: ['نجاح حملة الترويج', 'زيادة المتابعين 50%'],
    achievements: ['تصميم حملة رمضان الناجحة'],
    budgetApprovalRequired: false,
    budgetApproved: true,
    status: 'proposed',
    currentStep: 0,
    totalSteps: 3,
    approvals: [],
    createdAt: new Date(2025, 1, 15),
  },
]

// ============ PAYSLIP DATA ============

export const mockPayslips: Payslip[] = [
  {
    id: 'payslip-001-2025-01',
    payrollRunId: 'payroll-2025-01',
    employeeId: 'EMP-001',
    payPeriodStart: new Date(2025, 0, 1),
    payPeriodEnd: new Date(2025, 0, 31),
    paymentDate: new Date(2025, 1, 5),
    earnings: [
      { componentId: 'base', componentName: 'Basic Salary', componentNameAr: 'الراتب الأساسي', amount: 45000 },
      { componentId: 'housing', componentName: 'Housing Allowance', componentNameAr: 'بدل سكن', amount: 6000 },
      { componentId: 'transport', componentName: 'Transport Allowance', componentNameAr: 'بدل نقل', amount: 1500 },
      { componentId: 'phone', componentName: 'Phone Allowance', componentNameAr: 'بدل هاتف', amount: 500 },
    ],
    totalEarnings: 53000,
    deductions: [
      { componentId: 'gosi', componentName: 'GOSI (Employee)', componentNameAr: 'التأمينات', amount: 4500 },
      { componentId: 'tax', componentName: 'Income Tax', componentNameAr: 'ضريبة الدخل', amount: 0 },
    ],
    totalDeductions: 4500,
    grossSalary: 53000,
    netSalary: 48500,
    workingDays: 22,
    presentDays: 21,
    absentDays: 1,
    leaveDays: 0,
    overtimeHours: 8,
    ytdGross: 53000,
    ytdTax: 0,
    ytdNet: 48500,
    paymentMethod: 'bank-transfer',
    bankAccount: '****7890',
    transactionRef: 'TXN-202501-001',
  },
  {
    id: 'payslip-002-2025-01',
    payrollRunId: 'payroll-2025-01',
    employeeId: 'EMP-002',
    payPeriodStart: new Date(2025, 0, 1),
    payPeriodEnd: new Date(2025, 0, 31),
    paymentDate: new Date(2025, 1, 5),
    earnings: [
      { componentId: 'base', componentName: 'Basic Salary', componentNameAr: 'الراتب الأساسي', amount: 28000 },
      { componentId: 'housing', componentName: 'Housing Allowance', componentNameAr: 'بدل سكن', amount: 4000 },
      { componentId: 'transport', componentName: 'Transport Allowance', componentNameAr: 'بدل نقل', amount: 1000 },
    ],
    totalEarnings: 33000,
    deductions: [
      { componentId: 'gosi', componentName: 'GOSI (Employee)', componentNameAr: 'التأمينات', amount: 2800 },
    ],
    totalDeductions: 2800,
    grossSalary: 33000,
    netSalary: 30200,
    workingDays: 22,
    presentDays: 19,
    absentDays: 0,
    leaveDays: 3,
    overtimeHours: 12,
    ytdGross: 33000,
    ytdTax: 0,
    ytdNet: 30200,
    paymentMethod: 'bank-transfer',
    bankAccount: '****1234',
    transactionRef: 'TXN-202501-002',
  },
]

// ============ HR METRICS / ANALYTICS ============

export const mockHRMetrics: HRMetrics = {
  // Headcount
  totalHeadcount: 24,
  newHiresThisMonth: 3,
  terminationsThisMonth: 1,
  netHeadcountChange: 2,
  
  // Turnover
  turnoverRate: 8.3,
  voluntaryTurnoverRate: 6.2,
  involuntaryTurnoverRate: 2.1,
  turnoverByDepartment: {
    management: 0,
    hr: 5.0,
    it: 10.0,
    finance: 8.3,
    sales: 15.0,
    marketing: 0,
    operations: 7.1,
    'customer-service': 20.0,
    legal: 0,
    other: 0,
  },
  turnoverByTenure: {
    '0-1yr': 35.0,
    '1-3yr': 15.0,
    '3-5yr': 5.0,
    '5+yr': 2.0,
  },
  
  // Costs
  costPerHire: 8500,
  averageSalary: 32000,
  medianSalary: 28000,
  payrollCost: 768000,
  benefitsCost: 153600,
  costPerEmployee: 38400,
  revenuePerEmployee: 420000,
  
  // Attendance
  averageAttendanceRate: 87.5,
  absenteeismRate: 4.2,
  lateArrivalsRate: 8.3,
  overtimeRate: 15.0,
  overtimeHoursThisMonth: 340,
  
  // Leave
  leaveUtilizationRate: 65.0,
  pendingLeaveRequests: 8,
  leaveByType: {
    annual: 45,
    sick: 12,
    unpaid: 3,
    emergency: 5,
    maternity: 170,
    paternity: 2,
    hajj: 21,
    umrah: 8,
    mourning: 2,
    wedding: 3,
    study: 0,
    compensatory: 10,
  },
  
  // Performance
  averagePerformanceScore: 73.5,
  highPerformersCount: 6,
  lowPerformersCount: 3,
  promotionsThisPeriod: 2,
  pendingPromotions: 3,
  
  // Diversity
  genderDistribution: {
    male: 14,
    female: 10,
    other: 0,
    'prefer-not-to-say': 0,
  },
  ageDistribution: {
    '20-30': 8,
    '31-40': 10,
    '41-50': 5,
    '50+': 1,
  },
  nationalityDistribution: {
    'Saudi': 8,
    'Egyptian': 7,
    'Jordanian': 4,
    'Emirati': 2,
    'Other': 3,
  },
  
  // Engagement
  engagementScore: 4.1,
  eNPS: 52,
}

export const mockDepartmentAnalytics: DepartmentAnalytics[] = [
  {
    department: 'management',
    headcount: 3,
    budget: 250000,
    actualSpend: 245000,
    budgetVariance: -5000,
    avgSalary: 55000,
    turnoverRate: 0,
    avgPerformanceScore: 88,
    openPositions: 0,
    timeToFill: 0,
  },
  {
    department: 'hr',
    headcount: 4,
    budget: 120000,
    actualSpend: 118000,
    budgetVariance: -2000,
    avgSalary: 28000,
    turnoverRate: 5.0,
    avgPerformanceScore: 76,
    openPositions: 1,
    timeToFill: 45,
  },
  {
    department: 'it',
    headcount: 5,
    budget: 200000,
    actualSpend: 195000,
    budgetVariance: -5000,
    avgSalary: 38000,
    turnoverRate: 10.0,
    avgPerformanceScore: 81,
    openPositions: 2,
    timeToFill: 60,
  },
  {
    department: 'finance',
    headcount: 3,
    budget: 110000,
    actualSpend: 108000,
    budgetVariance: -2000,
    avgSalary: 34000,
    turnoverRate: 8.3,
    avgPerformanceScore: 72,
    openPositions: 0,
    timeToFill: 0,
  },
  {
    department: 'sales',
    headcount: 4,
    budget: 180000,
    actualSpend: 185000,
    budgetVariance: 5000,
    avgSalary: 42000,
    turnoverRate: 15.0,
    avgPerformanceScore: 79,
    openPositions: 2,
    timeToFill: 30,
  },
  {
    department: 'marketing',
    headcount: 2,
    budget: 70000,
    actualSpend: 68000,
    budgetVariance: -2000,
    avgSalary: 32000,
    turnoverRate: 0,
    avgPerformanceScore: 84,
    openPositions: 1,
    timeToFill: 35,
  },
  {
    department: 'operations',
    headcount: 2,
    budget: 65000,
    actualSpend: 64000,
    budgetVariance: -1000,
    avgSalary: 30000,
    turnoverRate: 7.1,
    avgPerformanceScore: 70,
    openPositions: 0,
    timeToFill: 0,
  },
  {
    department: 'customer-service',
    headcount: 3,
    budget: 75000,
    actualSpend: 77000,
    budgetVariance: 2000,
    avgSalary: 24000,
    turnoverRate: 20.0,
    avgPerformanceScore: 65,
    openPositions: 1,
    timeToFill: 20,
  },
]

// ============ TREND DATA FOR CHARTS ============

export const mockTrendData: Record<string, TrendDataPoint[]> = {
  headcount: [
    { period: 'يناير', value: 20, previousValue: 19, changePercent: 5.3 },
    { period: 'فبراير', value: 21, previousValue: 20, changePercent: 5.0 },
    { period: 'مارس', value: 22, previousValue: 21, changePercent: 4.8 },
    { period: 'أبريل', value: 22, previousValue: 22, changePercent: 0 },
    { period: 'مايو', value: 23, previousValue: 22, changePercent: 4.5 },
    { period: 'يونيو', value: 24, previousValue: 23, changePercent: 4.3 },
    { period: 'يوليو', value: 24, previousValue: 24, changePercent: 0 },
  ],
  turnover: [
    { period: 'يناير', value: 8.0, previousValue: 7.5, changePercent: 6.7 },
    { period: 'فبراير', value: 7.8, previousValue: 8.0, changePercent: -2.5 },
    { period: 'مارس', value: 9.2, previousValue: 7.8, changePercent: 17.9 },
    { period: 'أبريل', value: 8.5, previousValue: 9.2, changePercent: -7.6 },
    { period: 'مايو', value: 8.8, previousValue: 8.5, changePercent: 3.5 },
    { period: 'يونيو', value: 8.3, previousValue: 8.8, changePercent: -5.7 },
  ],
  attendance: [
    { period: 'يناير', value: 89.0, previousValue: 87.0, changePercent: 2.3 },
    { period: 'فبراير', value: 86.5, previousValue: 89.0, changePercent: -2.8 },
    { period: 'مارس', value: 88.0, previousValue: 86.5, changePercent: 1.7 },
    { period: 'أبريل', value: 90.2, previousValue: 88.0, changePercent: 2.5 },
    { period: 'مايو', value: 87.5, previousValue: 90.2, changePercent: -3.0 },
    { period: 'يونيو', value: 87.5, previousValue: 87.5, changePercent: 0 },
  ],
  performance: [
    { period: 'Q1', value: 72.0, previousValue: 68.0, changePercent: 5.9 },
    { period: 'Q2', value: 74.5, previousValue: 72.0, changePercent: 3.5 },
    { period: 'Q3', value: 73.0, previousValue: 74.5, changePercent: -2.0 },
    { period: 'Q4', value: 73.5, previousValue: 73.0, changePercent: 0.7 },
  ],
  hiring: [
    { period: 'يناير', value: 2, previousValue: 1, changePercent: 100 },
    { period: 'فبراير', value: 1, previousValue: 2, changePercent: -50 },
    { period: 'مارس', value: 3, previousValue: 1, changePercent: 200 },
    { period: 'أبريل', value: 0, previousValue: 3, changePercent: -100 },
    { period: 'مايو', value: 2, previousValue: 0, changePercent: null },
    { period: 'يونيو', value: 3, previousValue: 2, changePercent: 50 },
  ],
}

// ============ HELPER FUNCTIONS ============

/**
 * Get today's attendance summary
 */
export function getTodayAttendanceSummary(): {
  total: number
  present: number
  absent: number
  late: number
  onLeave: number
  weekend: number
} {
  return {
    total: 24,
    present: 19,
    absent: 2,
    late: 3,
    onLeave: 2,
    weekend: 0,
  }
}

/**
 * Get pending approval counts
 */
export function getPendingApprovalsCount(): {
  leaveRequests: number
  promotions: number
  overtimeRequests: number
  total: number
} {
  return {
    leaveRequests: 3,
    promotions: 2,
    overtimeRequests: 5,
    total: 10,
  }
}

/**
 * Get upcoming events (birthdays, anniversaries, etc.)
 */
export function getUpcomingEvents(): Array<{
  type: 'birthday' | 'anniversary' | 'review-due' | 'contract-end'
  employeeId: string
  employeeName: string
  date: Date
  description: string
}> {
  return [
    {
      type: 'birthday',
      employeeId: 'EMP-003',
      employeeName: 'محمد الأحمد',
      date: new Date(2025, 2, 15), // March 15
      description: 'عيد ميلاد محمد',
    },
    {
      type: 'anniversary',
      employeeId: 'EMP-001',
      employeeName: 'أحمد الخالدي',
      date: new Date(2025, 2, 1), // March 1
      description: 'ذكرى سنوية 5 سنوات',
    },
    {
      type: 'contract-end',
      employeeId: 'EMP-008',
      employeeName: 'سارة محمود',
      date: new Date(2025, 2, 20), // March 20
      description: 'انتهاء العقد',
    },
    {
      type: 'review-due',
      employeeId: 'EMP-005',
      employeeName: 'خالد العتيبي',
      date: new Date(2025, 2, 10), // March 10
      description: 'تقييم أداء دوري مستحق',
    },
  ]
}
