export type Language = 'ar' | 'en' | 'fr' | 'es'

export interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

export const translations: Translations = {
  // Navigation
  'nav.dashboard': {
    ar: 'لوحة التحكم',
    en: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel de control'
  },
  'nav.operations': {
    ar: 'العمليات',
    en: 'Operations',
    fr: 'Opérations',
    es: 'Operaciones'
  },
  'nav.inventory': {
    ar: 'المخزون',
    en: 'Inventory',
    fr: 'Inventaire',
    es: 'Inventario'
  },
  'nav.financials': {
    ar: 'المالية',
    en: 'Financials',
    fr: 'Finances',
    es: 'Finanzas'
  },
  'nav.analytics': {
    ar: 'التحليلات',
    en: 'Analytics',
    fr: 'Analytiques',
    es: 'Analíticas'
  },
  'nav.settings': {
    ar: 'الإعدادات',
    en: 'Settings',
    fr: 'Paramètres',
    es: 'Configuración'
  },

  // HRIS Navigation
  'nav.hrisDashboard': {
    ar: 'لوحة الموارد البشرية',
    en: 'HR Dashboard',
    fr: 'Tableau de bord RH',
    es: 'Panel de RRHH'
  },
  'nav.employees': {
    ar: 'الموظفون',
    en: 'Employees',
    fr: 'Employés',
    es: 'Empleados'
  },
  'nav.attendance': {
    ar: 'الحضور والغياب',
    en: 'Attendance',
    fr: 'Présence',
    es: 'Asistencia'
  },
  'nav.payroll': {
    ar: 'المرتبات والرواتب',
    en: 'Payroll',
    fr: 'Paie',
    es: 'Nómina'
  },
  'nav.performance': {
    ar: 'تقييم الأداء والترقيات',
    en: 'Performance & Promotions',
    fr: 'Performance et Promotions',
    es: 'Rendimiento y Promociones'
  },
  'nav.leaves': {
    ar: 'إدارة الإجازات',
    en: 'Leave Management',
    fr: 'Gestion des Congés',
    es: 'Gestión de Permisos'
  },

  // Sidebar Bottom
  'nav.systemStatus': {
    ar: 'حالة النظام',
    en: 'System Status',
    fr: 'État du système',
    es: 'Estado del sistema'
  },
  'nav.support': {
    ar: 'الدعم الفني',
    en: 'Support',
    fr: 'Support',
    es: 'Soporte'
  },
  'nav.logout': {
    ar: 'تسجيل الخروج',
    en: 'Logout',
    fr: 'Déconnexion',
    es: 'Cerrar sesión'
  },

  // TopNav
  'search.placeholder': {
    ar: 'بحث...',
    en: 'Search...',
    fr: 'Rechercher...',
    es: 'Buscar...'
  },
  'notifications.title': {
    ar: 'الإشعارات',
    en: 'Notifications',
    fr: 'Notifications',
    es: 'Notificaciones'
  },

  // Dashboard KPIs
  'kpi.totalRevenue': {
    ar: 'إجمالي الإيرادات',
    en: 'Total Revenue',
    fr: 'Revenu total',
    es: 'Ingresos totales'
  },
  'kpi.netProfit': {
    ar: 'صافي الربح',
    en: 'Net Profit',
    fr: 'Bénéfice net',
    es: 'Beneficio neto'
  },
  'kpi.activeUsers': {
    ar: 'المستخدمين النشطين',
    en: 'Active Users',
    fr: 'Utilisateurs actifs',
    es: 'Usuarios activos'
  },
  'kpi.vsLastMonth': {
    ar: 'مقارنة بالشهر الماضي',
    en: 'vs last month',
    fr: 'vs le mois dernier',
    es: 'vs el mes pasado'
  },

  // Charts
  'chart.revenueVsTarget': {
    ar: 'الإيرادات مقابل الهدف',
    en: 'Revenue vs Target',
    fr: 'Revenu vs Objectif',
    es: 'Ingresos vs Objetivo'
  },
  'chart.revenue': {
    ar: 'الإيرادات',
    en: 'Revenue',
    fr: 'Revenu',
    es: 'Ingresos'
  },
  'chart.target': {
    ar: 'الهدف',
    en: 'Target',
    fr: 'Objectif',
    es: 'Objetivo'
  },
  'chart.thisWeek': {
    ar: 'هذا الأسبوع',
    en: 'This Week',
    fr: 'Cette semaine',
    es: 'Esta semana'
  },
  'chart.thisMonth': {
    ar: 'هذا الشهر',
    en: 'This Month',
    fr: 'Ce mois',
    es: 'Este mes'
  },
  'chart.thisYear': {
    ar: 'هذا العام',
    en: 'This Year',
    fr: 'Cette année',
    es: 'Este año'
  },

  // System Health
  'system.systemHealth': {
    ar: 'صحة النظام',
    en: 'System Health',
    fr: 'Santé du système',
    es: 'Salud del sistema'
  },
  'system.serverLoad': {
    ar: 'حمل الخادم',
    en: 'Server Load',
    fr: 'Charge du serveur',
    es: 'Carga del servidor'
  },
  'system.databaseStorage': {
    ar: 'تخزين قاعدة البيانات',
    en: 'Database Storage',
    fr: 'Stockage de la base de données',
    es: 'Almacenamiento de BD'
  },
  'system.apiLatency': {
    ar: 'تأخر API',
    en: 'API Latency',
    fr: 'Latence API',
    es: 'Latencia API'
  },

  // ==================== OPERATIONS PAGE ====================
  'ops.title': {
    ar: 'مركز العمليات',
    en: 'Operations Center',
    fr: 'Centre des opérations',
    es: 'Centro de operaciones'
  },
  'ops.subtitle': {
    ar: 'إدارة وتتبع جميع العمليات اليومية',
    en: 'Monitor production, orders, and maintenance workflows.',
    fr: 'Gérer et suivre toutes les opérations quotidiennes',
    es: 'Gestionar y seguir todas las operaciones diarias'
  },
  
  // Operations KPIs
  'ops.activeProduction': {
    ar: 'الإنتاج النشط',
    en: 'Active Production',
    fr: 'Production active',
    es: 'Producción activa'
  },
  'ops.pendingOrders': {
    ar: 'طلبات معلقة',
    en: 'Pending Orders',
    fr: 'Commandes en attente',
    es: 'Pedidos pendientes'
  },
  'ops.maintenanceTasks': {
    ar: 'مهام الصيانة',
    en: 'Maintenance Tasks',
    fr: 'Tâches de maintenance',
    es: 'Tareas de mantenimiento'
  },
  
  // Operations Stats
  'ops.activeCount': {
    ar: 'نشط',
    en: 'Active',
    fr: 'Actif',
    es: 'Activo'
  },
  'ops.doneCount': {
    ar: 'مكتمل',
    en: 'Done',
    fr: 'Terminé',
    es: 'Completado'
  },
  'ops.pendingCount': {
    ar: 'معلق',
    en: 'Pending',
    fr: 'En attente',
    es: 'Pendiente'
  },
  
  // Operations Sections
  'ops.activeWorkflows': {
    ar: 'سير العمل النشط',
    en: 'Active Workflows',
    fr: 'Flux de travail actifs',
    es: 'Flujos de trabajo activos'
  },
  'ops.activityFeed': {
    ar: 'نشاط حديث',
    en: 'Recent Activity',
    fr: 'Activité récente',
    es: 'Actividad reciente'
  },
  'ops.quickActions': {
    ar: 'إجراءات سريعة',
    en: 'Quick Actions',
    fr: 'Actions rapides',
    es: 'Acciones rápidas'
  },
  'ops.commonTasks': {
    ar: 'مهام شائعة',
    en: 'Common operations tasks',
    fr: 'Tâches courantes',
    es: 'Tareas comunes'
  },
  
  // Quick Action Buttons
  'ops.newOrder': {
    ar: 'طلب جديد',
    en: 'New Order',
    fr: 'Nouvelle commande',
    es: 'Nuevo pedido'
  },
  'ops.startProduction': {
    ar: 'بدء الإنتاج',
    en: 'Start Production',
    fr: 'Démarrer la production',
    es: 'Iniciar producción'
  },
  'ops.scheduleMaintenance': {
    ar: 'جدولة صيانة',
    en: 'Schedule Maintenance',
    fr: 'Planifier la maintenance',
    es: 'Programar mantenimiento'
  },
  'ops.runReport': {
    ar: 'تشغيل تقرير',
    en: 'Run Report',
    fr: 'Générer un rapport',
    es: 'Generar informe'
  },
  'ops.viewLogs': {
    ar: 'عرض السجلات',
    en: 'View Logs',
    fr: 'Voir les journales',
    es: 'Ver registros'
  },
  'ops.viewAllActivity': {
    ar: 'عرض كل النشاطات',
    en: 'View All Activity →',
    fr: 'Voir toute l\'activité →',
    es: 'Ver toda la actividad →'
  },
  
  // Filter Options
  'ops.allStatuses': {
    ar: 'الكل',
    en: 'All',
    fr: 'Tous',
    es: 'Todos'
  },
  'ops.inProgressStatus': {
    ar: 'نشط',
    en: 'Active',
    fr: 'Actif',
    es: 'Activo'
  },
  'ops.onHoldStatus': {
    ar: 'مؤجل',
    en: 'On Hold',
    fr: 'En pause',
    es: 'Pausado'
  },
  
  // Workflow Card
  'ops.progress': {
    ar: 'التقدم',
    en: 'Progress',
    fr: 'Progression',
    es: 'Progreso'
  },
  'ops.due': {
    ar: 'استحقاق:',
    en: 'Due:',
    fr: 'Échéance:',
    es: 'Vencimiento:'
  },
  'ops.noWorkflows': {
    ar: 'لا توجد سير عمل لهذا الفلتر',
    en: 'No workflows found for this filter.',
    fr: 'Aucun flux de travail trouvé pour ce filtre.',
    es: 'No se encontraron flujos de trabajo para este filtro.'
  },
  
  // Status Badges (Operations)
  'status.inProgress': {
    ar: 'قيد التنفيذ',
    en: 'In Progress',
    fr: 'En cours',
    es: 'En progreso'
  },
  'status.pending': {
    ar: 'معلق',
    en: 'Pending',
    fr: 'En attente',
    es: 'Pendiente'
  },
  'status.completed': {
    ar: 'مكتمل',
    en: 'Completed',
    fr: 'Terminé',
    es: 'Completado'
  },
  'status.onHold': {
    ar: 'مؤجل',
    en: 'On Hold',
    fr: 'En pause',
    es: 'Pausado'
  },
  
  // Priority Badges
  'priority.critical': {
    ar: 'حرج',
    en: 'Critical',
    fr: 'Critique',
    es: 'Crítico'
  },
  'priority.urgent': {
    ar: 'عاجل',
    en: 'Urgent',
    fr: 'Urgent',
    es: 'Urgente'
  },
  'priority.high': {
    ar: 'مرتفع',
    en: 'High',
    fr: 'Élevé',
    es: 'Alto'
  },
  'priority.medium': {
    ar: 'متوسط',
    en: 'Medium',
    fr: 'Moyen',
    es: 'Medio'
  },
  'priority.low': {
    ar: 'منخفض',
    en: 'Low',
    fr: 'Faible',
    es: 'Bajo'
  },
  
  // Activity Messages
  'activity.shipmentCompleted': {
    ar: 'تم إكمال الشحنة #999 وإرسالها',
    en: 'Shipment #999 completed and dispatched',
    fr: 'Expédition #999 terminée et expédiée',
    env: 'Envío #999 completado y despachado'
  },
  'activity.inventoryAlert': {
    ar: 'تنبيه المخزون: المنتج #42 منخفض (12 وحدة متبقية)',
    en: 'Inventory alert: Item #42 running low (12 units left)',
    fr: 'Alerte stock: Article #42 faible (12 unités restantes)',
    es: 'Alerta de inventario: Artículo #42 bajo (12 unidades restantes)'
  },
  'activity.newOrder': {
    ar: 'طلب جديد من Acme Corp ($45,000)',
    en: 'New order received from Acme Corp ($45,000)',
    fr: 'Nouvelle commande reçue d\'Acme Corp ($45 000)',
    es: 'Nuevo pedido recibido de Acme Corp ($45,000)'
  },
  'activity.qualityCheck': {
    ar: 'نجح فحص الجودة للإنتاج #909',
    en: 'Quality check passed for Production #909',
    fr: 'Contrôle qualité réussi pour la Production #909',
    es: 'Control de calidad aprobado para Producción #909'
  },
  'activity.maintenanceOverdue': {
    ar: 'صيانة الآلة B متأخرة بيومين',
    en: 'Machine B maintenance overdue by 2 days',
    fr: 'Maintenance Machine B en retard de 2 jours',
    es: 'Mantenimiento Máquina B retrasado por 2 días'
  },
  
  // Time expressions
  'time.minutesAgo': {
    ar: 'دقائق مضت',
    en: 'minutes ago',
    fr: 'minutes il y a',
    es: 'minutos atrás'
  },
  'time.hoursAgo': {
    ar: 'ساعات مضت',
    en: 'hours ago',
    fr: 'heures il y a',
    es: 'horas atrás'
  },
  'time.justNow': {
    ar: 'الآن',
    en: 'Just now',
    fr: 'À l\'instant',
    es: 'Ahora mismo'
  },

  // ==================== INVENTORY PAGE ====================
  'inventory.title': {
    ar: 'إدارة المخزون',
    en: 'Inventory Management',
    fr: 'Gestion des stocks',
    es: 'Gestión de inventario'
  },
  'inventory.subtitle': {
    ar: 'تتبع وإدارة جميع المنتجات والمواد',
    en: 'Track stock levels, manage products, and monitor inventory across all warehouses.',
    fr: 'Suivre et gérer tous les produits et matériaux',
    es: 'Rastrear y gestionar todos los productos y materiales'
  },
  
  // Inventory KPIs
  'inventory.totalProducts': {
    ar: 'إجمالي المنتجات',
    en: 'Total Products',
    fr: 'Total des produits',
    es: 'Total de productos'
  },
  'inventory.lowStockItems': {
    ar: 'منتجات منخفضة',
    en: 'Low Stock Items',
    fr: 'Articles en stock faible',
    es: 'Artículos con stock bajo'
  },
  'inventory.totalValue': {
    ar: 'القيمة الإجمالية',
    en: 'Total Value',
    fr: 'Valeur totale',
    es: 'Valor total'
  },
  
  // Inventory Buttons
  'inventory.sync': {
    ar: 'مزامنة',
    en: 'Sync',
    fr: 'Synchroniser',
    es: 'Sincronizar'
  },
  'inventory.addProduct': {
    ar: 'إضافة منتج',
    en: 'Add Product',
    fr: 'Ajouter un produit',
    es: 'Agregar producto'
  },
  
  // Inventory Sections
  'inventory.products': {
    ar: 'المنتجات',
    en: 'Products',
    fr: 'Produits',
    es: 'Productos'
  },
  'inventory.lowStockAlerts': {
    ar: 'تنبيهات المخزون المنخفض',
    en: 'Low Stock Alerts',
    fr: 'Alertes de stock faible',
    es: 'Alertas de stock bajo'
  },
  'inventory.viewAllAlerts': {
    ar: 'عرض جميع التنبيهات',
    en: 'View All Alerts →',
    fr: 'Voir toutes les alertes →',
    es: 'Ver todas las alertas →'
  },
  'inventory.categories': {
    ar: 'الفئات',
    en: 'Categories',
    fr: 'Catégories',
    es: 'Categorías'
  },
  'inventory.warehouses': {
    ar: 'المستودعات',
    en: 'Warehouses',
    fr: 'Entrepôts',
    es: 'Almacenes'
  },
  'inventory.items': {
    ar: 'عنصر',
    en: 'items',
    fr: 'articles',
    es: 'artículos'
  },
  
  // Table Headers
  'table.product': {
    ar: 'المنتج',
    en: 'Product',
    fr: 'Produit',
    es: 'Producto'
  },
  'table.category': {
    ar: 'الفئة',
    en: 'Category',
    fr: 'Catégorie',
    es: 'Categoría'
  },
  'table.quantity': {
    ar: 'الكمية',
    en: 'Qty',
    fr: 'Qté',
    es: 'Cant.'
  },
  'table.cost': {
    ar: 'التكلفة',
    en: 'Cost',
    fr: 'Coût',
    es: 'Costo'
  },
  'table.value': {
    ar: 'القيمة',
    en: 'Value',
    fr: 'Valeur',
    es: 'Valor'
  },
  'table.status': {
    ar: 'الحالة',
    en: 'Status',
    fr: 'Statut',
    es: 'Estado'
  },
  'table.actions': {
    ar: 'إجراءات',
    en: 'Actions',
    fr: 'Actions',
    es: 'Acciones'
  },
  
  // Status Badges (Inventory)
  'invStatus.inStock': {
    ar: 'متوفر',
    en: 'In Stock',
    fr: 'En stock',
    es: 'Disponible'
  },
  'invStatus.lowStock': {
    ar: 'مخزون منخفض',
    en: 'Low Stock',
    fr: 'Stock faible',
    es: 'Stock bajo'
  },
  'invStatus.outOfStock': {
    ar: 'نفذ المخزون',
    en: 'Out of Stock',
    fr: 'Rupture de stock',
    es: 'Agotado'
  },
  'invStatus.overstock': {
    ar: 'مخزون زائد',
    en: 'Overstock',
    fr: 'Surstock',
    es: 'Sobrestock'
  },
  
  // Filter Options (Inventory)
  'filter.allStatus': {
    ar: 'كل الحالات',
    en: 'All Status',
    fr: 'Tous les statuts',
    es: 'Todos los estados'
  },
  
  // Search & Messages
  'inventory.searchPlaceholder': {
    ar: 'بحث بالاسم أو SKU...',
    en: 'Search by name or SKU...',
    fr: 'Rechercher par nom ou SKU...',
    es: 'Buscar por nombre o SKU...'
  },
  'inventory.noProducts': {
    ar: 'لا توجد منتجات تطابق معايرك',
    en: 'No products found matching your criteria.',
    fr: 'Aucun produit trouvé correspondant à vos critères.',
    es: 'No se encontraron productos que coincidan con sus criterios.'
  },
  'inventory.outOfStockMsg': {
    ar: 'نفذ المخزون!',
    en: 'Out of stock!',
    fr: 'Rupture de stock!',
    env: '¡Agotado!'
  },
  'inventory.onlyLeft': {
    ar: 'متبقي {count} فقط',
    en: 'Only {count} left',
    fr: 'Il ne reste que {count}',
    env: 'Solo quedan {count}'
  },

  // ==================== FINANCIALS PAGE ====================
  'financials.title': {
    ar: 'المركز المالي',
    en: 'Financial Center',
    fr: 'Centre financier',
    es: 'Centro financiero'
  },
  'financials.subtitle': {
    ar: 'مراقبة الإيرادات والمصروفات والفواتير والصحة المالية',
    en: 'Monitor revenue, expenses, invoices, and financial health.',
    fr: 'Surveiller les revenus, dépenses, factures et santé financière.',
    es: 'Monitorear ingresos, gastos, facturas y salud financiera.'
  },
  
  // Financials KPIs
  'financials.totalRevenue': {
    ar: 'إجمالي الإيرادات',
    en: 'Total Revenue',
    fr: 'Revenu total',
    es: 'Ingresos totales'
  },
  'financials.totalExpenses': {
    ar: 'إجمالي المصروفات',
    en: 'Total Expenses',
    fr: 'Dépenses totales',
    es: 'Gastos totales'
  },
  'financials.netProfit': {
    ar: 'صافي الربح',
    en: 'Net Profit',
    fr: 'Bénéfice net',
    es: 'Beneficio neto'
  },
  'financials.pendingInvoices': {
    ar: 'فواتير معلقة',
    en: 'Pending Invoices',
    fr: 'Factures en attente',
    es: 'Facturas pendientes'
  },
  
  // Financials Buttons
  'financials.exportReport': {
    ar: 'تصدير تقرير',
    en: 'Export Report',
    fr: 'Exporter un rapport',
    es: 'Exportar informe'
  },
  'financials.createInvoice': {
    ar: 'إنشاء فاتورة',
    en: 'Create Invoice',
    fr: 'Créer une facture',
    es: 'Crear factura'
  },
  
  // Tabs
  'tab.transactions': {
    ar: 'المعاملات',
    en: 'Transactions',
    fr: 'Transactions',
    es: 'Transacciones'
  },
  'tab.invoices': {
    ar: 'الفواتير',
    en: 'Invoices',
    fr: 'Factures',
    es: 'Facturas'
  },
  
  // Transaction Types
  'txn.type.income': {
    ar: 'إيراد',
    en: 'Income',
    fr: 'Revenu',
    es: 'Ingreso'
  },
  'txn.type.expense': {
    ar: 'مصروف',
    en: 'Expense',
    fr: 'Dépense',
    es: 'Gasto'
  },
  
  // Transaction Status
  'txnStatus.completed': {
    ar: 'مكتمل',
    en: 'Completed',
    fr: 'Terminée',
    es: 'Completada'
  },
  'txnStatus.pending': {
    ar: 'معلق',
    en: 'Pending',
    fr: 'En attente',
    es: 'Pendiente'
  },
  'txnStatus.failed': {
    ar: 'فشل',
    en: 'Failed',
    fr: 'Échouée',
    es: 'Fallida'
  },
  
  // Invoice Status
  'invStatus.paid': {
    ar: 'مدفوعة',
    en: 'Paid',
    fr: 'Payée',
    es: 'Pagada'
  },
  'invStatus.pending': {
    ar: 'معلقة',
    en: 'Pending',
    fr: 'En attente',
    es: 'Pendiente'
  },
  'invStatus.overdue': {
    ar: 'متأخرة',
    en: 'Overdue',
    fr: 'En retard',
    es: 'Vencida'
  },
  'invStatus.draft': {
    ar: 'مسودة',
    en: 'Draft',
    fr: 'Brouillon',
    es: 'Borrador'
  },
  
  // Sidebar Sections
  'financials.expenseBreakdown': {
    ar: 'تفصيل المصروفات',
    en: 'Expense Breakdown',
    fr: 'Répartition des dépenses',
    es: 'Desglose de gastos'
  },
  'financials.totalExpensesLabel': {
    ar: 'إجمالي المصروفات',
    en: 'Total Expenses',
    fr: 'Dépenses totales',
    es: 'Gastos totales'
  },
  'financials.cashFlowSummary': {
    ar: 'ملخص التدفقات النقدية',
    en: 'Cash Flow Summary',
    fr: 'Résumé des flux de trésorerie',
    res: 'Resumen de flujo de caja'
  },
  'financials.upcomingPayments': {
    ar: 'المدفوعات القادمة',
    en: 'Upcoming Payments',
    fr: 'Paiements à venir',
    es: 'Próximos pagos'
  },
  
  // Time Periods
  'time.thisMonth': {
    ar: 'هذا الشهر',
    en: 'This Month',
    fr: 'Ce mois',
    es: 'Este mes'
  },
  'time.lastMonth': {
    ar: 'الشهر الماضي',
    en: 'Last Month',
    fr: 'Le mois dernier',
    es: 'El mes pasado'
  },
  'time.growth': {
    ar: 'نمو',
    en: 'Growth',
    fr: 'Croissance',
    es: 'Crecimiento'
  },
  'time.dueInDays': {
    ar: 'استحقاق خلال {days} أيام',
    en: 'Due in {days} days',
    fr: 'Échéance dans {days} jours',
    es: 'Vence en {days} días'
  },
  
  // Table Headers (Financials)
  'table.invoice': {
    ar: 'فاتورة',
    en: 'Invoice',
    fr: 'Facture',
    es: 'Factura'
  },
  'table.client': {
    ar: 'عميل',
    en: 'Client',
    fr: 'Client',
    es: 'Cliente'
  },
  'table.amount': {
    ar: 'المبلغ',
    en: 'Amount',
    fr: 'Montant',
    es: 'Monto'
  },
  'table.dueDate': {
    ar: 'تاريخ الاستحقاق',
    en: 'Due Date',
    fr: 'Date d\'échéance',
    es: 'Fecha de vencimiento'
  },

  // ==================== ANALYTICS PAGE ====================
  'analytics.title': {
    ar: 'مركز التحليلات',
    en: 'Analytics Hub',
    fr: 'Centre d\'analytique',
    es: 'Centro de analíticas'
  },
  'analytics.subtitle': {
    ar: 'غوص عميق في البيانات مع رسوم متقدمة وذكاء أعمال',
    en: 'Deep dive into data with advanced charts and business intelligence.',
    fr: 'Plongez dans les données avec des graphiques avancés et BI.',
    es: 'Profundiza en datos con gráficos avanzados e inteligencia de negocios.'
  },
  
  // Analytics KPIs
  'analytics.pageViews': {
    ar: 'مشاهدات الصفحة',
    en: 'Page Views',
    fr: 'Vues de page',
    es: 'Vistas de página'
  },
  'analytics.conversionRate': {
    ar: 'معدل التحويل',
    en: 'Conversion Rate',
    fr: 'Taux de conversion',
    es: 'Tasa de conversión'
  },
  'analytics.activeUsers': {
    ar: 'المستخدمين النشطين',
    en: 'Active Users',
    fr: 'Utilisateurs actifs',
    es: 'Usuarios activos'
  },
  'analytics.revenuePerUser': {
    ar: 'الإيراد لكل مستخدم',
    en: 'Revenue/User',
    fr: 'Revenu/utilisateur',
    es: 'Ingresos/usuario'
  },
  
  // Time Range Options
  'range.today': {
    ar: 'اليوم',
    en: 'Today',
    fr: 'Aujourd\'hui',
    es: 'Hoy'
  },
  'range.thisWeek': {
    ar: 'هذا الأسبوع',
    en: 'This Week',
    fr: 'Cette semaine',
    es: 'Esta semana'
  },
  'range.thisMonth': {
    ar: 'هذا الشهر',
    en: 'This Month',
    fr: 'Ce mois',
    es: 'Este mes'
  },
  'range.thisQuarter': {
    ar: 'هذا الربع',
    en: 'This Quarter',
    fr: 'Ce trimestre',
    es: 'Este trimestre'
  },
  'range.thisYear': {
    ar: 'هذا العام',
    en: 'This Year',
    fr: 'Cette année',
    es: 'Este año'
  },
  
  // Analytics Sections
  'analytics.trafficOverview': {
    ar: 'نظرة عامة على الزيارات',
    en: 'Traffic Overview',
    fr: 'Aperçu du trafic',
    es: 'Resumen del tráfico'
  },
  'analytics.weeklyTrends': {
    ar: 'اتجاهات الزيارات الأسبوعية',
    en: 'Weekly visitor trends',
    fr: 'Tendances hebdomadaires',
    es: 'Tendencias semanales de visitantes'
  },
  'analytics.thisWeek': {
    ar: 'هذا الأسبوع',
    en: 'This Week',
    fr: 'Cette semaine',
    es: 'Esta semana'
  },
  'analytics.lastWeek': {
    ar: 'الأسبوع الماضي',
    en: 'Last Week',
    fr: 'La semaine dernière',
    es: 'La semana pasada'
  },
  'analytics.topPages': {
    ar: 'الصفحات الأكثر زيارة',
    en: 'Top Pages',
    fr: 'Pages populaires',
    es: 'Páginas principales'
  },
  'analytics.trafficSources': {
    ar: 'مصادر الزيارات',
    en: 'Traffic Sources',
    fr: 'Sources de trafic',
    es: 'Fuentes de tráfico'
  },
  'analytics.deviceBreakdown': {
    ar: 'توزيع الأجهزة',
    en: 'Device Breakdown',
    fr: 'Répartition des appareils',
    es: 'Desglose de dispositivos'
  },
  'analytics.liveActivity': {
    ar: 'نشاط مباشر',
    en: 'Live Activity',
    fr: 'Activité en direct',
    es: 'Actividad en vivo'
  },
  
  // Stats
  'stats.totalVisits': {
    ar: 'إجمالي الزيارات',
    en: 'Total Visits',
    fr: 'Visites totales',
    es: 'Visitas totales'
  },
  'stats.vsLastWeek': {
    ar: 'مقارنة بالأسبوع الماضي',
    en: 'vs Last Week',
    fr: 'vs Semaine dernière',
    es: 'vs Semana pasada'
  },
  'stats.avgDuration': {
    ar: 'متوسط المدة',
    en: 'Avg. Duration',
    fr: 'Durée moy.',
    es: 'Duración prom.'
  },
  
  // Table Headers (Analytics)
  'table.page': {
    ar: 'صفحة',
    en: 'Page',
    fr: 'Page',
    es: 'Página'
  },
  'table.views': {
    ar: 'مشاهدات',
    en: 'Views',
    fr: 'Vues',
    es: 'Vistas'
  },
  'table.bounceRate': {
    ar: 'معدل الارتداد %',
    en: 'Bounce %',
    fr: 'Taux de rebond %',
    es: 'Tasa de rebote %'
  },
  'table.avgTime': {
    ar: 'متوسط الوقت',
    en: 'Avg Time',
    fr: 'Temps moy.',
    es: 'Tiempo prom.'
  },
  
  // Activity Types
  'activity.pageView': {
    ar: 'مشاهدة صفحة',
    en: 'Page View',
    fr: 'Vue de page',
    es: 'Vista de página'
  },
  'activity.signUp': {
    ar: 'تسجيل جديد',
    en: 'Sign Up',
    fr: 'Inscription',
    es: 'Registro'
  },
  'activity.purchase': {
    ar: 'شراء',
    en: 'Purchase',
    fr: 'Achat',
    es: 'Compra'
  },
  'activity.download': {
    ar: 'تحميل',
    en: 'Download',
    fr: 'Téléchargement',
    desc: 'Descarga'
  },
  
  // Device Types
  'device.desktop': {
    ar: 'كمبيوتر',
    en: 'Desktop',
    fr: 'Ordinateur',
    es: 'Escritorio'
  },
  'device.mobile': {
    ar: 'موبايل',
    en: 'Mobile',
    fr: 'Mobile',
    es: 'Móvil'
  },
  'device.tablet': {
    ar: 'تابلت',
    en: 'Tablet',
    fr: 'Tablette',
    es: 'Tableta'
  },
  'device.users': {
    ar: 'مستخدمين',
    en: 'users',
    fr: 'utilisateurs',
    es: 'usuarios'
  },
  
  // Traffic Sources
  'source.organicSearch': {
    ar: 'بحث عضوي',
    en: 'Organic Search',
    fr: 'Recherche organique',
    es: 'Búsqueda orgánica'
  },
  'source.direct': {
    ar: 'مباشر',
    en: 'Direct',
    fr: 'Direct',
    es: 'Directo'
  },
  'source.socialMedia': {
    ar: 'وسائل التواصل',
    en: 'Social Media',
    fr: 'Réseaux sociaux',
    es: 'Redes sociales'
  },
  'source.referral': {
    ar: 'إحالات',
    en: 'Referral',
    fr: 'Parrainage',
    es: 'Referidos'
  },
  'source.email': {
    ar: 'بريد إلكتروني',
    en: 'Email',
    fr: 'E-mail',
    es: 'Correo electrónico'
  },

  // ==================== SETTINGS PAGE ====================
  'settings.title': {
    ar: 'الإعدادات',
    en: 'Settings',
    fr: 'Paramètres',
    es: 'Configuración'
  },
  'settings.subtitle': {
    ar: 'إدارة تفضيلات النظام والحساب',
    en: 'Manage system preferences and account',
    fr: 'Gérer les préférences système et le compte',
    es: 'Gestionar preferencias del sistema y cuenta'
  },
  'settings.general': {
    ar: 'عام',
    en: 'General',
    fr: 'Général',
    es: 'General'
  },
  'settings.language': {
    ar: 'اللغة',
    en: 'Language',
    fr: 'Langue',
    es: 'Idioma'
  },
  'settings.languageDesc': {
    ar: 'اختر لغة الواجهة المفضلة',
    en: 'Choose your preferred interface language',
    fr: 'Choisissez votre langue d\'interface préférée',
    es: 'Elige tu idioma de interfaz preferido'
  },
  'settings.appearance': {
    ar: 'المظهر',
    en: 'Appearance',
    fr: 'Apparence',
    es: 'Apariencia'
  },
  'settings.theme': {
    ar: 'السمة',
    en: 'Theme',
    fr: 'Thème',
    es: 'Tema'
  },
  'settings.themeDesc': {
    ar: 'تخصيص مظهر التطبيق',
    en: 'Customize the app appearance',
    fr: 'Personnaliser l\'apparence de l\'application',
    es: 'Personalizar la apariencia de la aplicación'
  },
  'settings.notifications': {
    ar: 'الإشعارات',
    en: 'Notifications',
    fr: 'Notifications',
    es: 'Notificaciones'
  },
  'settings.notificationsDesc': {
    ar: 'تكوين كيفية استلام الإشعارات',
    en: 'Configure how you receive notifications',
    fr: 'Configurer comment vous recevez les notifications',
    es: 'Configurar cómo recibes notificaciones'
  },
  'settings.security': {
    ar: 'الأمان',
    en: 'Security',
    fr: 'Sécurité',
    es: 'Seguridad'
  },
  'settings.securityDesc': {
    ar: 'إدارة كلمة المرور والجلسات النشطة',
    en: 'Manage password and active sessions',
    fr: 'Gérer le mot de passe et les sessions actives',
    es: 'Gestionar contraseñas y sesiones activas'
  },
  'settings.darkMode': {
    ar: 'الوضع الداكن',
    en: 'Dark Mode',
    fr: 'Mode sombre',
    es: 'Modo oscuro'
  },
  'settings.compactView': {
    ar: 'عرض مضغوط',
    en: 'Compact View',
    fr: 'Vue compacte',
    es: 'Vista compacta'
  },
  'settings.emailNotifications': {
    ar: 'إشعارات البريد الإلكتروني',
    en: 'Email Notifications',
    fr: 'Notifications par email',
    es: 'Notificaciones por correo'
  },
  'settings.pushNotifications': {
    ar: 'إشعارات الدفع',
    en: 'Push Notifications',
    fr: 'Notifications push',
    es: 'Notificaciones push'
  },
  'settings.twoFactor': {
    ar: 'المصادقة الثنائية',
    en: 'Two-Factor Auth',
    fr: 'Authentification à deux facteurs',
    es: 'Autenticación de dos factores'
  },
  'settings.changePassword': {
    ar: 'تغيير كلمة المرور',
    en: 'Change Password',
    fr: 'Changer le mot de passe',
    es: 'Cambiar contraseña'
  },
  'settings.activeSessions': {
    ar: 'الجلسات النشطة',
    en: 'Active Sessions',
    fr: 'Sessions actives',
    es: 'Sesiones activas'
  },
  'settings.saveChanges': {
    ar: 'حفظ التغييرات',
    en: 'Save Changes',
    fr: 'Enregistrer les modifications',
    es: 'Guardar cambios'
  },

  // Common
  'common.welcome': {
    ar: 'مرحباً',
    en: 'Welcome',
    fr: 'Bienvenue',
    es: 'Bienvenido'
  },
  'common.loading': {
    ar: 'جاري التحميل...',
    en: 'Loading...',
    fr: 'Chargement...',
    es: 'Cargando...'
  },
  'common.error': {
    ar: 'حدث خطأ',
    en: 'An error occurred',
    fr: 'Une erreur est survenue',
    es: 'Ocurrió un error'
  },
  'common.save': {
    ar: 'حفظ',
    en: 'Save',
    fr: 'Enregistrer',
    es: 'Guardar'
  },
  'common.cancel': {
    ar: 'إلغاء',
    en: 'Cancel',
    fr: 'Annuler',
    es: 'Cancelar'
  },
  'common.confirm': {
    ar: 'تأكيد',
    en: 'Confirm',
    fr: 'Confirmer',
    es: 'Confirmar'
  },
  'common.delete': {
    ar: 'حذف',
    en: 'Delete',
    fr: 'Supprimer',
    es: 'Eliminar'
  },
  'common.edit': {
    ar: 'تعديل',
    en: 'Edit',
    fr: 'Modifier',
    es: 'Editar'
  },
  'common.add': {
    ar: 'إضافة',
    en: 'Add',
    fr: 'Ajouter',
    es: 'Agregar'
  },
  'common.search': {
    ar: 'بحث',
    en: 'Search',
    fr: 'Rechercher',
    es: 'Buscar'
  },
  'common.filter': {
    ar: 'تصفية',
    en: 'Filter',
    fr: 'Filtrer',
    es: 'Filtrar'
  },
  'common.export': {
    ar: 'تصدير',
    en: 'Export',
    fr: 'Exporter',
    es: 'Exportar'
  },
  'common.import': {
    ar: 'استيراد',
    en: 'Import',
    fr: 'Importer',
    es: 'Importar'
  },
  'common.refresh': {
    ar: 'تحديث',
    en: 'Refresh',
    fr: 'Actualiser',
    es: 'Actualizar'
  },
  'common.noData': {
    ar: 'لا توجد بيانات',
    en: 'No data available',
    fr: 'Aucune donnée disponible',
    es: 'Sin datos disponibles'
  },
  'common.comingSoon': {
    ar: 'قريباً...',
    en: 'Coming Soon...',
    fr: 'Bientôt disponible...',
    es: 'Próximamente...'
  },

  // ==================== ADVANCED INVENTORY FEATURES ====================
  
  // Multi-Location Tracking
  'inv.multiLocation': {
    ar: 'تتبع متعدد المواقع',
    en: 'Multi-Location Tracking',
    fr: 'Suivi multi-site',
    es: 'Seguimiento multiubicación'
  },
  'inv.selectWarehouse': {
    ar: 'اختر المستودع',
    en: 'Select Warehouse',
    fr: 'Sélectionner l\'entrepôt',
    es: 'Seleccionar almacén'
  },
  'inv.allLocations': {
    ar: 'جميع المواقع',
    en: 'All Locations',
    fr: 'Tous les sites',
    es: 'Todas las ubicaciones'
  },
  'inv.transferStock': {
    ar: 'نقل المخزون',
    en: 'Transfer Stock',
    fr: 'Transférer le stock',
    es: 'Transferir stock'
  },
  'inv.stockMovement': {
    ar: 'حركة المخزون',
    en: 'Stock Movement',
    fr: 'Mouvement de stock',
    es: 'Movimiento de stock'
  },

  // Barcode & RFID
  'inv.barcodeScan': {
    ar: 'مسح الباركود',
    en: 'Barcode Scan',
    fr: 'Scanner code-barres',
    esc: 'Escanear código de barras'
  },
  'inv.rfidScan': {
    ar: 'مسح RFID',
    en: 'RFID Scan',
    fr: 'Scanner RFID',
    es: 'Escanear RFID'
  },
  'inv.scanItem': {
    ar: 'مسح صنف',
    en: 'Scan Item',
    fr: 'Scanner l\'article',
    esc: 'Escanear artículo'
  },
  'inv.scanResult': {
    ar: 'نتيجة المسح',
    en: 'Scan Result',
    fr: 'Résultat du scan',
    es: 'Resultado del escaneo'
  },
  'inv.generateBarcode': {
    ar: 'إنشاء باركود',
    en: 'Generate Barcode',
    fr: 'Générer un code-barres',
    es: 'Generar código de barras'
  },

  // AI Forecasting
  'inv.aiForecast': {
    ar: 'التنبؤ بالذكاء الاصطناعي',
    en: 'AI Demand Forecast',
    fr: 'Prévision par IA',
    es: 'Pronóstico IA'
  },
  'inv.predictedDemand': {
    ar: 'الطلب المتوقع',
    en: 'Predicted Demand',
    fr: 'Demande prévue',
    es: 'Demanda prevista'
  },
  'inv.confidenceLevel': {
    ar: 'مستوى الثقة',
    en: 'Confidence Level',
    fr: 'Niveau de confiance',
    es: 'Nivel de confianza'
  },
  'inv.reorderSuggestion': {
    ar: 'اقتراح إعادة الطلب',
    en: 'Reorder Suggestion',
    fr: 'Suggestion de réapprovisionnement',
    es: 'Sugerencia de reorden'
  },
  'inv.seasonalTrend': {
    ar: 'الاتجاه الموسمي',
    en: 'Seasonal Trend',
    fr: 'Tendance saisonnière',
    es: 'Tendencia estacional'
  },

  // Batch & Serial Tracking
  'inv.batchTracking': {
    ar: 'تتبع الدفعات',
    en: 'Batch Tracking',
    fr: 'Suivi des lots',
    es: 'Seguimiento de lotes'
  },
  'inv.serialTracking': {
    ar: 'تتبع الأرقام التسلسلية',
    en: 'Serial Tracking',
    fr: 'Suivi des numéros de série',
    es: 'Seguimiento de series'
  },
  'inv.batchNumber': {
    ar: 'رقم الدفعة',
    en: 'Batch Number',
    fr: 'Numéro de lot',
    es: 'Número de lote'
  },
  'inv.serialNumber': {
    ar: 'الرقم التسلسلي',
    en: 'Serial Number',
    fr: 'Numéro de série',
    es: 'Número de serie'
  },
  'inv.expiryDate': {
    ar: 'تاريخ الانتهاء',
    en: 'Expiry Date',
    fr: 'Date d\'expiration',
    es: 'Fecha de vencimiento'
  },
  'inv.traceability': {
    ar: 'إمكانية التتبع',
    en: 'Traceability',
    fr: 'Traçabilité',
    es: 'Trazabilidad'
  },

  // Advanced Analytics
  'inv.inventoryTurnover': {
    ar: 'دوران المخزون',
    en: 'Inventory Turnover',
    fr: 'Rotation des stocks',
    es: 'Rotación de inventario'
  },
  'inv.daysOfSupply': {
    ar: 'أيام الإمداد',
    en: 'Days of Supply',
    fr: 'Jours d\'approvisionnement',
    es: 'Días de suministro'
  },
  'inv.fillRate': {
    ar: 'معدل التعبئة',
    en: 'Fill Rate',
    fr: 'Taux de service',
    es: 'Tasa de cumplimiento'
  },
  'inv.abcAnalysis': {
    ar: 'تحليل ABC',
    en: 'ABC Analysis',
    fr: 'Analyse ABC',
    es: 'Análisis ABC'
  },
  'inv.valuationReport': {
    ar: 'تقرير التقييم',
    en: 'Valuation Report',
    fr: 'Rapport d\'évaluation',
    es: 'Informe de valoración'
  },

  // Warehouse Management
  'inv.zoneManagement': {
    ar: 'إدارة المناطق',
    en: 'Zone Management',
    fr: 'Gestion des zones',
    es: 'Gestión de zonas'
  },
  'inv.binLocation': {
    ar: 'الموقع الدقيق',
    en: 'Bin Location',
    fr: 'Emplacement casier',
    es: 'Ubicación de casillero'
  },
  'inv.pickList': {
    ar: 'قائمة الانتقاء',
    en: 'Pick List',
    fr: 'Liste de prélèvement',
    es: 'Lista de picking'
  },
  'inv.packOrder': {
    ar: 'تعبئة الطلب',
    en: 'Pack Order',
    fr: 'Préparer la commande',
    empacar: 'Empaquetar pedido'
  },
  'inv.cycleCount': {
    ar: 'جرد دوري',
    en: 'Cycle Count',
    fr: 'Inventaire tournant',
    es: 'Recuento cíclico'
  },

  // Real-time Features
  'inv.realTimeSync': {
    ar: 'مزامنة فورية',
    en: 'Real-Time Sync',
    fr: 'Synchronisation temps réel',
    es: 'Sincronización en tiempo real'
  },
  'inv.lastUpdated': {
    ar: 'آخر تحديث',
    en: 'Last Updated',
    fr: 'Dernière mise à jour',
    es: 'Última actualización'
  },
  'inv.liveInventory': {
    ar: 'مخزون مباشر',
    en: 'Live Inventory',
    fr: 'Inventaire en direct',
    es: 'Inventario en vivo'
  },
  'inv.syncStatus': {
    ar: 'حالة المزامنة',
    en: 'Sync Status',
    fr: 'État de synchronisation',
    es: 'Estado de sincronización'
  }
}

export const languageNames: Record<Language, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español'
}

export const languageFlags: Record<Language, string> = {
  ar: '🇸🇦',
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸'
}

export const isRTL = (lang: Language): boolean => lang === 'ar'
