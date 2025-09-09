import { useState } from "react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Step1PersonalNumber } from "@/components/demo-steps/DemoStep1PersonalNumber";
import { Step2Assets } from "@/components/demo-steps/DemoStep2Assets";
import { Step3Distribution } from "@/components/demo-steps/DemoStep3Distribution";
import { Step4Signing } from "@/components/demo-steps/DemoStep4Signing";
import { Scale, Globe, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { PhysicalAsset } from "@/components/PhysicalAssets";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const DemoBaspaket = () => {
  const { t, language, changeLanguage, getStepLabels } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Pre-filled data for demo
  const [personalNumber, setPersonalNumber] = useState("199001011234");
  const [heirs, setHeirs] = useState<Heir[]>([
    {
      personalNumber: "199505151234",
      name: "Anna Andersson",
      relationship: "Dotter",
      inheritanceShare: 50,
      email: "anna.andersson@email.com",
      phone: "070-123 45 67"
    },
    {
      personalNumber: "199203031234",
      name: "Erik Eriksson", 
      relationship: "Son",
      inheritanceShare: 50,
      email: "erik.eriksson@email.com",
      phone: "070-987 65 43"
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
    },
    {
      id: "3",
      bank: "Swedbank",
      accountType: "Bolånekonto",
      assetType: "Bolån",
      accountNumber: "5555 444 333",
      amount: 1200000
    }
  ]);

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "Anna Andersson",
      personalNumber: "199505151234",
      relationship: "Dotter",
      percentage: 50,
      accountNumber: "1111 222 333"
    },
    {
      id: "2",
      name: "Erik Eriksson",
      personalNumber: "199203031234", 
      relationship: "Son",
      percentage: 50,
      accountNumber: "4444 555 666"
    }
  ]);
  
  const [testament, setTestament] = useState<Testament | null>(null);
  const [hasTestament, setHasTestament] = useState(false);
  const [physicalAssets, setPhysicalAssets] = useState<PhysicalAsset[]>([]);
  const [savedProgress, setSavedProgress] = useState(false);

  const stepLabels = getStepLabels();

  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalDistributableAmount = assets.reduce((sum, asset) => sum + (asset.toRemain ? 0 : asset.amount), 0);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    setSavedProgress(true);
    // Simulate saving progress
    console.log("Framsteg sparat!");
  };

  const handleComplete = () => {
    // Go to contact info step
    console.log("Går till kontaktuppgifter...");
    setCurrentStep(4);
  };

  const handleFinalComplete = () => {
    // Reset or redirect to completion page
    console.log("Arvsskifte genomfört!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/demo-instructions" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{t('app.title')}</h1>
                  <p className="text-muted-foreground">{t('app.subtitle')}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm bg-orange-50 text-orange-700 border-orange-300">
                Demo Baspaket
              </Badge>
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

      {/* Demo Notice */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Demo Baspaket - Förifylld exempelprocess</h3>
                <p className="text-orange-700 text-sm mb-3">
                  Detta är en demonstrationversion av vårt baspaket. All information är förifylld som exempel 
                  för att visa hur processen fungerar från steg 1-6. I den riktiga tjänsten fyller du i din egen information.
                </p>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <span className="font-medium">Exemplet visar:</span>
                  <span>Avliden person med 2 arvingar, 3 konton (inklusive bolån), jämn fördelning</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={4} 
          stepLabels={stepLabels} 
        />

        {currentStep === 1 && (
          <Step1PersonalNumber
            personalNumber={personalNumber}
            setPersonalNumber={setPersonalNumber}
            onNext={handleNext}
            t={t}
          />
        )}

        {currentStep === 2 && (
          <Step2Assets
            assets={assets}
            setAssets={setAssets}
            physicalAssets={physicalAssets}
            setPhysicalAssets={setPhysicalAssets}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
          />
        )}

        {currentStep === 3 && (
          <Step3Distribution
            heirs={heirs}
            setHeirs={setHeirs}
            totalAmount={totalDistributableAmount}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
          />
        )}

        {currentStep === 4 && (
          <Step4Signing
            personalNumber={personalNumber}
            heirs={heirs}
            assets={assets}
            physicalAssets={physicalAssets}
            onBack={handleBack}
            onComplete={handleFinalComplete}
            t={t}
          />
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
};

export default DemoBaspaket;