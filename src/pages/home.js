// Home Dashboard Page – with embedded India map
import { store } from '../store.js';
import { router } from '../router.js';
import { showRobot, setRobotMood } from '../components/robot.js';
import { createVoiceButton } from '../components/voiceSearch.js';
import { showToast } from '../components/toast.js';
import { createIndiaMap } from '../components/indiaMap.js';
import { allSchemes } from '../data/schemes.js';

export function renderHome(outlet) {
  showRobot();
  setRobotMood('wave', true);

  const user = store.state.user || {};
  const eligibleCount = 23;
  const missedAmount  = 64500;
  const score         = 78;

  outlet.innerHTML = `
    <div class="page" style="position:relative;z-index:1">
      <!-- Ambient orbs -->
      <div style="position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden">
        <div style="position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(108,99,255,0.10),transparent 70%);top:-150px;right:-150px;animation:floatSlow 12s ease-in-out infinite"></div>
        <div style="position:absolute;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(78,204,163,0.07),transparent 70%);bottom:80px;left:-100px;animation:floatSlow 10s ease-in-out infinite reverse"></div>
      </div>

      <div class="container" style="position:relative;z-index:1">

        <!-- ── HERO ─────────────────────────────────── -->
        <div style="padding:var(--space-8) 0 var(--space-4)" class="anim-fade-in-up">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 14px;border-radius:var(--radius-full);background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);font-size:0.75rem;font-weight:600;color:var(--primary-light);margin-bottom:var(--space-3)">
            🇮🇳 ${store.t('appTagline')}
          </div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);flex-wrap:wrap">
            <div>
              <h1 class="home-welcome" style="font-size:clamp(1.8rem,4vw,3rem)">
                ${store.t('welcome')}, <span class="grad-text">${(user.name || 'User').split(' ')[0]}!</span>
              </h1>
              <p class="home-tagline" style="max-width:520px">${store.t('subWelcome')}</p>
            </div>
            <div style="display:flex;gap:var(--space-3);flex-shrink:0">
              <button class="btn btn-primary" id="home-chat-ai" style="padding:12px 20px">💬 ${store.t('chatWithAI')}</button>
              <div id="voice-slot-home"></div>
            </div>
          </div>
        </div>

        <div style="
          display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4);
          margin-bottom:var(--space-8);
        " class="anim-fade-in-up delay-100">
          <!-- Eligible Schemes – BLUE -->
          <div style="
            padding:var(--space-5);
            background:linear-gradient(135deg,rgba(59,130,246,0.10),rgba(59,130,246,0.03));
            border:1.5px solid rgba(59,130,246,0.25);border-radius:var(--radius-xl);
            display:flex;align-items:center;gap:var(--space-4);
            box-shadow:0 4px 16px rgba(59,130,246,0.10);
          ">
            <div style="width:50px;height:50px;border-radius:var(--radius-lg);background:rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">🎯</div>
            <div>
              <div style="font-family:var(--font-heading);font-size:2rem;font-weight:900;line-height:1;color:#3B82F6" id="stat-eligible">0</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${store.t('eligibleSchemes')}</div>
            </div>
          </div>

          <!-- Motivational – YELLOW -->
          <div style="
            padding:var(--space-5);
            background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04));
            border:1.5px solid rgba(245,158,11,0.30);border-radius:var(--radius-xl);
            display:flex;align-items:center;gap:var(--space-4);
            box-shadow:0 4px 16px rgba(245,158,11,0.10);
          ">
            <div style="font-size:2.2rem;flex-shrink:0">🌟</div>
            <div>
              <div style="font-size:0.68rem;font-weight:700;color:#B45309;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Today's Tip</div>
              <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:700;color:var(--text-primary);line-height:1.35">Claim what's rightfully yours!</div>
              <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px">₹2.5L Cr goes unclaimed yearly</div>
            </div>
          </div>

          <!-- Eligibility Score – GREEN -->
          <div style="
            padding:var(--space-5);
            background:linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.03));
            border:1.5px solid rgba(16,185,129,0.25);border-radius:var(--radius-xl);
            display:flex;align-items:center;gap:var(--space-4);
            box-shadow:0 4px 16px rgba(16,185,129,0.10);
          ">
            <svg width="56" height="56" viewBox="0 0 56 56" style="transform:rotate(-90deg);flex-shrink:0">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="5"/>
              <circle cx="28" cy="28" r="22" fill="none" stroke="#10B981" stroke-width="5"
                stroke-dasharray="${2*Math.PI*22}" stroke-dashoffset="${2*Math.PI*22}"
                stroke-linecap="round" id="score-ring" style="transition:stroke-dashoffset 1.5s ease 0.5s"/>
            </svg>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.8rem;font-weight:900;color:#10B981;line-height:1" id="stat-score">0%</div>
              <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${store.t('yourScore')}</div>
            </div>
          </div>
        </div>

        <!-- ── INDIA MAP SECTION ─────────────────────── -->
        <div class="anim-fade-in-up delay-200" style="margin-bottom:var(--space-8)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
            <div>
              <h2 style="font-family:var(--font-heading);font-size:1.4rem;font-weight:800">🗺️ ${store.t('mapTitle')}</h2>
              <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px">${store.t('mapSubtitle')}</p>
            </div>
            <button class="btn btn-ghost btn-sm" id="home-open-map">Full Map →</button>
          </div>
          <div id="home-map-slot"></div>
        </div>

        <!-- ── QUICK ACTIONS ─────────────────────────── -->
        <div class="anim-fade-in-up delay-300" style="margin-bottom:var(--space-8)">
          <h2 style="font-family:var(--font-heading);font-size:1rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:var(--space-4)">Quick Access</h2>
          <div class="quick-actions">
            ${[
              { page:'schemes', emoji:'📋', title:store.t('schemes'),  desc:allSchemes.length+' schemes',     color:'#3B82F6' },
              { page:'chatbot', emoji:'🤖', title:store.t('chatbot'),  desc:'AI-guided eligibility',           color:'#5B4FE8' },
              { page:'roadmap', emoji:'🛣️', title:store.t('roadmap'), desc:'Track application',               color:'#F59E0B' },
              { page:'offices', emoji:'🏢', title:store.t('offices'),  desc:'Find CSC centers',                color:'#10B981' },
            ].map(item => `
              <div class="quick-action-card ripple-container" data-page="${item.page}" id="qac-${item.page}"
                style="border-top:3px solid ${item.color};">
                <div class="quick-action-icon" style="background:${item.color}1A">${item.emoji}</div>
                <div class="quick-action-title" style="color:${item.color}">${item.title}</div>
                <div class="quick-action-desc">${item.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── POPULAR SCHEMES ──────────────────────── -->
        <div class="anim-fade-in-up delay-400" style="margin-bottom:var(--space-8)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5)">
            <h2 style="font-family:var(--font-heading);font-size:1.4rem;font-weight:800">🔥 Popular Schemes</h2>
            <button class="btn btn-ghost btn-sm" id="view-all-schemes">View All →</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4)" id="popular-schemes-grid">
            ${[1,2,3,4].map(() => `<div class="skeleton" style="height:180px;border-radius:var(--radius-xl)"></div>`).join('')}
          </div>
        </div>

        <!-- ── SMS BANNER ────────────────────────────── -->
        <div style="
          padding:var(--space-5) var(--space-6);background:var(--glass-bg);
          border:1px solid var(--glass-border);border-radius:var(--radius-xl);
          display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-10)
        " class="anim-fade-in-up delay-500">
          <div style="font-size:2rem">📱</div>
          <div style="flex:1">
            <div style="font-family:var(--font-heading);font-weight:700">${store.t('smsOption')}</div>
            <div style="font-size:0.82rem;color:var(--text-secondary)">Get scheme details offline on your phone</div>
          </div>
          <button class="btn btn-ghost btn-sm" id="sms-btn">Send SMS</button>
        </div>

      </div>
    </div>
  `;

  // ── Animated counters ─────────────────────────────────────────
  animateCounter('stat-eligible', 0, eligibleCount, '', 1200);
  setTimeout(() => {
    const scoreEl = document.getElementById('stat-score');
    const ring    = document.getElementById('score-ring');
    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (ring) ring.style.strokeDashoffset = String(2 * Math.PI * 22 * (1 - score / 100));
  }, 600);

  // ── Embed compact India map ───────────────────────────────────
  const mapSlot = document.getElementById('home-map-slot');
  if (mapSlot) {
    const mapEl = createIndiaMap({
      compact: true,
      onSelect: (state) => {
        setRobotMood('hint', true);
        showToast(`📍 ${state} selected — ${Math.floor(30 + Math.random()*40)} schemes available`, 'success', 3000);
      }
    });
    mapSlot.appendChild(mapEl);
  }

  // ── Voice search ──────────────────────────────────────────────
  const voiceSlot = document.getElementById('voice-slot-home');
  if (voiceSlot) {
    const vBtn = createVoiceButton((text) => {
      store.setState({ schemeFilter: { ...store.state.schemeFilter, search: text } });
      router.navigate('schemes');
    });
    vBtn.style.cssText += 'width:44px;height:44px;border-radius:50%;';
    voiceSlot.appendChild(vBtn);
  }

  // ── Events ────────────────────────────────────────────────────
  document.getElementById('home-chat-ai')?.addEventListener('click', () => router.navigate('chatbot'));
  document.getElementById('home-open-map')?.addEventListener('click', () => router.navigate('map'));
  document.getElementById('view-all-schemes')?.addEventListener('click', () => router.navigate('schemes'));
  document.querySelectorAll('.quick-action-card').forEach(c =>
    c.addEventListener('click', () => router.navigate(c.dataset.page))
  );
  document.getElementById('sms-btn')?.addEventListener('click', showSmsModal);

  setTimeout(loadPopularSchemes, 400);
}

function loadPopularSchemes() {
  import('../components/schemeCard.js').then(({ createSchemeCard }) => {
    const grid = document.getElementById('popular-schemes-grid');
    if (!grid) return;
    grid.innerHTML = '';
    allSchemes.filter(s => s.popular).slice(0, 4).forEach((s, i) => grid.appendChild(createSchemeCard(s, i)));
    if (window.lucide) window.lucide.createIcons();
  });
}

function animateCounter(id, from, to, prefix, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(from + (to - from) * e).toLocaleString('en-IN');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function showSmsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box">
      <div style="text-align:center;margin-bottom:var(--space-5)">
        <div style="font-size:2.5rem;margin-bottom:8px">📲</div>
        <h3 style="font-family:var(--font-heading);font-weight:700;font-size:1.2rem">Get Schemes via SMS</h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:4px">We'll send matching schemes to your phone</p>
      </div>
      <div class="input-group" style="margin-bottom:var(--space-4)">
        <label class="input-label">Mobile Number</label>
        <input type="tel" id="sms-phone" class="input-field" placeholder="+91 98765 43210"/>
      </div>
      <div style="display:flex;gap:var(--space-3)">
        <button class="btn btn-ghost" style="flex:1" id="sms-close">Cancel</button>
        <button class="btn btn-primary" style="flex:1" id="sms-send">Send SMS</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('sms-close')?.addEventListener('click', () => modal.remove());
  document.getElementById('sms-send')?.addEventListener('click', () => {
    const phone = document.getElementById('sms-phone')?.value;
    if (!phone || phone.length < 10) { showToast('Enter valid phone number', 'error'); return; }
    modal.remove();
    showToast(`SMS sent to ${phone}! ✅`, 'success', 4000);
  });
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
