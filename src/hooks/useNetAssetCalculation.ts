import { useMemo } from 'react';

interface Asset {
  id: string;
  amount: number;
  assetType: string;
  toRemain?: boolean;
  amountToRemain?: number;
}

interface AssetAllocation {
  assetId: string;
  beneficiaryId: string;
  amount?: number;
}

export const useNetAssetCalculation = (
  assets: Asset[],
  allocations: AssetAllocation[] = []
) => {
  return useMemo(() => {
    // Separate assets and debts
    const totalAssets = assets.reduce((sum, asset) => {
      const isDebt = ['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån', 'Billån', 'Företagslån'].includes(asset.assetType);
      const value = isDebt ? -Math.abs(asset.amount) : asset.amount;
      return sum + value;
    }, 0);

    // Calculate specifically allocated asset values
    const allocatedAssetValue = allocations.reduce((sum, allocation) => {
      const asset = assets.find(a => a.id === allocation.assetId);
      if (asset && !asset.toRemain) {
        return sum + (allocation.amount || asset.amount);
      }
      return sum;
    }, 0);

    // Calculate distributable amount (excluding locked assets and specifically allocated assets)
    const distributableAmount = assets.reduce((sum, asset) => {
      const isDebt = ['Bolån', 'Privatlån', 'Kreditkort', 'Blancolån', 'Billån', 'Företagslån'].includes(asset.assetType);
      const value = isDebt ? -Math.abs(asset.amount) : asset.amount;
      
      // Skip if asset is locked/toRemain
      if (asset.toRemain) {
        if (asset.amountToRemain !== undefined) {
          const distributablePortion = isDebt 
            ? asset.amountToRemain >= Math.abs(asset.amount) ? 0 : value + asset.amountToRemain
            : value - asset.amountToRemain;
          return sum + Math.max(0, distributablePortion);
        }
        return sum;
      }
      
      // Skip if asset is specifically allocated
      const isAllocated = allocations.some(allocation => allocation.assetId === asset.id);
      if (isAllocated) return sum;
      
      return sum + value;
    }, 0);

    // Net assets for percentage distribution = distributable amount
    const netAssetsForPercentageDistribution = Math.max(0, distributableAmount);

    return {
      totalAssets,
      netAssets: totalAssets,
      allocatedAssetValue,
      netAssetsForPercentageDistribution,
      distributableAmount: netAssetsForPercentageDistribution
    };
  }, [assets, allocations]);
};