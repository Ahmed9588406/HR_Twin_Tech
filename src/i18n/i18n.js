import translations from './translations.js';

let currentLang = localStorage.getItem('i18nLang') || 'ar';
const subscribers = [];

// apply initial document direction
if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    try { localStorage.setItem('i18nLang', lang); } catch (e) {}
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
    subscribers.forEach(cb => cb(lang));

    // Dispatch a global event for any code listening on window (backwards compatibility)
    if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      } catch (e) {
        // ignore event dispatch errors
      }
    }
  }
}

export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const i = subscribers.indexOf(callback);
    if (i > -1) subscribers.splice(i, 1);
  };
}

export function t(key, params = {}) {
  const langData = translations[currentLang] || translations.en;
  let text = langData[key] || key;
  Object.keys(params).forEach(param => {
    text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
  });
  return text;
}
