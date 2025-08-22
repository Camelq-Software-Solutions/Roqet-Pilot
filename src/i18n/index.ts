import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

// Import language resources
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  ta: { translation: ta },
};

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      console.log('🌐 Language detector - Starting detection...');
      const savedLanguage = await AsyncStorage.getItem('user-language');
      console.log('🌐 Language detector - Saved language:', savedLanguage);
      
      if (savedLanguage) {
        console.log('🌐 Language detector - Using saved language:', savedLanguage);
        return callback(savedLanguage);
      }
      
      // Fallback to device language
      const deviceLanguage = Localization.locale.split('-')[0];
      console.log('🌐 Language detector - Device language:', deviceLanguage);
      const supportedLanguages = ['en', 'hi', 'te', 'ta'];
      
      if (supportedLanguages.includes(deviceLanguage)) {
        console.log('🌐 Language detector - Using device language:', deviceLanguage);
        return callback(deviceLanguage);
      }
      
      // Default to English
      console.log('🌐 Language detector - Using default language: en');
      return callback('en');
    } catch (error) {
      console.error('❌ Language detector - Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('user-language', lng);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: __DEV__,
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  }).then(() => {
    console.log('🌐 i18n initialized successfully');
    console.log('🌐 Current language:', i18n.language);
    console.log('🌐 Available languages:', Object.keys(resources));
  }).catch((error) => {
    console.error('❌ i18n initialization failed:', error);
  });

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = () => {
  return i18n.language;
};

export const getSupportedLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  ];
};

export default i18n; 
