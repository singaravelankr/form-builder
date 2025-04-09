import React, { useState } from 'react';
import { Form, FormField } from '../types/form';
import { useTranslation } from 'react-i18next';
import { useFormValidation } from '../hooks/useFormValidation';

interface FormPreviewProps {
    form: Form;
    readOnly?: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, readOnly = false }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<{ [key: string]: string | string[] }>({});
    const errors = useFormValidation(form.fields, formData);

    const handleInputChange = (fieldId: string, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
        setFormData(prev => {
            const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] as string[] : [];
            const newValues = checked
                ? [...currentValues, option]
                : currentValues.filter(v => v !== option);
            return {
                ...prev,
                [fieldId]: newValues
            };
        });
    };

    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.id,
            name: field.id,
            value: formData[field.id] || '',
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
                handleInputChange(field.id, e.target.value),
            disabled: readOnly,
            className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors[field.id] ? 'border-red-500' : ''
            }`,
            'aria-invalid': errors[field.id] ? 'true' as const : 'false' as const,
            'aria-describedby': errors[field.id] ? `${field.id}-error` : undefined
        };

        switch (field.type) {
            case 'text':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="text"
                            {...commonProps}
                            placeholder={t('field.placeholderPlaceholder')}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            {...commonProps}
                            rows={4}
                            placeholder={t('field.placeholderPlaceholder')}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select {...commonProps}>
                            <option key="default" value="">{t('field.selectType')}</option>
                            {field.options?.map((option, index) => (
                                <option key={`${field.id}-option-${index}`} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.id} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="mt-2 space-y-2">
                            {field.options?.map((option, index) => (
                                <div key={`${field.id}-checkbox-${index}`} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`${field.id}-${option}`}
                                        name={field.id}
                                        value={option}
                                        checked={Array.isArray(formData[field.id]) && (formData[field.id] as string[]).includes(option)}
                                        onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                                        disabled={readOnly}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`${field.id}-${option}`} className="ml-2 block text-sm text-gray-900">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'radio':
                return (
                    <div key={field.id} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="mt-2 space-y-2">
                            {field.options?.map((option, index) => (
                                <div key={`${field.id}-radio-${index}`} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`${field.id}-${option}`}
                                        name={field.id}
                                        value={option}
                                        checked={formData[field.id] === option}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                        disabled={readOnly}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor={`${field.id}-${option}`} className="ml-2 block text-sm text-gray-900">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'date':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="date"
                            {...commonProps}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'email':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="email"
                            {...commonProps}
                            placeholder={t('field.placeholderPlaceholder')}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'password':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="password"
                            {...commonProps}
                            placeholder={t('field.placeholderPlaceholder')}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            case 'phone':
                return (
                    <div key={field.id} className="mb-4">
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type="tel"
                            {...commonProps}
                            placeholder={t('field.placeholderPlaceholder')}
                        />
                        {errors[field.id] && (
                            <p className="mt-1 text-sm text-red-600" id={`${field.id}-error`}>
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
                {form.description && (
                    <p className="text-gray-600">{form.description}</p>
                )}
            </div>
            <div className="space-y-4">
                {form.fields.map(field => renderField(field))}
            </div>
        </div>
    );
};

export default FormPreview; 