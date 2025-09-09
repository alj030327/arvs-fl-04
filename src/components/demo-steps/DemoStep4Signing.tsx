import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, Building2, CheckCircle, Clock, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Asset {
  id: string;
  bank: string;
  accountType: string;
  assetType: string;
  accountNumber: string;
  amount: number;
}

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

interface PhysicalAsset {
  id: string;
  name: string;
  description: string;
  estimatedValue: number;
  category: string;
  distributionMethod: string;
}

interface DemoStep4Props {
  personalNumber: string;
  heirs: Heir[];
  assets: Asset[];
  physicalAssets: PhysicalAsset[];
  onBack: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}

export function Step4Signing({ 
  personalNumber, 
  heirs, 
  assets, 
  physicalAssets, 
  onBack, 
  onComplete, 
  t 
}: DemoStep4Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  const totalFinancialAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalPhysicalAssets = physicalAssets.reduce((sum, asset) => sum + asset.estimatedValue, 0);
  const totalAssets = totalFinancialAssets + totalPhysicalAssets;

  const handleSendPDFSummary = async () => {
    setIsSubmitting(true);
    
    // Simulate PDF generation and sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPdfSent(true);
    setIsSubmitting(false);
  };

  const handleSubmitInheritance = async () => {
    setIsSubmitting(true);
    
    // Simulate final submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sammanfattning och signering
          </CardTitle>
          <CardDescription>
            Granska informationen och slutför arvskiftet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo:</strong> Detta är en demonstration av det slutliga steget i arvskiftet.
            </p>
          </div>

          {/* Deceased Person Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Avliden person</h3>
            <div className="border rounded-lg p-4">
              <p><strong>Personnummer:</strong> {personalNumber}</p>
            </div>
          </div>

          {/* Assets Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tillgångar
            </h3>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Finansiella tillgångar</p>
                  <p className="text-lg font-semibold">{totalFinancialAssets.toLocaleString('sv-SE')} kr</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fysiska tillgångar</p>
                  <p className="text-lg font-semibold">{totalPhysicalAssets.toLocaleString('sv-SE')} kr</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Totalt värde</p>
                  <p className="text-xl font-bold text-primary">{totalAssets.toLocaleString('sv-SE')} kr</p>
                </div>
              </div>
            </div>
          </div>

          {/* Heirs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Arvingar
            </h3>
            <div className="border rounded-lg p-4 space-y-3">
              {heirs.map((heir) => (
                <div key={heir.personalNumber} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{heir.name}</p>
                    <p className="text-sm text-muted-foreground">{heir.personalNumber} • {heir.relationship}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{heir.inheritanceShare || 0}%</p>
                    <p className="text-sm text-muted-foreground">
                      {(((heir.inheritanceShare || 0) / 100) * totalAssets).toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signing Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">E-signaturer</h3>
            <div className="border rounded-lg p-4 space-y-3">
              {heirs.map((heir) => (
                <div key={heir.personalNumber} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{heir.name}</p>
                    <p className="text-sm text-muted-foreground">BankID-signering</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Väntar på signering
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <Separator />
          
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleSendPDFSummary}
                disabled={isSubmitting || pdfSent}
                className="flex items-center gap-2"
                variant={pdfSent ? "outline" : "default"}
              >
                {pdfSent ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    PDF-sammanfattning skickad
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    {isSubmitting ? "Skickar PDF..." : "Skicka PDF-sammanfattning till arvingar"}
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubmitInheritance}
                disabled={!pdfSent || isSubmitting}
                className="flex items-center gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  "Slutför arvskifte..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Slutför arvskifte
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-start">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}