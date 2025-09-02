// ============================================================================
// ENTERPRISE ERROR BOUNDARY SYSTEM
// Advanced error handling with recovery, reporting, and user experience
// ============================================================================

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home, Bug, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// ERROR TYPES AND INTERFACES
// ============================================================================

export interface CustomErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorReport {
  id: string;
  timestamp: Date;
  error: Error;
  errorInfo: CustomErrorInfo;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  isReporting: boolean;
  reportSent: boolean;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
  maxRetries?: number;
  isolateErrors?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  level?: 'page' | 'section' | 'component';
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
  retryCount: number;
  maxRetries: number;
  reportError: () => void;
  isReporting: boolean;
  reportSent: boolean;
  level: 'page' | 'section' | 'component';
}

// ============================================================================
// ERROR REPORTING SERVICE
// ============================================================================

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private reportQueue: ErrorReport[] = [];
  private isOnline: boolean = true;
  private maxQueueSize: number = 100;

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  private constructor() {
    this.initializeOnlineDetection();
    this.initializePeriodicSync();
  }

  private initializeOnlineDetection(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncQueuedReports();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });

      this.isOnline = navigator.onLine;
    }
  }

  private initializePeriodicSync(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (this.isOnline && this.reportQueue.length > 0) {
          this.syncQueuedReports();
        }
      }, 30000); // Sync every 30 seconds
    }
  }

  async reportError(
    error: Error,
    errorInfo: ErrorInfo,
    additionalData?: Record<string, unknown>
  ): Promise<string> {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack || '',
      } as Error,
      errorInfo,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      additionalData,
    };

    // Add to queue
    this.reportQueue.push(errorReport);
    
    // Limit queue size
    if (this.reportQueue.length > this.maxQueueSize) {
      this.reportQueue.shift();
    }

    // Try to send immediately if online
    if (this.isOnline) {
      await this.syncQueuedReports();
    }

    return errorReport.id;
  }

  private async syncQueuedReports(): Promise<void> {
    if (this.reportQueue.length === 0) return;

    const reportsToSend = [...this.reportQueue];
    this.reportQueue = [];

    try {
      await this.sendReports(reportsToSend);
    } catch (error) {
      console.error('Failed to send error reports:', error);
      // Re-queue failed reports
      this.reportQueue = [...reportsToSend, ...this.reportQueue];
    }
  }

  private async sendReports(reports: ErrorReport[]): Promise<void> {
    // In a real application, this would send to your error reporting service
    // For demo purposes, we'll just log to console
    
    const endpoint = '/api/errors';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reports }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`Successfully sent ${reports.length} error reports`);
    } catch (error) {
      // Fallback: send to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('Error Reports');
        reports.forEach(report => {
          console.error('Error Report:', report);
        });
        console.groupEnd();
      }
      throw error;
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from your auth system
    return undefined;
  }

  private getSessionId(): string | undefined {
    // Get session ID from your session management
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sessionId') || undefined;
    }
    return undefined;
  }

  getQueueStatus(): { queueSize: number; isOnline: boolean } {
    return {
      queueSize: this.reportQueue.length,
      isOnline: this.isOnline,
    };
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENTS
// ============================================================================

const PageErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  retryCount,
  maxRetries,
  reportError,
  isReporting,
  reportSent,
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <CardTitle className="text-xl">Something went wrong</CardTitle>
        <CardDescription>
          We apologize for the inconvenience. The application encountered an unexpected error.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Bug className="w-4 h-4" />
          <AlertDescription className="font-mono text-sm">
            {error.name}: {error.message}
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={resetError}
            disabled={retryCount >= maxRetries}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryCount >= maxRetries ? 'Max retries reached' : 'Try again'}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to homepage
          </Button>
          
          <Button
            variant="ghost"
            onClick={reportError}
            disabled={isReporting || reportSent}
            className="w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {reportSent ? 'Report sent' : isReporting ? 'Sending...' : 'Report issue'}
          </Button>
        </div>
        
        {retryCount > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Retry attempt: {retryCount} / {maxRetries}
          </p>
        )}
      </CardContent>
    </Card>
  </div>
);

const SectionErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  retryCount,
  maxRetries,
  reportError,
  isReporting,
  reportSent,
}) => (
  <Card className="w-full border-destructive/20">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <CardTitle className="text-lg">Section unavailable</CardTitle>
      </div>
      <CardDescription>
        This section is temporarily unavailable due to an error.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <Alert variant="destructive">
        <AlertDescription className="font-mono text-xs">
          {error.message}
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={resetError}
          disabled={retryCount >= maxRetries}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Retry
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={reportError}
          disabled={isReporting || reportSent}
        >
          <Send className="w-3 h-3 mr-1" />
          {reportSent ? 'Reported' : 'Report'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ComponentErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  reportError,
  isReporting,
  reportSent,
}) => (
  <div className="p-3 border border-destructive/20 rounded-md bg-destructive/5">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium">Component error</span>
      </div>
      
      <div className="flex space-x-1">
        <Button size="sm" variant="ghost" onClick={resetError}>
          <RefreshCw className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={reportError}
          disabled={isReporting || reportSent}
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
    
    <p className="text-xs text-muted-foreground mt-1 font-mono">
      {error.message}
    </p>
  </div>
);

// ============================================================================
// MAIN ERROR BOUNDARY COMPONENT
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private errorReportingService: ErrorReportingService;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isReporting: false,
      reportSent: false,
    };

    this.errorReportingService = ErrorReportingService.getInstance();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
      errorId: `boundary_${Date.now()}`,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-report if enabled
    if (this.props.enableReporting !== false) {
      this.reportError();
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        prevProps.resetKeys?.[index] !== key
      );

      if (hasResetKeyChanged) {
        this.resetError();
      }
    }
  }

  resetError = (): void => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: retryCount + 1,
      isReporting: false,
      reportSent: false,
    });

    // Auto-reset after successful recovery
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({ retryCount: 0 });
    }, 60000); // Reset retry count after 1 minute
  };

  reportError = async (): Promise<void> => {
    const { error, errorInfo } = this.state;
    
    if (!error || !errorInfo || this.state.isReporting || this.state.reportSent) {
      return;
    }

    this.setState({ isReporting: true });

    try {
      const errorId = await this.errorReportingService.reportError(
        error,
        errorInfo,
        {
          boundaryLevel: this.props.level || 'component',
          retryCount: this.state.retryCount,
          props: this.props.isolateErrors ? undefined : this.props,
        }
      );

      this.setState({
        isReporting: false,
        reportSent: true,
        errorId,
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
      this.setState({ isReporting: false });
    }
  };

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo, retryCount, isReporting, reportSent } = this.state;
    const { children, fallback: CustomFallback, maxRetries = 3, level = 'component' } = this.props;

    if (hasError && error && errorInfo) {
      const errorFallbackProps: ErrorFallbackProps = {
        error,
        errorInfo,
        resetError: this.resetError,
        retryCount,
        maxRetries,
        reportError: this.reportError,
        isReporting,
        reportSent,
        level,
      };

      // Use custom fallback if provided
      if (CustomFallback) {
        return <CustomFallback {...errorFallbackProps} />;
      }

      // Use appropriate built-in fallback based on level
      switch (level) {
        case 'page':
          return <PageErrorFallback {...errorFallbackProps} />;
        case 'section':
          return <SectionErrorFallback {...errorFallbackProps} />;
        case 'component':
        default:
          return <ComponentErrorFallback {...errorFallbackProps} />;
      }
    }

    return children;
  }
}

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

export const PageErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="page" />
);

export const SectionErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="section" />
);

export const ComponentErrorBoundary: React.FC<Omit<ErrorBoundaryProps, 'level'>> = (props) => (
  <ErrorBoundary {...props} level="component" />
);

// ============================================================================
// HOOKS
// ============================================================================

export function useErrorHandler(): (error: Error, errorInfo?: Partial<ErrorInfo>) => void {
  const errorReportingService = ErrorReportingService.getInstance();

  return React.useCallback((error: Error, errorInfo?: Partial<ErrorInfo>) => {
    const fullErrorInfo: ErrorInfo = {
      componentStack: errorInfo?.componentStack || 'Unknown',
      errorBoundary: errorInfo?.errorBoundary,
      errorBoundaryStack: errorInfo?.errorBoundaryStack,
    };

    errorReportingService.reportError(error, fullErrorInfo, {
      triggeredBy: 'useErrorHandler',
      timestamp: new Date().toISOString(),
    });
  }, [errorReportingService]);
}

export function useAsyncErrorHandler(): (promise: Promise<any>) => void {
  const handleError = useErrorHandler();

  return React.useCallback((promise: Promise<any>) => {
    promise.catch((error) => {
      handleError(error, {
        componentStack: 'Async operation',
      });
    });
  }, [handleError]);
}

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return;

  const errorReportingService = ErrorReportingService.getInstance();

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = new Error(event.reason?.message || 'Unhandled Promise Rejection');
    const errorInfo: ErrorInfo = {
      componentStack: 'Promise rejection',
    };

    errorReportingService.reportError(error, errorInfo, {
      type: 'unhandledRejection',
      reason: event.reason,
    });

    // Prevent default console error
    event.preventDefault();
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    const errorInfo: ErrorInfo = {
      componentStack: `${event.filename}:${event.lineno}:${event.colno}`,
    };

    errorReportingService.reportError(error, errorInfo, {
      type: 'uncaughtError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
}

// Auto-setup in browser environment
if (typeof window !== 'undefined') {
  setupGlobalErrorHandling();
}