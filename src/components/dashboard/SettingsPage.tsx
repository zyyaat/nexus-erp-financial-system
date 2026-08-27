'use client'

import { useState } from 'react'
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Key,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  Languages,
  ChevronDown
} from 'lucide-react'
import { useI18n, languageNames, languageFlags, Language } from '@/lib/i18n'
import ProfilePictureUploader from './ProfilePictureUploader'
import { useProfilePicture } from './ProfilePictureUploader'

// ============ TYPES ============
interface SettingsSection {
  id: string
  labelKey: string
  icon: React.ElementType
}

// ============ MAIN COMPONENT ============
export default function SettingsPage() {
  const { t, language, setLanguage, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const [activeSection, setActiveSection] = useState('language')
  const [saved, setSaved] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const { imageUrl: profileImageUrl } = useProfilePicture()

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Erik Larson',
    email: 'erik.larson@nexuserp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Executive Administrator',
    timezone: 'America/Los_Angeles'
  })

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState([
    {
      categoryKey: 'settings.emailNotifications',
      items: [
        { labelKey: 'ops.orderProcessing', descriptionKey: 'settings.notificationsDesc', enabled: true },
        { labelKey: 'chart.thisWeek', descriptionKey: 'analytics.subtitle', enabled: true },
        { labelKey: 'nav.support', descriptionKey: 'settings.notificationsDesc', enabled: false },
        { labelKey: 'settings.security', descriptionKey: 'settings.notificationsDesc', enabled: true }
      ]
    },
    {
      categoryKey: 'settings.pushNotifications',
      items: [
        { labelKey: 'ops.newOrder', descriptionKey: 'settings.notificationsDesc', enabled: true },
        { labelKey: 'system.systemHealth', descriptionKey: 'settings.notificationsDesc', enabled: true },
        { labelKey: 'nav.settings', descriptionKey: 'settings.notificationsDesc', enabled: false }
      ]
    }
  ])

  // Appearance settings
  const [darkMode, setDarkMode] = useState(false)
  const [compactView, setCompactView] = useState(false)

  const settingsSections: SettingsSection[] = [
    { id: 'language', labelKey: 'settings.language', icon: Languages },
    { id: 'profile', labelKey: 'nav.settings', icon: User },
    { id: 'notifications', labelKey: 'settings.notifications', icon: Bell },
    { id: 'appearance', labelKey: 'settings.appearance', icon: Palette },
    { id: 'security', labelKey: 'settings.security', icon: Shield }
  ]

  // Handle notification toggle
  const handleNotificationToggle = (categoryIndex: number, itemIndex: number) => {
    setNotificationSettings(prev => prev.map((cat, ci) => 
      ci === categoryIndex 
        ? { ...cat, items: cat.items.map((item, ii) => ii === itemIndex ? { ...item, enabled: !item.enabled } : item) }
        : cat
    ))
  }

  // Handle save
  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Handle language change
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header - Bloomberg Style */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-2 tracking-tight">
            {t('settings.title')}
          </h2>
          <p className="text-base md:text-lg text-slate-400 dark:text-gray-400">
            {t('settings.subtitle')}
          </p>
        </div>

        <button 
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg transition-all flex items-center gap-2 ${
            saved 
              ? 'bg-green-500 text-white shadow-green-500/25' 
              : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 size={16} />
              ✓ {t('common.save')}
            </>
          ) : (
            <>
              <Save size={16} />
              {t('settings.saveChanges')}
            </>
          )}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation - Takes 1 column */}
        <div className="lg:col-span-1">
          <nav className="bg-black dark:bg-black border border-white/10 rounded-xl p-4 shadow-md sticky top-24">
            <ul className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      {t(section.labelKey)}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Content Area - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ==================== LANGUAGE SECTION (NEW) ==================== */}
          {activeSection === 'language' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Language Selector Card */}
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Languages size={20} className="text-cyan-400" />
                  {t('settings.language')}
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  {t('settings.languageDesc')}
                </p>

                {/* Current Language Display - Professional Dark Style */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{languageFlags[language]}</span>
                      <div>
                        <p className="font-semibold text-white">{languageNames[language]}</p>
                        <p className="text-sm text-gray-400">
                          {t('settings.language')}: {language.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      language === 'ar' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {language === 'ar' ? 'RTL' : 'LTR'}
                    </div>
                  </div>
                </div>

                {/* Language Options Grid - Pure Black Professional */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.keys(languageFlags) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                        language === lang
                          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                          : 'border-white/10 bg-black hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {language === lang && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <span className="text-2xl">{languageFlags[lang]}</span>
                      
                      <div className="text-left flex-1">
                        <p className="font-semibold text-white">{languageNames[lang]}</p>
                        <p className="text-xs text-gray-500 uppercase">{lang}</p>
                      </div>

                      {lang === 'ar' && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">RTL</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Language Info - Dark Mode Compatible */}
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                  <Info size={20} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-300">
                      {language === 'ar' ? 'ملاحظة:' : 'Note:'}
                    </p>
                    <p className="text-amber-400/80 mt-1">
                      {language === 'ar' 
                        ? 'عند تغيير اللغة إلى العربية، سيتم تحويل اتجاه الواجهة إلى اليمين (RTL) تلقائياً.'
                        : language === 'fr'
                          ? 'Lorsque vous changez la langue, l\'interface se mettra à jour instantanément.'
                          : language === 'es'
                            ? 'Al cambiar el idioma, la interfaz se actualizará instantáneamente.'
                            : 'When you change language, the interface will update instantly. Arabic (RTL) will flip the layout direction.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Preview Card - Pure Black */}
              <div className="bg-black border border-white/10 rounded-xl p-6 text-white shadow-xl">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Globe size={18} />
                  {language === 'ar' ? 'معاينة سريعة' : language === 'fr' ? 'Aperçu rapide' : language === 'es' ? 'Vista previa rápida' : 'Quick Preview'}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.05] rounded-lg p-4">
                    <p className="text-white/60 text-xs mb-1">{t('nav.dashboard')}</p>
                    <p className="font-semibold">{t('kpi.totalRevenue')}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-4">
                    <p className="text-white/60 text-xs mb-1">{t('nav.operations')}</p>
                    <p className="font-semibold">{t('ops.activeWorkflows')}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-4">
                    <p className="text-white/60 text-xs mb-1">{t('nav.inventory')}</p>
                    <p className="font-semibold">{t('inventory.title')}</p>
                  </div>
                  <div className="bg-white/[0.05] rounded-lg p-4">
                    <p className="text-white/60 text-xs mb-1">{t('nav.financials')}</p>
                    <p className="font-semibold">{t('financials.title')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <User size={20} className="text-cyan-400" />
                  {t('settings.general')}
                </h3>

                {/* Avatar Section - With Real Upload Functionality */}
                <div className={`flex items-center gap-6 mb-8 pb-8 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <ProfilePictureUploader 
                    size="large" 
                    onImageChange={(url) => {
                      // Image changed - could trigger save button enable
                      console.log('Profile image updated:', url ? 'has image' : 'no image')
                    }}
                  />

                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="text-xl font-bold text-white">{profile.name}</h4>
                    <p className="text-gray-400">{profile.role}</p>
                    <p className="text-sm text-cyan-400 mt-1">
                      {language === 'ar' ? 'عضو منذ يناير 2024' : 'Member since Jan 2024'}
                    </p>
                    {profileImageUrl && (
                      <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                        ✓ {language === 'ar' ? 'صورة شخصية محفوظة' : 'Profile picture saved'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      {t('common.add')} {t('settings.general')}
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      {t('common.phone') || 'Phone'}
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <MapPin size={14} className="text-gray-500" />
                      {t('ops.shipping') || 'Location'}
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Globe size={14} className="text-gray-500" />
                      Timezone
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    >
                      <option value="America/Los_Angeles" className="bg-black text-white">Pacific Time (PT)</option>
                      <option value="America/New_York" className="bg-black text-white">Eastern Time (ET)</option>
                      <option value="America/Chicago" className="bg-black text-white">Central Time (CT)</option>
                      <option value="Europe/London" className="bg-black text-white">London (GMT)</option>
                      <option value="Europe/Paris" className="bg-black text-white">Central European (CET)</option>
                      <option value="Asia/Tokyo" className="bg-black text-white">Japan Standard (JST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      Role / Position
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({...profile, role: e.target.value})}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Bell size={20} className="text-amber-400" />
                  {t('settings.notifications')}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{t('settings.notificationsDesc')}</p>

                <div className="space-y-8">
                  {notificationSettings.map((category, catIndex) => (
                    <div key={category.categoryKey}>
                      <h4 className="font-semibold text-white mb-4">{t(category.categoryKey)}</h4>
                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.labelKey} className="flex items-start justify-between gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-white">{t(item.labelKey)}</p>
                              <p className="text-sm text-gray-400 mt-0.5">{t(item.descriptionKey)}</p>
                            </div>
                            <ToggleSwitch 
                              enabled={item.enabled} 
                              onToggle={() => handleNotificationToggle(catIndex, itemIndex)} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Preview Card */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Bell size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      {language === 'ar' ? 'وضع المعاينة' : language === 'fr' ? 'Mode Aperçu' : language === 'es' ? 'Vista Previa' : 'Preview Mode'}
                    </h4>
                    <p className="text-sm text-white/80 mb-3">
                      {language === 'ar' ? 'هذا هو شكل الإشعارات الخاصة بك' : language === 'fr' ? 'Voici à quoi ressembleront vos notifications' : language === 'es' ? 'Así se verán tus notificaciones' : 'This is how your notifications will look'}
                    </p>
                    
                    <div className="bg-white/[0.05] rounded-lg p-4">
                      <p className="font-medium text-sm">📦 {t('ops.newOrder')}</p>
                      <p className="text-xs text-white/70 mt-1">Order #1234 from TechCorp Industries - $4,500.00</p>
                      <p className="text-xs text-white/60 mt-2">
                        {language === 'ar' ? 'الآن' : language === 'fr' ? 'À l\'instant' : language === 'es' ? 'Ahora' : 'Just now'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Palette size={20} className="text-purple-400" />
                  {t('settings.appearance')}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{t('settings.themeDesc')}</p>

                {/* Theme Selection */}
                <div className="mb-8">
                  <h4 className="font-medium text-white mb-4">{t('settings.theme')}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button 
                      onClick={() => setDarkMode(false)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${!darkMode ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-black hover:border-white/20'}`}
                    >
                      <div className="w-full h-16 bg-white border border-gray-300 rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-white">Light</span>
                    </button>
                    <button 
                      onClick={() => setDarkMode(true)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${darkMode ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-black hover:border-white/20'}`}
                    >
                      <div className="w-full h-16 bg-black border border-white/20 rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-white">Dark</span>
                    </button>
                    <button className="p-4 bg-black border-2 border-white/10 rounded-xl text-center hover:border-white/20 transition-colors">
                      <div className="w-full h-16 bg-gradient-to-b from-white to-black rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-white">System</span>
                    </button>
                  </div>
                </div>

                {/* Compact View Toggle */}
                <div className="mb-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="font-medium text-white">{t('settings.compactView')}</p>
                      <p className="text-sm text-gray-400">
                        {language === 'ar' ? 'تقليل المسافات لعرض محتوى أكثر' : language === 'fr' ? 'Réduire les espaces pour plus de contenu' : language === 'es' ? 'Reducir espacios para más contenido' : 'Reduce spacing for more content'}
                      </p>
                    </div>
                    <ToggleSwitch 
                      enabled={compactView} 
                      onToggle={() => setCompactView(!compactView)} 
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <h4 className="font-medium text-white mb-4">Accent Color</h4>
                  <div className="flex gap-3">
                    {['indigo', 'violet', 'blue', 'emerald', 'rose', 'amber'].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-xl bg-${color}-500 ring-2 ring-offset-2 ring-indigo-500 transition-all hover:scale-110`}
                        style={{ backgroundColor: `var(--tw-${color}-500)` }}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-red-400" />
                  {t('settings.security')}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{t('settings.securityDesc')}</p>

                {/* Change Password */}
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'ar' ? 'كلمة المرور الحالية' : language === 'fr' ? 'Mot de passe actuel' : language === 'es' ? 'Contraseña actual' : 'Current Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'ar' ? 'كلمة المرور الجديدة' : language === 'fr' ? 'Nouveau mot de passe' : language === 'es' ? 'Nueva contraseña' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : language === 'fr' ? 'Confirmer le nouveau mot de passe' : language === 'es' ? 'Confirmar nueva contraseña' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2">
                    <Key size={16} />
                    {t('settings.changePassword')}
                  </button>
                </div>
              </div>

              {/* Two-Factor Auth */}
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">{t('settings.twoFactor')}</h4>
                  <ToggleSwitch enabled={true} onToggle={() => {}} />
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <CheckCircle2 size={20} className="text-emerald-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-300">
                      {language === 'ar' ? 'المصادقة الثنائية مفعلة' : language === 'fr' ? '2FA est activé' : language === 'es' ? '2FA está activado' : '2FA is Enabled'}
                    </p>
                    <p className="text-sm text-emerald-400/80 mt-1">
                      {language === 'ar' ? 'حسابك محمي بالمصادقة الثنائية' : language === 'fr' ? 'Votre compte est protégé par l\'authentification à deux facteurs' : language === 'es' ? 'Tu cuenta está protegida con autenticación de dos factores' : 'Your account is protected with two-factor authentication using authenticator app.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-black dark:bg-black border border-white/10 rounded-xl p-6 shadow-md">
                <h4 className="font-semibold text-white mb-4">{t('settings.activeSessions')}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        💻
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">MacBook Pro - Chrome</p>
                        <p className="text-xs text-gray-400">
                          {(() => {
                            switch(language) {
                              case 'ar': return 'الجلسة الحالية • San Francisco, CA'
                              case 'fr': return 'Session actuelle • San Francisco, CA'
                              case 'es': return 'Sesión actual • San Francisco, CA'
                              default: return 'Current session • San Francisco, CA'
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                      {(() => {
                        switch(language) {
                          case 'ar': return 'نشط'
                          case 'fr': return 'Actif'
                          case 'es': return 'Activo'
                          default: return 'Active'
                        }
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">iPhone 15 Pro - Safari</p>
                        <p className="text-xs text-gray-400">
                          {(() => {
                            switch(language) {
                              case 'ar': return 'منذ ساعتين • San Francisco, CA'
                              case 'fr': return 'Il y a 2 heures • San Francisco, CA'
                              case 'es': return 'Hace 2 horas • San Francisco, CA'
                              default: return '2 hours ago • San Francisco, CA'
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-red-400 hover:text-red-300 font-medium">
                      {(() => {
                        switch(language) {
                          case 'ar': return 'إلغاء'
                          case 'fr': return 'Révoquer'
                          case 'es': return 'Revocar'
                          default: return 'Revoke'
                        }
                      })()}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ SUB-COMPONENTS ============

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      dir="ltr"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20 ${
        enabled ? 'bg-cyan-500' : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
