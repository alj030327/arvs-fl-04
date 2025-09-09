import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, UserCheck, Building2, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Step1PersonalNumber } from "@/components/steps/Step1PersonalNumber";
import { Step2Assets } from "@/components/steps/Step2Assets";
import { Step3Distribution } from "@/components/steps/Step3Distribution";
import { Step4ContactInfo } from "@/components/steps/Step4ContactInfo";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { generateRandomDemoData } from "@/utils/demoDataGenerator";

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
  amountToRemain?: number;
  reasonToRemain?: string;
}

interface Beneficiary {
  id: string;
  name: string;
  personalNumber: string;
  relationship: string;
  percentage: number;
  accountNumber: string;
  email?: string;
  phone?: string;
  assetPreferences?: {
    warrants: 'transfer' | 'sell';
    certificates: 'transfer' | 'sell';
    options: 'transfer' | 'sell';
    futures: 'transfer' | 'sell';
  };
}

export default function DemoBaspaket() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Randomized demo data
  const [personalNumber, setPersonalNumber] = useState("");
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [testament, setTestament] = useState(null);
  const [hasTestament, setHasTestament] = useState(false);
  const [physicalAssets, setPhysicalAssets] = useState([]);
  const [deceasedName, setDeceasedName] = useState("");

  // Generate random demo data on component mount
  useEffect(() => {
    const demoData = generateRandomDemoData();
    setPersonalNumber(demoData.personalNumber);
    setDeceasedName(demoData.deceasedName);
    setHeirs(demoData.heirs);
    setAssets(demoData.assets);
    setBeneficiaries(demoData.beneficiaries);
  }, []);

  // Translation function for demo
  const t = (key: string) => {
    const translations: { [key: string]: string } = {
      'step1.title': 'Personnummer för avliden',
      'step1.subtitle': 'Ange personnummer för den avlidne för att hämta arvsinformation',
      'assets.title': 'Tillgångar och skulder',
      'assets.subtitle': 'Lägg till alla tillgångar och skulder som ingår i dödsboet',
      'assets.bank': 'Bank',
      'assets.account_type': 'Kontotyp', 
      'assets.asset_type': 'Tillgångstyp',
      'assets.account_number': 'Kontonummer',
      'assets.amount': 'Belopp (kr)',
      'assets.debt': 'Skuld (kr)',
      'assets.debt_amount_help': 'Ange skuldens storlek',
      'assets.select_account_type': 'Välj kontotyp',
      'assets.select_asset_type': 'Välj tillgångstyp',
      'assets.select_bank_first': 'Välj bank först',
      'button.choose': 'Välj',
      'button.select': 'Välj'
    };
    return translations[key] || key;
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalSteps = 4;

  const stepTitles = [
    "Personnummer",
    "Tillgångar", 
    "Fördelning",
    "Kontaktinfo"
  ];

  const stepIcons = [UserCheck, Building2, Users, FileText];

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

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Demo Notice */}
          <Card className="mb-8 border-orange-200 bg-orange-50">
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
                    <span>{deceasedName ? `${deceasedName} med ${heirs.length} arvingar, ${assets.length} konton` : 'Randomiserad demo-data laddas...'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator 
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepTitles}
            />
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <Step1PersonalNumber
                personalNumber={personalNumber}
                setPersonalNumber={setPersonalNumber}
                heirs={heirs}
                setHeirs={setHeirs}
                onNext={handleNext}
                t={t}
              />
            )}

            {currentStep === 2 && (
              <Step2Assets
                assets={assets}
                setAssets={setAssets}
                onNext={handleNext}
                onBack={handleBack}
                t={t}
              />
            )}

            {currentStep === 3 && (
              <Step3Distribution
                beneficiaries={beneficiaries}
                setBeneficiaries={setBeneficiaries}
                totalAmount={assets.reduce((sum, asset) => {
                  const isDebt = ['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån', 'Billån', 'Företagslån'].includes(asset.assetType);
                  return sum + (isDebt ? -asset.amount : asset.amount);
                }, 0)}
                assets={assets}
                personalNumber={personalNumber}
                testament={testament}
                setTestament={setTestament}
                hasTestament={hasTestament}
                setHasTestament={setHasTestament}
                physicalAssets={physicalAssets}
                setPhysicalAssets={setPhysicalAssets}
                onNext={handleNext}
                onBack={handleBack}
                onSave={() => {}}
                onComplete={handleNext}
                savedProgress={null}
                t={t}
              />
            )}

            {currentStep === 4 && (
              <Step4ContactInfo
                heirs={heirs}
                setHeirs={setHeirs}
                onNext={() => {}}
                onBack={handleBack}
                t={t}
              />
            )}
          </div>

          {/* Navigation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Föregående
                    </Button>
                  )}
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Steg {currentStep} av {totalSteps}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Demo med förifylld data - visar processen för baspaket
                  </p>
                </div>

                <div>
                  {currentStep < totalSteps ? (
                    <Button onClick={handleNext}>
                      Nästa
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Demo slutförd! I den riktiga tjänsten skulle du nu betala och få tillgång till alla dokument.
                      </p>
                      <Link to="/payment">
                        <Button>
                          Köp Baspaket (500 kr)
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}