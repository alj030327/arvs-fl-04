// ============================================================================
// SIMPLIFIED PERFORMANCE UTILITIES
// Focused performance monitoring without complex types
// ============================================================================

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  errorRate: number;
  userSatisfactionScore: number;
  timestamp: Date;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private isEnabled: boolean = true;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      this.isEnabled = false;
      return;
    }

    try {
      // Navigation timing observer
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordNavigationMetrics(entry as PerformanceNavigationTiming);
          }
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
      this.isEnabled = false;
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const startTime = entry.fetchStart;
    const metrics: PerformanceMetrics = {
      loadTime: entry.loadEventEnd - startTime,
      renderTime: entry.domContentLoadedEventEnd - startTime,
      apiResponseTime: entry.responseEnd - entry.requestStart,
      errorRate: 0,
      userSatisfactionScore: this.calculateSatisfactionScore(entry),
      timestamp: new Date(),
    };

    this.metrics.set('navigation', metrics);
    this.reportMetrics('navigation', metrics);
  }

  private calculateSatisfactionScore(entry: PerformanceNavigationTiming): number {
    const loadTime = entry.loadEventEnd - entry.fetchStart;
    const fcp = entry.responseEnd - entry.fetchStart;
    
    // Apdex-like scoring
    if (loadTime < 1000 && fcp < 500) return 1.0;
    if (loadTime < 3000 && fcp < 1500) return 0.8;
    if (loadTime < 5000 && fcp < 2500) return 0.6;
    if (loadTime < 8000 && fcp < 4000) return 0.4;
    return 0.2;
  }

  startTiming(label: string): () => number {
    if (!this.isEnabled) return () => 0;
    
    const startTime = performance.now();
    
    return (): number => {
      const duration = performance.now() - startTime;
      this.recordCustomTiming(label, duration);
      return duration;
    };
  }

  recordCustomTiming(label: string, duration: number): void {
    if (!this.isEnabled) return;
    
    performance.mark(`${label}-start`);
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
  }

  recordAPIResponseTime(endpoint: string, responseTime: number): void {
    const existing = this.metrics.get(`api-${endpoint}`);
    const metrics: PerformanceMetrics = {
      loadTime: existing?.loadTime || 0,
      renderTime: existing?.renderTime || 0,
      apiResponseTime: responseTime,
      errorRate: existing?.errorRate || 0,
      userSatisfactionScore: existing?.userSatisfactionScore || 1,
      timestamp: new Date(),
    };

    this.metrics.set(`api-${endpoint}`, metrics);
  }

  recordError(type: string, endpoint?: string): void {
    const key = endpoint ? `api-${endpoint}` : 'general';
    const existing = this.metrics.get(key);
    
    if (existing) {
      const updatedMetrics = { ...existing, errorRate: existing.errorRate + 1 };
      this.metrics.set(key, updatedMetrics);
    }
  }

  getMetrics(key?: string): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (key) {
      return this.metrics.get(key)!;
    }
    return new Map(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  private reportMetrics(key: string, metrics: PerformanceMetrics): void {
    // Send to analytics service (simplified)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: key,
        load_time: metrics.loadTime,
        render_time: metrics.renderTime,
        api_response_time: metrics.apiResponseTime,
        error_rate: metrics.errorRate,
        satisfaction_score: metrics.userSatisfactionScore,
      });
    }
  }

  destroy(): void {
    this.metrics.clear();
    this.isEnabled = false;
  }
}

// Simplified debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | undefined;
  let lastArgs: Parameters<T>;
  let lastThis: any;

  function debounced(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(lastThis, lastArgs);
    }, wait);
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced as T & { cancel: () => void };
}

// Initialize performance monitoring
export function initializePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    PerformanceMonitor.getInstance();
    
    window.addEventListener('beforeunload', () => {
      PerformanceMonitor.getInstance().destroy();
    });
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  initializePerformanceMonitoring();
}