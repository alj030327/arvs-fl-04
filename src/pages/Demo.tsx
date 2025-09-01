import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft } from "lucide-react";
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

// Types from Process.tsx
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
  const { t, getStepLabels } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [personalNumber, setPersonalNumber] = useState("");
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [testament, setTestament] = useState<Testament | null>(null);
  const [hasTestament, setHasTestament] = useState(false);
  const [physicalAssets, setPhysicalAssets] = useState<PhysicalAsset[]>([]);
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
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span>Tillbaka till startsidan</span>
          </Link>
          <Badge variant="secondary" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            DEMO - Ingen riktig data
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Demo: Digitalt Arvskifte</h1>
            <p className="text-muted-foreground mb-4">
              Detta är en demonstration av arvskifteprocessen. Ingen riktig data sparas och ingen koppling till BankID eller verkliga API:er görs.
            </p>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">OBS: Detta är endast en demo</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">
                Alla svar och signeringar är slumpmässiga och inte kopplade till verkliga system.
              </p>
            </div>
          </div>

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
      </div>
    </div>
  );
}