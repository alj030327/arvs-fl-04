// ============================================================================
// ENTERPRISE VALIDATION UTILITIES
// Comprehensive validation system with type safety and internationalization
// ============================================================================

import { z } from 'zod';
import type { PersonalNumber, Email, PhoneNumber, AccountNumber, ValidationErrors } from '@/types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Personal number validation (Swedish personnummer)
export const personalNumberSchema = z.string()
  .regex(/^\d{8}-\d{4}$/, 'Invalid format. Use YYYYMMDD-XXXX')
  .refine((value) => {
    const [date, checkDigits] = value.split('-');
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6));
    const day = parseInt(date.substring(6, 8));
    
    // Basic date validation
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Luhn algorithm for check digits
    const digits = (date + checkDigits.substring(0, 3)).split('').map(Number);
    const checksum = digits.reduce((sum, digit, index) => {
      const multiplier = index % 2 === 0 ? 2 : 1;
      const product = digit * multiplier;
      return sum + (product > 9 ? product - 9 : product);
    }, 0);
    
    return (10 - (checksum % 10)) % 10 === parseInt(checkDigits.charAt(3));
  }, 'Invalid personal number');

// Email validation with enhanced rules
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must not exceed 254 characters')
  .refine((email) => {
    // Additional security checks
    const [local, domain] = email.split('@');
    if (!local || !domain) return false;
    if (local.length > 64) return false;
    if (domain.includes('..')) return false;
    return true;
  }, 'Invalid email structure');

// Phone number validation (Swedish format)
export const phoneSchema = z.string()
  .regex(/^(\+46|0)[1-9]\d{8,9}$/, 'Invalid Swedish phone number format')
  .transform((phone) => phone.replace(/\s+/g, ''));

// Account number validation (Swedish bank accounts)
export const accountNumberSchema = z.string()
  .min(4, 'Account number too short')
  .max(20, 'Account number too long')
  .regex(/^[\d\s-]+$/, 'Account number can only contain digits, spaces, and hyphens')
  .transform((account) => account.replace(/[\s-]/g, ''));

// Amount validation
export const amountSchema = z.number()
  .min(0, 'Amount cannot be negative')
  .max(999999999, 'Amount too large')
  .finite('Amount must be a valid number');

// Percentage validation
export const percentageSchema = z.number()
  .min(0, 'Percentage cannot be negative')
  .max(100, 'Percentage cannot exceed 100')
  .finite('Percentage must be a valid number');

// ============================================================================
// COMPLEX VALIDATION SCHEMAS
// ============================================================================

export const personSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .regex(/^[a-zA-ZåäöÅÄÖ\s-']+$/, 'Invalid characters in name'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-ZåäöÅÄÖ\s-']+$/, 'Invalid characters in name'),
  
  personalNumber: personalNumberSchema,
});

export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  address: z.object({
    street: z.string().min(1, 'Street address is required').max(100),
    postalCode: z.string().regex(/^\d{3}\s?\d{2}$/, 'Invalid postal code format'),
    city: z.string().min(1, 'City is required').max(50),
    country: z.string().min(2, 'Country code required').max(3),
  }),
  preferredContactMethod: z.enum(['email', 'sms', 'both']),
});

export const assetSchema = z.object({
  bank: z.string().min(1, 'Bank is required'),
  accountType: z.string().min(1, 'Account type is required'),
  assetType: z.string().min(1, 'Asset type is required'),
  accountNumber: accountNumberSchema,
  amount: amountSchema,
  isDebt: z.boolean(),
  shouldRemain: z.boolean(),
  remainingAmount: z.number().optional(),
  reasonForRemaining: z.string().optional(),
}).refine((data) => {
  if (data.shouldRemain && data.remainingAmount === undefined) {
    return false;
  }
  if (data.remainingAmount !== undefined && data.remainingAmount > data.amount) {
    return false;
  }
  return true;
}, {
  message: "Remaining amount cannot exceed total amount",
  path: ["remainingAmount"],
});

export const beneficiarySchema = z.object({
  person: personSchema,
  contactInfo: contactInfoSchema,
  relationshipToDeceased: z.enum([
    'spouse', 'child', 'parent', 'sibling', 
    'grandchild', 'other-relative', 'non-relative'
  ]),
  inheritanceShare: percentageSchema,
});

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export class ValidationError extends Error {
  constructor(
    public readonly field: string,
    public readonly code: string,
    message: string,
    public readonly value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ValidationResult<T> {
  constructor(
    public readonly isValid: boolean,
    public readonly data?: T,
    public readonly errors: ValidationErrors = {}
  ) {}

  static success<T>(data: T): ValidationResult<T> {
    return new ValidationResult(true, data);
  }

  static failure<T>(errors: ValidationErrors): ValidationResult<T> {
    return new ValidationResult(false, undefined, errors);
  }

  map<U>(fn: (data: T) => U): ValidationResult<U> {
    if (this.isValid && this.data !== undefined) {
      return ValidationResult.success(fn(this.data));
    }
    return ValidationResult.failure(this.errors);
  }

  flatMap<U>(fn: (data: T) => ValidationResult<U>): ValidationResult<U> {
    if (this.isValid && this.data !== undefined) {
      return fn(this.data);
    }
    return ValidationResult.failure(this.errors);
  }
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validatePersonalNumber(value: string): PersonalNumber {
  const result = personalNumberSchema.safeParse(value);
  return {
    value,
    isValid: result.success,
  } as PersonalNumber;
}

export function validateEmail(value: string): Email | null {
  const result = emailSchema.safeParse(value);
  return result.success ? (value as Email) : null;
}

export function validatePhoneNumber(value: string): PhoneNumber | null {
  const result = phoneSchema.safeParse(value);
  return result.success ? (result.data as PhoneNumber) : null;
}

export function validateAccountNumber(value: string): AccountNumber | null {
  const result = accountNumberSchema.safeParse(value);
  return result.success ? (result.data as AccountNumber) : null;
}

// ============================================================================
// FORM VALIDATION HELPERS
// ============================================================================

export function validateForm<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return ValidationResult.success(result.data);
  }
  
  const errors: ValidationErrors = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    (errors[path] as string[]).push(error.message);
  });
  
  return ValidationResult.failure(errors);
}

export function validateField<T>(
  value: unknown,
  schema: z.ZodSchema<T>,
  fieldName: string
): ValidationResult<T> {
  try {
    const result = schema.parse(value);
    return ValidationResult.success(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {
        [fieldName]: error.errors.map(e => e.message)
      };
      return ValidationResult.failure(errors);
    }
    throw error;
  }
}

// ============================================================================
// BUSINESS RULE VALIDATORS
// ============================================================================

export function validateInheritanceDistribution(
  beneficiaries: Array<{ inheritanceShare: number }>
): ValidationResult<void> {
  const totalPercentage = beneficiaries.reduce(
    (sum, b) => sum + b.inheritanceShare, 
    0
  );
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    return ValidationResult.failure({
      totalPercentage: ['Total inheritance distribution must equal 100%']
    });
  }
  
  return ValidationResult.success(undefined);
}

export function validateAssetDistribution(
  assets: Array<{ amount: number; shouldRemain: boolean; remainingAmount?: number }>,
  beneficiaries: Array<{ inheritanceShare: number }>
): ValidationResult<void> {
  const totalAssets = assets.reduce((sum, asset) => {
    const distributableAmount = asset.shouldRemain && asset.remainingAmount !== undefined
      ? asset.amount - asset.remainingAmount
      : asset.amount;
    return sum + distributableAmount;
  }, 0);
  
  if (totalAssets <= 0) {
    return ValidationResult.failure({
      assets: ['No distributable assets found']
    });
  }
  
  const totalShares = beneficiaries.reduce(
    (sum, b) => sum + b.inheritanceShare, 
    0
  );
  
  if (Math.abs(totalShares - 100) > 0.01) {
    return ValidationResult.failure({
      distribution: ['Beneficiary shares must total 100%']
    });
  }
  
  return ValidationResult.success(undefined);
}

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, maxLength)
    .replace(/[<>\"'&]/g, ''); // Remove potentially dangerous characters
}

export function sanitizeNumericInput(input: string): number | null {
  const cleaned = input.replace(/[^\d.,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Convert Swedish domestic format to international
  if (cleaned.startsWith('0')) {
    return '+46' + cleaned.substring(1);
  }
  
  // Ensure international prefix
  if (!cleaned.startsWith('+')) {
    return '+46' + cleaned;
  }
  
  return cleaned;
}

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): ValidationResult<T> => {
    return validateForm(data, schema);
  };
}

// ============================================================================
// ASYNC VALIDATION SUPPORT
// ============================================================================

export async function validateAsync<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  asyncValidators: Array<(data: T) => Promise<ValidationErrors | null>> = []
): Promise<ValidationResult<T>> {
  // First run synchronous validation
  const syncResult = validateForm(data, schema);
  if (!syncResult.isValid || !syncResult.data) {
    return syncResult;
  }
  
  // Then run async validators
  const asyncErrors: ValidationErrors = {};
  for (const validator of asyncValidators) {
    const errors = await validator(syncResult.data);
    if (errors) {
      Object.assign(asyncErrors, errors);
    }
  }
  
  if (Object.keys(asyncErrors).length > 0) {
    return ValidationResult.failure({
      ...syncResult.errors,
      ...asyncErrors
    });
  }
  
  return syncResult;
}

// ============================================================================
// VALIDATION ERROR FORMATTING
// ============================================================================

export function formatValidationErrors(errors: ValidationErrors): Record<string, string> {
  const formatted: Record<string, string> = {};
  
  function processErrors(errors: ValidationErrors, prefix = ''): void {
    Object.entries(errors).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (Array.isArray(value)) {
        formatted[fullKey] = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        processErrors(value as ValidationErrors, fullKey);
      }
    });
  }
  
  processErrors(errors);
  return formatted;
}

export function getFirstError(errors: ValidationErrors): string | null {
  function findFirstError(errors: ValidationErrors): string | null {
    for (const [, value] of Object.entries(errors)) {
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      } else if (typeof value === 'object' && value !== null) {
        const nested = findFirstError(value as ValidationErrors);
        if (nested) return nested;
      }
    }
    return null;
  }
  
  return findFirstError(errors);
}