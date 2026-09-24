<script>
  import { adminValidationQueue as initialQueue, facultyUsersList, enhancedTransactionsList } from '$lib/data/mockData.js';

  let {
    onShowToast = (msg) => {},
    activeTab = 'summary'
  } = $props();

  let queue = $state([...initialQueue]);
  let users = $state([...facultyUsersList]);
  let transactions = $state([...enhancedTransactionsList]);
  let selectedGateway = $state('ALL');

  function handleApprove(item) {
    item.status = 'Disetujui';
    queue = [...queue];
    onShowToast(`✓ Proposal bisnis "${item.businessName}" resmi disetujui & aktif di marketplace!`);
  }

  function handleReject(item) {
    item.status = 'Perlu Revisi';
    queue = [...queue];
    onShowToast(`Catatan revisi telah dikirimkan ke ${item.owner}.`);
  }
</script>

<div class="admin-view">
  <!-- Header -->
  <div class="view-header">
    <div>
      <h1 class="view-title">Dashboard Tata Kelola Fakultas</h1>
      <p class="view-sub">Otoritas Dekanat FEB: Validasi proposal usaha, tata kelola akun, dan audit transaksi.</p>
    </div>

    <button
      type="button"
      class="btn-audit"
      onclick={() => alert('Download Laporan Audit Fakultas: Berkas kepatuhan akreditasi diunduh.')}
    >
      <span class="material-symbols-outlined text-sm">verified</span>
      <span>Ekspor Laporan Dekanat</span>
    </button>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <!-- Card 1 (Action Required) -->
    <div class="kpi-card alert-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">ANTREAN VALIDASI</span>
        <span class="badge-alert font-mono">ACTION REQUIRED</span>
      </div>
      <div>
        <h3 class="kpi-value text-error font-mono">
          {queue.filter(q => q.status === 'Menunggu Review').length + 11}
        </h3>
        <p class="kpi-sub">Proposal mahasiswa menunggu kurasi</p>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">TOTAL BISNIS AKTIF</span>
        <div class="icon-wrap bg-primary-fixed">
          <span class="material-symbols-outlined text-primary">store</span>
        </div>
      </div>
      <div>
        <h3 class="kpi-value font-mono">156</h3>
        <p class="kpi-growth text-secondary">
          <span class="font-bold">+12 unit</span> bulan ini
        </p>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">VOLUME TRANSAKSI</span>
        <div class="icon-wrap bg-secondary-container">
          <span class="material-symbols-outlined text-on-secondary-container">monitoring</span>
        </div>
      </div>
      <div>
        <h3 class="kpi-value font-mono">Rp 1.2M</h3>
        <p class="kpi-growth text-success">
          <span class="material-symbols-outlined text-xs">arrow_upward</span>
          <span>+5.4% vs bulan lalu</span>
        </p>
      </div>
    </div>

    <!-- Card 4 -->
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">SYSTEM HEALTH</span>
        <span class="badge-online font-mono">ONLINE</span>
      </div>
      <div>
        <h3 class="kpi-value font-mono">99.9%</h3>
        <p class="kpi-sub">Gateway QRIS &amp; VA Kampus Stabil</p>
      </div>
    </div>
  </div>

  <!-- Sub-View: Manajemen Pengguna Civitas FEB -->
  {#if activeTab === 'users'}
    <div class="sub-card-container">
      <div class="table-card">
        <div class="table-header flex-between">
          <div>
            <h2 class="table-title">Manajemen Akun Civitas Akademika</h2>
            <span class="table-sub font-mono">Daftar Pengguna Aktif (Mahasiswa, Dosen Pembimbing, Mentor Alumni, Admin Dekanat)</span>
          </div>
          <button
            type="button"
            class="btn-approve font-mono"
            onclick={() => { onShowToast('Form tambah pengguna baru via LDAP direktori kampus dibuka.'); }}
          >
            <span class="material-symbols-outlined text-xs">person_add</span>
            <span>+ Tambah Akun Civitas</span>
          </button>
        </div>

        <div class="table-container">
          <table class="val-table font-mono">
            <thead>
              <tr>
                <th>Nama Pengguna &amp; Email</th>
                <th>Role Otoritas</th>
                <th>Nomor Induk (NIM / NIP)</th>
                <th>Unit Usaha / Lab</th>
                <th>Status Akun</th>
                <th class="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {#each users as u (u.id)}
                <tr class="val-row">
                  <td>
                    <span class="biz-title font-bold text-primary">{u.name}</span>
                    <span class="text-xs text-outline">{u.email}</span>
                  </td>
                  <td>
                    <span class="status-pill status-menunggu-review">{u.role}</span>
                  </td>
                  <td class="text-xs">{u.idNumber}</td>
                  <td class="text-xs text-on-surface">{u.venture}</td>
                  <td>
                    <span class="badge-online font-bold">{u.status}</span>
                  </td>
                  <td class="text-right">
                    <button
                      type="button"
                      class="btn-revise text-xs"
                      onclick={() => onShowToast(`Pengaturan akun untuk ${u.name} diperbarui.`)}
                    >
                      Kelola Hak
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Sub-View: Monitoring Transaksi Enhanced -->
  {#if activeTab === 'transactions'}
    <div class="sub-card-container">
      <div class="table-card">
        <div class="table-header flex-between">
          <div>
            <h2 class="table-title">Monitoring Transaksi Enhanced (FinTech Gateway)</h2>
            <span class="table-sub font-mono">Audit Ledger Terkoneksi Host-to-Host Bank &amp; QRIS</span>
          </div>

          <div class="filter-pills font-mono">
            <button
              type="button"
              class="filter-pill {selectedGateway === 'ALL' ? 'active' : ''}"
              onclick={() => selectedGateway = 'ALL'}
            >Semua</button>
            <button
              type="button"
              class="filter-pill {selectedGateway === 'QRIS' ? 'active' : ''}"
              onclick={() => selectedGateway = 'QRIS'}
            >QRIS</button>
            <button
              type="button"
              class="filter-pill {selectedGateway === 'VA' ? 'active' : ''}"
              onclick={() => selectedGateway = 'VA'}
            >Virtual Account</button>
          </div>
        </div>

        <div class="table-container">
          <table class="val-table font-mono">
            <thead>
              <tr>
                <th>ID Transaksi &amp; Waktu</th>
                <th>Nama Pembeli Civitas</th>
                <th>Produk / Jasa</th>
                <th>Nominal Bruto</th>
                <th>Fee Inkubator</th>
                <th>Gateway Pembayaran</th>
                <th class="text-right">Status Settlement</th>
              </tr>
            </thead>
            <tbody>
              {#each transactions.filter(t => selectedGateway === 'ALL' || (selectedGateway === 'QRIS' ? t.gateway === 'QRIS' : t.gateway.includes('VA'))) as tx (tx.id)}
                <tr class="val-row">
                  <td>
                    <span class="font-bold text-primary">{tx.id}</span>
                    <span class="text-xs text-outline block">{tx.time}</span>
                  </td>
                  <td class="text-xs">{tx.buyer}</td>
                  <td class="text-xs">{tx.product}</td>
                  <td class="font-bold text-primary">Rp {tx.amount.toLocaleString('id-ID')}</td>
                  <td class="text-xs text-secondary">Rp {tx.fee.toLocaleString('id-ID')}</td>
                  <td>
                    <span class="status-pill status-menunggu-review">{tx.gateway}</span>
                  </td>
                  <td class="text-right">
                    <span class="badge-online font-bold">✓ {tx.status.toUpperCase()}</span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Validation Queue Table (Summary or Validation) -->
  {#if activeTab === 'summary' || activeTab === 'validation'}
  <div class="table-card">
    <div class="table-header">
      <div>
        <h2 class="table-title">Antrean Validasi Proposal Bisnis Baru</h2>
        <span class="table-sub font-mono">Kurasi Kelayakan Usaha, Legalitas NIM, &amp; Etika Bisnis FEB</span>
      </div>
    </div>

    <div class="table-container">
      <table class="val-table">
        <thead>
          <tr>
            <th>Nama Usaha &amp; Kategori</th>
            <th>Pemilik Usaha (NIM)</th>
            <th>Dokumen Pendukung</th>
            <th>Tanggal Pengajuan</th>
            <th>Status Validasi</th>
            <th class="text-right">Keputusan Dekanat</th>
          </tr>
        </thead>
        <tbody>
          {#each queue as item (item.id)}
            <tr class="val-row">
              <td>
                <span class="biz-title">{item.businessName}</span>
                <span class="biz-cat font-mono">{item.category}</span>
              </td>
              <td class="font-mono text-xs">{item.owner}</td>
              <td class="text-xs text-outline">{item.documents}</td>
              <td class="font-mono text-xs">{item.submissionDate}</td>
              <td>
                <span class="status-pill status-{item.status.replace(/\s+/g, '-').toLowerCase()} font-mono">
                  {item.status}
                </span>
              </td>
              <td class="text-right">
                {#if item.status === 'Menunggu Review'}
                  <div class="decision-actions">
                    <button
                      type="button"
                      class="btn-approve font-button"
                      onclick={() => handleApprove(item)}
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      class="btn-revise font-button"
                      onclick={() => handleReject(item)}
                    >
                      Revisi
                    </button>
                  </div>
                {:else}
                  <span class="approved-tag font-mono">✓ Diverifikasi Dekanat</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Transaction Audit Stream -->
  <div class="audit-card">
    <div class="audit-header">
      <span class="material-symbols-outlined text-primary">security</span>
      <h3 class="audit-title">Audit Ledger Transaksi Real-Time FEB-X</h3>
    </div>
    <div class="audit-list font-mono text-xs">
      <div class="audit-row">
        <span class="audit-time">12:45:10 WIB</span>
        <span class="audit-id font-bold text-primary">TX-892104</span>
        <span class="audit-desc">Pembayaran QRIS Katering Sehat (Rp 150.000) terverifikasi. Fee inkubator Rp 1.000 dialokasikan.</span>
        <span class="audit-status text-success">SETTLED</span>
      </div>
      <div class="audit-row">
        <span class="audit-time">10:30:22 WIB</span>
        <span class="audit-id font-bold text-primary">TX-892103</span>
        <span class="audit-desc">Mandiri VA Kampus Kopi Cold Brew (Rp 25.000) terverifikasi otomatis.</span>
        <span class="audit-status text-success">SETTLED</span>
      </div>
      <div class="audit-row">
        <span class="audit-time">09:14:05 WIB</span>
        <span class="audit-id font-bold text-primary">TX-892102</span>
        <span class="audit-desc">Pendaftaran tenant baru "FinTech Youth Smart" masuk antrean verifikasi.</span>
        <span class="audit-status text-secondary">PENDING REVIEW</span>
      </div>
    </div>
  </div>
  {/if}
</div>

<style>
  .admin-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 0.5rem;
  }

  .view-title {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .view-sub {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    margin-top: 0.2rem;
  }

  .btn-audit {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .kpi-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    box-shadow: var(--shadow-ambient);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 120px;
  }

  .alert-card {
    border-top: 3px solid var(--color-error);
  }

  .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .kpi-label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-outline);
  }

  .badge-alert {
    background-color: var(--color-error-container);
    color: var(--color-error);
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
  }

  .badge-online {
    background-color: var(--color-success-container);
    color: var(--color-success);
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
  }

  .icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kpi-value {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  }

  .kpi-growth {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .kpi-sub {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    margin-top: 0.25rem;
  }

  /* Table */
  .table-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-ambient);
    overflow: hidden;
  }

  .table-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-bright);
  }

  .table-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .table-sub {
    font-size: 0.6875rem;
    color: var(--color-secondary);
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .val-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    min-width: 800px;
  }

  .val-table th {
    padding: 0.875rem 1.25rem;
    text-align: left;
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .val-row td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .val-row:hover {
    background-color: var(--color-surface-container-low);
  }

  .biz-title {
    font-weight: 700;
    color: var(--color-primary);
    display: block;
  }

  .biz-cat {
    font-size: 0.6875rem;
    color: var(--color-secondary);
  }

  .status-pill {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .status-menunggu-review {
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
  }

  .status-disetujui {
    background-color: var(--color-success-container);
    color: var(--color-success);
  }

  .status-perlu-revisi {
    background-color: var(--color-error-container);
    color: var(--color-error);
  }

  .decision-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .btn-approve {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-approve:hover {
    background-color: var(--color-primary-container);
  }

  .btn-revise {
    background-color: var(--color-surface-container-low);
    color: var(--color-error);
    border: 1px solid var(--color-error);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .approved-tag {
    font-size: 0.75rem;
    color: var(--color-success);
    font-weight: 700;
  }

  /* Audit Card */
  .audit-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    box-shadow: var(--shadow-ambient);
  }

  .audit-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .audit-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .audit-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .audit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-xs);
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .audit-time {
    color: var(--color-outline);
  }

  .audit-desc {
    flex: 1;
    color: var(--color-on-surface);
  }

  .text-right { text-align: right; }

  .sub-card-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filter-pills {
    display: flex;
    gap: 0.35rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    max-width: 100%;
  }

  .filter-pill {
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface-variant);
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-full);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .filter-pill.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .view-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .kpi-grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .decision-actions {
      flex-direction: column;
      gap: 0.25rem;
    }
    .btn-approve, .btn-revise {
      width: 100%;
    }
    .flex-between {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .filter-pills {
      width: 100%;
      padding-bottom: 0.25rem;
    }
    .audit-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }
  }

  @media (max-width: 480px) {
    .kpi-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
