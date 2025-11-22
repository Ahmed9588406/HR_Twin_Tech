import translations from './translations';

const STORAGE_KEY = 'app_lang';
let current = localStorage.getItem(STORAGE_KEY) || 'en';
const subscribers = new Set();

export function getLang() {
  return current;
}

export function setLang(lang) {
  if (!translations[lang]) return;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  subscribers.forEach((cb) => {
    try { cb(current); } catch (e) { /* ignore */ }
  });
}

export function subscribe(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export function t(key, params = {}) {
  const dict = translations[current] || translations.en;
  let val = dict[key] ?? translations.en[key] ?? key;
  Object.keys(params).forEach(k => {
    val = val.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(params[k]));
  });
  return val;
}
