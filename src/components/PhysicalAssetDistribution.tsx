import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Package, ArrowRight, X, Target } from "lucide-react";
import { PhysicalAsset } from "@/components/PhysicalAssets";
import { SafeDepositBoxItem } from "@/components/SafeDepositBox";

interface Beneficiary {
  id: string;
  name: string;
}

interface PhysicalDistribution {
  assetId: string;
  assetType: 'physical' | 'safeDeposit';
  beneficiaryId: string;
  beneficiaryName: string;
  distributionType: 'inherit' | 'sell_and_distribute';
}

interface PhysicalAssetDistributionProps {
  physicalAssets: PhysicalAsset[];
  safeDepositBoxItems: SafeDepositBoxItem[];
  beneficiaries: Beneficiary[];
  distributions: PhysicalDistribution[];
  setDistributions: (distributions: PhysicalDistribution[]) => void;
}

export const PhysicalAssetDistribution = ({
  physicalAssets,
  safeDepositBoxItems,
  beneficiaries,
  distributions,
  setDistributions
}: PhysicalAssetDistributionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const addDistribution = (assetId: string, assetType: 'physical' | 'safeDeposit', beneficiaryId: string, distributionType: 'inherit' | 'sell_and_distribute') => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (!beneficiary) return;

    // Remove existing distribution for this asset
    const filteredDistributions = distributions.filter(d => d.assetId !== assetId);
    
    const newDistribution: PhysicalDistribution = {
      assetId,
      assetType,
      beneficiaryId,
      beneficiaryName: beneficiary.name,
      distributionType
    };

    setDistributions([...filteredDistributions, newDistribution]);
  };

  const removeDistribution = (assetId: string) => {
    setDistributions(distributions.filter(d => d.assetId !== assetId));
  };

  const getAssetById = (assetId: string, assetType: 'physical' | 'safeDeposit') => {
    if (assetType === 'physical') {
      return physicalAssets.find(a => a.id === assetId);
    } else {
      return safeDepositBoxItems.find(i => i.id === assetId);
    }
  };

  const getDistributedAssetIds = () => {
    return distributions.map(d => d.assetId);
  };

  const getUndistributedAssets = () => {
    const undistributedPhysical = physicalAssets.filter(asset => 
      asset.distributionMethod === 'assign' && 
      !getDistributedAssetIds().includes(asset.id)
    );
    
    const undistributedSafeDeposit = safeDepositBoxItems.filter(item =>
      item.distributionMethod === 'assign' && 
      !getDistributedAssetIds().includes(item.id)
    );

    return { undistributedPhysical, undistributedSafeDeposit };
  };

  const getDistributionTypeLabel = (type: string) => {
    switch (type) {
      case 'inherit': return 'Ärva direkt';
      case 'sell_and_distribute': return 'Sälj och dela värdet';
      default: return type;
    }
  };

  if (beneficiaries.length === 0) {
    return null;
  }

  const { undistributedPhysical, undistributedSafeDeposit } = getUndistributedAssets();
  const hasAssignableAssets = undistributedPhysical.length > 0 || undistributedSafeDeposit.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-lg">Fördelning av fysiska tillgångar</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Specifik fördelning
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {distributions.length > 0 && (
                  <Badge variant="outline">
                    {distributions.length} fördelning{distributions.length !== 1 ? 'ar' : ''}
                  </Badge>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Här kan du specificera hur fysiska tillgångar och föremål från bankfack ska fördelas mellan dödsbodelägarna. 
              Detta används för föremål som ska ärvas direkt av specifika personer enligt arvskifteshandlingen.
            </p>

            {/* Current distributions */}
            {distributions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Aktuella fördelningar</h4>
                {distributions.map((distribution) => {
                  const asset = getAssetById(distribution.assetId, distribution.assetType);
                  if (!asset) return null;

                  return (
                    <div key={distribution.assetId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-sm">
                          <div className="font-medium flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {asset.name}
                            <Badge variant="secondary" className="text-xs">
                              {distribution.assetType === 'physical' ? 'Fysisk tillgång' : 'Bankfack'}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">
                            {asset.category} • {asset.estimatedValue.toLocaleString('sv-SE')} SEK
                          </div>
                          <div className="text-xs text-primary">
                            {getDistributionTypeLabel(distribution.distributionType)}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline">
                          {distribution.beneficiaryName}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDistribution(distribution.assetId)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add new distribution */}
            {hasAssignableAssets && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Tilldela specifika föremål</h4>
                
                {/* Physical Assets */}
                {undistributedPhysical.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Fysiska tillgångar</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {undistributedPhysical.map((asset) => (
                        <div key={asset.id} className="p-3 border border-border rounded-lg">
                          <div className="space-y-3">
                            <div className="text-sm">
                              <div className="font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                {asset.name}
                              </div>
                              <div className="text-muted-foreground">
                                {asset.category} • {asset.estimatedValue.toLocaleString('sv-SE')} SEK
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Select onValueChange={(beneficiaryId) => addDistribution(asset.id, 'physical', beneficiaryId, 'inherit')}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Tilldela till dödsbodelägare..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {beneficiaries.map((beneficiary) => (
                                    <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                      {beneficiary.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Deposit Box Items */}
                {undistributedSafeDeposit.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Föremål från bankfack</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {undistributedSafeDeposit.map((item) => (
                        <div key={item.id} className="p-3 border border-border rounded-lg">
                          <div className="space-y-3">
                            <div className="text-sm">
                              <div className="font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                {item.name}
                              </div>
                              <div className="text-muted-foreground">
                                {item.category} • {item.estimatedValue.toLocaleString('sv-SE')} SEK
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Select onValueChange={(beneficiaryId) => addDistribution(item.id, 'safeDeposit', beneficiaryId, 'inherit')}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Tilldela till dödsbodelägare..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {beneficiaries.map((beneficiary) => (
                                    <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                      {beneficiary.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!hasAssignableAssets && distributions.length === 0 && (
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Inga fysiska tillgångar eller bankfacksföremål är markerade för specifik tilldelning. 
                  Gå tillbaka till steg 2 för att ändra fördelningsmetod om du vill tilldela specifika föremål.
                </p>
              </div>
            )}

            {!hasAssignableAssets && distributions.length > 0 && (
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Alla tillgängliga föremål för specifik tilldelning har tilldelats
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};