const { Document, Packer, Paragraph, TextRun, Header, Footer,
        AlignmentType, HeadingLevel, PageNumber, Table, TableRow, TableCell,
        WidthType, BorderStyle, ShadingType, TableOfContents, PageBreak,
        LevelFormat } = require("docx");
const fs = require("fs");

// Palette - GO-1 (Government/Official)
const P = {
  primary: "#1B365D",
  body: "#2C3E50",
  secondary: "#5D6D7E",
  accent: "#2E86AB",
  surface: "#F8F9FA"
};
const c = (hex) => hex.replace("#", "");

// Helper functions
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 300, after: 200 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Arial", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })]
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 200 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "SimSun" } })]
  });
}

function bulletPoint(text) {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 720 },
    children: [
      new TextRun({ text: "\u2022 ", size: 24 }),
      new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "SimSun" } })
    ]
  });
}

// Cover Recipe R4 - Top Color Block
function buildCoverR4() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
    rows: [
      new TableRow({
        height: { value: 16838, rule: "exact" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, color: c(P.primary) },
            verticalAlign: "top",
            children: [
              new Paragraph({ spacing: { before: 2400, after: 0 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "NEXUS ERP", bold: true, color: c(P.accent), size: 48, font: "Arial" })] }),
              new Paragraph({ spacing: { before: 400, after: 200 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Global Inventory Management System", bold: true, color: "FFFFFF", size: 36, font: "Arial" })] }),
              new Paragraph({ spacing: { before: 200, after: 600 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Comprehensive Development Plan & Feature Roadmap", color: c(P.surface), size: 28, font: "Arial" })] }),
              new Paragraph({ spacing: { before: 1200, after: 200 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Enterprise-Grade Solution for Modern Supply Chain", color: c(P.accent), size: 24, font: "Arial", italics: true })] }),
              new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Version 2.0 | 2026", color: c(P.surface), size: 22, font: "Arial" })] }),
              new Paragraph({ spacing: { before: 200, after: 0 }, alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Based on Global Best Practices & Industry Standards", color: c(P.secondary), size: 20, font: "Arial" })] })
            ]
          })
        ]
      })
    ]
  });
}

// Main document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimSun" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } }
      }
    }
  },
  sections: [
    // Section 1: Cover
    {
      properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: [buildCoverR4()]
    },
    
    // Section 2: TOC
    {
      properties: { 
        page: { 
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: LevelFormat.UPPER_ROMAN }
        }
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })] })
      },
      children: [
        new Paragraph({ spacing: { before: 400, after: 200 }, children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, color: c(P.primary) })] }),
        new TableOfContents(),
        new Paragraph({ children: [new PageBreak()] })
      ]
    },
    
    // Section 3: Body Content
    {
      properties: { 
        page: { 
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: LevelFormat.DECIMAL }
        }
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 18 })] })] })
      },
      children: [
        // Executive Summary
        heading("1. Executive Summary"),
        body("This comprehensive development plan outlines the transformation of the Nexus ERP inventory management system into a world-class, enterprise-grade solution. The global inventory management software market is projected to reach $5.52 billion by 2034, exhibiting a CAGR of 9.13%. This plan addresses the critical need for modern businesses to have robust, scalable, and intelligent inventory management capabilities."),
        body("The proposed system will incorporate cutting-edge technologies including AI-powered demand forecasting, real-time multi-location tracking, RFID and barcode integration, advanced warehouse management features, and comprehensive analytics dashboards. This transformation will position Nexus ERP as a competitive solution in the global market, capable of serving enterprises of all sizes from SMBs to large multinational corporations."),
        
        // Current System Analysis
        heading("2. Current System Analysis"),
        heading("2.1 Existing Capabilities", HeadingLevel.HEADING_2),
        body("The current inventory management system provides fundamental functionality including basic product tracking with SKU management, simple stock level monitoring, category-based organization, status indicators (in-stock, low-stock, out-of-stock, overstock), warehouse location tracking, and basic search and filter capabilities. The system supports multiple languages through an i18n framework including Arabic (with RTL support), English, French, and Spanish."),
        
        heading("2.2 Identified Gaps & Limitations", HeadingLevel.HEADING_2),
        body("Through comprehensive analysis against global industry standards and best practices, several critical gaps have been identified that must be addressed to achieve world-class status:"),
        bulletPoint("Lack of real-time synchronization across multiple locations and warehouses"),
        bulletPoint("No barcode or RFID scanning integration for automated data capture"),
        bulletPoint("Absence of intelligent demand forecasting using AI/ML algorithms"),
        bulletPoint("Limited reporting and analytics capabilities"),
        bulletPoint("No batch or serial number tracking for traceability"),
        bulletPoint("Missing multi-currency support for global operations"),
        bulletPoint("No integration capabilities with external systems (ERP, e-commerce, shipping)"),
        bulletPoint("Basic reorder point logic without dynamic optimization"),
        bulletPoint("No mobile application for warehouse operations"),
        bulletPoint("Limited user role-based access control and audit trails"),
        
        // Core Features Roadmap
        heading("3. Comprehensive Feature Roadmap"),
        heading("3.1 Real-Time Multi-Location Inventory Tracking", HeadingLevel.HEADING_2),
        body("The enhanced system will provide real-time visibility across unlimited warehouse locations, retail stores, and third-party logistics (3PL) providers. Each location will have independent stock tracking while maintaining consolidated views for enterprise-wide decision making. The system will support inter-location transfers with complete tracking, automatic stock allocation based on proximity to demand, and location-specific pricing and cost tracking."),
        body("Key technical implementations include WebSocket connections for live updates, conflict resolution mechanisms for simultaneous edits, offline mode support with automatic synchronization, and geolocation-based inventory queries. The architecture will support horizontal scaling to handle thousands of concurrent users across different time zones."),
        
        heading("3.2 Advanced Warehouse Management (WMS)", HeadingLevel.HEADING_2),
        body("A full-featured Warehouse Management System module will be integrated, providing license plating for efficient handling of grouped items, zone and bin management with optimized pick paths, wave picking and batch processing capabilities, packing and label printing with customizable templates, and cross-docking functionality for rapid throughput."),
        body("The WMS will implement FIFO (First-In-First-Out) and FEFO (First-Expired-First-Out) algorithms for perishable goods management, cycle counting programs with ABC analysis integration, labor management with productivity tracking, and yard management for external container tracking. These features align with industry-leading solutions like SAP WMS and Manhattan Associates."),
        
        heading("3.3 AI-Powered Demand Forecasting", HeadingLevel.HEADING_2),
        body("Machine learning algorithms will be implemented to transform inventory planning from reactive to predictive. The system will utilize LSTM (Long Short-Term Memory) neural networks for time-series forecasting, Gradient Boosting Machines (GBM) for pattern recognition, and ensemble methods combining multiple models for improved accuracy."),
        body("External factors such as seasonal trends, promotional campaigns, economic indicators, weather patterns, and social media sentiment will be incorporated into forecasting models. The system will automatically adjust safety stock levels, optimize reorder points, and generate purchase recommendations based on predicted demand with confidence intervals."),
        
        heading("3.4 Barcode & RFID Integration", HeadingLevel.HEADING_2),
        body("Complete support for automatic identification and data capture (AIDC) technologies will be implemented. This includes barcode generation in multiple formats (UPC, EAN, Code128, QR codes), RFID tag encoding and reading integration, mobile device scanning via camera or dedicated scanners, bulk scanning for rapid receiving and cycle counting, and real-time location tracking using RFID readers with up to 10-meter range."),
        body("The integration will support major hardware vendors' SDKs and provide APIs for custom integrations. Error correction and validation will ensure data accuracy, reducing human error in manual entry by up to 95% according to industry benchmarks."),
        
        heading("3.5 Batch & Serial Number Traceability", HeadingLevel.HEADING_2),
        body("Complete traceability from receipt to dispatch will enable compliance with regulatory requirements and quality management standards. Each item can be tracked by batch lot, serial number, or both. The system maintains complete genealogy showing which items were received together, stored together, and shipped together."),
        body("Recall management functionality allows instant identification of affected items when quality issues arise. Expiry date tracking with automated alerts prevents spoilage. Certificate of Analysis (CoA) storage and retrieval supports quality documentation requirements for regulated industries."),
        
        heading("3.6 Multi-Currency & Global Commerce Support", HeadingLevel.HEADING_2),
        body("True multi-currency support enables global operations with automatic currency conversion using real-time exchange rates. Each warehouse can operate in its local currency while consolidating to a reporting currency for enterprise financials. Landed cost tracking includes freight, duties, insurance, and other import costs allocated appropriately."),
        body("Multi-language support extends beyond UI translations to include localized formats for dates, numbers, addresses, and tax calculations. Tax engine integration handles VAT, GST, sales tax, and other regional requirements with automatic rate updates."),
        
        // Technical Architecture
        heading("4. Technical Architecture"),
        heading("4.1 Scalable Microservices Architecture", HeadingLevel.HEADING_2),
        body("The system will be architected as a collection of loosely coupled microservices, each responsible for specific business capabilities. Core services include Inventory Core Service (product master, stock levels, movements), Location Service (warehouses, zones, bins, addresses), Transaction Service (receipts, issues, transfers, adjustments), Forecasting Service (AI/ML models, predictions, recommendations), Integration Service (API gateway, webhooks, EDI), and Reporting Service (analytics, dashboards, exports)."),
        body("Event-driven architecture using message queues ensures reliable communication between services and enables event sourcing for complete audit trails. Database per service pattern allows technology selection optimized for each service's needs - relational databases for transactional consistency, document stores for flexible schemas, time-series databases for historical data, and graph databases for relationship queries."),
        
        heading("4.2 Cloud-Native Infrastructure", HeadingLevel.HEADING_2),
        body("Containerized deployment using Docker and orchestration with Kubernetes enables elastic scaling based on demand. Multi-region deployment options support data residency requirements and reduce latency for global operations. Infrastructure as Code (IaC) using Terraform ensures consistent, repeatable deployments across development, staging, and production environments."),
        body("Managed cloud services will be utilized where appropriate, including managed databases (Amazon RDS, Cloud SQL), object storage for documents and images (S3, Cloud Storage), caching layers for performance (Redis, ElastiCache), and message queues for async processing (SQS, Pub/Sub). This approach reduces operational overhead while maintaining reliability and scalability."),
        
        heading("4.3 Security & Compliance Framework", HeadingLevel.HEADING_2),
        body("Enterprise-grade security implementation includes Role-Based Access Control (RBAC) with fine-grained permissions, Multi-Factor Authentication (MFA) support, encryption at rest using AES-256 and in transit using TLS 1.3, complete audit logging of all user actions, and SOC 2 Type II compliance controls. Data protection features support GDPR, CCPA, and other privacy regulations with data masking, retention policies, and right-to-deletion capabilities."),
        body("Penetration testing and vulnerability assessments will be conducted regularly. Security information and event management (SIEM) integration provides centralized monitoring. Backup and disaster recovery procedures ensure business continuity with defined RPO (Recovery Point Objective) and RTO (Recovery Time Objective) targets."),
        
        // Implementation Phases
        heading("5. Implementation Phases"),
        heading("Phase 1: Foundation (Months 1-3)", HeadingLevel.HEADING_2),
        body("The foundation phase establishes core infrastructure and essential enhancements. Key deliverables include database schema redesign supporting new features, RESTful API development following OpenAPI standards, authentication and authorization framework implementation, basic multi-location support with manual synchronization, and barcode generation and printing capabilities. This phase focuses on building solid technical foundations while delivering immediate value to users."),
        
        heading("Phase 2: Intelligence (Months 4-6)", HeadingLevel.HEADING_2),
        body("The intelligence phase introduces AI/ML capabilities and advanced tracking. Deliverables include demand forecasting model training and deployment, batch and serial number tracking implementation, RFID integration with pilot hardware, advanced analytics dashboard development, and automated reorder point optimization. User acceptance testing ensures features meet business requirements before broad rollout."),
        
        heading("Phase 3: Integration (Months 7-9)", HeadingLevel.HEADING_2),
        body("The integration phase connects the inventory system with external ecosystems. Key work includes e-commerce platform integrations (Shopify, Magento, WooCommerce), shipping carrier APIs (FedEx, UPS, DHL), accounting system synchronization (QuickBooks, Xero, SAP), EDI capability for B2B transactions, and public API for customer and partner integrations. Webhook infrastructure enables real-time notifications to connected systems."),
        
        heading("Phase 4: Optimization (Months 10-12)", HeadingLevel.HEADING_2),
        body("The optimization phase refines and scales the system based on operational experience. Focus areas include performance tuning and query optimization, mobile application launch for iOS and Android, advanced reporting with scheduled distributions, workflow automation engine implementation, and machine learning model retraining pipelines. Customer feedback drives prioritization of enhancement requests."),
        
        // Success Metrics
        heading("6. Success Metrics & KPIs"),
        body("Measurable outcomes will track the success of the implementation program:"),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({ shading: { type: ShadingType.CLEAR, color: c(P.primary) }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Metric Category", bold: true, color: "FFFFFF", size: 22 })] })] }),
                new TableCell({ shading: { type: ShadingType.CLEAR, color: c(P.primary) }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Key Performance Indicator", bold: true, color: "FFFFFF", size: 22 })] })] }),
                new TableCell({ shading: { type: ShadingType.CLEAR, color: c(P.primary) }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Target Value", bold: true, color: "FFFFFF", size: 22 })] })] })
              ]
            }),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Accuracy", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Inventory Accuracy Rate", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ">99.5%", size: 22, color: c(P.accent) })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Efficiency", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Picking Accuracy", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ">99.9%", size: 22, color: c(P.accent) })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Forecasting", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Demand Prediction Accuracy", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ">90%", size: 22, color: c(P.accent) })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Availability", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "System Uptime SLA", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "99.95%", size: 22, color: c(P.accent) })] })] })
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Performance", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "API Response Time (p95)", size: 22 })] })] }),
              new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "<200ms", size: 22, color: c(P.accent) })] })] })
            ]})
          ]
        }),
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        
        // Conclusion
        heading("7. Conclusion & Recommendations"),
        body("This development plan transforms the Nexus ERP inventory management system into a globally competitive solution aligned with enterprise requirements and industry best practices. The phased approach balances quick wins with long-term strategic objectives, ensuring continuous value delivery throughout the implementation journey."),
        body("Success depends on executive sponsorship, adequate resource allocation, and commitment to user-centric design principles. Regular review cycles should assess progress against milestones and adapt plans based on emerging requirements and technological advances. Investment in this system positions the organization for scalable growth and operational excellence in an increasingly complex global supply chain environment."),
        body("Immediate next steps include stakeholder alignment on priorities, detailed sprint planning for Phase 1, infrastructure provisioning and team mobilization, and establishment of governance processes for decision-making. With focused execution, the vision of a world-class inventory management system can become reality within the planned timeline.")
      ]
    }
  ]
});

// Generate document
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/Global_Inventory_Management_Development_Plan.docx", buf);
  console.log("Document generated successfully!");
}).catch(err => {
  console.error("Error generating document:", err);
});
