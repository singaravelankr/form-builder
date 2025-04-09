import React, { useState, useEffect, useRef } from 'react';
import { Form, FormField } from '../types/form';
import FormDetails from './FormDetails';
import FormFields from './FormFields';
import FormActions from './FormActions';
import FormPreview from './FormPreview';
import Notification from './Notification';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { useFormFocus } from '../hooks/useFormFocus';
import { useNavigate } from 'react-router-dom';

interface FormEditorProps {
    formId?: number;
}

const FormEditor: React.FC<FormEditorProps> = ({ formId }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form, setForm] = useState<Form>({
        title: '',
        description: '',
        fields: [],
        is_published: false,
    });
    const [loading, setLoading] = useState(!!formId);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (formId) {
            fetchForm();
        }
    }, [formId]);

    useFormFocus(formRef, undefined, {
        focusOnMount: true,
        focusOnError: true,
        firstFieldSelector: 'input[type="text"]' // Only focus text inputs
    });

    const fetchForm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORMS.GET(formId?.toString() || '')}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(t('form.notifications.error', { message: 'Failed to fetch form' }));
            }
            const data = await response.json();
            setForm(data);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error', { message: 'An error occurred' }));
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.MouseEvent, shouldPublish: boolean = false) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setNotification(null);
        
        try {
            // Frontend validation
            const newFieldErrors: { [key: string]: string } = {};
            
            if (!form.title.trim()) {
                newFieldErrors['title'] = t('form.validation.titleRequired');
                setFieldErrors(newFieldErrors);
                return;
            }

            if (!form.fields || form.fields.length === 0) {
                setError(t('form.validation.addField'));
                return;
            }

            // Validate each field
            let hasErrors = false;

            form.fields.forEach((field, index) => {
                if (!field.label.trim()) {
                    newFieldErrors[`${field.id}-label`] = t('form.validation.labelRequired');
                    hasErrors = true;
                }
                if (!field.type) {
                    newFieldErrors[`${field.id}-type`] = t('form.validation.typeRequired');
                    hasErrors = true;
                }

                if (['select', 'checkbox', 'radio'].includes(field.type) && (!field.options || field.options.length === 0 || field.options.every(opt => !opt.trim()))) {
                    newFieldErrors[`${field.id}-options`] = t('form.validation.optionsRequired', { type: field.type });
                    hasErrors = true;
                }
            });

            if (hasErrors) {
                setFieldErrors(newFieldErrors);
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formData = {
                ...form,
                is_published: shouldPublish
            };

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORMS.CREATE}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error(t('form.notifications.error', { message: 'Failed to save form' }));
            }

            const data = await response.json();
            
            // Show success notification
            setNotification({
                message: shouldPublish 
                    ? t('form.notifications.publishSuccess') 
                    : t('form.notifications.saveSuccess'),
                type: 'success'
            });

            // Scroll to top to show notification
            window.scrollTo(0, 0);

            // Wait for notification to be visible before redirecting
            setTimeout(() => {
                // Redirect to the forms list page
                navigate('/forms');
            }, 1500);

        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error', { message: 'An error occurred' }));
            setNotification({
                message: err instanceof Error ? err.message : t('common.error', { message: 'An error occurred' }),
                type: 'error'
            });
        }
    };

    const addField = () => {
        const newField: FormField = {
            id: Date.now().toString(),
            type: 'text',
            label: '',
            required: false,
        };
        setForm({
            ...form,
            fields: [...form.fields, newField],
        });
    };

    const updateField = (index: number, field: Partial<FormField>) => {
        const updatedFields = [...form.fields];
        updatedFields[index] = { ...updatedFields[index], ...field };
        setForm({ ...form, fields: updatedFields });
    };

    const removeField = (index: number) => {
        const updatedFields = form.fields.filter((_, i) => i !== index);
        setForm({ ...form, fields: updatedFields });
    };

    const handleFormUpdate = (updates: Partial<Form>) => {
        setForm(prev => ({ ...prev, ...updates }));
    };

    if (loading) return <div className="text-center">{t('common.loading')}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-5">
            <div className="max-w-7xl mx-auto px-4">
                {/* Notification */}
                {notification && (
                    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm sm:max-w-md md:max-w-lg">
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            onClose={() => setNotification(null)}
                        />
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm px-8 py-3 mb-3">
                    <div className="flex justify-between items-center">
                        <h1 className="text-1xl font-bold text-gray-900">
                            {formId ? t('form.edit') : t('form.create')}
                        </h1>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {t('common.back')}
                        </button>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg" role="alert">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Form Editor */}
                    <div>
                        <form ref={formRef} className="space-y-6">
                            <FormDetails
                                form={form}
                                fieldErrors={fieldErrors}
                                onUpdate={handleFormUpdate}
                            />
                            <FormFields
                                form={form}
                                fieldErrors={fieldErrors}
                                error={error}
                                onAddField={addField}
                                onUpdateField={updateField}
                                onRemoveField={removeField}
                            />
                            <FormActions
                                onCancel={() => window.history.back()}
                                onSaveDraft={(e) => handleSubmit(e, false)}
                                onPublish={(e) => handleSubmit(e, true)}
                            />
                        </form>
                    </div>

                    {/* Right Column - Form Preview */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">{t('form.preview')}</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {t('form.livePreview')}
                                </span>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 bg-gray-50">
                                <FormPreview form={form} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditor; 