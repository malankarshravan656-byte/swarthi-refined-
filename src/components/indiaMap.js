// Shared India map SVG component — used on both Home and Map pages
import { store } from '../store.js';
import { router } from '../router.js';
import { INDIA_STATES, getStateByName } from '../data/indiaMapPaths.js';
import { getCities, getSchemeCount } from '../data/states.js';
import { showToast } from './toast.js';

let _selectedState = null;
let _onStateSelect = null;

/**
 * Build the India map SVG + sidebar.
 * @param {object} opts
 *   compact  – smaller version for home page
 *   onSelect – callback(stateName)
 */
export function createIndiaMap({ compact = false, onSelect = null } = {}) {
  _selectedState = store.state.selectedState || null;
  _onStateSelect = onSelect;

  const wrap = document.createElement('div');
  wrap.className = 'india-map-component';
  wrap.style.cssText = `display:flex;gap:${compact ? '16px' : '24px'};align-items:flex-start;width:100%;`;

  wrap.innerHTML = `
    <div class="india-map-svg-wrap" style="
      flex:${compact ? '0 0 420px' : '1'};
      position:relative;
      background:var(--glass-bg);
      border:1px solid var(--glass-border);
      border-radius:var(--radius-2xl);
      padding:${compact ? '12px' : '20px'};
      overflow:hidden;
    ">
      <!-- Glow overlay -->
      <div style="
        position:absolute;inset:0;pointer-events:none;
        background:radial-gradient(ellipse at 50% 30%,rgba(108,99,255,0.08),transparent 70%);
      "></div>

      <div style="position:absolute;top:10px;left:12px;z-index:3;display:flex;align-items:center;gap:6px">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--success);animation:glowPulse 2s ease-in-out infinite"></div>
        <span style="font-size:0.7rem;font-weight:600;color:var(--success)">Interactive</span>
      </div>

      <svg
        id="india-svg-main"
        viewBox="0 0 760 720"
        xmlns="http://www.w3.org/2000/svg"
        style="width:100%;height:auto;cursor:pointer;"
      >
        <defs>
          <filter id="state-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <linearGradient id="map-grad-default" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(108,99,255,0.25)"/>
            <stop offset="100%" style="stop-color:rgba(108,99,255,0.10)"/>
          </linearGradient>
          <linearGradient id="map-grad-selected" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(108,99,255,0.85)"/>
            <stop offset="100%" style="stop-color:rgba(78,204,163,0.60)"/>
          </linearGradient>
        </defs>

        <!-- State paths -->
        ${INDIA_STATES.map(s => `
          <g class="state-group" data-state="${s.name}">
            <path
              data-state="${s.name}"
              d="${s.d}"
              fill="url(#map-grad-default)"
              stroke="rgba(108,99,255,0.45)"
              stroke-width="${s.small ? '0.8' : '1.2'}"
              stroke-linejoin="round"
              style="transition:all 0.25s ease;"
            />
            ${!s.small ? `
              <text
                x="${s.label[0]}" y="${s.label[1]}"
                font-size="${s.name.length > 12 ? '5.5' : '6.5'}"
                fill="rgba(255,255,255,0.75)"
                text-anchor="middle"
                pointer-events="none"
                font-family="Inter,sans-serif"
                font-weight="600"
              >${s.name.split(' ').slice(0,2).join(' ')}</text>
            ` : ''}
          </g>
        `).join('')}

        <!-- Decorative dots for major cities -->
        <circle cx="299" cy="193" r="2.5" fill="rgba(255,200,100,0.8)" opacity="0.7"/>
        <circle cx="291" cy="420" r="2.5" fill="rgba(255,200,100,0.8)" opacity="0.7"/>
        <circle cx="565" cy="210" r="2.5" fill="rgba(255,200,100,0.8)" opacity="0.7"/>
      </svg>
    </div>

    <!-- Sidebar panel -->
    <div id="map-sidebar-panel" style="
      flex:1;min-width:${compact ? '180px' : '220px'};
      display:flex;flex-direction:column;gap:12px;
    ">
      <div id="map-hint-panel" style="
        padding:${compact ? '16px' : '24px'};
        background:var(--glass-bg);border:1px solid var(--glass-border);
        border-radius:var(--radius-xl);text-align:center;
        ${_selectedState ? 'display:none' : ''}
      ">
        <div style="font-size:${compact ? '2rem' : '2.5rem'};margin-bottom:8px">🗺️</div>
        <p style="font-size:0.8rem;color:var(--text-muted);line-height:1.6">${store.t('clickState')}</p>
      </div>

      <div id="map-state-panel" style="
        padding:${compact ? '16px' : '24px'};
        background:var(--glass-bg);border:1px solid var(--glass-border);
        border-radius:var(--radius-xl);
        ${_selectedState ? '' : 'display:none'}
      ">
        <div id="map-state-content"></div>
      </div>

      <!-- Popular states list -->
      <div style="
        background:var(--glass-bg);border:1px solid var(--glass-border);
        border-radius:var(--radius-xl);padding:${compact ? '12px' : '16px'};
      ">
        <div style="font-size:0.7rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px">
          🏆 Top States
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${['Maharashtra','Uttar Pradesh','Karnataka','Rajasthan','Bihar'].map(st => `
            <div class="state-list-btn" data-state="${st}" style="
              display:flex;align-items:center;justify-content:space-between;
              padding:8px 10px;border-radius:10px;
              background:transparent;border:1px solid var(--glass-border);
              cursor:pointer;transition:all 0.2s ease;font-size:0.78rem;
            ">
              <span style="font-weight:600;color:var(--text-secondary)">${st}</span>
              <span style="color:var(--primary-light);font-weight:700;font-size:0.7rem">${getSchemeCount(st)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // ── Attach events after a tick ──────────────────────────────
  setTimeout(() => {
    const svg = wrap.querySelector('#india-svg-main');
    if (!svg) return;

    // State path events
    svg.querySelectorAll('path[data-state]').forEach(path => {
      const sName = path.dataset.state;
      path.addEventListener('mouseenter', () => {
        if (sName !== _selectedState) {
          path.style.fill = 'rgba(108,99,255,0.5)';
          path.style.stroke = 'rgba(108,99,255,0.8)';
          path.style.filter = 'url(#state-glow)';
        }
      });
      path.addEventListener('mouseleave', () => {
        if (sName !== _selectedState) {
          path.style.fill = 'url(#map-grad-default)';
          path.style.stroke = 'rgba(108,99,255,0.45)';
          path.style.filter = '';
        }
      });
      path.addEventListener('click', () => selectState(wrap, sName, compact));
    });

    // Sidebar list buttons
    wrap.querySelectorAll('.state-list-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(108,99,255,0.15)';
        btn.style.borderColor = 'rgba(108,99,255,0.4)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'transparent';
        btn.style.borderColor = 'var(--glass-border)';
      });
      btn.addEventListener('click', () => selectState(wrap, btn.dataset.state, compact));
    });

    // Restore previously selected state
    if (_selectedState) selectState(wrap, _selectedState, compact, true);
  }, 0);

  return wrap;
}

function selectState(wrap, stateName, compact, silent = false) {
  _selectedState = stateName;
  store.setState({ selectedState: stateName, selectedCity: null });

  // Reset all paths
  wrap.querySelectorAll('#india-svg-main path[data-state]').forEach(p => {
    p.style.fill = 'url(#map-grad-default)';
    p.style.stroke = 'rgba(108,99,255,0.45)';
    p.style.filter = '';
    p.style.transform = '';
  });

  // Highlight selected
  const selPath = wrap.querySelector(`#india-svg-main path[data-state="${stateName}"]`);
  if (selPath) {
    selPath.style.fill = 'url(#map-grad-selected)';
    selPath.style.stroke = 'rgba(108,99,255,0.9)';
    selPath.style.filter = 'url(#state-glow)';
  }

  // Show state panel
  const hintPanel  = wrap.querySelector('#map-hint-panel');
  const statePanel = wrap.querySelector('#map-state-panel');
  const content    = wrap.querySelector('#map-state-content');
  if (hintPanel)  hintPanel.style.display  = 'none';
  if (statePanel) statePanel.style.display = 'block';

  const count  = getSchemeCount(stateName);
  const cities = getCities(stateName);

  if (content) {
    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;animation:fadeInUp 0.3s ease">
        <div style="font-size:1.3rem">📍</div>
        <div style="font-family:var(--font-heading);font-size:${compact ? '1rem' : '1.15rem'};font-weight:800;color:var(--primary-light)">${stateName}</div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        <span style="padding:4px 10px;border-radius:var(--radius-full);background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.4);font-size:0.72rem;font-weight:700;color:var(--primary-light)">
          📋 ${count} schemes
        </span>
        <span style="padding:4px 10px;border-radius:var(--radius-full);background:rgba(78,204,163,0.15);border:1px solid rgba(78,204,163,0.3);font-size:0.72rem;font-weight:700;color:var(--success)">
          ✅ ~${Math.floor(count * 0.4)} eligible
        </span>
      </div>

      <div style="margin-bottom:12px">
        <label style="font-size:0.72rem;color:var(--text-muted);font-weight:600;letter-spacing:0.5px;text-transform:uppercase;display:block;margin-bottom:6px">${store.t('selectCity')}</label>
        <select id="map-city-select" class="input-field" style="font-size:0.82rem;padding:8px 12px">
          <option value="">All Cities</option>
          ${cities.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>

      <button class="btn btn-primary w-full" id="map-view-schemes-btn" style="font-size:0.85rem;padding:10px">
        📋 ${store.t('viewSchemes')}
      </button>
    `;

    wrap.querySelector('#map-city-select')?.addEventListener('change', (e) => {
      store.setState({ selectedCity: e.target.value || null });
    });

    wrap.querySelector('#map-view-schemes-btn')?.addEventListener('click', () => {
      const city = wrap.querySelector('#map-city-select')?.value;
      store.setState({
        selectedCity: city || null,
        schemeFilter: { category: 'all', search: '', state: stateName }
      });
      router.navigate('schemes');
    });
  }

  if (!silent && _onStateSelect) _onStateSelect(stateName);
}
