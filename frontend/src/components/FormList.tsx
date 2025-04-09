import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '../types/form';
import FormPreview from './FormPreview';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface PaginatedResponse {
    data: Form[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const FormList: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0
    });

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORMS.LIST}`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            
            if (!response.ok) {
                throw new Error(t('form.notifications.error', { message: 'Failed to fetch forms' }));
            }
            
            const data: PaginatedResponse = await response.json();
            setForms(data.data);
            setPagination({
                currentPage: data.current_page,
                lastPage: data.last_page,
                perPage: data.per_page,
                total: data.total
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : t('common.error', { message: 'An error occurred' }));
            console.error('Error fetching forms:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormClick = (form: Form) => {
        console.log('Clicked form:', form);
        console.log('Form fields:', form.fields);
        setSelectedForm(form);
        setIsPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
        setSelectedForm(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(t('form.actions.deleteConfirm'))) {
            try {
                await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                    credentials: 'include',
                });

                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FORMS.DELETE(id.toString())}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                if (!response.ok) {
                    throw new Error(t('form.notifications.error', { message: 'Failed to delete form' }));
                }
                setForms(forms.filter(form => form.id !== id));
            } catch (err) {
                setError(err instanceof Error ? err.message : t('common.error', { message: 'An error occurred' }));
            }
        }
    };

    if (loading) return <div className="text-center">{t('common.loading')}</div>;
    if (error) return <div className="text-red-500 text-center">{t('common.error', { message: error })}</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm px-8 py-3 mb-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-1xl font-bold mb-2">{t('form.list')}</h1>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                    <div key={form.id} className="bg-white rounded-lg shadow-md p-6">
                        <h2 
                            className="text-xl font-semibold mb-2 cursor-pointer text-blue-600 hover:text-blue-800"
                            onClick={() => {
                                setSelectedForm(form);
                                setIsPreviewOpen(true);
                            }}
                        >
                            {form.title}
                        </h2>
                        {form.description && (
                            <p className="text-gray-600 mb-4">{form.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                            {form.is_published ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {t('form.published')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {t('form.draft')}
                                </span>
                            )}
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleDelete(form.id!)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {forms.length === 0 ? (
                    <div className="flex items-center justify-center col-span-3">
                        <div className="text-center py-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 max-w-md w-full">
                            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('form.formsempty')}</h3>
                            <p className="mt-1 text-sm text-gray-500">{t('form.firstform')}</p>
                            <button
                                type="button"
                                onClick={() => navigate('/forms/new')}
                                className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                {t('form.create')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 max-w-md w-full">
                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('form.addanotherform')}</h3>
                        <button
                            type="button"
                            onClick={() => navigate('/forms/new')}
                            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {t('form.create')}
                        </button>
                    </div>
                )}
                
            </div>

            {/* Preview Modal */}
            {isPreviewOpen && selectedForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleClosePreview}></div>
                        </div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {selectedForm.title}
                                    </h3>
                                    <button
                                        type="button"
                                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={handleClosePreview}
                                    >
                                        <span className="sr-only">{t('common.close')}</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <FormPreview form={selectedForm} readOnly={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormList; 