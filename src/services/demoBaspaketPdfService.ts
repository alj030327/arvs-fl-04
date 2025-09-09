import jsPDF from 'jspdf';

export interface DemoBaspaketData {
  deceased: {
    firstName: string;
    lastName: string;
    personalNumber: string;
  };
  estateOwners: Array<{
    id: string;
    firstName: string;
    lastName: string;
    personalNumber: string;
    relationshipToDeceased: string;
    address?: string;
    phone?: string;
    email?: string;
  }>;
  assets: Array<{
    id: string;
    bank: string;
    accountType: string;
    assetType: string;
    accountNumber: string;
    amount: number;
    toRemain?: boolean;
    reasonToRemain?: string;
  }>;
  beneficiaries: Array<{
    id: string;
    name: string;
    personalNumber: string;
    relationship: string;
    percentage: number;
    accountNumber: string;
  }>;
  totalAmount: number;
}

export class DemoBaspaketPdfService {
  /**
   * Generate a comprehensive PDF document for demo baspaket with signature fields
   */
  static async generateDemoBaspaketPDF(data: DemoBaspaketData): Promise<Blob | null> {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const lineHeight = 7;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Helper function to check if we need a new page
      const checkNewPage = (neededSpace: number = 30) => {
        if (yPosition + neededSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Header with logo space and title
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('ARVSSKIFTESHANDLING', pageWidth / 2, 20, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      yPosition = 45;

      // Document info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Genererat: ${new Date().toLocaleDateString('sv-SE')} ${new Date().toLocaleTimeString('sv-SE')}`, 20, yPosition);
      doc.text(`Dokumentnummer: ARV-${Date.now()}`, pageWidth - 80, yPosition);
      yPosition += 15;

      // Section 1: Avliden person
      this.addSectionHeader(doc, 'AVLIDEN PERSON', yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Deceased person box
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, yPosition, pageWidth - 40, 25);
      
      doc.text(`Namn: ${data.deceased.firstName} ${data.deceased.lastName}`, 25, yPosition + 8);
      doc.text(`Personnummer: ${data.deceased.personalNumber}`, 25, yPosition + 16);
      yPosition += 35;

      // Section 2: Dödsbodelägare
      checkNewPage(80);
      this.addSectionHeader(doc, 'DÖDSBODELÄGARE', yPosition);
      yPosition += 10;

      data.estateOwners.forEach((owner, index) => {
        checkNewPage(35);
        
        // Owner box
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPosition, pageWidth - 40, 30);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${owner.firstName} ${owner.lastName}`, 25, yPosition + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Personnummer: ${owner.personalNumber}`, 25, yPosition + 16);
        doc.text(`Relation: ${owner.relationshipToDeceased}`, 25, yPosition + 24);
        
        if (owner.address) {
          doc.text(`Adress: ${owner.address}`, pageWidth / 2 + 10, yPosition + 8);
        }
        if (owner.phone) {
          doc.text(`Telefon: ${owner.phone}`, pageWidth / 2 + 10, yPosition + 16);
        }
        if (owner.email) {
          doc.text(`E-post: ${owner.email}`, pageWidth / 2 + 10, yPosition + 24);
        }
        
        yPosition += 40;
      });

      // Section 3: Tillgångar
      checkNewPage(80);
      this.addSectionHeader(doc, 'INVENTERING AV TILLGÅNGAR', yPosition);
      yPosition += 10;

      // Assets table header
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Bank/Institut', 25, yPosition + 8);
      doc.text('Kontotyp', 80, yPosition + 8);
      doc.text('Kontonummer', 120, yPosition + 8);
      doc.text('Belopp (SEK)', 160, yPosition + 8);
      yPosition += 12;

      let totalAssets = 0;
      data.assets.forEach((asset, index) => {
        checkNewPage(10);
        
        // Alternate row colors
        if (index % 2 === 1) {
          doc.setFillColor(250, 250, 250);
          doc.rect(20, yPosition, pageWidth - 40, 10, 'F');
        }
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(asset.bank, 25, yPosition + 6);
        doc.text(asset.accountType, 80, yPosition + 6);
        doc.text(asset.accountNumber, 120, yPosition + 6);
        doc.text(asset.amount.toLocaleString('sv-SE'), 160, yPosition + 6);
        
        totalAssets += asset.amount;
        yPosition += 10;
      });

      // Total assets
      doc.setFillColor(220, 220, 220);
      doc.rect(20, yPosition, pageWidth - 40, 12, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TOTALT VÄRDE:', 25, yPosition + 8);
      doc.text(`${totalAssets.toLocaleString('sv-SE')} SEK`, 160, yPosition + 8);
      yPosition += 20;

      // Section 4: Fördelning
      checkNewPage(80);
      this.addSectionHeader(doc, 'FÖRDELNING AV DÖDSBO', yPosition);
      yPosition += 10;

      data.beneficiaries.forEach((beneficiary, index) => {
        checkNewPage(25);
        
        const inheritanceAmount = (beneficiary.percentage / 100) * data.totalAmount;
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPosition, pageWidth - 40, 20);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${beneficiary.name}`, 25, yPosition + 6);
        doc.setFont('helvetica', 'normal');
        doc.text(`Personnummer: ${beneficiary.personalNumber}`, 25, yPosition + 12);
        doc.text(`Relation: ${beneficiary.relationship}`, 25, yPosition + 18);
        
        doc.text(`Andel: ${beneficiary.percentage}%`, pageWidth / 2 + 10, yPosition + 6);
        doc.text(`Belopp: ${inheritanceAmount.toLocaleString('sv-SE')} SEK`, pageWidth / 2 + 10, yPosition + 12);
        doc.text(`Bankgiro: ${beneficiary.accountNumber}`, pageWidth / 2 + 10, yPosition + 18);
        
        yPosition += 30;
      });

      // New page for signatures
      doc.addPage();
      yPosition = 20;

      // Signature section
      this.addSectionHeader(doc, 'SIGNATURER', yPosition);
      yPosition += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const signatureText = `Genom undertecknande av detta dokument bekräftar dödsbodelägarna att de har granskat och godkänt ovanstående fördelning av dödsboet. Signaturen sker i enlighet med lag om digital signering och BankID-verifiering.`;
      const splitSignatureText = doc.splitTextToSize(signatureText, pageWidth - 40);
      doc.text(splitSignatureText, 20, yPosition);
      yPosition += splitSignatureText.length * 6 + 15;

      // Signature boxes for each estate owner
      data.estateOwners.forEach((owner, index) => {
        checkNewPage(60);
        
        // Signature box
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.rect(20, yPosition, pageWidth - 40, 50);
        
        // Owner info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`DÖDSBODELÄGARE ${index + 1}`, 25, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Namn: ${owner.firstName} ${owner.lastName}`, 25, yPosition + 18);
        doc.text(`Personnummer: ${owner.personalNumber}`, 25, yPosition + 26);
        doc.text(`Relation: ${owner.relationshipToDeceased}`, 25, yPosition + 34);
        
        // Signature line
        doc.setDrawColor(150, 150, 150);
        doc.line(pageWidth / 2 + 10, yPosition + 35, pageWidth - 30, yPosition + 35);
        doc.setFontSize(8);
        doc.text('Signatur', pageWidth / 2 + 10, yPosition + 40);
        
        // Date line
        doc.line(pageWidth / 2 + 10, yPosition + 18, pageWidth - 30, yPosition + 18);
        doc.text('Datum', pageWidth / 2 + 10, yPosition + 23);
        
        yPosition += 60;
      });

      // Legal disclaimer
      checkNewPage(40);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, pageWidth - 40, 35, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('VIKTIGT', 25, yPosition + 8);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const legalText = `Detta dokument är juridiskt bindande när det har signerats av alla dödsbodelägare. Dokumentet ska skickas till Skatteverket tillsammans med övriga arvsskifteshandlingar. Vid frågor, kontakta er juridiska rådgivare.`;
      const splitLegalText = doc.splitTextToSize(legalText, pageWidth - 50);
      doc.text(splitLegalText, 25, yPosition + 16);
      
      yPosition += 45;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Digital Arvsskifte - Genererat automatiskt', 20, pageHeight - 10);
      const currentPage = (doc as any).internal.getCurrentPageInfo?.().pageNumber || 1;
      doc.text(`Sida ${currentPage}`, pageWidth - 30, pageHeight - 10);

      return doc.output('blob');
    } catch (error) {
      console.error('Demo baspaket PDF generation failed:', error);
      return null;
    }
  }

  /**
   * Add section header with styling
   */
  private static addSectionHeader(doc: jsPDF, title: string, yPosition: number): void {
    doc.setFillColor(52, 152, 219);
    doc.rect(20, yPosition - 5, doc.internal.pageSize.getWidth() - 40, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 25, yPosition + 5);
    doc.setTextColor(0, 0, 0);
  }

  /**
   * Download the generated PDF
   */
  static downloadPDF(blob: Blob, deceased: { firstName: string; lastName: string; personalNumber: string }): void {
    const filename = `arvsskifte-${deceased.firstName}_${deceased.lastName}-${deceased.personalNumber.replace('-', '')}-${new Date().toISOString().split('T')[0]}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}