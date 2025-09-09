import jsPDF from 'jspdf';

export interface UniversalPdfData {
  packageType: 'baspaket' | 'komplett' | 'basic';
  deceased?: {
    firstName: string;
    lastName: string;
    personalNumber: string;
  };
  personalNumber?: string; // For komplett package
  estateOwners?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    personalNumber: string;
    relationshipToDeceased: string;
    address?: string;
    phone?: string;
    email?: string;
    signed?: boolean;
    signedAt?: string;
    signatureType?: 'manual' | 'bankid';
  }>;
  heirs?: Array<{
    personalNumber: string;
    name: string;
    relationship: string;
    inheritanceShare?: number;
    signed?: boolean;
    signedAt?: string;
    email?: string;
    phone?: string;
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
    signed?: boolean;
    signedAt?: string;
  }>;
  physicalAssets?: Array<{
    id: string;
    name: string;
    description: string;
    estimatedValue: number;
    category: string;
  }>;
  testament?: {
    id: string;
    filename: string;
    uploadDate: string;
    verified: boolean;
  };
  totalAmount: number;
  signatureMethod: 'manual' | 'bankid' | 'mixed';
}

export class UniversalPdfService {
  /**
   * Generate PDF for any package type with appropriate signature fields
   */
  static async generatePackagePDF(data: UniversalPdfData): Promise<Blob | null> {
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

      // Package-specific header styling
      const headerColor = this.getPackageColor(data.packageType);
      doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(`ARVSSKIFTESHANDLING - ${data.packageType.toUpperCase()}`, pageWidth / 2, 20, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      yPosition = 45;

      // Document info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Genererat: ${new Date().toLocaleDateString('sv-SE')} ${new Date().toLocaleTimeString('sv-SE')}`, 20, yPosition);
      doc.text(`Dokumentnummer: ARV-${data.packageType.toUpperCase()}-${Date.now()}`, pageWidth - 100, yPosition);
      yPosition += 15;

      // Section 1: Avliden person / Personal Number
      if (data.deceased) {
        this.addSectionHeader(doc, 'AVLIDEN PERSON', yPosition, headerColor);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPosition, pageWidth - 40, 25);
        
        doc.text(`Namn: ${data.deceased.firstName} ${data.deceased.lastName}`, 25, yPosition + 8);
        doc.text(`Personnummer: ${data.deceased.personalNumber}`, 25, yPosition + 16);
        yPosition += 35;
      } else if (data.personalNumber) {
        this.addSectionHeader(doc, 'AVLIDEN PERSON', yPosition, headerColor);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPosition, pageWidth - 40, 20);
        
        doc.text(`Personnummer: ${data.personalNumber}`, 25, yPosition + 12);
        yPosition += 30;
      }

      // Section 2: Dödsbodelägare or Arvingar
      if (data.estateOwners && data.estateOwners.length > 0) {
        checkNewPage(80);
        this.addSectionHeader(doc, 'DÖDSBODELÄGARE', yPosition, headerColor);
        yPosition += 10;

        data.estateOwners.forEach((owner, index) => {
          checkNewPage(35);
          
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
      } else if (data.heirs && data.heirs.length > 0) {
        checkNewPage(80);
        this.addSectionHeader(doc, 'ARVINGAR', yPosition, headerColor);
        yPosition += 10;

        data.heirs.forEach((heir, index) => {
          checkNewPage(30);
          
          doc.setDrawColor(200, 200, 200);
          doc.rect(20, yPosition, pageWidth - 40, 25);
          
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${heir.name}`, 25, yPosition + 8);
          doc.setFont('helvetica', 'normal');
          doc.text(`Personnummer: ${heir.personalNumber}`, 25, yPosition + 16);
          
          if (heir.relationship) {
            doc.text(`Relation: ${heir.relationship}`, pageWidth / 2 + 10, yPosition + 8);
          }
          if (heir.inheritanceShare) {
            doc.text(`Arvsandel: ${heir.inheritanceShare}%`, pageWidth / 2 + 10, yPosition + 16);
          }
          
          yPosition += 35;
        });
      }

      // Section 3: Tillgångar
      checkNewPage(80);
      this.addSectionHeader(doc, 'INVENTERING AV TILLGÅNGAR', yPosition, headerColor);
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

      // Section 4: Fysiska tillgångar (if any)
      if (data.physicalAssets && data.physicalAssets.length > 0) {
        checkNewPage(60);
        this.addSectionHeader(doc, 'FYSISKA TILLGÅNGAR', yPosition, headerColor);
        yPosition += 10;

        data.physicalAssets.forEach((asset, index) => {
          checkNewPage(25);
          
          doc.setDrawColor(200, 200, 200);
          doc.rect(20, yPosition, pageWidth - 40, 20);
          
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${asset.name}`, 25, yPosition + 6);
          doc.setFont('helvetica', 'normal');
          doc.text(`Kategori: ${asset.category}`, 25, yPosition + 12);
          doc.text(`Värde: ${asset.estimatedValue.toLocaleString('sv-SE')} SEK`, 25, yPosition + 18);
          
          if (asset.description) {
            doc.text(`Beskrivning: ${asset.description}`, pageWidth / 2 + 10, yPosition + 6);
          }
          
          yPosition += 30;
        });
      }

      // Section 5: Fördelning
      if (data.beneficiaries && data.beneficiaries.length > 0) {
        checkNewPage(80);
        this.addSectionHeader(doc, 'FÖRDELNING AV DÖDSBO', yPosition, headerColor);
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
      }

      // Testament section (if any)
      if (data.testament) {
        checkNewPage(40);
        this.addSectionHeader(doc, 'TESTAMENTE', yPosition, headerColor);
        yPosition += 10;

        doc.setDrawColor(200, 200, 200);
        doc.rect(20, yPosition, pageWidth - 40, 25);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Fil: ${data.testament.filename}`, 25, yPosition + 8);
        doc.text(`Uppladdad: ${data.testament.uploadDate}`, 25, yPosition + 16);
        doc.text(`Status: ${data.testament.verified ? 'Verifierat' : 'Ej verifierat'}`, 25, yPosition + 24);
        
        yPosition += 35;
      }

      // New page for signatures
      doc.addPage();
      yPosition = 20;

      // Signature section - dynamic based on signature method and participants
      this.addSignatureSection(doc, data, yPosition, headerColor);

      return doc.output('blob');
    } catch (error) {
      console.error('Universal PDF generation failed:', error);
      return null;
    }
  }

  /**
   * Add signature section based on package type and signature method
   */
  private static addSignatureSection(doc: jsPDF, data: UniversalPdfData, yPosition: number, headerColor: {r: number, g: number, b: number}): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Helper function to check if we need a new page
    const checkNewPage = (neededSpace: number = 30) => {
      if (yPosition + neededSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    this.addSectionHeader(doc, 'SIGNATURER', yPosition, headerColor);
    yPosition += 15;

    if (data.signatureMethod === 'bankid') {
      // BankID signature summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const bankidText = `Denna handling har signerats digitalt med BankID av nedanstående personer. Alla signaturer är verifierade och juridiskt bindande enligt svensk lag om digital signering.`;
      const splitBankidText = doc.splitTextToSize(bankidText, pageWidth - 40);
      doc.text(splitBankidText, 20, yPosition);
      yPosition += splitBankidText.length * 6 + 15;

      // Show signed participants
      const signedParticipants = data.estateOwners?.filter(owner => owner.signed) || 
                                data.heirs?.filter(heir => heir.signed) || [];

      signedParticipants.forEach((participant, index) => {
        checkNewPage(45);
        
        doc.setDrawColor(100, 200, 100);
        doc.setLineWidth(0.5);
        doc.rect(20, yPosition, pageWidth - 40, 40);
        
        // Checkmark for signed
        doc.setFillColor(100, 200, 100);
        doc.circle(25, yPosition + 10, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('✓', 24, yPosition + 12);
        doc.setTextColor(0, 0, 0);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`SIGNERAT MED BANKID - ${index + 1}`, 35, yPosition + 12);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const name = (participant as any).firstName ? 
                    `${(participant as any).firstName} ${(participant as any).lastName}` : 
                    (participant as any).name;
        doc.text(`Namn: ${name}`, 25, yPosition + 20);
        doc.text(`Personnummer: ${participant.personalNumber}`, 25, yPosition + 28);
        
        if (participant.signedAt) {
          doc.text(`Signerad: ${new Date(participant.signedAt).toLocaleString('sv-SE')}`, 25, yPosition + 36);
        }
        
        yPosition += 50;
      });

    } else {
      // Manual signature fields
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const signatureText = `Genom undertecknande av detta dokument bekräftar parterna att de har granskat och godkänt ovanstående fördelning av dödsboet. Signaturen sker enligt gällande svensk lag.`;
      const splitSignatureText = doc.splitTextToSize(signatureText, pageWidth - 40);
      doc.text(splitSignatureText, 20, yPosition);
      yPosition += splitSignatureText.length * 6 + 15;

      // Manual signature boxes for participants
      const participants = data.estateOwners || data.heirs || [];
      
      participants.forEach((participant, index) => {
        checkNewPage(60);
        
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.rect(20, yPosition, pageWidth - 40, 50);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        const title = data.estateOwners ? 'DÖDSBODELÄGARE' : 'ARVINGE';
        doc.text(`${title} ${index + 1}`, 25, yPosition + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const name = (participant as any).firstName ? 
                    `${(participant as any).firstName} ${(participant as any).lastName}` : 
                    (participant as any).name;
        doc.text(`Namn: ${name}`, 25, yPosition + 18);
        doc.text(`Personnummer: ${participant.personalNumber}`, 25, yPosition + 26);
        
        if (data.estateOwners) {
          doc.text(`Relation: ${(participant as any).relationshipToDeceased}`, 25, yPosition + 34);
        } else if ((participant as any).relationship) {
          doc.text(`Relation: ${(participant as any).relationship}`, 25, yPosition + 34);
        }
        
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
    }

    // Legal disclaimer
    checkNewPage(40);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition, pageWidth - 40, 35, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('VIKTIGT', 25, yPosition + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const legalText = `Detta dokument är juridiskt bindande när det har signerats av alla berörda parter. Dokumentet ska skickas till Skatteverket tillsammans med övriga arvsskifteshandlingar. Vid frågor, kontakta er juridiska rådgivare.`;
    const splitLegalText = doc.splitTextToSize(legalText, pageWidth - 50);
    doc.text(splitLegalText, 25, yPosition + 16);
    
    yPosition += 45;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Digital Arvsskifte - ${data.packageType.toUpperCase()} - Genererat automatiskt`, 20, pageHeight - 10);
    const currentPage = (doc as any).internal.getCurrentPageInfo?.().pageNumber || 1;
    doc.text(`Sida ${currentPage}`, pageWidth - 30, pageHeight - 10);
  }

  /**
   * Add section header with package-specific styling
   */
  private static addSectionHeader(doc: jsPDF, title: string, yPosition: number, color: {r: number, g: number, b: number}): void {
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(20, yPosition - 5, doc.internal.pageSize.getWidth() - 40, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 25, yPosition + 5);
    doc.setTextColor(0, 0, 0);
  }

  /**
   * Get package-specific color scheme
   */
  private static getPackageColor(packageType: string): {r: number, g: number, b: number} {
    switch (packageType) {
      case 'baspaket':
        return { r: 52, g: 152, b: 219 }; // Blue
      case 'komplett':
        return { r: 46, g: 204, b: 113 }; // Green
      case 'basic':
        return { r: 241, g: 196, b: 15 }; // Yellow
      default:
        return { r: 52, g: 152, b: 219 }; // Default blue
    }
  }

  /**
   * Download the generated PDF with package-specific filename
   */
  static downloadPDF(blob: Blob, data: UniversalPdfData): void {
    const date = new Date().toISOString().split('T')[0];
    const identifier = data.deceased ? 
      `${data.deceased.firstName}_${data.deceased.lastName}-${data.deceased.personalNumber.replace('-', '')}` :
      `${data.personalNumber?.replace('-', '') || 'unknown'}`;
    
    const filename = `arvsskifte-${data.packageType}-${identifier}-${date}.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}