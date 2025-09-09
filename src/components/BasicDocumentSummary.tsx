import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Users, Building2, Package, CheckCircle, ArrowLeft } from "lucide-react";
import { UniversalPdfService, UniversalPdfData } from "@/services/universalPdfService";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  bank: string;
  accountNumber: string;
  amount: number;
  accountType: string;
}

interface BasicDocumentSummaryProps {
  personalNumber: string;
  assets: Asset[];
  totalAmount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const BasicDocumentSummary = ({
  personalNumber,
  assets,
  totalAmount,
  onBack,
  onComplete
}: BasicDocumentSummaryProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Convert basic assets to universal format
      const universalAssets = assets.map((asset, index) => ({
        id: index.toString(),
        bank: asset.bank,
        accountType: asset.accountType,
        assetType: 'Bankinsättning',
        accountNumber: asset.accountNumber,
        amount: asset.amount
      }));

      const pdfData: UniversalPdfData = {
        packageType: 'basic',
        personalNumber,
        assets: universalAssets,
        beneficiaries: [], // Basic package doesn't have detailed beneficiary info
        totalAmount,
        signatureMethod: 'manual'
      };

      const pdfBlob = await UniversalPdfService.generatePackagePDF(pdfData);
      
      if (pdfBlob) {
        UniversalPdfService.downloadPDF(pdfBlob, pdfData);
        
        toast({
          title: "PDF genererad!",
          description: "Grundläggande arvsskifteshandling med signeringsfält har laddats ner.",
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Fel vid PDF-generering",
        description: "Kunde inte generera PDF-dokumentet. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Grundläggande arvsskifteshandling</CardTitle>
          <CardDescription>
            Sammanställning av tillgångar med manuella signeringsfält
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avliden person</p>
                <p className="font-semibold">{personalNumber}</p>
                <p className="text-xs text-muted-foreground">Personnummer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Totalt värde</p>
                <p className="font-semibold">{totalAmount.toLocaleString('sv-SE')} kr</p>
                <p className="text-xs text-muted-foreground">{assets.length} tillgångar</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Registrerade tillgångar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assets.map((asset, index) => (
            <div key={index} className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{asset.bank}</span>
                <span className="text-sm font-medium text-green-600">
                  {asset.amount.toLocaleString('sv-SE')} kr
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {asset.accountType} • {asset.accountNumber}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Document Features */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Grundläggande arvsskifteshandling</h3>
              <p className="text-yellow-700 text-sm mb-3">
                PDF-dokumentet innehåller grundläggande information och manuella signeringsfält för traditionell hantering.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-yellow-600">
                <span>✓ Tillgångsinventering</span>
                <span>✓ Manuella signeringsfält</span>
                <span>✓ Grundläggande struktur</span>
                <span>✓ Traditionell hantering</span>
                <span>✓ Enkel och tydlig layout</span>
                <span>✓ Redo för utskrift</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Viktigt att komma ihåg</h4>
              <p className="text-sm text-orange-700">
                Detta är ett grundläggande paket som kräver manuell hantering av signaturer och eventuell ytterligare 
                dokumentation för Skatteverket. För mer omfattande funktioner, överväg vårt kompletta paket.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            size="lg"
            className="px-8 bg-yellow-600 hover:bg-yellow-700"
          >
            {isGeneratingPDF ? (
              "Genererar PDF..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Ladda ner grundläggande handling
              </>
            )}
          </Button>

          <Button
            onClick={onComplete}
            variant="default"
            size="lg"
            className="px-8"
          >
            Slutför
          </Button>
        </div>
      </div>
    </div>
  );
};