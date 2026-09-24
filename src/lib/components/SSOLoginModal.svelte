<script>
  import { demoRoles } from '$lib/data/mockData.js';

  let {
    isOpen = false,
    onClose = () => {},
    onLoginSuccess = (role) => {}
  } = $props();

  let email = $state('');
  let password = $state('');
  let selectedRole = $state(demoRoles[0]);
  let isSubmitting = $state(false);

  function handleLogin(role = selectedRole) {
    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      onLoginSuccess(role);
      onClose();
    }, 600);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    class="modal-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
    role="dialog"
    aria-modal="true"
    aria-label="SSO Login Dialog"
    tabindex="-1"
  >
    <div
      class="modal-card"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <button
        type="button"
        class="close-btn"
        onclick={onClose}
        aria-label="Tutup"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="sso-grid">
        <!-- Left Side: Campus Branding Motif -->
        <div class="brand-panel">
          <div class="brand-badge-top">
            <span class="material-symbols-outlined icon-fill">account_balance</span>
            <span>UNIVERSITAS FEB-X PORTAL</span>
          </div>

          <div class="brand-lead">
            <h3 class="lead-title">Empowered Intelligence</h3>
            <p class="lead-sub">
              Akses ekosistem bisnis terpadu mahasiswa, pembimbingan dosen, dan tata kelola kewirausahaan fakultas.
            </p>
          </div>

          <div class="quick-role-picker">
            <span class="role-picker-label font-mono">PILIH ROLE DEMO CEPAT:</span>
            <div class="role-list">
              {#each demoRoles as role}
                <button
                  type="button"
                  class="role-card {selectedRole.id === role.id ? 'active' : ''}"
                  onclick={() => { selectedRole = role; handleLogin(role); }}
                >
                  <span class="material-symbols-outlined role-icon">{role.icon}</span>
                  <div class="role-meta">
                    <span class="role-name">{role.name}</span>
                    <span class="role-sub font-mono">{role.badge}</span>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Right Side: SSO & Email Login Form -->
        <div class="form-panel">
          <h2 class="form-title">Portal SSO Civitas FEB</h2>
          <p class="form-desc">Gunakan Single Sign-On akun universitas Anda.</p>

          <!-- Primary SSO Button -->
          <button
            type="button"
            class="btn-sso-main"
            onclick={() => handleLogin(selectedRole)}
            disabled={isSubmitting}
          >
            <span class="material-symbols-outlined">school</span>
            <span>{isSubmitting ? 'Memvalidasi Token SSO...' : 'Masuk via SSO Kampus'}</span>
          </button>

          <div class="divider">
            <span class="divider-text font-mono">ATAU LOGIN MANUAL</span>
          </div>

          <form class="login-form" onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div class="form-group">
              <label for="sso-email" class="form-label">Email Kampus / Akun Bisnis</label>
              <input
                id="sso-email"
                type="email"
                placeholder="nama.mahasiswa@mail.ugm.ac.id"
                class="form-input"
                bind:value={email}
              />
            </div>

            <div class="form-group">
              <div class="pass-header">
                <label for="sso-password" class="form-label">Kata Sandi</label>
                <a href="#forgot" class="forgot-link" onclick={(e) => { e.preventDefault(); alert('Hubungi Helpdesk IT FEB.'); }}>Lupa Sandi?</a>
              </div>
              <input
                id="sso-password"
                type="password"
                placeholder="••••••••"
                class="form-input"
                bind:value={password}
              />
            </div>

            <button
              type="submit"
              class="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : 'Masuk ke Platform'}
            </button>
          </form>

          <div class="form-footer">
            <span class="footer-hint">Belum mendaftarkan usaha mahasiswa?</span>
            <button
              type="button"
              class="link-register"
              onclick={() => { alert('Form Registrasi Bisnis FEB-X: Buka link pendaftaran inkubasi di dekanat.'); }}
            >
              Daftarkan Bisnis Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background-color: rgba(0, 6, 102, 0.5);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    animation: fadeIn 0.2s ease;
  }

  .modal-card {
    background-color: var(--color-surface-container-lowest);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-outline-variant);
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-width: 820px;
    position: relative;
    overflow: hidden;
    animation: scaleUp 0.2s ease;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-on-surface);
    cursor: pointer;
    z-index: 10;
  }

  .sso-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    .sso-grid {
      grid-template-columns: 5fr 5.5fr;
    }
  }

  /* Brand Panel */
  .brand-panel {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: 2.25rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .brand-badge-top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
    color: var(--color-secondary-fixed);
    font-weight: 700;
  }

  .lead-title {
    font-size: 1.75rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  .lead-sub {
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-primary-fixed);
    opacity: 0.9;
  }

  .quick-role-picker {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .role-picker-label {
    font-size: 0.6875rem;
    color: var(--color-secondary-container);
    letter-spacing: 0.08em;
  }

  .role-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .role-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: var(--radius-sm);
    color: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .role-card:hover, .role-card.active {
    background-color: rgba(255, 255, 255, 0.18);
    border-color: var(--color-secondary-container);
  }

  .role-icon {
    font-size: 20px;
    color: var(--color-secondary-container);
  }

  .role-meta {
    display: flex;
    flex-direction: column;
  }

  .role-name {
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .role-sub {
    font-size: 0.6875rem;
    opacity: 0.8;
  }

  /* Form Panel */
  .form-panel {
    padding: 2.25rem 2rem;
    display: flex;
    flex-direction: column;
  }

  .form-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
  }

  .form-desc {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant);
    margin-bottom: 1.5rem;
  }

  .btn-sso-main {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-sso-main:hover {
    background-color: var(--color-primary-container);
    box-shadow: var(--shadow-ambient);
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.25rem 0;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .divider-text {
    font-size: 0.6875rem;
    color: var(--color-outline);
    padding: 0 0.75rem;
    letter-spacing: 0.05em;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .pass-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-on-surface);
  }

  .forgot-link {
    font-size: 0.75rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .form-input {
    padding: 0.625rem 0.875rem;
    font-size: 0.875rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-bright);
    outline: none;
    font-family: var(--font-sans);
  }

  .form-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 6, 102, 0.08);
  }

  .btn-submit {
    background-color: transparent;
    border: 1.5px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 0.875rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: all 0.15s ease;
  }

  .btn-submit:hover {
    background-color: var(--color-surface-container-low);
  }

  .form-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-outline-variant);
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
  }

  .footer-hint {
    color: var(--color-outline);
  }

  .link-register {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 700;
    cursor: pointer;
    text-decoration: underline;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleUp {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 640px) {
    .modal-backdrop {
      padding: 0.5rem;
    }
    .modal-card {
      padding: 1.5rem 1rem;
    }
    .roles-selector {
      grid-template-columns: 1fr;
    }
  }
</style>
