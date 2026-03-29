// App State Store
import { en } from './i18n/en.js';
import { hi } from './i18n/hi.js';
import { mr } from './i18n/mr.js';

const LANGUAGES = { en, hi, mr };

const defaultState = {
  user: null,
  language: 'en',
  currentPage: 'login',
  selectedState: null,
  selectedCity: null,
  schemeFilter: { category: 'all', search: '', state: null },
  roadmapStep: 0,    // 0=none,1=applied,2=verify,3=approve,4=done
  notifications: [],
};

let _state = { ...defaultState };
let _listeners = [];

export const store = {
  get state() { return _state; },

  subscribe(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  },

  setState(partial) {
    _state = { ..._state, ...partial };
    _listeners.forEach(fn => fn(_state));
    this._persist();
  },

  // Shortcut: get translation key
  t(key) {
    const lang = _state.language;
    const dict = LANGUAGES[lang] || en;
    return dict[key] || en[key] || key;
  },

  // Persist user to localStorage
  _persist() {
    try {
      localStorage.setItem('schemesetu_user', JSON.stringify(_state.user));
      localStorage.setItem('schemesetu_lang', _state.language);
      localStorage.setItem('schemesetu_roadmap', String(_state.roadmapStep));
    } catch(e) {}
  },

  // Restore from localStorage
  restore() {
    try {
      const user = JSON.parse(localStorage.getItem('schemesetu_user'));
      const language = localStorage.getItem('schemesetu_lang') || 'en';
      const roadmapStep = parseInt(localStorage.getItem('schemesetu_roadmap') || '0');
      if (user) _state = { ..._state, user, language, roadmapStep };
      else _state = { ..._state, language };
    } catch(e) {}
  },

  isLoggedIn() {
    return !!_state.user;
  },

  login(userData) {
    this.setState({ user: userData, currentPage: 'home' });
  },

  logout() {
    _state = { ...defaultState, language: _state.language };
    localStorage.removeItem('schemesetu_user');
    localStorage.removeItem('schemesetu_roadmap');
    this.setState({ currentPage: 'login' });
  },

  setLanguage(lang) {
    this.setState({ language: lang });
  },
};
