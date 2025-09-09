import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool, FileText, Download, Users, Building2, Package, CreditCard, Lock, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EstateOwner } from "./Step1EstateOwners";
import { useToast } from "@/hooks/use-toast";

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

interface PhysicalAsset {
  id: string;
  name: string;
  description: string;
  estimatedValue: number;
  category: string;
}

interface Beneficiary {
  id: string;
  name: string;
  personalNumber: string;
  relationship: string;
  percentage: number;
  accountNumber: string;
}

interface Step4Props {
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedPersonalNumber: string;
  estateOwners: EstateOwner[];
  assets: Asset[];
  physicalAssets: PhysicalAsset[];
  beneficiaries: Beneficiary[];
  onBack: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}

export const Step4FinalSignature = ({
  deceasedFirstName,
  deceasedLastName,
  deceasedPersonalNumber,
  estateOwners,
  assets,
  physicalAssets,
  beneficiaries,
  onBack,
  onComplete,
  t
}: Step4Props) => {
  const [digitalSignatures, setDigitalSignatures] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentAmount] = useState(200);
  const { toast } = useToast();

  const totalFinancialAssets = assets
    .filter(a => !['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån', 'Billån', 'Företagslån'].includes(a.assetType))
    .reduce((sum, a) => sum + (a.toRemain ? 0 : a.amount), 0);

  const totalPhysicalAssets = physicalAssets.reduce((sum, a) => sum + a.estimatedValue, 0);
  const totalDistributableAmount = totalFinancialAssets + totalPhysicalAssets;

  const handleSignatureChange = (ownerId: string, signature: string) => {
    setDigitalSignatures(prev => ({
      ...prev,
      [ownerId]: signature
    }));
  };

  const allOwnersSigned = estateOwners.every(owner => digitalSignatures[owner.id]?.trim());

  const handleCompleteEstate = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would process the payment and generate documents
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Arvsskifte genomfört!",
        description: "Alla dokument har genererats och signerats. Du kommer att få en bekräftelse via e-post.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Ett fel uppstod",
        description: "Försök igen om en stund.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <PenTool className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Slutlig signering</CardTitle>
          <CardDescription>
            Granska sammanfattningen och signera för att slutföra arvsskiftet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Estate Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    <p className="font-semibold">{totalDistributableAmount.toLocaleString('sv-SE')} kr</p>
                    <p className="text-xs text-muted-foreground">{assets.length + physicalAssets.length} tillgångar</p>
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

          {/* Digital Signatures */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Digital signering</h3>
            <p className="text-sm text-muted-foreground">
              Alla dödsbodelägare måste signera med sitt fullständiga namn för att slutföra arvsskiftet.
            </p>

            <div className="space-y-4">
              {estateOwners.map((owner) => (
                <Card key={owner.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{owner.firstName} {owner.lastName}</p>
                        <p className="text-sm text-muted-foreground">{owner.personalNumber}</p>
                        <Badge variant="outline">{owner.relationshipToDeceased}</Badge>
                      </div>
                      {digitalSignatures[owner.id] && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`signature-${owner.id}`}>
                        Digital signatur (skriv ditt fullständiga namn)
                      </Label>
                      <Input
                        id={`signature-${owner.id}`}
                        value={digitalSignatures[owner.id] || ''}
                        onChange={(e) => handleSignatureChange(owner.id, e.target.value)}
                        placeholder="Förnamn Efternamn"
                        className="font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-semibold">Betalning</p>
                  <p className="text-sm text-muted-foreground">
                    Kostnad för komplett arvsskifteshandling: {paymentAmount} SEK
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Betalning sker säkert via Stripe när alla har signerat
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Alla signaturer och dokument behandlas säkert och lagras krypterat enligt GDPR.
              Du får en bekräftelse och alla dokument via e-post efter slutförd betalning.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Tillbaka
        </Button>

        <Button
          onClick={handleCompleteEstate}
          disabled={!allOwnersSigned || isProcessing}
          size="lg"
          className="px-8"
        >
          {isProcessing ? (
            "Bearbetar..."
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Slutför arvsskifte & Betala {paymentAmount} kr
            </>
          )}
        </Button>
      </div>
    </div>
  );
};