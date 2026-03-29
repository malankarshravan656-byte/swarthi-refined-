// Home Page – Mobile UI, fully multilingual via store.t()
import { store } from '../store.js';
import { router } from '../router.js';
import { allSchemes } from '../data/schemes.js';
import heroImg from '../assets/hero.png';
import mapImg  from '../assets/map_banner.png';

export function renderHome(outlet) {
  const user = store.state.user || {};
  const lang = store.state.language || 'en';
  const t    = key => store.t(key);

  // ── Language-aware card & section titles ──────────────────────────────
  const heroTagline  = t('heroTagline')    || 'सरकारी योजनाओं का आपका साथी';
  const cardAI       = t('cardAskAI')      || 'AI से पूछें';
  const cardVoice    = t('cardVoice')      || 'वॉयस सहायता';
  const cardBrowse   = t('cardBrowse')     || 'योजनाएं देखें';
  const byStateTitle = t('browseByState')  || (lang === 'en' ? 'Browse by State' : 'राज्य के अनुसार खोजें');
  const popSchemes   = t('popularSchemes') || t('topSchemes') || 'Popular Schemes';
  const openMapText  = t('openMap')        || (lang === 'en' ? 'Open Map' : 'खोलें');
  const seeAllText   = t('viewAll')        || 'See All →';

  outlet.innerHTML = `
    <div class="mobile-page">

      <!-- ── Hero illustration ───────────────────────────── -->
      <div class="mobile-hero">
        <img src="${heroImg}"
             alt="SchemeSetu hero illustration"
             class="hero-img"
             onerror="this.style.display='none'"/>
      </div>

      <!-- ── Tagline ──────────────────────────────────────── -->
      <div class="mobile-tagline">
        <div class="mobile-tagline-hi">${heroTagline}</div>
        ${lang !== 'en'
          ? `<div class="mobile-tagline-en">Your companion for government schemes</div>`
          : `<div class="mobile-tagline-en">${t('appTagline') || 'AI Government Scheme Assistant'}</div>`
        }
      </div>

      <!-- ── 3 feature cards ───────────────────────────────── -->
      <div class="mobile-cards">

        <div class="mobile-feature-card card-ai anim-card" id="home-card-ai" role="button" tabindex="0">
          <div class="mfc-icon">
            <svg viewBox="0 0 26 26" fill="none" stroke="#E07B00" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.8V17h8v-2.2c1.8-1.3 3-3.4 3-5.8 0-3.9-3.1-7-7-7z"/>
              <path d="M9 17v1a3 3 0 006 0v-1"/>
              <rect x="14" y="15" width="10" height="7" rx="3" fill="rgba(224,123,0,0.1)"/>
              <circle cx="16.5" cy="18.5" r="0.9" fill="#E07B00" stroke="none"/>
              <circle cx="19"   cy="18.5" r="0.9" fill="#E07B00" stroke="none"/>
              <circle cx="21.5" cy="18.5" r="0.9" fill="#E07B00" stroke="none"/>
            </svg>
          </div>
          <div>
            <div class="mfc-title-hi">${cardAI}</div>
            <div class="mfc-title-en">${lang !== 'en' ? 'Ask AI' : ''}</div>
          </div>
        </div>

        <div class="mobile-feature-card card-voice anim-card" id="home-card-voice" role="button" tabindex="0">
          <div class="mfc-icon">
            <svg viewBox="0 0 26 26" fill="none" stroke="#4A8C6E" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="2" width="8" height="14" rx="4"/>
              <path d="M5 13c0 4.4 3.6 8 8 8s8-3.6 8-8"/>
              <line x1="13" y1="21" x2="13" y2="24"/>
              <line x1="9"  y1="24" x2="17" y2="24"/>
            </svg>
          </div>
          <div>
            <div class="mfc-title-hi">${cardVoice}</div>
            <div class="mfc-title-en">${lang !== 'en' ? 'Voice' : ''}</div>
          </div>
        </div>

        <div class="mobile-feature-card card-browse anim-card" id="home-card-schemes" role="button" tabindex="0">
          <div class="mfc-icon">
            <svg viewBox="0 0 26 26" fill="none" stroke="#7B2D2D" stroke-width="1.7"
                 stroke-linecap="round" stroke-linejoin="round">
              <rect x="3"  y="3"  width="9" height="9" rx="2"/>
              <rect x="14" y="3"  width="9" height="9" rx="2"/>
              <rect x="3"  y="14" width="9" height="9" rx="2"/>
              <line x1="14" y1="16" x2="23" y2="16"/>
              <line x1="14" y1="20" x2="21" y2="20"/>
              <line x1="14" y1="24" x2="19" y2="24"/>
            </svg>
          </div>
          <div>
            <div class="mfc-title-hi">${cardBrowse}</div>
            <div class="mfc-title-en">${lang !== 'en' ? 'Browse Schemes' : ''}</div>
          </div>
        </div>
      </div>

      <!-- ── Stats row ─────────────────────────────────────── -->
      <div class="home-stats-row">
        <div class="home-stat-card">
          <div class="home-stat-num" id="stat-eligible" style="color:#E07B00">0</div>
          <div class="home-stat-label">${t('schemes') || 'Schemes'}</div>
        </div>
        <div class="home-stat-divider"></div>
        <div class="home-stat-card">
          <div class="home-stat-num" style="color:#4A8C6E" id="stat-score">0%</div>
          <div class="home-stat-label">${t('yourScore') || 'Score'}</div>
        </div>
        <div class="home-stat-divider"></div>
        <div class="home-stat-card">
          <div class="home-stat-num" style="color:#7B2D2D">₹2.5L</div>
          <div class="home-stat-label">${t('missedBenefits') || 'Unclaimed'}</div>
        </div>
      </div>

      <!-- ── India Map section ─────────────────────────────── -->
      <div class="home-section">
        <div class="home-section-header">
          <div>
            <div class="home-section-title">${byStateTitle}</div>
            <div class="home-section-sub">${t('mapSubtitle') || 'Schemes by location'}</div>
          </div>
          <button class="home-see-all" id="home-open-map">${t('viewFullMap') || 'Full Map →'}</button>
        </div>
        <div class="home-map-card" id="home-map-card">
          <img src="${mapImg}" alt="India Map" class="home-map-img"
               onerror="this.style.display='none'"/>
          <div class="home-map-overlay">
            <div class="home-map-overlay-text">
              <span>🗺️</span>
              <div>
                <div style="font-weight:700;font-size:0.9rem;color:#1E0E00">
                  ${t('mapTitle') || 'Interactive Map'}
                </div>
                <div style="font-size:0.72rem;color:#7A5230">
                  ${t('clickState') || 'Tap to select your state'}
                </div>
              </div>
            </div>
            <button class="home-map-btn" id="home-map-btn">${openMapText}</button>
          </div>
        </div>
      </div>

      <!-- ── Popular Schemes ────────────────────────────────── -->
      <div class="home-section">
        <div class="home-section-header">
          <div>
            <div class="home-section-title">${popSchemes}</div>
            <div class="home-section-sub">${t('subWelcome') || 'Government schemes for you'}</div>
          </div>
          <button class="home-see-all" id="home-view-all">${seeAllText}</button>
        </div>
        <div class="home-schemes-list" id="home-schemes-list">
          ${[0,1,2].map(i => `
            <div class="home-scheme-skeleton" style="animation-delay:${i * 0.1}s"></div>
          `).join('')}
        </div>
      </div>

      <!-- ── Daily Tip ───────────────────────────────────────── -->
      <div class="home-section">
        <div class="home-tip-card">
          <span class="home-tip-icon">🪔</span>
          <div>
            <div style="font-size:0.65rem;font-weight:700;color:#B45309;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px">
              ${lang === 'en' ? 'Today\'s Tip' : lang === 'mr' ? 'आजची टीप' : 'आज का सुझाव'}
            </div>
            <div style="font-size:0.88rem;font-weight:600;color:#1E0E00">
              ${t('dailyTip') || 'Claim what\'s rightfully yours!'}
            </div>
            <div style="font-size:0.72rem;color:#7A5230;margin-top:2px">
              ${t('dailyTipSub') || '₹2.5L Cr goes unclaimed yearly. Start today.'}
            </div>
          </div>
        </div>
      </div>

      <div style="height:16px"></div>
    </div>
  `;

  // ── Animated counters ────────────────────────────────────────────────
  animateCounter('stat-eligible', 0, 23, '', 1200);
  setTimeout(() => {
    const el = document.getElementById('stat-score');
    if (el) { el.textContent = '78%'; el.style.transition = 'all 0.6s ease'; }
  }, 600);

  // ── Events ───────────────────────────────────────────────────────────
  document.getElementById('home-card-ai')?.addEventListener('click',      () => router.navigate('chatbot'));
  document.getElementById('home-card-voice')?.addEventListener('click',   () => router.navigate('chatbot'));
  document.getElementById('home-card-schemes')?.addEventListener('click', () => router.navigate('schemes'));
  document.getElementById('home-open-map')?.addEventListener('click',     () => router.navigate('map'));
  document.getElementById('home-map-btn')?.addEventListener('click',      () => router.navigate('map'));
  document.getElementById('home-map-card')?.addEventListener('click',     () => router.navigate('map'));
  document.getElementById('home-view-all')?.addEventListener('click',     () => router.navigate('schemes'));

  document.querySelectorAll('.mobile-feature-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });

  setTimeout(loadPopularSchemes, 300);
}

// ── Popular schemes loader ───────────────────────────────────────────────
function loadPopularSchemes() {
  const container = document.getElementById('home-schemes-list');
  if (!container) return;
  const popular = allSchemes.filter(s => s.popular).slice(0, 4);
  if (!popular.length) { container.innerHTML = ''; return; }
  container.innerHTML = popular.map(s => `
    <div class="home-scheme-item" data-name="${s.name}" style="cursor:pointer">
      <div class="home-scheme-icon">${getCatEmoji(s.category)}</div>
      <div class="home-scheme-info">
        <div class="home-scheme-name">${s.name}</div>
        <div class="home-scheme-meta">${s.ministry} · ${s.category}</div>
      </div>
      <div class="home-scheme-tag ${getTagColor(s.category)}">${s.benefits?.split(' ').slice(0, 2).join(' ') || 'View'}</div>
    </div>
  `).join('');

  container.querySelectorAll('.home-scheme-item').forEach(item => {
    item.addEventListener('click', () => router.navigate('schemes'));
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────
function getCatEmoji(cat) {
  const m = { agriculture:'🌾', health:'🏥', education:'📚', women:'👩', youth:'🎓', finance:'💰', housing:'🏠' };
  return m[cat] || '📋';
}
function getTagColor(cat) {
  const m = { agriculture:'tag-green', health:'tag-red', education:'tag-blue', women:'tag-pink', finance:'tag-orange', housing:'tag-brown' };
  return m[cat] || 'tag-orange';
}
function animateCounter(id, from, to, prefix, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
