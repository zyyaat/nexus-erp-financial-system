const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageBreak, TableOfContents, LevelFormat
} = require("docx");
const fs = require("fs");

const P = {
  primary: "#0D1B2A",
  body: "#1B263B",
  secondary: "#415A77",
  accent: "#2E8B57",
  surface: "#F0F4F8"
};
const c = (hex) => hex.replace("#", "");

function heading(text, level = HeadingLevel.HEADING_1) {
  const sizes = {};
  sizes[HeadingLevel.HEADING_1] = 32;
  sizes[HeadingLevel.HEADING_2] = 28;
  sizes[HeadingLevel.HEADING_3] = 24;
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
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } })]
  });
}

function bulletItem(text, reference) {
  return new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } })]
  });
}

function makeCell(text, isHeader = false) {
  return new TableCell({
    shading: isHeader ? { type: ShadingType.CLEAR, fill: P.surface } : undefined,
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    children: [new Paragraph({ 
      alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT, 
      children: [new TextRun({ text, bold: isHeader, size: 21, color: isHeader ? c(P.primary) : c(P.body) })] 
    })]
  });
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "SimSun" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } }
      }
    }
  },
  numbering: {
    config: [
      { reference: "list-1", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "list-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "list-3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "list-4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "list-5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // COVER
    {
      properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
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
                    new Paragraph({ spacing: { before: 2400, after: 0, line: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Global Financial Management System", bold: true, size: 44, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
                    new Paragraph({ spacing: { before: 200, after: 0, line: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Development Plan & Best Practices Guide", size: 28, color: "E0E7FF", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 600, after: 0, line: 350 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Financial Management System Development Plan", bold: true, size: 36, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
                    new Paragraph({ spacing: { before: 1800, after: 0, line: 300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Market Size: USD 9.28B (2024) to USD 26.85B (2032)", size: 22, color: "94A3B8", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 100, after: 0, line: 300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CAGR: 14.2%", bold: true, size: 26, color: c(P.accent), font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 1200, after: 0, line: 300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Based on Research: FSB, Oracle, SAP, NetSuite, KPMG, Gartner", size: 20, color: "64748B", font: { ascii: "Calibri", eastAsia: "SimSun" } })] }),
                    new Paragraph({ spacing: { before: 200, after: 0, line: 300 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "August 2026", size: 20, color: "64748B", font: { ascii: "Calibri", eastAsia: "SimSun" } })] })
                  ]
                })
              ]
            })
          ]
        })
      ]
    },
    // TOC
    {
      properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Financial Management System Development Plan", size: 18, color: "64748B" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })] }) },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Table of Contents", font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
        new TableOfContents(),
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "(Right-click and select 'Update Field' to refresh page numbers)", italics: true, size: 20, color: "64748B" })] }),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    // BODY
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Global Financial Management System - Development Plan", size: 18, color: "64748B" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })] }) },
      children: [
        // Section 1
        heading("1. Executive Summary"),
        bodyPara("This comprehensive development plan outlines the architecture, features, and implementation strategy for building a world-class Enterprise Financial Management System (EFMS). Based on extensive research of global standards including FSB key standards, IFRS/GAAP compliance requirements, and analysis of leading platforms like SAP S/4HANA Finance, Oracle NetSuite, Microsoft Dynamics 365, and QuickBooks Enterprise, this document provides a complete roadmap for developing a competitive financial management solution."),
        bodyPara("The global Enterprise Financial Management Software market is projected to grow from USD 9.28 billion in 2024 to an estimated USD 26.85 billion by 2032, representing a compound annual growth rate (CAGR) of approximately 14.2%. This growth is driven by increasing demand for real-time financial visibility, regulatory compliance automation, multi-currency transaction support, and integration with emerging technologies such as artificial intelligence and machine learning for predictive financial analytics."),

        // Section 2
        heading("2. Global Market Overview"),
        heading("2.1 Market Size and Growth Trajectory", HeadingLevel.HEADING_2),
        bodyPara("The enterprise financial management software sector is experiencing unprecedented growth, fueled by digital transformation initiatives across industries. Organizations are increasingly moving away from legacy spreadsheet-based financial processes toward integrated, cloud-native solutions that offer real-time collaboration, automated compliance checking, and advanced analytical capabilities."),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({ tableHeader: true, cantSplit: true, children: ["Metric", "2024 Value", "2032 Projection", "CAGR"].map(t => makeCell(t, true)) }),
            new TableRow({ cantSplit: true, children: ["Market Size", "USD 9.28B", "USD 26.85B", "14.2%"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["Cloud Segment", "62%", "85%", "-"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["SMB Adoption", "45%", "72%", "-"].map(t => makeCell(t)) })
          ]
        }),

        heading("2.2 Key Market Drivers", HeadingLevel.HEADING_2),
        bulletItem("Regulatory Compliance Complexity: Increasing global regulations including GDPR, SOX, Basel III require sophisticated compliance automation", "list-1"),
        bulletItem("Digital Transformation Mandates: Organizations prioritizing financial process automation to reduce costs and improve accuracy", "list-1"),
        bulletItem("Real-time Financial Visibility: Demand for instant access to financial data has become a competitive necessity", "list-1"),
        bulletItem("Multi-entity Consolidation: Growing need for unified reporting across subsidiaries, currencies, and jurisdictions", "list-1"),
        bulletItem("AI/ML Integration: AI for cash flow forecasting, anomaly detection, and automated reconciliation is now standard", "list-1"),

        // Section 3
        heading("3. Core Financial Modules"),
        bodyPara("Based on comprehensive analysis of leading ERP financial modules from Oracle NetSuite, SAP S/4HANA, Microsoft Dynamics 365, and specialized solutions like Sage Intacct and Coupa, the following core modules represent the essential foundation:"),

        heading("3.1 General Ledger (GL)", HeadingLevel.HEADING_2),
        bodyPara("The General Ledger serves as the central repository for all financial transactions and forms the backbone of the entire financial system. Modern GL systems must support multi-dimensional chart of accounts, automatic journal entry generation, real-time trial balance calculations, and seamless consolidation."),
        bulletItem("Multi-dimensional Chart of Accounts with customizable segments (department, cost center, project, location)", "list-2"),
        bulletItem("Automatic intercompany elimination entries during consolidation", "list-2"),
        bulletItem("Real-time trial balance, balance sheet, and income statement generation", "list-2"),
        bulletItem("Support for multiple accounting standards (IFRS, US GAAP, local GAAP) simultaneously", "list-2"),
        bulletItem("Audit trail with full transaction history and modification tracking", "list-2"),

        heading("3.2 Accounts Payable (AP)", HeadingLevel.HEADING_2),
        bodyPara("Accounts Payable automation has evolved significantly with AI-powered invoice processing, electronic payment networks, and dynamic discounting optimization. Leading AP systems offer end-to-end invoice-to-pay automation reducing processing costs by up to 80%."),
        bulletItem("AI-powered invoice capture with OCR and machine learning for data extraction", "list-3"),
        bulletItem("Three-way matching (PO, receipt, invoice) with tolerance-based exception handling", "list-3"),
        bulletItem("Workflow approval routing based on amount, vendor, or custom rules", "list-3"),
        bulletItem("Dynamic discounting optimization for early payment capture", "list-3"),
        bulletItem("Multiple payment methods support (ACH, wire, card, international transfers)", "list-3"),

        heading("3.3 Accounts Receivable (AR)", HeadingLevel.HEADING_2),
        bodyPara("Effective AR management directly impacts organizational cash flow and liquidity. Modern AR systems integrate credit management, collections automation, and customer self-service portals to reduce Days Sales Outstanding (DSO)."),
        bulletItem("Automated invoicing with customizable templates and multi-language support", "list-4"),
        bulletItem("Credit limit management with real-time exposure monitoring", "list-4"),
        bulletItem("Collections workflow with priority scoring and communication templates", "list-4"),
        bulletItem("Customer portal for viewing invoices, making payments, and disputing charges", "list-4"),
        bulletItem("Revenue recognition automation compliant with ASC 606/IFRS 15", "list-4"),

        heading("3.4 Cash & Treasury Management", HeadingLevel.HEADING_2),
        bodyPara("Treasury Management Systems have become critical for organizations managing complex cash positions across multiple banks, currencies, and entities. Real-time bank connectivity enables instant cash position visibility."),
        bulletItem("Real-time bank connectivity via APIs (Plaid, Teller, MX, direct bank integrations)", "list-5"),
        bulletItem("Global cash positioning with multi-currency aggregation", "list-5"),
        bulletItem("Cash flow forecasting with scenario modeling (best case, worst case, likely)", "list-5"),
        bulletItem("Bank account management with signatory controls and authorization workflows", "list-5"),
        bulletItem("FX exposure management with hedge accounting support", "list-5"),

        // Section 4
        heading("4. Accounting Standards Compliance"),
        heading("4.1 IFRS Requirements", HeadingLevel.HEADING_2),
        bodyPara("IFRS is used in over 140 jurisdictions worldwide. A world-class financial system must provide native IFRS support including parallel ledgers for entities reporting under different frameworks."),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({ tableHeader: true, cantSplit: true, children: ["Standard", "Requirement", "System Capability Needed"].map(t => makeCell(t, true)) }),
            new TableRow({ cantSplit: true, children: ["IFRS 9", "Financial Instruments Classification", "Three-category classification engine with ECL model"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["IFRS 15", "Revenue Recognition", "Five-step model with contract liability tracking"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["IFRS 16", "Lease Accounting", "Right-of-use asset and lease liability calculation"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["IAS 36", "Impairment Testing", "Recoverability testing with value-in-use calculations"].map(t => makeCell(t)) })
          ]
        }),

        // Section 5
        heading("5. Technical Architecture"),
        heading("5.1 Microservices Architecture Pattern", HeadingLevel.HEADING_2),
        bodyPara("Modern financial systems leverage microservices architecture to achieve scalability, resilience, and independent deployment. Each major module operates as an independently deployable service with its own database, communicating via well-defined APIs."),
        bodyPara("Domain-Driven Design (DDD) provides the foundational methodology for defining service boundaries around business capabilities. Bounded contexts ensure clear ownership and enable autonomous team development."),

        heading("5.2 Security Framework", HeadingLevel.HEADING_2),
        bodyPara("Financial systems require the highest levels of security due to sensitive financial data and regulatory requirements. The framework must encompass network security, application security, data encryption, and operational security."),
        bulletItem("Role-Based Access Control (RBAC) with granular permission mapping", "list-1"),
        bulletItem("Segregation of Duties (SoD) enforcement preventing conflicting roles", "list-1"),
        bulletItem("Complete audit logging with tamper-evident storage", "list-1"),
        bulletItem("Multi-factor authentication for sensitive operations", "list-1"),

        // Section 6
        heading("6. Multi-Currency Support"),
        bodyPara("Global enterprises require robust multi-currency capabilities to manage transactions across borders, consolidate statements in multiple reporting currencies, and hedge against foreign exchange risk."),
        bulletItem("Unlimited currency definitions with precision control (up to 6 decimal places)", "list-2"),
        bulletItem("Automatic daily exchange rate updates via ECB, IMF, or commercial providers", "list-2"),
        bulletItem("Functional currency designation at entity level with unlimited reporting currencies", "list-2"),
        bulletItem("Revaluation routines for monetary assets/liabilities at period end", "list-2"),
        bulletItem("Translation adjustments to equity (CTA) per IAS 21 requirements", "list-2"),

        // Section 7
        heading("7. Financial Reporting & Analytics"),
        heading("7.1 Key Performance Indicators", HeadingLevel.HEADING_2),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" }, insideVertical: { style: BorderStyle.NONE } },
          rows: [
            new TableRow({ tableHeader: true, cantSplit: true, children: ["KPI Category", "Key Metrics", "Target Audience"].map(t => makeCell(t, true)) }),
            new TableRow({ cantSplit: true, children: ["Liquidity", "Current Ratio, Quick Ratio, Cash Ratio, Working Capital", "CFO, Treasurer"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["Profitability", "Gross Margin, Operating Margin, Net Profit Margin, ROA, ROE", "CEO, Board"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["Efficiency", "Asset Turnover, Inventory Turnover, AR Turnover, AP Days", "COO, Operations"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["Leverage", "Debt-to-Equity, Interest Coverage, Debt Service Coverage", "CFO, Investors"].map(t => makeCell(t)) }),
            new TableRow({ cantSplit: true, children: ["Cash Flow", "Operating Cash Flow, Free Cash Flow, Cash Conversion Cycle", "Treasurer, FP&A"].map(t => makeCell(t)) })
          ]
        }),

        // Section 8
        heading("8. Budgeting & Forecasting"),
        bodyPara("Integrated planning solutions replace fragmented spreadsheet processes with collaborative, governed workflows connecting strategic plans to operational budgets and rolling forecasts."),
        bulletItem("Driver-based budgeting linking operational drivers to financial line items", "list-3"),
        bulletItem("Workflow-enabled budget creation with approval routing and version control", "list-3"),
        bulletItem("What-if scenario modeling for multiple budget versions", "list-3"),
        bulletItem("Machine learning-powered revenue forecasting using historical patterns", "list-3"),
        bulletItem("Cash flow forecasting with probability-weighted scenarios", "list-3"),

        // Section 9
        heading("9. Tax Compliance & Automation"),
        bodyPara("Tax compliance represents one of the most complex aspects of financial management. The system must support indirect tax calculation, direct tax provisions, transfer pricing documentation, and country-by-country reporting."),
        bulletItem("Automated VAT/GST determination based on tax codes and jurisdiction rules", "list-4"),
        bulletItem("Multi-jurisdiction tax return preparation with e-filing capabilities", "list-4"),
        bulletItem("Tax provision automation (ASC 740 / IAS 12) with deferred tax calculations", "list-4"),
        bulletItem("Country-by-Country Reporting template generation per OECD guidelines", "list-4"),
        bulletItem("Tax calendar management with deadline tracking and reminder workflows", "list-4"),

        // Section 10 - Roadmap
        heading("10. Implementation Roadmap"),
        
        heading("Phase 1: Foundation (Months 1-3)", HeadingLevel.HEADING_2),
        bodyPara("The foundation phase establishes core infrastructure and essential financial modules forming the platform for future development."),
        bulletItem("Core infrastructure: authentication, authorization, audit logging, multi-tenancy", "list-5"),
        bulletItem("General Ledger with multi-dimensional chart of accounts", "list-5"),
        bulletItem("Basic AP/AR functionality with invoice entry and payment processing", "list-5"),
        bulletItem("Single-currency support with base reporting capabilities", "list-5"),
        bulletItem("Fundamental financial statements (Balance Sheet, Income Statement, Trial Balance)", "list-5"),

        heading("Phase 2: Enhancement (Months 4-6)", HeadingLevel.HEADING_2),
        bodyPara("The enhancement phase expands with sophisticated features required by mid-market and growing enterprises."),
        bulletItem("Multi-currency enablement with exchange rate management", "list-5"),
        bulletItem("Fixed Assets module with depreciation engines", "list-5"),
        bulletItem("Cash Management with basic bank integration", "list-5"),
        bulletItem("Workflow engine for approval routing and SoD enforcement", "list-5"),
        bulletItem("REST API layer enabling third-party integrations", "list-5"),

        heading("Phase 3: Intelligence (Months 7-9)", HeadingLevel.HEADING_2),
        bodyPara("The intelligence phase introduces advanced analytics, automation, and enterprise-grade features."),
        bulletItem("Advanced financial analytics dashboard with KPI visualization", "list-5"),
        bulletItem("AI-powered invoice processing and cash application", "list-5"),
        bulletItem("Treasury management with cash forecasting", "list-5"),
        bulletItem("Revenue recognition automation (ASC 606/IFRS 15)", "list-5"),
        bulletItem("Mobile applications for approvals and inquiries", "list-5"),

        heading("Phase 4: Enterprise (Months 10-12)", HeadingLevel.HEADING_2),
        bodyPara("The enterprise phase delivers capabilities for large organizations operating across multiple jurisdictions."),
        bulletItem("Full IFRS and US GAAP dual-reporting capability", "list-5"),
        bulletItem("Consolidation engine for multi-entity financial reporting", "list-5"),
        bulletItem("Advanced planning with driver-based modeling and scenarios", "list-5"),
        bulletItem("Tax compliance automation for multiple jurisdictions", "list-5"),
        bulletItem("Advanced security features and SOC 2 compliance certification", "list-5"),

        // Section 11
        heading("11. Success Factors"),
        bodyPara("Building a world-class financial management system requires attention to both technical excellence and domain expertise. Critical success factors include:"),
        bulletItem("Domain Expertise: Engage experienced financial professionals (CPAs, CFAs, former auditors) in design decisions", "list-1"),
        bulletItem("Regulatory Awareness: Monitor evolving accounting standards (IASB, FASB projects) proactively", "list-1"),
        bulletItem("Data Quality: Implement robust validation rules and reconciliation procedures", "list-1"),
        bulletItem("User Experience: Design intuitive interfaces that reduce training time and minimize errors", "list-1"),
        bulletItem("Performance: Ensure sub-second response times for high-volume operations", "list-1"),
        bulletItem("Scalability: Architecture must handle growth from startup to enterprise without redesign", "list-1"),
        bulletItem("Integration Readiness: Pre-built connectors for common ERPs and banking platforms", "list-1"),
        bulletItem("Continuous Delivery: Automated testing and deployment pipelines for frequent releases", "list-1"),

        new Paragraph({ spacing: { before: 400 }, children: [] })
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Global_Financial_Management_System_Development_Plan.docx", buffer);
  console.log("Document generated successfully!");
}).catch(err => {
  console.error("Error:", err);
});
