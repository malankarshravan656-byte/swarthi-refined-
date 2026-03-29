// Scheme Card Component
import { store } from '../store.js';
import { showToast } from './toast.js';
import { setRobotMood } from './robot.js';

export function createSchemeCard(scheme, index = 0) {
  const card = document.createElement('div');
  card.className = 'scheme-card';
  card.style.animationDelay = `${index * 0.08}s`;
  card.style.opacity = '0';
  card.style.animation = `fadeInUp 0.5s ease ${index * 0.08}s forwards`;

  const score = scheme.eligibilityScore || 75;
  const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--accent)';
  const circumference = 2 * Math.PI * 20;
  const dashOffset = circumference - (score / 100) * circumference;

  const catColors = {
    agriculture: 'linear-gradient(135deg,#2d5a27,#4CAF50)',
    health:      'linear-gradient(135deg,#5a1a1a,#FF6B6B)',
    education:   'linear-gradient(135deg,#1a1a5a,#6C63FF)',
    women:       'linear-gradient(135deg,#5a1a3a,#FF6BAD)',
    youth:       'linear-gradient(135deg,#5a3a1a,#FFB347)',
    finance:     'linear-gradient(135deg,#1a4a3a,#4ECCA3)',
    housing:     'linear-gradient(135deg,#1a3a5a,#64C8FF)',
  };

  const schemeNameKey = store.state.language === 'hi' ? 'nameHi' :
                        store.state.language === 'mr' ? 'nameMr' : 'name';
  const displayName = scheme[schemeNameKey] || scheme.name;

  card.innerHTML = `
    <div class="scheme-card-header">
      <div style="display:flex;align-items:center;gap:var(--space-3);flex:1">
        <div class="scheme-card-icon" style="background:${catColors[scheme.category] || catColors.finance}">
          ${scheme.emoji}
        </div>
        <div>
          <div class="scheme-card-title">${displayName}</div>
          <div class="scheme-card-subtitle">${scheme.ministry}</div>
        </div>
      </div>
      <div>
        <div class="scheme-tag tag-${scheme.category}">${store.t(scheme.category)}</div>
      </div>
    </div>

    <div class="scheme-card-benefits">${scheme.benefits.substring(0, 120)}...</div>

    <!-- Details expandable -->
    <div class="scheme-card-details" id="details-${scheme.id}">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);margin:var(--space-3) 0">
        <div>
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px">${store.t('eligibility')}</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">${scheme.eligibility}</div>
        </div>
        <div>
          <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:6px">${store.t('benefits')}</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6">${scheme.benefits}</div>
        </div>
      </div>
      <div style="margin-top:var(--space-3)">
        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">${store.t('documents')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${scheme.documents.map(doc => `
            <span style="
              padding:4px 10px;border-radius:var(--radius-full);
              background:rgba(108,99,255,0.1);
              border:1px solid rgba(108,99,255,0.2);
              font-size:0.72rem;font-weight:600;color:var(--primary-light)
            ">📄 ${doc}</span>
          `).join('')}
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--glass-border);">
        <div>
          <div style="font-size:0.7rem;color:var(--text-muted)">Benefit Amount</div>
          <div style="font-size:1rem;font-weight:700;color:var(--success)">${scheme.amount}</div>
        </div>
        <div>
          <div style="font-size:0.7rem;color:var(--text-muted)">Applicants</div>
          <div style="font-size:0.9rem;font-weight:600;color:var(--text-primary)">${scheme.applicants}</div>
        </div>
        <div>
          <div style="font-size:0.7rem;color:var(--text-muted)">Deadline</div>
          <div style="font-size:0.9rem;font-weight:600;color:${scheme.deadline === 'Ongoing' ? 'var(--success)' : 'var(--warning)'}">${scheme.deadline}</div>
        </div>
      </div>
    </div>

    <div class="scheme-card-footer">
      <div style="display:flex;gap:var(--space-2)">
        <button class="btn btn-primary btn-sm apply-btn" data-id="${scheme.id}" id="apply-btn-${scheme.id}">
          🚀 ${store.t('applyNow')}
        </button>
        <button class="btn btn-ghost btn-sm expand-btn" data-id="${scheme.id}" id="expand-btn-${scheme.id}">
          ${store.t('learnMore')} ▾
        </button>
      </div>
      <div class="eligibility-ring">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
          <circle cx="28" cy="28" r="20" fill="none" 
                  stroke="${scoreColor}" stroke-width="4"
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${dashOffset}"
                  stroke-linecap="round"
                  style="transition:stroke-dashoffset 1s ease"/>
        </svg>
        <div class="ring-label" style="color:${scoreColor}">${score}%</div>
      </div>
    </div>
  `;

  // Expand/collapse details
  const expandBtn = card.querySelector('.expand-btn');
  const details = card.querySelector(`#details-${scheme.id}`);
  if (expandBtn && details) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = details.classList.toggle('expanded');
      expandBtn.textContent = isExpanded ? `${store.t('collapse')} ▴` : `${store.t('learnMore')} ▾`;
    });
  }

  // Apply button
  const applyBtn = card.querySelector('.apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showApplyAnimation(scheme);
    });
  }

  return card;
}

function showApplyAnimation(scheme) {
  const overlay = document.getElementById('apply-overlay');
  if (!overlay) return;

  setRobotMood('think', true);

  const schemeNameKey = store.state.language === 'hi' ? 'nameHi' :
                        store.state.language === 'mr' ? 'nameMr' : 'name';
  const displayName = scheme[schemeNameKey] || scheme.name;

  const user = store.state.user || {};
  const fields = [
    { label: 'Full Name', value: user.name || 'Ramesh Kumar', delay: 300 },
    { label: 'Aadhaar Number', value: '****  ****  ' + Math.floor(1000 + Math.random() * 9000), delay: 700 },
    { label: 'Date of Birth', value: '15 / 06 / 199' + Math.floor(0 + Math.random() * 9), delay: 1100 },
    { label: 'State', value: user.state || 'Maharashtra', delay: 1500 },
    { label: 'Annual Income', value: user.income || 'Below ₹1 Lakh', delay: 1900 },
    { label: 'Bank Account', value: 'SBIN0012****', delay: 2300 },
  ];

  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <div class="apply-form-box">
      <div style="text-align:center;margin-bottom:var(--space-6)">
        <div style="font-size:2rem;margin-bottom:8px">🤖</div>
        <h3 style="font-family:var(--font-heading);font-size:1.3rem;font-weight:700">${store.t('applyForMe')}</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">${displayName}</p>
      </div>

      <div id="auto-fill-fields" style="display:flex;flex-direction:column;gap:var(--space-3);margin-bottom:var(--space-6)">
        ${fields.map(f => `
          <div class="form-auto-field" id="aff-${f.label.replace(/\s/g,'-')}" style="display:flex;justify-content:space-between;">
            <span style="font-size:0.8rem;color:var(--text-muted)">${f.label}</span>
            <span id="aff-val-${f.label.replace(/\s/g,'-')}" style="font-size:0.85rem;color:var(--text-muted)">—</span>
          </div>
        `).join('')}
      </div>

      <div id="apply-progress-wrap" style="margin-bottom:var(--space-6)">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:0.8rem;color:var(--text-muted)">Auto-filling application...</span>
          <span id="apply-pct" style="font-size:0.8rem;font-weight:700;color:var(--primary-light)">0%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar" id="apply-progress-bar" style="width:0%"></div>
        </div>
      </div>

      <div id="apply-done-msg" class="hidden" style="text-align:center">
        <div style="font-size:3rem;margin-bottom:8px">🎉</div>
        <h4 style="font-family:var(--font-heading);font-weight:700;color:var(--success)">Application Submitted!</h4>
        <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">Your application has been registered successfully</p>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px">Ref: SS${Date.now().toString().slice(-8)}</p>
      </div>

      <button id="apply-close-btn" class="btn btn-ghost w-full hidden" style="margin-top:var(--space-4)">
        Close
      </button>
    </div>
  `;

  // Animate auto-fill
  fields.forEach(f => {
    setTimeout(() => {
      const el = document.getElementById(`aff-${f.label.replace(/\s/g,'-')}`);
      const valEl = document.getElementById(`aff-val-${f.label.replace(/\s/g,'-')}`);
      if (el) el.classList.add('form-auto-fill');
      if (valEl) valEl.textContent = f.value;

      const pct = Math.round(((fields.indexOf(f) + 1) / fields.length) * 100);
      const bar = document.getElementById('apply-progress-bar');
      const pctEl = document.getElementById('apply-pct');
      if (bar) bar.style.width = `${pct}%`;
      if (pctEl) pctEl.textContent = `${pct}%`;
    }, f.delay);
  });

  // Final completion
  setTimeout(() => {
    const doneMsg = document.getElementById('apply-done-msg');
    const closeBtn = document.getElementById('apply-close-btn');
    const progressWrap = document.getElementById('apply-progress-wrap');
    if (doneMsg) doneMsg.classList.remove('hidden');
    if (closeBtn) closeBtn.classList.remove('hidden');
    if (progressWrap) progressWrap.style.display = 'none';

    setRobotMood('success', true);
    showToast('Application submitted successfully! 🎉', 'success', 5000);

    // Update roadmap
    store.setState({ roadmapStep: Math.max(store.state.roadmapStep, 1) });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        setRobotMood('wave');
      });
    }
  }, 3000);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
}
