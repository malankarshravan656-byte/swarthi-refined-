// Roadmap Page – Application Journey
import { store } from '../store.js';
import { showRobot, setRobotMood } from '../components/robot.js';

const STEPS = [
  { key: 'apply',   emoji: '📝', label: 'step_apply',   desc: 'Your application has been successfully submitted to the government portal. Reference number generated.' },
  { key: 'verify',  emoji: '🔍', label: 'step_verify',  desc: 'Documents are being verified by the department. This usually takes 7-15 working days.' },
  { key: 'approve', emoji: '✅', label: 'step_approve', desc: 'Your application is approved and pending fund disbursement. Final review completed.' },
  { key: 'benefit', emoji: '💰', label: 'step_benefit', desc: 'Benefit amount has been credited directly to your registered bank account via DBT.' },
];

export function renderRoadmap(outlet) {
  showRobot();
  const roadmapStep = store.state.roadmapStep || 0;

  outlet.innerHTML = `
    <div class="page roadmap-page">
      <div class="container">

        <!-- Header -->
        <div class="section-header anim-fade-in-up" style="margin-top:var(--space-6)">
          <h1 style="font-family:var(--font-heading);font-size:2rem;font-weight:800">${store.t('roadmapTitle')}</h1>
          <p>${store.t('roadmapSubtitle')}</p>
        </div>

        <!-- Progress Bar Overall -->
        <div style="margin-bottom:var(--space-8)" class="anim-fade-in-up delay-100">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
            <span style="font-size:0.875rem;color:var(--text-muted)">Overall Progress</span>
            <span style="font-size:0.9rem;font-weight:700;color:var(--primary-light)">${Math.round((roadmapStep / STEPS.length) * 100)}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" id="roadmap-overall-bar" style="width:0%;transition:width 1.2s ease 0.5s"></div>
          </div>
        </div>

        <!-- Journey Visual -->
        <div style="
          display:flex;align-items:flex-start;justify-content:center;
          gap:0;position:relative;margin-bottom:var(--space-10);
          flex-wrap:nowrap;overflow-x:auto;padding-bottom:var(--space-4)
        " class="anim-fade-in-up delay-200" id="journey-visual">
          ${STEPS.map((step, i) => {
            const status = i < roadmapStep ? 'completed' : i === roadmapStep && roadmapStep > 0 ? 'active' : 'pending';
            const isLast = i === STEPS.length - 1;
            return `
              <div style="display:flex;align-items:flex-start;flex:1;min-width:120px">
                <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-2);flex:1">
                  <!-- Circle -->
                  <div style="
                    width:64px;height:64px;border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:1.6rem;
                    border:3px solid ${status === 'completed' ? 'var(--success)' : status === 'active' ? 'var(--primary)' : 'rgba(255,255,255,0.15)'};
                    background:${status === 'completed' ? 'rgba(78,204,163,0.15)' : status === 'active' ? 'rgba(108,99,255,0.15)' : 'var(--glass-bg)'};
                    box-shadow:${status === 'active' ? '0 0 24px rgba(108,99,255,0.4)' : 'none'};
                    animation:${status === 'active' ? 'glowPulse 2s ease-in-out infinite' : 'none'};
                    transition:all 0.5s ease ${i * 0.15}s;
                    flex-shrink:0;
                  ">
                    ${status === 'completed' ? '✅' : step.emoji}
                  </div>
                  <!-- Label -->
                  <div style="text-align:center;max-width:100px">
                    <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:700;color:${status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)'}">${store.t(step.label)}</div>
                    ${status !== 'pending' ? `<div style="font-size:0.65rem;color:var(--success);margin-top:2px;font-weight:600">${status === 'completed' ? 'Completed ✓' : 'In Progress...'}</div>` : '<div style="font-size:0.65rem;color:var(--text-muted);margin-top:2px">Pending</div>'}
                  </div>
                </div>
                ${!isLast ? `
                  <!-- Connector line -->
                  <div style="
                    flex:1;height:3px;margin-top:30px;
                    background:${i < roadmapStep ? 'var(--success)' : 'rgba(255,255,255,0.1)'};
                    border-radius:2px;min-width:20px;
                    transition:background 0.8s ease ${i * 0.2}s;
                  "></div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Step Details Cards -->
        <div style="display:flex;flex-direction:column;gap:var(--space-4)" class="anim-fade-in-up delay-300">
          ${STEPS.map((step, i) => {
            const status = i < roadmapStep ? 'completed' : i === roadmapStep && roadmapStep > 0 ? 'active' : 'pending';
            return `
              <div class="roadmap-step ${status}" style="animation:fadeInLeft 0.4s ease ${i * 0.1}s both">
                <div class="step-circle ${status}" style="font-size:1.5rem">${step.emoji}</div>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:6px">
                    <h3 style="font-family:var(--font-heading);font-weight:700">${store.t(step.label)}</h3>
                    ${status === 'completed' ? '<span style="padding:3px 10px;border-radius:var(--radius-full);background:rgba(78,204,163,0.15);border:1px solid rgba(78,204,163,0.3);font-size:0.72rem;font-weight:700;color:var(--success)">DONE</span>' : ''}
                    ${status === 'active' ? '<span style="padding:3px 10px;border-radius:var(--radius-full);background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);font-size:0.72rem;font-weight:700;color:var(--primary-light)">IN PROGRESS</span>' : ''}
                    ${status === 'pending' ? '<span style="padding:3px 10px;border-radius:var(--radius-full);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);font-size:0.72rem;font-weight:700;color:var(--text-muted)">PENDING</span>' : ''}
                  </div>
                  <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6">${step.desc}</p>
                </div>
                <div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:800;color:rgba(255,255,255,0.08)">0${i+1}</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Action to start journey -->
        ${roadmapStep === 0 ? `
          <div style="
            margin-top:var(--space-8);padding:var(--space-8);
            background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.3);
            border-radius:var(--radius-2xl);text-align:center;
          " class="anim-fade-in-up delay-400">
            <div style="font-size:3rem;margin-bottom:var(--space-4)">🚀</div>
            <h3 style="font-family:var(--font-heading);font-size:1.3rem;font-weight:700;margin-bottom:var(--space-3)">Start Your Application Journey</h3>
            <p style="color:var(--text-secondary);margin-bottom:var(--space-6);max-width:480px;margin-left:auto;margin-right:auto">Browse schemes and click "Apply For Me" on any eligible scheme to begin. Your journey will be tracked here.</p>
            <a href="#schemes" onclick="window.location.hash='schemes'" class="btn btn-primary btn-lg">📋 Browse Schemes</a>
          </div>
        ` : `
          <div style="
            margin-top:var(--space-8);padding:var(--space-6);
            background:rgba(78,204,163,0.1);border:1px solid rgba(78,204,163,0.3);
            border-radius:var(--radius-xl);display:flex;align-items:center;gap:var(--space-5)
          " class="anim-fade-in-up delay-400">
            <div style="font-size:2.5rem">📱</div>
            <div>
              <div style="font-family:var(--font-heading);font-weight:700;margin-bottom:4px;color:var(--success)">SMS Notifications Active</div>
              <div style="font-size:0.85rem;color:var(--text-secondary)">You'll receive updates at ${store.state.user?.phone || '+91 98765 XXXXX'} for each status change</div>
            </div>
          </div>
        `}

      </div>
    </div>
  `;

  // Animate overall progress bar
  setTimeout(() => {
    const bar = document.getElementById('roadmap-overall-bar');
    if (bar) bar.style.width = `${Math.round((roadmapStep / STEPS.length) * 100)}%`;
  }, 100);

  if (roadmapStep > 0) setRobotMood('success', true);
}
