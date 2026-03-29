// Home Dashboard Page – Cultural refinement v2
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

  const user          = store.state.user || {};
  const eligibleCount = 23;
  const score         = 78;

  outlet.innerHTML = `
    <div class="page mandala-bg indian-bg" style="position:relative;z-index:1">

      <!-- Ambient orbs -->
      <div style="position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden">
        <div style="position:absolute;width:600px;height:600px;border-radius:50%;
          background:radial-gradient(circle,rgba(255,153,51,0.07),transparent 70%);
          top:-160px;right:-160px;animation:floatSlow 14s ease-in-out infinite"></div>
        <div style="position:absolute;width:380px;height:380px;border-radius:50%;
          background:radial-gradient(circle,rgba(19,136,8,0.05),transparent 70%);
          bottom:80px;left:-100px;animation:floatSlow 11s ease-in-out infinite reverse"></div>
      </div>

      <div class="container" style="position:relative;z-index:1">

        <!-- ── HERO ─────────────────────────────────── -->
        <div class="page-header-cultural anim-fade-in-up">

          <div class="hero-badge">
            🇮🇳 ${store.t('appTagline')}
          </div>

          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-6);flex-wrap:wrap">
            <div>
              <h1 class="home-welcome font-display indian-underline"
                style="font-size:clamp(1.8rem,4vw,2.8rem);font-family:'Crimson Pro',var(--font-heading),serif">
                ${store.t('welcome')},
                <span style="background:linear-gradient(135deg,var(--saffron),#E67E00);
                  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
                  ${(user.name || 'User').split(' ')[0]}!
                </span>
              </h1>
              <p class="hindi-accent" style="margin:6px 0 4px">
                🙏 नमस्ते — आपके लिए सर्वोत्तम योजनाएं खोजी जा रही हैं
              </p>
              <p class="home-tagline" style="max-width:520px;margin-top:6px">
                ${store.t('subWelcome')}
              </p>
            </div>
            <div style="display:flex;gap:var(--space-3);flex-shrink:0">
              <button class="btn btn-primary" id="home-chat-ai"
                style="background:linear-gradient(135deg,#FF9933,#E67E00);
                  box-shadow:0 4px 18px rgba(255,153,51,0.38);padding:12px 22px">
                💬 ${store.t('chatWithAI')}
              </button>
              <div id="voice-slot-home"></div>
            </div>
          </div>
        </div>

        <!-- ── STAT CARDS ────────────────────────────── -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4);
          margin-bottom:var(--space-8)" class="anim-fade-in-up delay-100">

          <!-- Eligible Schemes -->
          <div class="stat-card" style="border-left:3px solid rgba(255,153,51,0.45)">
            <div style="display:flex;align-items:center;gap:var(--space-4)">
              <div style="width:48px;height:48px;border-radius:var(--radius-lg);
                background:rgba(255,153,51,0.12);display:flex;align-items:center;
                justify-content:center;font-size:1.4rem;flex-shrink:0">
                <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
                  <circle cx="14" cy="14" r="12" stroke="#FF9933" stroke-width="1.4" opacity="0.7"/>
                  <path d="M8 14h12M14 8v12M10 10l8 8M18 10l-8 8" stroke="#FF9933" stroke-width="0.9" opacity="0.45"/>
                  <circle cx="14" cy="14" r="3" fill="#FF9933" opacity="0.55"/>
                </svg>
              </div>
              <div>
                <div class="stat-value" id="stat-eligible">0</div>
                <div class="stat-label">${store.t('eligibleSchemes')}</div>
              </div>
            </div>
          </div>

          <!-- Daily Tip -->
          <div class="stat-card" style="border-left:3px solid rgba(245,158,11,0.40);
            background:linear-gradient(135deg,rgba(255,249,235,0.80),rgba(255,255,255,0.96))!important">
            <div style="display:flex;align-items:center;gap:var(--space-4)">
              <div style="font-size:1.6rem;flex-shrink:0">🪔</div>
              <div>
                <div style="font-size:0.65rem;font-weight:700;color:#B45309;
                  text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px">
                  आज का सुझाव
                </div>
                <div style="font-family:'Crimson Pro',var(--font-heading),serif;
                  font-size:0.92rem;font-weight:600;color:var(--text-primary);line-height:1.4">
                  Claim what's rightfully yours!
                </div>
                <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px">
                  ₹2.5L Cr goes unclaimed yearly
                </div>
              </div>
            </div>
          </div>

          <!-- Eligibility Score -->
          <div class="stat-card" style="border-left:3px solid rgba(19,136,8,0.35);
            background:linear-gradient(135deg,rgba(240,255,244,0.75),rgba(255,255,255,0.96))!important">
            <div style="display:flex;align-items:center;gap:var(--space-4)">
              <svg width="54" height="54" viewBox="0 0 54 54" style="transform:rotate(-90deg);flex-shrink:0">
                <circle cx="27" cy="27" r="21" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="4.5"/>
                <circle cx="27" cy="27" r="21" fill="none" stroke="#138808" stroke-width="4.5"
                  stroke-dasharray="${2*Math.PI*21}" stroke-dashoffset="${2*Math.PI*21}"
                  stroke-linecap="round" id="score-ring"
                  style="transition:stroke-dashoffset 1.6s ease 0.5s"/>
              </svg>
              <div>
                <div style="font-family:'Crimson Pro',var(--font-heading),serif;
                  font-size:2rem;font-weight:600;color:#138808;line-height:1" id="stat-score">0%</div>
                <div class="stat-label">${store.t('yourScore')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── INDIA MAP ──────────────────────────────── -->
        <div class="anim-fade-in-up delay-200" style="margin-bottom:var(--space-8)">
          <div class="warli-divider"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">
            <div class="cultural-section-header">
              <h2>🗺️ ${store.t('mapTitle')}</h2>
              <div class="section-hindi">स्थान के अनुसार योजनाएं खोजें</div>
              <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:4px">
                ${store.t('mapSubtitle')}
              </p>
            </div>
            <button class="btn btn-ghost btn-sm" id="home-open-map">
              पूरा मानचित्र →
            </button>
          </div>
          <div id="home-map-slot"></div>
        </div>

        <!-- ── QUICK ACTIONS ──────────────────────────── -->
        <div class="anim-fade-in-up delay-300" style="margin-bottom:var(--space-8)">
          <div class="warli-divider"></div>
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:var(--space-4)">
            <h2 style="font-family:var(--font-heading);font-size:0.8rem;font-weight:700;
              color:var(--text-muted);letter-spacing:0.8px;text-transform:uppercase">
              Quick Access
            </h2>
            <span class="hindi-accent">त्वरित पहुँच</span>
          </div>
          <div class="quick-actions">
            ${[
              { page:'schemes',  icon:'📋', title:store.t('schemes'),  desc:allSchemes.length+' schemes',  cls:'blue'   },
              { page:'chatbot',  icon:'🤖', title:store.t('chatbot'),  desc:'AI-guided eligibility',        cls:'purple' },
              { page:'roadmap',  icon:'🛣️', title:store.t('roadmap'), desc:'Track application',             cls:''       },
              { page:'offices',  icon:'🏛️', title:store.t('offices'),  desc:'Find CSC centers',             cls:'green'  },
            ].map(item => `
              <div class="action-card ${item.cls} ripple-container" data-page="${item.page}" id="qac-${item.page}">
                <div class="action-icon">${item.icon}</div>
                <div class="action-label">${item.title}</div>
                <div class="action-sub">${item.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ── POPULAR SCHEMES ────────────────────────── -->
        <div class="anim-fade-in-up delay-400" style="margin-bottom:var(--space-8)">
          <div class="warli-divider"></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5)">
            <div class="cultural-section-header">
              <h2>🏆 Popular Schemes</h2>
              <div class="section-hindi">लोकप्रिय सरकारी योजनाएं</div>
            </div>
            <button class="btn btn-ghost btn-sm" id="view-all-schemes">सभी देखें →</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4)"
            id="popular-schemes-grid">
            ${[1,2,3,4].map(() =>
              `<div class="skeleton" style="height:180px;border-radius:var(--radius-xl)"></div>`
            ).join('')}
          </div>
        </div>

        <!-- ── SMS BANNER ─────────────────────────────── -->
        <div style="
          padding:var(--space-5) var(--space-6);
          background:linear-gradient(135deg,rgba(255,249,240,0.90),rgba(255,255,255,0.95));
          border:1px solid rgba(255,153,51,0.18);
          border-left:4px solid var(--saffron);
          border-radius:var(--radius-xl);
          display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-6)
        " class="anim-fade-in-up delay-500">
          <div style="font-size:1.8rem">📱</div>
          <div style="flex:1">
            <div style="font-family:'Crimson Pro',var(--font-heading),serif;font-weight:600;font-size:1.05rem">
              ${store.t('smsOption')}
            </div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px">
              Get scheme details offline on your phone — बिना इंटरनेट के
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="sms-btn"
            style="border-color:var(--saffron);color:#b35c00;flex-shrink:0">
            Send SMS
          </button>
        </div>

        <!-- Lotus Footer -->
        <div class="lotus-footer"></div>

      </div>
    </div>
  `;

  // ── Animated counters ──────────────────────────────────────
  animateCounter('stat-eligible', 0, eligibleCount, '', 1200);
  setTimeout(() => {
    const scoreEl = document.getElementById('stat-score');
    const ring    = document.getElementById('score-ring');
    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (ring) ring.style.strokeDashoffset = String(2 * Math.PI * 21 * (1 - score / 100));
  }, 600);

  // ── Embed compact India map ───────────────────────────────
  const mapSlot = document.getElementById('home-map-slot');
  if (mapSlot) {
    const mapEl = createIndiaMap({
      compact: true,
      onSelect: (state) => {
        setRobotMood('hint', true);
        showToast(`📍 ${state} — ${Math.floor(30 + Math.random()*40)} schemes available`, 'success', 3000);
      }
    });
    mapSlot.appendChild(mapEl);
  }

  // ── Voice search ─────────────────────────────────────────
  const voiceSlot = document.getElementById('voice-slot-home');
  if (voiceSlot) {
    const vBtn = createVoiceButton((text) => {
      store.setState({ schemeFilter: { ...store.state.schemeFilter, search: text } });
      router.navigate('schemes');
    });
    vBtn.style.cssText += 'width:44px;height:44px;border-radius:50%;';
    voiceSlot.appendChild(vBtn);
  }

  // ── Events ───────────────────────────────────────────────
  document.getElementById('home-chat-ai')?.addEventListener('click', () => router.navigate('chatbot'));
  document.getElementById('home-open-map')?.addEventListener('click', () => router.navigate('map'));
  document.getElementById('view-all-schemes')?.addEventListener('click', () => router.navigate('schemes'));
  document.querySelectorAll('.action-card').forEach(c =>
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
    <div class="modal-box" style="border-top:3px solid var(--saffron)">
      <div style="text-align:center;margin-bottom:var(--space-5)">
        <div style="font-size:2.2rem;margin-bottom:8px">📲</div>
        <h3 style="font-family:'Crimson Pro',var(--font-heading),serif;font-weight:600;font-size:1.3rem">
          Get Schemes via SMS
        </h3>
        <p class="hindi-accent" style="margin-top:4px">एसएमएस पर योजनाएं पाएं</p>
        <p style="font-size:0.82rem;color:var(--text-secondary);margin-top:6px">
          We'll send matching schemes to your phone
        </p>
      </div>
      <div class="input-group" style="margin-bottom:var(--space-4)">
        <label class="input-label">Mobile Number</label>
        <input type="tel" id="sms-phone" class="input-field" placeholder="+91 98765 43210"/>
      </div>
      <div style="display:flex;gap:var(--space-3)">
        <button class="btn btn-ghost" style="flex:1" id="sms-close">Cancel</button>
        <button class="btn btn-primary" style="flex:1;background:linear-gradient(135deg,#FF9933,#E67E00)" id="sms-send">
          Send SMS
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('sms-close')?.addEventListener('click', () => modal.remove());
  document.getElementById('sms-send')?.addEventListener('click', () => {
    const phone = document.getElementById('sms-phone')?.value;
    if (!phone || phone.length < 10) { showToast('Enter valid phone number', 'error'); return; }
    modal.remove();
    showToast(`✅ SMS sent to ${phone}! योजनाएं भेज दी गई हैं`, 'success', 4000);
  });
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}
