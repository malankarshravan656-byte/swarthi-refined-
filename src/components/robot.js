// Full-Body CSS/SVG Robot Assistant
import { store } from '../store.js';
import { router } from '../router.js';

const MOODS = {
  wave:    { anim: 'wave',  msg: () => 'Hi! I\'m here to help! 👋' },
  think:   { anim: 'think', msg: () => 'Analyzing your profile...' },
  success: { anim: 'dance', msg: () => 'Found great schemes! 🎉' },
  hint:    { anim: 'float', msg: () => 'Click to apply now! 👆' },
  walk:    { anim: 'walk',  msg: () => 'Navigating for you...' },
};

let currentMood = 'wave';
let bubbleTimer = null;

export function initRobot() {
  const container = document.getElementById('robot-container');
  if (!container) return;
  container.innerHTML = getRobotHTML();
  setTimeout(() => { attachRobotEvents(); setRobotMood('wave', true); }, 100);
}

export function showRobot() {
  const c = document.getElementById('robot-container');
  if (c) c.classList.remove('hidden');
}

export function hideRobot() {
  const c = document.getElementById('robot-container');
  if (c) c.classList.add('hidden');
}

export function setRobotMood(mood, showBubble = false) {
  currentMood = mood;
  const data = MOODS[mood] || MOODS.wave;
  const body = document.getElementById('robot-body');
  if (body) {
    body.className = 'robot-body-inner';
    void body.offsetWidth;
    body.classList.add(`mood-${data.anim}`);
  }
  const rightArm = document.getElementById('robot-arm-right');
  if (rightArm) rightArm.style.animation = mood === 'wave' ? 'robotArmWave 0.6s ease-in-out 2' : '';

  document.querySelectorAll('.robot-eye').forEach(eye => {
    eye.style.background = mood === 'think' ? '#f59e0b' : mood === 'success' ? 'var(--success)' : 'var(--success)';
    eye.style.boxShadow = `0 0 8px ${mood === 'think' ? '#f59e0b' : 'var(--success)'}`;
  });

  const mouth = document.getElementById('robot-mouth');
  if (mouth) mouth.setAttribute('d', mood === 'success' ? 'M 10 14 Q 20 22 30 14' : mood === 'think' ? 'M 10 16 Q 20 16 30 16' : 'M 10 16 Q 20 21 30 16');

  if (showBubble) {
    const bubble = document.getElementById('robot-bubble');
    if (bubble) {
      bubble.innerHTML = `<span>${data.msg()}</span>`;
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0) scale(1)';
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => { bubble.style.opacity='0'; bubble.style.transform='translateY(6px) scale(0.96)'; }, 3500);
    }
  }
}

function getRobotHTML() {
  return `
    <div id="robot-bubble" style="
      position:absolute;bottom:200px;right:0;background:var(--bg-elevated);
      border:1px solid var(--glass-border);border-radius:14px;border-bottom-right-radius:3px;
      padding:9px 13px;font-size:0.76rem;line-height:1.5;box-shadow:var(--shadow-lg);
      min-width:130px;max-width:180px;text-align:center;pointer-events:none;
      opacity:0;transform:translateY(6px) scale(0.96);
      transition:all 0.35s cubic-bezier(.34,1.56,.64,1);
      z-index:calc(var(--z-robot, 50) + 2);
    "></div>

    <div id="robot-body" class="robot-body-inner mood-float" style="
      cursor:pointer;position:relative;width:100px;
      display:flex;flex-direction:column;align-items:center;
    ">
      <!-- HEAD -->
      <div style="
        position:relative;width:62px;height:56px;
        background:linear-gradient(145deg,#1e2a45,#141e33);
        border:2px solid rgba(108,99,255,0.55);border-radius:18px 18px 13px 13px;
        box-shadow:0 4px 24px rgba(108,99,255,0.3),0 0 0 1px rgba(108,99,255,0.12);
        display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;z-index:2;
      ">
        <div style="position:absolute;top:-17px;left:50%;transform:translateX(-50%);width:3px;height:17px;background:var(--primary);border-radius:2px;">
          <div id="antenna-orb" style="width:8px;height:8px;background:var(--primary-light);border-radius:50%;position:absolute;top:-4px;left:-2.5px;box-shadow:0 0 10px var(--primary);animation:robotAntennaPulse 1.5s ease-in-out infinite;"></div>
        </div>
        <div style="display:flex;gap:11px;margin-top:4px">
          <div class="robot-eye" style="width:11px;height:11px;border-radius:50%;background:var(--success);box-shadow:0 0 8px var(--success);animation:robotBlink 4s ease-in-out infinite;transition:background 0.3s;"></div>
          <div class="robot-eye" style="width:11px;height:11px;border-radius:50%;background:var(--success);box-shadow:0 0 8px var(--success);animation:robotBlink 4s ease-in-out 0.15s infinite;transition:background 0.3s;"></div>
        </div>
        <svg width="38" height="22" viewBox="0 0 40 24" style="margin-bottom:2px">
          <path id="robot-mouth" d="M 10 16 Q 20 21 30 16" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <div style="position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(ellipse at 50% 20%,rgba(108,99,255,0.22),transparent 60%);"></div>
      </div>

      <!-- NECK -->
      <div style="width:15px;height:6px;background:rgba(108,99,255,0.35);border-radius:2px;"></div>

      <!-- TORSO + ARMS -->
      <div style="display:flex;align-items:center;gap:3px">
        <div id="robot-arm-left" style="width:13px;height:44px;background:linear-gradient(180deg,#1e2a45,#141e33);border:1.5px solid rgba(108,99,255,0.35);border-radius:7px 7px 9px 9px;">
          <div style="width:13px;height:11px;background:rgba(108,99,255,0.3);border-radius:50%;margin-top:34px;"></div>
        </div>
        <div style="
          width:54px;height:60px;background:linear-gradient(155deg,#1a2540,#0f1724);
          border:2px solid rgba(108,99,255,0.42);border-radius:11px;
          box-shadow:0 5px 18px rgba(108,99,255,0.22);
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;position:relative;overflow:hidden;
        ">
          <div style="width:34px;height:18px;background:rgba(0,0,0,0.3);border:1px solid rgba(108,99,255,0.28);border-radius:5px;display:flex;gap:3px;align-items:center;justify-content:center;padding:3px;">
            <div style="width:7px;height:7px;border-radius:50%;background:#4eccc4;box-shadow:0 0 5px #4eccc4;animation:robotLedBlink 2s infinite;"></div>
            <div style="width:7px;height:7px;border-radius:50%;background:var(--primary);box-shadow:0 0 5px var(--primary);animation:robotLedBlink 2s 0.66s infinite;"></div>
            <div style="width:7px;height:7px;border-radius:50%;background:#f59e0b;box-shadow:0 0 5px #f59e0b;animation:robotLedBlink 2s 1.33s infinite;"></div>
          </div>
          <div style="font-size:0.5rem;font-weight:800;color:rgba(108,99,255,0.55);letter-spacing:1.5px">AI</div>
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(108,99,255,0.12),transparent 60%);pointer-events:none;border-radius:inherit;"></div>
        </div>
        <div id="robot-arm-right" style="width:13px;height:44px;background:linear-gradient(180deg,#1e2a45,#141e33);border:1.5px solid rgba(108,99,255,0.35);border-radius:7px 7px 9px 9px;transform-origin:top center;">
          <div style="width:13px;height:11px;background:rgba(108,99,255,0.3);border-radius:50%;margin-top:34px;"></div>
        </div>
      </div>

      <!-- WAIST -->
      <div style="width:34px;height:5px;background:rgba(108,99,255,0.28);border-radius:3px;margin-top:2px;"></div>

      <!-- LEGS -->
      <div style="display:flex;gap:7px;margin-top:2px;align-items:flex-start">
        <div id="robot-leg-left" style="display:flex;flex-direction:column;align-items:center;transform-origin:top center;transition:transform 0.2s ease">
          <div style="width:17px;height:38px;background:linear-gradient(180deg,#1e2a45,#141e33);border:1.5px solid rgba(108,99,255,0.32);border-radius:5px 5px 3px 3px;"></div>
          <div style="width:21px;height:9px;background:linear-gradient(90deg,#1e2a45,#141e33);border:1.5px solid rgba(108,99,255,0.38);border-radius:7px;"></div>
        </div>
        <div id="robot-leg-right" style="display:flex;flex-direction:column;align-items:center;transform-origin:top center;transition:transform 0.2s ease">
          <div style="width:17px;height:38px;background:linear-gradient(180deg,#1e2a45,#141e33);border:1.5px solid rgba(108,99,255,0.32);border-radius:5px 5px 3px 3px;"></div>
          <div style="width:21px;height:9px;background:linear-gradient(90deg,#141e33,#1e2a45);border:1.5px solid rgba(108,99,255,0.38);border-radius:7px;"></div>
        </div>
      </div>
    </div>

    <style>
      .robot-body-inner { animation:robotFloat 3s ease-in-out infinite; }
      .robot-body-inner.mood-float { animation:robotFloat 3s ease-in-out infinite !important; }
      .robot-body-inner.mood-wave  { animation:robotBounce 0.55s ease-in-out 3 !important; }
      .robot-body-inner.mood-think { animation:robotTilt 1.2s ease-in-out infinite !important; }
      .robot-body-inner.mood-dance { animation:robotDance 0.4s ease-in-out 6 !important; }
      .robot-body-inner.mood-walk  { animation:robotWalk 0.5s ease-in-out 4 !important; }
      @keyframes robotAntennaPulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.5)} }
      @keyframes robotBlink { 0%,88%,100%{transform:scaleY(1)}94%{transform:scaleY(0.05)} }
      @keyframes robotLedBlink { 0%,100%{opacity:1}50%{opacity:0.25} }
      @keyframes robotFloat { 0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)} }
      @keyframes robotBounce { 0%,100%{transform:translateY(0)}35%{transform:translateY(-11px)}70%{transform:translateY(-5px)} }
      @keyframes robotTilt { 0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg) translateY(-3px)}75%{transform:rotate(5deg) translateY(-3px)} }
      @keyframes robotDance { 0%{transform:rotate(-6deg)}25%{transform:rotate(6deg) translateY(-7px)}50%{transform:rotate(-6deg)}75%{transform:rotate(6deg) translateY(-5px)}100%{transform:rotate(-6deg)} }
      @keyframes robotWalk { 0%{transform:translateX(-5px)}50%{transform:translateX(5px)}100%{transform:translateX(-5px)} }
      @keyframes robotArmWave { 0%{transform:rotate(0)}25%{transform:rotate(-45deg) translateY(-8px)}75%{transform:rotate(-30deg) translateY(-6px)}100%{transform:rotate(0)} }
      #robot-body:hover { filter:drop-shadow(0 0 16px rgba(108,99,255,0.55)); }
    </style>
  `;
}

function attachRobotEvents() {
  const body = document.getElementById('robot-body');
  if (!body) return;
  let legDir = 1;
  setInterval(() => {
    if (currentMood !== 'walk') return;
    document.getElementById('robot-leg-left')?.style && (document.getElementById('robot-leg-left').style.transform = `rotate(${6*legDir}deg)`);
    document.getElementById('robot-leg-right')?.style && (document.getElementById('robot-leg-right').style.transform = `rotate(${-6*legDir}deg)`);
    legDir *= -1;
  }, 350);

  body.addEventListener('click', () => {
    const moods = Object.keys(MOODS);
    setRobotMood(moods[(moods.indexOf(currentMood) + 1) % moods.length], true);
  });
  let pressTimer;
  const startPress = () => { pressTimer = setTimeout(() => { setRobotMood('walk',true); setTimeout(()=>router.navigate('chatbot'),700); }, 800); };
  const endPress = () => clearTimeout(pressTimer);
  body.addEventListener('mousedown', startPress);
  body.addEventListener('mouseup', endPress);
  body.addEventListener('touchstart', startPress, {passive:true});
  body.addEventListener('touchend', endPress);
}
