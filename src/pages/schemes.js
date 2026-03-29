// Schemes Listing Page
import { store } from '../store.js';
import { showRobot, setRobotMood } from '../components/robot.js';
import { createSchemeCard } from '../components/schemeCard.js';
import { createVoiceButton } from '../components/voiceSearch.js';
import { allSchemes, getSchemesByCategory, categories } from '../data/schemes.js';

export function renderSchemes(outlet) {
  showRobot();
  setRobotMood('hint', true);

  const filter = store.state.schemeFilter || { category: 'all', search: '', state: null };

  outlet.innerHTML = `
    <div class="page indian-bg mandala-bg" style="position:relative;z-index:1">
      <div class="container" style="position:relative;z-index:1">

        <!-- Header -->
        <div class="schemes-header anim-fade-in-up page-header-cultural">
          <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-4)">
            <div>
              <div class="cultural-section-header">
                <h1 style="font-size:2rem">${store.t('schemesTitle')}</h1>
                <div class="section-hindi">सरकारी योजनाएं — आपके लिए</div>
              </div>
              <p style="color:var(--text-secondary);margin-top:6px">${allSchemes.length}+ government schemes tailored for you</p>
            </div>
            <div style="margin-left:auto;display:flex;align-items:center;gap:var(--space-3)">
              <div id="voice-slot-schemes"></div>
            </div>
          </div>

          <!-- Search -->
          <div class="search-bar" style="margin-bottom:var(--space-5)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" id="scheme-search" placeholder="${store.t('searchSchemes')}" value="${filter.search || ''}"/>
          </div>

          <!-- Category Filters -->
          <div class="filters-row" id="category-filters">
            ${categories.map(cat => `
              <button class="filter-pill ${filter.category === cat ? 'active' : ''}" data-cat="${cat}" id="cat-${cat}">
                ${getCatEmoji(cat)} ${store.t(cat === 'all' ? 'allCategories' : cat)}
              </button>
            `).join('')}
          </div>

          <!-- Active state filter -->
          ${filter.state ? `
            <div style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-3)">
              <span style="font-size:0.8rem;color:var(--text-muted)">Filtering for:</span>
              <div class="filter-pill active" style="cursor:default">🗺️ ${filter.state}</div>
              <button id="clear-state-filter" class="filter-pill" style="color:var(--accent)">✕ Clear</button>
            </div>
          ` : ''}
        </div>

        <!-- Results count -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5)">
          <span id="results-count" style="font-size:0.875rem;color:var(--text-secondary)">Loading...</span>
          <div style="display:flex;gap:var(--space-2)">
            <button class="filter-pill active" id="sort-relevance">✨ Best Match</button>
          </div>
        </div>

        <!-- Schemes Grid -->
        <div class="schemes-grid" id="schemes-grid">
          ${[1,2,3,4,5,6].map(() => `<div class="skeleton" style="height:220px;border-radius:var(--radius-xl)"></div>`).join('')}
        </div>

        <!-- Empty state -->
        <div id="empty-state" class="hidden" style="text-align:center;padding:var(--space-16) 0">
          <div style="font-size:4rem;margin-bottom:var(--space-4)">🔍</div>
          <h3 style="font-family:var(--font-heading);font-weight:700;margin-bottom:var(--space-2)">${store.t('noSchemesFound')}</h3>
          <p style="color:var(--text-muted);font-size:0.9rem">Try searching with different keywords or clearing filters</p>
        </div>

      </div>
    </div>
  `;

  // Voice search
  const voiceSlot = document.getElementById('voice-slot-schemes');
  if (voiceSlot) {
    const vBtn = createVoiceButton((text) => {
      const searchEl = document.getElementById('scheme-search');
      if (searchEl) { searchEl.value = text; }
      filterAndRender(text, getCurrentCat());
    });
    vBtn.style.width = '48px';
    vBtn.style.height = '48px';
    voiceSlot.appendChild(vBtn);
  }

  // Category filter clicks
  document.querySelectorAll('.filter-pill[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      store.setState({ schemeFilter: { ...store.state.schemeFilter, category: cat } });
      filterAndRender(getCurrentSearch(), cat);
    });
  });

  // Search input
  let searchTimer;
  document.getElementById('scheme-search')?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      store.setState({ schemeFilter: { ...store.state.schemeFilter, search: e.target.value } });
      filterAndRender(e.target.value, getCurrentCat());
    }, 300);
  });

  // Clear state filter
  document.getElementById('clear-state-filter')?.addEventListener('click', () => {
    store.setState({ schemeFilter: { ...store.state.schemeFilter, state: null } });
    filterAndRender(getCurrentSearch(), getCurrentCat());
  });

  // Initial render
  setTimeout(() => filterAndRender(filter.search || '', filter.category || 'all'), 80);
}

function getCurrentSearch() {
  return document.getElementById('scheme-search')?.value || '';
}
function getCurrentCat() {
  return document.querySelector('.filter-pill[data-cat].active')?.dataset.cat || 'all';
}
function getCatEmoji(cat) {
  const map = { all:'🌐', agriculture:'🌾', health:'🏥', education:'📚', women:'👩', youth:'🎓', finance:'💰', housing:'🏠' };
  return map[cat] || '📋';
}

function filterAndRender(search = '', category = 'all') {
  const stateFilter = store.state.schemeFilter?.state;
  let result = [...allSchemes];

  if (category !== 'all') result = result.filter(s => s.category === category);
  if (stateFilter) result = result.filter(s => !s.state || s.state === stateFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.benefits.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('schemes-grid');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('results-count');

  if (!grid) return;

  if (countEl) countEl.textContent = `${result.length} scheme${result.length !== 1 ? 's' : ''} found`;

  if (result.length === 0) {
    grid.innerHTML = '';
    emptyState?.classList.remove('hidden');
  } else {
    emptyState?.classList.add('hidden');
    grid.innerHTML = '';
    result.forEach((scheme, i) => {
      grid.appendChild(createSchemeCard(scheme, i));
    });
    if (window.lucide) window.lucide.createIcons();
  }
}
