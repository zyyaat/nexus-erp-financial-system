const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageBreak, TableOfContents, LevelFormat
} = require("docx");
const fs = require("fs");

// Palette
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
    spacing: { before: 400, after: 150, line: 312 },
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
      {
        reference: "list-1",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } }
      },
      children: [
        heading("Global Financial Management System - Development Plan"),
        bodyPara("This comprehensive development plan outlines the architecture, features, and implementation strategy for building a world-class Enterprise Financial Management System (EFMS)."),
        bodyPara("Based on extensive research of global standards including FSB key standards, IFRS/GAAP compliance requirements, and analysis of leading platforms like SAP S/4HANA Finance, Oracle NetSuite, Microsoft Dynamics 365."),
        heading("Core Financial Modules", HeadingLevel.HEADING_2),
        bodyPara("The following core modules represent the essential foundation of any world-class financial management system:"),
        bulletItem("General Ledger (GL) - Central repository for all financial transactions", "list-1"),
        bulletItem("Accounts Payable (AP) - Invoice processing and payment automation", "list-1"),
        bulletItem("Accounts Receivable (AR) - Billing and collections management", "list-1"),
        bulletItem("Cash & Treasury Management - Cash positioning and forecasting", "list-1"),
        bulletItem("Fixed Assets Management - Asset lifecycle tracking", "list-1")
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Finance_Plan_Test.docx", buffer);
  console.log("Test document generated successfully!");
});
