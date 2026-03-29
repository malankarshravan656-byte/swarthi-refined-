// Navbar Component – with Profile + Notifications links
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from './toast.js';
import { openNotificationDrawer, getUnreadCount, initNotifications } from './notifications.js';

const navItems = [
  { key: 'home',       icon: 'home',            label: 'home' },
  { key: 'map',        icon: 'map',             label: 'map' },
  { key: 'schemes',    icon: 'list',            label: 'schemes' },
  { key: 'chatbot',    icon: 'message-circle',  label: 'chatbot' },
  { key: 'roadmap',    icon: 'git-branch',      label: 'roadmap' },
  { key: 'offices',    icon: 'building-2',      label: 'offices' },
  { key: 'digilocker', icon: 'folder',          label: 'DigiLocker' },
];

export function renderNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  if (!store.isLoggedIn()) { navbar.classList.add('hidden'); return; }

  navbar.classList.remove('hidden');
  const user = store.state.user;
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const currentPage = router.getCurrentPage();
  const lang = store.state.language;
  const unread = getUnreadCount();

  navbar.innerHTML = `
    <a class="navbar-brand" href="#home" id="nav-brand">
      <div class="navbar-logo">🇮🇳</div>
      <span>${store.t('appName')}</span>
    </a>

    <nav class="navbar-nav" id="main-nav">
      ${navItems.map(item => `
        <a class="nav-link ${currentPage === item.key ? 'active' : ''}"
           href="#${item.key}"
           id="nav-${item.key}"
           data-page="${item.key}">
          <i data-lucide="${item.icon}"></i>
          <span>${store.t(item.label) || item.label}</span>
        </a>
      `).join('')}
    </nav>

    <div class="navbar-right">
      <!-- Language -->
      <div style="display:flex;gap:4px">
        ${['en','hi','mr'].map(l => `
          <button class="lang-btn ${lang===l?'active':''}" id="lang-${l}" data-lang="${l}"
            style="${lang===l?'background:rgba(108,99,255,0.2);border-color:var(--primary);color:var(--primary-light)':''}">
            ${l==='en'?'EN':l==='hi'?'हि':'म'}
          </button>
        `).join('')}
      </div>

      <!-- Notification bell -->
      <button id="notif-bell" title="Notifications" style="
        position:relative;width:38px;height:38px;border-radius:50%;
        background:var(--glass-bg);border:1px solid var(--glass-border);
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        transition:all 0.2s ease;font-size:1rem;
      ">
        🔔
        <div id="notif-badge" style="
          position:absolute;top:-3px;right:-3px;min-width:18px;height:18px;
          border-radius:9px;background:var(--accent);color:white;
          font-size:0.6rem;font-weight:800;display:${unread>0?'flex':'none'};
          align-items:center;justify-content:center;padding:0 4px;
          box-shadow:0 2px 6px rgba(255,107,107,0.5);
        ">${unread}</div>
      </button>

      <!-- Online status -->
      <div style="display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:var(--radius-full);background:var(--glass-bg);border:1px solid var(--glass-border)">
        <div class="offline-dot"></div>
        <span style="font-size:0.72rem;color:var(--success);font-weight:600">Online</span>
      </div>

      <!-- User avatar -->
      <div class="user-avatar" id="user-avatar-btn" title="${user?.name || 'User'}" style="cursor:pointer">${initials}</div>
    </div>

    <!-- User dropdown -->
    <div id="user-dropdown" class="hidden" style="
      position:absolute;top:72px;right:20px;
      background:var(--bg-elevated);border:1px solid var(--glass-border);
      border-radius:var(--radius-xl);padding:var(--space-4);min-width:210px;
      box-shadow:var(--shadow-lg);z-index:200;animation:fadeInDown 0.2s ease;
    ">
      <div style="display:flex;align-items:center;gap:var(--space-3);padding-bottom:var(--space-4);border-bottom:1px solid var(--glass-border);margin-bottom:var(--space-3)">
        <div class="user-avatar" style="width:44px;height:44px;font-size:1.05rem">${initials}</div>
        <div>
          <div style="font-weight:700;font-size:0.9rem">${user?.name || 'User'}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${user?.email || user?.state || ''}</div>
        </div>
      </div>
      <button id="nav-profile-btn" class="dropdown-item">
        <i data-lucide="user" style="width:15px;height:15px"></i> My Profile
      </button>
      <button id="nav-digilocker-btn" class="dropdown-item">
        <i data-lucide="folder" style="width:15px;height:15px"></i> DigiLocker
      </button>
      <div style="border-top:1px solid var(--glass-border);margin:var(--space-2) 0"></div>
      <button id="nav-logout-btn" class="dropdown-item" style="color:var(--accent)">
        <i data-lucide="log-out" style="width:15px;height:15px"></i> ${store.t('logout')}
      </button>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Nav link clicks
  navbar.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      router.navigate(link.dataset.page);
      updateActiveNav(link.dataset.page);
    });
  });

  // Language
  navbar.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      store.setLanguage(newLang);

      // Re-render navbar + current page first so DOM is fresh
      renderNavbar();
      router.navigate(router.getCurrentPage());

      // After full re-render, trigger robot wave animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const robotBody = document.getElementById('robot-body');
          if (robotBody) {
            robotBody.className = 'robot-body-inner';
            void robotBody.offsetWidth; // force reflow to restart animation
            robotBody.classList.add('mood-wave');

            const rightArm = document.getElementById('robot-arm-right');
            if (rightArm) {
              rightArm.style.animation = 'none';
              void rightArm.offsetWidth;
              rightArm.style.animation = 'robotArmWave 0.6s ease-in-out 3';
            }

            // Show speech bubble with translated message
            const bubble = document.getElementById('robot-bubble');
            if (bubble) {
              bubble.innerHTML = `<span>${store.t('langChanged')}</span>`;
              bubble.style.opacity = '1';
              bubble.style.transform = 'translateY(0) scale(1)';
              setTimeout(() => {
                bubble.style.opacity = '0';
                bubble.style.transform = 'translateY(6px) scale(0.96)';
              }, 2800);
            }

            // Return to float after wave completes
            setTimeout(() => {
              robotBody.className = 'robot-body-inner mood-float';
              if (rightArm) rightArm.style.animation = '';
            }, 1800);
          }
        });
      });

      showToast(store.t('langChanged') || 'Language changed', 'success', 2000);
    });
  });

  // Notification bell
  document.getElementById('notif-bell')?.addEventListener('click', e => {
    e.stopPropagation();
    openNotificationDrawer();
  });

  // Avatar / dropdown
  const avatarBtn = document.getElementById('user-avatar-btn');
  const dropdown = document.getElementById('user-dropdown');
  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', e => { e.stopPropagation(); dropdown.classList.toggle('hidden'); });
    document.addEventListener('click', () => dropdown.classList.add('hidden'));
  }

  // Dropdown items
  document.getElementById('nav-profile-btn')?.addEventListener('click', () => {
    dropdown.classList.add('hidden');
    router.navigate('profile');
  });
  document.getElementById('nav-digilocker-btn')?.addEventListener('click', () => {
    dropdown.classList.add('hidden');
    router.navigate('digilocker');
  });
  document.getElementById('nav-logout-btn')?.addEventListener('click', () => {
    store.logout();
    renderNavbar();
    router.navigate('login');
    showToast('Logged out successfully', 'info');
  });

  // Init notifications after user is set
  if (store.isLoggedIn()) setTimeout(initNotifications, 500);
}

export function updateActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}
