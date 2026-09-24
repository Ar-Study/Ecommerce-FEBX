<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { currentUser } from '$lib/stores/auth.js';

  // Profile states
  let fullName = $state('Dimas Pratama');
  let email = $state('dimas.p@mail.ugm.ac.id');
  let phone = $state('+62 812-3456-7890');
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let is2FAEnabled = $state(true);
  let notifEmail = $state(true);
  let notifWA = $state(true);

  let toastMsg = $state(null);
  let toastTimer = null;

  // Auth guard: hanya boleh diakses bila sudah login
  $effect(() => {
    if (!$currentUser) {
      goto('/login');
    } else {
      if ($currentUser.name) fullName = $currentUser.name;
      if ($currentUser.email) email = $currentUser.email;
    }
  });

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg = msg;
    toastTimer = setTimeout(() => {
      toastMsg = null;
    }, 3000);
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    showToast('✓ Profil pengguna berhasil diperbarui.');
  }

  function handleUpdatePassword(e) {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    showToast('✓ Kata sandi berhasil diubah.');
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
  }
</script>

<svelte:head>
  <title>Pengaturan Akun &amp; Keamanan | FEB-X</title>
</svelte:head>

<div class="settings-page">
  <Navbar
    cartCount={0}
    onOpenCart={() => goto('/checkout')}
    onOpenLogin={() => goto('/login')}
    onNavigateSection={() => goto('/')}
  />

  <main class="page-container">
    <header class="settings-header">
      <div>
        <h1 class="page-title">Pengaturan Akun</h1>
        <p class="page-sub">Kelola preferensi profil, autentikasi keamanan 2FA, dan notifikasi transaksi kampus.</p>
      </div>

      <a href="/dashboard" class="btn-dash-back font-mono">
        <span class="material-symbols-outlined text-sm">dashboard</span>
        <span>Kembali ke Dashboard</span>
      </a>
    </header>

    <div class="settings-grid">
      <!-- Left Column (8 cols): Profile & Security -->
      <div class="main-settings-col">
        <!-- Profile Section -->
        <section class="section-card">
          <h2 class="card-title">
            <span class="material-symbols-outlined text-primary">person</span>
            Profil Pengguna Civitas
          </h2>

          <form onsubmit={handleSaveProfile} class="profile-form">
            <div class="avatar-row">
              <div class="avatar-box">
                <span class="material-symbols-outlined text-4xl text-outline">account_circle</span>
              </div>
              <div class="avatar-actions">
                <button
                  type="button"
                  class="btn-change-photo font-mono"
                  onclick={() => alert('Fitur upload foto profil tersambung dengan database kampus.')}
                >
                  Ubah Foto
                </button>
                <span class="photo-hint font-mono">Format JPG, PNG maks 2 MB</span>
              </div>
            </div>

            <div class="form-group">
              <label for="set-name" class="form-label font-mono">Nama Lengkap</label>
              <input id="set-name" type="text" class="form-input" bind:value={fullName} required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="set-email" class="form-label font-mono">Email Institusi (SSO)</label>
                <input id="set-email" type="email" class="form-input disabled" value={email} disabled />
                <span class="input-note font-mono">Terverifikasi otomatis via server direktori FEB.</span>
              </div>

              <div class="form-group">
                <label for="set-phone" class="form-label font-mono">Nomor WhatsApp Aktif</label>
                <input id="set-phone" type="tel" class="form-input" bind:value={phone} required />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save font-mono">Simpan Perubahan Profil</button>
            </div>
          </form>
        </section>

        <!-- Security Section -->
        <section class="section-card">
          <h2 class="card-title">
            <span class="material-symbols-outlined text-primary">security</span>
            Keamanan Akun &amp; Kata Sandi
          </h2>

          <form onsubmit={handleUpdatePassword} class="security-form">
            <div class="form-group">
              <label for="set-cur-pass" class="form-label font-mono">Kata Sandi Saat Ini</label>
              <input id="set-cur-pass" type="password" class="form-input" bind:value={currentPassword} required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="set-new-pass" class="form-label font-mono">Kata Sandi Baru</label>
                <input id="set-new-pass" type="password" class="form-input" bind:value={newPassword} required />
              </div>
              <div class="form-group">
                <label for="set-conf-pass" class="form-label font-mono">Konfirmasi Kata Sandi Baru</label>
                <input id="set-conf-pass" type="password" class="form-input" bind:value={confirmPassword} required />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-update-pass font-mono">Perbarui Kata Sandi</button>
            </div>
          </form>

          <!-- 2FA Toggle -->
          <div class="two-fa-box">
            <div class="two-fa-info">
              <span class="two-fa-title font-bold">Two-Factor Authentication (2FA)</span>
              <p class="two-fa-desc">Gunakan autentikasi berbasis OTP WhatsApp/Email untuk setiap transaksi keuangan.</p>
            </div>

            <label class="switch-wrap">
              <input
                type="checkbox"
                bind:checked={is2FAEnabled}
                onchange={() => showToast(`2FA ${is2FAEnabled ? 'diaktifkan' : 'dinonaktifkan'}.`)}
              />
              <span class="switch-slider"></span>
            </label>
          </div>
        </section>
      </div>

      <!-- Right Column (4 cols): Notification Preferences -->
      <div class="side-settings-col">
        <section class="section-card">
          <h2 class="card-title">
            <span class="material-symbols-outlined text-primary">notifications</span>
            Preferensi Notifikasi
          </h2>

          <div class="notif-list">
            <label class="notif-item">
              <input type="checkbox" bind:checked={notifEmail} />
              <div>
                <span class="notif-label font-bold">Email Transaksi &amp; Order</span>
                <p class="notif-sub">Kirim tanda terima otomatis saat pesanan pembeli masuk.</p>
              </div>
            </label>

            <label class="notif-item">
              <input type="checkbox" bind:checked={notifWA} />
              <div>
                <span class="notif-label font-bold">Peringatan WhatsApp</span>
                <p class="notif-sub">Notifikasi stok menipis dan jadwal bimbingan dosen.</p>
              </div>
            </label>
          </div>
        </section>

        <section class="section-card dekanat-compliance">
          <span class="material-symbols-outlined text-2xl text-secondary">verified_user</span>
          <h3 class="compliance-title">Kepatuhan Otoritas FEB</h3>
          <p class="compliance-text">
            Seluruh akun terikat dengan Pakta Integritas Mahasiswa Wirausaha dan standar akreditasi AACSB Fakultas Ekonomi &amp; Bisnis.
          </p>
        </section>
      </div>
    </div>
  </main>

  <Footer />

  <!-- Toast -->
  {#if toastMsg}
    <div class="toast-popup font-mono">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{toastMsg}</span>
    </div>
  {/if}
</div>

<style>
  .settings-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    width: 100%;
    flex: 1;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-outline-variant);
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .page-sub {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    margin-top: 0.25rem;
  }

  .btn-dash-back {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    border: 1px solid var(--color-outline-variant);
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  @media (min-width: 960px) {
    .settings-grid {
      grid-template-columns: 8fr 4fr;
    }
  }

  .main-settings-col, .side-settings-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    box-shadow: var(--shadow-ambient);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .profile-form, .security-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .avatar-row {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .avatar-box {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-change-photo {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-xs);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .photo-hint {
    display: block;
    font-size: 0.6875rem;
    color: var(--color-outline);
    margin-top: 0.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  @media (max-width: 600px) {
    .form-row {
      flex-direction: column;
    }
  }

  .form-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .form-input {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    outline: none;
  }

  .form-input:focus {
    border-color: var(--color-primary);
  }

  .form-input.disabled {
    background-color: var(--color-surface-container-low);
    color: var(--color-outline);
    cursor: not-allowed;
  }

  .input-note {
    font-size: 0.625rem;
    color: var(--color-outline);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }

  .btn-save {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-update-pass {
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    color: var(--color-primary);
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  /* 2FA Toggle */
  .two-fa-box {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-outline-variant);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .two-fa-title {
    font-size: 0.875rem;
    color: var(--color-on-surface);
  }

  .two-fa-desc {
    font-size: 0.75rem;
    color: var(--color-outline);
    margin-top: 0.2rem;
  }

  .switch-wrap {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }

  .switch-wrap input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--color-surface-container-high);
    transition: 0.3s;
    border-radius: 24px;
  }

  .switch-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .switch-slider {
    background-color: var(--color-primary);
  }

  input:checked + .switch-slider:before {
    transform: translateX(20px);
  }

  /* Notif */
  .notif-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .notif-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }

  .notif-label {
    font-size: 0.8125rem;
    color: var(--color-on-surface);
  }

  .notif-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
    margin-top: 0.15rem;
  }

  .dekanat-compliance {
    background-color: var(--color-surface-bright);
    border: 1px solid var(--color-secondary-container);
  }

  .compliance-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-top: 0.5rem;
  }

  .compliance-text {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    line-height: 1.5;
    margin-top: 0.25rem;
  }

  .toast-popup {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-modal);
    border-left: 4px solid var(--color-secondary-container);
    z-index: 100;
  }

  @media (max-width: 640px) {
    .page-container {
      padding: 1.25rem 1rem 3rem;
    }
    .settings-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .form-row {
      flex-direction: column;
      gap: 0.75rem;
    }
    .section-card {
      padding: 1.25rem 1rem;
    }
    .two-fa-box {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    .btn-save, .btn-update-pass {
      width: 100%;
    }
  }
</style>
