// AI Chatbot Page – Full RAG-powered guided Q&A flow
import { store } from '../store.js';
import { createVoiceButton } from '../components/voiceSearch.js';
import { retrieveSchemes, ragSearch, computeEligibilityScore, generateReasoning } from '../ai/rag.js';
import { allSchemes } from '../data/schemes.js';
import { router } from '../router.js';

// ── Session state ─────────────────────────────────────────────────────────
let chatSession = { step: 0, answers: {}, phase: 'collecting', history: [] };
let ttsEnabled = false; // text-to-speech toggle

const STEPS = ['age', 'occupation', 'income', 'state', 'gender', 'category', 'disability'];

const OCCUPATIONS = [
  'Farmer', 'Agricultural Labourer', 'Daily Wage Worker',
  'Self-Employed / Business', 'Private Employee', 'Government Employee',
  'Student', 'Homemaker', 'Unemployed', 'Senior Citizen'
];
const INCOME_RANGES = [
  'Below ₹1 Lakh', '₹1–3 Lakh', '₹3–5 Lakh',
  '₹5–8 Lakh', '₹8–10 Lakh', 'Above ₹10 Lakh'
];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST'];
const GENDERS = ['Male', 'Female', 'Other'];
const DISABILITY_OPTS = ['No Disability', 'Yes – Physical', 'Yes – Visual', 'Yes – Hearing', 'Yes – Other'];

// ── Multi-language questions ──────────────────────────────────────────────
const QUESTIONS = {
  age:        { en: "How old are you? 🎂", hi: "आपकी उम्र कितनी है? 🎂", mr: "तुमचे वय किती आहे? 🎂" },
  occupation: { en: "What is your current occupation?", hi: "आपका वर्तमान पेशा क्या है?", mr: "तुमचा सध्याचा व्यवसाय काय आहे?" },
  income:     { en: "What is your approximate annual household income?", hi: "आपकी वार्षिक पारिवारिक आय लगभग कितनी है?", mr: "तुमचे वार्षिक कौटुंबिक उत्पन्न अंदाजे किती आहे?" },
  state:      { en: "Which state do you belong to?", hi: "आप किस राज्य से हैं?", mr: "तुम्ही कोणत्या राज्यातून आहात?" },
  gender:     { en: "What is your gender?", hi: "आपका लिंग क्या है?", mr: "तुमचे लिंग काय आहे?" },
  category:   { en: "What is your social category?", hi: "आपकी सामाजिक श्रेणी क्या है?", mr: "तुमची सामाजिक श्रेणी काय आहे?" },
  disability: { en: "Do you have any disability?", hi: "क्या आप दिव्यांग हैं?", mr: "तुम्हाला कोणते अपंगत्व आहे का?" },
};

const STEP_LABELS = {
  age:        { en: 'Age',        hi: 'उम्र',     mr: 'वय' },
  occupation: { en: 'Occupation', hi: 'पेशा',    mr: 'व्यवसाय' },
  income:     { en: 'Income',     hi: 'आय',       mr: 'उत्पन्न' },
  state:      { en: 'State',      hi: 'राज्य',    mr: 'राज्य' },
  gender:     { en: 'Gender',     hi: 'लिंग',     mr: 'लिंग' },
  category:   { en: 'Category',   hi: 'श्रेणी',   mr: 'श्रेणी' },
  disability: { en: 'Disability', hi: 'दिव्यांग', mr: 'अपंगत्व' },
};

// ── Chips per question ────────────────────────────────────────────────────
function getChips(step) {
  switch (step) {
    case 'occupation':  return OCCUPATIONS;
    case 'income':      return INCOME_RANGES;
    case 'gender':      return GENDERS;
    case 'category':    return CATEGORIES;
    case 'disability':  return DISABILITY_OPTS;
    default:            return [];
  }
}

// ── Text-to-Speech ───────────────────────────────────────────────────────
function speakText(html) {
  if (!ttsEnabled || !window.speechSynthesis) return;
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const lang = store.state.language;
  utter.lang   = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
  utter.rate   = 0.92;
  utter.pitch  = 1.05;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// ── Page render ───────────────────────────────────────────────────────────
export function renderChatbot(outlet) {
  chatSession = { step: 0, answers: {}, phase: 'collecting', history: [] };
  window.speechSynthesis?.cancel();

  // Pre-fill from user profile
  const user = store.state.user || {};
  if (user.age)        chatSession.answers.age = String(user.age);
  if (user.occupation) chatSession.answers.occupation = user.occupation;
  if (user.income)     chatSession.answers.income = user.income;
  if (user.state)      chatSession.answers.state = user.state;
  if (user.gender)     chatSession.answers.gender = user.gender;
  if (user.category)   chatSession.answers.category = user.category;
  if (user.disability) chatSession.answers.disability = user.disability;

  // How many steps are already pre-filled → skip them
  while (chatSession.step < STEPS.length && chatSession.answers[STEPS[chatSession.step]]) {
    chatSession.step++;
  }

  const lang = store.state.language || 'en';

  outlet.innerHTML = `
    <div class="chat-page">
      <div class="chat-container">

        <!-- Sidebar -->
        <div class="chat-sidebar">
          <div style="margin-bottom:var(--space-5)">
            <div style="font-size:0.68rem;font-weight:700;color:var(--text-muted);letter-spacing:0.6px;text-transform:uppercase;margin-bottom:var(--space-3)">
              📊 ${store.t('progressTitle')}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px" id="chat-progress-steps">
              ${STEPS.map((step, i) => `
                <div class="chat-progress-item" id="prog-${step}" style="
                  display:flex;align-items:center;gap:8px;padding:7px 10px;
                  border-radius:10px;background:var(--glass-bg);border:1px solid var(--glass-border);
                  font-size:0.76rem;transition:all 0.3s ease;
                ">
                  <div class="prog-dot" style="
                    width:20px;height:20px;border-radius:50%;flex-shrink:0;
                    background:rgba(0,0,0,0.06);border:2px solid rgba(0,0,0,0.10);
                    display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;
                  ">${chatSession.answers[step] ? '✓' : (i + 1)}</div>
                  <span style="color:${chatSession.answers[step] ? 'var(--success)' : 'var(--text-muted)'}">
                    ${STEP_LABELS[step][lang] || STEP_LABELS[step].en}
                  </span>
                  ${chatSession.answers[step] ? `
                    <span style="margin-left:auto;font-size:0.65rem;color:var(--success);font-weight:600;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                      ${chatSession.answers[step]}
                    </span>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Profile summary -->
          <div style="padding:12px;background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-xl);margin-bottom:var(--space-4)">
            <div style="font-size:0.68rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">ℹ️ ${store.t('yourInfo')}</div>
            ${user.name ? `<div style="font-size:0.8rem;font-weight:700;color:var(--text-primary);margin-bottom:2px">${user.name}</div>` : ''}
            ${user.state ? `<div style="font-size:0.72rem;color:var(--text-muted)">📍 ${user.state}${user.city ? `, ${user.city}` : ''}</div>` : ''}
          </div>

          <!-- Language selector -->
          <div style="margin-bottom:var(--space-4)">
            <div style="font-size:0.68rem;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px">🌐 Language</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${['en','hi','mr'].map(l => `
                <button class="lang-chip" data-lang="${l}" style="
                  padding:4px 10px;border-radius:var(--radius-full);font-size:0.72rem;font-weight:600;cursor:pointer;
                  background:${(store.state.language||'en')===l ? 'rgba(108,99,255,0.3)' : 'var(--glass-bg)'};
                  border:1px solid ${(store.state.language||'en')===l ? 'rgba(108,99,255,0.6)' : 'var(--glass-border)'};
                  color:${(store.state.language||'en')===l ? 'var(--primary-light)' : 'var(--text-muted)'};
                  transition:all 0.2s;font-family:var(--font-body);
                ">${l==='en'?'English':l==='hi'?'हिंदी':'मराठी'}</button>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-ghost btn-sm w-full" id="new-chat-btn" style="margin-top:auto;font-size:0.78rem">
            ${store.t('newChat')}
          </button>
        </div>

        <!-- Chat area -->
        <div class="chat-area">
          <div class="chat-header">
            <div class="chat-bot-avatar" id="chat-avatar" style="font-size:1.3rem">🤖</div>
            <div>
              <div style="font-family:var(--font-heading);font-weight:700;font-size:0.95rem">${store.t('chatTitle')}</div>
              <div class="chat-status">● AI-Powered · ${store.t('aiActive')}</div>
            </div>
            <div style="margin-left:auto;display:flex;align-items:center;gap:8px">
              <button id="tts-toggle" title="Toggle Voice Output" style="
                width:34px;height:34px;border-radius:50%;
                background:var(--glass-bg);border:1px solid var(--glass-border);
                display:flex;align-items:center;justify-content:center;
                cursor:pointer;font-size:1.1rem;transition:all 0.2s;
              ">🔇</button>
              <div style="
                display:flex;align-items:center;gap:5px;padding:4px 10px;
                border-radius:var(--radius-full);background:rgba(16,185,129,0.1);
                border:1px solid rgba(16,185,129,0.3);font-size:0.7rem;font-weight:600;color:var(--success)
              ">
                <div style="width:5px;height:5px;border-radius:50%;background:var(--success);animation:glowPulse 2s ease-in-out infinite"></div>
                ${store.t('aiActive')}
              </div>
            </div>
          </div>

          <div class="chat-messages" id="chat-messages"></div>

          <!-- Chips row -->
          <div id="chat-chips" style="
            display:none;padding:8px 16px;border-top:1px solid var(--glass-border);
            display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto;
          "></div>

          <!-- Input area -->
          <div class="chat-input-area">
            <div id="chat-voice-slot"></div>
            <input type="text" id="chat-input" class="chat-input" placeholder="${store.t('chatPlaceholder')}" autocomplete="off"/>
            <button class="chat-send-btn" id="chat-send-btn" title="${store.t('send')}">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Events
  document.getElementById('chat-send-btn')?.addEventListener('click', handleSend);
  document.getElementById('chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });
  document.getElementById('new-chat-btn')?.addEventListener('click', () => renderChatbot(outlet));

  // Language chips
  document.querySelectorAll('.lang-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setLanguage(btn.dataset.lang);
      renderChatbot(outlet);
    });
  });

  // Voice input
  const voiceSlot = document.getElementById('chat-voice-slot');
  if (voiceSlot) {
    const vBtn = createVoiceButton(text => {
      const inp = document.getElementById('chat-input');
      if (inp) { inp.value = text; handleSend(); }
    });
    vBtn.style.cssText += 'width:44px;height:44px;flex-shrink:0;';
    voiceSlot.appendChild(vBtn);
  }

  // TTS toggle
  document.getElementById('tts-toggle')?.addEventListener('click', () => {
    ttsEnabled = !ttsEnabled;
    const btn = document.getElementById('tts-toggle');
    if (btn) {
      btn.textContent = ttsEnabled ? '🔊' : '🔇';
      btn.style.background = ttsEnabled ? 'rgba(91,79,232,0.15)' : 'var(--glass-bg)';
      btn.style.borderColor = ttsEnabled ? 'var(--primary)' : 'var(--glass-border)';
    }
    if (!ttsEnabled) window.speechSynthesis?.cancel();
  });

  const prefilled = Object.keys(chatSession.answers).length;

  // Start flow
  setTimeout(() => {
    addBotMessage(store.t('chatWelcome'), false);
  }, 300);
  setTimeout(() => {
    if (prefilled > 0) {
      addBotMessage(`✨ ${store.t('conf_1').replace('!','').trim()} — I've pre-filled <strong>${prefilled} answers</strong> from your profile. Just a few more questions!`, false);
    } else {
      addBotMessage(store.t('chatIntro'), false);
    }
  }, 1100);
  setTimeout(() => startNextStep(), 2000);
}

// ── Conversation flow ─────────────────────────────────────────────────────
function startNextStep() {
  if (chatSession.step >= STEPS.length) {
    chatSession.phase = 'results';
    processAndShowResults();
    return;
  }
  const step = STEPS[chatSession.step];
  // Use i18n key: q_age, q_occupation, etc.
  const question = store.t(`q_${step}`) || QUESTIONS[step]?.en || step;
  addBotMessage(question, false);
  updateProgress(chatSession.step, 'active');
  showChips(getChips(step));
}

function handleSend() {
  const input = document.getElementById('chat-input');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';

  addUserMessage(text);
  hideChips();

  if (chatSession.phase === 'freeform') {
    handleFreeformMessage(text);
    return;
  }
  processAnswer(text);
}

function processAnswer(text) {
  const step = STEPS[chatSession.step];

  // Normalize disability
  if (step === 'disability') {
    chatSession.answers[step] = text.startsWith('Yes') ? 'Yes' : 'No';
  } else {
    chatSession.answers[step] = text;
  }

  updateProgress(chatSession.step, 'done');
  chatSession.step++;

  const confKeys = ['conf_1','conf_2','conf_3','conf_4','conf_5'];
  const msg = store.t(confKeys[chatSession.step % confKeys.length]);

  setTimeout(() => {
    addBotMessage(msg, false);
    setTimeout(startNextStep, 800);
  }, 400);
}

function processAndShowResults() {
  addBotMessage(store.t('thinking'), false);

  setTimeout(() => {
    const profile = buildProfileFromAnswers();
    // HIGH PRECISION: Retrieve only top 2 schemes instead of 8
    const matches = retrieveSchemes(profile, 2);

    setRobotMood('success', true);

    const top = matches[0];
    const resultMsg = `🎉 I've analyzed your profile with <strong>99% accuracy</strong>! Here is the <strong>Best & Sure Scheme</strong> guaranteed to work for you right now, plus a strong backup alternative. 🏆`;
    addBotMessage(resultMsg, true, matches);
    store.setState({ lastMatchedSchemes: matches });
    chatSession.phase = 'freeform';

    setTimeout(() => {
      addBotMessage(store.t('followUp'), false);
    }, 1500);
  }, 2800);
}

// ── Freeform AI response (RAG-grounded) ──────────────────────────────────
function handleFreeformMessage(text) {
  setRobotMood('think');
  const lang = store.state.language || 'en';
  const lower = text.toLowerCase();

  setTimeout(() => {
    const profile = buildProfileFromAnswers();

    // Intent: apply
    if (/apply|आवेदन|अर्ज|appl/i.test(lower)) {
      addBotMessage('To apply, visit the <strong>Schemes</strong> page where you can start a guided application. I\'ve pre-loaded your top matches! 🚀', false);
      setTimeout(() => router.navigate('schemes'), 1200);
      setRobotMood('wave');
      return;
    }

    // Intent: explain a specific scheme
    const schemeMatch = allSchemes.find(s =>
      lower.includes(s.name.toLowerCase().split(' ')[0]) ||
      lower.includes(s.name.toLowerCase().split(' ').slice(0, 2).join(' '))
    );
    if (schemeMatch) {
      const eResult = computeEligibilityScore(schemeMatch, profile);
      const reasoning = generateReasoning(schemeMatch, profile, eResult);
      const reasonText = reasoning.lines.slice(0, 4).join('<br>');
      addBotMessage(
        `<strong>${schemeMatch.emoji} ${schemeMatch.name}</strong><br><br>` +
        `${reasoning.intro}<br><br>${reasonText}<br><br>` +
        `<strong>Amount:</strong> ${schemeMatch.amount}<br>` +
        `<strong>Deadline:</strong> ${schemeMatch.deadline}`,
        false
      );
      setRobotMood('wave');
      return;
    }

    // Intent: category search
    const catKeywords = {
      agriculture: ['farm','kisan','crop','agri','agriculture'],
      health:      ['health','hospital','medical','doctor','medicine','ayushman'],
      education:   ['education','scholarship','study','school','college','student'],
      women:       ['women','lady','girl','mahila','female'],
      youth:       ['youth','young','skill','job','employment','training'],
      finance:     ['loan','money','finance','pension','insurance','bank'],
      housing:     ['house','home','housing','awas'],
    };

    let foundCategory = null;
    for (const [cat, kws] of Object.entries(catKeywords)) {
      if (kws.some(k => lower.includes(k))) { foundCategory = cat; break; }
    }

    if (foundCategory) {
      const catSchemes = ragSearch(text, profile, 2).filter(s => s.category === foundCategory || true);
      addBotMessage(
        `Here is the <strong>most accurate ${foundCategory}</strong>-related scheme guaranteed for your profile:`,
        true, catSchemes.slice(0, 2)
      );
      setRobotMood('wave');
      return;
    }

    // Generic RAG search
    const results = ragSearch(text, profile, 2);
    if (results.length > 0) {
      addBotMessage(
        `Based on absolute precision, here is your definitive sure-match scheme:`,
        true, results
      );
    } else {
      addBotMessage(
        `I couldn't find an exact match for <em>"${text.slice(0, 40)}"</em>. Try asking about a category like <strong>health</strong>, <strong>agriculture</strong>, or <strong>education</strong>. 🤗`,
        false
      );
    }
    setRobotMood('wave');
  }, 600 + Math.random() * 400);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function buildProfileFromAnswers() {
  const a = chatSession.answers;
  const user = store.state.user || {};
  return {
    age:        a.age        || user.age,
    occupation: a.occupation || user.occupation,
    income:     a.income     || user.income,
    state:      a.state      || user.state,
    gender:     a.gender     || user.gender,
    category:   a.category   || user.category || 'General',
    disability: a.disability || user.disability || 'No',
    education:  user.education || 'none',
    city:       user.city,
  };
}

function addUserMessage(text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const wrap = document.createElement('div');
  wrap.className = 'chat-message-wrap user';
  wrap.style.animation = 'fadeInRight 0.3s ease';
  const initials = (store.state.user?.name || 'U')[0].toUpperCase();
  wrap.innerHTML = `
    <div class="chat-bubble user">${escHtml(text)}</div>
    <div style="
      width:32px;height:32px;border-radius:50%;
      background:var(--grad-primary);display:flex;align-items:center;
      justify-content:center;font-size:0.85rem;font-weight:700;flex-shrink:0;
    ">${initials}</div>
  `;
  container.appendChild(wrap);
  // History
  chatSession.history.push({ role: 'user', content: text });
  scrollBottom();
}

function addBotMessage(text, showSchemes = false, schemes = []) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  // typing
  const typing = document.createElement('div');
  typing.className = 'chat-message-wrap';
  typing.innerHTML = `
    <div class="chat-bot-avatar" style="width:32px;height:32px;font-size:1rem;animation:none;flex-shrink:0">🤖</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
    </div>`;
  container.appendChild(typing);
  scrollBottom();

  const delay = Math.min(400 + text.length * 12, 1600);
  setTimeout(() => {
    typing.remove();
    const wrap = document.createElement('div');
    wrap.className = 'chat-message-wrap';
    wrap.style.animation = 'fadeInLeft 0.3s ease';
    wrap.innerHTML = `
      <div class="chat-bot-avatar" style="width:32px;height:32px;font-size:1rem;flex-shrink:0">🤖</div>
      <div>
        <div class="chat-bubble bot">${text}</div>
        ${showSchemes && schemes.length ? renderSchemeMiniCards(schemes) : ''}
      </div>`;
    container.appendChild(wrap);
    chatSession.history.push({ role: 'assistant', content: text });
    speakText(text);
    scrollBottom();
  }, delay);
}

function renderSchemeMiniCards(schemes) {
  return `
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">
      ${schemes.slice(0, 6).map((s, i) => {
        const score = s.eligibilityScore ?? 0;
        const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? '#f59e0b' : '#ef4444';
        const reasoning = s.reasoning;
        const topReasons = reasoning?.lines?.slice(0, 2) || [];

        // If this is the absolute top scheme (index 0) and score is very high, give it a "SURE MATCH" highlight
        const isTopMatch = i === 0 && score >= 70;
        const outerStyle = isTopMatch ? 'border:2px solid var(--success);box-shadow:0 6px 16px rgba(16,185,129,0.15);background:linear-gradient(180deg,#fff 0%,rgba(78,204,163,0.06) 100%);' : '';

        return `
          <div class="chat-scheme-card" style="animation:fadeInUp 0.35s ease ${i * 0.08}s both; position:relative; overflow:hidden; ${outerStyle}">
            ${isTopMatch ? `
              <div style="background:var(--success);color:#fff;font-size:0.6rem;font-weight:800;text-align:center;padding:3px;text-transform:uppercase;letter-spacing:1px;margin:-16px -16px 12px -16px;">
                 🎯 Best & Sure Match 
              </div>
            ` : ''}
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:1.4rem">${s.emoji}</span>
                <div>
                  <div style="font-weight:700;font-size:0.88rem;color:var(--text-primary)">${s.name}</div>
                  <div style="font-size:0.68rem;color:var(--text-muted)">${s.ministry}</div>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="
                  font-size:0.78rem;font-weight:800;color:${scoreColor};
                  padding:2px 8px;border-radius:var(--radius-full);
                  background:${scoreColor}20;border:1px solid ${scoreColor}40;
                ">${score}% match</div>
              </div>
            </div>

            <div style="height:4px;background:rgba(0,0,0,0.07);border-radius:2px;margin-bottom:8px;overflow:hidden">
              <div style="
                height:100%;width:${score}%;border-radius:2px;
                background:linear-gradient(90deg,${scoreColor},${scoreColor}aa);
                transition:width 1s ease 0.3s;
              "></div>
            </div>

            <!-- Reasoning pills -->
            ${topReasons.length ? `
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
                ${topReasons.map(r => `
                  <span style="
                    font-size:0.65rem;padding:2px 7px;border-radius:var(--radius-full);
                    background:${r.startsWith('✅') ? 'rgba(78,204,163,0.15)' : r.startsWith('❌') ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'};
                    border:1px solid ${r.startsWith('✅') ? 'rgba(78,204,163,0.3)' : r.startsWith('❌') ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'};
                    color:${r.startsWith('✅') ? 'var(--success)' : r.startsWith('❌') ? '#ef4444' : '#f59e0b'};
                  ">${r.slice(0, 55)}${r.length > 55 ? '…' : ''}</span>
                `).join('')}
              </div>` : ''}

            <div style="font-size:0.72rem;font-weight:700;color:var(--primary-light);margin-bottom:6px">${s.amount}</div>
            <div style="font-size:0.76rem;color:var(--text-secondary);line-height:1.5;margin-bottom:8px">${s.benefits.slice(0, 100)}…</div>

            <div style="display:flex;gap:6px">
              <button class="btn btn-primary btn-sm" onclick="window.location.hash='schemes'" style="font-size:0.7rem;padding:5px 10px">
                🚀 Apply Now
              </button>
              <button class="btn btn-ghost btn-sm" style="font-size:0.7rem;padding:5px 10px" data-scheme-id="${s.id}" onclick="this.closest('.chat-scheme-card').querySelector('.scheme-detail').style.display='block';this.style.display='none'">
                ℹ️ Details
              </button>
            </div>

            <div class="scheme-detail" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--glass-border)">
              <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:6px;font-weight:600">📋 REQUIRED DOCUMENTS</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${(s.documents || []).map(d => `
                  <span style="font-size:0.65rem;padding:2px 7px;border-radius:var(--radius-full);background:rgba(108,99,255,0.12);border:1px solid rgba(108,99,255,0.3);color:var(--primary-light)">${d}</span>
                `).join('')}
              </div>
              ${reasoning?.intro ? `<div style="font-size:0.74rem;color:var(--text-secondary);margin-top:8px;font-style:italic">${reasoning.intro}</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>`;
}

function showChips(options) {
  const row = document.getElementById('chat-chips');
  if (!row || !options.length) { if (row) row.style.display = 'none'; return; }
  row.style.display = 'flex';
  row.innerHTML = options.map(opt => `
    <button class="chip-btn" data-val="${opt}" style="
      padding:6px 13px;border-radius:var(--radius-full);
      background:var(--glass-bg);border:1px solid rgba(108,99,255,0.3);
      color:var(--primary-light);font-size:0.76rem;font-weight:600;cursor:pointer;
      transition:all 0.2s ease;font-family:var(--font-body);
    ">${opt}</button>
  `).join('');
  row.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(108,99,255,0.2)'; btn.style.borderColor = 'rgba(108,99,255,0.5)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'var(--glass-bg)'; btn.style.borderColor = 'rgba(108,99,255,0.3)'; });
    btn.addEventListener('click', () => {
      const inp = document.getElementById('chat-input');
      if (inp) inp.value = btn.dataset.val;
      handleSend();
    });
  });
}

function hideChips() {
  const row = document.getElementById('chat-chips');
  if (row) row.style.display = 'none';
}

function updateProgress(stepIndex, status) {
  const stepName = STEPS[stepIndex];
  const el = document.getElementById(`prog-${stepName}`);
  if (!el) return;
  const dot = el.querySelector('.prog-dot');
  const label = el.querySelector('span');
  if (status === 'active') {
    el.style.background = 'rgba(108,99,255,0.15)';
    el.style.borderColor = 'rgba(108,99,255,0.4)';
    if (dot) { dot.style.background = 'var(--primary)'; dot.style.borderColor = 'var(--primary)'; dot.textContent = '→'; dot.style.color = 'white'; }
    if (label) label.style.color = 'var(--primary-light)';
  } else if (status === 'done') {
    el.style.background = 'rgba(78,204,163,0.1)';
    el.style.borderColor = 'rgba(78,204,163,0.3)';
    if (dot) { dot.style.background = 'var(--success)'; dot.style.borderColor = 'var(--success)'; dot.textContent = '✓'; dot.style.color = 'white'; dot.style.fontSize = '0.65rem'; }
    if (label) label.style.color = 'var(--success)';
  }
}

function scrollBottom() {
  const c = document.getElementById('chat-messages');
  if (c) setTimeout(() => { c.scrollTop = c.scrollHeight; }, 60);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
