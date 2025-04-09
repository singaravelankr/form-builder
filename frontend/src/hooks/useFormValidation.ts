import { useState, useEffect } from 'react';
import { FormField } from '../types/form';
import { validateField } from '../utils/formValidation'; // Assuming validateField exists

type FormData = { [key: string]: string | string[] };
type Errors = { [key: string]: string };

export function useFormValidation(fields: FormField[], formData: FormData): Errors {
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        const newErrors: Errors = {};
        fields.forEach(field => {
            const value = formData[field.id] ?? ''; // Get value or default to empty string
            const error = validateField(field, value);
            if (error) {
                newErrors[field.id] = error;
            }
        });

        // Update errors only if they have actually changed to avoid infinite loops
        if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
             setErrors(newErrors);
        }
        // Dependencies: run whenever fields structure or form data changes
    }, [fields, formData, errors]); // Include errors in dependency array to compare against newErrors

    return errors;
} 