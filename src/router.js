// Hash-based client-side router
import { store } from './store.js';

const routes = {};
let _suppressNext = false;   // prevents double-render on programmatic navigate

export const router = {
  register(path, handler) {
    routes[path] = handler;
  },

  navigate(path, params = {}) {
    _suppressNext = true;           // suppress the upcoming hashchange event
    window.location.hash = path;
    store.setState({ currentPage: path });
    this._render(path, params);
  },

  init() {
    window.addEventListener('hashchange', () => {
      if (_suppressNext) { _suppressNext = false; return; }
      const hash = window.location.hash.replace('#', '') || 'home';
      this._render(hash);
    });

    // Initial render
    const hash = window.location.hash.replace('#', '') || (store.isLoggedIn() ? 'home' : 'login');
    this._render(hash);
  },

  _render(path, params = {}) {
    const outlet = document.getElementById('page-outlet');
    if (!outlet) return;

    // Auth guard
    const publicRoutes = ['login', 'signup'];
    if (!publicRoutes.includes(path) && !store.isLoggedIn()) {
      path = 'login';
    }
    if (publicRoutes.includes(path) && store.isLoggedIn()) {
      path = 'home';
    }

    const handler = routes[path] || routes['home'];
    if (handler) {
      outlet.innerHTML = '';
      handler(outlet, params);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  getCurrentPage() {
    return window.location.hash.replace('#', '') || 'home';
  }
};
