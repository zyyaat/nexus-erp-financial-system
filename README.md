# 🏦 Nexus ERP - Enterprise Financial Management System

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A comprehensive, world-class financial management system built with modern web technologies**

[Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📸 Screenshots

### 🌙 Dark Mode & Light Mode
| Light Mode | Dark Mode |
|------------|-----------|
| ![Light](./screenshots/light-mode.png) | ![Dark](./screenshots/dark-mode.png) |

### 📱 Mobile Responsive
| Dashboard | Financial Charts |
|-----------|------------------|
| ![Mobile](./screenshots/mobile-view.png) | ![Charts](./screenshots/charts.png) |

---

## ✨ Features

### 💰 Core Financial Modules
- **📊 General Ledger (GL)** - Complete chart of accounts with trial balance
- **📤 Accounts Payable (AP)** - Vendor management & invoice processing
- **📥 Accounts Receivable (AR)** - Customer billing & collections
- **🏦 Treasury Management** - Bank accounts & cash position tracking
- **📈 Financial Analytics** - Interactive charts & KPIs
- **📋 Budgeting & Forecasting** - Budget creation & variance analysis
- **🧾 Tax Management** - Multi-jurisdiction tax calculations
- **💱 Multi-Currency Support** - Real-time exchange rates

### 🎨 UI/UX Features
- **🌓 Dark/Light Mode** - System preference detection with manual toggle
- **📱 Fully Responsive** - Mobile-first design, works on all devices
- **🌍 RTL Support** - Full Arabic/Hebrew right-to-left support
- **♿ Accessible** - WCAG 2.1 compliant components
- **⚡ Fast Performance** - Optimized with Next.js & Turbopack
- **🎭 Glass Morphism** - Modern glass-effect UI design

### 🔧 Technical Features
- **🔄 Real-time Updates** - Live data synchronization
- **📤 Export Options** - PDF & Excel report generation
- **🔐 Role-Based Access** - Secure permission management
- **📊 Interactive Charts** - SVG-based visualizations
- **🔍 Advanced Search** - Global search across all modules
- **💾 Local Storage** - Persistent user preferences

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui + Radix UI |
| **Icons** | Lucide React |
| **State** | React Context + useState |
| **i18n** | Custom React Context (AR/EN/FR/ES) |
| **Charts** | Custom SVG Components |
| **Deployment** | Vercel / Docker |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/zyyaat/nexus-erp-financial-system.git

# Navigate to project directory
cd nexus-erp-financial-system

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── dashboard/
│   │   ├── FinancialsPage.tsx    # Main financial module
│   │   ├── FinancialCharts.tsx   # Interactive charts
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── TopNav.tsx            # Top navigation bar
│   │   └── ...                    # Other pages
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── i18n/
│   │   ├── I18nProvider.tsx      # Internationalization
│   │   └── translations.ts       # Translation files
│   └── ThemeProvider.tsx         # Dark/light mode context
└── hooks/                        # Custom React hooks
```

---

## 🎯 Key Modules Explained

### General Ledger
- Chart of Accounts (CoA) management
- Journal entry creation & posting
- Trial balance generation
- Account reconciliation
- Multi-currency transactions

### Accounts Payable
- Vendor master data management
- Invoice processing workflow
- Payment scheduling & execution
- Aging reports
- Vendor portal integration

### Accounts Receivable
- Customer account management
- Invoice generation & delivery
- Collection tracking
- Credit limit monitoring
- Statement generation

### Treasury Management
- Bank account reconciliation
- Cash position forecasting
- Inter-company transfers
- Investment tracking
- FX exposure management

---

## 🌍 Internationalization (i18n)

Supported Languages:
- 🇺🇸 English (en)
- 🇸🇦 Arabic (ar)
- 🇫🇷 French (fr)
- 🇪🇸 Spanish (es)

RTL support for Arabic and other RTL languages.

---

## 🎨 Theming

The system supports:
- **Light Mode** - Clean, professional look
- **Dark Mode** - Easy on the eyes for long sessions
- **System Preference** - Auto-detects OS setting

Theme is persisted in localStorage.

---

## 📈 Financial KPIs Tracked

### Liquidity Ratios
- Current Ratio
- Quick Ratio
- Cash Ratio
- Working Capital

### Profitability Metrics
- Gross Margin
- Operating Margin
- Net Profit Margin
- ROE (Return on Equity)
- ROA (Return on Assets)
- ROIC (Return on Invested Capital)

### Efficiency Indicators
- Asset Turnover
- Inventory Turnover
- Days Sales Outstanding (DSO)
- Days Payable Outstanding (DPO)

---

## 🔒 Security Features

- ✅ Input sanitization
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Role-based access control (RBAC)
- ✅ Audit logging
- ✅ Session management
- ✅ Secure headers (CSP, HSTS)

---

## 🚢 Deployment

### Vercel (Recommended)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zyyaat/nexus-erp-financial-system)

### Docker
```bash
docker build -t nexus-erp .
docker run -p 3000:3000 nexus-erp
```

### Manual Deployment
```bash
npm run build
# Upload .next folder to your hosting provider
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Full Stack Developer**
- GitHub: [@zyyaat](https://github.com/zyyaat)
- Portfolio: [Link]

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) - Amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Clean icon library

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕

</div>
