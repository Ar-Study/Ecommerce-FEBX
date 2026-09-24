<script>
  import { base } from '$app/paths';
  let {
    roleId = 'mahasiswa',
    activeTab = 'summary',
    onSelectTab = (tabId) => {},
    onQuickAction = () => {},
    isMobileOpen = false,
    onCloseMobile = () => {}
  } = $props();

  const navConfigs = {
    mahasiswa: [
      { id: 'summary', label: 'Ringkasan Bisnis', icon: 'dashboard' },
      { id: 'orders', label: 'Pesanan Masuk', icon: 'shopping_bag' },
      { id: 'revenue', label: 'Pendapatan & Arus Kas', icon: 'payments' },
      { id: 'growth', label: 'Pertumbuhan & Trafik', icon: 'trending_up' },
      { id: 'business_data', label: 'Data Bisnis & Booth', icon: 'storefront' },
      { id: 'inventory', label: 'Manajemen Stok', icon: 'inventory_2' }
    ],
    dosen: [
      { id: 'summary', label: 'Ringkasan Bimbingan', icon: 'dashboard' },
      { id: 'evaluations', label: 'Evaluasi Akademik SKS', icon: 'fact_check' },
      { id: 'monitoring_revenue', label: 'Monitoring Omzet Mahasiswa', icon: 'payments' },
      { id: 'monitoring_growth', label: 'Matriks Pertumbuhan Usaha', icon: 'analytics' }
    ],
    alumni: [
      { id: 'summary', label: 'Ringkasan Mentor', icon: 'dashboard' },
      { id: 'businesses', label: 'Bisnis Dampingan', icon: 'business_center' },
      { id: 'feedback', label: 'Masukan & Catatan', icon: 'rate_review' },
      { id: 'collaborations', label: 'Peluang Kolaborasi', icon: 'handshake' }
    ],
    admin: [
      { id: 'summary', label: 'Ringkasan Dekanat', icon: 'dashboard' },
      { id: 'validation', label: 'Validasi Bisnis Mahasiswa', icon: 'verified_user' },
      { id: 'users', label: 'Manajemen Pengguna Civitas', icon: 'group' },
      { id: 'transactions', label: 'Monitoring Transaksi Enhanced', icon: 'payments' }
    ]
  };

  let currentNav = $derived(navConfigs[roleId] || navConfigs.mahasiswa);
</script>

{#if isMobileOpen}
  <div
    class="mobile-backdrop"
    onclick={onCloseMobile}
    onkeydown={(e) => e.key === 'Escape' && onCloseMobile()}
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-label="Tutup navigasi"
  ></div>
{/if}

<!-- Horizontal Tab Bar on Mobile Screen -->
<div class="mobile-tab-subnav">
  {#each currentNav as nav}
    <button
      type="button"
      class="subnav-pill {activeTab === nav.id ? 'active' : ''}"
      onclick={() => onSelectTab(nav.id)}
    >
      <span class="material-symbols-outlined text-xs">{nav.icon}</span>
      <span>{nav.label}</span>
    </button>
  {/each}
</div>

<aside class="dash-sidebar {isMobileOpen ? 'mobile-open' : ''}">
  <div class="sidebar-top">
    <div class="sidebar-role-indicator">
      <span class="material-symbols-outlined role-main-icon">
        {roleId === 'mahasiswa' ? 'storefront' : roleId === 'dosen' ? 'school' : roleId === 'alumni' ? 'handshake' : 'admin_panel_settings'}
      </span>
      <div>
        <h3 class="panel-title">Panel Kontrol</h3>
        <span class="panel-sub font-mono">
          {roleId === 'mahasiswa' ? 'PORTAL WIRAUSAHA' : roleId === 'dosen' ? 'PORTAL EVALUASI' : roleId === 'alumni' ? 'PORTAL MENTOR' : 'DEKANAT OTORITAS'}
        </span>
      </div>
    </div>

    <button
      type="button"
      class="btn-close-sidebar"
      onclick={onCloseMobile}
      aria-label="Tutup Menu"
    >
      <span class="material-symbols-outlined">close</span>
    </button>
  </div>

  <!-- Navigation List -->
  <nav class="sidebar-nav">
    {#each currentNav as nav}
      <button
        type="button"
        class="nav-item {activeTab === nav.id ? 'active' : ''}"
        onclick={() => { onSelectTab(nav.id); onCloseMobile(); }}
      >
        <span class="material-symbols-outlined nav-icon">{nav.icon}</span>
        <span class="nav-label">{nav.label}</span>
      </button>
    {/each}
  </nav>

  <!-- Sidebar Bottom CTA -->
  <div class="sidebar-bottom">
    {#if roleId === 'mahasiswa'}
      <button
        type="button"
        class="btn-sidebar-action"
        onclick={onQuickAction}
      >
        <span class="material-symbols-outlined text-sm">add</span>
        <span>Tambah Produk Baru</span>
      </button>
    {:else if roleId === 'dosen'}
      <button
        type="button"
        class="btn-sidebar-action"
        onclick={onQuickAction}
      >
        <span class="material-symbols-outlined text-sm">fact_check</span>
        <span>Beri Evaluasi Mahasiswa</span>
      </button>
    {:else if roleId === 'alumni'}
      <button
        type="button"
        class="btn-sidebar-action"
        onclick={onQuickAction}
      >
        <span class="material-symbols-outlined text-sm">rate_review</span>
        <span>Tulis Catatan Mentoring</span>
      </button>
    {:else}
      <button
        type="button"
        class="btn-sidebar-action"
        onclick={onQuickAction}
      >
        <span class="material-symbols-outlined text-sm">verified_user</span>
        <span>Review Validasi</span>
      </button>
    {/if}

    <div class="sidebar-footer-links">
      <a href="{base}/pengaturan" class="footer-link">
        <span class="material-symbols-outlined text-sm">settings</span>
        <span>Pengaturan Akun</span>
      </a>
      <a href="{base}/" class="footer-link">
        <span class="material-symbols-outlined text-sm">storefront</span>
        <span>Katalog Marketplace</span>
      </a>
    </div>
  </div>
</aside>

<style>
  .dash-sidebar {
    width: 250px;
    background-color: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-right: 1px solid var(--color-outline-variant);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
    padding: 1.25rem 1rem;
    flex-shrink: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    z-index: 40;
  }

  .sidebar-top {
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }

  .sidebar-role-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .role-main-icon {
    font-size: 26px;
    color: var(--color-primary);
    background-color: var(--color-primary-fixed);
    padding: 0.35rem;
    border-radius: var(--radius-sm);
  }

  .panel-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1.2;
  }

  .panel-sub {
    font-size: 0.625rem;
    color: var(--color-secondary);
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-md);
    background: transparent;
    border: none;
    color: var(--color-on-surface-variant);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .nav-item:hover {
    background-color: var(--color-surface-container-high);
    color: var(--color-primary);
  }

  .nav-item.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    box-shadow: var(--shadow-ambient);
  }

  .nav-icon {
    font-size: 18px;
  }

  .nav-item.active .nav-icon {
    color: var(--color-secondary-container);
  }

  .sidebar-bottom {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--color-outline-variant);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-sidebar-action {
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    border: none;
    padding: 0.625rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-sidebar-action:hover {
    background-color: var(--color-secondary-hover);
  }

  .sidebar-footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-outline);
    text-decoration: none;
    padding: 0.35rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .footer-link:hover {
    color: var(--color-primary);
  }

  .btn-close-sidebar {
    display: none;
    background: transparent;
    border: none;
    color: var(--color-on-surface);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-xs);
  }

  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    z-index: 150;
  }

  .mobile-tab-subnav {
    display: none;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0.5rem 1rem;
    gap: 0.375rem;
    background-color: var(--color-surface-container-lowest);
    border-bottom: 1px solid var(--color-outline-variant);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    position: sticky;
    top: 56px;
    z-index: 45;
  }

  .mobile-tab-subnav::-webkit-scrollbar {
    display: none;
  }

  .subnav-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-low);
    color: var(--color-on-surface);
    font-size: 0.6875rem;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }

  .subnav-pill.active {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    border-color: var(--color-primary);
    font-weight: 700;
  }

  @media (max-width: 960px) {
    .mobile-tab-subnav {
      display: flex;
    }

    .btn-close-sidebar {
      display: inline-flex;
    }

    .dash-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      z-index: 160;
      box-shadow: var(--shadow-drawer);
      transform: translateX(-100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
    }

    .dash-sidebar.mobile-open {
      transform: translateX(0);
    }
  }
</style>
