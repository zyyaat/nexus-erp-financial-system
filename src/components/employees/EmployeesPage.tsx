'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  X
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockEmployees } from '@/lib/data/mockEmployees'
import type { 
  Employee, 
  EmployeeTableRow, 
  EmployeeFilters, 
  DepartmentId, 
  EmployeeStatus, 
  EmploymentType,
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  EMPLOYEE_STATUSES,
  employeeToTableRow 
} from '@/lib/types/employee'

// ============ TYPES ============

interface EmployeesPageProps {
  className?: string
}

type SortField = 'fullName' | 'employeeId' | 'department' | 'jobTitle' | 'status' | 'hireDate' | 'employmentType'
type SortDirection = 'asc' | 'desc'

// ============ MAIN COMPONENT ============

export default function EmployeesPage({ className = '' }: EmployeesPageProps) {
  const { t, language, dir } = useI18n()
  const isRTL = dir === 'rtl'

  // State
  const [employees] = useState<Employee[]>(mockEmployees)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<EmployeeFilters>({
    department: 'all',
    status: 'all',
    employmentType: 'all'
  })
  const [sortField, setSortField] = useState<SortField>('hireDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Dialog states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  // ============ COMPUTED VALUES ============

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    let result = employees.map(employeeToTableRow)

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(emp =>
        emp.fullName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeId.toLowerCase().includes(query) ||
        emp.jobTitle.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      )
    }

    // Department filter
    if (filters.department && filters.department !== 'all') {
      result = result.filter(emp => emp.department === filters.department)
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(emp => emp.status === filters.status)
    }

    // Employment type filter
    if (filters.employmentType && filters.employmentType !== 'all') {
      result = result.filter(emp => emp.employmentType === filters.employmentType)
    }

    return result
  }, [employees, searchQuery, filters])

  // Sort employees
  const sortedEmployees = useMemo(() => {
    const sorted = [...filteredEmployees]
    
    sorted.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      // Handle dates
      if (sortField === 'hireDate') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      // Handle strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredEmployees, sortField, sortDirection])

  // Paginate employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedEmployees.slice(startIndex, startIndex + pageSize)
  }, [sortedEmployees, currentPage, pageSize])

  // Pagination info
  const totalPages = Math.ceil(sortedEmployees.length / pageSize)
  const totalItems = sortedEmployees.length
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Statistics
  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.employmentInfo.status === 'active').length,
    onLeave: employees.filter(e => e.employmentInfo.status === 'on-leave').length,
    terminated: employees.filter(e => e.employmentInfo.status === 'terminated').length,
    pending: employees.filter(e => e.employmentInfo.status === 'pending').length,
  }), [employees])

  // ============ HANDLERS ============

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsAddDialogOpen(true) // Reuse add dialog for editing
  }

  const handleDeleteEmployee = (employee: Employee) => {
    // TODO: Implement delete with confirmation
    console.log('Delete employee:', employee.id)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      department: 'all',
      status: 'all',
      employmentType: 'all'
    })
  }

  const hasActiveFilters = searchQuery || 
    (filters.department && filters.department !== 'all') || 
    (filters.status && filters.status !== 'all') ||
    (filters.employmentType && filters.employmentType !== 'all')

  // ============ RENDER HELPERS ============

  const getStatusBadge = (status: EmployeeStatus) => {
    const config = EMPLOYEE_STATUSES[status]
    return (
      <Badge 
        variant="secondary" 
        style={{ 
          backgroundColor: config.bgColor, 
          color: config.color,
          border: `1px solid ${config.color}30`
        }}
      >
        {language === 'ar' ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const getEmploymentTypeBadge = (type: EmploymentType) => {
    const config = EMPLOYMENT_TYPES[type]
    return (
      <Badge variant="outline" style={{ color: config.color }}>
        {language === 'ar' ? config.labelAr : config.labelEn}
      </Badge>
    )
  }

  const getDepartmentBadge = (dept: DepartmentId) => {
    const config = DEPARTMENTS[dept]
    return (
      <Badge 
        variant="outline" 
        style={{ 
          color: config.color,
          borderColor: config.color
        }}
      >
        {language === 'ar' ? config.nameAr : config.nameEn}
      </Badge>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // ============ RENDER ============

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users size={32} />
            {language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}
          </h1>
          <p className="text-gray-400 mt-1">
            {language === 'ar' 
              ? `${stats.total} موظف في النظام` 
              : `${stats.total} employees in the system`}
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Import Button */}
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload size={16} />
                {language === 'ar' ? 'استيراد' : 'Import'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'استيراد موظفين من Excel' : 'Import Employees from Excel'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-8 text-center text-gray-500">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>{language === 'ar' ? 'قريباً...' : 'Coming soon...'}</p>
                <p className="text-sm mt-2">
                  {language === 'ar' 
                    ? 'سيتم دعم استيراد ملفات Excel و CSV قريباً' 
                    : 'Excel and CSV file import will be available soon'}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            {language === 'ar' ? 'تصدير' : 'Export'}
          </Button>

          {/* Add Employee Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-cyan-500 hover:bg-cyan-600">
                <Plus size={16} />
                {language === 'ar' ? 'إضافة موظف' : 'Add Employee'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-8 text-center text-gray-500">
                <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p>{language === 'ar' ? 'قريباً...' : 'Coming soon...'}</p>
                <p className="text-sm mt-2">
                  {language === 'ar' 
                    ? 'سيتم دعم إضافة وتعديل الموظفين قريباً' 
                    : 'Employee form will be available soon'}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي' : 'Total'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <UserCheck size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-xs text-gray-400">{language === 'ar' ? 'نشط' : 'Active'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Users size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.onLeave}</p>
              <p className="text-xs text-gray-400">{language === 'ar' ? 'في إجازة' : 'On Leave'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <UserPlus size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-gray-400">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 col-span-2 md:col-span-1">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <UserX size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.terminated}</p>
              <p className="text-xs text-gray-400">{language === 'ar' ? 'منتهي' : 'Terminated'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4 ${isRTL ? 'left-auto right-3' : ''}`} />
              <Input
                placeholder={language === 'ar' ? 'بحث بالاسم، البريد، الرقم الوظيفي...' : 'Search by name, email, ID...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isRTL ? 'pr-10 pl-4' : ''} bg-slate-900/50 border-slate-600`}
              />
            </div>

            {/* Department Filter */}
            <Select 
              value={filters.department} 
              onValueChange={(value) => setFilters({ ...filters, department: value as DepartmentId | 'all' })}
            >
              <SelectTrigger className="w-full lg:w-48 bg-slate-900/50 border-slate-600">
                <SelectValue placeholder={language === 'ar' ? 'القسم' : 'Department'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Departments'}</SelectItem>
                {Object.entries(DEPARTMENTS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {language === 'ar' ? value.nameAr : value.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({ ...filters, status: value as EmployeeStatus | 'all' })}
            >
              <SelectTrigger className="w-full lg:w-44 bg-slate-900/50 border-slate-600">
                <SelectValue placeholder={language === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</SelectItem>
                {Object.entries(EMPLOYEE_STATUSES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {language === 'ar' ? value.labelAr : value.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Employment Type Filter */}
            <Select 
              value={filters.employmentType} 
              onValueChange={(value) => setFilters({ ...filters, employmentType: value as EmploymentType | 'all' })}
            >
              <SelectTrigger className="w-full lg:w-44 bg-slate-900/50 border-slate-600">
                <SelectValue placeholder={language === 'ar' ? 'نوع التوظيف' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All Types'}</SelectItem>
                {Object.entries(EMPLOYMENT_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {language === 'ar' ? value.labelAr : value.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} className={isRTL ? 'ml-1' : 'mr-1'} />
                {language === 'ar' ? 'مسح' : 'Clear'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-semibold w-12">
                    #
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('fullName')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'الاسم' : 'Name'}
                      <ArrowUpDown size={14} className={sortField === 'fullName' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors hidden md:table-cell"
                    onClick={() => handleSort('employeeId')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'الرقم الوظيفي' : 'ID'}
                      <ArrowUpDown size={14} className={sortField === 'employeeId' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors hidden lg:table-cell"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'القسم' : 'Dept.'}
                      <ArrowUpDown size={14} className={sortField === 'department' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors hidden lg:table-cell"
                    onClick={() => handleSort('jobTitle')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'المسمى الوظيفي' : 'Job Title'}
                      <ArrowUpDown size={14} className={sortField === 'jobTitle' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold hidden xl:table-cell">
                    {language === 'ar' ? 'نوع التوظيف' : 'Type'}
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'الحالة' : 'Status'}
                      <ArrowUpDown size={14} className={sortField === 'status' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors hidden xl:table-cell"
                    onClick={() => handleSort('hireDate')}
                  >
                    <div className="flex items-center gap-1">
                      {language === 'ar' ? 'تاريخ التعيين' : 'Hire Date'}
                      <ArrowUpDown size={14} className={sortField === 'hireDate' ? 'text-cyan-400' : ''} />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-400 font-semibold text-right w-20">
                    {language === 'ar' ? 'إجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((emp, index) => (
                    <TableRow 
                      key={emp.id} 
                      className="border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer"
                      onClick={() => handleViewEmployee(employees.find(e => e.id === emp.id)!)}
                    >
                      <TableCell className="text-gray-400 font-mono text-sm">
                        {startItem + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* Avatar placeholder */}
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                            {emp.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate max-w-[150px]">
                              {emp.fullName}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">
                              {emp.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-300 hidden md:table-cell">
                        {emp.employeeId}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {getDepartmentBadge(emp.department)}
                      </TableCell>
                      <TableCell className="text-gray-300 hidden lg:table-cell">
                        {emp.jobTitle}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {getEmploymentTypeBadge(emp.employmentType)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(emp.status)}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm hidden xl:table-cell">
                        {formatDate(emp.hireDate)}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-40">
                            <DropdownMenuItem 
                              onClick={() => handleViewEmployee(employees.find(e => e.id === emp.id)!)}
                              className="cursor-pointer"
                            >
                              <Eye size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                              {language === 'ar' ? 'عرض' : 'View'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEditEmployee(employees.find(e => e.id === emp.id)!)}
                              className="cursor-pointer"
                            >
                              <Pencil size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                              {language === 'ar' ? 'تعديل' : 'Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteEmployee(employees.find(e => e.id === emp.id)!)}
                              className="cursor-pointer text-red-400 focus:text-red-400"
                            >
                              <Trash2 size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                              {language === 'ar' ? 'حذف' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Users size={48} className="opacity-30" />
                        <p className="text-lg font-medium">
                          {language === 'ar' ? 'لا يوجد موظفون' : 'No employees found'}
                        </p>
                        <p className="text-sm">
                          {language === 'ar' 
                            ? 'جرب تغيير معايير البحث أو أضف موظف جديد' 
                            : 'Try adjusting your search or add a new employee'}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearFilters}
                          className="mt-2"
                        >
                          {language === 'ar' ? 'مسح الفلاتر' : 'Clear filters'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-700/50">
              <div className="text-sm text-gray-400">
                {language === 'ar' 
                  ? `عرض ${startItem}-${endItem} من ${totalItems}`
                  : `Showing ${startItem}-${endItem} of ${totalItems}`
                }
              </div>

              <div className="flex items-center gap-2">
                <Select 
                  value={String(pageSize)} 
                  onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}
                >
                  <SelectTrigger className="w-20 h-8 bg-slate-900/50 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50].map(size => (
                      <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-slate-900/50 border-slate-600 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    <ChevronsLeft size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-slate-900/50 border-slate-600 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                  </Button>
                  
                  <span className="px-3 text-sm text-gray-300 min-w-[80px] text-center">
                    {language === 'ar' 
                      ? `صفحة ${currentPage} من ${totalPages}`
                      : `Page ${currentPage} of ${totalPages}`
                    }
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-slate-900/50 border-slate-600 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-slate-900/50 border-slate-600 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    <ChevronsRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'بيانات الموظف' : 'Employee Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {getFullName(selectedEmployee.personalInfo).charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {getFullName(selectedEmployee.personalInfo)}
                  </h2>
                  <p className="text-gray-400">{selectedEmployee.employmentInfo.employeeId}</p>
                  {getStatusBadge(selectedEmployee.employmentInfo.status)}
                </div>
              </div>

              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'تاريخ الميلاد:' : 'DOB:'}</span>
                    <p className="text-white mt-1">
                      {formatDate(selectedEmployee.personalInfo.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'الجنسية:' : 'Nationality:'}</span>
                    <p className="text-white mt-1">{selectedEmployee.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'الحالة الاجتماعية:' : 'Marital Status:'}</span>
                    <p className="text-white mt-1">
                      {language === 'ar' 
                        ? selectedEmployee.personalInfo.maritalStatus === 'married' ? 'متزوج/ة' :
                          selectedEmployee.personalInfo.maritalStatus === 'single' ? 'أعزب/عزباء' :
                          selectedEmployee.personalInfo.maritalStatus === 'divorced' ? 'مطلق/ة' : 'أرمل/ة'
                        : selectedEmployee.personalInfo.maritalStatus
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                    <p className="text-white mt-1">{selectedEmployee.contactInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Employment Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {language === 'ar' ? 'معلومات التوظيف' : 'Employment Information'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'القسم:' : 'Department:'}</span>
                    <p className="mt-1">{getDepartmentBadge(selectedEmployee.employmentInfo.department)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'المسمى الوظيفي:' : 'Job Title:'}</span>
                    <p className="text-white mt-1">{selectedEmployee.employmentInfo.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'نوع التوظيف:' : 'Employment Type:'}</span>
                    <p className="mt-1">{getEmploymentTypeBadge(selectedEmployee.employmentInfo.employmentType)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'تاريخ التعيين:' : 'Hire Date:'}</span>
                    <p className="text-white mt-1">{formatDate(selectedEmployee.employmentInfo.hireDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'مكان العمل:' : 'Work Location:'}</span>
                    <p className="text-white mt-1">{selectedEmployee.employmentInfo.workLocation}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{language === 'ar' ? 'نمط العمل:' : 'Work Mode:'}</span>
                    <p className="text-white mt-1">
                      {language === 'ar' 
                        ? selectedEmployee.employmentInfo.workMode === 'onsite' ? 'من المكتب' :
                          selectedEmployee.employmentInfo.workMode === 'remote' ? 'عن بعد' : 'هجين'
                        : selectedEmployee.employmentInfo.workMode
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Info (if exists) */}
              {selectedEmployee.financialInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {language === 'ar' ? 'المعلومات المالية' : 'Financial Information'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">{language === 'ar' ? 'المرتب الأساسي:' : 'Base Salary:'}</span>
                      <p className="text-white mt-1">
                        {new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(selectedEmployee.financialInfo.baseSalary)} 
                        {' '}{selectedEmployee.financialInfo.currency}
                      </p>
                    </div>
                    {selectedEmployee.financialInfo.bankName && (
                      <div>
                        <span className="text-gray-400">{language === 'ar' ? 'البنك:' : 'Bank:'}</span>
                        <p className="text-white mt-1">{selectedEmployee.financialInfo.bankName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedEmployee.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </h3>
                  <p className="text-gray-300 text-sm bg-slate-900/50 p-3 rounded-lg">
                    {selectedEmployee.notes}
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedEmployee.tags && selectedEmployee.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEditEmployee(selectedEmployee)
                  }}
                >
                  <Pencil size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    handleDeleteEmployee(selectedEmployee)
                    setIsViewDialogOpen(false)
                  }}
                >
                  <Trash2 size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
