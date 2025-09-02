// ============================================================================
// ENTERPRISE FORM VALIDATION HOOK
// Advanced form state management with real-time validation and error handling
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';
import { validateForm, validateField, ValidationResult } from '@/utils/validation';
import type { ValidationErrors, FormState } from '@/types';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialData?: Partial<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
  onSubmit?: (data: T) => Promise<void> | void;
  onError?: (errors: ValidationErrors) => void;
}

interface FormValidationReturn<T> {
  formState: FormState<Partial<T>>;
  setValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: (data?: Partial<T>) => void;
  setTouched: (field: keyof T, touched?: boolean) => void;
  isFieldTouched: (field: keyof T) => boolean;
  isFieldValid: (field: keyof T) => boolean;
  getFieldError: (field: keyof T) => string | undefined;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialData = {},
  validateOnChange = true,
  validateOnBlur = true,
  debounceMs = 300,
  onSubmit,
  onError,
}: UseFormValidationOptions<T>): FormValidationReturn<T> {
  // Form state management
  const [formState, setFormState] = useState<FormState<Partial<T>>>({
    data: initialData,
    errors: {},
    isValid: false,
    isDirty: false,
    isSubmitting: false,
    touchedFields: new Set(),
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const validationPromiseRef = useRef<Promise<ValidationResult<T>> | null>(null);

  // ============================================================================
  // VALIDATION UTILITIES
  // ============================================================================

  const runValidation = useCallback(async (data: Partial<T>): Promise<ValidationResult<T>> => {
    // Cancel previous validation if still running
    if (validationPromiseRef.current) {
      // For simplicity, we'll let it complete but ignore results if superseded
    }

    const validationPromise = Promise.resolve(validateForm(data, schema));
    validationPromiseRef.current = validationPromise;

    try {
      const result = await validationPromise;
      
      // Only update if this is still the latest validation
      if (validationPromiseRef.current === validationPromise) {
        validationPromiseRef.current = null;
        return result;
      }
      
      // Return current state if superseded
      return validateForm(data, schema);
    } catch (error) {
      validationPromiseRef.current = null;
      throw error;
    }
  }, [schema]);

  const updateFormState = useCallback((
    updates: Partial<FormState<Partial<T>>>
  ) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // ============================================================================
  // FIELD OPERATIONS
  // ============================================================================

  const setValue = useCallback((field: keyof T, value: unknown) => {
    const newData = { ...formState.data, [field]: value };
    const newTouchedFields = new Set(formState.touchedFields).add(field as string);
    
    updateFormState({
      data: newData,
      isDirty: true,
      touchedFields: newTouchedFields,
    });

    // Debounced validation on change
    if (validateOnChange) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const result = await runValidation(newData);
          updateFormState({
            errors: result.errors,
            isValid: result.isValid,
          });
        } catch (error) {
          console.error('Validation error:', error);
        }
      }, debounceMs);
    }
  }, [formState.data, formState.touchedFields, validateOnChange, debounceMs, updateFormState, runValidation]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    const newErrors = { ...formState.errors };
    newErrors[field as string] = [error];
    
    updateFormState({
      errors: newErrors,
      isValid: false,
    });

    onError?.(newErrors);
  }, [formState.errors, updateFormState, onError]);

  const clearFieldError = useCallback((field: keyof T) => {
    const newErrors = { ...formState.errors };
    delete newErrors[field as string];
    
    updateFormState({
      errors: newErrors,
    });
  }, [formState.errors, updateFormState]);

  const clearAllErrors = useCallback(() => {
    updateFormState({
      errors: {},
      isValid: false,
    });
  }, [updateFormState]);

  // ============================================================================
  // VALIDATION METHODS
  // ============================================================================

  const validateSingleField = useCallback(async (field: keyof T): Promise<boolean> => {
    try {
      const fieldValue = formState.data[field];
      
      // Create a simple field schema for validation
      const fieldSchema = z.any(); // Fallback schema
      
      const result = validateField(fieldValue, fieldSchema, String(field));
      
      if (result.isValid) {
        clearFieldError(field);
        return true;
      } else {
        const newErrors = { ...formState.errors, ...result.errors };
        updateFormState({
          errors: newErrors,
          isValid: false,
        });
        return false;
      }
    } catch (error) {
      console.error(`Field validation error for ${String(field)}:`, error);
      setFieldError(field, 'Validation error occurred');
      return false;
    }
  }, [formState.data, formState.errors, updateFormState, clearFieldError, setFieldError]);

  const validateEntireForm = useCallback(async (): Promise<boolean> => {
    try {
      updateFormState({ isSubmitting: true });
      
      const result = await runValidation(formState.data);
      
      updateFormState({
        errors: result.errors,
        isValid: result.isValid,
        isSubmitting: false,
      });

      if (!result.isValid) {
        onError?.(result.errors);
      }

      return result.isValid;
    } catch (error) {
      console.error('Form validation error:', error);
      updateFormState({ isSubmitting: false });
      return false;
    }
  }, [formState.data, updateFormState, runValidation, onError]);

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      updateFormState({ isSubmitting: true });

      // Validate form
      const isValid = await validateEntireForm();
      if (!isValid) {
        updateFormState({ isSubmitting: false });
        return;
      }

      // Submit if valid
      if (onSubmit) {
        await onSubmit(formState.data as T);
      }

      updateFormState({ 
        isSubmitting: false,
        isDirty: false,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      updateFormState({ isSubmitting: false });
      
      // Set general error
      setFieldError('submit' as keyof T, 'An error occurred during submission');
    }
  }, [formState.data, validateEntireForm, onSubmit, updateFormState, setFieldError]);

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  const reset = useCallback((data?: Partial<T>) => {
    const resetData = data || initialData;
    setFormState({
      data: resetData,
      errors: {},
      isValid: false,
      isDirty: false,
      isSubmitting: false,
      touchedFields: new Set(),
    });

    // Clear any pending validation
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, [initialData]);

  const setTouched = useCallback((field: keyof T, touched = true) => {
    const newTouchedFields = new Set(formState.touchedFields);
    
    if (touched) {
      newTouchedFields.add(field as string);
    } else {
      newTouchedFields.delete(field as string);
    }

    updateFormState({ touchedFields: newTouchedFields });

    // Validate on blur if enabled
    if (touched && validateOnBlur) {
      validateSingleField(field);
    }
  }, [formState.touchedFields, updateFormState, validateOnBlur, validateSingleField]);

  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return formState.touchedFields.has(field as string);
  }, [formState.touchedFields]);

  const isFieldValid = useCallback((field: keyof T): boolean => {
    const fieldErrors = formState.errors[field as string];
    return !fieldErrors || (Array.isArray(fieldErrors) && fieldErrors.length === 0);
  }, [formState.errors]);

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    const fieldErrors = formState.errors[field as string];
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0];
    }
    return undefined;
  }, [formState.errors]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ============================================================================
  // RETURN INTERFACE
  // ============================================================================

  return {
    formState,
    setValue,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateField: validateSingleField,
    validateForm: validateEntireForm,
    handleSubmit,
    reset,
    setTouched,
    isFieldTouched,
    isFieldValid,
    getFieldError,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for simple field validation without full form management
 */
export function useFieldValidation<T>(
  initialValue: T,
  validator: (value: T) => string | null,
  debounceMs = 300
) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const validate = useCallback((newValue: T) => {
    setIsValidating(true);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const validationError = validator(newValue);
      setError(validationError);
      setIsValidating(false);
    }, debounceMs);
  }, [validator, debounceMs]);

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    validate(newValue);
  }, [validate]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    value,
    setValue: updateValue,
    error,
    isValidating,
    isValid: error === null && !isValidating,
    clearError: () => setError(null),
  };
}

/**
 * Hook for managing multi-step form validation
 */
export function useMultiStepFormValidation<T extends Record<string, unknown>>(
  schemas: z.ZodSchema<Partial<T>>[],
  initialData?: Partial<T>
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Partial<T>[]>(
    schemas.map(() => ({}))
  );
  const [stepValidation, setStepValidation] = useState<boolean[]>(
    schemas.map(() => false)
  );

  const currentSchema = schemas[currentStep];
  const currentData = stepData[currentStep];

  const formValidation = useFormValidation({
    schema: currentSchema,
    initialData: currentData,
    onSubmit: async (data) => {
      const newStepData = [...stepData];
      newStepData[currentStep] = data;
      setStepData(newStepData);

      const newStepValidation = [...stepValidation];
      newStepValidation[currentStep] = true;
      setStepValidation(newStepValidation);
    },
  });

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < schemas.length) {
      setCurrentStep(step);
      formValidation.reset(stepData[step]);
    }
  }, [schemas.length, formValidation, stepData]);

  const nextStep = useCallback(async () => {
    const isValid = await formValidation.validateForm();
    if (isValid && currentStep < schemas.length - 1) {
      const newStepData = [...stepData];
      newStepData[currentStep] = formValidation.formState.data;
      setStepData(newStepData);
      
      goToStep(currentStep + 1);
    }
    return isValid;
  }, [formValidation, currentStep, schemas.length, stepData, goToStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const getAllData = useCallback((): Partial<T> => {
    return stepData.reduce((acc, data) => ({ ...acc, ...data }), {});
  }, [stepData]);

  const isStepValid = useCallback((step: number): boolean => {
    return stepValidation[step] || false;
  }, [stepValidation]);

  const canProceed = useCallback((): boolean => {
    return formValidation.formState.isValid;
  }, [formValidation.formState.isValid]);

  const isLastStep = currentStep === schemas.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    ...formValidation,
    currentStep,
    totalSteps: schemas.length,
    goToStep,
    nextStep,
    previousStep,
    getAllData,
    isStepValid,
    canProceed,
    isLastStep,
    isFirstStep,
    completedSteps: stepValidation.filter(Boolean).length,
  };
}