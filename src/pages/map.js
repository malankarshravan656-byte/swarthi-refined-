// Interactive India Map Page
import { store } from '../store.js';
import { router } from '../router.js';
import { showRobot, setRobotMood } from '../components/robot.js';
import { statesData, getCities, getSchemeCount } from '../data/states.js';

export function renderMap(outlet) {
  showRobot();
  setRobotMood('hint', true);

  outlet.innerHTML = `
    <div class="page map-page indian-bg" style="position:relative;z-index:1">
      <div class="container" style="position:relative;z-index:1">
        <div class="map-header anim-fade-in-up page-header-cultural">
          <div class="cultural-section-header" style="align-items:center;text-align:center">
            <h1>${store.t('mapTitle')}</h1>
            <div class="section-hindi">राज्यवार सरकारी योजनाएं खोजें</div>
            <p style="color:var(--text-secondary);margin-top:6px">${store.t('mapSubtitle')}</p>
          </div>
        </div>

        <div class="map-container">
          <!-- SVG Map -->
          <div class="india-map-wrap anim-fade-in-left">
            <div style="position:absolute;top:12px;left:12px;z-index:2">
              <div class="offline-badge">
                <div class="offline-dot" style="background:var(--success)"></div>
                <span style="color:var(--success)">Interactive Map</span>
              </div>
            </div>
            <svg id="india-svg" viewBox="0 0 612 700" xmlns="http://www.w3.org/2000/svg">
              ${generateIndiaSVG()}
            </svg>
          </div>

          <!-- Sidebar -->
          <div class="map-sidebar anim-fade-in-right">
            <!-- State Info Panel -->
            <div class="map-state-info" id="state-info-panel">
              <div id="state-placeholder" class="map-hint">
                <div style="font-size:3rem;margin-bottom:var(--space-3)">🗺️</div>
                <p>${store.t('clickState')}</p>
              </div>
              <div id="state-details" class="hidden"></div>
            </div>

            <!-- Popular States -->
            <div style="background:linear-gradient(135deg,rgba(255,249,240,0.85),rgba(255,255,255,0.95));
              border:1px solid rgba(255,153,51,0.18);border-radius:var(--radius-xl);padding:var(--space-5);border-top:3px solid var(--saffron)">
              <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:var(--space-4)">
                <span style="font-size:0.75rem;font-weight:700;color:var(--text-muted);letter-spacing:0.8px;text-transform:uppercase">🏆 Top States</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:var(--space-2)">
                ${['Maharashtra','Uttar Pradesh','Karnataka','Rajasthan','Bihar'].map(s => `
                  <div class="state-list-item" data-state="${s}" style="
                    display:flex;align-items:center;justify-content:space-between;
                    padding:10px 14px;border-radius:var(--radius-lg);
                    background:rgba(255,255,255,0.7);border:1px solid rgba(255,153,51,0.14);
                    cursor:pointer;transition:all 0.35s ease
                  " onmouseover="this.style.background='rgba(255,249,240,1)';this.style.borderColor='rgba(255,153,51,0.40)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.7)';this.style.borderColor='rgba(255,153,51,0.14)'">
                    <span style="font-size:0.875rem;font-weight:600;color:var(--text-primary)">${s}</span>
                    <span style="font-size:0.75rem;color:var(--saffron);font-weight:700">${getSchemeCount(s)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Click handlers on SVG state paths
  document.querySelectorAll('#india-svg path[data-state]').forEach(path => {
    path.addEventListener('click', () => selectState(path.dataset.state));
    path.addEventListener('mouseenter', () => {
      if (!path.classList.contains('selected')) {
        path.style.fill = 'rgba(108,99,255,0.4)';
      }
    });
    path.addEventListener('mouseleave', () => {
      if (!path.classList.contains('selected')) {
        path.style.fill = '';
      }
    });
  });

  // Sidebar list items
  document.querySelectorAll('.state-list-item').forEach(item => {
    item.addEventListener('click', () => selectState(item.dataset.state));
  });

  // Restore selected state
  if (store.state.selectedState) {
    selectState(store.state.selectedState);
  }
}

function selectState(stateName) {
  store.setState({ selectedState: stateName, selectedCity: null });

  // Update SVG highlighting
  document.querySelectorAll('#india-svg path').forEach(p => p.classList.remove('selected'));
  const stateEl = document.querySelector(`#india-svg path[data-state="${stateName}"]`);
  if (stateEl) stateEl.classList.add('selected');

  const count = getSchemeCount(stateName);
  const cities = getCities(stateName);

  const placeholder = document.getElementById('state-placeholder');
  const details = document.getElementById('state-details');
  if (placeholder) placeholder.classList.add('hidden');
  if (details) {
    details.classList.remove('hidden');
    details.innerHTML = `
      <div class="map-state-name anim-fade-in">${stateName}</div>
      <div style="display:flex;gap:var(--space-3);margin-bottom:var(--space-4)">
        <div style="padding:8px 16px;border-radius:var(--radius-full);background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);font-size:0.8rem;font-weight:700;color:var(--primary-light)">
          📋 ${count} ${store.t('schemesAvailable')}
        </div>
      </div>

      <div class="input-group" style="margin-bottom:var(--space-4)">
        <label class="input-label">${store.t('selectCity')}</label>
        <select id="city-select" class="input-field">
          <option value="">All Cities</option>
          ${cities.map(c => `<option value="${c}" ${store.state.selectedCity === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>

      <button class="btn btn-primary w-full" id="view-state-schemes">
        📋 ${store.t('viewSchemes')}
      </button>

      <div style="margin-top:var(--space-4);padding:var(--space-3) var(--space-4);background:rgba(78,204,163,0.1);border-radius:var(--radius-lg);border:1px solid rgba(78,204,163,0.3);font-size:0.8rem;color:var(--success)">
        ✅ Based on your profile, you match <strong>${Math.floor(count * 0.4)}</strong> of these schemes
      </div>
    `;

    document.getElementById('city-select')?.addEventListener('change', (e) => {
      store.setState({ selectedCity: e.target.value || null });
    });

    document.getElementById('view-state-schemes')?.addEventListener('click', () => {
      const city = document.getElementById('city-select')?.value;
      store.setState({ selectedCity: city || null, schemeFilter: { category: 'all', search: '', state: stateName } });
      router.navigate('schemes');
    });
  }
}

// Simplified India SVG with major states as clickable paths
function generateIndiaSVG() {
  // Simplified regional block map of India – each polygon approximates its geographical region
  const states = [
    { name:'Jammu & Kashmir', d:'M160,20 L230,20 L250,60 L210,90 L160,80 Z' },
    { name:'Himachal Pradesh', d:'M210,90 L260,80 L270,120 L220,130 Z' },
    { name:'Punjab', d:'M160,80 L210,90 L220,130 L170,135 Z' },
    { name:'Uttarakhand', d:'M270,120 L320,110 L330,150 L270,155 Z' },
    { name:'Haryana', d:'M170,135 L220,130 L225,165 L175,170 Z' },
    { name:'Delhi', d:'M220,155 L235,155 L235,170 L220,170 Z', special: true },
    { name:'Rajasthan', d:'M120,140 L220,135 L225,230 L120,250 Z' },
    { name:'Uttar Pradesh', d:'M225,165 L340,155 L350,235 L225,240 Z' },
    { name:'Bihar', d:'M350,175 L420,170 L425,220 L350,225 Z' },
    { name:'Sikkim', d:'M420,160 L440,155 L445,175 L420,178 Z', small:true },
    { name:'Assam', d:'M440,155 L510,148 L520,185 L440,192 Z' },
    { name:'West Bengal', d:'M420,195 L460,188 L470,270 L420,275 Z' },
    { name:'Jharkhand', d:'M350,235 L420,228 L425,285 L350,288 Z' },
    { name:'Odisha', d:'M350,290 L430,285 L435,355 L355,360 Z' },
    { name:'Chhattisgarh', d:'M265,240 L355,235 L360,320 L265,325 Z' },
    { name:'Madhya Pradesh', d:'M170,240 L365,235 L360,290 L268,295 L170,290 Z' },
    { name:'Gujarat', d:'M80,240 L170,240 L175,320 L90,340 Z' },
    { name:'Maharashtra', d:'M90,310 L360,310 L365,400 L90,410 Z' },
    { name:'Telangana', d:'M265,390 L375,385 L380,445 L265,450 Z' },
    { name:'Andhra Pradesh', d:'M265,450 L440,440 L445,510 L270,515 Z' },
    { name:'Karnataka', d:'M120,400 L265,395 L270,500 L120,505 Z' },
    { name:'Kerala', d:'M130,510 L215,505 L215,590 L135,595 Z' },
    { name:'Tamil Nadu', d:'M215,505 L380,500 L340,610 L215,615 Z' },
    { name:'Goa', d:'M105,470 L135,468 L137,490 L105,492 Z', small:true },
  ];

  return states.map(s => `
    <path
      data-state="${s.name}"
      d="${s.d}"
      title="${s.name}"
    >
      <title>${s.name} – ${getSchemeCount(s.name)} schemes</title>
    </path>
  `).join('') + `
    <!-- State labels -->
    ${states.filter(s => !s.small).map(s => {
      const coords = parseCentroid(s.d);
      return `<text x="${coords.x}" y="${coords.y}" font-size="${s.special ? '5' : '7'}" fill="rgba(255,255,255,0.6)" text-anchor="middle" pointer-events="none" font-family="Inter,sans-serif">${s.name.split(' ')[0]}</text>`;
    }).join('')}
  `;
}

function parseCentroid(d) {
  const nums = d.match(/[\d.]+/g).map(Number);
  let xs = [], ys = [];
  for (let i = 0; i < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i+1]); }
  return { x: xs.reduce((a,b)=>a+b,0)/xs.length, y: ys.reduce((a,b)=>a+b,0)/ys.length };
}
