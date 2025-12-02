/**
 * Utility functions for language detection and formatting
 */

/**
 * Maps language codes to readable language names
 */
const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  'en-US': 'English',
  'en-GB': 'English',
  zh: 'Chinese',
  'zh-CN': 'Chinese',
  'zh-TW': 'Chinese',
  es: 'Spanish',
  'es-ES': 'Spanish',
  'es-MX': 'Spanish',
  fr: 'French',
  'fr-FR': 'French',
  de: 'German',
  'de-DE': 'German',
  ja: 'Japanese',
  'ja-JP': 'Japanese',
  ko: 'Korean',
  'ko-KR': 'Korean',
  pt: 'Portuguese',
  'pt-BR': 'Portuguese',
  'pt-PT': 'Portuguese',
  ru: 'Russian',
  'ru-RU': 'Russian',
  it: 'Italian',
  'it-IT': 'Italian',
  ar: 'Arabic',
  'ar-SA': 'Arabic',
  hi: 'Hindi',
  'hi-IN': 'Hindi',
  th: 'Thai',
  'th-TH': 'Thai',
  vi: 'Vietnamese',
  'vi-VN': 'Vietnamese',
  id: 'Indonesian',
  'id-ID': 'Indonesian',
  tr: 'Turkish',
  'tr-TR': 'Turkish',
  pl: 'Polish',
  'pl-PL': 'Polish',
  nl: 'Dutch',
  'nl-NL': 'Dutch',
  sv: 'Swedish',
  'sv-SE': 'Swedish',
  da: 'Danish',
  'da-DK': 'Danish',
  fi: 'Finnish',
  'fi-FI': 'Finnish',
  no: 'Norwegian',
  'nb-NO': 'Norwegian',
  cs: 'Czech',
  'cs-CZ': 'Czech',
  el: 'Greek',
  'el-GR': 'Greek',
  he: 'Hebrew',
  'he-IL': 'Hebrew',
  hu: 'Hungarian',
  'hu-HU': 'Hungarian',
  ro: 'Romanian',
  'ro-RO': 'Romanian',
  uk: 'Ukrainian',
  'uk-UA': 'Ukrainian',
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
