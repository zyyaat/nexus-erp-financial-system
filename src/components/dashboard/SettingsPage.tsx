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
  Download
} from 'lucide-react'

// ============ TYPES ============
interface SettingsSection {
  id: string
  label: string
  icon: React.ElementType
}

// ============ DATA ============
const settingsSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard }
]

const notificationSettings = [
  {
    category: 'Email Notifications',
    items: [
      { label: 'Order updates', description: 'Get notified about order status changes', enabled: true },
      { label: 'Weekly reports', description: 'Receive weekly performance summaries', enabled: true },
      { label: 'Marketing emails', description: 'Promotional offers and new features', enabled: false },
      { label: 'Security alerts', description: 'Important security notifications', enabled: true }
    ]
  },
  {
    category: 'Push Notifications',
    items: [
      { label: 'New orders', description: 'Instant alerts for new incoming orders', enabled: true },
      { label: 'System status', description: 'Server and service health updates', enabled: true },
      { label: 'Team mentions', description: 'When someone tags you in a comment', enabled: false }
    ]
  }
]

// ============ SUB-COMPONENTS ============

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
        enabled ? 'bg-indigo-500' : 'bg-slate-200'
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

// ============ MAIN COMPONENT ============
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState(notificationSettings)
  const [saved, setSaved] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Erik Larson',
    email: 'erik.larson@nexuserp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'Executive Administrator',
    timezone: 'America/Los_Angeles'
  })

  // Handle notification toggle
  const handleNotificationToggle = (categoryIndex: number, itemIndex: number) => {
    setNotifications(prev => prev.map((cat, ci) => 
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2 tracking-tight">
            {' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Settings
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-500">
            Manage your account preferences and system configuration.
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
              Saved!
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation - Takes 1 column */}
        <div className="lg:col-span-1">
          <nav className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-4 shadow-lg shadow-indigo-500/4 sticky top-24">
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
                          ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon size={18} />
                      {section.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Content Area - Takes 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              {/* Profile Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User size={20} className="text-indigo-500" />
                  Profile Information
                </h3>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="relative group">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoUjdl6JxQ7xr6TtNXNe5yuWpE6JyXvtJdGu5cl3Kgm8IwbLHIqEYhZLg3NzLswZcOlLnobLxo3Yg7JPZLA018Bj05yk3jkudcWtUR_n6scAEQ2NMqU7ew3yCT7_MDdQjp1kNWjGuqCkA0tISPAvTS48joKg2R5yWnI8-AQVfnHc2FVsZoL0-3dZ0UG68X4sSPe-Z5NkSAiWfWulj5eyGYClHXJ1hkm-FxfBr2Dm9ZH9-tTen8NiFi"
                      alt={profile.name}
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                      <Camera size={24} className="text-white" />
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{profile.name}</h4>
                    <p className="text-slate-500">{profile.role}</p>
                    <p className="text-sm text-indigo-600 mt-1">Member since Jan 2024</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      Timezone
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Central European (CET)</option>
                      <option value="Asia/Tokyo">Japan Standard (JST)</option>
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
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Bell size={20} className="text-amber-500" />
                  Notification Preferences
                </h3>
                <p className="text-sm text-slate-500 mb-6">Choose how you want to be notified about updates.</p>

                <div className="space-y-8">
                  {notifications.map((category, catIndex) => (
                    <div key={category.category}>
                      <h4 className="font-semibold text-slate-800 mb-4">{category.category}</h4>
                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => (
                          <div key={item.label} className="flex items-start justify-between gap-4 p-4 bg-slate-50/80 rounded-xl hover:bg-slate-100/80 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{item.label}</p>
                              <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>
                            </div>
                            <Toggle 
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
                    <h4 className="font-semibold mb-1">Preview Mode</h4>
                    <p className="text-sm text-white/80 mb-3">This is how your notifications will look</p>
                    
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <p className="font-medium text-sm">📦 New Order Received</p>
                      <p className="text-xs text-white/70 mt-1">Order #1234 from TechCorp Industries - $4,500.00</p>
                      <p className="text-xs text-white/60 mt-2">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-red-500" />
                  Security Settings
                </h3>
                <p className="text-sm text-slate-500 mb-6">Manage your password and authentication methods.</p>

                {/* Change Password */}
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  
                  <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors flex items-center gap-2">
                    <Key size={16} />
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Auth */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Two-Factor Authentication</h4>
                  <Toggle enabled={true} onToggle={() => {}} />
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">2FA is Enabled</p>
                    <p className="text-sm text-green-700 mt-1">Your account is protected with two-factor authentication using authenticator app.</p>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h4 className="font-semibold text-slate-900 mb-4">Active Sessions</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        💻
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">MacBook Pro - Chrome</p>
                        <p className="text-xs text-slate-500">San Francisco, CA • Current session</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">iPhone 15 Pro - Safari</p>
                        <p className="text-xs text-slate-500">San Francisco, CA • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Palette size={20} className="text-purple-500" />
                  Appearance Preferences
                </h3>
                <p className="text-sm text-slate-500 mb-6">Customize how Nexus ERP looks for you.</p>

                {/* Theme Selection */}
                <div className="mb-8">
                  <h4 className="font-medium text-slate-800 mb-4">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="p-4 bg-white border-2 border-indigo-500 rounded-xl text-center">
                      <div className="w-full h-16 bg-white border border-slate-200 rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-slate-900">Light</span>
                    </button>
                    <button className="p-4 bg-slate-50 border-2 border-transparent rounded-xl text-center hover:border-slate-300 transition-colors">
                      <div className="w-full h-16 bg-slate-900 rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-slate-700">Dark</span>
                    </button>
                    <button className="p-4 bg-slate-50 border-2 border-transparent rounded-xl text-center hover:border-slate-300 transition-colors">
                      <div className="w-full h-16 bg-gradient-to-b from-white to-slate-900 rounded-lg mb-2"></div>
                      <span className="text-sm font-medium text-slate-700">System</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div className="mb-8">
                  <h4 className="font-medium text-slate-800 mb-4">Accent Color</h4>
                  <div className="flex gap-3">
                    {['indigo', 'violet', 'blue', 'emerald', 'rose', 'amber'].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-xl bg-${color}-500 ${color === 'indigo' ? 'ring-2 ring-offset-2 ring-' + color + '-500' : ''} transition-all hover:scale-110`}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-4">Font Size</h4>
                  <div className="flex gap-3">
                    {['Small', 'Medium', 'Large'].map((size, i) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          i === 1 ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size === 'Small' ? 'A' : size === 'Medium' ? 'Aa' : 'Aa+'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Section */}
          {activeSection === 'billing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-xl p-6 shadow-lg shadow-indigo-500/4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard size={20} className="text-emerald-500" />
                  Billing & Subscription
                </h3>
                <p className="text-sm text-slate-500 mb-6">Manage your payment method and subscription plan.</p>

                {/* Current Plan */}
                <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm">Current Plan</p>
                      <h4 className="text-2xl font-bold">Enterprise</h4>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Active</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-white/70 text-xs">Price</p>
                      <p className="font-bold">$299/mo</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Users</p>
                      <p className="font-bold">Unlimited</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Renews</p>
                      <p className="font-bold">Sep 26, 2026</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-800 mb-4">Payment Method</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white font-bold text-xs">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">•••• •••• •••• 4242</p>
                        <p className="text-xs text-slate-500">Expires 09/2027</p>
                      </div>
                    </div>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Edit</button>
                  </div>
                </div>

                {/* Invoice History */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-4">Recent Invoices</h4>
                  <div className="space-y-3">
                    {[
                      { date: 'Aug 26, 2026', amount: '$299.00', status: 'Paid' },
                      { date: 'Jul 26, 2026', amount: '$299.00', status: 'Paid' },
                      { date: 'Jun 26, 2026', amount: '$299.00', status: 'Paid' }
                    ].map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <p className="font-medium text-sm text-slate-900">{invoice.date}</p>
                          <p className="text-xs text-slate-500">Enterprise Plan</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900">{invoice.amount}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{invoice.status}</span>
                          <button className="text-indigo-600 hover:text-indigo-700">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
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
