/**
 * Employee Management System - Type Definitions
 * 
 * Based on HRIS best practices research:
 * - https://www.aihr.com/blog/human-resources-information-system-hris
 * - https://resources.workable.com/tutorial/hris-software-features
 * - https://databasesample.com/database/employee-management-system-database
 */

// ============ ENUMS ============

/** Employment type */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern' | 'freelance'

/** Current employment status */
export type EmployeeStatus = 'active' | 'on-leave' | 'terminated' | 'pending' | 'suspended'

/** Gender */
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say'

/** Marital status */
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'

/** Department IDs (can be extended) */
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

// ============ INTERFACES ============

/**
 * Personal Information
 * Core identity data for each employee
 */
export interface PersonalInfo {
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: Date
  gender: Gender
  nationality: string
  nationalId?: string // National ID or SSN (encrypted in production)
  maritalStatus: MaritalStatus
}

/**
 * Contact Information
 * How to reach the employee
 */
export interface ContactInfo {
  personalEmail: string
  workEmail?: string
  phone: string // Mobile number
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
 * Job-related data
 */
export interface EmploymentInfo {
  employeeId: string // Unique employee identifier (e.g., EMP-001)
  department: DepartmentId
  jobTitle: string
  employmentType: EmploymentType
  status: EmployeeStatus
  hireDate: Date
  endDate?: Date // For contract employees or terminated
  reportsTo?: string // Employee ID of manager
  workLocation: string // Office location or "Remote"
  workMode: 'onsite' | 'remote' | 'hybrid'
}

/**
 * Financial Information
 * Salary and payment details
 */
export interface FinancialInfo {
  baseSalary: number // Monthly/Annual base salary
  currency: string // ISO currency code (e.g., EGP, USD, SAR)
  bankName?: string
  bankAccount?: string // Masked account number
  iban?: string // For international transfers
  taxId?: string
  /** Deductions and benefits will be calculated based on these */
  hasHealthInsurance: boolean
  hasLifeInsurance: boolean
  transportAllowance?: number
  housingAllowance?: number
  otherAllowances?: Record<string, number>
}

/**
 * Leave Balance
 * Track available leave days
 */
export interface LeaveBalance {
  annualLeave: { total: number; used: number; unit: 'days' }
  sickLeave: { total: number; used: number; unit: 'days' }
  unpaidLeave: { total: number; used: number; unit: 'days' }
  maternityLeave?: { total: number; used: number; unit: 'days' }
  paternityLeave?: { total: number; used: number; unit: 'days' }
  specialLeave?: { total: number; used: number; unit: 'days' }
}

/**
 * Education & Qualifications
 */
export interface Education {
  degree: string // e.g., Bachelor's, Master's, PhD
  field: string // e.g., Computer Science, Business
  institution: string
  graduationYear: number
  gpa?: number
}

/**
 * Work Experience (previous jobs)
 */
export interface WorkExperience {
  company: string
  position: string
  startDate: Date
  endDate?: Date
  description?: string
}

/**
 * Skills & Certifications
 */
export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'language' | 'tool'
}

export interface Certification {
  name: string
  issuer: string
  issueDate: Date
  expiryDate?: Date
  credentialUrl?: string
}

/**
 * Documents
 * Files attached to employee profile
 */
export interface EmployeeDocument {
  id: string
  name: string
  type: 'cv' | 'contract' | 'id-copy' | 'certificate' | 'other'
  url: string // File URL or path
  uploadedAt: Date
  uploadedBy: string // User ID who uploaded
  size: number // File size in bytes
}

// ============ MAIN EMPLOYEE INTERFACE ============

/**
 * Complete Employee Profile
 * Aggregates all employee information
 */
export interface Employee {
  // System fields
  id: string // UUID or custom ID
  createdAt: Date
  updatedAt: Date
  createdBy?: string // User ID who created this record
  
  // Core information (always required)
  personalInfo: PersonalInfo
  contactInfo: ContactInfo
  employmentInfo: EmploymentInfo
  
  // Extended information (may be optional initially)
  financialInfo?: FinancialInfo
  leaveBalance?: LeaveBalance
  education?: Education[]
  experience?: WorkExperience[]
  skills?: Skill[]
  certifications?: Certification[]
  documents?: EmployeeDocument[]
  
  // Profile picture
  profilePictureUrl?: string
  
  // Notes and metadata
  notes?: string
  tags?: string[] // Custom tags for filtering
  customFields?: Record<string, any> // Flexible field storage
}

// ============ TABLE DISPLAY TYPES ============

/**
 * Simplified employee for table display
 * Optimized for performance - doesn't load all nested data
 */
export interface EmployeeTableRow {
  id: string
  employeeId: string
  fullName: string // Computed from personalInfo
  email: string // From contactInfo
  department: DepartmentId
  jobTitle: string
  status: EmployeeStatus
  employmentType: EmploymentType
  hireDate: Date
  phone: string
  workLocation: string
  profilePictureUrl?: string
  isActive: boolean // Computed from status
}

// ============ FILTER & SEARCH TYPES ============

export interface EmployeeFilters {
  search?: string // Text search across name, email, ID
  department?: DepartmentId | 'all'
  status?: EmployeeStatus | 'all'
  employmentType?: EmploymentType | 'all'
  workLocation?: string
  hireDateFrom?: Date
  hireDateTo?: Date
  salaryMin?: number
  salaryMax?: number
  tags?: string[]
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

// ============ FORM TYPES ============

/**
 * Data structure for create/edit form
 * Flattened for easier form handling
 */
export interface EmployeeFormData {
  // Personal
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string // ISO date string for form input
  gender: Gender
  nationality: string
  nationalId?: string
  maritalStatus: MaritalStatus
  
  // Contact
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
  
  // Employment
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
  
  // Financial (optional)
  baseSalary?: number
  currency?: string
  bankName?: string
  bankAccount?: string
  hasHealthInsurance?: boolean
  hasLifeInsurance?: boolean
  transportAllowance?: number
  housingAllowance?: number
  
  // Additional
  notes?: string
  tags?: string[]
}

// ============ IMPORT TYPES ============

/**
 * Structure for Excel import mapping
 */
export interface ExcelImportMapping {
  column: string // Excel column header
  field: keyof EmployeeFormData // Target form field
  required: boolean
  transform?: (value: any) => any // Optional value transformer
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
  relatedEmployees?: Employee[] // Team members, manager, etc.
}

// ============ DEPARTMENT CONFIG ============

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

// ============ HELPER FUNCTIONS ============

/**
 * Get full name from personal info
 */
export function getFullName(personalInfo: PersonalInfo): string {
  if (personalInfo.middleName) {
    return `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`
  }
  return `${personalInfo.firstName} ${personalInfo.lastName}`
}

/**
 * Convert Employee to TableRow format
 */
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
  }
}

/**
 * Create empty form data with defaults
 */
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
