import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Users, Building2, Package, CheckCircle, ArrowLeft } from "lucide-react";
import { UniversalPdfService, UniversalPdfData } from "@/services/universalPdfService";
import { useToast } from "@/hooks/use-toast";

interface Heir {
  personalNumber: string;
  name: string;
  relationship: string;
  inheritanceShare?: number;
  signed?: boolean;
  signedAt?: string;
  email?: string;
  phone?: string;
}

interface Asset {
  id: string;
  bank: string;
  accountType: string;
  assetType: string;
  accountNumber: string;
  amount: number;
  toRemain?: boolean;
  reasonToRemain?: string;
}

interface Beneficiary {
  id: string;
  name: string;
  personalNumber: string;
  relationship: string;
  percentage: number;
  accountNumber: string;
  signed?: boolean;
  signedAt?: string;
}

interface PhysicalAsset {
  id: string;
  name: string;
  description: string;
  estimatedValue: number;
  category: string;
}

interface Testament {
  id: string;
  filename: string;
  uploadDate: string;
  verified: boolean;
}

interface KomplettDocumentSummaryProps {
  personalNumber: string;
  heirs: Heir[];
  assets: Asset[];
  beneficiaries: Beneficiary[];
  physicalAssets: PhysicalAsset[];
  safeDepositBoxItems?: PhysicalAsset[];
  testament: Testament | null;
  totalAmount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const KomplettDocumentSummary = ({
  personalNumber,
  heirs,
  assets,
  beneficiaries,
  physicalAssets,
  safeDepositBoxItems = [],
  testament,
  totalAmount,
  onBack,
  onComplete
}: KomplettDocumentSummaryProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdfData: UniversalPdfData = {
        packageType: 'komplett',
        personalNumber,
        heirs,
        assets,
        beneficiaries,
        physicalAssets,
        testament,
        totalAmount,
        signatureMethod: 'bankid'
      };

      const pdfBlob = await UniversalPdfService.generatePackagePDF(pdfData);
      
      if (pdfBlob) {
        UniversalPdfService.downloadPDF(pdfBlob, pdfData);
        
        toast({
          title: "PDF genererad!",
          description: "Komplett arvsskifteshandling med BankID-verifierade signaturer har laddats ner.",
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

  const signedHeirs = heirs.filter(heir => heir.signed);
  const totalHeirs = heirs.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Komplett arvsskifteshandling</CardTitle>
          <CardDescription>
            Sammanställning med BankID-verifierade signaturer och komplett dokumentation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">BankID-signaturer</p>
                <p className="font-semibold">{signedHeirs.length} av {totalHeirs}</p>
                <p className="text-xs text-muted-foreground">
                  {signedHeirs.length === totalHeirs ? 'Alla signerat' : 'Pågående'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heirs with signing status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Arvingar och signeringsstatus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {heirs.map((heir, index) => (
              <div key={heir.personalNumber} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{heir.name}</span>
                    {heir.signed && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Signerad
                      </Badge>
                    )}
                    {!heir.signed && (
                      <Badge variant="secondary">Väntar på signering</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {heir.personalNumber} • {heir.relationship}
                </p>
                {heir.signedAt && (
                  <p className="text-xs text-green-600">
                    Signerad: {new Date(heir.signedAt).toLocaleString('sv-SE')}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Tillgångar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.slice(0, 5).map((asset, index) => (
              <div key={asset.id} className="p-3 border border-border rounded-lg">
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
            {assets.length > 5 && (
              <p className="text-sm text-muted-foreground text-center">
                ... och {assets.length - 5} till
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Fördelning av arv
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {beneficiaries.map((beneficiary, index) => {
              const inheritanceAmount = (beneficiary.percentage / 100) * totalAmount;
              return (
                <div key={beneficiary.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{beneficiary.name}</span>
                      <Badge variant="secondary">{beneficiary.relationship}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {beneficiary.personalNumber} • {beneficiary.accountNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {beneficiary.percentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {inheritanceAmount.toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Physical Assets */}
      {physicalAssets && physicalAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Fysiska tillgångar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {physicalAssets.map((asset, index) => (
              <div key={asset.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-sm font-medium text-green-600">
                    {asset.estimatedValue.toLocaleString('sv-SE')} kr
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {asset.category} • {asset.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Testament */}
      {testament && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Testamente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{testament.filename}</span>
                <Badge variant={testament.verified ? "default" : "secondary"}>
                  {testament.verified ? "Verifierat" : "Ej verifierat"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Uppladdad: {testament.uploadDate}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Features */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Komplett professionell arvsskifteshandling</h3>
              <p className="text-green-700 text-sm mb-3">
                PDF-dokumentet innehåller all information med BankID-verifierade signaturer och är redo för inlämning till Skatteverket.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-600">
                <span>✓ BankID-verifierade signaturer</span>
                <span>✓ Komplett tillgångsinventering</span>
                <span>✓ Juridisk struktur för Skatteverket</span>
                <span>✓ Digital äkthetsstämpel</span>
                <span>✓ Automatisk fördelningsberäkning</span>
                <span>✓ Tidsstämplade dokument</span>
              </div>
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
            className="px-8"
          >
            {isGeneratingPDF ? (
              "Genererar PDF..."
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Ladda ner komplett arvsskifteshandling
              </>
            )}
          </Button>

          <Button
            onClick={onComplete}
            variant="default"
            size="lg"
            className="px-8"
          >
            Slutför process
          </Button>
        </div>
      </div>
    </div>
  );
};