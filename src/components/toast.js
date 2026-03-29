// Toast notification system
let toastCount = 0;

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  const id = `toast-${toastCount++}`;
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-size:1.1rem">${icons[type]}</span>
    <span style="flex:1">${message}</span>
    <button onclick="this.closest('.toast').remove()" style="color:var(--text-muted);font-size:1rem;padding:0 4px">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}
