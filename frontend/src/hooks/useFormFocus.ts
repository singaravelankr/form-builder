import { useEffect, useRef } from 'react';

interface UseFormFocusOptions {
    /**
     * Whether to focus the first field on mount
     * @default true
     */
    focusOnMount?: boolean;
    /**
     * Whether to focus the first error field after validation
     * @default true
     */
    focusOnError?: boolean;
    /**
     * Custom selector for finding the first field
     * @default 'input:not([type="hidden"]), select, textarea'
     */
    firstFieldSelector?: string;
}

/**
 * A React hook that handles form field focusing
 * 
 * @param formRef - Ref to the form element
 * @param errors - Object containing field errors (optional)
 * @param options - Configuration options
 * 
 * @example
 * // Basic usage
 * function MyForm() {
 *   const formRef = useRef<HTMLFormElement>(null);
 *   useFormFocus(formRef);
 *   return <form ref={formRef}>...</form>;
 * }
 * 
 * @example
 * // With React Hook Form
 * function MyForm() {
 *   const formRef = useRef<HTMLFormElement>(null);
 *   const { register, formState: { errors } } = useForm();
 *   useFormFocus(formRef, errors);
 *   return <form ref={formRef}>...</form>;
 * }
 */
export function useFormFocus(
    formRef: React.RefObject<HTMLFormElement>,
    errors?: Record<string, any>,
    options: UseFormFocusOptions = {}
) {
    const {
        focusOnMount = true,
        focusOnError = true,
        firstFieldSelector = 'input:not([type="hidden"]), select, textarea'
    } = options;

    const isFirstRender = useRef(true);

    // Focus first field on mount
    useEffect(() => {
        if (focusOnMount && isFirstRender.current && formRef.current) {
            const firstField = formRef.current.querySelector(firstFieldSelector) as HTMLElement;
            if (firstField) {
                firstField.focus();
            }
        }
        isFirstRender.current = false;
    }, [focusOnMount, firstFieldSelector]);

    // Focus first error field when errors change
    useEffect(() => {
        if (focusOnError && errors && formRef.current) {
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const field = formRef.current.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                if (field) {
                    field.focus();
                }
            }
        }
    }, [errors, focusOnError]);
}

/**
 * A utility function to focus the first field in a form
 * 
 * @param form - The form element
 * @param selector - Custom selector for finding the first field
 * @returns The focused element or null if no field was found
 * 
 * @example
 * // Focus first field in a form
 * const form = document.querySelector('form');
 * focusFirstField(form);
 */
export function focusFirstField(
    form: HTMLFormElement,
    selector: string = 'input:not([type="hidden"]), select, textarea'
): HTMLElement | null {
    const firstField = form.querySelector(selector) as HTMLElement;
    if (firstField) {
        firstField.focus();
    }
    return firstField;
}

/**
 * A utility function to focus the first field with an error
 * 
 * @param form - The form element
 * @param errors - Object containing field errors
 * @returns The focused element or null if no error field was found
 * 
 * @example
 * // Focus first error field
 * const form = document.querySelector('form');
 * const errors = { email: 'Invalid email' };
 * focusFirstErrorField(form, errors);
 */
export function focusFirstErrorField(
    form: HTMLFormElement,
    errors: Record<string, any>
): HTMLElement | null {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
        const field = form.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        if (field) {
            field.focus();
        }
        return field;
    }
    return null;
} 