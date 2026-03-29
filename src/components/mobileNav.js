// Bottom Navigation + Top Bar – Mobile UI
import { store } from '../store.js';
import { router } from '../router.js';

const NAV_ITEMS = [
  {
    key: 'home', labelEn: 'Home', labelHi: 'होम',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>`,
  },
  {
    key: 'schemes', labelEn: 'Schemes', labelHi: 'योजनाएं',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 16h7M14 20h5"/>
    </svg>`,
  },
  {
    key: 'offices', labelEn: 'Offices', labelHi: 'कार्यालय',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="6" width="18" height="15" rx="1"/>
      <path d="M3 10h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"/>
    </svg>`,
  },
  {
    key: 'profile', labelEn: 'Profile', labelHi: 'प्रोफाइल',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>`,
  },
];

// All supported languages
const LANGS = [
  { code: 'hi', label: 'हि',   name: 'Hindi'     },
  { code: 'en', label: 'EN',   name: 'English'   },
  { code: 'mr', label: 'म',    name: 'Marathi'   },
  { code: 'gu', label: 'ગુ',   name: 'Gujarati'  },
  { code: 'pa', label: 'ਪੰ',   name: 'Punjabi'   },
  { code: 'ta', label: 'த',    name: 'Tamil'     },
  { code: 'te', label: 'తె',   name: 'Telugu'    },
];

export function renderBottomNav() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;

  if (!store.isLoggedIn()) {
    nav.classList.add('hidden');
    return;
  }

  nav.classList.remove('hidden');
  const current = router.getCurrentPage();
  const lang = store.state.language || 'en';

  // Find label by current language
  const getLabel = (item) => {
    if (lang === 'hi' || lang === 'mr' || lang === 'gu' || lang === 'pa' || lang === 'ta' || lang === 'te') {
      return store.t(item.key) || item.labelEn;
    }
    return item.labelEn;
  };

  nav.innerHTML = NAV_ITEMS.map(item => `
    <button class="bnav-item ${current === item.key ? 'active' : ''}"
            data-page="${item.key}"
            id="bnav-${item.key}"
            aria-label="${item.labelEn}">
      <span class="bnav-icon">${item.icon}</span>
      <span class="bnav-label">${getLabel(item)}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.bnav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      router.navigate(btn.dataset.page);
      updateBottomNav(btn.dataset.page);
    });
  });
}

export function updateBottomNav(page) {
  document.querySelectorAll('.bnav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}

export function renderTopBar({ showBack = false, backPage = 'home', title = '' } = {}) {
  const topbar = document.getElementById('mobile-topbar');
  if (!topbar) return;

  const lang = store.state.language || 'en';

  if (!store.isLoggedIn()) {
    // Auth pages — logo only
    topbar.innerHTML = `
      <div class="mobile-topbar">
        <div class="mobile-logo">
          <span class="logo-scheme">Scheme</span><span class="logo-setu">Setu</span>
        </div>
        <div style="width:36px"></div>
      </div>`;
    return;
  }

  if (showBack) {
    // Inner page with back button
    topbar.innerHTML = `
      <div class="mobile-topbar">
        <button class="inner-back-btn" id="topbar-back" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span class="inner-page-title">${title}</span>
        <div style="width:36px"></div>
      </div>`;
    document.getElementById('topbar-back')?.addEventListener('click', () => router.navigate(backPage));
    return;
  }

  // Home page — logo + scrollable language pills
  topbar.innerHTML = `
    <div class="mobile-topbar">
      <div class="mobile-logo">
        <span class="logo-scheme">Scheme</span><span class="logo-setu">Setu</span>
      </div>
      <div class="lang-toggle-strip" id="lang-strip" role="group" aria-label="Language selector">
        ${LANGS.map(l => `
          <button class="lang-btn-pill ${lang === l.code ? 'active' : ''}"
                  data-lang="${l.code}"
                  title="${l.name}"
                  id="topbar-lang-${l.code}">
            ${l.label}
          </button>
        `).join('')}
      </div>
    </div>`;

  document.querySelectorAll('#lang-strip .lang-btn-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      store.setLanguage(selectedLang);
      // Re-render top bar with new active state
      renderTopBar();
      renderBottomNav();
      // Re-render current page
      router.navigate(router.getCurrentPage());
    });
  });

  // Scroll active pill into view
  requestAnimationFrame(() => {
    const activeBtn = document.querySelector('#lang-strip .lang-btn-pill.active');
    activeBtn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });
}
