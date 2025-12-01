import translations from './translations';

let currentLang = localStorage.getItem('i18nLang') || 'en';
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach(callback => {
    try {
      callback(currentLang);
    } catch (error) {
      console.error('Error notifying i18n subscriber:', error);
    }
  });
};

export const getLang = () => currentLang;

export const setLang = (lang) => {
  if (lang !== currentLang && (lang === 'en' || lang === 'ar')) {
    currentLang = lang;
    localStorage.setItem('i18nLang', lang);
    notifySubscribers();
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
  }
};

export const subscribe = (callback) => {
  if (typeof callback === 'function') {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }
  return () => {};
};

export const t = (key, params = {}) => {
  const langData = translations[currentLang] || translations.en || {};
  let text = langData[key] || key; // Fallback to key if not found

  // Replace placeholders like {{n}} or {{count}}
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      const placeholder = `{{${paramKey}}}`;
      text = text.replace(new RegExp(placeholder, 'g'), params[paramKey]);
    });
  }

  return text;
};
