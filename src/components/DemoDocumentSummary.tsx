import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Users, Building2, Package, CheckCircle, ArrowLeft } from "lucide-react";
import { DemoBaspaketPdfService, DemoBaspaketData } from "@/services/demoBaspaketPdfService";
import { useToast } from "@/hooks/use-toast";

interface EstateOwner {
  id: string;
  firstName: string;
  lastName: string;
  personalNumber: string;
  relationshipToDeceased: string;
  address?: string;
  phone?: string;
  email?: string;
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
}

interface DemoDocumentSummaryProps {
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedPersonalNumber: string;
  estateOwners: EstateOwner[];
  assets: Asset[];
  beneficiaries: Beneficiary[];
  totalAmount: number;
  onBack: () => void;
  onComplete: () => void;
}

export const DemoDocumentSummary = ({
  deceasedFirstName,
  deceasedLastName,
  deceasedPersonalNumber,
  estateOwners,
  assets,
  beneficiaries,
  totalAmount,
  onBack,
  onComplete
}: DemoDocumentSummaryProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const demoData: DemoBaspaketData = {
        deceased: {
          firstName: deceasedFirstName,
          lastName: deceasedLastName,
          personalNumber: deceasedPersonalNumber
        },
        estateOwners,
        assets,
        beneficiaries,
        totalAmount
      };

      const pdfBlob = await DemoBaspaketPdfService.generateDemoBaspaketPDF(demoData);
      
      if (pdfBlob) {
        DemoBaspaketPdfService.downloadPDF(pdfBlob, demoData.deceased);
        
        toast({
          title: "PDF genererad!",
          description: "Arvsskifteshandlingen har laddats ner med signeringsfält för alla dödsbodelägare.",
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
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Sammanställning av arvsskifteshandling</CardTitle>
          <CardDescription>
            Granska informationen och ladda ner den kompletta handlingen med signeringsfält
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Document Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Den avlidne</p>
                <p className="font-semibold">{deceasedFirstName} {deceasedLastName}</p>
                <p className="text-xs text-muted-foreground">{deceasedPersonalNumber}</p>
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
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Dödsbodelägare</p>
                <p className="font-semibold">{estateOwners.length} personer</p>
                <p className="text-xs text-muted-foreground">Behöver signera</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estate Owners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Dödsbodelägare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {estateOwners.map((owner, index) => (
              <div key={owner.id} className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{owner.firstName} {owner.lastName}</span>
                  <Badge variant="outline">{owner.relationshipToDeceased}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {owner.personalNumber}
                </p>
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
            {assets.map((asset, index) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Beneficiaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Fördelning
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

      {/* Document Features */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Komplett arvsskifteshandling</h3>
              <p className="text-blue-700 text-sm mb-3">
                PDF-dokumentet innehåller all nödvändig information och är redo för signering av alla dödsbodelägare.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-600">
                <span>✓ Fullständig inventering</span>
                <span>✓ Signeringsfält för alla dödsbodelägare</span>
                <span>✓ Juridisk struktur</span>
                <span>✓ Fördelningsöversikt</span>
                <span>✓ Kontaktinformation</span>
                <span>✓ Datum och dokumentnummer</span>
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
                Ladda ner arvsskifteshandling
              </>
            )}
          </Button>

          <Button
            onClick={onComplete}
            variant="default"
            size="lg"
            className="px-8"
          >
            Slutför demo
          </Button>
        </div>
      </div>
    </div>
  );
};