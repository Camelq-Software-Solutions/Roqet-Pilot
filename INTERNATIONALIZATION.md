# Internationalization (i18n) Setup

This document explains how to use the internationalization system in the ROQET driver app.

## Overview

The app supports four languages:
- English (en)
- Hindi (hi)
- Telugu (te)
- Tamil (ta)

## File Structure

```
src/
├── i18n/
│   ├── index.ts                 # Main i18n configuration
│   └── locales/
│       ├── en.json             # English translations
│       ├── hi.json             # Hindi translations
│       ├── te.json             # Telugu translations
│       └── ta.json             # Tamil translations
├── hooks/
│   └── useLocalization.ts      # Custom hook for translations
└── screens/
    └── auth/
        └── LanguageSelectionScreen.tsx  # Language selection UI
```

## Usage

### 1. Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.loading')}</Text>
  );
}
```

### 2. Using the Custom Hook

```tsx
import { useLocalization } from '../hooks/useLocalization';

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useLocalization();
  
  return (
    <View>
      <Text>{t('common.loading')}</Text>
      <Text>Current Language: {currentLanguage}</Text>
      <Button onPress={() => changeLanguage('hi')} title="Switch to Hindi" />
    </View>
  );
}
```

### 3. Language Selection

The app provides two ways to change language:

1. **Splash Screen**: Language button in the top-left corner
2. **Settings Screen**: Language option in the Preferences section

## Translation Keys Structure

Translations are organized by feature:

```json
{
  "common": {
    "skip": "Skip",
    "next": "Next",
    "loading": "Loading..."
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up",
    "welcomeBack": "Welcome Back"
  },
  "home": {
    "home": "Home",
    "whereTo": "Where to?"
  },
  "settings": {
    "language": "Language",
    "languageSubtitle": "Choose your preferred language"
  }
}
```

## Adding New Translations

### 1. Add to English file first

```json
// src/i18n/locales/en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. Add to other language files

```json
// src/i18n/locales/hi.json
{
  "newFeature": {
    "title": "नई सुविधा",
    "description": "यह एक नई सुविधा है"
  }
}
```

### 3. Use in component

```tsx
const { t } = useTranslation();
<Text>{t('newFeature.title')}</Text>
```

## Language Detection

The app automatically detects the user's preferred language:

1. **Saved Preference**: Checks for previously selected language
2. **Device Language**: Falls back to device language if supported
3. **Default**: Uses English as the final fallback

## Persistence

Language selection is automatically saved to AsyncStorage and persists across app restarts.

## Best Practices

1. **Always use translation keys**: Never hardcode text strings
2. **Use descriptive keys**: Make keys self-explanatory
3. **Group related translations**: Organize by feature/screen
4. **Test all languages**: Ensure translations fit in UI components
5. **Consider text length**: Some languages may have longer text

## Adding a New Language

1. Create a new locale file: `src/i18n/locales/[code].json`
2. Add the language to `getSupportedLanguages()` in `src/i18n/index.ts`
3. Translate all keys from the English file
4. Test the language selection

## Example: Adding Spanish

```typescript
// src/i18n/index.ts
export const getSupportedLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }, // New language
  ];
};
```

```json
// src/i18n/locales/es.json
{
  "common": {
    "skip": "Omitir",
    "next": "Siguiente",
    "loading": "Cargando..."
  }
  // ... rest of translations
}
```

## Troubleshooting

### Translation not showing
- Check if the key exists in all language files
- Verify the key path is correct
- Ensure i18n is initialized before using translations

### Language not changing
- Check if the language code is supported
- Verify AsyncStorage permissions
- Check console for errors

### Performance issues
- Use `useMemo` for expensive translation operations
- Avoid translating in render loops
- Consider lazy loading for large translation files
