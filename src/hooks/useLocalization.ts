import { useTranslation } from 'react-i18next';
import { getCurrentLanguage, changeLanguage, getSupportedLanguages } from '../i18n';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    getSupportedLanguages,
    isRTL: i18n.dir() === 'rtl',
  };
};
