import en from './languages/en.json';
import fr from './languages/fr.json';

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

const languages: Record<string, TranslationTree> = {
  en: en as TranslationTree,
  fr: fr as TranslationTree,
};

function resolve(tree: TranslationTree, key: string): string | undefined {
  let current: string | TranslationTree | undefined = tree;
  for (const segment of key.split('.')) {
    if (typeof current === 'string' || current === undefined) return undefined;
    current = current[segment];
  }
  return typeof current === 'string' ? current : undefined;
}

export function normalizeLanguage(language?: string): 'fr' | 'en' {
  return language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

export function localize(key: string, language?: string, variables: Record<string, string | number> = {}): string {
  const selected = normalizeLanguage(language);
  const value = resolve(languages[selected], key) ?? resolve(languages.fr, key) ?? resolve(languages.en, key) ?? key;
  return Object.entries(variables).reduce(
    (translated, [name, replacement]) => translated.replaceAll(`{${name}}`, String(replacement)),
    value,
  );
}
