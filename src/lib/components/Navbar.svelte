<script>
  import { currentUser, logoutUser } from '$lib/stores/auth.js';
  import { base } from '$app/paths';

  let {
    cartCount = 0,
    searchQuery = $bindable(''),
    onOpenCart = () => {},
    onOpenLogin = () => {},
    onNavigateSection = (section) => {}
  } = $props();

  let mobileMenuOpen = $state(false);

  function handleLogout() {
    logoutUser();
    mobileMenuOpen = false;
  }
</script>

<nav class="navbar">
  <div class="container nav-content">
    <!-- Brand / Logo -->
    <div class="nav-left">
      <a href="{base}/" class="brand-link" onclick={(e) => { e.preventDefault(); onNavigateSection('top'); }}>
        <span class="material-symbols-outlined icon-fill brand-icon">account_balance</span>
        <div class="brand-text">
          <span class="brand-title">FEB-X</span>
          <span class="brand-badge">ECOSYSTEM</span>
        </div>
      </a>
    </div>

    <!-- Search Bar -->
    <div class="nav-search">
      <span class="material-symbols-outlined search-icon">search</span>
      <input
        type="text"
        placeholder="Cari produk, inovasi, atau jasa mahasiswa..."
        bind:value={searchQuery}
        class="search-input"
      />
      {#if searchQuery}
        <button
          type="button"
          class="clear-search-btn"
          onclick={() => searchQuery = ''}
          aria-label="Hapus pencarian"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      {/if}
    </div>

    <!-- Actions -->
    <div class="nav-actions">
      <!-- Cart Trigger -->
      <button
        type="button"
        class="action-btn cart-btn"
        onclick={onOpenCart}
        aria-label="Keranjang Belanja"
      >
        <span class="material-symbols-outlined">shopping_cart</span>
        {#if cartCount > 0}
          <span class="cart-badge">{cartCount}</span>
        {/if}
      </button>

      <!-- Notifications -->
      <button
        type="button"
        class="action-btn"
        onclick={() => alert('Sistem Notifikasi FEB-X: Seluruh transaksi tercatat dalam ledger inkubator kampus.')}
        aria-label="Notifikasi"
      >
        <span class="material-symbols-outlined">notifications</span>
      </button>

      <!-- Settings (Hanya tampil jika sudah login) -->
      {#if $currentUser}
        <a
          href="{base}/pengaturan"
          class="action-btn"
          title="Pengaturan Akun"
          aria-label="Pengaturan"
        >
          <span class="material-symbols-outlined">settings</span>
        </a>
      {/if}

      <!-- Auth State CTA -->
      {#if $currentUser}
        <div class="user-logged-actions">
          <a
            href="{base}/dashboard"
            class="sso-btn dashboard-link-btn"
            title="Buka Dashboard"
          >
            <span class="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </a>
          <button
            type="button"
            class="logout-btn"
            onclick={handleLogout}
            title="Keluar Akun"
          >
            <span class="material-symbols-outlined text-sm">logout</span>
            <span>Logout</span>
          </button>
        </div>
      {:else}
        <button
          type="button"
          class="sso-btn"
          onclick={onOpenLogin}
        >
          <span class="material-symbols-outlined text-sm">login</span>
          <span>Masuk</span>
        </button>
      {/if}

      <!-- Mobile Hamburger -->
      <button
        type="button"
        class="mobile-toggle"
        onclick={() => mobileMenuOpen = !mobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        <span class="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
      </button>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if mobileMenuOpen}
    <div class="mobile-menu">
      <div class="mobile-search">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          placeholder="Cari produk mahasiswa..."
          bind:value={searchQuery}
          class="search-input"
        />
      </div>
      <div class="mobile-links">
        {#if $currentUser}
          <div class="mobile-user-card">
            <span class="material-symbols-outlined user-card-icon">account_circle</span>
            <div class="mobile-user-details">
              <span class="mobile-user-name">{$currentUser.name || 'Pengguna'}</span>
              <span class="mobile-user-badge">{$currentUser.badge || $currentUser.roleTitle || 'Akun Aktif'}</span>
            </div>
          </div>
          <a
            href="{base}/dashboard"
            class="mobile-nav-link active-link"
            onclick={() => { mobileMenuOpen = false; }}
          >
            <span class="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a
            href="{base}/pengaturan"
            class="mobile-nav-link"
            onclick={() => { mobileMenuOpen = false; }}
          >
            <span class="material-symbols-outlined">settings</span>
            Pengaturan Akun
          </a>
          <button
            type="button"
            class="mobile-logout-btn"
            onclick={handleLogout}
          >
            <span class="material-symbols-outlined">logout</span>
            Logout
          </button>
        {:else}
          <button
            type="button"
            class="mobile-sso-btn"
            onclick={() => { onOpenLogin(); mobileMenuOpen = false; }}
          >
            <span class="material-symbols-outlined">login</span>
            Masuk
          </button>
        {/if}
      </div>
    </div>
  {/if}
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.88);
    border-bottom: 1px solid var(--color-outline-variant);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.2s ease;
  }

  .nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: 1.5rem;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .brand-link {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    color: var(--color-primary);
  }

  .brand-icon {
    font-size: 30px;
    color: var(--color-primary);
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .brand-title {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--color-primary);
  }

  .brand-badge {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    font-weight: 700;
    color: var(--color-secondary);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    background: transparent;
    border: none;
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-on-surface-variant);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.15s ease;
  }

  .nav-link:hover {
    color: var(--color-primary);
    background-color: var(--color-surface-container-low);
  }

  .nav-link.active {
    color: var(--color-primary);
    font-weight: 600;
    position: relative;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0.875rem;
    right: 0.875rem;
    height: 2px;
    background-color: var(--color-secondary-container);
    border-radius: var(--radius-full);
  }

  .nav-search {
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    max-width: 440px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    font-size: 18px;
    color: var(--color-outline);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2.25rem;
    font-size: 0.875rem;
    font-family: var(--font-sans);
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-full);
    outline: none;
    color: var(--color-on-surface);
    transition: all 0.2s ease;
  }

  .search-input:focus {
    border-color: var(--color-primary);
    background-color: var(--color-surface-bright);
    box-shadow: 0 0 0 3px rgba(0, 6, 102, 0.08);
  }

  .clear-search-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .action-btn {
    background: transparent;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-on-surface-variant);
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;
  }

  .action-btn:hover {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  .cart-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    height: 18px;
    min-width: 18px;
    padding: 0 4px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  .sso-btn {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border: 1px solid transparent;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sso-btn:hover {
    background-color: var(--color-primary-container);
    box-shadow: var(--shadow-ambient);
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    padding: 0.5rem;
  }

  .mobile-menu {
    display: none;
    padding: 1rem;
    background-color: var(--color-surface-bright);
    border-top: 1px solid var(--color-outline-variant);
  }

  @media (max-width: 900px) {
    .nav-links, .nav-search {
      display: none;
    }

    .mobile-toggle {
      display: flex;
    }

    .mobile-menu {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: none;
      border: none;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.9375rem;
      color: var(--color-on-surface);
      text-align: left;
      cursor: pointer;
    }

    .mobile-nav-link:hover {
      background-color: var(--color-surface-container-low);
      color: var(--color-primary);
    }

    .mobile-sso-btn {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: var(--color-primary);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      cursor: pointer;
    }

    .mobile-logout-btn {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: transparent;
      color: #dc2626;
      border: 1px solid rgba(220, 38, 38, 0.3);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .mobile-logout-btn:hover {
      background-color: rgba(220, 38, 38, 0.08);
    }

    .mobile-user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background-color: var(--color-surface-container-low);
      border-radius: var(--radius-sm);
      margin-bottom: 0.25rem;
    }

    .user-card-icon {
      font-size: 28px;
      color: var(--color-primary);
    }

    .mobile-user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .mobile-user-name {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--color-on-surface);
    }

    .mobile-user-badge {
      font-size: 0.75rem;
      color: var(--color-outline);
      font-family: var(--font-mono);
    }
  }

  .user-logged-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .dashboard-link-btn {
    text-decoration: none;
  }

  .logout-btn {
    background-color: transparent;
    color: #dc2626;
    border: 1px solid rgba(220, 38, 38, 0.3);
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .logout-btn:hover {
    background-color: rgba(220, 38, 38, 0.08);
    border-color: #dc2626;
  }

  @media (max-width: 768px) {
    .sso-btn,
    .user-logged-actions,
    .action-btn:not(.cart-btn) {
      display: none;
    }
  }
</style>

