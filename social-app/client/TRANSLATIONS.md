# 🌍 Multilingual Support - Translation Guide

## Languages Supported
- 🇸🇰 **Slovak (SK)** - Default language
- 🇨🇿 **Czech (CZ)** - Full translation
- 🇬🇧 **English (EN)** - Full translation

## ✅ Completed Translations

### Core Components
- ✅ **Header** - App title, subtitle, navigation
- ✅ **LoginForm** - All form fields and validation
- ✅ **RegisterForm** - All form fields and validation
- ✅ **DashboardHome** - Welcome message, stats, quick actions
- ✅ **PendingRequests** - All text and buttons
- ✅ **ConnectionHistory** - All text and labels

### Translation Keys Structure

```
app
  ├── title
  └── subtitle

nav
  ├── home
  ├── leaderboard
  ├── verification
  └── game

auth
  ├── login, register, email, password, etc.
  └── validation (all error messages)

dashboard
  ├── welcome, subtitle
  ├── stats (interactions, points, level, rank)
  ├── quickActions
  └── progress

verification
  ├── title, subtitle
  ├── methods (qrCode, bluetooth, email)
  ├── pending (title, empty, confirm, reject)
  └── history (title, empty, meetings, points)

leaderboard
  ├── title
  ├── tabs
  └── stats

common
  ├── loading, error, success
  └── actions (cancel, save, close, etc.)
```

## 🔧 How to Add Translations to New Components

1. **Import the hook:**
```tsx
import { useTranslation } from 'react-i18next';
```

2. **Use in component:**
```tsx
const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('section.key')}</h1>;
};
```

3. **Add keys to all 3 language files:**
- `/src/i18n/locales/sk.json`
- `/src/i18n/locales/cs.json`
- `/src/i18n/locales/en.json`

## 📍 Language Switcher Location
Top-right corner of header, next to theme toggle (🌙/☀️)

## 🎯 Remaining Components to Translate
- VerificationHub main component
- QRCodeGenerator
- BluetoothProximity
- EmailVerification
- Leaderboard components
- Game components (if any)

## 💾 Language Persistence
Language preference is automatically saved to `localStorage` and restored on app reload.
