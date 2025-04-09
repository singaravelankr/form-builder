import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded ${
                    i18n.language === 'en'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('de')}
                className={`px-2 py-1 rounded ${
                    i18n.language === 'de'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                DE
            </button>
        </div>
    );
};

export default LanguageSwitcher; 