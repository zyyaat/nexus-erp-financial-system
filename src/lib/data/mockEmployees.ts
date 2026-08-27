/**
 * Employee Mock Data
 * 
 * Realistic sample data for development and testing
 * Based on common HR data patterns
 */

import { Employee, DepartmentId, EmployeeStatus, EmploymentType } from '../types/employee'

// ============ MOCK EMPLOYEES ============

export const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-08-20'),
    
    personalInfo: {
      firstName: 'أحمد',
      middleName: 'محمد',
      lastName: 'العلي',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      nationality: 'مصري',
      nationalId: '29005150123456',
      maritalStatus: 'married'
    },
    
    contactInfo: {
      personalEmail: 'ahmed.ali@gmail.com',
      workEmail: 'ahmed.ali@company.com',
      phone: '+20 100 123 4567',
      workPhone: '+20 2 2345 6789',
      emergencyContact: {
        name: 'سارة العلي',
        relationship: 'زوجة',
        phone: '+20 100 987 6543'
      },
      address: {
        street: '15 شارع التحرير',
        city: 'القاهرة',
        state: 'القاهرة',
        country: 'مصر',
        postalCode: '11511'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-001',
      department: 'management' as DepartmentId,
      jobTitle: 'مدير عام',
      employmentType: 'full-time' as EmploymentType,
      status: 'active' as EmployeeStatus,
      hireDate: new Date('2020-03-01'),
      workLocation: 'المقر الرئيسي - القاهرة',
      workMode: 'onsite'
    },
    
    financialInfo: {
      baseSalary: 45000,
      currency: 'EGP',
      bankName: 'البنك الأهلي المصري',
      hasHealthInsurance: true,
      hasLifeInsurance: true,
      transportAllowance: 2000,
      housingAllowance: 5000
    },
    
    leaveBalance: {
      annualLeave: { total: 21, used: 5, unit: 'days' as const },
      sickLeave: { total: 30, used: 2, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    profilePictureUrl: '/avatars/ahmed.jpg',
    notes: 'مدير ذو خبرة 10+ سنوات في إدارة الشركات',
    tags: ['إدارة', 'قيادة']
  },
  
  {
    id: 'emp-002',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-08-18'),
    
    personalInfo: {
      firstName: 'فاطمة',
      lastName: 'حسن',
      dateOfBirth: new Date('1992-08-22'),
      gender: 'female',
      nationality: 'مصرية',
      maritalStatus: 'single'
    },
    
    contactInfo: {
      personalEmail: 'fatma.hassan@yahoo.com',
      workEmail: 'fatma.hassan@company.com',
      phone: '+20 102 345 6789',
      emergencyContact: {
        name: 'محمد حسن',
        relationship: 'أب',
        phone: '+20 111 222 3333'
      },
      address: {
        street: '25 شارع الجيزة',
        city: 'الجيزة',
        state: 'الجيزة',
        country: 'مصر',
        postalCode: '12511'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-002',
      department: 'hr' as DepartmentId,
      jobTitle: 'مديرة الموارد البشرية',
      employmentType: 'full-time' as EmploymentType,
      status: 'active' as EmployeeStatus,
      hireDate: new Date('2021-06-15'),
      reportsTo: 'EMP-001',
      workLocation: 'المقر الرئيسي - القاهرة',
      workMode: 'hybrid'
    },
    
    financialInfo: {
      baseSalary: 28000,
      currency: 'EGP',
      bankName: 'بنك القاهرة',
      hasHealthInsurance: true,
      hasLifeInsurance: false,
      transportAllowance: 1500
    },
    
    leaveBalance: {
      annualLeave: { total: 21, used: 12, unit: 'days' as const },
      sickLeave: { total: 30, used: 8, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const },
      maternityLeave: { total: 90, used: 0, unit: 'days' as const }
    },
    
    profilePictureUrl: '/avatars/fatma.jpg',
    tags: ['HR', 'توظيف', 'تدريب']
  },
  
  {
    id: 'emp-003',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-08-22'),
    
    personalInfo: {
      firstName: 'محمد',
      lastName: 'إبراهيم',
      dateOfBirth: new Date('1988-12-10'),
      gender: 'male',
      nationality: 'سعودي',
      maritalStatus: 'married'
    },
    
    contactInfo: {
      personalEmail: 'm.ibrahim@hotmail.com',
      workEmail: 'm.ibrahim@company.com',
      phone: '+966 50 123 4567',
      workPhone: '+966 11 234 5678',
      emergencyContact: {
        name: 'نورة إبراهيم',
        relationship: 'زوجة',
        phone: '+966 50 987 6543'
      },
      address: {
        street: 'شارع الملك فهد',
        city: 'الرياض',
        state: 'الرياض',
        country: 'السعودية',
        postalCode: '11564'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-003',
      department: 'it' as DepartmentId,
      jobTitle: 'قائد فريق تطوير البرمجيات',
      employmentType: 'full-time' as EmploymentType,
      status: 'active' as EmployeeStatus,
      hireDate: new Date('2019-09-01'),
      reportsTo: 'EMP-001',
      workLocation: 'الرياض',
      workMode: 'remote'
    },
    
    financialInfo: {
      baseSalary: 38000,
      currency: 'SAR',
      bankName: 'البنك الأهلي السعودي',
      hasHealthInsurance: true,
      hasLifeInsurance: true,
      transportAllowance: 0,
      housingAllowance: 8000
    },
    
    leaveBalance: {
      annualLeave: { total: 30, used: 18, unit: 'days' as const },
      sickLeave: { total: 120, used: 5, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    education: [
      {
        degree: 'بكالوريوس',
        field: 'علوم الحاسب',
        institution: 'جامعة الملك سعود',
        graduationYear: 2011,
        gpa: 3.8
      },
      {
        degree: 'ماجستير',
        field: 'هندسة البرمجيات',
        institution: "King's College London",
        graduationYear: 2015
      }
    ],
    
    skills: [
      { name: 'React', level: 'expert', category: 'technical' as const },
      { name: 'TypeScript', level: 'advanced', category: 'technical' as const },
      { name: 'Node.js', level: 'advanced', category: 'technical' as const },
      { name: 'قيادة الفرق', level: 'advanced', category: 'soft' as const },
      { name: 'English', level: 'fluent', category: 'language' as const }
    ],
    
    profilePictureUrl: '/avatars/mohammed.jpg',
    notes: 'خبير في React و Next.js، قاد فريق 8 مطورين',
    tags: ['IT', 'تطوير', 'قيادة']
  },
  
  {
    id: 'emp-004',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-07-30'),
    
    personalInfo: {
      firstName: 'سارة',
      lastName: 'أحمد',
      dateOfBirth: new Date('1995-03-18'),
      gender: 'female',
      nationality: 'إماراتية',
      maritalStatus: 'single'
    },
    
    contactInfo: {
      personalEmail: 'sara.a@outlook.com',
      workEmail: 'sara.ahmed@company.com',
      phone: '+971 50 123 4567',
      emergencyContact: {
        name: 'أحمد محمد',
        relationship: 'أخ',
        phone: '+971 55 987 6543'
      },
      address: {
        street: 'شارع الشيخ زايد',
        city: 'دبي',
        state: 'دبي',
        country: 'الإمارات',
        postalCode: '00000'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-004',
      department: 'finance' as DepartmentId,
      jobTitle: 'محاسبة أولى',
      employmentType: 'full-time' as EmploymentType,
      status: 'on-leave' as EmployeeStatus,
      hireDate: new Date('2022-01-15'),
      reportsTo: 'EMP-001',
      workLocation: 'دبي',
      workMode: 'hybrid'
    },
    
    financialInfo: {
      baseSalary: 25000,
      currency: 'AED',
      bankName: 'بنك دبي الإسلامي',
      hasHealthInsurance: true,
      hasLifeInsurance: true
    },
    
    leaveBalance: {
      annualLeave: { total: 25, used: 25, unit: 'days' as const },
      sickLeave: { total: 30, used: 3, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    profilePictureUrl: '/avatars/sara.jpg',
    notes: 'في إجازة أمومة حتى نهاية سبتمبر 2024',
    tags: ['مالية', 'محاسبة']
  },
  
  {
    id: 'emp-005',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-08-21'),
    
    personalInfo: {
      firstName: 'عمر',
      lastName: 'خالد',
      dateOfBirth: new Date('1993-07-25'),
      gender: 'male',
      nationality: 'أردني',
      maritalStatus: 'married'
    },
    
    contactInfo: {
      personalEmail: 'omar.khaled@gmail.com',
      workEmail: 'omar.khaled@company.com',
      phone: '+962 79 123 4567',
      emergencyContact: {
        name: 'ليلى خالد',
        relationship: 'زوجة',
        phone: '+962 79 987 6543'
      },
      address: {
        street: 'شوارع عبدالله',
        city: 'عمّان',
        state: 'عمّان',
        country: 'الأردن',
        postalCode: '11181'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-005',
      department: 'sales' as DepartmentId,
      jobTitle: 'مدير المبيعات',
      employmentType: 'full-time' as EmploymentType,
      status: 'active' as EmployeeStatus,
      hireDate: new Date('2021-11-01'),
      reportsTo: 'EMP-001',
      workLocation: 'عمّان + عن بعد',
      workMode: 'hybrid'
    },
    
    financialInfo: {
      baseSalary: 2200,
      currency: 'JOD',
      bankName: 'البنك العربي',
      hasHealthInsurance: true,
      hasLifeInsurance: false,
      transportAllowance: 300,
      housingAllowance: 400
    },
    
    leaveBalance: {
      annualLeave: { total: 14, used: 7, unit: 'days' as const },
      sickLeave: { total: 30, used: 1, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    skills: [
      { name: 'المبيعات', level: 'expert', category: 'technical' as const },
      { name: 'التسويق الرقمي', level: 'intermediate', category: 'technical' as const },
      { name: 'التفاوض', level: 'advanced', category: 'soft' as const },
      { name: 'Arabic', level: 'native', category: 'language' as const },
      { name: 'English', level: 'professional', category: 'language' as const }
    ],
    
    certifications: [
      {
        name: 'Certified Sales Professional (CSP)',
        issuer: 'Sales Management Association',
        issueDate: new Date('2022-06-15')
      }
    ],
    
    profilePictureUrl: '/avatars/omar.jpg',
    notes: 'حقق نمو 40% في المبيعات خلال 2023',
    tags: ['مبيعات', 'تسويق']
  },
  
  {
    id: 'emp-006',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-08-19'),
    
    personalInfo: {
      firstName: 'نور',
      lastName: 'الحسين',
      dateOfBirth: new Date('1998-11-30'),
      gender: 'female',
      nationality: 'لبنانية',
      maritalStatus: 'single'
    },
    
    contactInfo: {
      personalEmail: 'noor.h@icloud.com',
      workEmail: 'noor.hussain@company.com',
      phone: '+961 71 123 456',
      emergencyContact: {
        name: 'سميرة الحسين',
        relationship: 'أم',
        phone: '+961 3 987 654'
      },
      address: {
        street: 'شارع Bliss',
        city: 'بيروت',
        state: 'بيروت',
        country: 'لبنان',
        postalCode: '1100'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-006',
      department: 'marketing' as DepartmentId,
      jobTitle: 'أخصائية تسويق رقمي',
      employmentType: 'contract' as EmploymentType,
      status: 'active' as EmployeeStatus,
      hireDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      reportsTo: 'emp-005',
      workLocation: 'عن بعد',
      workMode: 'remote'
    },
    
    financialInfo: {
      baseSalary: 1800,
      currency: 'USD',
      hasHealthInsurance: false,
      hasLifeInsurance: false
    },
    
    leaveBalance: {
      annualLeave: { total: 18, used: 2, unit: 'days' as const },
      sickLeave: { total: 14, used: 0, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    skills: [
      { name: 'SEO', level: 'advanced', category: 'technical' as const },
      { name: 'Google Ads', level: 'advanced', category: 'technical' as const },
      { name: 'Social Media Marketing', level: 'expert', category: 'technical' as const },
      { name: 'Content Writing', level: 'intermediate', category: 'soft' as const }
    ],
    
    profilePictureUrl: '/avatars/noor.jpg',
    notes: 'عقد لمدة سنة مع احتمالية التجديد',
    tags: ['تسويق', 'سوشيال ميديا']
  },
  
  {
    id: 'emp-007',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-08-22'),
    
    personalInfo: {
      firstName: 'كريم',
      lastName: 'عبدالله',
      dateOfBirth: new Date('1996-04-12'),
      gender: 'male',
      nationality: 'مغربي',
      maritalStatus: 'single'
    },
    
    contactInfo: {
      personalEmail: 'karim.abd@gmail.com',
      workEmail: 'karim.abdullah@company.com',
      phone: '+212 6 12 34 56 78',
      emergencyContact: {
        name: 'فاطمة عبدالله',
        relationship: 'أخت',
        phone: '+212 6 87 65 43 21'
      },
      address: {
        street: 'شارع محمد الخامس',
        city: 'الدار البيضاء',
        state: 'الدار البيضاء',
        country: 'المغرب',
        postalCode: '20000'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-007',
      department: 'it' as DepartmentId,
      jobTitle: 'مطور Frontend مبتدئ',
      employmentType: 'intern' as EmploymentType,
      status: 'pending' as EmployeeStatus,
      hireDate: new Date('2024-08-26'), // Future hire date
      reportsTo: 'EMP-003',
      workLocation: 'عن بعد',
      workMode: 'remote'
    },
    
    financialInfo: {
      baseSalary: 6000,
      currency: 'MAD',
      hasHealthInsurance: false,
      hasLifeInsurance: false
    },
    
    leaveBalance: {
      annualLeave: { total: 0, used: 0, unit: 'days' as const },
      sickLeave: { total: 0, used: 0, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    education: [
      {
        degree: 'بكالوريوس',
        field: 'هندسة البرمجيات',
        institution: "École Mohammadia d'Ingénieurs",
        graduationYear: 2024
      }
    ],
    
    skills: [
      { name: 'HTML/CSS', level: 'intermediate', category: 'technical' as const },
      { name: 'JavaScript', level: 'beginner', category: 'technical' as const },
      { name: 'React', level: 'beginner', category: 'technical' as const },
      { name: 'French', level: 'native', category: 'language' as const },
      { name: 'Arabic', level: 'native', category: 'language' as const }
    ],
    
    profilePictureUrl: null, // No photo yet
    notes: 'متدرب جديد - يبدأ العمل في أغسطس 2024',
    tags: ['IT', 'تدريب', 'Frontend']
  },

  {
    id: 'emp-008',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-06-01'),
    
    personalInfo: {
      firstName: 'ليلى',
      lastName: 'منصور',
      dateOfBirth: new Date('1985-09-08'),
      gender: 'female',
      nationality: 'تونسية',
      maritalStatus: 'divorced'
    },
    
    contactInfo: {
      personalEmail: 'layla.mansour@yahoo.fr',
      workEmail: 'layla.mansour@company.com',
      phone: '+216 98 123 456',
      emergencyContact: {
        name: 'منير منصور',
        relationship: 'أخ',
        phone: '+216 97 654 321'
      },
      address: {
        street: 'شارع الحبيب بورقيبة',
        city: 'تونس',
        state: 'تونس',
        country: 'تونس',
        postalCode: '1000'
      }
    },
    
    employmentInfo: {
      employeeId: 'EMP-008',
      department: 'customer-service' as DepartmentId,
      jobTitle: 'مشرفة خدمة العملاء',
      employmentType: 'part-time' as EmploymentType,
      status: 'terminated' as EmployeeStatus,
      hireDate: new Date('2022-03-01'),
      endDate: new Date('2024-05-31'),
      reportsTo: 'EMP-001',
      workLocation: 'تونس',
      workMode: 'onsite'
    },
    
    financialInfo: {
      baseSalary: 1200,
      currency: 'TND',
      hasHealthInsurance: true,
      hasLifeInsurance: false
    },
    
    leaveBalance: {
      annualLeave: { total: 0, used: 0, unit: 'days' as const }, // All consumed before termination
      sickLeave: { total: 0, used: 0, unit: 'days' as const },
      unpaidLeave: { total: 0, used: 0, unit: 'days' as const }
    },
    
    profilePictureUrl: '/avatars/layla.jpg',
    notes: 'إنهاء العقد بالاتفاق المتبادل',
    tags: ['خدمة عملاء', 'منتهي']
  }
]

// ============ STATISTICS HELPERS ============

/**
 * Get employee count by status
 */
export function getEmployeeCountByStatus(employees: Employee[]): Record<EmployeeStatus, number> {
  return employees.reduce((acc, emp) => {
    const status = emp.employmentInfo.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<EmployeeStatus, number>)
}

/**
 * Get employee count by department
 */
export function getEmployeeCountByDepartment(employees: Employee[]): Record<DepartmentId, number> {
  return employees.reduce((acc, emp) => {
    const dept = emp.employmentInfo.department
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {} as Record<DepartmentId, number>)
}

/**
 * Get active employees only
 */
export function getActiveEmployees(employees: Employee[]): Employee[] {
  return employees.filter(emp => emp.employmentInfo.status === 'active')
}

/**
 * Get recent hires (last N days)
 */
export function getRecentHires(employees: Employee[], days: number = 30): Employee[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  
  return employees.filter(emp => emp.employmentInfo.hireDate >= cutoffDate)
}

/**
 * Get employees on leave
 */
export function getEmployeesOnLeave(employees: Employee[]): Employee[] {
  return employees.filter(emp => emp.employmentInfo.status === 'on-leave')
}
