import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Building2, CreditCard, Home, Car, Gem } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PhysicalAsset } from "@/components/PhysicalAssets";

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

interface DemoStep2Props {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  physicalAssets: PhysicalAsset[];
  setPhysicalAssets: (assets: PhysicalAsset[]) => void;
  onNext: () => void;
  onBack: () => void;
  t: (key: string) => string;
}

export function Step2Assets({ 
  assets, 
  setAssets, 
  physicalAssets, 
  setPhysicalAssets, 
  onNext, 
  onBack, 
  t 
}: DemoStep2Props) {
  
  // Pre-fill with demo data
  useEffect(() => {
    if (assets.length === 0) {
      setAssets([
        {
          id: "1",
          bank: "Handelsbanken",
          accountType: "Sparkonto",
          assetType: "Kontanter",
          accountNumber: "6000-123456789",
          amount: 450000
        },
        {
          id: "2", 
          bank: "SEB",
          accountType: "Investeringssparkonto (ISK)",
          assetType: "Aktier",
          accountNumber: "5000-987654321",
          amount: 280000
        },
        {
          id: "3",
          bank: "Nordea",
          accountType: "Sparkonto",
          assetType: "Kontanter", 
          accountNumber: "3000-555666777",
          amount: 125000
        }
      ]);
    }

    if (physicalAssets.length === 0) {
      setPhysicalAssets([
        {
          id: "1",
          name: "Sommarhus i Skåne",
          description: "Sommarhus med 4 rum och tomt på 1200 kvm",
          estimatedValue: 2800000,
          category: "Fastighet",
          distributionMethod: "sell"
        },
        {
          id: "2",
          name: "Volvo XC90 2019",
          description: "Bil i gott skick, körd 85000 km",
          estimatedValue: 420000,
          category: "Fordon", 
          distributionMethod: "assign"
        },
        {
          id: "3",
          name: "Smycken och klockor",
          description: "Arvegods inklusive guldklocka och ringar",
          estimatedValue: 180000,
          category: "Smycken",
          distributionMethod: "divide"
        }
      ]);
    }
  }, [assets.length, physicalAssets.length, setAssets, setPhysicalAssets]);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalPhysicalAssets = physicalAssets.reduce((sum, asset) => sum + asset.estimatedValue, 0);
  const totalDistributableAmount = assets.reduce((sum, asset) => sum + (asset.toRemain ? 0 : asset.amount), 0);

  const groupedAssets = assets.reduce((acc, asset) => {
    if (!acc[asset.bank]) {
      acc[asset.bank] = [];
    }
    acc[asset.bank].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Fastighet": return <Home className="h-4 w-4" />;
      case "Fordon": return <Car className="h-4 w-4" />;
      case "Smycken": return <Gem className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t('step2.title')}
          </CardTitle>
          <CardDescription>
            {t('step2.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo:</strong> Tillgångar är förfyllda med exempeldata för demonstration.
            </p>
          </div>

          {/* Financial Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Finansiella tillgångar</h3>
            {Object.entries(groupedAssets).map(([bankName, bankAssets]) => (
              <div key={bankName} className="border rounded-lg p-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {bankName}
                </h4>
                <div className="space-y-3">
                  {bankAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{asset.accountType}</Badge>
                          <Badge variant="secondary">{asset.assetType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Kontonummer: {asset.accountNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {asset.amount.toLocaleString('sv-SE')} kr
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Physical Assets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fysiska tillgångar</h3>
            {physicalAssets.map((asset) => (
              <div key={asset.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(asset.category)}
                      <h4 className="font-medium">{asset.name}</h4>
                      <Badge variant="outline">{asset.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {asset.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {asset.estimatedValue.toLocaleString('sv-SE')} kr
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Totala finansiella tillgångar:</span>
              <span className="font-medium">{totalAssets.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Totala fysiska tillgångar:</span>
              <span className="font-medium">{totalPhysicalAssets.toLocaleString('sv-SE')} kr</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Totalt värde:</span>
              <span>{(totalAssets + totalPhysicalAssets).toLocaleString('sv-SE')} kr</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.back')}
            </Button>
            <Button onClick={onNext} className="flex items-center gap-2">
              {t('common.next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}