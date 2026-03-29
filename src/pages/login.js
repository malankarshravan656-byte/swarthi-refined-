// Login Page
import { store } from '../store.js';
import { router } from '../router.js';
import { showToast } from '../components/toast.js';
import { hideRobot } from '../components/robot.js';
import { getAllStates } from '../data/states.js';

export function renderLogin(outlet) {
  hideRobot();
  outlet.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-orb auth-orb-1"></div>
      <div class="auth-orb auth-orb-2"></div>

      <!-- Tricolor top accent -->
      <div style="position:absolute;top:0;left:0;right:0;height:4px;
        background:linear-gradient(90deg,var(--saffron) 0%,var(--saffron) 33%,
          rgba(240,240,240,0.6) 33%,rgba(240,240,240,0.6) 66%,
          var(--india-green) 66%,var(--india-green) 100%);z-index:2"></div>

      <div class="auth-card" style="border-top:3px solid rgba(255,153,51,0.30)">
        <div class="auth-logo">
          <div class="auth-logo-icon" style="background:linear-gradient(135deg,#FF9933,#E67E00)">🇮🇳</div>
          <div>
            <div class="auth-logo-name" style="font-family:'Crimson Pro',var(--font-heading),serif;letter-spacing:0.3px">
              Scheme<span style="color:var(--saffron)">Setu</span>
            </div>
            <div class="hindi-accent" style="text-align:center;margin-top:2px">आपकी योजना, आपका अधिकार</div>
          </div>
        </div>

        <h1 class="auth-title">${store.t('loginTitle')}</h1>
        <p class="auth-subtitle">${store.t('loginSubtitle')}</p>

        <!-- Google Sign-In -->
        <button class="google-btn" id="google-signin-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          ${store.t('continueGoogle')}
        </button>

        <div class="auth-divider">${store.t('orDivider')}</div>

        <form id="login-form" style="display:flex;flex-direction:column;gap:var(--space-4)">
          <div class="input-group">
            <label class="input-label" for="login-email">${store.t('email')}</label>
            <div class="input-icon-wrap">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>
              <input type="email" id="login-email" class="input-field" placeholder="you@example.com" required autocomplete="email"/>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label" for="login-password">${store.t('password')}</label>
            <div class="input-icon-wrap">
              <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type="password" id="login-password" class="input-field" placeholder="••••••••" required autocomplete="current-password"/>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-full" style="margin-top:4px;padding:15px;
            background:linear-gradient(135deg,#FF9933,#E67E00);
            box-shadow:0 4px 18px rgba(255,153,51,0.38)" id="login-submit-btn">
            ${store.t('login')}
          </button>
        </form>

        <p style="text-align:center;margin-top:var(--space-5);font-size:0.875rem;color:var(--text-muted)">
          ${store.t('noAccount')}
          <a href="#signup" id="goto-signup" style="color:var(--primary-light);font-weight:600;cursor:pointer;margin-left:4px">${store.t('signup')}</a>
        </p>

        <!-- Demo hint -->
        <div style="
          margin-top:var(--space-5);padding:12px 16px;
          background:rgba(255,153,51,0.07);
          border:1px solid rgba(255,153,51,0.20);
          border-radius:var(--radius-lg);
          font-size:0.78rem;color:var(--text-muted);
          text-align:center;line-height:1.6
        ">
          💡 Demo: use any email &amp; password to login
        </div>
      </div>
    </div>
  `;

  // Login form submit
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');

    if (!email || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Simulate login
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    setTimeout(() => {
      const existingUser = JSON.parse(localStorage.getItem('schemesetu_user'));
      if (existingUser && existingUser.email === email) {
        store.login(existingUser);
      } else {
        // Create minimal user
        store.login({
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          email,
          state: 'Maharashtra',
          city: 'Mumbai',
          income: 'Below ₹1 Lakh',
          occupation: 'Farmer',
          age: '35',
          gender: 'Male',
        });
      }
      showToast(`Welcome back! 👋`, 'success');
      router.navigate('home');
    }, 1200);
  });

  // Google sign-in simulation
  document.getElementById('google-signin-btn')?.addEventListener('click', () => {
    showToast('Connecting to Google...', 'info', 1500);
    setTimeout(() => {
      store.login({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        state: 'Maharashtra',
        city: 'Nagpur',
        income: '₹1–3 Lakh',
        occupation: 'Farmer',
        age: '32',
        gender: 'Male',
      });
      showToast('Signed in with Google! 🎉', 'success');
      router.navigate('home');
    }, 1800);
  });

  // Go to signup
  document.getElementById('goto-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('signup');
  });
}
