import { useState } from "react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Step1EstateOwners, EstateOwner } from "@/components/steps/Step1EstateOwners";
import { Step2Assets } from "@/components/steps/Step2Assets";
import { Step3Distribution } from "@/components/steps/Step3Distribution";
import { Step4FinalSignature } from "@/components/steps/Step4FinalSignature";
import { Scale, Globe, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DemoDocumentSummary } from "@/components/DemoDocumentSummary";
import { PhysicalAsset } from "@/components/PhysicalAssets";
import { SafeDepositBoxItem } from "@/components/SafeDepositBox";

import { supabase } from "@/integrations/supabase/client";
import { useState as usePaymentState } from "react";

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
  assetPreferences?: {
    warrants: 'transfer' | 'sell';
    certificates: 'transfer' | 'sell';
    options: 'transfer' | 'sell';
    futures: 'transfer' | 'sell';
  };
  assetNotApplicable?: {
    warrants?: boolean;
    certificates?: boolean;
    options?: boolean;
    futures?: boolean;
  };
}

interface Testament {
  id: string;
  filename: string;
  uploadDate: string;
  verified: boolean;
}

export default function DemoBaspaket() {
  const [isProcessingPayment, setIsProcessingPayment] = usePaymentState(false);
  const { t, language, changeLanguage } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [deceasedFirstName, setDeceasedFirstName] = useState("Karl");
  const [deceasedLastName, setDeceasedLastName] = useState("Andersson");
  const [deceasedPersonalNumber, setDeceasedPersonalNumber] = useState("19450312-1234");
  const [estateOwners, setEstateOwners] = useState<EstateOwner[]>([
    {
      id: "1",
      firstName: "Anna",
      lastName: "Andersson",
      personalNumber: "19701205-5678",
      relationshipToDeceased: "Barn",
      address: "Storgatan 1, 123 45 Stockholm",
      phone: "070-123 45 67",
      email: "anna.andersson@email.com"
    },
    {
      id: "2",
      firstName: "Erik",
      lastName: "Andersson",
      personalNumber: "19751120-9012",
      relationshipToDeceased: "Barn",
      address: "Lillgatan 2, 123 45 Stockholm",
      phone: "070-987 65 43",
      email: "erik.andersson@email.com"
    }
  ]);
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      bank: "Handelsbanken",
      accountType: "Lönekonto",
      assetType: "Bankinsättning",
      accountNumber: "1234 567 890",
      amount: 150000
    },
    {
      id: "2",
      bank: "SEB",
      accountType: "ISK",
      assetType: "Aktier",
      accountNumber: "9876 543 210",
      amount: 320000
    }
  ]);
  const [physicalAssets, setPhysicalAssets] = useState<PhysicalAsset[]>([]);
  const [safeDepositBoxItems, setSafeDepositBoxItems] = useState<SafeDepositBoxItem[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Anna Andersson",
      personalNumber: "19701205-5678",
      relationship: "Barn",
      percentage: 50,
      accountNumber: "1111 222 333"
    },
    {
      id: "2",
      name: "Erik Andersson",
      personalNumber: "19751120-9012",
      relationship: "Barn",
      percentage: 50,
      accountNumber: "4444 555 666"
    }
  ]);
  const [testament, setTestament] = useState<Testament | null>(null);
  const [hasTestament, setHasTestament] = useState(false);
  const [savedProgress, setSavedProgress] = useState(false);

  const stepLabels = ["Dödsbodelägare", "Tillgångar", "Fördelning", "Dokumentsammanställning", "Köp baspaket"];

  const totalFinancialAssets = assets
    .filter(a => !['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån', 'Billån', 'Företagslån'].includes(a.assetType))
    .reduce((sum, a) => sum + (a.toRemain ? 0 : a.amount), 0);

  const totalPhysicalAssets = physicalAssets.reduce((sum, a) => sum + a.estimatedValue, 0);
  const totalDistributableAmount = totalFinancialAssets + totalPhysicalAssets;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    setSavedProgress(true);
    console.log("Framsteg sparat!");
  };

  const handleComplete = () => {
    console.log("Går till signering...");
    setCurrentStep(4);
  };

  const handleFinalComplete = () => {
    setCurrentStep(5); // Go to purchase step
  };

  const handlePurchaseBaspaket = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Collect all demo data to store with the order
      const estateData = {
        deceased: {
          firstName: deceasedFirstName,
          lastName: deceasedLastName,
          personalNumber: deceasedPersonalNumber
        },
        estateOwners,
        assets,
        physicalAssets,
        beneficiaries,
        hasTestament,
        testament
      };

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          packageType: 'baspaket',
          estateData,
          userEmail: null // Guest checkout
        }
      });

      if (error) {
        console.error('Payment error:', error);
        alert('Ett fel uppstod vid betalningen. Försök igen.');
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Ett fel uppstod vid betalningen. Försök igen.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/demo-instructions" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Tillbaka till demo-instruktioner</span>
            </Link>
            <Badge variant="outline" className="text-sm bg-orange-50 text-orange-700 border-orange-300">
              Demo Baspaket
            </Badge>
          </div>
        </div>
      </header>

      {/* Demo Notice */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">Demo Baspaket - Förifylld exempelprocess</h3>
                  <p className="text-orange-700 text-sm mb-3">
                    Detta är en demonstrationversion av vårt baspaket. All information är förifylld som exempel 
                    för att visa hur processen fungerar från steg 1-4. I den riktiga tjänsten fyller du i din egen information.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <span className="font-medium">Exemplet visar:</span>
                    <span>Avliden person med 2 dödsbodelägare, tillgångar och fördelning</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t('app.title')}</h1>
                <p className="text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changeLanguage(language === 'sv' ? 'en' : 'sv')}
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'sv' ? 'English' : 'Svenska'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={5}
          stepLabels={stepLabels}
        />

        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Dödsbodelägare (Demo)</CardTitle>
                <CardDescription>
                  Detta är förifylld demodata som visar hur steget fungerar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo notice */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-700">
                    <strong>Demo:</strong> All information nedan är exempel och kan inte ändras. 
                    Köp baspaket för att fylla i dina egna uppgifter.
                  </p>
                </div>

                {/* Deceased person (read-only) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Den avlidne</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Förnamn</Label>
                      <div className="p-2 bg-muted rounded border">
                        {deceasedFirstName}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Efternamn</Label>
                      <div className="p-2 bg-muted rounded border">
                        {deceasedLastName}
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Personnummer</Label>
                      <div className="p-2 bg-muted rounded border">
                        {deceasedPersonalNumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estate owners (read-only) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Registrerade dödsbodelägare</h3>
                  <div className="space-y-3">
                    {estateOwners.map((owner) => (
                      <div key={owner.id} className="p-4 border border-border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{owner.firstName} {owner.lastName}</span>
                          <Badge variant="secondary">{owner.relationshipToDeceased}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Personnummer: {owner.personalNumber}
                        </p>
                        {owner.address && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Adress: {owner.address}
                          </p>
                        )}
                        {owner.phone && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Telefon: {owner.phone}
                          </p>
                        )}
                        {owner.email && (
                          <p className="text-sm text-muted-foreground">
                            E-post: {owner.email}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} size="lg">
                    Fortsätt till tillgångar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <Step2Assets
            assets={assets}
            setAssets={setAssets}
            physicalAssets={physicalAssets}
            setPhysicalAssets={setPhysicalAssets}
            safeDepositBoxItems={safeDepositBoxItems}
            setSafeDepositBoxItems={setSafeDepositBoxItems}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
          />
        )}

        {currentStep === 3 && (
          <Step3Distribution
            beneficiaries={beneficiaries}
            setBeneficiaries={setBeneficiaries}
            totalAmount={totalDistributableAmount}
            assets={assets}
            personalNumber={deceasedPersonalNumber}
            testament={testament}
            setTestament={setTestament}
            hasTestament={hasTestament}
            setHasTestament={setHasTestament}
            physicalAssets={[]}
            setPhysicalAssets={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSave}
            onComplete={handleComplete}
            savedProgress={savedProgress}
            t={t}
          />
        )}

        {currentStep === 4 && (
          <DemoDocumentSummary
            deceasedFirstName={deceasedFirstName}
            deceasedLastName={deceasedLastName}
            deceasedPersonalNumber={deceasedPersonalNumber}
            estateOwners={estateOwners}
            assets={assets}
            beneficiaries={beneficiaries}
            totalAmount={totalDistributableAmount}
            onBack={handleBack}
            onComplete={handleFinalComplete}
          />
        )}

        {currentStep === 5 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Demo genomförd!</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Du har nu sett hela processen för vårt baspaket och laddat ner en exempeldokument. 
                  För att kunna fylla i dina egna uppgifter och generera riktiga arvsskiftesdokument, 
                  köp baspaket för endast 200 kr.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Vad ingår i Baspaket?</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Komplett 5-stegs process för arvsskifte</li>
                    <li>✓ Automatisk generering av alla dokument med signeringsfält</li>
                    <li>✓ Stöd för upp till 10 dödsbodelägare</li>
                    <li>✓ Professionella PDF-dokument</li>
                    <li>✓ Digital signering av dokument</li>
                    <li>✓ E-postupport vid frågor</li>
                  </ul>
                </div>

                <Button
                  size="lg"
                  className="px-8 py-3 text-lg"
                  onClick={handlePurchaseBaspaket}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    "Bearbetar..."
                  ) : (
                    <>
                      Köp Baspaket - 200 kr
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Säker betalning via Stripe • Pengarna tillbaka-garanti
                </p>

                <div className="mt-6">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tillbaka till dokumentsammanställning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>{t('footer.copyright')}</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.support')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}