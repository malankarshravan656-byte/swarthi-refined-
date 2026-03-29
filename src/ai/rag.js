// ─── SchemeSetu RAG Engine ────────────────────────────────────────────────
// Retrieval-Augmented Generation system that:
// 1. Builds a weighted keyword index over the scheme dataset
// 2. Retrieves top-matching schemes for a user profile
// 3. Computes deterministic eligibility scores (no random numbers)
// 4. Generates natural-language reasoning for each scheme

import { allSchemes } from '../data/schemes.js';

// ── Income utility helpers ────────────────────────────────────────────────
const INCOME_MAP = {
  'Below ₹1 Lakh':   0.5,
  '₹1–3 Lakh':       2,
  '₹3–5 Lakh':       4,
  '₹5–8 Lakh':       6.5,
  '₹8–10 Lakh':      9,
  'Above ₹10 Lakh':  12,
};

const OCCUPATION_CATEGORY_MAP = {
  'Farmer':                 ['agriculture'],
  'Agricultural Labourer':  ['agriculture', 'finance'],
  'Daily Wage Worker':      ['finance', 'housing'],
  'Self-Employed / Business': ['finance'],
  'Private Employee':       ['finance', 'housing'],
  'Government Employee':    ['finance'],
  'Student':                ['education', 'youth'],
  'Homemaker':              ['women', 'health'],
  'Unemployed':             ['youth', 'finance'],
  'Senior Citizen':         ['finance', 'health'],
};

const EDUCATION_RANK = {
  'none': 0, '8th': 1, '10th': 2, '12th': 3, 'graduate': 4, 'postgraduate': 5,
};

// ── Build inverted keyword index ─────────────────────────────────────────
const _index = {};  // keyword → [schemeId, ...]

function buildIndex() {
  allSchemes.forEach(scheme => {
    const tokens = new Set([
      ...tokenize(scheme.name),
      ...tokenize(scheme.benefits),
      ...tokenize(scheme.eligibility),
      ...(scheme.keywords || []),
      scheme.category,
      ...(scheme.occupations || []).map(o => o.toLowerCase()),
      ...(scheme.categories || []).map(c => c.toLowerCase()),
    ]);
    tokens.forEach(token => {
      if (!_index[token]) _index[token] = [];
      if (!_index[token].includes(scheme.id)) _index[token].push(scheme.id);
    });
  });
}

function tokenize(str) {
  if (!str) return [];
  return str.toLowerCase()
    .replace(/[₹,.\-–—]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

// Build index on module load
buildIndex();

// ── Core scoring function ─────────────────────────────────────────────────
// Returns 0–100 score and breakdown object
export function computeEligibilityScore(scheme, profile) {
  const scores = {};
  let total = 0;

  const incomeLakh = INCOME_MAP[profile.income] ?? null;
  const age = parseInt(profile.age, 10) || null;
  const occupation = profile.occupation || '';
  const gender = profile.gender || '';
  const category = profile.category || 'General';
  const education = profile.education || 'none';
  const hasDisability = profile.disability === 'Yes';
  const state = profile.state || '';

  // ── 1. Age match (weight: 20) ─
  if (scheme.minAge !== null || scheme.maxAge !== null) {
    if (age !== null) {
      const min = scheme.minAge ?? 0;
      const max = scheme.maxAge ?? 120;
      if (age >= min && age <= max) {
        scores.age = { score: 20, label: `Age ${age} is within required range (${min}–${max})`, pass: true };
      } else {
        scores.age = { score: 0, label: `Age ${age} is outside required range (${min}–${max})`, pass: false };
      }
    } else {
      scores.age = { score: 10, label: 'Age not provided (partial match)', pass: null };
    }
  } else {
    scores.age = { score: 20, label: 'No age restriction for this scheme', pass: true };
  }

  // ── 2. Income match (weight: 25) ─
  if (scheme.maxIncomeLakh !== null) {
    if (incomeLakh !== null) {
      if (incomeLakh <= scheme.maxIncomeLakh) {
        const margin = (scheme.maxIncomeLakh - incomeLakh) / scheme.maxIncomeLakh;
        const s = Math.round(20 + margin * 5); // 20–25
        scores.income = { score: s, label: `Income ₹${incomeLakh}L is within limit of ₹${scheme.maxIncomeLakh}L`, pass: true };
      } else {
        scores.income = { score: 0, label: `Income ₹${incomeLakh}L exceeds limit of ₹${scheme.maxIncomeLakh}L`, pass: false };
      }
    } else {
      scores.income = { score: 12, label: 'Income not provided (partial match)', pass: null };
    }
  } else {
    scores.income = { score: 25, label: 'No income restriction for this scheme', pass: true };
  }

  // ── 3. Occupation match (weight: 20) ─
  if (scheme.occupations && scheme.occupations.length > 0) {
    const match = scheme.occupations.some(o =>
      o.toLowerCase() === occupation.toLowerCase() ||
      occupation.toLowerCase().includes(o.toLowerCase().split(' ')[0])
    );
    scores.occupation = match
      ? { score: 20, label: `Your occupation (${occupation}) matches scheme requirement`, pass: true }
      : { score: 5, label: `Your occupation (${occupation}) is not primary target, but may still apply`, pass: false };
  } else {
    scores.occupation = { score: 20, label: 'Open to all occupations', pass: true };
  }

  // ── 4. Gender match (weight: 10) ─
  if (scheme.genders && scheme.genders.length > 0) {
    const match = scheme.genders.includes(gender);
    scores.gender = match
      ? { score: 10, label: `Gender (${gender}) matches scheme requirement`, pass: true }
      : { score: 0, label: `This scheme is for ${scheme.genders.join('/')} only`, pass: false };
  } else {
    scores.gender = { score: 10, label: 'Open to all genders', pass: true };
  }

  // ── 5. Category/Caste match (weight: 15) ─
  if (scheme.categories && scheme.categories.length > 0) {
    const match = scheme.categories.includes(category);
    scores.category = match
      ? { score: 15, label: `Category (${category}) matches scheme requirement`, pass: true }
      : { score: 0, label: `Scheme targets ${scheme.categories.join('/')} category`, pass: false };
  } else {
    scores.category = { score: 15, label: 'Open to all categories including General', pass: true };
  }

  // ── 6. State match (weight: 10) ─
  if (scheme.stateSpecific) {
    const match = scheme.stateSpecific.toLowerCase() === state.toLowerCase();
    scores.state = match
      ? { score: 10, label: `You are from ${state} which qualifies for this state scheme`, pass: true }
      : { score: 0, label: `This scheme is only for ${scheme.stateSpecific} residents`, pass: false };
  } else {
    scores.state = { score: 10, label: 'Central scheme — available in all states', pass: true };
  }

  // ── Disability bonus (up to +5, capped at 100) ─
  let bonus = 0;
  if (hasDisability && scheme.disabilityBonus) {
    bonus = 5;
    scores.disability = { score: 5, label: 'Disability status gives priority eligibility', pass: true };
  }

  // Sum and cap
  const raw = Object.values(scores).reduce((a, v) => a + (v.score || 0), 0) + bonus;
  const finalScore = Math.min(Math.round(raw), 100);

  return { score: finalScore, breakdown: scores, bonus };
}

// ── Reasoning string generator ───────────────────────────────────────────
export function generateReasoning(scheme, profile, scoreResult) {
  const { breakdown, score } = scoreResult;
  const lines = [];

  Object.entries(breakdown).forEach(([key, item]) => {
    if (!item || item.score === undefined) return;
    if (item.pass === true)  lines.push(`✅ ${item.label}`);
    if (item.pass === false) lines.push(`❌ ${item.label}`);
    if (item.pass === null)  lines.push(`⚠️ ${item.label}`);
  });

  // Missing documents hint
  const missingDocs = [];
  if (!profile.hasAadhaar) missingDocs.push('Aadhaar Card');
  if (scheme.documents.includes('Caste Certificate') && !profile.casteDoc) missingDocs.push('Caste Certificate');
  if (scheme.documents.includes('Land Records') && profile.occupation !== 'Farmer') missingDocs.push('Land Records');

  const intro = score >= 80
    ? `You are **${score}% eligible** for this scheme.`
    : score >= 60
    ? `You have **${score}% compatibility** — some conditions don't fully match.`
    : `You have **${score}% match** — this scheme may not be ideal for your profile.`;

  return {
    intro,
    lines,
    missing: missingDocs,
    score,
  };
}

// ── Main retrieval function ───────────────────────────────────────────────
export function retrieveSchemes(profile, topK = 8) {
  if (!profile) return allSchemes.slice(0, topK);

  // Score all schemes
  const scored = allSchemes.map(scheme => {
    const result = computeEligibilityScore(scheme, profile);
    return {
      ...scheme,
      eligibilityScore: result.score,
      reasoning: generateReasoning(scheme, profile, result),
      _scoreBreakdown: result.breakdown,
    };
  });

  // Sort by eligibility score descending
  scored.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

  // Return top K (filter out 0-score nonstarters)
  return scored.filter(s => s.eligibilityScore > 0).slice(0, topK);
}

// ── Keyword search with RAG ranking ─────────────────────────────────────
export function ragSearch(query, profile, topK = 6) {
  const tokens = tokenize(query);
  const schemeScores = {};

  tokens.forEach(token => {
    const matchIds = _index[token] || [];
    // Partial match scan
    Object.keys(_index).forEach(key => {
      if (key.includes(token) || token.includes(key)) {
        (_index[key] || []).forEach(id => {
          schemeScores[id] = (schemeScores[id] || 0) + 1;
        });
      }
    });
    matchIds.forEach(id => {
      schemeScores[id] = (schemeScores[id] || 0) + 2; // exact match bonus
    });
  });

  // Get candidate schemes
  const candidateIds = Object.entries(schemeScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => parseInt(id));

  let candidates = candidateIds
    .map(id => allSchemes.find(s => s.id === id))
    .filter(Boolean)
    .slice(0, topK * 2);

  if (candidates.length === 0) {
    // Fallback: return best-matched by profile
    candidates = allSchemes.slice(0, topK * 2);
  }

  // Re-rank by eligibility if profile available
  if (profile) {
    candidates = candidates.map(scheme => {
      const result = computeEligibilityScore(scheme, profile);
      return {
        ...scheme,
        eligibilityScore: result.score,
        reasoning: generateReasoning(scheme, profile, result),
      };
    }).sort((a, b) => b.eligibilityScore - a.eligibilityScore);
  }

  return candidates.slice(0, topK);
}

// ── Life event detector ──────────────────────────────────────────────────
export function detectLifeEvents(profile) {
  const events = [];
  const age = parseInt(profile.age, 10);
  const dob = profile.dob ? new Date(profile.dob) : null;

  if (age === 17 || age === 16) {
    events.push({
      icon: '🗳️',
      title: 'Turning 18 Soon',
      desc: 'You will soon be eligible to register as a voter and access youth schemes like APY and PMSBY.',
      schemes: ['Atal Pension Yojana', 'PM Suraksha Bima Yojana'],
    });
  }
  if (age >= 18 && age <= 20) {
    events.push({
      icon: '🎓',
      title: 'College Age — Scholarships Available',
      desc: 'As a young adult, you can apply for NSP scholarships and PMKVY skill development programs.',
      schemes: ['National Scholarship Portal', 'Skill India – PMKVY'],
    });
  }
  if (age >= 60) {
    events.push({
      icon: '🧓',
      title: 'Senior Citizen Benefits',
      desc: 'You qualify for old-age pension schemes and priority healthcare access.',
      schemes: ['IGNOAPS', 'Ayushman Bharat'],
    });
  }
  if (profile.gender === 'Female' && age >= 18 && age <= 35) {
    events.push({
      icon: '💼',
      title: 'Women Entrepreneur Window',
      desc: 'Special loan schemes and skill programs for women are available to you.',
      schemes: ['Stand-Up India', 'PM Mudra Yojana'],
    });
  }
  if (profile.occupation === 'Farmer') {
    events.push({
      icon: '🌦️',
      title: 'Kharif Season Approaching',
      desc: 'PM Fasal Bima enrollment window opens soon. Insure your crop before it\'s too late.',
      schemes: ['PM Fasal Bima Yojana'],
    });
  }
  return events;
}
