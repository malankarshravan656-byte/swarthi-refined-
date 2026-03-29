// Profile Page
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';
import { retrieveSchemes, detectLifeEvents } from '../ai/rag.js';

export function renderProfile(outlet) {
  const user = store.state.user || {};
  const lang = store.state.language || 'en';

  // Compute real eligible schemes count
  const matches = retrieveSchemes(user, 10);
  const eligibleCount = matches.filter(s => s.eligibilityScore >= 60).length;
  const topScore = matches[0]?.eligibilityScore || 0;
  const lifeEvents = detectLifeEvents(user);

  const initials = (user.name || 'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  outlet.innerHTML = `
    <div class="mobile-inner-page">
      <div class="mobile-page-header">
        <div class="page-title">${store.t('profile') || 'My Profile'}</div>
        <div class="page-subtitle">${user.state || ''} · ${user.occupation || 'Citizen'}</div>
      </div>
      <div class="container" style="max-width:100%">

        <!-- Hero card -->
        <div style="
          background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-2xl);
          padding:var(--space-7);margin-bottom:var(--space-6);
          background:linear-gradient(135deg,rgba(108,99,255,0.12),rgba(78,204,163,0.06));
          position:relative;overflow:hidden;
        " class="anim-fade-in-up">
          <div style="position:absolute;top:-30px;right:-30px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(108,99,255,0.2),transparent);pointer-events:none"></div>
          <div style="display:flex;align-items:center;gap:var(--space-5);flex-wrap:wrap">
            <!-- Avatar -->
            <div style="
              width:80px;height:80px;border-radius:50%;
              background:var(--grad-primary);
              display:flex;align-items:center;justify-content:center;
              font-family:var(--font-heading);font-size:1.8rem;font-weight:900;color:white;
              box-shadow:0 8px 24px rgba(108,99,255,0.4);flex-shrink:0;
              border:3px solid rgba(255,255,255,0.15);
            ">${initials}</div>
            <div style="flex:1">
              <div style="font-family:var(--font-heading);font-size:1.6rem;font-weight:800">${user.name || 'User'}</div>
              ${user.nickname && user.nickname !== user.name ? `<div style="font-size:0.85rem;color:var(--primary-light);font-weight:600">@${user.nickname}</div>` : ''}
              <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px">📍 ${user.city||''}${user.city&&user.state?', ':''}${user.state||''}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary btn-sm" id="edit-profile-btn">✏️ Edit Profile</button>
              <button class="btn btn-ghost btn-sm" id="logout-btn">🚪 Logout</button>
            </div>
          </div>

          <!-- Stats row -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-6)">
            <div style="text-align:center;padding:var(--space-4);background:rgba(255,255,255,0.04);border-radius:var(--radius-xl);border:1px solid var(--glass-border)">
              <div class="grad-text" style="font-size:1.8rem;font-weight:900;font-family:var(--font-heading)">${eligibleCount}</div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">Eligible Schemes</div>
            </div>
            <div style="text-align:center;padding:var(--space-4);background:rgba(255,255,255,0.04);border-radius:var(--radius-xl);border:1px solid var(--glass-border)">
              <div style="font-size:1.8rem;font-weight:900;font-family:var(--font-heading);color:var(--success)">${topScore}%</div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">Top Match Score</div>
            </div>
            <div style="text-align:center;padding:var(--space-4);background:rgba(255,255,255,0.04);border-radius:var(--radius-xl);border:1px solid var(--glass-border)">
              <div style="font-size:1.8rem;font-weight:900;font-family:var(--font-heading);color:#f59e0b">${store.state.roadmapStep || 0}</div>
              <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">Applications</div>
            </div>
          </div>
        </div>

        <!-- Life Events -->
        ${lifeEvents.length ? `
        <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-2xl);padding:var(--space-5);margin-bottom:var(--space-5)" class="anim-fade-in-up delay-100">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:var(--space-4)">🧠 AI Life Event Alerts</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${lifeEvents.map(e=>`
              <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;background:rgba(108,99,255,0.08);border-radius:var(--radius-xl);border:1px solid rgba(108,99,255,0.2)">
                <div style="font-size:1.5rem;flex-shrink:0">${e.icon}</div>
                <div style="flex:1">
                  <div style="font-weight:700;font-size:0.88rem;color:var(--primary-light)">${e.title}</div>
                  <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:3px;line-height:1.5">${e.desc}</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.location.hash='chatbot'" style="font-size:0.7rem;flex-shrink:0">Explore</button>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <!-- Profile details -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5)">
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-2xl);padding:var(--space-5)" class="anim-fade-in-up delay-200">
            <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:var(--space-4)">👤 Personal Details</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${[
                ['Age', user.age ? `${user.age} years` : null],
                ['Gender', user.gender],
                ['Phone', user.phone],
                ['Email', user.email],
                ['DOB', user.dob],
              ].filter(([,v])=>v).map(([k,v])=>`
                <div style="display:flex;justify-content:space-between;font-size:0.82rem">
                  <span style="color:var(--text-muted)">${k}</span>
                  <span style="font-weight:600;color:var(--text-secondary)">${v}</span>
                </div>`).join('')}
            </div>
          </div>
          <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-2xl);padding:var(--space-5)" class="anim-fade-in-up delay-300">
            <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:var(--space-4)">💼 Scheme Profile</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${[
                ['Occupation', user.occupation],
                ['Income', user.income],
                ['Category', user.category || 'General'],
                ['Education', user.education],
                ['Disability', user.disability || 'None'],
              ].filter(([,v])=>v).map(([k,v])=>`
                <div style="display:flex;justify-content:space-between;font-size:0.82rem">
                  <span style="color:var(--text-muted)">${k}</span>
                  <span style="font-weight:600;color:var(--text-secondary)">${v}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div style="background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-2xl);padding:var(--space-5);margin-bottom:var(--space-6)" class="anim-fade-in-up delay-400">
          <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:var(--space-4)">⚙️ Preferences</div>
          <div style="display:flex;flex-direction:column;gap:16px">
            <!-- Language -->
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-weight:600;font-size:0.88rem">🌐 Language</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">Chatbot and UI language</div>
              </div>
              <div style="display:flex;gap:6px">
                ${['en','hi','mr'].map(l=>`
                  <button class="lang-toggle" data-lang="${l}" style="padding:5px 12px;border-radius:var(--radius-full);font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:var(--font-body);background:${(store.state.language||'en')===l?'var(--primary)':'var(--glass-bg)'};border:1px solid ${(store.state.language||'en')===l?'var(--primary)':'var(--glass-border)'};color:${(store.state.language||'en')===l?'white':'var(--text-muted)'}">
                    ${l==='en'?'EN':l==='hi'?'हि':'म'}
                  </button>`).join('')}
              </div>
            </div>
            <!-- DigiLocker -->
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-weight:600;font-size:0.88rem">📄 DigiLocker</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">Manage your documents</div>
              </div>
              <button class="btn btn-ghost btn-sm" id="digilocker-btn">Open →</button>
            </div>
            <!-- Notifications -->
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div>
                <div style="font-weight:600;font-size:0.88rem">🔔 Notifications</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">Scheme alerts and reminders</div>
              </div>
              <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer">
                <input type="checkbox" id="notif-toggle" style="opacity:0;width:0;height:0" ${localStorage.getItem('schemesetu_notif')!=='false'?'checked':''}>
                <span id="toggle-slider" style="position:absolute;inset:0;border-radius:12px;background:${localStorage.getItem('schemesetu_notif')!=='false'?'var(--success)':'rgba(255,255,255,0.12)'};transition:0.3s">
                  <span id="toggle-knob" style="position:absolute;left:${localStorage.getItem('schemesetu_notif')!=='false'?'22':'2'}px;top:2px;width:20px;height:20px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,0.3);transition:0.3s"></span>
                </span>
              </label>
            </div>
          </div>
        </div>

      </div><!-- /container -->
    </div><!-- /mobile-inner-page -->
  `;

  // Events
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    store.logout();
    showToast('Logged out successfully', 'success');
    router.navigate('login');
  });
  document.getElementById('edit-profile-btn')?.addEventListener('click', () => showEditModal(user, outlet));
  document.getElementById('digilocker-btn')?.addEventListener('click', () => router.navigate('digilocker'));
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => { store.setLanguage(btn.dataset.lang); renderProfile(outlet); });
  });

  // Notification toggle
  const notifToggle = document.getElementById('notif-toggle');
  const slider = document.getElementById('toggle-slider');
  const knob = document.getElementById('toggle-knob');
  notifToggle?.addEventListener('change', () => {
    const on = notifToggle.checked;
    localStorage.setItem('schemesetu_notif', String(on));
    if (slider) slider.style.background = on ? 'var(--success)' : 'rgba(255,255,255,0.12)';
    if (knob) knob.style.left = on ? '22px' : '2px';
    showToast(on ? '🔔 Notifications enabled' : '🔕 Notifications disabled', 'success', 2000);
  });
}

function showEditModal(user, outlet) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:440px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5)">
        <h3 style="font-family:var(--font-heading);font-weight:700;font-size:1.1rem">✏️ Edit Profile</h3>
        <button id="modal-close" class="btn btn-ghost btn-sm">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="input-group">
          <label class="input-label">Full Name</label>
          <input type="text" id="edit-name" class="input-field" value="${user.name||''}"/>
        </div>
        <div class="input-group">
          <label class="input-label">Nickname</label>
          <input type="text" id="edit-nickname" class="input-field" value="${user.nickname||''}"/>
        </div>
        <div class="input-group">
          <label class="input-label">Phone</label>
          <input type="tel" id="edit-phone" class="input-field" value="${user.phone||''}"/>
        </div>
        <button class="btn btn-primary w-full" id="save-edit-btn">Save Changes</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.getElementById('modal-close')?.addEventListener('click', () => modal.remove());
  document.getElementById('save-edit-btn')?.addEventListener('click', () => {
    const name = document.getElementById('edit-name')?.value.trim();
    const nickname = document.getElementById('edit-nickname')?.value.trim();
    const phone = document.getElementById('edit-phone')?.value.trim();
    if (!name) { showToast('Name cannot be empty','error'); return; }
    store.setState({ user: { ...store.state.user, name, nickname, phone } });
    modal.remove();
    showToast('Profile updated!', 'success');
    renderProfile(outlet);
  });
}
