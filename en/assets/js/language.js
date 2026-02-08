// language.js
import { translations } from './i18n.js';

const DEFAULT_LANG = 'fr';

function getSavedLanguage() {
  return localStorage.getItem('siteLang') || DEFAULT_LANG;
}

function saveLanguage(lang) {
  localStorage.setItem('siteLang', lang);
}

// Applique la langue sur tous les éléments avec data-i18n
export function applyLanguage(lang) {
  const elems = document.querySelectorAll('[data-i18n]');
  elems.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang]?.[key];
    if (text !== undefined) {
      if (text.includes('{rating}')) {
        // Remplace {rating} par l'attribut data-rating si présent
        const rating = el.getAttribute('data-rating') || '';
        el.textContent = text.replace('{rating}', rating);
      } else {
        el.textContent = text;
      }
    }
  });
}

// Init langage au Loading
export function initLanguage() {
  let lang = getSavedLanguage();
  applyLanguage(lang);

  // Dropdown ou boutons pour changer de langue
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.value = lang;
    langSelect.addEventListener('change', e => {
      lang = e.target.value;
      saveLanguage(lang);
      applyLanguage(lang);
    });
  }

  // Si tu veux des boutons par langue
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      saveLanguage(selected);
      applyLanguage(selected);
      if (langSelect) langSelect.value = selected;
    });
  });
}

// Auto-init si tu inclus ce script à la fin du body
document.addEventListener('DOMContentLoaded', initLanguage);
