import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormActionsProps {
    onCancel: () => void;
    onSaveDraft: (e: React.MouseEvent) => Promise<void>;
    onPublish: (e: React.MouseEvent) => Promise<void>;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel, onSaveDraft, onPublish }) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveDraft = async (e: React.MouseEvent) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSaveDraft(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async (e: React.MouseEvent) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onPublish(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t('common.cancel')}
                </button>
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t('common.saving') : t('form.actions.saveDraft')}
                </button>
                <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? t('common.publishing') : t('form.actions.publish')}
                </button>
            </div>
        </div>
    );
};

export default FormActions; 