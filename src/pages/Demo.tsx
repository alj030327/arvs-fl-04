import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Scale, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Step1PersonalNumber } from "@/components/steps/Step1PersonalNumber";
import { Step2Assets } from "@/components/steps/Step2Assets";
import { Step3Distribution } from "@/components/steps/Step3Distribution";
import { Step4ContactInfo } from "@/components/steps/Step4ContactInfo";
import { Step5BeneficiarySigning } from "@/components/steps/Step5BeneficiarySigning";
import { Step4Signing } from "@/components/steps/Step4Signing";
import { useTranslation } from "@/hooks/useTranslation";
import { PhysicalAsset } from "@/components/PhysicalAssets";
import { SafeDepositBoxItem } from "@/components/SafeDepositBox";

// Types from the original process
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
}

export default function Demo() {
  const { t, language, changeLanguage, getStepLabels } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [personalNumber, setPersonalNumber] = useState("");
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [testament, setTestament] = useState<Testament | null>(null);
  const [hasTestament, setHasTestament] = useState(false);
  const [physicalAssets, setPhysicalAssets] = useState<PhysicalAsset[]>([]);
  const [safeDepositBoxItems, setSafeDepositBoxItems] = useState<SafeDepositBoxItem[]>([]);
  const [savedProgress, setSavedProgress] = useState(false);

  const stepLabels = getStepLabels();
  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalDistributableAmount = assets.reduce((sum, asset) => sum + (asset.toRemain ? 0 : asset.amount), 0);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    setSavedProgress(true);
    console.log("Demo: Framsteg sparat!");
  };

  const handleComplete = () => {
    console.log("Demo: Går till kontaktuppgifter...");
    setCurrentStep(4);
  };

  const handleFinalComplete = () => {
    console.log("Demo: Arvskifte genomfört!");
    // Reset demo
    setCurrentStep(1);
    setPersonalNumber("");
    setHeirs([]);
    setAssets([]);
    setBeneficiaries([]);
    setTestament(null);
    setHasTestament(false);
    setPhysicalAssets([]);
    setSavedProgress(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Warning Header */}
      <div className="bg-warning/10 border-b border-warning/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-warning-foreground">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">DEMO VERSION - Ingen riktig data eller koppling till BankID</span>
            </div>
            <Link to="/" className="flex items-center space-x-2 text-warning-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Tillbaka till startsidan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header - samma som ursprungliga processen */}
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

      {/* Main Content - exakt samma som ursprungliga processen */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={6} 
          stepLabels={stepLabels} 
        />

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
            personalNumber={personalNumber}
            testament={testament}
            setTestament={setTestament}
            hasTestament={hasTestament}
            setHasTestament={setHasTestament}
            physicalAssets={physicalAssets}
            setPhysicalAssets={setPhysicalAssets}
            assetAllocations={[]}
            setAssetAllocations={() => {}}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSave}
            onComplete={handleComplete}
            savedProgress={savedProgress}
            t={t}
          />
        )}

        {currentStep === 4 && (
          <Step4ContactInfo
            heirs={heirs}
            setHeirs={setHeirs}
            personalNumber={personalNumber}
            totalAmount={totalDistributableAmount}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
          />
        )}

        {currentStep === 5 && (
          <Step5BeneficiarySigning
            heirs={heirs}
            setHeirs={setHeirs}
            onNext={handleNext}
            onBack={handleBack}
            t={t}
            totalAmount={totalDistributableAmount}
          />
        )}

        {currentStep === 6 && (
          <Step4Signing
            personalNumber={personalNumber}
            heirs={heirs}
            assets={assets}
            beneficiaries={beneficiaries}
            testament={testament}
            physicalAssets={physicalAssets}
            onBack={handleBack}
            onComplete={handleFinalComplete}
            t={t}
          />
        )}
      </div>

      {/* Footer - samma som ursprungliga processen */}
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