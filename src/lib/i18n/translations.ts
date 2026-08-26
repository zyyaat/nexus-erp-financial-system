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

  // Operations Page
  'ops.title': {
    ar: 'مركز العمليات',
    en: 'Operations Center',
    fr: 'Centre des opérations',
    es: 'Centro de operaciones'
  },
  'ops.subtitle': {
    ar: 'إدارة وتتبع جميع العمليات اليومية',
    en: 'Manage and track all daily operations',
    fr: 'Gérer et suivre toutes les opérations quotidiennes',
    es: 'Gestionar y seguir todas las operaciones diarias'
  },
  'ops.activeWorkflows': {
    ar: 'سير العمل النشط',
    en: 'Active Workflows',
    fr: 'Flux de travail actifs',
    es: 'Flujos de trabajo activos'
  },
  'ops.pendingTasks': {
    ar: 'مهام معلقة',
    en: 'Pending Tasks',
    fr: 'Tâches en attente',
    es: 'Tareas pendientes'
  },
  'ops.completionRate': {
    ar: 'معدل الإنجاز',
    en: 'Completion Rate',
    fr: 'Taux d\'achèvement',
    es: 'Tasa de finalización'
  },
  'ops.workflows': {
    ar: 'سير العمل',
    en: 'Workflows',
    fr: 'Flux de travail',
    es: 'Flujos de trabajo'
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
  'ops.allStatuses': {
    ar: 'الكل',
    en: 'All',
    fr: 'Tous',
    es: 'Todos'
  },
  'ops.inProgress': {
    ar: 'قيد التنفيذ',
    en: 'In Progress',
    fr: 'En cours',
    es: 'En progreso'
  },
  'ops.pending': {
    ar: 'معلق',
    en: 'Pending',
    fr: 'En attente',
    es: 'Pendiente'
  },
  'ops.completed': {
    ar: 'مكتمل',
    en: 'Completed',
    fr: 'Terminé',
    es: 'Completado'
  },
  'ops.onHold': {
    ar: 'مؤجل',
    en: 'On Hold',
    fr: 'En pause',
    es: 'Pausado'
  },
  'ops.priority': {
    ar: 'الأولوية',
    en: 'Priority',
    fr: 'Priorité',
    es: 'Prioridad'
  },
  'ops.status': {
    ar: 'الحالة',
    en: 'Status',
    fr: 'Statut',
    es: 'Estado'
  },
  'ops.assignee': {
    ar: 'المكلف به',
    en: 'Assignee',
    fr: 'Assigné',
    es: 'Asignado'
  },
  'ops.dueDate': {
    ar: 'تاريخ الاستحقاق',
    en: 'Due Date',
    fr: 'Date d\'échéance',
    es: 'Fecha límite'
  },
  'ops.orderProcessing': {
    ar: 'معالجة الطلبات',
    en: 'Order Processing',
    fr: 'Traitement des commandes',
    es: 'Procesamiento de pedidos'
  },
  'ops.productionLine': {
    ar: 'خط الإنتاج',
    en: 'Production Line',
    fr: 'Ligne de production',
    es: 'Línea de producción'
  },
  'ops.qualityCheck': {
    ar: 'فحص الجودة',
    en: 'Quality Check',
    fr: 'Contrôle qualité',
    es: 'Control de calidad'
  },
  'ops.maintenance': {
    ar: 'صيانة',
    en: 'Maintenance',
    fr: 'Maintenance',
    es: 'Mantenimiento'
  },
  'ops.shipping': {
    ar: 'الشحن',
    en: 'Shipping',
    fr: 'Expédition',
    es: 'Envío'
  },

  // Status Badges
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

  // Settings Page
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

  // Inventory Page
  'inventory.title': {
    ar: 'إدارة المخزون',
    en: 'Inventory Management',
    fr: 'Gestion des stocks',
    es: 'Gestión de inventario'
  },
  'inventory.subtitle': {
    ar: 'تتبع وإدارة جميع المنتجات والمواد',
    en: 'Track and manage all products and materials',
    fr: 'Suivre et gérer tous les produits et matériaux',
    es: 'Rastrear y gestionar todos los productos y materiales'
  },

  // Financials Page
  'financials.title': {
    ar: 'التقارير المالية',
    en: 'Financial Reports',
    fr: 'Rapports financiers',
    es: 'Informes financieros'
  },
  'financials.subtitle': {
    ar: 'نظرة شاملة على الأداء المالي',
    en: 'Comprehensive financial performance overview',
    fr: 'Aperçu complet des performances financières',
    es: 'Vista general integral del rendimiento financiero'
  },

  // Analytics Page
  'analytics.title': {
    ar: 'التحليلات المتقدمة',
    en: 'Advanced Analytics',
    fr: 'Analytiques avancés',
    es: 'Analíticas avanzadas'
  },
  'analytics.subtitle': {
    ar: 'رؤى عميقة واتجاهات البيانات',
    en: 'Deep insights and data trends',
    fr: 'Perspectives approfondies et tendances des données',
    es: 'Perspectivas profundas y tendencias de datos'
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
