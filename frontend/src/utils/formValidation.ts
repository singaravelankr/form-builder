import { FormField } from '../types/form';

export interface ValidationErrors {
    [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
};

export const parseOptions = (optionsString: string | string[] | undefined): string[] => {
    if (!optionsString) return [];
    if (Array.isArray(optionsString)) return optionsString;
    return optionsString.split(',').map(opt => opt.trim());
};

export const validateField = (field: FormField, value: any): string => {
    // Check required fields
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        return `${field.label} is required`;
    }

    // If value exists, validate based on field type
    if (value) {
        switch (field.type) {
            case 'email':
                if (!validateEmail(value)) {
                    return 'Please enter a valid email address';
                }
                break;

            case 'phone':
                if (!validatePhone(value)) {
                    return 'Please enter a valid phone number (format: 123-456-7890)';
                }
                break;

            case 'select':
                const options = parseOptions(field.options);
                if (!options.includes(value)) {
                    return 'Please select a valid option';
                }
                break;

            case 'checkbox':
                if (field.required && (!Array.isArray(value) || value.length === 0)) {
                    return 'Please select at least one option';
                }
                break;

            // Add more field type validations as needed
        }
    }

    return '';
};

export const validateForm = (fields: FormField[], formData: { [key: string]: any }): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    fields.forEach(field => {
        const error = validateField(field, formData[field.id]);
        if (error) {
            errors[field.id] = error;
        }
    });

    return errors;
}; 