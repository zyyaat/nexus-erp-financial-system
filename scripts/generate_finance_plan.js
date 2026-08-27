const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageBreak, TableOfContents, LevelFormat
} = require("docx");
const fs = require("fs");

// Palette - Professional Finance Theme (Cool + Heavy + Active)
const P = {
  primary: "#0D1B2A",
  body: "#1B263B",
  secondary: "#415A77",
  accent: "#2E8B57",  // Green for finance
  surface: "#F0F4F8"
};
const c = (hex) => hex.replace("#", "");

// Helper functions
function heading(text, level = HeadingLevel.HEADING_1) {
  const sizes = { [HeadingLevel.HEADING_1]: 32, [HeadingLevel.HEADING_2]: 28, [HeadingLevel.HEADING_3]: 24 };
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 300, after: 150, line: 312 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: sizes[level] || 24 })]
  });
}

function bodyPara(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }]
  });
}

function bulletItem(text, reference) {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }]
  });
}

// Create document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "SimSun" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } }
      }
    },
    heading1: {
      run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
      paragraph: { spacing: { before: 400, after: 160, line: 312 } }
    },
    heading2: {
      run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
      paragraph: { spacing: { before: 300, after: 120, line: 312 } }
    },
    heading3: {
      run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 24, bold: true, color: c(P.secondary) },
      paragraph: { spacing: { before: 240, after: 100, line: 312 } }
    }
  },
  numbering: {
    config: [
      {
        reference: "list-features",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "list-modules",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "list-benefits",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "list-tech",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "list-phases",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [
    // ===== COVER SECTION =====
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } }
      },
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              height: { value: 16838, rule: "exact" },
              children: [
                new TableCell({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  shading: { type: ShadingType.CLEAR, fill: P.primary },
                  verticalAlign: "top",
                  children: [
                    new Paragraph({ spacing: { before: 2400, after: 0, line: 400 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Global Financial Management System", bold: true, size: 44, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
                    new Paragraph({ spacing: { before: 200, after: 0, line: 400 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Development Plan & Best Practices Guide", size: 28, color: "E0E7FF", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 600, after: 0, line: 350 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "\u062E\u0637\u0629 \u062A\u0637\u0648\u064A\u0631 \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0627\u0644\u0639\u0627\u0644\u0645\u064A", bold: true, size: 36, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
                    new Paragraph({ spacing: { before: 200, after: 0, line: 350 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "\u062F\u0644\u064A\u0644 \u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0627\u062A \u0648\u0627\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629", size: 24, color: "E0E7FF", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 1800, after: 0, line: 300 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Enterprise Financial Management Software Market:", size: 22, color: "94A3B8", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 100, after: 0, line: 300 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "USD 9.28 Billion (2024) -> USD 26.85 Billion (2032)", bold: true, size: 26, color: c(P.accent), font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 1200, after: 0, line: 300 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "Based on Research from: FSB, Oracle, SAP, NetSuite, KPMG, Gartner", size: 20, color: "64748B", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 200, after: 0, line: 300 }, alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "August 2026", size: 20, color: "64748B", font: { ascii: "Calibri", eastAsia: "SimSun" } })] })
                  ]
                })
              ]
            })
          ]
        })
      ]
    },
    // ===== TOC SECTION =====
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Financial Management System Development Plan", size: 18, color: "64748B" })] })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })]
        })
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Table of Contents", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
        new TableOfContents(),
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "(Right-click and select 'Update Field' to refresh page numbers)", italics: true, size: 20, color: "64748B" })] }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // ===== BODY SECTION =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Global Financial Management System - Development Plan", size: 18, color: "64748B" })] })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })]
        })
      },
      children: [
        // ===== EXECUTIVE SUMMARY =====
        heading("1. Executive Summary"),
        
        bodyPara("This comprehensive development plan outlines the architecture, features, and implementation strategy for building a world-class Enterprise Financial Management System (EFMS). Based on extensive research of global standards including FSB key standards, IFRS/GAAP compliance requirements, and analysis of leading platforms like SAP S/4HANA Finance, Oracle NetSuite, Microsoft Dynamics 365, and QuickBooks Enterprise, this document provides a complete roadmap for developing a competitive financial management solution."),
        
        bodyPara("\u064A\u0642\u062F\u0645 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0634\u0627\u0645\u0644 \u062E\u0637\u0629 \u062A\u0637\u0648\u064A\u0631 \u0645\u062A\u0643\u0627\u0645\u0644\u0629 \u0644\u0628\u0646\u0627\u0621 \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0645\u0627\u0644\u064A\u0629 \u0645\u062F\u0631\u0627\u062A\u064A \u0639\u0627\u0644\u0645\u064A \u0627\u0644\u0645\u0633\u062A\u0648\u0649. \u064A\u0633\u062A\u0646\u062F \u0639\u0644\u0649 \u0628\u062D\u0648\u062B \u0634\u0627\u0645\u0644 \u0644\u0644\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0629 \u0648\u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0627\u062A \u0641\u064A \u0645\u062C\u0627\u0644 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0624\u0633\u0633\u064A\u0627."),

        bodyPara("The global Enterprise Financial Management Software market is projected to grow from USD 9.28 billion in 2024 to an estimated USD 26.85 billion by 2032, representing a compound annual growth rate (CAGR) of approximately 14.2%. This growth is driven by increasing demand for real-time financial visibility, regulatory compliance automation, multi-currency transaction support, and integration with emerging technologies such as artificial intelligence and machine learning for predictive financial analytics."),

        // ===== MARKET OVERVIEW =====
        heading("2. Global Market Overview"),

        heading("2.1 Market Size and Growth Trajectory", HeadingLevel.HEADING_2),
        
        bodyPara("The enterprise financial management software sector is experiencing unprecedented growth, fueled by digital transformation initiatives across industries. Organizations are increasingly moving away from legacy spreadsheet-based financial processes toward integrated, cloud-native solutions that offer real-time collaboration, automated compliance checking, and advanced analytical capabilities. The COVID-19 pandemic accelerated this transition, as remote work necessitated cloud-based financial tools with robust security features."),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              tableHeader: true,
              cantSplit: true,
              children: ["Metric / \u0627\u0644\u0645\u0624\u0634\u0631", "2024 Value", "2032 Projection", "CAGR"].map(text => 
                new TableCell({
                  shading: { type: ShadingType.CLEAR, fill: P.surface },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 21, color: c(P.primary) })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Market Size", "USD 9.28B", "USD 26.85B", "14.2%"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Cloud Segment", "62%", "85%", "-"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["SMB Adoption", "45%", "72%", "-"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, size: 21 })] })]
                })
              )
            })
          ]
        }),

        heading("2.2 Key Market Drivers", HeadingLevel.HEADING_2),
        
        bulletItem("Regulatory Compliance Complexity: Increasing global regulations including GDPR, SOX, Basel III, and regional tax laws require sophisticated compliance automation capabilities", "list-features"),
        bulletItem("Digital Transformation Mandates: Organizations across all sectors are prioritizing financial process automation to reduce operational costs and improve accuracy", "list-features"),
        bulletItem("Real-time Financial Visibility: Demand for instant access to financial data for strategic decision-making has become a competitive necessity", "list-features"),
        bulletItem("Multi-entity Consolidation: Growing need for unified financial reporting across subsidiaries, currencies, and jurisdictions", "list-features"),
        bulletItem("AI/ML Integration: Artificial intelligence for cash flow forecasting, anomaly detection, and automated reconciliation is becoming standard expectation", "list-features"),

        // ===== CORE MODULES =====
        heading("3. Core Financial Modules"),

        bodyPara("Based on comprehensive analysis of leading ERP financial modules from Oracle NetSuite, SAP S/4HANA, Microsoft Dynamics 365, and specialized solutions like Sage Intacct and Coupa, the following core modules represent the essential foundation of any world-class financial management system:"),

        heading("3.1 General Ledger (GL)", HeadingLevel.HEADING_2),
        
        bodyPara("The General Ledger serves as the central repository for all financial transactions and forms the backbone of the entire financial system. Modern GL systems must support multi-dimensional chart of accounts, automatic journal entry generation from sub-ledgers, real-time trial balance calculations, and seamless consolidation across multiple entities and currencies."),

        bulletItem("Multi-dimensional Chart of Accounts with customizable segments (department, cost center, project, location)", "list-modules"),
        bulletItem("Automatic intercompany elimination entries during consolidation", "list-modules"),
        bulletItem("Real-time trial balance, balance sheet, and income statement generation", "list-modules"),
        bulletItem("Support for multiple accounting standards (IFRS, US GAAP, local GAAP) simultaneously", "list-modules"),
        bulletItem("Audit trail with full transaction history and modification tracking", "list-modules"),
        bulletItem("Recurring journal entry templates with flexible scheduling", "list-modules"),
        bulletItem("Currency translation with automatic gain/loss recognition", "list-modules"),

        heading("3.2 Accounts Payable (AP)", HeadingLevel.HEADING_2),
        
        bodyPara("Accounts Payable automation has evolved significantly with the adoption of AI-powered invoice processing, electronic payment networks, and dynamic discounting optimization. Leading AP systems now offer end-to-end invoice-to-pay automation that reduces processing costs by up to 80% while improving supplier relationships through faster payment cycles."),

        bulletItem("AI-powered invoice capture with OCR and machine learning for data extraction", "list-benefits"),
        bulletItem("Three-way matching (PO, receipt, invoice) with tolerance-based exception handling", "list-benefits"),
        bulletItem("Workflow approval routing based on amount, vendor, or custom rules", "list-benefits"),
        bulletItem("Dynamic discounting optimization for early payment capture", "list-benefits"),
        bulletItem("Multiple payment methods support (ACH, wire, card, international transfers)", "list-benefits"),
        bulletItem("Vendor portal for self-service invoice submission and payment status", "list-benefits"),
        bulletItem("1099/ISO 20022 compliance and tax form generation", "list-benefits"),

        heading("3.3 Accounts Receivable (AR)", HeadingLevel.HEADING_2),
        
        bodyPara("Effective Accounts Receivable management directly impacts organizational cash flow and liquidity. Modern AR systems integrate credit management, collections automation, and customer self-service portals to reduce Days Sales Outstanding (DSO) while maintaining positive customer relationships. Advanced analytics help predict payment behavior and identify at-risk accounts early."),

        bulletItem("Automated invoicing with customizable templates and multi-language support", "list-tech"),
        bulletItem("Credit limit management with real-time exposure monitoring", "list-tech"),
        bulletItem("Collections workflow with priority scoring and communication templates", "list-tech"),
        bulletItem("Customer portal for viewing invoices, making payments, and disputing charges", "list-tech"),
        bulletItem("Cash application with AI-powered payment matching", "list-tech"),
        bulletItem("Revenue recognition automation compliant with ASC 606/IFRS 15", "list-tech"),
        bulletItem("Aging reports and DSO analytics with trend analysis", "list-tech"),

        heading("3.4 Cash & Treasury Management", HeadingLevel.HEADING_2),
        
        bodyPara("Treasury Management Systems (TMS) have become critical for organizations managing complex cash positions across multiple banks, currencies, and entities. Real-time bank connectivity through APIs enables instant cash position visibility, while sophisticated forecasting algorithms optimize working capital and identify investment opportunities for excess cash."),

        bulletItem("Real-time bank connectivity via APIs (Plaid, Teller, MX, direct bank integrations)", "list-phases"),
        bulletItem("Global cash positioning with multi-currency aggregation", "list-phases"),
        bulletItem("Cash flow forecasting with scenario modeling (best case, worst case, likely)", "list-phases"),
        bulletItem("Bank account management with signatory controls and authorization workflows", "list-phases"),
        bulletItem("Short-term investment management for excess cash optimization", "list-phases"),
        bulletItem("FX exposure management with hedge accounting support", "list-phases"),
        bulletItem("Intercompany funding and netting for multinational organizations", "list-phases"),

        heading("3.5 Fixed Assets Management", HeadingLevel.HEADING_2),
        
        bodyPara("Fixed Asset Management tracks the complete lifecycle of tangible and intangible assets from acquisition through disposal. The module must handle complex depreciation calculations across multiple methods and books, support revaluation requirements under IFRS, and maintain detailed asset registers for insurance and tax purposes."),

        bulletItem("Multiple depreciation methods (straight-line, declining balance, units of production, MACRS)", "list-features"),
        bulletItem("Asset categorization and hierarchical organization (location, department, cost center)", "list-features"),
        bulletItem("Impairment testing and revaluation functionality per IAS 36", "list-features"),
        bulletItem("Asset transfer, disposal, and retirement with automatic gain/loss calculation", "list-features"),
        bulletItem("Integration with AP for capital expenditure capture and project capitalization", "list-features"),
        bulletItem("Insurance tracking and tax schedule maintenance", "list-features"),
        bulletItem("Barcode/RFID tagging support for physical asset verification", "list-features"),

        // ===== COMPLIANCE STANDARDS =====
        heading("4. Accounting Standards Compliance"),

        heading("4.1 IFRS (International Financial Reporting Standards)", HeadingLevel.HEADING_2),
        
        bodyPara("IFRS is used in over 140 jurisdictions worldwide and represents the dominant accounting framework for global enterprises. A world-class financial system must provide native IFRS support including the ability to maintain parallel ledgers for entities reporting under different frameworks. Key IFRS standards requiring specific system capabilities include:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              tableHeader: true,
              cantSplit: true,
              children: ["Standard", "Requirement", "System Capability Needed"].map(text => 
                new TableCell({
                  shading: { type: ShadingType.CLEAR, fill: P.surface },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 21, color: c(P.primary) })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["IFRS 9", "Financial Instruments Classification", "Three-category classification engine"].map((text, i) => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: i === 2 ? 20 : 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["IFRS 15", "Revenue Recognition", "Five-step model with contract liability tracking"].map((text, i) => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: i === 2 ? 20 : 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["IFRS 16", "Lease Accounting", "Right-of-use asset and lease liability calculation"].map((text, i) => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: i === 2 ? 20 : 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["IAS 36", "Impairment Testing", "Recoverability testing with value-in-use calculations"].map((text, i) => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: i === 2 ? 20 : 21 })] })]
                })
              )
            })
          ]
        }),

        heading("4.2 US GAAP Considerations", HeadingLevel.HEADING_2),
        
        bodyPara("While IFRS is principles-based, US GAAP follows a rules-based approach with specific guidance for numerous industries. For organizations operating in or reporting to US stakeholders, the system must support GAAP-specific requirements including LIFO inventory costing (where permitted), ASC 740 tax provisions, ASC 842 lease accounting (similar but distinct from IFRS 16), and industry-specific guidance for software development costs, revenue arrangements, and financial instruments."),

        // ===== TECHNICAL ARCHITECTURE =====
        heading("5. Technical Architecture"),

        heading("5.1 Microservices Architecture Pattern", HeadingLevel.HEADING_2),
        
        bodyPara("Modern financial systems leverage microservices architecture to achieve scalability, resilience, and independent deployment of functional domains. Each major financial module operates as an independently deployable service with its own database, communicating via well-defined APIs. This architecture pattern, proven successful by leading fintech platforms serving millions of users, enables horizontal scaling during peak periods (month-end close, quarter-end reporting) without affecting other system components."),

        bodyPara("Domain-Driven Design (DDD) provides the foundational methodology for defining service boundaries around business capabilities rather than technical layers. Bounded contexts for each financial domain (General Ledger, AP, AR, Treasury, Fixed Assets) ensure clear ownership and enable autonomous team development. Event-driven communication between services maintains eventual consistency while providing high availability."),

        heading("5.2 API-First Design Principles", HeadingLevel.HEADING_2),
        
        bodyPara("API-first architecture ensures that all system functionality is exposed through well-documented RESTful or GraphQL APIs before any UI development begins. This approach enables multiple client applications (web, mobile, third-party integrations) to consume the same backend services consistently. Key API design considerations include versioning strategies, rate limiting, OAuth 2.0/OpenID Connect authentication, comprehensive error handling, and Swagger/OpenAPI documentation."),

        heading("5.3 Security & Compliance Framework", HeadingLevel.HEADING_2),
        
        bodyPara("Financial systems require the highest levels of security due to the sensitive nature of financial data and regulatory requirements. The security framework must encompass multiple layers including network security (TLS 1.3 encryption, WAF protection), application security (input validation, SQL injection prevention, XSS protection), data security (encryption at rest using AES-256, field-level encryption for PII), and operational security (SOC 2 Type II compliance, penetration testing, vulnerability scanning)."),

        bulletItem("Role-Based Access Control (RBAC) with granular permission mapping to financial functions", "list-tech"),
        bulletItem("Segregation of Duties (SoD) enforcement preventing conflicting role assignments", "list-tech"),
        bulletItem("Complete audit logging of all financial transactions with tamper-evident storage", "list-tech"),
        bulletItem("Multi-factor authentication for sensitive operations (payments above threshold, journal entries)", "list-tech"),
        bulletItem("Data residency controls ensuring data storage complies with regional regulations", "list-tech"),

        // ===== MULTI-CURRENCY =====
        heading("6. Multi-Currency & International Support"),

        bodyPara("Global enterprises require robust multi-currency capabilities to manage transactions across borders, consolidate financial statements in multiple reporting currencies, and hedge against foreign exchange risk. The system must support real-time exchange rate feeds from authoritative sources, historical rate maintenance for retrospective conversions, and automatic gain/loss recognition on currency fluctuations."),

        heading("6.1 Currency Management Features", HeadingLevel.HEADING_2),
        
        bulletItem("Unlimited currency definitions with precision control (up to 6 decimal places)", "list-benefits"),
        bulletItem("Automatic daily exchange rate updates via integration with ECB, IMF, or commercial providers", "list-benefits"),
        bulletItem("Triangular currency conversion for non-direct rate pairs", "list-benefits"),
        bulletItem("Functional currency designation at entity level with unlimited reporting currencies", "list-benefits"),
        bulletItem("Revaluation routines for monetary assets/liabilities at period end", "list-benefits"),
        bulletItem("Translation adjustments to equity (CTA) per IAS 21 requirements", "list-benefits"),
        bulletItem("Hyperinflationary economy handling per IAS 29", "list-benefits"),

        // ===== FINANCIAL REPORTING =====
        heading("7. Financial Reporting & Analytics"),

        heading("7.1 Core Financial Statements", HeadingLevel.HEADING_2),
        
        bodyPara("The system must generate primary financial statements (Balance Sheet, Income Statement, Cash Flow Statement, Statement of Changes in Equity) in multiple formats, currencies, and reporting frameworks. Report generation should support drill-down capability from summary totals to underlying transactions, comparative periods (prior year, budget, forecast), and variance analysis with automated explanations where possible."),

        heading("7.2 Financial KPIs and Metrics Dashboard", HeadingLevel.HEADING_2),
        
        bodyPara("Modern financial dashboards provide executives with real-time visibility into key performance indicators enabling proactive decision-making. Based on research from leading BI platforms and financial analytics best practices, the following KPIs should be prominently featured:"),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({
              tableHeader: true,
              cantSplit: true,
              children: ["KPI Category", "Key Metrics", "Target Audience"].map(text => 
                new TableCell({
                  shading: { type: ShadingType.CLEAR, fill: P.surface },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 21, color: c(P.primary) })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Liquidity", "Current Ratio, Quick Ratio, Cash Ratio, Working Capital", "CFO, Treasurer"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Profitability", "Gross Margin, Operating Margin, Net Profit Margin, ROA, ROE", "CEO, Board"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Efficiency", "Asset Turnover, Inventory Turnover, AR Turnover, AP Days", "COO, Operations"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Leverage", "Debt-to-Equity, Interest Coverage, Debt Service Coverage", "CFO, Investors"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })]
                })
              )
            }),
            new TableRow({
              cantSplit: true,
              children: ["Cash Flow", "Operating Cash Flow, Free Cash Flow, Cash Conversion Cycle", "Treasurer, FP&A"].map(text => 
                new TableCell({
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ children: [new TextRun({ text, size: 21 })] })]
                })
              )
            })
          ]
        }),

        // ===== BUDGETING & FORECASTING =====
        heading("8. Budgeting, Planning & Forecasting"),

        bodyPara("Integrated planning solutions replace fragmented spreadsheet processes with collaborative, governed workflows that connect strategic plans to operational budgets and rolling forecasts. Leading platforms like CCH Tagetik, Anaplan, and Adaptive Insights demonstrate the value of driver-based planning models that automatically update downstream calculations when assumptions change."),

        heading("8.1 Budgeting Capabilities", HeadingLevel.HEADING_2),
        
        bulletItem("Driver-based budgeting linking operational drivers (headcount, units, square footage) to financial line items", "list-modules"),
        bulletItem("Workflow-enabled budget creation with approval routing and version control", "list-modules"),
        bulletItem("Bottom-up and top-down budgeting approaches with iterative reconciliation", "list-modules"),
        bulletItem("What-if scenario modeling for multiple budget versions (optimistic, baseline, conservative)", "list-modules"),
        bulletItem("Capital budgeting with project approval workflows and ROI tracking", "list-modules"),
        bulletItem("Workforce planning integration with HR systems for labor cost modeling", "list-modules"),

        heading("8.2 Forecasting & Predictive Analytics", HeadingLevel.HEADING_2),
        
        bulletItem("Rolling forecasts with automatic actual-to-plan variance incorporation", "list-benefits"),
        bulletItem("Machine learning-powered revenue forecasting using historical patterns and external signals", "list-benefits"),
        bulletItem("Cash flow forecasting with probability-weighted scenarios", "list-benefits"),
        bulletItem("Demand sensing integration for inventory-driven cost projections", "list-benefits"),
        bulletItem("Predictive analytics for identifying financial risks and opportunities", "list-benefits"),

        // ===== TAX MANAGEMENT =====
        heading("9. Tax Compliance & Automation"),

        bodyPara("Tax compliance represents one of the most complex aspects of financial management, with requirements varying significantly across jurisdictions. The system must support indirect tax (VAT/GST/Sales Tax) calculation and reporting, direct tax provision calculations, transfer pricing documentation, and increasingly, country-by-country reporting (CbCR) under BEPS guidelines."),

        bulletItem("Automated VAT/GST determination based on product/service tax codes and jurisdiction rules", "list-tech"),
        bulletItem("Tax rate maintenance with effective date handling for rate changes", "list-tech"),
        bulletItem("Multi-jurisdiction tax return preparation with e-filing capabilities", "list-tech"),
        bulletItem("Transfer pricing documentation and intercompany charge calculations", "list-tech"),
        bulletItem("Tax provision automation (ASC 740 / IAS 12) with deferred tax calculations", "list-tech"),
        bulletItem("Country-by-Country Reporting template generation per OECD guidelines", "list-tech"),
        bulletItem("Tax calendar management with deadline tracking and reminder workflows", "list-tech"),

        // ===== IMPLEMENTATION ROADMAP =====
        heading("10. Implementation Roadmap"),

        heading("Phase 1: Foundation (Months 1-3)", HeadingLevel.HEADING_2),
        
        bodyPara("The foundation phase establishes core infrastructure and essential financial modules that form the platform upon which subsequent capabilities will be built. This phase focuses on delivering immediate value through automation of basic financial processes while creating the architectural patterns that will guide future development."),

        bulletItem("Core infrastructure setup: authentication, authorization, audit logging, multi-tenancy", "list-phases"),
        bulletItem("General Ledger implementation with multi-dimensional chart of accounts", "list-phases"),
        bulletItem("Basic AP/AR functionality with invoice entry and payment processing", "list-phases"),
        bulletItem("Single-currency support with base reporting capabilities", "list-phases"),
        bulletItem("Fundamental financial statements (Balance Sheet, Income Statement, Trial Balance)", "list-phases"),
        bulletItem("User interface for data entry, inquiry, and basic reporting", "list-phases"),

        heading("Phase 2: Enhancement (Months 4-6)", HeadingLevel.HEADING_2),
        
        bodyPara("The enhancement phase expands upon the foundation to include more sophisticated features required by mid-market and growing enterprises. Focus areas include automation capabilities, multi-entity support, and integration readiness."),

        bulletItem("Multi-currency enablement with exchange rate management", "list-phases"),
        bulletItem("Fixed Assets module with depreciation engines", "list-phases"),
        bulletItem("Cash Management with basic bank integration", "list-phases"),
        bulletItem("Workflow engine for approval routing and SoD enforcement", "list-phases"),
        bulletItem("Basic budgeting and budget vs. actual reporting", "list-phases"),
        bulletItem("REST API layer enabling third-party integrations", "list-phases"),

        heading("Phase 3: Intelligence (Months 7-9)", HeadingLevel.HEADING_2),
        
        bodyPara("The intelligence phase introduces advanced analytics, automation, and enterprise-grade features that differentiate the solution from basic accounting software. Machine learning capabilities begin providing predictive insights."),

        bulletItem("Advanced financial analytics dashboard with KPI visualization", "list-phases"),
        bulletItem("AI-powered invoice processing and cash application", "list-phases"),
        bulletItem("Treasury management with cash forecasting", "list-phases"),
        bulletItem("Revenue recognition automation (ASC 606/IFRS 15)", "list-phases"),
        bulletItem("Intercompany transaction processing and elimination", "list-phases"),
        bulletItem("Mobile applications for approvals and inquiries", "list-phases"),

        heading("Phase 4: Enterprise (Months 10-12)", HeadingLevel.HEADING_2),
        
        bodyPara("The enterprise phase delivers capabilities required by large, complex organizations operating across multiple jurisdictions with sophisticated compliance requirements. Full multi-framework support and advanced planning features complete the world-class feature set."),

        bulletItem("Full IFRS and US GAAP dual-reporting capability", "list-phases"),
        bulletItem("Consolidation engine for multi-entity financial reporting", "list-phases"),
        bulletItem("Advanced planning with driver-based modeling and scenarios", "list-phases"),
        bulletItem("Tax compliance automation for multiple jurisdictions", "list-phases"),
        bulletItem("Audit management and internal controls documentation", "list-phases"),
        bulletItem("Advanced security features and SOC 2 compliance certification", "list-phases"),

        // ===== CONCLUSION =====
        heading("11. Success Factors"),

        bodyPara("Building a world-class financial management system requires attention to both technical excellence and domain expertise. The following critical success factors should guide development priorities and resource allocation throughout the implementation journey:"),

        bulletItem("Domain Expertise: Engage experienced financial professionals (CPAs, CFAs, former auditors) in design decisions to ensure accounting logic correctness and practical usability", "list-features"),
        bulletItem("Regulatory Awareness: Monitor evolving accounting standards (IASB, FASB projects) and proactively plan for upcoming changes", "list-features"),
        bulletItem("Data Quality: Implement robust validation rules and reconciliation procedures to maintain data integrity as the foundation of trustworthy financial information", "list-features"),
        bulletItem("User Experience: Design intuitive interfaces that reduce training time and minimize errors, recognizing that finance users vary widely in technical sophistication", "list-features"),
        bulletItem("Performance: Ensure sub-second response times for high-volume operations (journal entry posting, report generation) even with large datasets", "list-features"),
        bulletItem("Scalability: Architecture must handle growth from startup to enterprise without fundamental redesign, supporting both vertical and horizontal scaling", "list-features"),
        bulletItem("Integration Readiness: Pre-built connectors for common ERPs, banking platforms, and productivity tools accelerate time-to-value", "list-features"),
        bulletItem("Continuous Delivery: Automated testing and deployment pipelines enabling frequent releases without disrupting month-end close cycles", "list-features"),

        new Paragraph({ spacing: { before: 400 }, children: [] })
      ]
    }
  ]
});

// Generate document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Global_Financial_Management_System_Development_Plan.docx", buffer);
  console.log("Document generated successfully!");
}).catch(err => {
  console.error("Error generating document:", err);
});
