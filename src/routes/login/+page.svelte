<script>
  import { goto } from '$app/navigation';
  import { demoRoles } from '$lib/data/mockData.js';
  import { loginUser } from '$lib/stores/auth.js';

  let email = $state('');
  let password = $state('');
  let isSubmitting = $state(false);
  let selectedDemoRole = $state('mahasiswa');

  function handleLogin(roleId = selectedDemoRole) {
    isSubmitting = true;
    const roleObj = demoRoles.find((r) => r.id === roleId) || demoRoles[0];
    loginUser(roleObj);
    setTimeout(() => {
      isSubmitting = false;
      goto('/dashboard');
    }, 600);
  }
</script>

<svelte:head>
  <title>Login SSO Kampus | FEB-X Platform</title>
</svelte:head>

<div class="login-page">
  <!-- Minimal Top Header -->
  <header class="login-header">
    <a href="/" class="brand-link">
      <span class="material-symbols-outlined text-primary text-3xl icon-fill">account_balance</span>
      <span class="brand-title">FEB-X</span>
    </a>
    <a href="/" class="help-link font-mono">
      <span class="material-symbols-outlined text-sm">arrow_back</span>
      <span>Kembali ke Marketplace</span>
    </a>
  </header>

  <!-- Centered Login Box (Empowered Intelligence) -->
  <main class="login-main">
    <div class="login-card">
      <!-- Left Visual / Brand Column -->
      <div class="visual-col">
        <div class="visual-bg"></div>
        <div class="visual-content">
          <span class="material-symbols-outlined icon-fill hero-icon">analytics</span>
          <h1 class="hero-title">Empowered<br />Intelligence</h1>
          <p class="hero-desc">
            Akses platform ekosistem bisnis terintegrasi untuk aktivitas akademik, inkubasi wirausaha, dan pendampingan mentor FEB.
          </p>

          <div class="portal-badges font-mono">
            <span>• Single Sign-On (SSO)</span>
            <span>• Lab Kewirausahaan SKS</span>
            <span>• Ledger Transaksi Kampus</span>
          </div>
        </div>
      </div>

      <!-- Right Form Column -->
      <div class="form-col">
        <div class="form-wrapper">
          <h2 class="welcome-heading">Selamat Datang</h2>
          <p class="welcome-sub">Silakan masuk untuk melanjutkan ke Portal FEB-X.</p>

          <!-- SSO Button -->
          <button
            type="button"
            class="btn-sso font-mono"
            onclick={() => handleLogin('mahasiswa')}
            disabled={isSubmitting}
          >
            <span class="material-symbols-outlined text-xl">school</span>
            <span>{isSubmitting ? 'Mengautentikasi SSO...' : 'Login via SSO Kampus'}</span>
          </button>

          <!-- Quick Role Preset Selector for Demo -->
          <div class="demo-role-selector">
            <span class="selector-label font-mono">PILIH DEMO ROLE:</span>
            <div class="role-grid">
              {#each demoRoles as r}
                <button
                  type="button"
                  class="role-btn {selectedDemoRole === r.id ? 'active' : ''}"
                  onclick={() => { selectedDemoRole = r.id; handleLogin(r.id); }}
                >
                  <span class="material-symbols-outlined text-xs">{r.icon}</span>
                  <span>{r.name.split(' ')[0]}</span>
                </button>
              {/each}
            </div>
          </div>

          <div class="divider">
            <span class="divider-text font-mono">ATAU MASUK DENGAN EMAIL</span>
          </div>

          <!-- Form Email/Password -->
          <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="manual-form">
            <div class="input-group">
              <label for="login-email" class="input-label font-mono">Email Kampus / Bisnis</label>
              <input
                id="login-email"
                type="email"
                placeholder="nama@mail.ugm.ac.id"
                bind:value={email}
                class="form-control"
              />
            </div>

            <div class="input-group">
              <div class="label-row">
                <label for="login-pass" class="input-label font-mono">Kata Sandi</label>
                <a href="#forgot" class="link-forgot font-mono" onclick={(e) => { e.preventDefault(); alert('Hubungi Helpdesk IT FEB untuk reset kata sandi.'); }}>Lupa Sandi?</a>
              </div>
              <input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                bind:value={password}
                class="form-control"
              />
            </div>

            <button
              type="submit"
              class="btn-manual-login"
              disabled={isSubmitting}
            >
              Masuk ke Platform
            </button>
          </form>

          <div class="form-footer">
            <p class="footer-text">
              Belum punya akun bisnis?
              <a href="/registrasi-bisnis" class="link-reg font-bold">Daftarkan Bisnis Mahasiswa</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="login-footer font-mono">
    <span>© 2024 FEB Business Ecosystem eXperience (FEB-X). All rights reserved.</span>
  </footer>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .login-header {
    height: 64px;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-lowest);
  }

  .brand-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
  }

  .brand-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .help-link {
    font-size: 0.75rem;
    color: var(--color-outline);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .help-link:hover {
    color: var(--color-primary);
  }

  .login-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }

  .login-card {
    width: 100%;
    max-width: 960px;
    min-height: 540px;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-modal);
    display: flex;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .login-card {
      flex-direction: column;
    }
  }

  /* Left Visual */
  .visual-col {
    flex: 1;
    background-color: var(--color-surface-container-low);
    position: relative;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-right: 1px solid var(--color-outline-variant);
  }

  @media (max-width: 768px) {
    .visual-col {
      display: none;
    }
  }

  .visual-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, var(--color-primary-fixed) 0%, transparent 70%);
    opacity: 0.5;
  }

  .visual-content {
    position: relative;
    z-index: 10;
  }

  .hero-icon {
    font-size: 48px;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  .hero-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1.15;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .hero-desc {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .portal-badges {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.6875rem;
    color: var(--color-secondary);
    font-weight: 700;
  }

  /* Right Form */
  .form-col {
    flex: 1.1;
    padding: 3rem;
    display: flex;
    align-items: center;
  }

  .form-wrapper {
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
  }

  .welcome-heading {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
  }

  .welcome-sub {
    font-size: 0.8125rem;
    color: var(--color-outline);
    margin-bottom: 1.5rem;
  }

  .btn-sso {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-sso:hover:not(:disabled) {
    background-color: var(--color-primary-container);
  }

  /* Demo Role Selector */
  .demo-role-selector {
    margin-top: 1rem;
    background-color: var(--color-surface-container-low);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-outline-variant);
  }

  .selector-label {
    font-size: 0.625rem;
    color: var(--color-outline);
    font-weight: 700;
    display: block;
    margin-bottom: 0.4rem;
  }

  .role-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.35rem;
  }

  .role-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xs);
    background: var(--color-surface-container-lowest);
    font-size: 0.6875rem;
    font-weight: 600;
    cursor: pointer;
  }

  .role-btn.active {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background-color: var(--color-primary-fixed);
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
    padding: 0 0.5rem;
    font-size: 0.625rem;
    color: var(--color-outline);
    letter-spacing: 0.05em;
  }

  .manual-form {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .input-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .label-row {
    display: flex;
    justify-content: space-between;
  }

  .link-forgot {
    font-size: 0.6875rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .form-control {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    outline: none;
  }

  .form-control:focus {
    border-color: var(--color-primary);
  }

  .btn-manual-login {
    background: transparent;
    border: 1.5px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.25rem;
  }

  .btn-manual-login:hover {
    background-color: var(--color-surface-container-low);
  }

  .form-footer {
    margin-top: 1.25rem;
    text-align: center;
  }

  .footer-text {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .link-reg {
    color: var(--color-primary);
    text-decoration: none;
  }

  .link-reg:hover {
    text-decoration: underline;
  }

  .login-footer {
    padding: 1rem;
    text-align: center;
    font-size: 0.6875rem;
    color: var(--color-outline);
    border-top: 1px solid var(--color-outline-variant);
  }

  @media (max-width: 640px) {
    .login-header {
      padding: 0 1rem;
    }
    .login-main {
      padding: 1.25rem 1rem;
    }
    .form-col {
      padding: 1.75rem 1.25rem;
    }
    .role-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
