import React from 'react';
import { Form } from '../types/form';
import { useTranslation } from 'react-i18next';

interface FormDetailsProps {
    form: Form;
    fieldErrors: { [key: string]: string };
    onUpdate: (updates: Partial<Form>) => void;
}

const FormDetails: React.FC<FormDetailsProps> = ({ form, fieldErrors, onUpdate }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        {t('form.details.formTitle')} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={form.title}
                        onChange={(e) => onUpdate({ ...form, title: e.target.value })}
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                            fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                        } focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                        placeholder={t('form.details.formTitlePlaceholder')}
                    />
                    {fieldErrors.title && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        {t('form.details.description')}
                    </label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => onUpdate({ ...form, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder={t('form.details.descriptionPlaceholder')}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormDetails; 