import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import i18n from "i18next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeHtmlEntities(text: string) {
  if (!text) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.documentElement.textContent || '';
}

export function getTranslatedValue(
  translations: Record<string, string> | string | null | undefined,
  fallback: string = ""
): string {
  if (!translations) return fallback;
  
  if (typeof translations === "string") {
    return translations;
  }
  
  const currentLang = i18n.language || "fr";
  return translations[currentLang] || translations["fr"] || fallback;
}
