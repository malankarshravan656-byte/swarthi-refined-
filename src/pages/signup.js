// Signup Page – Extended 7-step onboarding with RAG preview
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';
import { hideRobot } from '../components/robot.js';
import { getAllStates, getCities } from '../data/states.js';
import { retrieveSchemes } from '../ai/rag.js';
import { createVoiceButton } from '../components/voiceSearch.js';

const TOTAL_STEPS = 7;
let currentStep = 1;
let formData = {};

const occupations = ['Farmer','Agricultural Labourer','Daily Wage Worker','Self-Employed / Business','Private Employee','Government Employee','Student','Homemaker','Unemployed','Senior Citizen'];
const incomeRanges = ['Below ₹1 Lakh','₹1–3 Lakh','₹3–5 Lakh','₹5–8 Lakh','₹8–10 Lakh','Above ₹10 Lakh'];
const categories   = ['General','OBC','SC','ST'];
const educationLevels = ['Below 8th Class','8th Class','10th Class (SSC)','12th Class (HSC)','Diploma / ITI','Graduate','Post Graduate'];
const disabilityOptions = ['No Disability','Physical Disability','Visual Impairment','Hearing Impairment','Intellectual Disability','Other'];
const userTypes = ['Farmer','Daily Wage Worker','Self-Employed','Student','Salaried','Homemaker','Senior Citizen'];

const STEP_LABELS = [
  'Account Details',
  'Identity & Name',
  'Date of Birth & Gender',
  'Occupation & Income',
  'State & City',
  'Category & Education',
  'Review & Submit',
];
const STEP_EMOJIS = ['🔐','👤','🎂','💼','📍','🏷️','✅'];

export function renderSignup(outlet) {
  hideRobot();
  currentStep = 1;
  formData = {};
  renderStep(outlet);
}

function renderStep(outlet) {
  outlet.innerHTML = `
    <div class="auth-page gradient-bg">
      <div class="auth-bg"></div>
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>
      <div style="position:absolute;top:0;left:0;right:0;height:4px;background:var(--grad-tricolor);z-index:2"></div>

      <div class="auth-card" style="max-width:540px;padding:var(--space-7)">
        <div class="auth-logo" style="margin-bottom:var(--space-4)">
          <div class="auth-logo-icon">🇮🇳</div>
          <div>
            <div class="auth-logo-name">Scheme<span>Setu</span></div>
            <div style="font-size:0.68rem;color:var(--text-muted);text-align:center">AI Government Scheme Assistant</div>
          </div>
        </div>

        <!-- Step progress bar -->
        <div style="margin-bottom:var(--space-5)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="font-size:0.72rem;font-weight:600;color:var(--text-muted)">${STEP_EMOJIS[currentStep-1]} ${STEP_LABELS[currentStep-1]}</div>
            <div style="font-size:0.7rem;color:var(--text-muted)">Step ${currentStep}/${TOTAL_STEPS}</div>
          </div>
          <div style="height:5px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${(currentStep/TOTAL_STEPS)*100}%;background:var(--grad-primary);border-radius:3px;transition:width 0.5s cubic-bezier(.34,1.56,.64,1)"></div>
          </div>
          <!-- Dots -->
          <div style="display:flex;justify-content:space-between;margin-top:8px">
            ${Array.from({length:TOTAL_STEPS},(_,i)=>{
              const n=i+1;
              const done=n<currentStep, active=n===currentStep;
              return `<div style="
                width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
                font-size:0.62rem;font-weight:700;transition:all 0.3s;
                background:${done?'var(--success)':active?'var(--primary)':'rgba(255,255,255,0.07)'};
                border:2px solid ${done?'var(--success)':active?'var(--primary)':'rgba(255,255,255,0.12)'};
                color:${done||active?'white':'var(--text-muted)'};
              ">${done?'✓':n}</div>`;
            }).join('')}
          </div>
        </div>

        <div id="step-content">${getStepContent(outlet)}</div>

        <div style="display:flex;gap:var(--space-3);margin-top:var(--space-6)">
          ${currentStep>1?`<button class="btn btn-ghost" id="back-btn" style="flex:1">← Back</button>`:''}
          <button class="btn btn-primary" id="next-btn" style="flex:2;position:relative;overflow:hidden">
            ${currentStep===TOTAL_STEPS?'🚀 Create Account':'Continue →'}
          </button>
        </div>

        <p style="text-align:center;margin-top:var(--space-4);font-size:0.82rem;color:var(--text-muted)">
          Already have an account?
          <a href="#login" id="goto-login" style="color:var(--primary-light);font-weight:600;cursor:pointer;margin-left:4px">Sign In</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('back-btn')?.addEventListener('click', () => { currentStep--; renderStep(outlet); });
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (collectStepData()) {
      if (currentStep === TOTAL_STEPS) submitSignup(outlet);
      else { currentStep++; renderStep(outlet); }
    }
  });
  document.getElementById('goto-login')?.addEventListener('click', e => { e.preventDefault(); router.navigate('login'); });

  // State → city cascade
  document.getElementById('su-state')?.addEventListener('change', updateCityDropdown);

  // DOB → auto-age
  document.getElementById('su-dob')?.addEventListener('change', updateAge);

  // Voice buttons
  attachVoiceInputs();

  // Animate step content in
  setTimeout(() => {
    const content = document.getElementById('step-content');
    if (content) { content.style.opacity='0'; content.style.transform='translateX(20px)'; setTimeout(()=>{ content.style.transition='all 0.4s ease'; content.style.opacity='1'; content.style.transform='translateX(0)'; }, 10); }
  }, 0);
}

function getStepContent() {
  const states = getAllStates();
  switch(currentStep) {

    case 1: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="input-group">
          <label class="input-label">Full Name *</label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <input type="text" id="su-name" class="input-field" placeholder="e.g. Ramesh Kumar Sharma" value="${formData.name||''}" autocomplete="name"/>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Nickname (optional)</label>
          <input type="text" id="su-nickname" class="input-field" placeholder="What should we call you?" value="${formData.nickname||''}"/>
        </div>
        <div class="input-group">
          <label class="input-label">Email Address *</label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
            <input type="email" id="su-email" class="input-field" placeholder="you@example.com" value="${formData.email||''}" autocomplete="email"/>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Password *</label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" id="su-password" class="input-field" placeholder="Minimum 6 characters" autocomplete="new-password"/>
          </div>
        </div>
      </div>`;

    case 2: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div style="padding:var(--space-4);background:rgba(108,99,255,0.08);border-radius:var(--radius-lg);border:1px solid rgba(108,99,255,0.2);font-size:0.82rem;color:var(--text-secondary);line-height:1.7">
          👤 Your name and identity help us personalize scheme recommendations and generate pre-filled applications.
        </div>
        <div class="input-group">
          <label class="input-label">Phone Number *</label>
          <div class="input-icon-wrap">
            <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <input type="tel" id="su-phone" class="input-field" placeholder="+91 98765 43210" value="${formData.phone||''}" autocomplete="tel"/>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Aadhaar Number (last 4 digits - optional)</label>
          <input type="text" id="su-aadhaar" class="input-field" placeholder="XXXX" maxlength="4" value="${formData.aadhaar||''}"/>
        </div>
        <div style="padding:var(--space-3);background:rgba(78,204,163,0.08);border-radius:var(--radius-lg);border:1px solid rgba(78,204,163,0.2);font-size:0.75rem;color:var(--success)">
          🔒 Your data is stored locally and never shared with third parties.
        </div>
      </div>`;

    case 3: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
          <div class="input-group">
            <label class="input-label">Date of Birth *</label>
            <input type="date" id="su-dob" class="input-field" value="${formData.dob||''}" max="${new Date().toISOString().split('T')[0]}"/>
          </div>
          <div class="input-group">
            <label class="input-label">Your Age</label>
            <input type="number" id="su-age" class="input-field" placeholder="Auto-calculated" value="${formData.age||''}" min="1" max="120" readonly style="opacity:0.7;cursor:not-allowed"/>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Gender *</label>
          <div style="display:flex;gap:var(--space-3)">
            ${['Male','Female','Other'].map(g => `
              <label style="flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:var(--radius-lg);background:${formData.gender===g?'rgba(108,99,255,0.2)':'var(--glass-bg)'};border:1.5px solid ${formData.gender===g?'rgba(108,99,255,0.5)':'var(--glass-border)'};cursor:pointer;transition:all 0.2s;font-size:0.85rem">
                <input type="radio" name="su-gender" value="${g}" ${formData.gender===g?'checked':''} style="accent-color:var(--primary)"/>
                ${g==='Male'?'👨':g==='Female'?'👩':'🧑'} ${g}
              </label>`).join('')}
          </div>
        </div>
        ${formData.age ? `
        <div style="padding:var(--space-4);background:rgba(108,99,255,0.08);border-radius:var(--radius-lg);border:1px solid rgba(108,99,255,0.2);font-size:0.82rem;color:var(--text-secondary)">
          🎯 At age <strong>${formData.age}</strong>, you may qualify for schemes like ${parseInt(formData.age)<25?'<strong>NSP Scholarship, Skill India</strong>':parseInt(formData.age)>=60?'<strong>Old Age Pension, Ayushman Bharat</strong>':'<strong>PM Mudra Yojana, Atal Pension Yojana</strong>'}.
        </div>` : ''}
      </div>`;

    case 4: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="input-group">
          <label class="input-label">Occupation *</label>
          <select id="su-occupation" class="input-field">
            <option value="">Select your occupation</option>
            ${occupations.map(o=>`<option value="${o}" ${formData.occupation===o?'selected':''}>${o}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">User Type</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${userTypes.map(t=>`
              <label style="display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:var(--radius-full);background:${formData.userType===t?'rgba(108,99,255,0.2)':'var(--glass-bg)'};border:1px solid ${formData.userType===t?'rgba(108,99,255,0.5)':'var(--glass-border)'};cursor:pointer;font-size:0.78rem;transition:all 0.2s">
                <input type="radio" name="user-type" value="${t}" ${formData.userType===t?'checked':''} style="accent-color:var(--primary)"/> ${t}
              </label>`).join('')}
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Annual Household Income *</label>
          <select id="su-income" class="input-field">
            <option value="">Select income range</option>
            ${incomeRanges.map(i=>`<option value="${i}" ${formData.income===i?'selected':''}>${i}</option>`).join('')}
          </select>
        </div>
        <div style="padding:var(--space-3);background:rgba(78,204,163,0.08);border-radius:var(--radius-lg);border:1px solid rgba(78,204,163,0.2);font-size:0.78rem;color:var(--text-secondary)">
          💰 Income helps match schemes like <strong>PM Kisan</strong>, <strong>MGNREGA</strong>, <strong>Ayushman Bharat</strong>, and <strong>PM Ujjwala Yojana</strong>.
        </div>
      </div>`;

    case 5: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="input-group">
          <label class="input-label">State *</label>
          <select id="su-state" class="input-field">
            <option value="">Select your state</option>
            ${states.map(s=>`<option value="${s}" ${formData.state===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">City / District *</label>
          <select id="su-city" class="input-field">
            <option value="">Select city</option>
            ${formData.state?getCities(formData.state).map(c=>`<option value="${c}" ${formData.city===c?'selected':''}>${c}</option>`).join(''):''}
          </select>
        </div>
        <div style="padding:var(--space-3);background:rgba(108,99,255,0.08);border-radius:var(--radius-lg);border:1px solid rgba(108,99,255,0.2);font-size:0.78rem;color:var(--text-secondary)">
          📍 Your location helps find state-specific schemes from <strong>Maharashtra, Delhi, Telangana</strong> and more.
        </div>
      </div>`;

    case 6: return `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        <div class="input-group">
          <label class="input-label">Social Category *</label>
          <div style="display:flex;gap:var(--space-3);flex-wrap:wrap">
            ${categories.map(c=>`
              <label style="flex:1;min-width:80px;display:flex;align-items:center;gap:7px;padding:10px 14px;border-radius:var(--radius-lg);background:${formData.category===c?'rgba(108,99,255,0.2)':'var(--glass-bg)'};border:1.5px solid ${formData.category===c?'rgba(108,99,255,0.5)':'var(--glass-border)'};cursor:pointer;font-size:0.82rem;transition:all 0.2s">
                <input type="radio" name="su-category" value="${c}" ${formData.category===c?'checked':''} style="accent-color:var(--primary)"/> ${c}
              </label>`).join('')}
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Highest Education Level</label>
          <select id="su-education" class="input-field">
            <option value="">Select education level</option>
            ${educationLevels.map(e=>`<option value="${e}" ${formData.education===e?'selected':''}>${e}</option>`).join('')}
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Disability Status</label>
          <select id="su-disability" class="input-field">
            <option value="">Select disability status</option>
            ${disabilityOptions.map(d=>`<option value="${d}" ${formData.disability===d?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div style="padding:var(--space-3);background:rgba(108,99,255,0.08);border-radius:var(--radius-lg);border:1px solid rgba(108,99,255,0.2);font-size:0.78rem;color:var(--text-secondary)">
          🏷️ SC/ST/OBC categories unlock additional benefits. Disability status provides priority access to 15+ schemes.
        </div>
      </div>`;

    case 7: {
      // Compute estimated eligible schemes from RAG
      const profile = {
        age: formData.age, occupation: formData.occupation, income: formData.income,
        state: formData.state, gender: formData.gender, category: formData.category || 'General',
        disability: formData.disability?.startsWith('Yes') ? 'Yes' : 'No',
      };
      const matched = retrieveSchemes(profile, 10);
      const eligibleCount = matched.filter(s => s.eligibilityScore >= 60).length;
      const topScheme = matched[0];
      return `
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">
          ${[
            ['👤 Name', formData.name],
            ['📧 Email', formData.email],
            ['📱 Phone', formData.phone],
            ['🎂 Age', formData.age ? `${formData.age} years` : '—'],
            ['⚧ Gender', formData.gender],
            ['💼 Occupation', formData.occupation],
            ['💰 Income', formData.income],
            ['🗺️ State', formData.state],
            ['🏙️ City', formData.city],
            ['🏷️ Category', formData.category || 'General'],
            ['🎓 Education', formData.education],
            ['♿ Disability', formData.disability || 'Not specified'],
          ].map(([label, val]) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-lg)">
              <span style="font-size:0.8rem;color:var(--text-muted)">${label}</span>
              <span style="font-size:0.84rem;font-weight:600;color:var(--text-primary);max-width:200px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${val || '—'}</span>
            </div>
          `).join('')}
          <div style="padding:var(--space-4);background:rgba(78,204,163,0.12);border-radius:var(--radius-xl);border:1.5px solid rgba(78,204,163,0.3);text-align:center;margin-top:4px">
            <div style="font-size:2rem;margin-bottom:4px">🎉</div>
            <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:800;color:var(--success)">You qualify for ~${eligibleCount} schemes!</div>
            ${topScheme ? `<div style="font-size:0.78rem;color:var(--text-secondary);margin-top:4px">Top match: <strong>${topScheme.name}</strong> at <strong>${topScheme.eligibilityScore}% eligibility</strong></div>` : ''}
          </div>
        </div>`;
    }
  }
}

function collectStepData() {
  switch(currentStep) {
    case 1: {
      const name=document.getElementById('su-name')?.value.trim();
      const nickname=document.getElementById('su-nickname')?.value.trim();
      const email=document.getElementById('su-email')?.value.trim();
      const password=document.getElementById('su-password')?.value;
      if (!name || !email || !password) { showToast('Please fill all required fields','error'); return false; }
      if (password.length < 6) { showToast('Password must be at least 6 characters','error'); return false; }
      formData = {...formData, name, nickname, email, password};
      return true;
    }
    case 2: {
      const phone=document.getElementById('su-phone')?.value.trim();
      const aadhaar=document.getElementById('su-aadhaar')?.value.trim();
      if (!phone || phone.length < 10) { showToast('Enter a valid phone number','error'); return false; }
      formData = {...formData, phone, aadhaar};
      return true;
    }
    case 3: {
      const dob=document.getElementById('su-dob')?.value;
      const gender=document.querySelector('input[name="su-gender"]:checked')?.value;
      if (!dob || !gender) { showToast('Please fill date of birth and gender','error'); return false; }
      const age = Math.floor((Date.now()-new Date(dob))/(1000*60*60*24*365.25));
      formData = {...formData, dob, age: String(age), gender};
      return true;
    }
    case 4: {
      const occupation=document.getElementById('su-occupation')?.value;
      const income=document.getElementById('su-income')?.value;
      const userType=document.querySelector('input[name="user-type"]:checked')?.value;
      if (!occupation || !income) { showToast('Please select occupation and income','error'); return false; }
      formData = {...formData, occupation, income, userType};
      return true;
    }
    case 5: {
      const state=document.getElementById('su-state')?.value;
      const city=document.getElementById('su-city')?.value;
      if (!state || !city) { showToast('Please select state and city','error'); return false; }
      formData = {...formData, state, city};
      return true;
    }
    case 6: {
      const category=document.querySelector('input[name="su-category"]:checked')?.value;
      const education=document.getElementById('su-education')?.value;
      const disability=document.getElementById('su-disability')?.value;
      if (!category) { showToast('Please select your social category','error'); return false; }
      formData = {...formData, category, education, disability};
      return true;
    }
    case 7: return true;
  }
}

function updateCityDropdown() {
  const state = document.getElementById('su-state')?.value;
  const citySelect = document.getElementById('su-city');
  if (!citySelect || !state) return;
  const cities = getCities(state);
  citySelect.innerHTML = `<option value="">Select city</option>` + cities.map(c=>`<option value="${c}">${c}</option>`).join('');
  formData.state = state;
  formData.city = '';
}

function updateAge() {
  const dob = document.getElementById('su-dob')?.value;
  const ageField = document.getElementById('su-age');
  if (!dob || !ageField) return;
  const age = Math.floor((Date.now() - new Date(dob)) / (1000*60*60*24*365.25));
  ageField.value = age > 0 ? age : '';
}

function attachVoiceInputs() {
  const voiceTargets = ['su-name','su-phone','su-city'];
  voiceTargets.forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    const btn = createVoiceButton(text => { field.value = text; });
    btn.style.cssText = 'width:32px;height:32px;position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:5;';
    const wrap = field.parentElement;
    if (wrap && (wrap.classList.contains('input-icon-wrap') || wrap.tagName === 'DIV')) {
      wrap.style.position = 'relative';
      wrap.appendChild(btn);
    }
  });
}

function submitSignup(outlet) {
  const btn = document.getElementById('next-btn');
  if (btn) { btn.textContent = '⏳ Creating account...'; btn.disabled = true; }
  setTimeout(() => {
    const userData = {
      name: formData.name, nickname: formData.nickname || formData.name.split(' ')[0],
      email: formData.email, phone: formData.phone, age: formData.age,
      dob: formData.dob, gender: formData.gender, occupation: formData.occupation,
      userType: formData.userType, income: formData.income, state: formData.state,
      city: formData.city, category: formData.category || 'General',
      education: formData.education, disability: formData.disability,
    };
    store.login(userData);
    showToast(`🎉 Welcome, ${userData.nickname || userData.name}! Account created!`, 'success', 4000);
    router.navigate('home');
  }, 1500);
}
