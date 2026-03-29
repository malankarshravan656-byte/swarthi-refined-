// Interactive India Map Page – Mobile Portrait Layout
import { store } from '../store.js';
import { router } from '../router.js';
import { getCities, getSchemeCount } from '../data/states.js';
import mapBannerImg from '../assets/map_banner.png';

export function renderMap(outlet) {
  const lang = store.state.language || 'en';

  outlet.innerHTML = `
    <div class="mobile-inner-page">

      <!-- Banner image -->
      <img class="mobile-banner-img" src="${mapBannerImg}" alt="India Map Banner"
           style="object-position:center top;" onerror="this.style.display='none'"/>

      <!-- Page title -->
      <div style="padding:14px 16px 10px">
        <div style="font-family:'Noto Serif Devanagari',serif;font-size:1.05rem;font-weight:700;color:#1E0E00">
          ${store.t('mapTitle')}
        </div>
        <div style="font-size:0.72rem;color:#A08060;margin-top:2px">${store.t('mapSubtitle')}</div>
      </div>

      <!-- SVG Map (full width, portrait-optimised) -->
      <div style="padding:0 14px 12px">
        <div style="
          background:#FEFAF5;border-radius:16px;
          border:1px solid rgba(220,180,120,0.35);
          overflow:hidden;padding:10px;
          box-shadow:0 2px 10px rgba(80,40,0,0.07);
          position:relative;
        ">
          <div style="
            position:absolute;top:10px;left:10px;z-index:2;
            display:flex;align-items:center;gap:5px;
            padding:4px 10px;border-radius:999px;
            background:rgba(78,140,110,0.12);border:1px solid rgba(78,140,110,0.35);
            font-size:0.65rem;font-weight:700;color:#2D6B52;
          ">
            <span style="width:5px;height:5px;border-radius:50%;background:#2D6B52;display:inline-block"></span>
            Interactive Map
          </div>
          <svg id="india-svg" viewBox="0 0 612 700"
               xmlns="http://www.w3.org/2000/svg"
               style="width:100%;height:auto;display:block">
            ${generateIndiaSVG()}
          </svg>
        </div>
      </div>

      <!-- Popular states quick-chips -->
      <div style="padding:0 14px 14px">
        <div style="font-size:0.68rem;font-weight:700;color:#A08060;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px">
          🏆 ${store.t('popularStates') || 'Top States'}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px" id="state-chips">
          ${['Maharashtra','Uttar Pradesh','Karnataka','Rajasthan','Bihar','Tamil Nadu','Gujarat','West Bengal'].map(s => `
            <button class="state-chip-btn" data-state="${s}" style="
              padding:5px 12px;border-radius:999px;font-size:0.72rem;font-weight:600;
              cursor:pointer;background:#FEFAF5;border:1px solid rgba(220,180,120,0.4);
              color:#7A5230;transition:all 0.2s ease;font-family:inherit;
            ">${s}</button>
          `).join('')}
        </div>
      </div>

      <!-- State details panel (shown on selection) -->
      <div id="state-info-panel" style="display:none;padding:0 14px 20px">
        <div id="state-details-content" style="
          background:#FEFAF5;border:1px solid rgba(220,180,120,0.35);
          border-radius:16px;padding:16px;
          box-shadow:0 2px 8px rgba(80,40,0,0.07);
        "></div>
      </div>

    </div>
  `;

  // SVG path click handlers
  document.querySelectorAll('#india-svg path[data-state]').forEach(path => {
    path.addEventListener('click', () => selectState(path.dataset.state));
    path.addEventListener('mouseenter', () => {
      if (!path.classList.contains('selected')) path.style.fill = 'rgba(224,123,0,0.35)';
    });
    path.addEventListener('mouseleave', () => {
      if (!path.classList.contains('selected')) path.style.fill = '';
    });
  });

  // State-chip click handlers
  document.querySelectorAll('.state-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectState(btn.dataset.state);
      setTimeout(() => {
        document.getElementById('state-info-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });
  });

  // Restore previously selected state
  if (store.state.selectedState) selectState(store.state.selectedState);
}

function selectState(stateName) {
  store.setState({ selectedState: stateName, selectedCity: null });

  // Highlight SVG path
  document.querySelectorAll('#india-svg path').forEach(p => {
    p.style.fill = '';
    p.classList.remove('selected');
  });
  const stateEl = document.querySelector(`#india-svg path[data-state="${stateName}"]`);
  if (stateEl) {
    stateEl.style.fill = 'rgba(224,123,0,0.55)';
    stateEl.classList.add('selected');
  }

  // Highlight chip
  document.querySelectorAll('.state-chip-btn').forEach(btn => {
    const active = btn.dataset.state === stateName;
    btn.style.background  = active ? '#E07B00' : '#FEFAF5';
    btn.style.color       = active ? '#fff'    : '#7A5230';
    btn.style.borderColor = active ? '#E07B00' : 'rgba(220,180,120,0.4)';
  });

  const count  = getSchemeCount(stateName);
  const cities = getCities(stateName);
  const panel  = document.getElementById('state-info-panel');
  const content = document.getElementById('state-details-content');
  if (panel) panel.style.display = 'block';
  if (content) {
    content.innerHTML = `
      <!-- Header row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div>
          <div style="font-family:'Noto Serif Devanagari',serif;font-size:1rem;font-weight:700;color:#1E0E00">${stateName}</div>
          <div style="font-size:0.72rem;color:#A08060;margin-top:2px">📋 ${count} ${store.t('schemesAvailable')}</div>
        </div>
        <div style="
          font-size:0.68rem;font-weight:700;padding:4px 10px;
          border-radius:999px;background:rgba(74,140,110,0.12);
          color:#2D6B52;border:1px solid rgba(74,140,110,0.3);
        ">~${Math.floor(count * 0.4)} matched</div>
      </div>

      <!-- City select -->
      <div style="margin-bottom:12px">
        <select id="city-select" style="
          width:100%;padding:10px 32px 10px 12px;border-radius:10px;
          background:#F5E6D3;border:1px solid rgba(220,180,120,0.4);
          color:#1E0E00;font-size:0.82rem;font-family:inherit;
          -webkit-appearance:none;appearance:none;
          background-image:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23A08060%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>');
          background-repeat:no-repeat;background-position:right 10px center;background-size:16px;
        ">
          <option value="">${store.t('allCitiesOption') || 'All Cities'}</option>
          ${cities.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
      </div>

      <!-- CTA button -->
      <button id="view-state-schemes" style="
        width:100%;padding:13px;border-radius:12px;
        background:linear-gradient(135deg,#E07B00,#C85A00);color:#fff;
        font-size:0.88rem;font-weight:700;border:none;cursor:pointer;
        font-family:inherit;box-shadow:0 3px 10px rgba(224,123,0,0.35);
        transition:all 0.2s ease;
      ">📋 ${store.t('viewSchemes')}</button>
    `;

    document.getElementById('city-select')?.addEventListener('change', e => {
      store.setState({ selectedCity: e.target.value || null });
    });
    document.getElementById('view-state-schemes')?.addEventListener('click', () => {
      const city = document.getElementById('city-select')?.value;
      store.setState({ selectedCity: city || null, schemeFilter: { category: 'all', search: '', state: stateName } });
      router.navigate('schemes');
    });
  }
}

// Compact India SVG for 612×700 viewBox
function generateIndiaSVG() {
  const states = [
    { name:'Jammu & Kashmir',    d:'M160,20 L230,20 L250,60 L210,90 L160,80 Z' },
    { name:'Himachal Pradesh',   d:'M210,90 L260,80 L270,120 L220,130 Z' },
    { name:'Punjab',             d:'M160,80 L210,90 L220,130 L170,135 Z' },
    { name:'Uttarakhand',        d:'M270,120 L320,110 L330,150 L270,155 Z' },
    { name:'Haryana',            d:'M170,135 L220,130 L225,165 L175,170 Z' },
    { name:'Delhi',              d:'M220,155 L235,155 L235,170 L220,170 Z', special:true },
    { name:'Rajasthan',          d:'M120,140 L220,135 L225,230 L120,250 Z' },
    { name:'Uttar Pradesh',      d:'M225,165 L340,155 L350,235 L225,240 Z' },
    { name:'Bihar',              d:'M350,175 L420,170 L425,220 L350,225 Z' },
    { name:'Sikkim',             d:'M420,160 L440,155 L445,175 L420,178 Z', small:true },
    { name:'Assam',              d:'M440,155 L510,148 L520,185 L440,192 Z' },
    { name:'West Bengal',        d:'M420,195 L460,188 L470,270 L420,275 Z' },
    { name:'Jharkhand',          d:'M350,235 L420,228 L425,285 L350,288 Z' },
    { name:'Odisha',             d:'M350,290 L430,285 L435,355 L355,360 Z' },
    { name:'Chhattisgarh',       d:'M265,240 L355,235 L360,320 L265,325 Z' },
    { name:'Madhya Pradesh',     d:'M170,240 L365,235 L360,290 L268,295 L170,290 Z' },
    { name:'Gujarat',            d:'M80,240 L170,240 L175,320 L90,340 Z' },
    { name:'Maharashtra',        d:'M90,310 L360,310 L365,400 L90,410 Z' },
    { name:'Telangana',          d:'M265,390 L375,385 L380,445 L265,450 Z' },
    { name:'Andhra Pradesh',     d:'M265,450 L440,440 L445,510 L270,515 Z' },
    { name:'Karnataka',          d:'M120,400 L265,395 L270,500 L120,505 Z' },
    { name:'Kerala',             d:'M130,510 L215,505 L215,590 L135,595 Z' },
    { name:'Tamil Nadu',         d:'M215,505 L380,500 L340,610 L215,615 Z' },
    { name:'Goa',                d:'M105,470 L135,468 L137,490 L105,492 Z', small:true },
  ];

  const paths = states.map(s => `
    <path data-state="${s.name}" d="${s.d}" title="${s.name}">
      <title>${s.name} – ${getSchemeCount(s.name)} schemes</title>
    </path>
  `).join('');

  const labels = states.filter(s => !s.small).map(s => {
    const c = parseCentroid(s.d);
    return `<text x="${c.x}" y="${c.y}" font-size="${s.special ? 5 : 7}"
      fill="rgba(80,40,0,0.55)" text-anchor="middle" pointer-events="none"
      font-family="Inter,sans-serif" font-weight="600">
      ${s.name.split(' ')[0]}
    </text>`;
  }).join('');

  return paths + labels;
}

function parseCentroid(d) {
  const nums = d.match(/[\d.]+/g).map(Number);
  const xs = [], ys = [];
  for (let i = 0; i < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
  return {
    x: xs.reduce((a, b) => a + b, 0) / xs.length,
    y: ys.reduce((a, b) => a + b, 0) / ys.length,
  };
}
