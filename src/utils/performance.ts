// ============================================================================
// ENTERPRISE PERFORMANCE OPTIMIZATION UTILITIES
// Advanced performance monitoring, optimization, and analytics
// ============================================================================

import React from 'react';
import type { PerformanceMetrics, HealthCheck } from '@/types';

// ============================================================================
// PERFORMANCE MEASUREMENT
// ============================================================================

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private observers: PerformanceObserver[] = [];
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
      this.observers.push(navigationObserver);

      // Resource timing observer
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordResourceMetrics(entry as PerformanceResourceTiming);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Layout shift observer
      const layoutShiftObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift') {
            this.recordLayoutShiftMetrics(entry as LayoutShift);
          }
        });
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);

      // Largest contentful paint observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordLCPMetrics(lastEntry as LargestContentfulPaint);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
      this.isEnabled = false;
    }
  }

  private recordNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics: PerformanceMetrics = {
      loadTime: entry.loadEventEnd - entry.navigationStart,
      renderTime: entry.domContentLoadedEventEnd - entry.navigationStart,
      apiResponseTime: entry.responseEnd - entry.requestStart,
      errorRate: 0,
      userSatisfactionScore: this.calculateSatisfactionScore(entry),
      timestamp: new Date(),
    };

    this.metrics.set('navigation', metrics);
    this.reportMetrics('navigation', metrics);
  }

  private recordResourceMetrics(entry: PerformanceResourceTiming): void {
    if (entry.name.includes('/api/')) {
      const responseTime = entry.responseEnd - entry.requestStart;
      this.recordAPIResponseTime(entry.name, responseTime);
    }
  }

  private recordLayoutShiftMetrics(entry: LayoutShift): void {
    if (!entry.hadRecentInput) {
      this.recordCLS(entry.value);
    }
  }

  private recordLCPMetrics(entry: LargestContentfulPaint): void {
    this.recordLCP(entry.startTime);
  }

  private calculateSatisfactionScore(entry: PerformanceNavigationTiming): number {
    const loadTime = entry.loadEventEnd - entry.navigationStart;
    const fcp = entry.responseEnd - entry.navigationStart;
    
    // Apdex-like scoring
    if (loadTime < 1000 && fcp < 500) return 1.0;
    if (loadTime < 3000 && fcp < 1500) return 0.8;
    if (loadTime < 5000 && fcp < 2500) return 0.6;
    if (loadTime < 8000 && fcp < 4000) return 0.4;
    return 0.2;
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

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
      existing.errorRate += 1;
      this.metrics.set(key, existing);
    }
  }

  recordLCP(time: number): void {
    const existing = this.metrics.get('core-vitals') || {
      loadTime: 0,
      renderTime: 0,
      apiResponseTime: 0,
      errorRate: 0,
      userSatisfactionScore: 1,
      timestamp: new Date(),
    };

    existing.loadTime = time;
    this.metrics.set('core-vitals', existing);
  }

  recordCLS(value: number): void {
    const existing = this.metrics.get('core-vitals') || {
      loadTime: 0,
      renderTime: 0,
      apiResponseTime: 0,
      errorRate: 0,
      userSatisfactionScore: 1,
      timestamp: new Date(),
    };

    // CLS accumulates over time
    existing.userSatisfactionScore = Math.max(0, existing.userSatisfactionScore - value);
    this.metrics.set('core-vitals', existing);
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
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
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
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
    this.isEnabled = false;
  }
}

// ============================================================================
// MEMOIZATION UTILITIES
// ============================================================================

interface MemoCache<T> {
  value: T;
  timestamp: number;
  hitCount: number;
}

export class AdvancedMemoization {
  private static caches = new Map<string, Map<string, MemoCache<any>>>();
  private static maxCacheSize = 1000;
  private static defaultTTL = 5 * 60 * 1000; // 5 minutes

  static memoize<TArgs extends any[], TReturn>(
    fn: (...args: TArgs) => TReturn,
    options: {
      key?: string;
      ttl?: number;
      maxSize?: number;
      keyGenerator?: (...args: TArgs) => string;
    } = {}
  ): (...args: TArgs) => TReturn {
    const {
      key = fn.name || 'anonymous',
      ttl = this.defaultTTL,
      maxSize = this.maxCacheSize,
      keyGenerator = (...args) => JSON.stringify(args),
    } = options;

    if (!this.caches.has(key)) {
      this.caches.set(key, new Map());
    }

    const cache = this.caches.get(key)!;

    return (...args: TArgs): TReturn => {
      const cacheKey = keyGenerator(...args);
      const now = Date.now();
      
      // Check if cached value exists and is not expired
      const cached = cache.get(cacheKey);
      if (cached && (now - cached.timestamp) < ttl) {
        cached.hitCount++;
        return cached.value;
      }

      // Compute new value
      const value = fn(...args);
      
      // Cache management: remove oldest entries if cache is full
      if (cache.size >= maxSize) {
        const entries = Array.from(cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = entries.slice(0, Math.floor(maxSize * 0.25)); // Remove 25%
        toRemove.forEach(([key]) => cache.delete(key));
      }

      // Store new value
      cache.set(cacheKey, {
        value,
        timestamp: now,
        hitCount: 0,
      });

      return value;
    };
  }

  static clearCache(key?: string): void {
    if (key) {
      this.caches.delete(key);
    } else {
      this.caches.clear();
    }
  }

  static getCacheStats(key?: string): Record<string, any> {
    if (key) {
      const cache = this.caches.get(key);
      if (!cache) return { size: 0, hitRate: 0 };
      
      const entries = Array.from(cache.values());
      const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
      const totalAccess = entries.length + totalHits;
      
      return {
        size: cache.size,
        hitRate: totalAccess > 0 ? totalHits / totalAccess : 0,
        oldestEntry: Math.min(...entries.map(e => e.timestamp)),
        newestEntry: Math.max(...entries.map(e => e.timestamp)),
      };
    }

    const allStats: Record<string, any> = {};
    this.caches.forEach((cache, key) => {
      allStats[key] = this.getCacheStats(key);
    });
    
    return allStats;
  }
}

// ============================================================================
// LAZY LOADING UTILITIES
// ============================================================================

export class LazyLoader {
  private static intersectionObserver: IntersectionObserver | null = null;
  private static pendingElements = new Map<Element, () => void>();

  static initialize(): void {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const callback = this.pendingElements.get(entry.target);
            if (callback) {
              callback();
              this.pendingElements.delete(entry.target);
              this.intersectionObserver?.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  static observeElement(element: Element, callback: () => void): void {
    if (!this.intersectionObserver) {
      this.initialize();
    }

    if (this.intersectionObserver) {
      this.pendingElements.set(element, callback);
      this.intersectionObserver.observe(element);
    } else {
      // Fallback: execute immediately
      callback();
    }
  }

  static unobserveElement(element: Element): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
      this.pendingElements.delete(element);
    }
  }

  static destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.pendingElements.clear();
  }
}

// ============================================================================
// DEBOUNCING AND THROTTLING
// ============================================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const { leading = false, trailing = true, maxWait } = options;
  
  let timeoutId: NodeJS.Timeout | undefined;
  let maxTimeoutId: NodeJS.Timeout | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T>;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> {
    lastInvokeTime = time;
    timeoutId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime!;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): ReturnType<T> | undefined {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = setTimeout(timerExpired, remainingWait(time));
    return undefined;
  }

  function trailingEdge(time: number): ReturnType<T> {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel(): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeoutId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T & { cancel: () => void; flush: () => ReturnType<T> | undefined };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void; flush: () => ReturnType<T> | undefined } {
  const { leading = true, trailing = true } = options;
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}

// ============================================================================
// BUNDLE SPLITTING UTILITIES
// ============================================================================

export function createAsyncComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFn);
  
  if (fallback) {
    return React.lazy(async () => {
      try {
        return await importFn();
      } catch (error) {
        console.error('Error loading component:', error);
        return { default: fallback as T };
      }
    });
  }
  
  return LazyComponent;
}

// ============================================================================
// HEALTH MONITORING
// ============================================================================

export class HealthMonitor {
  private static checks = new Map<string, () => Promise<HealthCheck>>();
  private static lastResults = new Map<string, HealthCheck>();

  static registerCheck(
    name: string,
    checkFn: () => Promise<HealthCheck>
  ): void {
    this.checks.set(name, checkFn);
  }

  static async runAllChecks(): Promise<Map<string, HealthCheck>> {
    const results = new Map<string, HealthCheck>();
    
    for (const [name, checkFn] of this.checks) {
      try {
        const startTime = performance.now();
        const result = await checkFn();
        const endTime = performance.now();
        
        const healthCheck: HealthCheck = {
          ...result,
          responseTime: endTime - startTime,
          lastCheck: new Date(),
        };
        
        results.set(name, healthCheck);
        this.lastResults.set(name, healthCheck);
      } catch (error) {
        const failedCheck: HealthCheck = {
          service: name,
          status: 'unhealthy',
          lastCheck: new Date(),
          responseTime: 0,
          uptime: 0,
          version: 'unknown',
        };
        
        results.set(name, failedCheck);
        this.lastResults.set(name, failedCheck);
      }
    }
    
    return results;
  }

  static getLastResults(): Map<string, HealthCheck> {
    return new Map(this.lastResults);
  }

  static getOverallHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const results = Array.from(this.lastResults.values());
    
    if (results.length === 0) return 'unhealthy';
    
    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const degradedCount = results.filter(r => r.status === 'degraded').length;
    const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
    
    if (unhealthyCount > 0) return 'unhealthy';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export function initializePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    // Initialize performance monitoring
    PerformanceMonitor.getInstance();
    
    // Initialize lazy loading
    LazyLoader.initialize();
    
    // Register basic health checks
    HealthMonitor.registerCheck('client', async () => ({
      service: 'client',
      status: 'healthy',
      lastCheck: new Date(),
      responseTime: 0,
      uptime: performance.now(),
      version: process.env.REACT_APP_VERSION || '1.0.0',
    }));
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      PerformanceMonitor.getInstance().destroy();
      LazyLoader.destroy();
      AdvancedMemoization.clearCache();
    });
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  initializePerformanceMonitoring();
}