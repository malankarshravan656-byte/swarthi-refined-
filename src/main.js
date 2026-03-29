// SchemeSetu – Main Entry Point v2
import './styles/index.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/pages.css';

import { store } from './store.js';
import { router } from './router.js';
import { renderNavbar } from './components/navbar.js';
import { initRobot } from './components/robot.js';

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

// ─── Restore persisted user ────────────────────────────────────────────────
store.restore();

// ─── Register routes ───────────────────────────────────────────────────────
router.register('login',      renderLogin);
router.register('signup',     renderSignup);
router.register('home',       (outlet) => { renderNavbar(); renderHome(outlet); });
router.register('map',        (outlet) => { renderNavbar(); renderMap(outlet); });
router.register('schemes',    (outlet) => { renderNavbar(); renderSchemes(outlet); });
router.register('chatbot',    (outlet) => { renderNavbar(); renderChatbot(outlet); });
router.register('roadmap',    (outlet) => { renderNavbar(); renderRoadmap(outlet); });
router.register('offices',    (outlet) => { renderNavbar(); renderOffices(outlet); });
router.register('profile',    (outlet) => { renderNavbar(); renderProfile(outlet); });
router.register('digilocker', (outlet) => { renderNavbar(); renderDigilocker(outlet); });

// ─── Init robot ─────────────────────────────────────────────────────────────
initRobot();

// ─── Background particles ───────────────────────────────────────────────────
initParticles();

// ─── Start router ───────────────────────────────────────────────────────────
router.init();

// ─── Ripple effect ──────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .quick-action-card, .ripple-container');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  const size = Math.max(rect.width, rect.height);
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// ─── Lucide icon refresh ──────────────────────────────────────────────────
const iconObserver = new MutationObserver(() => { if (window.lucide) window.lucide.createIcons(); });
iconObserver.observe(document.getElementById('page-outlet') || document.body, { childList: true, subtree: true });

// ─── Floating particles ───────────────────────────────────────────────────
function initParticles() {
  const wrap = document.createElement('div');
  wrap.className = 'particles-wrap';
  document.body.appendChild(wrap);
  const colors = ['rgba(108,99,255,','rgba(255,107,107,','rgba(78,204,163,','rgba(255,153,51,'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = (Math.random() * 0.25 + 0.08).toFixed(2);
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      background:${color}${opacity});
      animation:particleFloat ${4+Math.random()*6}s ease-in-out ${Math.random()*4}s infinite;
    `;
    wrap.appendChild(p);
  }
}
