// DigiLocker Simulator Page
import { store } from '../store.js';
import { showRobot, setRobotMood } from '../components/robot.js';
import { showToast } from '../components/toast.js';

const DOCUMENT_TYPES = [
  { id: 'aadhaar',    name: 'Aadhaar Card',       icon: '🪪', required: true  },
  { id: 'pan',        name: 'PAN Card',            icon: '💳', required: false },
  { id: 'income',     name: 'Income Certificate',  icon: '📜', required: false },
  { id: 'caste',      name: 'Caste Certificate',   icon: '🏷️', required: false },
  { id: 'land',       name: 'Land Records',        icon: '🌾', required: false },
  { id: 'ration',     name: 'Ration Card',         icon: '📋', required: false },
  { id: 'bank',       name: 'Bank Passbook',       icon: '🏦', required: false },
  { id: 'education',  name: 'Education Certificate',icon: '🎓',required: false },
  { id: 'disability', name: 'Disability Certificate',icon: '♿',required: false },
  { id: 'domicile',   name: 'Domicile Certificate',icon: '🏠', required: false },
];

function getStoredDocs() {
  try { return JSON.parse(localStorage.getItem('schemesetu_docs') || '{}'); } catch { return {}; }
}
function saveDocs(docs) {
  try { localStorage.setItem('schemesetu_docs', JSON.stringify(docs)); } catch {}
}

export function renderDigilocker(outlet) {
  showRobot();
  setRobotMood('hint', true);
  const storedDocs = getStoredDocs();
  const uploadedCount = Object.values(storedDocs).filter(Boolean).length;

  outlet.innerHTML = `
    <div class="page" style="position:relative;z-index:1">
      <div class="container" style="max-width:860px">

        <!-- Header -->
        <div style="padding:var(--space-8) 0 var(--space-5)" class="anim-fade-in-up">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 14px;border-radius:var(--radius-full);background:rgba(78,204,163,0.12);border:1px solid rgba(78,204,163,0.3);font-size:0.72rem;font-weight:600;color:var(--success);margin-bottom:var(--space-3)">
            🔒 Secure Document Vault
          </div>
          <h1 style="font-family:var(--font-heading);font-size:clamp(1.6rem,3.5vw,2.4rem);font-weight:900;margin-bottom:var(--space-2)">
            📄 DigiLocker <span class="grad-text">Document</span> Manager
          </h1>
          <p style="font-size:0.88rem;color:var(--text-secondary);max-width:500px">
            Upload and manage your documents here. They'll be auto-filled when applying for schemes.
          </p>
        </div>

        <!-- DigiLocker sync banner -->
        <div style="
          display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) var(--space-5);
          background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(78,204,163,0.08));
          border:1px solid rgba(108,99,255,0.3);border-radius:var(--radius-xl);margin-bottom:var(--space-6)
        " class="anim-fade-in-up delay-100">
          <div style="font-size:2rem">🔗</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.92rem">Link with DigiLocker (Government of India)</div>
            <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:3px">Sync your Aadhaar, PAN, education certificates directly from DigiLocker.gov.in</div>
          </div>
          <button class="btn btn-primary btn-sm" id="digilocker-link-btn">🔗 Link DigiLocker</button>
        </div>

        <!-- Stats row -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-6)" class="anim-fade-in-up delay-150">
          <div style="padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-xl);text-align:center">
            <div class="grad-text" style="font-size:2rem;font-weight:900;font-family:var(--font-heading)">${uploadedCount}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Uploaded</div>
          </div>
          <div style="padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-xl);text-align:center">
            <div style="font-size:2rem;font-weight:900;font-family:var(--font-heading);color:var(--success)">${DOCUMENT_TYPES.length}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Total Slots</div>
          </div>
          <div style="padding:var(--space-4);background:var(--glass-bg);border:1px solid var(--glass-border);border-radius:var(--radius-xl);text-align:center">
            <div style="font-size:2rem;font-weight:900;font-family:var(--font-heading);color:${uploadedCount>=3?'var(--success)':'#f59e0b'}">${uploadedCount>=5?'High':uploadedCount>=3?'Medium':'Low'}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Readiness</div>
          </div>
        </div>

        <!-- Document grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4);margin-bottom:var(--space-10)" id="doc-grid" class="anim-fade-in-up delay-200">
          ${DOCUMENT_TYPES.map((doc, i) => {
            const uploaded = storedDocs[doc.id];
            return `
              <div class="doc-card" data-doc-id="${doc.id}" style="
                padding:var(--space-5);background:var(--glass-bg);
                border:1.5px solid ${uploaded?'rgba(78,204,163,0.4)':'var(--glass-border)'};
                border-radius:var(--radius-xl);cursor:pointer;
                transition:all 0.25s ease;position:relative;overflow:hidden;
                animation:fadeInUp 0.4s ease ${i*0.05}s both;
              ">
                ${doc.required ? `<div style="position:absolute;top:10px;right:10px;font-size:0.6rem;font-weight:700;color:var(--primary-light);background:rgba(108,99,255,0.2);padding:2px 7px;border-radius:var(--radius-full);border:1px solid rgba(108,99,255,0.35)">REQUIRED</div>` : ''}
                <div style="font-size:2.2rem;margin-bottom:var(--space-3)">${doc.icon}</div>
                <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px">${doc.name}</div>
                ${uploaded ? `
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                    <div style="width:7px;height:7px;border-radius:50%;background:var(--success)"></div>
                    <span style="font-size:0.72rem;color:var(--success);font-weight:600">Uploaded</span>
                    <span style="font-size:0.65rem;color:var(--text-muted)">${uploaded.date}</span>
                  </div>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-ghost btn-sm view-doc-btn" data-doc-id="${doc.id}" style="font-size:0.7rem;flex:1">👁 View</button>
                    <button class="btn btn-ghost btn-sm delete-doc-btn" data-doc-id="${doc.id}" style="font-size:0.7rem;color:#ef4444;border-color:rgba(239,68,68,0.3)">🗑</button>
                  </div>
                ` : `
                  <div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:10px">Not uploaded yet</div>
                  <label class="btn btn-ghost btn-sm upload-trigger" style="font-size:0.72rem;cursor:pointer;text-align:center;padding:6px 12px">
                    ⬆️ Upload
                    <input type="file" class="doc-file-input" data-doc-id="${doc.id}" accept=".pdf,.jpg,.jpeg,.png" style="display:none"/>
                  </label>
                `}
                <!-- Hover glow -->
                <div style="position:absolute;inset:0;opacity:0;transition:opacity 0.2s;background:radial-gradient(ellipse at 50% 0%,rgba(108,99,255,0.12),transparent 70%);pointer-events:none" class="card-glow"></div>
              </div>`;
          }).join('')}
        </div>

        <!-- Hidden upload modal slot -->
        <div id="upload-modal-slot"></div>
      </div>
    </div>
  `;

  // DigiLocker link simulate
  document.getElementById('digilocker-link-btn')?.addEventListener('click', () => {
    showToast('🔗 Opening DigiLocker OAuth...', 'success', 2000);
    setTimeout(() => {
      showToast('✅ DigiLocker linked! Aadhaar & PAN synced.', 'success', 4000);
      const docs = getStoredDocs();
      docs['aadhaar'] = { name: 'Aadhaar Card', date: new Date().toLocaleDateString('en-IN'), source: 'DigiLocker' };
      docs['pan'] = { name: 'PAN Card', date: new Date().toLocaleDateString('en-IN'), source: 'DigiLocker' };
      saveDocs(docs);
      renderDigilocker(outlet);
    }, 2000);
  });

  // Card hover
  document.querySelectorAll('.doc-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.borderColor = 'rgba(108,99,255,0.5)';
      card.querySelector('.card-glow').style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const docId = card.dataset.docId;
      const docs = getStoredDocs();
      card.style.borderColor = docs[docId] ? 'rgba(78,204,163,0.4)' : 'var(--glass-border)';
      card.querySelector('.card-glow').style.opacity = '0';
    });
  });

  // File upload listeners
  document.querySelectorAll('.doc-file-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const docId = input.dataset.docId;
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB', 'error'); return; }
      showToast(`⬆️ Uploading ${file.name}...`, 'success', 1500);
      setTimeout(() => {
        const docs = getStoredDocs();
        docs[docId] = { name: file.name, date: new Date().toLocaleDateString('en-IN'), size: `${(file.size/1024).toFixed(1)} KB` };
        saveDocs(docs);
        showToast(`✅ ${DOCUMENT_TYPES.find(d=>d.id===docId)?.name} uploaded!`, 'success', 3000);
        renderDigilocker(outlet);
      }, 1500);
    });
  });

  // View doc
  document.querySelectorAll('.view-doc-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const docId = btn.dataset.docId;
      const docs = getStoredDocs();
      const doc = docs[docId];
      const docMeta = DOCUMENT_TYPES.find(d => d.id === docId);
      showDocModal(docMeta, doc);
    });
  });

  // Delete doc
  document.querySelectorAll('.delete-doc-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!confirm('Delete this document?')) return;
      const docs = getStoredDocs();
      delete docs[btn.dataset.docId];
      saveDocs(docs);
      showToast('Document removed', 'success', 2000);
      renderDigilocker(outlet);
    });
  });
}

function showDocModal(docMeta, doc) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:380px;text-align:center">
      <div style="font-size:3rem;margin-bottom:var(--space-3)">${docMeta?.icon || '📄'}</div>
      <h3 style="font-weight:700;font-family:var(--font-heading);margin-bottom:var(--space-3)">${docMeta?.name}</h3>
      <div style="background:rgba(78,204,163,0.08);border:1px solid rgba(78,204,163,0.25);border-radius:var(--radius-lg);padding:var(--space-4);margin-bottom:var(--space-4)">
        <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px">
          <span style="color:var(--text-muted)">File name</span><span style="font-weight:600">${doc?.name}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px">
          <span style="color:var(--text-muted)">Uploaded</span><span style="font-weight:600">${doc?.date}</span>
        </div>
        ${doc?.source ? `<div style="display:flex;justify-content:space-between;font-size:0.82rem"><span style="color:var(--text-muted)">Source</span><span style="font-weight:600;color:var(--success)">${doc.source}</span></div>` : ''}
        ${doc?.size ? `<div style="display:flex;justify-content:space-between;font-size:0.82rem"><span style="color:var(--text-muted)">Size</span><span style="font-weight:600">${doc.size}</span></div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:5px;justify-content:center;font-size:0.75rem;color:var(--success);margin-bottom:var(--space-4)">
        <div style="width:7px;height:7px;border-radius:50%;background:var(--success)"></div>
        Verified & Stored Securely
      </div>
      <button class="btn btn-primary w-full" id="close-doc-modal">Close</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.getElementById('close-doc-modal')?.addEventListener('click', () => modal.remove());
}
