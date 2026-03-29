// Notifications Component
import { store } from '../store.js';
import { detectLifeEvents } from '../ai/rag.js';
import { allSchemes } from '../data/schemes.js';

// ── In-memory notification store ─────────────────────────────────────────
let _notifications = [];
let _listeners = [];
let _initialized = false;

export function initNotifications() {
  if (_initialized) return;
  _initialized = true;

  // Seed initial notifications
  const user = store.state.user;
  if (!user) return;

  // Life event notifications
  const lifeEvents = detectLifeEvents(user);
  lifeEvents.forEach(event => {
    addNotification({ type: 'life_event', icon: event.icon, title: event.title, body: event.desc, priority: 'high' });
  });

  // Expiring schemes
  const expiring = allSchemes.filter(s => s.deadline && s.deadline !== 'Ongoing' && s.deadline !== 'Rolling' && s.deadline !== 'Seasonal');
  expiring.slice(0, 2).forEach(s => {
    addNotification({ type: 'expiry', icon: '⏰', title: `Scheme Deadline: ${s.name}`, body: `Apply before ${s.deadline} to avoid missing out.`, priority: 'medium' });
  });

  // Welcome notification
  addNotification({ type: 'welcome', icon: '👋', title: `Welcome back, ${user.nickname || user.name?.split(' ')[0]}!`, body: 'Your personalized scheme matches are ready. Visit the chatbot to explore.', priority: 'low' });

  updateBadge();
}

export function addNotification(notif) {
  const n = { id: Date.now() + Math.random(), timestamp: new Date(), read: false, ...notif };
  _notifications.unshift(n);
  updateBadge();
  _listeners.forEach(fn => fn([..._notifications]));
}

export function markAllRead() {
  _notifications = _notifications.map(n => ({ ...n, read: true }));
  updateBadge();
  _listeners.forEach(fn => fn([..._notifications]));
}

export function getUnreadCount() {
  return _notifications.filter(n => !n.read).length;
}

export function subscribe(fn) {
  _listeners.push(fn);
  return () => { _listeners = _listeners.filter(l => l !== fn); };
}

function updateBadge() {
  const badge = document.getElementById('notif-badge');
  const count = getUnreadCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ── Notification Drawer ──────────────────────────────────────────────────
export function openNotificationDrawer() {
  let drawer = document.getElementById('notif-drawer');
  if (drawer) { drawer.remove(); return; }

  markAllRead();
  updateBadge();

  drawer = document.createElement('div');
  drawer.id = 'notif-drawer';
  drawer.style.cssText = `
    position:fixed;top:0;right:0;width:360px;max-width:100vw;height:100vh;
    background:var(--bg-elevated);border-left:1px solid var(--glass-border);
    z-index:1001;display:flex;flex-direction:column;
    box-shadow:-8px 0 32px rgba(0,0,0,0.4);
    transform:translateX(100%);transition:transform 0.35s cubic-bezier(.34,1.56,.64,1);
  `;
  drawer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-5) var(--space-5) var(--space-4);border-bottom:1px solid var(--glass-border)">
      <div>
        <div style="font-family:var(--font-heading);font-weight:800;font-size:1rem">🔔 Notifications</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${_notifications.length} alerts</div>
      </div>
      <button id="notif-drawer-close" class="btn btn-ghost btn-sm">✕</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:var(--space-4)">
      ${_notifications.length === 0
        ? `<div style="text-align:center;padding:var(--space-10);color:var(--text-muted)">
            <div style="font-size:2.5rem;margin-bottom:8px">🔕</div>
            <div>No notifications yet</div>
          </div>`
        : _notifications.map(n => `
          <div style="
            padding:var(--space-4);border-radius:var(--radius-xl);
            background:${n.priority==='high'?'rgba(108,99,255,0.1)':n.priority==='medium'?'rgba(245,158,11,0.08)':'var(--glass-bg)'};
            border:1px solid ${n.priority==='high'?'rgba(108,99,255,0.25)':n.priority==='medium'?'rgba(245,158,11,0.2)':'var(--glass-border)'};
            margin-bottom:10px;animation:fadeInRight 0.3s ease;
          ">
            <div style="display:flex;align-items:flex-start;gap:10px">
              <div style="font-size:1.4rem;flex-shrink:0">${n.icon}</div>
              <div style="flex:1">
                <div style="font-weight:700;font-size:0.85rem;margin-bottom:3px">${n.title}</div>
                <div style="font-size:0.76rem;color:var(--text-secondary);line-height:1.5">${n.body}</div>
                <div style="font-size:0.65rem;color:var(--text-muted);margin-top:5px">${timeAgo(n.timestamp)}</div>
              </div>
              ${n.priority==='high'?`<div style="width:8px;height:8px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:4px;box-shadow:0 0 6px var(--primary)"></div>`:''}
            </div>
          </div>`).join('')}
    </div>
  `;
  document.body.appendChild(drawer);
  requestAnimationFrame(() => { drawer.style.transform = 'translateX(0)'; });

  document.getElementById('notif-drawer-close')?.addEventListener('click', () => {
    drawer.style.transform = 'translateX(100%)';
    setTimeout(() => drawer.remove(), 350);
  });

  // Click outside
  const backdrop = document.createElement('div');
  backdrop.style.cssText = 'position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.3)';
  backdrop.addEventListener('click', () => {
    drawer.style.transform = 'translateX(100%)';
    setTimeout(() => { drawer.remove(); backdrop.remove(); }, 350);
  });
  document.body.insertBefore(backdrop, drawer);
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(date).toLocaleDateString('en-IN');
}
