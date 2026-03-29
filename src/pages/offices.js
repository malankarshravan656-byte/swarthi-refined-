// Nearby Government Offices Page
import { store } from '../store.js';
import { showRobot, setRobotMood } from '../components/robot.js';
import { officesData, getOfficesByState } from '../data/offices.js';
import { showToast } from '../components/toast.js';

const TYPE_CONFIG = {
  csc:     { label: 'CSC Centre',      cls: 'badge-csc',  emoji: '🖥️' },
  district:{ label: 'District Office', cls: 'badge-dist', emoji: '🏛️' },
  block:   { label: 'Block Office',    cls: 'badge-block',emoji: '🏢' },
  gram:    { label: 'Gram Panchayat',  cls: 'badge-gram', emoji: '🏘️' },
};

export function renderOffices(outlet) {
  showRobot();
  setRobotMood('hint', false);

  const userState = store.state.user?.state;
  let offices = userState ? getOfficesByState(userState) : officesData;
  if (offices.length === 0) offices = officesData; // fallback

  outlet.innerHTML = `
    <div class="page">
      <div class="container">

        <!-- Header -->
        <div class="section-header anim-fade-in-up" style="margin-top:var(--space-6)">
          <h1 style="font-family:var(--font-heading);font-size:2rem;font-weight:800">${store.t('officesTitle')}</h1>
          <p>${store.t('officesSubtitle')}</p>
        </div>

        <!-- Location Banner -->
        <div style="
          display:flex;align-items:center;gap:var(--space-4);
          padding:var(--space-5) var(--space-6);
          background:rgba(108,99,255,0.1);
          border:1px solid rgba(108,99,255,0.3);
          border-radius:var(--radius-xl);
          margin-bottom:var(--space-8)
        " class="anim-fade-in-up delay-100">
          <div style="font-size:2rem">📍</div>
          <div>
            <div style="font-weight:700;font-family:var(--font-heading)">
              ${userState ? `Showing offices near ${store.state.user?.city || userState}` : 'Simulated Location Active'}
            </div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px">
              ${offices.length} offices found within 15 km radius
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" id="refresh-location" style="margin-left:auto">
            🔄 Refresh Location
          </button>
        </div>

        <!-- Filter by type -->
        <div class="filters-row anim-fade-in-up delay-200" style="margin-bottom:var(--space-6)">
          <button class="filter-pill active" data-type="all" id="filter-all">🌐 All Types</button>
          <button class="filter-pill" data-type="csc" id="filter-csc">🖥️ CSC Centres</button>
          <button class="filter-pill" data-type="district" id="filter-district">🏛️ District</button>
          <button class="filter-pill" data-type="block" id="filter-block">🏢 Block Office</button>
          <button class="filter-pill" data-type="gram" id="filter-gram">🏘️ Gram Panchayat</button>
        </div>

        <!-- Offices Grid -->
        <div class="offices-grid" id="offices-grid">
          ${offices.map((office, i) => renderOfficeCard(office, i)).join('')}
        </div>

        <!-- CSC App Banner -->
        <div style="
          margin-top:var(--space-10);padding:var(--space-8);
          background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(78,204,163,0.1));
          border:1px solid rgba(108,99,255,0.3);
          border-radius:var(--radius-2xl);
          display:flex;align-items:center;gap:var(--space-6);
        " class="anim-fade-in-up delay-400">
          <div style="font-size:3.5rem">📱</div>
          <div style="flex:1">
            <h3 style="font-family:var(--font-heading);font-size:1.2rem;font-weight:800;margin-bottom:var(--space-2)">CSC Digital Seva</h3>
            <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6">
              Common Service Centres offer 300+ government services. Get Aadhaar updates, certificates, insurance, banking and more — all at one place!
            </p>
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
              <span style="padding:4px 12px;border-radius:var(--radius-full);background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.4);font-size:0.75rem;font-weight:600;color:var(--primary-light)">🏛️ 5 Lakh+ CSC Centres</span>
              <span style="padding:4px 12px;border-radius:var(--radius-full);background:rgba(78,204,163,0.15);border:1px solid rgba(78,204,163,0.3);font-size:0.75rem;font-weight:600;color:var(--success)">✅ 300+ Services</span>
            </div>
          </div>
        </div>

      </div>
    </div>
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
