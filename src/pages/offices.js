// Nearby Government Offices Page
import { store } from '../store.js';
import { router } from '../router.js';
import { officesData, getOfficesByState } from '../data/offices.js';
import { showToast } from '../components/toast.js';
import mapBannerImg from '../assets/map_banner.png';

const TYPE_CONFIG = {
  csc:     { label: 'CSC Centre',      cls: 'badge-csc',  emoji: '🖥️' },
  district:{ label: 'District Office', cls: 'badge-dist', emoji: '🏛️' },
  block:   { label: 'Block Office',    cls: 'badge-block',emoji: '🏢' },
  gram:    { label: 'Gram Panchayat',  cls: 'badge-gram', emoji: '🏘️' },
};

export function renderOffices(outlet) {
  const isHi = store.state.language === 'hi';
  const userState = store.state.user?.state;
  let offices = userState ? getOfficesByState(userState) : officesData;
  if (offices.length === 0) offices = officesData;

  outlet.innerHTML = `
    <div class="mobile-inner-page">

      <!-- Map banner image -->
      <img src="${mapBannerImg}" alt="India Map" class="mobile-banner-img" style="height:140px"/>

      <!-- Page header -->
      <div class="mobile-page-header" style="padding-top:14px">
        <div class="page-title">${isHi ? 'नजदीकी कार्यालय' : store.t('officesTitle')}</div>
        <div class="page-subtitle">${offices.length} ${isHi ? 'कार्यालय मिले' : 'offices found nearby'}</div>
      </div>

      <div style="padding:12px 14px">

          <div style="font-size:2rem">📍</div>
        <!-- Location pill -->
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;
          background:#FEFAF5;border:1px solid rgba(220,180,120,0.3);border-left:4px solid #E07B00;
          border-radius:14px;margin-bottom:12px">
          <span style="font-size:1.3rem">📍</span>
          <div>
            <div style="font-size:0.82rem;font-weight:700;color:#1E0E00">
              ${userState ? `Near ${store.state.user?.city || userState}` : 'Simulated Location'}
            </div>
            <div style="font-size:0.68rem;color:#A08060">${offices.length} offices within 15 km</div>
          </div>
          <button class="home-map-btn" id="refresh-location" style="margin-left:auto;padding:6px 12px;font-size:0.7rem">🔄 Refresh</button>
        </div>

        <!-- Filter by type -->
        <div class="filters-row" style="margin-bottom:12px;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:8px;scrollbar-width:none">
          <button class="filter-pill active" data-type="all" id="filter-all">🌐 All</button>
          <button class="filter-pill" data-type="csc" id="filter-csc">🖥️ CSC</button>
          <button class="filter-pill" data-type="district" id="filter-district">🏛️ District</button>
          <button class="filter-pill" data-type="block" id="filter-block">🏢 Block</button>
          <button class="filter-pill" data-type="gram" id="filter-gram">🏘️ Gram</button>
        </div>

        <!-- Offices Grid -->
        <div class="offices-grid" id="offices-grid">
          ${offices.map((office, i) => renderOfficeCard(office, i)).join('')}
        </div>

        <!-- CSC Banner -->
        <div style="margin-top:16px;padding:14px 16px;
          background:linear-gradient(135deg,rgba(255,249,235,0.95),rgba(254,250,245,0.98));
          border:1px solid rgba(224,123,0,0.2);border-top:3px solid #E07B00;
          border-radius:16px;display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem">📱</div>
          <div style="flex:1">
            <div style="font-size:0.85rem;font-weight:700;color:#1E0E00;margin-bottom:4px">CSC Digital Seva</div>
            <div style="font-size:0.72rem;color:#7A5230;line-height:1.5">5 Lakh+ CSC Centres · 300+ services — Aadhaar, certificates, banking & more</div>
          </div>
        </div>

      </div><!-- /padding div -->
    </div><!-- /mobile-inner-page -->
  `;

  // Filter buttons
  document.querySelectorAll('.filter-pill[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      const filtered = type === 'all' ? offices : offices.filter(o => o.type === type);
      const grid = document.getElementById('offices-grid');
      if (grid) grid.innerHTML = filtered.map((o, i) => renderOfficeCard(o, i)).join('');
    });
  });

  document.getElementById('refresh-location')?.addEventListener('click', () => {
    showToast('📍 Location refreshed!', 'success', 2000);
  });

  // Call button delegation
  document.getElementById('offices-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.call-btn');
    if (btn) showToast(`📞 Calling ${btn.dataset.phone}...`, 'info', 2500);
  });
}

function renderOfficeCard(office, index) {
  const cfg = TYPE_CONFIG[office.type] || TYPE_CONFIG.csc;
  return `
    <div class="office-card" style="animation:fadeInUp 0.4s ease ${index * 0.07}s both">
      <span class="office-type-badge ${cfg.cls}">${cfg.emoji} ${cfg.label}</span>

      <h3 style="font-family:var(--font-heading);font-weight:700;font-size:0.95rem;margin-bottom:var(--space-2);color:var(--text-primary)">
        ${office.name}
      </h3>

      <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-muted);margin-bottom:var(--space-3)">
        📍 ${office.address}
      </div>

      <div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4)">
        <div style="font-size:0.78rem">
          <div style="color:var(--text-muted)">Distance</div>
          <div style="font-weight:700;color:var(--primary-light)">${office.distance} ${store.t('distance')}</div>
        </div>
        <div style="font-size:0.78rem">
          <div style="color:var(--text-muted)">Hours</div>
          <div style="font-weight:600;color:var(--text-primary)">${office.hours}</div>
        </div>
      </div>

      <!-- Services -->
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:var(--space-4)">
        ${office.services.map(s => `
          <span style="
            padding:3px 8px;border-radius:var(--radius-full);
            background:var(--glass-bg);border:1px solid var(--glass-border);
            font-size:0.68rem;color:var(--text-muted)
          ">${s}</span>
        `).join('')}
      </div>

      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn-primary btn-sm" style="flex:1" data-map-url="${encodeURIComponent(office.address)}" onclick="window.open('https://maps.google.com/?q='+this.dataset.mapUrl,'_blank')">
          🗺️ ${store.t('directions')}
        </button>
        <button class="btn btn-ghost btn-sm call-btn" data-phone="${office.phone}" title="${office.phone}">
          📞
        </button>
      </div>
    </div>
  `;
}
