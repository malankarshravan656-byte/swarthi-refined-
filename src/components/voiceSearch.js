// Voice Search Component
import { store } from '../store.js';
import { showToast } from './toast.js';

export function createVoiceButton(onResult) {
  const btn = document.createElement('div');
  btn.className = 'mic-btn';
  btn.id = 'voice-mic-btn';
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  `;

  let isListening = false;
  let recognition = null;

  const startListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    isListening = true;
    btn.classList.add('listening');
    showToast(store.t('voicePrompt'), 'info', 4000);

    // Try Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = store.state.language === 'hi' ? 'hi-IN' :
                         store.state.language === 'mr' ? 'mr-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        stopListening();
        showToast(`Heard: "${transcript}"`, 'success', 3000);
        if (onResult) onResult(transcript);
      };

      recognition.onerror = () => {
        stopListening();
        simulateVoice(onResult);
      };

      recognition.onend = () => stopListening();
      recognition.start();
    } else {
      // Simulate voice input
      setTimeout(() => {
        stopListening();
        simulateVoice(onResult);
      }, 2000);
    }
  };

  const stopListening = () => {
    isListening = false;
    btn.classList.remove('listening');
    if (recognition) {
      try { recognition.stop(); } catch(e) {}
      recognition = null;
    }
  };

  btn.addEventListener('click', startListening);
  return btn;
}

function simulateVoice(onResult) {
  const samples = [
    'PM Kisan for farmers',
    'health scheme for poor family',
    'scholarship for students',
    'housing loan subsidy',
    'women entrepreneur loan',
    'NREGA job card',
  ];
  const text = samples[Math.floor(Math.random() * samples.length)];
  showToast(`Voice: "${text}"`, 'success', 3000);
  if (onResult) onResult(text);
}
