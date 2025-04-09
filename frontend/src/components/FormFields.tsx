import React from 'react';
import { Form, FormField } from '../types/form';
import { useTranslation } from 'react-i18next';

interface FormFieldsProps {
    form: Form;
    fieldErrors: { [key: string]: string };
    error: string | null;
    onAddField: () => void;
    onUpdateField: (index: number, field: Partial<FormField>) => void;
    onRemoveField: (index: number) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({
    form,
    fieldErrors,
    error,
    onAddField,
    onUpdateField,
    onRemoveField,
}) => {
    const { t } = useTranslation();

    const fieldTypes = [
        { value: 'text', label: t('field.types.text') },
        { value: 'textarea', label: t('field.types.textarea') },
        { value: 'select', label: t('field.types.select') },
        { value: 'checkbox', label: t('field.types.checkbox') },
        { value: 'radio', label: t('field.types.radio') },
        { value: 'date', label: t('field.types.date') },
        { value: 'email', label: t('field.types.email') },
        { value: 'password', label: t('field.types.password') },
        { value: 'phone', label: t('field.types.phone') },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {!form.fields.length && error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg" role="alert">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                {form.fields.length === 0 ? (
                    <div className="text-center py-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('form.fields.noFields')}</h3>
                        <p className="mt-1 text-sm text-gray-500">{t('form.fields.getStarted')}</p>
                        <button
                            type="button"
                            onClick={onAddField}
                            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t('form.fields.addFirstField')}
                        </button>
                    </div>
                ) : (
                    <>
                        {form.fields.map((field, index) => (
                            <div key={field.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('field.type')}</label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => onUpdateField(index, { type: e.target.value })}
                                                className={`w-full px-4 py-2 rounded-lg border ${fieldErrors[`${field.id}-type`] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="text">{t('field.types.text')}</option>
                                                <option value="email">{t('field.types.email')}</option>
                                                <option value="phone">{t('field.types.phone')}</option>
                                                <option value="password">{t('field.types.password')}</option>
                                                <option value="date">{t('field.types.date')}</option>
                                                <option value="textarea">{t('field.types.textarea')}</option>
                                                <option value="select">{t('field.types.select')}</option>
                                                <option value="checkbox">{t('field.types.checkbox')}</option>
                                                <option value="radio">{t('field.types.radio')}</option>
                                            </select>
                                            {fieldErrors[`${field.id}-type`] && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors[`${field.id}-type`]}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('field.label')}</label>
                                            <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) => onUpdateField(index, { label: e.target.value })}
                                                className={`w-full px-4 py-2 rounded-lg border ${fieldErrors[`${field.id}-label`] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder={t('field.labelPlaceholder')}
                                            />
                                            {fieldErrors[`${field.id}-label`] && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors[`${field.id}-label`]}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => onUpdateField(index, { required: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{t('field.required')}</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveField(index)}
                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm text-red-600 hover:bg-red-100 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            {t('field.delete')}
                                        </button>
                                    </div>
                                    {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('field.options')}</label>
                                            <input
                                                type="text"
                                                value={field.options?.join(',') || ''}
                                                onChange={(e) => onUpdateField(index, { 
                                                    options: e.target.value.split(',').map(opt => opt.trim())
                                                })}
                                                className={`w-full px-4 py-2 rounded-lg border ${fieldErrors[`${field.id}-options`] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder={t('field.optionsPlaceholder')}
                                            />
                                            {fieldErrors[`${field.id}-options`] && (
                                                <p className="mt-1 text-sm text-red-600">{fieldErrors[`${field.id}-options`]}</p>
                                            )}
                                            <p className="mt-1 text-sm text-gray-500">{t('field.optionsHelp')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={onAddField}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t('field.addField')}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormFields; 