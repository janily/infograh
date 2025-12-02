/**
 * Utility functions for language detection and formatting
 */

/**
 * Maps language codes to readable language names
 * Only includes languages that are supported by the application
 * Based on LANGUAGE_OPTIONS in components/landing/Hero.tsx
 */
const LANGUAGE_MAP: Record<string, string> = {
  // Chinese variants
  zh: 'Chinese',
  'zh-CN': 'Chinese',
  'zh-TW': 'Chinese',
  'zh-HK': 'Chinese',
  // English variants
  en: 'English',
  'en-US': 'English',
  'en-GB': 'English',
  'en-CA': 'English',
  'en-AU': 'English',
  // Japanese
  ja: 'Japanese',
  'ja-JP': 'Japanese',
  // Korean
  ko: 'Korean',
  'ko-KR': 'Korean',
  // Spanish variants
  es: 'Spanish',
  'es-ES': 'Spanish',
  'es-MX': 'Spanish',
  'es-AR': 'Spanish',
  // French variants
  fr: 'French',
  'fr-FR': 'French',
  'fr-CA': 'French',
  // German variants
  de: 'German',
  'de-DE': 'German',
  'de-AT': 'German',
  'de-CH': 'German',
};

/**
 * Detects the user's browser language and returns a readable language name
 * Falls back to 'English' if the language cannot be detected or is not supported
 */
export function detectBrowserLanguage(): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'English';
  }

  // Get the browser language
  const browserLang =
    navigator.language || (navigator as any).userLanguage || 'en';

  // Try exact match first
  if (LANGUAGE_MAP[browserLang]) {
    return LANGUAGE_MAP[browserLang];
  }

  // Try matching just the language code (before the dash)
  const langCode = browserLang.split('-')[0];

  if (LANGUAGE_MAP[langCode]) {
    return LANGUAGE_MAP[langCode];
  }

  // Default to English if no match found
  return 'English';
}
