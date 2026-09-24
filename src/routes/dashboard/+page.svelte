<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import DashboardHeader from '$lib/components/dashboard/DashboardHeader.svelte';
  import DashboardSidebar from '$lib/components/dashboard/DashboardSidebar.svelte';
  import StudentSellerView from '$lib/components/dashboard/StudentSellerView.svelte';
  import LecturerAcademicView from '$lib/components/dashboard/LecturerAcademicView.svelte';
  import MentorAlumniView from '$lib/components/dashboard/MentorAlumniView.svelte';
  import AdminFacultyView from '$lib/components/dashboard/AdminFacultyView.svelte';
  import { currentUser, loginUser } from '$lib/stores/auth.js';

  // Svelte 5 Runes State
  let activeRoleId = $state($currentUser?.id || 'mahasiswa');
  let activeTab = $state('summary');
  let toastMessage = $state(null);
  let toastTimer = null;
  let isAddProductOpen = $state(false);
  let isSidebarOpen = $state(false);

  // Jika belum ada user di auth store, defaultkan ke activeRoleId saat ini
  $effect(() => {
    if (!$currentUser) {
      loginUser(activeRoleId);
    }
  });

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage = msg;
    toastTimer = setTimeout(() => {
      toastMessage = null;
    }, 3000);
  }

  function handleSelectRole(roleId) {
    activeRoleId = roleId;
    loginUser(roleId);
    activeTab = 'summary';
    isSidebarOpen = false;
    showToast(`Beralih ke tampilan: ${roleId === 'mahasiswa' ? 'Mahasiswa Seller' : roleId === 'dosen' ? 'Dosen Pembimbing' : roleId === 'alumni' ? 'Mentor Alumni' : 'Admin Fakultas'}`);
  }

  function handleQuickAction() {
    isSidebarOpen = false;
    if (activeRoleId === 'mahasiswa') {
      isAddProductOpen = true;
    } else if (activeRoleId === 'dosen') {
      activeTab = 'evaluations';
      showToast('Menampilkan daftar evaluasi akademik mahasiswa.');
    } else if (activeRoleId === 'alumni') {
      activeTab = 'feedback';
      showToast('Form masukan & pembinaan mentor dibuka.');
    } else {
      activeTab = 'validation';
      showToast('Menampilkan antrean validasi proposal bisnis dekanat.');
    }
  }
</script>

<svelte:head>
  <title>Dashboard FEB-X | Ekosistem Bisnis &amp; Akademik</title>
</svelte:head>

<div class="dashboard-layout">
  <!-- Top Header -->
  <DashboardHeader
    {activeRoleId}
    onSelectRole={handleSelectRole}
    onNavigateHome={() => goto(`${base}/`)}
    onToggleSidebar={() => isSidebarOpen = !isSidebarOpen}
  />

  <!-- Main Canvas with Sidebar -->
  <div class="dashboard-body">
    <!-- Left Navigation Sidebar -->
    <DashboardSidebar
      roleId={activeRoleId}
      {activeTab}
      onSelectTab={(t) => { activeTab = t; isSidebarOpen = false; }}
      onQuickAction={handleQuickAction}
      isMobileOpen={isSidebarOpen}
      onCloseMobile={() => isSidebarOpen = false}
    />

    <!-- Main Content Stage -->
    <main class="dashboard-main">
      {#if activeRoleId === 'mahasiswa'}
        <StudentSellerView
          bind:activeTab
          onShowToast={showToast}
          bind:isAddProductOpen
        />
      {:else if activeRoleId === 'dosen'}
        <LecturerAcademicView
          {activeTab}
          onShowToast={showToast}
        />
      {:else if activeRoleId === 'alumni'}
        <MentorAlumniView
          {activeTab}
          onShowToast={showToast}
        />
      {:else}
        <AdminFacultyView
          {activeTab}
          onShowToast={showToast}
        />
      {/if}
    </main>
  </div>

  <!-- Floating Toast Notification -->
  {#if toastMessage}
    <div class="toast-popup font-mono" role="status" aria-live="polite">
      <span class="material-symbols-outlined text-sm">info</span>
      <span>{toastMessage}</span>
    </div>
  {/if}
</div>

<style>
  .dashboard-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    width: 100%;
    overflow-x: clip;
  }

  .dashboard-body {
    display: flex;
    flex: 1;
    min-width: 0;
    width: 100%;
    align-items: flex-start;
  }

  .dashboard-main {
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 1.75rem 2rem 3rem;
    max-width: 1320px;
    margin: 0 auto;
  }

  @media (max-width: 960px) {
    .dashboard-body {
      flex-direction: column;
    }
    .dashboard-main {
      padding: 1.25rem 1rem 3rem;
    }
  }

  @media (max-width: 480px) {
    .dashboard-main {
      padding: 0.875rem 0.625rem 2.5rem;
    }
  }

  /* Toast Notification */
  .toast-popup {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 120;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    box-shadow: var(--shadow-modal);
    border-left: 4px solid var(--color-secondary-container);
    animation: slideUp 0.2s ease;
  }

  @media (max-width: 640px) {
    .toast-popup {
      left: 16px;
      right: 16px;
      bottom: 16px;
      justify-content: center;
      text-align: center;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
