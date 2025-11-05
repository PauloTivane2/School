import PDFDocument from 'pdfkit';
import { Response } from 'express';

interface StudentInfo {
  nome: string;
  classe?: string;
  turma?: string;
  data_nascimento?: string;
  genero?: string;
}

interface PaymentData {
  valor: number;
  data_pagamento: string;
  estado: string;
  metodo?: string;
  referencia?: string;
}

interface AttendanceData {
  data: string;
  presente: boolean;
  observacao?: string;
}

export class PDFService {
  /**
   * Gerar relatório completo do aluno
   */
  static async generateCompleteReport(
    student: StudentInfo,
    payments: PaymentData[],
    attendance: AttendanceData[],
    res: Response
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio_${student.nome.replace(/\s/g, '_')}.pdf`
    );

    // Pipe document to response
    doc.pipe(res);

    // Header
    this.addHeader(doc, 'Relatório Completo do Educando');
    
    // Student Info
    this.addStudentInfo(doc, student);
    
    // Payments Section
    doc.moveDown(2);
    this.addSectionTitle(doc, '💰 Pagamentos');
    this.addPaymentsTable(doc, payments);
    
    // Attendance Section
    doc.addPage();
    this.addSectionTitle(doc, '✅ Presenças');
    this.addAttendanceTable(doc, attendance);
    
    // Footer
    this.addFooter(doc);
    
    doc.end();
  }

  /**
   * Gerar relatório de pagamentos
   */
  static async generatePaymentsReport(
    student: StudentInfo,
    payments: PaymentData[],
    res: Response
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=pagamentos_${student.nome.replace(/\s/g, '_')}.pdf`
    );

    doc.pipe(res);

    this.addHeader(doc, 'Relatório Financeiro');
    this.addStudentInfo(doc, student);
    
    doc.moveDown(2);
    this.addSectionTitle(doc, '💰 Histórico de Pagamentos');
    this.addPaymentsTable(doc, payments);
    
    // Summary boxes
    doc.moveDown(2);
    const total = payments.reduce((sum, p) => sum + p.valor, 0);
    const paid = payments.filter(p => p.estado === 'pago').reduce((sum, p) => sum + p.valor, 0);
    const pending = total - paid;
    
    const summaryY = doc.y;
    const boxWidth = 155;
    const boxHeight = 50;
    
    // Total box
    doc.rect(50, summaryY, boxWidth, boxHeight).fillAndStroke('#eff6ff', '#3b82f6');
    doc.fontSize(10).font('Helvetica').fillColor('#1e40af')
      .text('Total Geral', 60, summaryY + 10);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#1e3a8a')
      .text(`${total.toLocaleString('pt-PT')} MT`, 60, summaryY + 25);
    
    // Paid box
    doc.rect(220, summaryY, boxWidth, boxHeight).fillAndStroke('#d1fae5', '#10b981');
    doc.fontSize(10).font('Helvetica').fillColor('#065f46')
      .text('Total Pago', 230, summaryY + 10);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#047857')
      .text(`${paid.toLocaleString('pt-PT')} MT`, 230, summaryY + 25);
    
    // Pending box
    doc.rect(390, summaryY, boxWidth, boxHeight).fillAndStroke('#fee2e2', '#ef4444');
    doc.fontSize(10).font('Helvetica').fillColor('#991b1b')
      .text('Pendente', 400, summaryY + 10);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#7f1d1d')
      .text(`${pending.toLocaleString('pt-PT')} MT`, 400, summaryY + 25);
    
    doc.y = summaryY + boxHeight + 20;
    
    this.addFooter(doc);
    doc.end();
  }

  /**
   * Gerar relatório de presenças
   */
  static async generateAttendanceReport(
    student: StudentInfo,
    attendance: AttendanceData[],
    res: Response
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=presencas_${student.nome.replace(/\s/g, '_')}.pdf`
    );

    doc.pipe(res);

    this.addHeader(doc, 'Relatório de Presenças');
    this.addStudentInfo(doc, student);
    
    doc.moveDown(2);
    this.addSectionTitle(doc, '✅ Histórico de Presenças');
    this.addAttendanceTable(doc, attendance);
    
    // Summary boxes
    doc.moveDown(2);
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.presente).length;
    const absent = totalDays - present;
    const percentage = totalDays > 0 ? ((present / totalDays) * 100).toFixed(1) : '0';
    
    const summaryY = doc.y;
    const boxWidth = 118;
    const boxHeight = 50;
    
    // Total days box
    doc.rect(50, summaryY, boxWidth, boxHeight).fillAndStroke('#eff6ff', '#3b82f6');
    doc.fontSize(10).font('Helvetica').fillColor('#1e40af')
      .text('Total Dias', 60, summaryY + 10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1e3a8a')
      .text(`${totalDays}`, 60, summaryY + 25);
    
    // Presences box
    doc.rect(180, summaryY, boxWidth, boxHeight).fillAndStroke('#d1fae5', '#10b981');
    doc.fontSize(10).font('Helvetica').fillColor('#065f46')
      .text('Presenças', 190, summaryY + 10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#047857')
      .text(`${present}`, 190, summaryY + 25);
    
    // Absences box
    doc.rect(310, summaryY, boxWidth, boxHeight).fillAndStroke('#fee2e2', '#ef4444');
    doc.fontSize(10).font('Helvetica').fillColor('#991b1b')
      .text('Faltas', 320, summaryY + 10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#7f1d1d')
      .text(`${absent}`, 320, summaryY + 25);
    
    // Percentage box
    doc.rect(440, summaryY, boxWidth - 13, boxHeight).fillAndStroke('#dbeafe', '#2563eb');
    doc.fontSize(10).font('Helvetica').fillColor('#1e40af')
      .text('Frequência', 450, summaryY + 10);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#1e3a8a')
      .text(`${percentage}%`, 450, summaryY + 25);
    
    doc.y = summaryY + boxHeight + 20;
    
    this.addFooter(doc);
    doc.end();
  }

  // Helper methods
  private static addHeader(doc: PDFKit.PDFDocument, title: string): void {
    // Background box for header
    doc.rect(40, 40, 515, 100).fillAndStroke('#2563eb', '#1e40af');
    
    // School name
    doc.fontSize(24).font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text('Sistema de Gestão Escolar', 50, 55, { align: 'center', width: 495 });
    
    // Report title
    doc.fontSize(14).font('Helvetica')
      .fillColor('#e0e7ff')
      .text(title.toUpperCase(), 50, 85, { align: 'center', width: 495 });
    
    // Date box
    const dateText = `Emitido: ${new Date().toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`;
    doc.fontSize(9).font('Helvetica')
      .fillColor('#ffffff')
      .text(dateText, 50, 115, { align: 'center', width: 495 });
    
    doc.moveDown(3);
  }

  private static addStudentInfo(doc: PDFKit.PDFDocument, student: StudentInfo): void {
    const startY = doc.y;
    
    // Info box background
    doc.rect(50, startY, 495, 90).fillAndStroke('#f8fafc', '#e2e8f0');
    
    // Title bar
    doc.rect(50, startY, 495, 25).fillAndStroke('#0ea5e9', '#0284c7');
    doc.fontSize(12).font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text('📋 DADOS DO EDUCANDO', 60, startY + 7);
    
    // Student details
    const detailsY = startY + 35;
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#334155');
    
    doc.text('Nome:', 60, detailsY);
    doc.font('Helvetica').fillColor('#000000')
      .text(student.nome, 140, detailsY, { width: 390 });
    
    if (student.classe || student.turma) {
      doc.font('Helvetica-Bold').fillColor('#334155')
        .text('Turma:', 60, detailsY + 15);
      doc.font('Helvetica').fillColor('#000000')
        .text(`${student.classe || ''} ${student.turma ? '- ' + student.turma : ''}`.trim(), 140, detailsY + 15);
    }
    
    if (student.data_nascimento) {
      doc.font('Helvetica-Bold').fillColor('#334155')
        .text('Nascimento:', 60, detailsY + 30);
      doc.font('Helvetica').fillColor('#000000')
        .text(new Date(student.data_nascimento).toLocaleDateString('pt-PT'), 140, detailsY + 30);
    }
    
    if (student.genero) {
      doc.font('Helvetica-Bold').fillColor('#334155')
        .text('Género:', 350, detailsY + 30);
      doc.font('Helvetica').fillColor('#000000')
        .text(student.genero, 410, detailsY + 30);
    }
    
    doc.y = startY + 100;
    doc.moveDown(1);
  }

  private static addSectionTitle(doc: PDFKit.PDFDocument, title: string): void {
    doc.fontSize(14).font('Helvetica-Bold')
      .fillColor('#2563eb')
      .text(title, { underline: true });
    doc.moveDown(0.5);
  }

  private static addPaymentsTable(doc: PDFKit.PDFDocument, payments: PaymentData[]): void {
    if (payments.length === 0) {
      doc.rect(50, doc.y, 495, 40).fillAndStroke('#fef3c7', '#fbbf24');
      doc.fontSize(10).font('Helvetica').fillColor('#92400e')
        .text('⚠️  Nenhum pagamento registrado.', 60, doc.y - 30, { width: 475, align: 'center' });
      doc.moveDown(3);
      return;
    }

    const tableTop = doc.y;
    const itemHeight = 22;
    const pageHeight = 700;
    
    // Table header background
    doc.rect(50, tableTop, 495, 25).fillAndStroke('#1e40af', '#1e3a8a');
    
    // Table headers
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('DATA', 60, tableTop + 8);
    doc.text('VALOR (MT)', 145, tableTop + 8);
    doc.text('ESTADO', 245, tableTop + 8);
    doc.text('MÉTODO', 335, tableTop + 8);
    doc.text('REFERÊNCIA', 435, tableTop + 8);
    
    let y = tableTop + 30;
    let rowIndex = 0;
    
    payments.forEach((payment) => {
      if (y > pageHeight) {
        doc.addPage();
        y = 50;
        rowIndex = 0;
      }
      
      // Alternate row colors
      const rowColor = rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
      doc.rect(50, y - 3, 495, itemHeight).fillAndStroke(rowColor, '#e2e8f0');
      
      doc.fontSize(9).font('Helvetica').fillColor('#000000');
      doc.text(new Date(payment.data_pagamento).toLocaleDateString('pt-PT'), 60, y);
      doc.text(payment.valor.toLocaleString('pt-PT'), 145, y);
      
      // Estado com badge colorido
      const estadoX = 245;
      if (payment.estado === 'pago') {
        doc.rect(estadoX, y - 2, 55, 14).fillAndStroke('#d1fae5', '#10b981');
        doc.fillColor('#065f46').text('PAGO', estadoX + 12, y);
      } else {
        doc.rect(estadoX, y - 2, 70, 14).fillAndStroke('#fee2e2', '#ef4444');
        doc.fillColor('#991b1b').text('PENDENTE', estadoX + 5, y);
      }
      doc.fillColor('#000000');
      
      doc.text(payment.metodo || '-', 335, y);
      doc.text(payment.referencia || '-', 435, y, { width: 100, ellipsis: true });
      
      y += itemHeight;
      rowIndex++;
    });
  }

  private static addAttendanceTable(doc: PDFKit.PDFDocument, attendance: AttendanceData[]): void {
    if (attendance.length === 0) {
      doc.rect(50, doc.y, 495, 40).fillAndStroke('#fef3c7', '#fbbf24');
      doc.fontSize(10).font('Helvetica').fillColor('#92400e')
        .text('⚠️  Nenhuma presença registrada.', 60, doc.y - 30, { width: 475, align: 'center' });
      doc.moveDown(3);
      return;
    }

    const tableTop = doc.y;
    const itemHeight = 22;
    const pageHeight = 700;
    
    // Table header background
    doc.rect(50, tableTop, 495, 25).fillAndStroke('#059669', '#047857');
    
    // Table headers
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('DATA', 60, tableTop + 8);
    doc.text('STATUS', 160, tableTop + 8);
    doc.text('OBSERVAÇÃO', 280, tableTop + 8);
    
    let y = tableTop + 30;
    let rowIndex = 0;
    
    attendance.forEach((record) => {
      if (y > pageHeight) {
        doc.addPage();
        y = 50;
        rowIndex = 0;
      }
      
      // Alternate row colors
      const rowColor = rowIndex % 2 === 0 ? '#f0fdf4' : '#ffffff';
      doc.rect(50, y - 3, 495, itemHeight).fillAndStroke(rowColor, '#bbf7d0');
      
      doc.fontSize(9).font('Helvetica').fillColor('#000000');
      doc.text(new Date(record.data).toLocaleDateString('pt-PT'), 60, y);
      
      // Status com badge colorido
      const statusX = 160;
      if (record.presente) {
        doc.rect(statusX, y - 2, 70, 14).fillAndStroke('#d1fae5', '#10b981');
        doc.fillColor('#065f46').text('✓ PRESENTE', statusX + 3, y);
      } else {
        doc.rect(statusX, y - 2, 55, 14).fillAndStroke('#fee2e2', '#ef4444');
        doc.fillColor('#991b1b').text('✗ FALTA', statusX + 5, y);
      }
      doc.fillColor('#000000');
      
      doc.text(record.observacao || '-', 280, y, { width: 250, ellipsis: true });
      
      y += itemHeight;
      rowIndex++;
    });
  }

  private static addFooter(doc: PDFKit.PDFDocument): void {
    const pageHeight = doc.page.height;
    
    // Footer line
    doc.moveTo(50, pageHeight - 60).lineTo(545, pageHeight - 60)
      .lineWidth(1).strokeColor('#e2e8f0').stroke();
    
    // Footer text
    doc.fontSize(7).font('Helvetica').fillColor('#94a3b8')
      .text(
        '© 2025 Sistema de Gestão Escolar',
        50,
        pageHeight - 45,
        { align: 'center', width: 495 }
      );
    doc.fontSize(7).fillColor('#cbd5e1')
      .text(
        'Documento gerado automaticamente - Confidencial',
        50,
        pageHeight - 35,
        { align: 'center', width: 495 }
      );
  }
}
