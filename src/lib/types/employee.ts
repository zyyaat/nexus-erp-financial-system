/**
 * Enterprise HRIS - Complete Type Definitions
 * 
 * Based on research from:
 * - Workday, SAP SuccessFactors, BambooHR enterprise features
 * - MENA region HR requirements (GOSI, WPS, Labor Laws)
 * - Best practices for large-scale employee management
 */

// ============ CORE ENUMS ============

/** Employment type */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'freelance'

/** Current employment status */
export type EmployeeStatus = 'active' | 'on-leave' | 'terminated' | 'pending' | 'suspended'

/** Gender */
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say'

/** Marital status */
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'

/** Department IDs */
export type DepartmentId = 
  | 'management'
  | 'hr'
  | 'it'
  | 'finance'
  | 'sales'
  | 'marketing'
  | 'operations'
  | 'customer-service'
  | 'legal'
  | 'other'

// ============ ATTENDANCE TYPES ============

/** Attendance record status */
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave' | 'holiday' | 'weekend'

/** Shift types */
export type ShiftType = 'regular' | 'morning' | 'evening' | 'night' | 'rotating' | 'flexible'

/** Overtime approval status */
export type OvertimeStatus = 'pending' | 'approved' | 'rejected' | 'processed'

/** Leave request status */
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

/** Leave types - including MENA specific */
export type LeaveType = 
  | 'annual'           // إجازة سنوية
  | 'sick'             // مرضية
  | 'unpaid'           // بدون راتب
  | 'emergency'        // طارئة
  | 'maternity'        // أمومة (170 days Saudi)
  | 'paternity'        // أبوة
  | 'hajj'             // حج
  | 'umrah'            // عمرة
  | 'mourning'         // عزاء
  | 'wedding'          // زواج
  | 'study'            // دراسية
  | 'compensatory'     // بدلية

// ============ PAYROLL TYPES ============

/** Salary component types */
export type SalaryComponentType = 
  | 'earning'          // استحقاق
  | 'deduction'        // خصم
  | 'tax'              // ضريبة
  | 'benefit'          // مزايا
  | 'contribution'     // اشتراك (GOSI etc.)

/** Payroll cycle status */
export type PayrollStatus = 'draft' | 'processing' | 'processed' | 'paid' | 'cancelled'

/** Payment method */
export type PaymentMethod = 'bank-transfer' | 'cash' | 'cheque' | 'wallet'

// ============ PERFORMANCE TYPES ============

/** Review frequency */
export type ReviewFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'ad-hoc'

/** Rating scale (1-5 or 1-10) */
export type RatingScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

/** Performance rating category */
export type PerformanceRating = 'exceptional' | 'exceeds-expectations' | 'meets-expectations' | 'needs-improvement' | 'unsatisfactory'

/** Promotion status */
export type PromotionStatus = 'proposed' | 'under-review' | 'approved' | 'effective' | 'rejected' | 'deferred'

/** Goal status */
export type GoalStatus = 'not-started' | 'in-progress' | 'on-track' | 'at-risk' | 'completed' | 'overdue'

// ============ INTERFACES - ATTENDANCE ============

/**
 * Daily attendance record
 * Tracks clock in/out times and attendance status
 */
export interface AttendanceRecord {
  id: string
  employeeId: string
  date: Date // The date of the record
  
  // Schedule info
  scheduledShift: ShiftType
  scheduledStartTime: string // HH:mm format
  scheduledEndTime: string   // HH:mm format
  scheduledHours: number
  
  // Actual times
  clockIn?: Date
  clockOut?: Date
  actualHours: number
  
  // Status & calculations
  status: AttendanceStatus
  isLate: boolean
  lateMinutes?: number
  isEarlyLeave: boolean
  earlyLeaveMinutes?: number
  overtimeMinutes?: number
  
  // Location verification (for remote/mobile)
  clockInLocation?: { lat: number; lng: number; address?: string }
  clockOutLocation?: { lat: number; lng: number; address?: string }
  
  // Notes
  notes?: string
  approvedBy?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Shift pattern definition
 * Defines work schedules
 */
export interface ShiftPattern {
  id: string
  name: string
  nameAr: string
  type: ShiftType
  startTime: string // HH:mm
  endTime: string   // HH:mm
  hours: number
  graceMinutes: number // Late tolerance
  allowOvertime: boolean
  maxOvertimeHours: number
  isActive: boolean
}

/**
 * Overtime request
 */
export interface OvertimeRequest {
  id: string
  employeeId: string
  date: Date
  requestedHours: number
  reason: string
  status: OvertimeStatus
  approvedBy?: string
  rateMultiplier: number // Usually 1.25x or 1.5x
  actualHoursWorked?: number
  createdAt: Date
  processedAt?: Date
}

/**
 * Leave request with full details
 */
export interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: Date
  endDate: Date
  totalDays: number
  
  // Contact during leave
  emergencyContact?: string
  handoverNotes?: string
  
  // Attachments (medical certificate etc.)
  attachments?: string[] // File URLs
  
  // Workflow
  status: LeaveStatus
  requestedAt: Date
  reviewedBy?: string
  reviewedAt?: date
  rejectionReason?: string
  
  // Approval chain
  approvals: LeaveApproval[]
  
  // Tracking
  usedFromBalance: boolean
  remainingBalance?: number
}

export interface LeaveApproval {
  approverId: string
  approverRole: string
  status: 'approved' | 'rejected' | 'pending'
  comment?: string
  actionAt?: Date
}

// ============ INTERFACES - PAYROLL ============

/**
 * Salary component (earning or deduction)
 */
export interface SalaryComponent {
  id: string
  name: string
  nameAr: string
  type: SalaryComponentType
  amount: number
  isPercentage: boolean // If true, amount is % of base salary
  percentageOf?: string // Which component it's based on
  isFixed: boolean // Fixed vs variable each month
  isActive: boolean
  isTaxable: boolean
  isGOSIApplicable: boolean // For Saudi GOSI calculation
  
  // Category for grouping
  category: 'basic' | 'allowance' | 'deduction' | 'benefit' | 'tax' | 'social'
  
  // Calculation order
  priority: number
}

/**
 * Complete salary structure for a position/grade
 */
export interface SalaryStructure {
  id: string
  name: string
  grade: string // e.g., "G5", "Manager Level"
  baseSalaryMin: number
  baseSalaryMax: number
  currency: string
  
  components: SalaryComponent[]
  
  // Who this applies to
  department?: DepartmentId
  employmentTypes: EmploymentType[]
  
  isActive: boolean
  effectiveDate: Date
  endDate?: Date
}

/**
 * Individual employee salary assignment
 */
export interface EmployeeSalary {
  employeeId: string
  structureId: string
  
  baseSalary: number
  components: Array<{
    componentId: string
    amount: number
    isCustom: boolean // Override default structure
  }>
  
  effectiveDate: Date
  endDate?: Date
  
  // Monthly totals (calculated)
  totalEarnings: number
  totalDeductions: number
  netSalary: number
}

/**
 * Payroll run (monthly/period processing)
 */
export interface PayrollRun {
  id: string
  periodStart: Date
  periodEnd: Date
  periodName: string // e.g., "يناير 2025"
  status: PayrollStatus
  
  // Processing metadata
  processedBy?: string
  processedAt?: Date
  approvedBy?: string
  approvedAt?: Date
  
  // Summary
  totalEmployees: number
  totalPayroll: number
  totalDeductions: number
  netPayable: number
  
  // Reference numbers
  bankReference?: string
  gosiReference?: string // For Saudi GOSI submission
  wpsReference?: string // For UAE WPS submission
  
  // Individual payslips
  payslips: Payslip[]
}

/**
 * Individual payslip
 */
export interface Payslip {
  id: string
  payrollRunId: string
  employeeId: string
  
  // Period
  payPeriodStart: Date
  payPeriodEnd: Date
  paymentDate: Date
  
  // Earnings breakdown
  earnings: Array<{
    componentId: string
    componentName: string
    componentNameAr: string
    amount: number
    days?: number // For pro-rated calculations
  }>
  totalEarnings: number
  
  // Deductions breakdown
  deductions: Array<{
    componentId: string
    componentName: string
    componentNameAr: string
    amount: number
  }>
  totalDeductions: number
  
  // Totals
  grossSalary: number
  netSalary: number
  
  // Working days stats
  workingDays: number
  presentDays: number
  absentDays: number
  leaveDays: number
  overtimeHours: number
  
  // YTD accumulators
  ytdGross: number
  ytdTax: number
  ytdNet: number
  
  // Payment info
  paymentMethod: PaymentMethod
  bankAccount?: string
  transactionRef?: string
}

// ============ INTERFACES - PERFORMANCE ============

/**
 * Performance review cycle
 */
export interface ReviewCycle {
  id: string
  name: string
  nameAr: string
  type: 'annual' | 'quarterly' | 'probation' | 'promotion'
  frequency: ReviewFrequency
  
  startDate: Date
  endDate: Date
  selfReviewDeadline: Date
  managerReviewDeadline: Date
  
  // Weight configuration
  kpiWeight: number      // Default 70%
  competencyWeight: number // Default 20%
  goalsWeight: number    // Default 10%
  
  isActive: boolean
  isCompleted: boolean
}

/**
 * Performance review for an employee
 */
export interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string // Manager ID
  cycleId: string
  
  // Scores (out of 100)
  kpiScore?: number
  competencyScore?: number
  goalsScore?: number
  overallScore: number
  
  // Rating
  rating: PerformanceRating
  
  // Assessments
  strengths: string[]
  areasForImprovement: string[]
  achievements: string[]
  
  // Comments
  managerComments?: string
  employeeComments?: string
  hrComments?: string
  
  // Goals for next period
  goals: PerformanceGoal[]
  
  // Development plan
  trainingRecommendations?: string[]
  careerPathDiscussion?: string
  
  // Status & dates
  status: 'draft' | 'self-review' | 'manager-review' | 'calibration' | 'completed'
  submittedAt?: Date
  completedAt?: Date
  
  // Promotion consideration
  recommendedForPromotion: boolean
  recommendedSalaryIncrease?: number
}

/**
 * Performance goal (OKR style)
 */
export interface PerformanceGoal {
  id: string
  title: string
  description: string
  category: 'individual' | 'team' | 'organizational'
  
  // OKR structure
  objective?: string
  keyResults: KeyResult[]
  
  // Progress
  progress: number // 0-100
  status: GoalStatus
  
  // Weights
  weight: number // Importance in overall score
  
  // Dates
  dueDate: Date
  completedAt?: Date
}

export interface KeyResult {
  id: string
  description: string
  targetValue: number
  currentValue: number
  unit: string // '%', '$', 'count', etc.
  isCompleted: boolean
}

/**
 * Promotion request with full workflow
 */
export interface PromotionRequest {
  id: string
  employeeId: string
  proposedBy: string // Manager who proposed
  
  // Current position
  currentTitle: string
  currentGrade: string
  currentSalary: number
  
  // Proposed position
  proposedTitle: string
  proposedGrade: string
  proposedSalary: number
  salaryIncreaseAmount: number
  salaryIncreasePercent: number
  
  // Effective date
  effectiveDate: Date
  
  // Justification
  reasons: string[]
  achievements: string[]
  performanceReviews: string[] // Review IDs supporting this promotion
  
  // Budget impact
  budgetApprovalRequired: boolean
  budgetApproved: boolean
  
  // Workflow
  status: PromotionStatus
  currentStep: number
  totalSteps: number
  
  // Approval chain
  approvals: PromotionApproval[]
  
  // Timeline
  createdAt: Date
  effectiveAsOf?: Date
}

export interface PromotionApproval {
  approverId: string
  approverRole: string // 'manager', 'hr', 'finance', 'executive'
  status: 'approved' | 'rejected' | 'pending'
  comment?: string
  actionAt?: Date
}

// ============ INTERFACES - ANALYTICS ============

/**
 * HR Analytics metrics
 */
export interface HRMetrics {
  // Headcount metrics
  totalHeadcount: number
  newHiresThisMonth: number
  terminationsThisMonth: number
  netHeadcountChange: number
  
  // Turnover metrics
  turnoverRate: number // Percentage
  voluntaryTurnoverRate: number
  involuntaryTurnoverRate: number
  turnoverByDepartment: Record<DepartmentId, number>
  turnoverByTenure: Record<string, number> // '0-1yr', '1-3yr', '3-5yr', '5+yr'
  
  // Cost metrics
  costPerHire: number
  averageSalary: number
  medianSalary: number
  payrollCost: number
  benefitsCost: number
  costPerEmployee: number
  revenuePerEmployee?: number
  
  // Attendance metrics
  averageAttendanceRate: number
  absenteeismRate: number
  lateArrivalsRate: number
  overtimeRate: number
  overtimeHoursThisMonth: number
  
  // Leave metrics
  leaveUtilizationRate: number
  pendingLeaveRequests: number
  leaveByType: Record<LeaveType, number>
  
  // Performance metrics
  averagePerformanceScore: number
  highPerformersCount: number // Rating 4-5
  lowPerformersCount: number // Rating 1-2
  promotionsThisPeriod: number
  pendingPromotions: number
  
  // Diversity metrics (optional)
  genderDistribution: Record<Gender, number>
  ageDistribution: Record<string, number> // '20-30', '31-40', '41-50', '50+'
  nationalityDistribution: Record<string, number>
  
  // Engagement (if survey data exists)
  engagementScore?: number
  eNPS?: number // Employee Net Promoter Score
}

/**
 * Department analytics
 */
export interface DepartmentAnalytics {
  department: DepartmentId
  headcount: number
  budget: number
  actualSpend: number
  budgetVariance: number
  avgSalary: number
  turnoverRate: number
  avgPerformanceScore: number
  openPositions: number
  timeToFill: number // Days
}

/**
 * Trend data point for charts
 */
export interface TrendDataPoint {
  period: string // Month label
  value: number
  previousValue?: number
  changePercent?: number
}

// ============ ORIGINAL INTERFACES (KEPT) ============

/**
 * Personal Information
 */
export interface PersonalInfo {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: Date
  gender: Gender
  nationality: string
  nationalId?: string
  maritalStatus: MaritalStatus
}

/**
 * Contact Information
 */
export interface ContactInfo {
  personalEmail: string
  workEmail?: string
  phone: string
  workPhone?: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  address: {
    street: string
    city: string
    state?: string
    country: string
    postalCode: string
  }
}

/**
 * Employment Information
 */
export interface EmploymentInfo {
  employeeId: string
  department: DepartmentId
  jobTitle: string
  employmentType: EmploymentType
  status: EmployeeStatus
  hireDate: Date
  endDate?: Date
  reportsTo?: string
  workLocation: string
  workMode: 'onsite' | 'remote' | 'hybrid'
  
  // Extended fields
  grade?: string
  level?: number // 1-10 hierarchy level
  team?: string
}

/**
 * Financial Information
 */
export interface FinancialInfo {
  baseSalary: number
  currency: string
  bankName?: string
  bankAccount?: string
  iban?: string
  taxId?: string
  hasHealthInsurance: boolean
  hasLifeInsurance: boolean
  transportAllowance?: number
  housingAllowance?: number
  otherAllowances?: Record<string, number>
  
  // New fields
  gosiApplicable?: boolean
  gosiEmployeeRate?: number // Default 10% Saudi
  gosiEmployerRate?: number // Default 11.5% Saudi
}

/**
 * Leave Balance
 */
export interface LeaveBalance {
  annualLeave: { total: number; used: number; unit: 'days' }
  sickLeave: { total: number; used: number; unit: 'days' }
  unpaidLeave: { total: number; used: number; unit: 'days' }
  maternityLeave?: { total: number; used: number; unit: 'days' }
  paternityLeave?: { total: number; used: number; unit: 'days' }
  specialLeave?: { total: number; used: number; unit: 'days' }
  // New leave types
  hajjLeave?: { total: number; used: number; unit: 'days' }
  urgentLeave?: { total: number; used: number; unit: 'days' }
}

/**
 * Education & Qualifications
 */
export interface Education {
  degree: string
  field: string
  institution: string
  graduationYear: number
  gpa?: number
}

/**
 * Work Experience
 */
export interface WorkExperience {
  company: string
  position: string
  startDate: Date
  endDate?: Date
  description?: string
}

/**
 * Skills
 */
export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'language' | 'tool'
}

/**
 * Certifications
 */
export interface Certification {
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialUrl?: string
}

/**
 * Documents
 */
export interface EmployeeDocument {
  id: string
  name: string
  type: 'cv' | 'contract' | 'id-copy' | 'certificate' | 'qualification' | 'medical' | 'other'
  url: string
  uploadedAt: Date
  uploadedBy: string
  size: number
  expiryDate?: date // For documents that expire (visas, etc.)
}

// ============ MAIN EMPLOYEE INTERFACE ============

/**
 * Complete Employee Profile (Extended)
 */
export interface Employee {
  id: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  
  personalInfo: PersonalInfo
  contactInfo: ContactInfo
  employmentInfo: EmploymentInfo
  
  financialInfo?: FinancialInfo
  leaveBalance?: LeaveBalance
  education?: Education[]
  experience?: WorkExperience[]
  skills?: Skill[]
  certifications?: Certification[]
  documents?: EmployeeDocument[]
  
  profilePictureUrl?: string
  notes?: string
  tags?: string[]
  customFields?: Record<string, any>
  
  // NEW: HRIS extended fields
  attendanceSummary?: {
    presentDays: number
    absentDays: number
    lateDays: number
    leaveDays: number
    overtimeHours: number
    thisMonth: number
  }
  performanceSummary?: {
    lastReviewDate?: Date
    lastRating?: PerformanceRating
    overallScore?: number
    promotionsCount: number
  }
}

// ============ TABLE DISPLAY TYPE ============

export interface EmployeeTableRow {
  id: string
  employeeId: string
  fullName: string
  email: string
  department: DepartmentId
  jobTitle: string
  status: EmployeeStatus
  employmentType: EmploymentType
  hireDate: Date
  phone: string
  workLocation: string
  profilePictureUrl?: string
  isActive: boolean
  
  // NEW: Quick access fields
  grade?: string
  baseSalary?: number
  performanceRating?: PerformanceRating
  attendanceRate?: number
}

// ============ FILTER & SEARCH TYPES ============

export interface EmployeeFilters {
  search?: string
  department?: DepartmentId | 'all'
  status?: EmployeeStatus | 'all'
  employmentType?: EmploymentType | 'all'
  workLocation?: string
  hireDateFrom?: Date
  hireDateTo?: Date
  salaryMin?: number
  salaryMax?: number
  tags?: string[]
  
  // NEW filters
  grade?: string
  performanceRating?: PerformanceRating | 'all'
  hasPendingLeaves?: boolean
  attendanceRateMin?: number
}

export interface EmployeeSortOptions {
  field: keyof EmployeeTableRow
  direction: 'asc' | 'desc'
}

export interface EmployeePaginationOptions {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

// ============ FORM TYPE ============

export interface EmployeeFormData {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  gender: Gender
  nationality: string
  nationalId?: string
  maritalStatus: MaritalStatus
  personalEmail: string
  workEmail?: string
  phone: string
  workPhone?: string
  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactPhone: string
  addressStreet: string
  addressCity: string
  addressState?: string
  addressCountry: string
  addressPostalCode: string
  employeeId: string
  department: DepartmentId
  jobTitle: string
  employmentType: EmploymentType
  status: EmployeeStatus
  hireDate: string
  endDate?: string
  reportsTo?: string
  workLocation: string
  workMode: 'onsite' | 'remote' | 'hybrid'
  baseSalary?: number
  currency?: string
  bankName?: string
  bankAccount?: string
  hasHealthInsurance?: boolean
  hasLifeInsurance?: boolean
  transportAllowance?: number
  housingAllowance?: number
  notes?: string
  tags?: string[]
}

// ============ IMPORT TYPES ============

export interface ExcelImportMapping {
  column: string
  field: keyof EmployeeFormData
  required: boolean
  transform?: (value: any) => any
}

export interface ImportResult {
  success: boolean
  totalRows: number
  importedCount: number
  failedCount: number
  errors: Array<{ row: number; message: string }>
  warnings: Array<{ row: number; message: string }>
}

// ============ API RESPONSE TYPES ============

export interface EmployeeListResponse {
  employees: EmployeeTableRow[]
  pagination: EmployeePaginationResponse
  filters: EmployeeFilters
}

export interface EmployeePaginationResponse {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface EmployeeDetailResponse {
  employee: Employee
  relatedEmployees?: Employee[]
}

// ============ CONFIGURATION OBJECTS ============

export const DEPARTMENTS: Record<DepartmentId, { nameEn: string; nameAr: string; color: string }> = {
  management: { nameEn: 'Management', nameAr: 'الإدارة العليا', color: '#8B5CF6' },
  hr: { nameEn: 'Human Resources', nameAr: 'الموارد البشرية', color: '#EC4899' },
  it: { nameEn: 'IT', nameAr: 'تقنية المعلومات', color: '#3B82F6' },
  finance: { nameEn: 'Finance', nameAr: 'المالية', color: '#10B981' },
  sales: { nameEn: 'Sales', nameAr: 'المبيعات', color: '#F59E0B' },
  marketing: { nameEn: 'Marketing', nameAr: 'التسويق', color: '#EF4444' },
  operations: { nameEn: 'Operations', nameAr: 'العمليات', color: '#6366F1' },
  'customer-service': { nameEn: 'Customer Service', nameAr: 'خدمة العملاء', color: '#14B8A6' },
  legal: { nameEn: 'Legal', nameAr: 'القانوني', color: '#84CC16' },
  other: { nameEn: 'Other', nameAr: 'أخرى', color: '#64748B' },
}

export const EMPLOYMENT_TYPES: Record<EmploymentType, { labelEn: string; labelAr: string; color: string }> = {
  'full-time': { labelEn: 'Full Time', labelAr: 'دوام كامل', color: '#10B981' },
  'part-time': { labelEn: 'Part Time', labelAr: 'دوام جزئي', color: '#3B82F6' },
  contract: { labelEn: 'Contract', labelAr: 'عقد', color: '#F59E0B' },
  intern: { labelEn: 'Intern', labelAr: 'متدرب', color: '#8B5CF6' },
  freelance: { labelEn: 'Freelance', labelAr: 'مستقل', color: '#EC4899' },
}

export const EMPLOYEE_STATUSES: Record<EmployeeStatus, { labelEn: string; labelAr: string; color: string; bgColor: string }> = {
  active: { labelEn: 'Active', labelAr: 'نشط', color: '#10B981', bgColor: '#10B98120' },
  'on-leave': { labelEn: 'On Leave', labelAr: 'في إجازة', color: '#F59E0B', bgColor: '#F59E0B20' },
  terminated: { labelEn: 'Terminated', labelAr: 'منتهي التعاقد', color: '#EF4444', bgColor: '#EF444420' },
  pending: { labelEn: 'Pending', labelAr: 'قيد المراجعة', color: '#6366F1', bgColor: '#6366F120' },
  suspended: { labelEn: 'Suspended', labelAr: 'موقوف', color: '#64748B', bgColor: '#64748B20' },
}

// NEW: Attendance configuration
export const ATTENDANCE_STATUSES: Record<AttendanceStatus, { labelEn: string; labelAr: string; color: string; icon: string }> = {
  present: { labelEn: 'Present', labelAr: 'حاضر', color: '#10B981', icon: '✓' },
  absent: { labelEn: 'Absent', labelAr: 'غائب', color: '#EF4444', icon: '✗' },
  late: { labelEn: 'Late', labelAr: 'متأخر', color: '#F59E0B', icon: '⏰' },
  'half-day': { labelEn: 'Half Day', labelAr: 'نصف يوم', color: '#FB923C', icon: '◐' },
  'on-leave': { labelEn: 'On Leave', labelAr: 'في إجازة', color: '#8B5CF6', icon: '🏖' },
  holiday: { labelEn: 'Holiday', labelAr: 'إجازة رسمية', color: '#06B6D4', icon: '🎉' },
  weekend: { labelEn: 'Weekend', labelAr: 'عطلة نهاية الأسبوع', color: '#64748B', icon: '📅' },
}

export const SHIFT_TYPES: Record<ShiftType, { labelEn: string; labelAr: string; timeRange: string }> = {
  regular: { labelEn: 'Regular', labelAr: 'عادي', timeRange: '9:00 - 17:00' },
  morning: { labelEn: 'Morning', labelAr: 'صباحي', timeRange: '7:00 - 15:00' },
  evening: { labelEn: 'Evening', labelAr: 'مسائي', timeRange: '15:00 - 23:00' },
  night: { labelEn: 'Night', labelAr: 'ليلي', timeRange: '23:00 - 7:00' },
  rotating: { labelEn: 'Rotating', labelAr: 'دوار', timeRange: 'متغير' },
  flexible: { labelEn: 'Flexible', labelAr: 'مرن', timeRange: 'مرن' },
}

// NEW: Leave types configuration (MENA-specific)
export const LEAVE_TYPES: Record<LeaveType, { 
  labelEn: string; 
  labelAr: string; 
  color: string;
  paid: boolean;
  maxDays: number;
  requiresDocument: boolean;
  approvalLevel: 'manager' | 'hr' | 'executive';
}> = {
  annual: { labelEn: 'Annual Leave', labelAr: 'إجازة سنوية', color: '#3B82F6', paid: true, maxDays: 21, requiresDocument: false, approvalLevel: 'manager' },
  sick: { labelEn: 'Sick Leave', labelAr: 'إجازة مرضية', color: '#EF4444', paid: true, maxDays: 120, requiresDocument: true, approvalLevel: 'manager' },
  unpaid: { labelEn: 'Unpaid Leave', labelAr: 'إجازة بدون راتب', color: '#64748B', paid: false, maxDays: 90, requiresDocument: false, approvalLevel: 'hr' },
  emergency: { labelEn: 'Emergency Leave', labelAr: 'إجازة طارئة', color: '#F59E0B', paid: true, maxDays: 7, requiresDocument: false, approvalLevel: 'manager' },
  maternity: { labelEn: 'Maternity Leave', labelAr: 'إجازة أمومة', color: '#EC4899', paid: true, maxDays: 170, requiresDocument: true, approvalLevel: 'hr' },
  paternity: { labelEn: 'Paternity Leave', labelAr: 'إجازة أبوة', color: '#8B5CF6', paid: true, maxDays: 3, requiresDocument: false, approvalLevel: 'manager' },
  hajj: { labelEn: 'Hajj Leave', labelAr: 'إجازة حج', color: '#14B8A6', paid: true, maxDays: 21, requiresDocument: false, approvalLevel: 'hr' },
  umrah: { labelEn: 'Umrah Leave', labelAr: 'إجازة عمرة', color: '#06B6D4', paid: true, maxDays: 10, requiresDocument: false, approvalLevel: 'manager' },
  mourning: { labelEn: 'Bereavement Leave', labelAr: 'إجازة عزاء', color: '#64748B', paid: true, maxDays: 5, requiresDocument: false, approvalLevel: 'manager' },
  wedding: { labelEn: 'Wedding Leave', labelAr: 'إجازة زواج', color: '#F472B6', paid: true, maxDays: 5, requiresDocument: false, approvalLevel: 'manager' },
  study: { labelEn: 'Study Leave', labelAr: 'إجازة دراسية', color: '#A78BFA', paid: false, maxDays: 365, requiresDocument: true, approvalLevel: 'executive' },
  compensatory: { labelEn: 'Compensatory Off', labelAr: 'راحة بدلية', color: '#34D399', paid: true, maxDays: 30, requiresDocument: false, approvalLevel: 'manager' },
}

// NEW: Performance configuration
export const PERFORMANCE_RATINGS: Record<PerformanceRating, { 
  labelEn: string; 
  labelAr: string; 
  color: string; 
  bgColor: string;
  minScore: number;
  maxScore: number;
}> = {
  exceptional: { labelEn: 'Exceptional', labelAr: 'استثنائي', color: '#8B5CF6', bgColor: '#8B5CF620', minScore: 90, maxScore: 100 },
  'exceeds-expectations': { labelEn: 'Exceeds Expectations', labelAr: 'يتجاوز التوقعات', color: '#3B82F6', bgColor: '#3B82F620', minScore: 75, maxScore: 89 },
  'meets-expectations': { labelEn: 'Meets Expectations', labelAr: 'يلبي التوقعات', color: '#10B981', bgColor: '#10B98120', minScore: 60, maxScore: 74 },
  'needs-improvement': { labelEn: 'Needs Improvement', labelAr: 'يحتاج تحسين', color: '#F59E0B', bgColor: '#F59E0B20', minScore: 40, maxScore: 59 },
  unsatisfactory: { labelEn: 'Unsatisfactory', labelAr: 'غير مرضي', color: '#EF4444', bgColor: '#EF444420', minScore: 0, maxScore: 39 },
}

// NEW: Salary component templates
export const SALARY_COMPONENT_TEMPLATES: Partial<SalaryComponent>[] = [
  { id: 'base', name: 'Basic Salary', nameAr: 'الراتب الأساسي', type: 'earning', isFixed: true, isTaxable: true, isGOSIApplicable: true, category: 'basic', priority: 1 },
  { id: 'housing', name: 'Housing Allowance', nameAr: 'بدل سكن', type: 'earning', isFixed: true, isTaxable: false, isGOSIApplicable: true, category: 'allowance', priority: 2 },
  { id: 'transport', name: 'Transport Allowance', nameAr: 'بدل نقل', type: 'earning', isFixed: true, isTaxable: false, isGOSIApplicable: true, category: 'allowance', priority: 3 },
  { id: 'phone', name: 'Phone Allowance', nameAr: 'بدل هاتف', type: 'earning', isFixed: true, isTaxable: false, isGOSIApplicable: false, category: 'allowance', priority: 4 },
  { id: 'food', name: 'Food Allowance', nameAr: 'بدل طعام', type: 'earning', isFixed: true, isTaxable: false, isGOSIApplicable: false, category: 'allowance', priority: 5 },
  { id: 'gosi-employee', name: 'GOSI (Employee)', nameAr: 'التأمينات (موظف)', type: 'deduction', isFixed: true, isTaxable: false, isGOSIApplicable: true, category: 'social', priority: 10 },
  { id: 'income-tax', name: 'Income Tax', nameAr: 'ضريبة الدخل', type: 'tax', isFixed: false, isTaxable: false, isGOSIApplicable: false, category: 'tax', priority: 11 },
]

// ============ HELPER FUNCTIONS ============

export function getFullName(personalInfo: PersonalInfo): string {
  if (personalInfo.middleName) {
    return `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`
  }
  return `${personalInfo.firstName} ${personalInfo.lastName}`
}

export function employeeToTableRow(employee: Employee): EmployeeTableRow {
  return {
    id: employee.id,
    employeeId: employee.employmentInfo.employeeId,
    fullName: getFullName(employee.personalInfo),
    email: employee.contactInfo.personalEmail || employee.contactInfo.workEmail || '',
    department: employee.employmentInfo.department,
    jobTitle: employee.employmentInfo.jobTitle,
    status: employee.employmentInfo.status,
    employmentType: employee.employmentInfo.employmentType,
    hireDate: employee.employmentInfo.hireDate,
    phone: employee.contactInfo.phone,
    workLocation: employee.employmentInfo.workLocation,
    profilePictureUrl: employee.profilePictureUrl,
    isActive: employee.employmentInfo.status === 'active',
    grade: employee.employmentInfo.grade,
    baseSalary: employee.financialInfo?.baseSalary,
    performanceRating: employee.performanceSummary?.lastRating,
    attendanceRate: employee.attendanceSummary ? 
      Math.round((employee.attendanceSummary.presentDays / (employee.attendanceSummary.presentDays + employee.attendanceSummary.absentDays)) * 100) : undefined,
  }
}

export function createEmptyFormData(): EmployeeFormData {
  return {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    nationality: '',
    maritalStatus: 'single',
    personalEmail: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    addressStreet: '',
    addressCity: '',
    addressCountry: '',
    addressPostalCode: '',
    employeeId: '',
    department: 'other',
    jobTitle: '',
    employmentType: 'full-time',
    status: 'pending',
    hireDate: new Date().toISOString().split('T')[0],
    workLocation: '',
    workMode: 'onsite',
    currency: 'EGP',
    notes: '',
    tags: [],
  }
}

// NEW: Helper functions for HRIS

/**
 * Calculate attendance rate percentage
 */
export function calculateAttendanceRate(present: number, absent: number, totalWorkingDays: number): number {
  if (totalWorkingDays === 0) return 0
  return Math.round((present / totalWorkingDays) * 100)
}

/**
 * Calculate turnover rate
 */
export function calculateTurnoverRate(separations: number, avgHeadcount: number): number {
  if (avgHeadcount === 0) return 0
  return Math.round((separations / avgHeadcount) * 100 * 100) / 100
}

/**
 * Get performance rating from score
 */
export function getRatingFromScore(score: number): PerformanceRating {
  if (score >= 90) return 'exceptional'
  if (score >= 75) return 'exceeds-expectations'
  if (score >= 60) return 'meets-expectations'
  if (score >= 40) return 'needs-improvement'
  return 'unsatisfactory'
}

/**
 * Calculate net salary from components
 */
export function calculateNetSalary(
  baseSalary: number,
  earnings: Array<{ amount: number }>,
  deductions: Array<{ amount: number }>
): number {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0)
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0)
  return baseSalary + totalEarnings - totalDeductions
}

/**
 * Format currency with Arabic support
 */
export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  const formatter = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}
