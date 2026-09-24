<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { demoRoles } from '$lib/data/mockData.js';
  import { logoutUser } from '$lib/stores/auth.js';

  let {
    activeRoleId = 'mahasiswa',
    onSelectRole = (roleId) => {},
    onNavigateHome = () => {},
    onToggleSidebar = () => {}
  } = $props();

  let activeRole = $derived(
    demoRoles.find((r) => r.id === activeRoleId) || demoRoles[0]
  );
</script>

<header class="dash-header">
  <div class="header-inner">
    <!-- Left: Brand -->
    <div class="header-left">
      <button
        type="button"
        class="mobile-menu-btn"
        onclick={onToggleSidebar}
        aria-label="Buka Menu Navigasi"
        title="Menu Navigasi"
      >
        <span class="material-symbols-outlined">menu</span>
      </button>

      <button
        type="button"
        class="brand-btn"
        onclick={onNavigateHome}
      >
        <span class="material-symbols-outlined icon-fill brand-icon">account_balance</span>
        <div class="brand-info">
          <span class="brand-name">FEB-X</span>
          <span class="brand-tag">ECOSYSTEM</span>
        </div>
      </button>
    </div>

    <!-- Right: User Profile & Actions -->
    <div class="header-right">
      <a
        href="{base}/pengaturan"
        class="icon-btn"
        title="Pengaturan Akun"
        aria-label="Pengaturan"
      >
        <span class="material-symbols-outlined">settings</span>
      </a>

      <button
        type="button"
        class="icon-btn"
        onclick={() => alert('Notifikasi Sistem FEB-X: 3 pesanan baru masuk.')}
        aria-label="Notifikasi"
      >
        <span class="material-symbols-outlined">notifications</span>
        <span class="noti-badge"></span>
      </button>

      <a href="{base}/pengaturan" class="user-chip text-decoration-none">
        <img
          src={activeRole.avatar}
          alt={activeRole.name}
          class="user-avatar"
        />
        <div class="user-meta hidden-mobile">
          <span class="user-name">{activeRole.name}</span>
          <span class="user-badge font-mono">{activeRole.badge}</span>
        </div>
      </a>

      <button
        type="button"
        class="icon-btn logout-header-btn"
        onclick={() => { logoutUser(); goto(`${base}/`); }}
        title="Keluar / Logout"
        aria-label="Logout"
      >
        <span class="material-symbols-outlined text-sm">logout</span>
      </button>
    </div>
  </div>
</header>

<style>
  .dash-header {
    background-color: var(--color-surface-container-lowest);
    border-bottom: 1px solid var(--color-outline-variant);
    position: sticky;
    top: 0;
    z-index: 50;
    height: 64px;
    box-shadow: var(--shadow-subtle);
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 1.5rem;
    gap: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .brand-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .brand-icon {
    font-size: 28px;
    color: var(--color-primary);
  }

  .brand-info {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .brand-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .brand-tag {
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 700;
    color: var(--color-secondary);
    letter-spacing: 0.1em;
  }

  /* Right Side */
  .header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-btn {
    background: transparent;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-on-surface-variant);
    cursor: pointer;
    position: relative;
  }

  .icon-btn:hover {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  .noti-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 8px;
    height: 8px;
    background-color: var(--color-error);
    border-radius: 50%;
  }

  .user-chip {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-bright);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--color-primary-fixed-dim);
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .user-name {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .user-badge {
    font-size: 0.625rem;
    color: var(--color-outline);
  }

  .mobile-menu-btn {
    display: none;
    background: transparent;
    border: none;
    color: var(--color-on-surface);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-xs);
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 960px) {
    .dash-header {
      height: 56px;
    }
    .header-inner {
      height: 56px;
      padding: 0 0.875rem;
    }
    .mobile-menu-btn {
      display: inline-flex;
    }
    .hidden-mobile {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .header-inner {
      padding: 0 0.625rem;
    }
    .brand-name {
      font-size: 1.125rem;
    }
    .brand-icon {
      font-size: 24px;
    }
    .user-chip {
      padding: 0;
      background: none;
      border: none;
    }
  }
</style>
