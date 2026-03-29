// SchemeSetu – Main Entry Point v3 (Mobile UI)
import './styles/index.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/cultural.css';
import './styles/mobile.css';

import { store } from './store.js';
import { router } from './router.js';
import { renderTopBar, renderBottomNav, updateBottomNav } from './components/mobileNav.js';

import { renderLogin }      from './pages/login.js';
import { renderSignup }     from './pages/signup.js';
import { renderHome }       from './pages/home.js';
import { renderMap }        from './pages/map.js';
import { renderSchemes }    from './pages/schemes.js';
import { renderChatbot }    from './pages/chatbot.js';
import { renderRoadmap }    from './pages/roadmap.js';
import { renderOffices }    from './pages/offices.js';
import { renderProfile }    from './pages/profile.js';
import { renderDigilocker } from './pages/digilocker.js';

// ─── Restore persisted user ─────────────────────────────────────────────────
store.restore();

// ─── Helper: render nav shell ────────────────────────────────────────────────
function navShell(page) {
  renderTopBar();
  renderBottomNav();
  updateBottomNav(page);
}

// ─── Register routes ─────────────────────────────────────────────────────────
router.register('login',  (outlet) => {
  renderTopBar({ showBack: false });
  document.getElementById('bottom-nav')?.classList.add('hidden');
  renderLogin(outlet);
});
router.register('signup', (outlet) => {
  renderTopBar({ showBack: true, backPage: 'login', title: 'Create Account' });
  document.getElementById('bottom-nav')?.classList.add('hidden');
  renderSignup(outlet);
});
router.register('home',       (outlet) => { navShell('home');       renderHome(outlet); });
router.register('map',        (outlet) => { navShell('map');        renderMap(outlet); });
router.register('schemes',    (outlet) => { navShell('schemes');    renderSchemes(outlet); });
router.register('chatbot',    (outlet) => { navShell('chatbot');    renderChatbot(outlet); });
router.register('roadmap',    (outlet) => { navShell('roadmap');    renderRoadmap(outlet); });
router.register('offices',    (outlet) => { navShell('offices');    renderOffices(outlet); });
router.register('profile',    (outlet) => { navShell('profile');    renderProfile(outlet); });
router.register('digilocker', (outlet) => { navShell('digilocker'); renderDigilocker(outlet); });

// ─── Lucide icon refresh ─────────────────────────────────────────────────────
const iconObserver = new MutationObserver(() => {
  if (window.lucide) window.lucide.createIcons();
});
iconObserver.observe(document.getElementById('page-outlet') || document.body, {
  childList: true, subtree: true,
});

// ─── Ripple effect ───────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.mobile-feature-card, .btn, .ripple-container');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// ─── Start router ────────────────────────────────────────────────────────────
router.init();
