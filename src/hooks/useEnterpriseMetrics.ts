import { useState, useEffect } from 'react';

export interface EnterpriseMetrics {
  activeUsers: number;
  casesProcessed: number;
  timeReduction: number;
  costSavings: number;
  satisfactionScore: number;
  uptimePercentage: number;
  averageProcessingTime: number;
  automationRate: number;
}

export interface PerformanceData {
  timestamp: Date;
  value: number;
  metric: string;
}

export const useEnterpriseMetrics = () => {
  const [metrics, setMetrics] = useState<EnterpriseMetrics>({
    activeUsers: 12500,
    casesProcessed: 89750,
    timeReduction: 85,
    costSavings: 5150000,
    satisfactionScore: 4.9,
    uptimePercentage: 99.99,
    averageProcessingTime: 12,
    automationRate: 80
  });

  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        casesProcessed: prev.casesProcessed + Math.floor(Math.random() * 5),
        satisfactionScore: Math.max(4.5, Math.min(5.0, prev.satisfactionScore + (Math.random() - 0.5) * 0.1))
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const generatePerformanceData = (metric: string, days: number = 30) => {
    const data: PerformanceData[] = [];
    const now = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let value: number;
      switch (metric) {
        case 'processing-time':
          value = 12 + Math.random() * 3; // 12-15 hours
          break;
        case 'satisfaction':
          value = 4.5 + Math.random() * 0.5; // 4.5-5.0
          break;
        case 'automation':
          value = 75 + Math.random() * 10; // 75-85%
          break;
        case 'uptime':
          value = 99.5 + Math.random() * 0.5; // 99.5-100%
          break;
        default:
          value = Math.random() * 100;
      }
      
      data.push({ timestamp: date, value, metric });
    }
    
    return data;
  };

  const fetchMetrics = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate fresh performance data
    setPerformanceData(generatePerformanceData('processing-time'));
    setLoading(false);
  };

  const calculateROI = (investment: number): number => {
    const annualSavings = metrics.costSavings;
    return ((annualSavings - investment) / investment) * 100;
  };

  const getEfficiencyGains = () => {
    return {
      timeReduction: metrics.timeReduction,
      costReduction: (metrics.costSavings / 10000000) * 100, // Percentage of 10M baseline
      qualityImprovement: (metrics.satisfactionScore - 3) / 2 * 100, // Convert 3-5 scale to percentage
      automationIncrease: metrics.automationRate
    };
  };

  const getBenchmarkComparison = () => {
    return {
      industryAverage: {
        processingTime: 72, // hours
        satisfaction: 3.8,
        automation: 25,
        uptime: 95.5
      },
      ourPerformance: {
        processingTime: metrics.averageProcessingTime,
        satisfaction: metrics.satisfactionScore,
        automation: metrics.automationRate,
        uptime: metrics.uptimePercentage
      }
    };
  };

  return {
    metrics,
    performanceData,
    loading,
    fetchMetrics,
    calculateROI,
    getEfficiencyGains,
    getBenchmarkComparison,
    generatePerformanceData
  };
};