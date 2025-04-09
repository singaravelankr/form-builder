import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const baseNavClass = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const activeNavClass = "border-blue-500 text-gray-900";
  const inactiveNavClass = "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

  const baseAuthLinkClass = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLoginClass = "text-blue-600 font-semibold";
  const inactiveLoginClass = "text-gray-500 hover:text-gray-700";

  const baseRegisterButtonClass = "text-white px-4 py-2 rounded-md text-sm font-medium";
  const activeRegisterButtonClass = "bg-blue-700";
  const inactiveRegisterButtonClass = "bg-blue-500 hover:bg-blue-700";


  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/" className="text-xl font-bold text-gray-800">
              {t('menus.projectName')}
              </NavLink>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink
                  to="/forms"
                  end
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  {t('menus.forms')}
                </NavLink>
                <NavLink
                  to="/forms/new"
                  className={({ isActive }) =>
                    `${baseNavClass} ${isActive ? activeNavClass : inactiveNavClass}`
                  }
                >
                  {t('menus.createform')}
                </NavLink>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                <span className="text-gray-700">{t('menus.welcome')} {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('menus.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${baseAuthLinkClass} ${isActive ? activeLoginClass : inactiveLoginClass}`
                  }
                >
                  {t('menus.login')}
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${baseRegisterButtonClass} ${isActive ? activeRegisterButtonClass : inactiveRegisterButtonClass}`
                  }
                >
                  {t('menus.register')}
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 