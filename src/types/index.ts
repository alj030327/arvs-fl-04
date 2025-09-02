// ============================================================================
// ENTERPRISE TYPE DEFINITIONS
// Comprehensive type definitions for the Digital Estate Settlement Platform
// ============================================================================

// Core domain entities with enhanced type safety
export interface PersonalNumber {
  readonly value: string;
  readonly isValid: boolean;
}

export interface Person {
  readonly id: string;
  readonly personalNumber: PersonalNumber;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly dateOfBirth: Date;
  readonly dateOfDeath?: Date;
  readonly lastKnownAddress?: Address;
  readonly metadata?: Record<string, unknown>;
}

export interface Address {
  readonly street: string;
  readonly postalCode: string;
  readonly city: string;
  readonly country: string;
  readonly coordinates?: {
    readonly latitude: number;
    readonly longitude: number;
  };
}

export interface ContactInformation {
  readonly email: string;
  readonly phone: string;
  readonly address: Address;
  readonly preferredContactMethod: 'email' | 'sms' | 'both';
  readonly isVerified: boolean;
  readonly lastVerificationDate?: Date;
}

// Asset management with comprehensive type coverage
export interface Asset {
  readonly id: string;
  readonly type: AssetType;
  readonly subtype: string;
  readonly bank: string;
  readonly accountNumber: string;
  readonly amount: number;
  readonly currency: 'SEK' | 'EUR' | 'USD';
  readonly isDebt: boolean;
  readonly shouldRemain: boolean;
  readonly remainingAmount?: number;
  readonly reasonForRemaining?: string;
  readonly lastUpdated: Date;
  readonly metadata?: AssetMetadata;
}

export type AssetType = 
  | 'checking'
  | 'savings'
  | 'investment'
  | 'pension'
  | 'insurance'
  | 'real-estate'
  | 'business'
  | 'debt'
  | 'other';

export interface AssetMetadata {
  readonly institution?: string;
  readonly product?: string;
  readonly interestRate?: number;
  readonly maturityDate?: Date;
  readonly riskLevel?: 'low' | 'medium' | 'high';
  readonly isLiquid?: boolean;
}

export interface PhysicalAsset {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly estimatedValue: number;
  readonly category: PhysicalAssetCategory;
  readonly location?: string;
  readonly assignedTo?: string;
  readonly appraisalDate?: Date;
  readonly appraisalValue?: number;
  readonly images?: string[];
}

export type PhysicalAssetCategory = 
  | 'real-estate'
  | 'vehicles'
  | 'jewelry'
  | 'art'
  | 'furniture'
  | 'electronics'
  | 'collectibles'
  | 'other';

// Inheritance and beneficiary management
export interface Beneficiary {
  readonly id: string;
  readonly person: Person;
  readonly contactInfo: ContactInformation;
  readonly relationshipToDeceased: Relationship;
  readonly inheritanceShare: number;
  readonly specificAssetAllocations: AssetAllocation[];
  readonly assetPreferences: AssetPreferences;
  readonly assetNotApplicable: AssetNotApplicable;
  readonly signingStatus: SigningStatus;
  readonly documents: DocumentReference[];
}

export type Relationship = 
  | 'spouse'
  | 'child'
  | 'parent'
  | 'sibling'
  | 'grandchild'
  | 'other-relative'
  | 'non-relative';

export interface AssetAllocation {
  readonly assetId: string;
  readonly beneficiaryId: string;
  readonly percentage: number;
  readonly specificAmount?: number;
  readonly conditions?: string[];
}

export interface AssetPreferences {
  readonly warrants?: 'transfer' | 'sell';
  readonly certificates?: 'transfer' | 'sell';
  readonly options?: 'transfer' | 'sell';
  readonly futures?: 'transfer' | 'sell';
}

export interface AssetNotApplicable {
  readonly warrants?: boolean;
  readonly certificates?: boolean;
  readonly options?: boolean;
  readonly futures?: boolean;
}

// Document and testament management
export interface Testament {
  readonly id: string;
  readonly fileName: string;
  readonly fileSize: number;
  readonly uploadDate: Date;
  readonly documentType: DocumentType;
  readonly isValid: boolean;
  readonly validationDate?: Date;
  readonly extractedContent?: TestamentContent;
  readonly hash: string;
}

export interface TestamentContent {
  readonly beneficiaries: TestamentBeneficiary[];
  readonly specificBequests: SpecificBequest[];
  readonly executors: string[];
  readonly conditions: string[];
  readonly lastWillDate: Date;
}

export interface TestamentBeneficiary {
  readonly name: string;
  readonly personalNumber?: string;
  readonly share: number;
  readonly conditions?: string[];
}

export interface SpecificBequest {
  readonly description: string;
  readonly beneficiary: string;
  readonly value?: number;
}

export type DocumentType = 
  | 'will'
  | 'testament'
  | 'power-of-attorney'
  | 'marriage-certificate'
  | 'birth-certificate'
  | 'death-certificate'
  | 'other';

export interface DocumentReference {
  readonly id: string;
  readonly type: DocumentType;
  readonly name: string;
  readonly url: string;
  readonly createdDate: Date;
  readonly isSigningRequired: boolean;
  readonly signingDeadline?: Date;
}

// Signing and authentication
export interface SigningStatus {
  readonly isSigned: boolean;
  readonly signedDate?: Date;
  readonly bankIdTransactionId?: string;
  readonly method: 'bankid' | 'manual' | 'representative';
  readonly attempts: SigningAttempt[];
  readonly isExpired: boolean;
  readonly expirationDate: Date;
}

export interface SigningAttempt {
  readonly timestamp: Date;
  readonly method: string;
  readonly success: boolean;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly ipAddress: string;
  readonly userAgent: string;
}

// Estate settlement process management
export interface EstateSettlement {
  readonly id: string;
  readonly deceased: Person;
  readonly representative: Person;
  readonly beneficiaries: Beneficiary[];
  readonly assets: Asset[];
  readonly physicalAssets: PhysicalAsset[];
  readonly testament?: Testament;
  readonly currentStep: SettlementStep;
  readonly status: SettlementStatus;
  readonly timeline: SettlementEvent[];
  readonly totalValue: number;
  readonly totalDebts: number;
  readonly netValue: number;
  readonly createdDate: Date;
  readonly lastModified: Date;
  readonly completionDate?: Date;
  readonly legalValidation?: LegalValidation;
}

export type SettlementStep = 
  | 'identification'
  | 'assets'
  | 'distribution'
  | 'contact'
  | 'signing'
  | 'completion';

export type SettlementStatus = 
  | 'draft'
  | 'in-progress'
  | 'pending-signatures'
  | 'completed'
  | 'cancelled'
  | 'suspended';

export interface SettlementEvent {
  readonly id: string;
  readonly type: EventType;
  readonly timestamp: Date;
  readonly actor: string;
  readonly description: string;
  readonly data?: Record<string, unknown>;
}

export type EventType = 
  | 'created'
  | 'updated'
  | 'signed'
  | 'document-uploaded'
  | 'asset-added'
  | 'beneficiary-added'
  | 'validation-completed'
  | 'submitted'
  | 'completed';

export interface LegalValidation {
  readonly isValid: boolean;
  readonly validationDate: Date;
  readonly validator: string;
  readonly issues: ValidationIssue[];
  readonly recommendations: string[];
}

export interface ValidationIssue {
  readonly severity: 'error' | 'warning' | 'info';
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly suggestion?: string;
}

// UI and form state management
export interface FormState<T = unknown> {
  readonly data: T;
  readonly errors: ValidationErrors;
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly isSubmitting: boolean;
  readonly touchedFields: Set<string>;
}

export interface ValidationErrors {
  readonly [field: string]: string[] | ValidationErrors;
}

// API and service layer types
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
  readonly metadata?: ApiMetadata;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
  readonly requestId: string;
}

export interface ApiMetadata {
  readonly requestId: string;
  readonly timestamp: Date;
  readonly version: string;
  readonly processingTime: number;
}

// Integration types
export interface IntegrationConfig {
  readonly enabled: boolean;
  readonly environment: 'test' | 'staging' | 'production';
  readonly apiKey?: string;
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retryAttempts: number;
}

export interface BankIntegration {
  readonly bankId: string;
  readonly name: string;
  readonly bic: string;
  readonly supportsOpenBanking: boolean;
  readonly supportedAccountTypes: string[];
  readonly apiVersion: string;
  readonly connectionStatus: 'connected' | 'disconnected' | 'error';
}

// Security and audit
export interface AuditLog {
  readonly id: string;
  readonly userId: string;
  readonly action: string;
  readonly resource: string;
  readonly timestamp: Date;
  readonly ipAddress: string;
  readonly userAgent: string;
  readonly success: boolean;
  readonly changes?: Record<string, unknown>;
}

export interface SecurityContext {
  readonly userId: string;
  readonly sessionId: string;
  readonly permissions: Permission[];
  readonly ipAddress: string;
  readonly lastActivity: Date;
  readonly mfaEnabled: boolean;
  readonly riskScore: number;
}

export interface Permission {
  readonly resource: string;
  readonly action: 'read' | 'write' | 'delete' | 'admin';
  readonly conditions?: Record<string, unknown>;
}

// Performance and monitoring
export interface PerformanceMetrics {
  readonly loadTime: number;
  readonly renderTime: number;
  readonly apiResponseTime: number;
  readonly errorRate: number;
  readonly userSatisfactionScore: number;
  readonly timestamp: Date;
}

export interface HealthCheck {
  readonly service: string;
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly lastCheck: Date;
  readonly responseTime: number;
  readonly uptime: number;
  readonly version: string;
}

// Utility types for enhanced type safety
export type NonEmptyArray<T> = [T, ...T[]];
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Brand types for primitive values
export type Email = string & { readonly __brand: 'Email' };
export type PhoneNumber = string & { readonly __brand: 'PhoneNumber' };
export type AccountNumber = string & { readonly __brand: 'AccountNumber' };
export type BIC = string & { readonly __brand: 'BIC' };
export type IBAN = string & { readonly __brand: 'IBAN' };

// Result type for error handling
export type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// Event system types
export interface DomainEvent {
  readonly id: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly version: number;
  readonly timestamp: Date;
  readonly payload: Record<string, unknown>;
  readonly metadata?: Record<string, unknown>;
}

export interface EventHandler<T extends DomainEvent = DomainEvent> {
  readonly eventType: string;
  handle(event: T): Promise<void>;
}

// Configuration and environment
export interface AppConfig {
  readonly environment: 'development' | 'staging' | 'production';
  readonly version: string;
  readonly apiBaseUrl: string;
  readonly features: FeatureFlags;
  readonly integrations: IntegrationConfigs;
  readonly security: SecurityConfig;
  readonly monitoring: MonitoringConfig;
}

export interface FeatureFlags {
  readonly autoAssetImport: boolean;
  readonly bankidSigning: boolean;
  readonly multiLanguage: boolean;
  readonly advancedValidation: boolean;
  readonly aiAssistance: boolean;
  readonly realTimeUpdates: boolean;
}

export interface IntegrationConfigs {
  readonly skatteverket: IntegrationConfig;
  readonly bankid: IntegrationConfig;
  readonly openBanking: IntegrationConfig;
  readonly notifications: IntegrationConfig;
}

export interface SecurityConfig {
  readonly sessionTimeout: number;
  readonly maxLoginAttempts: number;
  readonly passwordPolicy: PasswordPolicy;
  readonly encryptionAlgorithm: string;
  readonly auditingEnabled: boolean;
}

export interface PasswordPolicy {
  readonly minLength: number;
  readonly requireUppercase: boolean;
  readonly requireLowercase: boolean;
  readonly requireNumbers: boolean;
  readonly requireSpecialChars: boolean;
  readonly maxAge: number;
}

export interface MonitoringConfig {
  readonly enabled: boolean;
  readonly sampleRate: number;
  readonly errorReporting: boolean;
  readonly performanceMonitoring: boolean;
  readonly userAnalytics: boolean;
}