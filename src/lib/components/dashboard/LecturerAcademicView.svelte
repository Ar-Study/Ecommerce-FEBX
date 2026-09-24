<script>
  import { lecturerEvaluations as initialEvaluations } from '$lib/data/mockData.js';

  let {
    onShowToast = (msg) => {},
    activeTab = 'summary'
  } = $props();

  let evaluations = $state([...initialEvaluations]);
  let selectedProdi = $state('S1 Manajemen');
  let selectedSemester = $state('Genap 2023/2024');
  let selectedClass = $state('Kewirausahaan A');

  // Evaluation modal state
  let activeEvaluationItem = $state(null);
  let inputScore = $state(85);
  let inputFeedback = $state('');

  function openGradeModal(item) {
    activeEvaluationItem = item;
    inputScore = item.score || 85;
    inputFeedback = item.feedback || '';
  }

  function handleSaveEvaluation(e) {
    e.preventDefault();
    if (!activeEvaluationItem) return;

    const target = evaluations.find((ev) => ev.id === activeEvaluationItem.id);
    if (target) {
      target.score = Number(inputScore);
      target.feedback = inputFeedback || 'Evaluasi akademik telah disetujui dosen pembimbing.';
      target.status = 'Sudah Dinilai';
      target.progress.prototype = true;
      if (target.score >= 90) target.progress.sales = true;
      evaluations = [...evaluations];
    }

    onShowToast(`✓ Nilai (${inputScore}/100) dan catatan evaluasi untuk ${activeEvaluationItem.studentName} berhasil disimpan!`);
    activeEvaluationItem = null;
  }
</script>

<div class="lecturer-view">
  <!-- Header & Academic Filters -->
  <div class="view-header">
    <div>
      <h1 class="view-title">Dashboard Akademik &amp; Bimbingan</h1>
      <p class="view-sub">Monitoring performa praktikum kewirausahaan dan validasi SKS mahasiswa bimbingan.</p>
    </div>

    <div class="filter-group">
      <select class="academic-select" bind:value={selectedProdi}>
        <option>S1 Manajemen</option>
        <option>S1 Akuntansi</option>
        <option>S1 Ilmu Ekonomi</option>
      </select>

      <select class="academic-select" bind:value={selectedSemester}>
        <option>Genap 2023/2024</option>
        <option>Ganjil 2023/2024</option>
      </select>

      <select class="academic-select" bind:value={selectedClass}>
        <option>Kewirausahaan A</option>
        <option>Kewirausahaan B</option>
        <option>Semua Kelas</option>
      </select>
    </div>
  </div>

  <!-- Summary Cards -->
  <div class="summary-cards">
    <!-- Card 1 -->
    <div class="stat-card">
      <div class="stat-top">
        <span class="material-symbols-outlined stat-icon icon-fill">groups</span>
        <span class="stat-tag font-mono">SEMESTER INI</span>
      </div>
      <div>
        <span class="stat-label">Total Mahasiswa Bimbingan</span>
        <h3 class="stat-value font-mono">45</h3>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="stat-card">
      <div class="stat-top">
        <span class="material-symbols-outlined stat-icon icon-fill text-secondary">verified</span>
        <span class="stat-tag font-mono text-secondary">INKUBASI</span>
      </div>
      <div>
        <span class="stat-label">Bisnis Tervalidasi Pasar</span>
        <h3 class="stat-value font-mono">12</h3>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="stat-card">
      <div class="stat-top">
        <span class="material-symbols-outlined stat-icon icon-fill">grade</span>
        <span class="growth-tag font-mono">+2.4% vs angkatan lalu</span>
      </div>
      <div>
        <span class="stat-label">Rata-rata Nilai Evaluasi</span>
        <h3 class="stat-value font-mono">88<span class="val-sub">/100</span></h3>
      </div>
    </div>

    <!-- Card 4 (Action Required) -->
    <div class="stat-card alert-card">
      <div class="stat-top">
        <span class="material-symbols-outlined stat-icon icon-fill text-error">pending_actions</span>
        <span class="alert-tag font-mono">PERLU PERHATIAN</span>
      </div>
      <div>
        <span class="stat-label">Mahasiswa Belum Dievaluasi</span>
        <h3 class="stat-value text-error font-mono">
          {evaluations.filter(e => e.status === 'Belum Dinilai').length}
        </h3>
      </div>
    </div>
  </div>

  <!-- Sub-View: Monitoring Omzet Mahasiswa Bimbingan -->
  {#if activeTab === 'monitoring_revenue'}
    <div class="sub-card-container">
      <div class="lecturer-metric-header">
        <div>
          <h2 class="sub-view-title">Monitoring Omzet Mahasiswa Bimbingan</h2>
          <span class="sub-view-desc font-mono">Komparasi Capaian Target Inkubasi Semester Genap 2023/2024</span>
        </div>
        <button
          type="button"
          class="btn-export-dosen font-mono"
          onclick={() => alert('Export Rekap Finansial Mahasiswa (.xlsx) berhasil diunduh.')}
        >
          <span class="material-symbols-outlined text-sm">download</span>
          <span>Unduh Laporan Keuangan Bimbingan</span>
        </button>
      </div>

      <div class="revenue-compare-grid font-mono">
        <div class="rev-card">
          <div class="rev-card-top">
            <span class="rev-team">AgriGrow Tech (Budi Santoso)</span>
            <span class="badge-status-green">TARGET TERCAPAI</span>
          </div>
          <span class="rev-val">Rp 18.500.000</span>
          <span class="rev-sub">Omzet Kumulatif • 120 Transaksi</span>
          <div class="rev-bar-track"><div class="rev-bar-fill" style="width: 92%;"></div></div>
        </div>

        <div class="rev-card">
          <div class="rev-card-top">
            <span class="rev-team">Accounting Assist Lab (Dimas Anggara)</span>
            <span class="badge-status-green">TARGET TERCAPAI</span>
          </div>
          <span class="rev-val">Rp 24.200.000</span>
          <span class="rev-sub">Omzet Kumulatif • 5 Klien UMKM</span>
          <div class="rev-bar-track"><div class="rev-bar-fill" style="width: 100%;"></div></div>
        </div>

        <div class="rev-card">
          <div class="rev-card-top">
            <span class="rev-team">EcoPack Solutions (Siti Aminah)</span>
            <span class="badge-status-yellow">PROTOTYPE FASE</span>
          </div>
          <span class="rev-val">Rp 4.500.000</span>
          <span class="rev-sub">Omzet Kumulatif • Pre-Order Kampus</span>
          <div class="rev-bar-track"><div class="rev-bar-fill bg-secondary" style="width: 45%;"></div></div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Sub-View: Matriks Pertumbuhan Usaha -->
  {#if activeTab === 'monitoring_growth'}
    <div class="sub-card-container">
      <div class="growth-matrix-card">
        <h2 class="sub-view-title">Matriks Pertumbuhan Usaha Mahasiswa Bimbingan</h2>
        <p class="sub-view-desc font-mono">Penelusuran Tahapan Kesiapan Komersialisasi &amp; Validasi Pelanggan</p>

        <div class="matrix-table-wrap font-mono">
          <table class="matrix-table">
            <thead>
              <tr>
                <th>Unit Usaha Mahasiswa</th>
                <th>Tahap 1: Idea Pitch</th>
                <th>Tahap 2: Prototype Lab</th>
                <th>Tahap 3: First Sales</th>
                <th>Status Inkubasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold text-primary">AgriGrow Tech</td>
                <td class="text-success">✓ Lolos (Nilai: 95)</td>
                <td class="text-success">✓ Lolos (Nilai: 90)</td>
                <td class="text-secondary">Sedang Berjalan</td>
                <td><span class="badge-tag-active">Aktif Berjualan</span></td>
              </tr>
              <tr>
                <td class="font-bold text-primary">EcoPack Solutions</td>
                <td class="text-success">✓ Lolos (Nilai: 88)</td>
                <td class="text-secondary">Uji Kelayakan Lab</td>
                <td class="text-outline">-</td>
                <td><span class="badge-tag-pending">Pengujian Material</span></td>
              </tr>
              <tr>
                <td class="font-bold text-primary">Accounting Assist Lab</td>
                <td class="text-success">✓ Lolos (Nilai: 98)</td>
                <td class="text-success">✓ Lolos (Nilai: 95)</td>
                <td class="text-success">✓ Selesai (Nilai: 95)</td>
                <td><span class="badge-tag-done">Siap Spin-off</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Evaluation Table -->
  {#if activeTab === 'summary' || activeTab === 'evaluations'}
  <div class="table-card">
    <div class="table-header">
      <div>
        <h2 class="table-title">Daftar Evaluasi Akademik Mahasiswa</h2>
        <span class="table-sub font-mono">Kurikulum Berbasis Kompetensi Laboratorium FEB</span>
      </div>

      <button
        type="button"
        class="btn-export font-mono"
        onclick={() => alert('Export Rekap Nilai Akademik (.xlsx) berhasil diunduh.')}
      >
        <span class="material-symbols-outlined text-sm">download</span>
        <span>Unduh Rekap SKS</span>
      </button>
    </div>

    <div class="table-container">
      <table class="eval-table">
        <thead>
          <tr>
            <th>Mahasiswa &amp; Unit Usaha</th>
            <th>NIM</th>
            <th>Progress Validasi</th>
            <th>Status Penilaian</th>
            <th class="text-right">Nilai Akhir</th>
            <th class="text-center">Aksi Mentor</th>
          </tr>
        </thead>
        <tbody>
          {#each evaluations as ev (ev.id)}
            <tr class="eval-row">
              <td>
                <div class="student-cell">
                  <div class="avatar-initials font-mono">
                    {ev.studentName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span class="student-name">{ev.studentName}</span>
                    <span class="biz-name">{ev.businessName} • {ev.category}</span>
                  </div>
                </div>
              </td>
              <td class="font-mono text-xs text-outline">{ev.nim}</td>
              <td class="progress-col">
                <div class="stage-stepper">
                  <div class="stage-labels font-mono">
                    <span class={ev.progress.idea ? 'stage-done' : ''}>IDEA</span>
                    <span class={ev.progress.prototype ? 'stage-done' : ''}>PROTOTYPE</span>
                    <span class={ev.progress.sales ? 'stage-done' : ''}>SALES</span>
                  </div>
                  <div class="stepper-bar">
                    <div class="step-seg {ev.progress.idea ? 'active' : ''}"></div>
                    <div class="step-seg {ev.progress.prototype ? 'active' : ''}"></div>
                    <div class="step-seg {ev.progress.sales ? 'active' : ''}"></div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-pill {ev.status === 'Sudah Dinilai' ? 'status-graded' : 'status-pending'} font-mono">
                  {ev.status}
                </span>
              </td>
              <td class="text-right font-mono font-bold {ev.score ? 'text-primary' : 'text-outline'}">
                {ev.score ? ev.score : '-'}
              </td>
              <td class="text-center">
                {#if ev.status === 'Belum Dinilai'}
                  <button
                    type="button"
                    class="btn-grade font-button"
                    onclick={() => openGradeModal(ev)}
                  >
                    Beri Evaluasi
                  </button>
                {:else}
                  <button
                    type="button"
                    class="btn-detail font-button"
                    onclick={() => openGradeModal(ev)}
                  >
                    Edit / Catatan
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  {/if}
</div>

<!-- Modal Penilaian Dosen -->
{#if activeEvaluationItem}
  <div
    class="modal-backdrop"
    onclick={() => activeEvaluationItem = null}
    onkeydown={(e) => { if (e.key === 'Escape') activeEvaluationItem = null; }}
    role="dialog"
    aria-modal="true"
    aria-label="Modal Evaluasi Akademik"
    tabindex="-1"
  >
    <div
      class="modal-box"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <div class="modal-top">
        <div>
          <span class="modal-eyebrow font-mono">EVALUASI PRAKTIKUM KEWIRAUSAHAAN</span>
          <h3 class="modal-title">{activeEvaluationItem.studentName}</h3>
          <p class="modal-sub">{activeEvaluationItem.businessName} ({activeEvaluationItem.nim})</p>
        </div>
        <button
          type="button"
          class="btn-close"
          onclick={() => activeEvaluationItem = null}
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onsubmit={handleSaveEvaluation} class="grade-form">
        <div class="form-group">
          <label for="grade-score" class="form-label">
            Nilai Akhir Bimbingan (Skala 0 - 100)
          </label>
          <div class="score-input-wrap">
            <input
              id="grade-score"
              type="number"
              min="0"
              max="100"
              class="score-input font-mono"
              bind:value={inputScore}
              required
            />
            <span class="score-rubric font-mono">
              {#if inputScore >= 85}
                Predikat A (Sangat Baik / Lolos Inkubasi)
              {:else if inputScore >= 75}
                Predikat B+ (Baik / Perlu Perbaikan Cashflow)
              {:else}
                Predikat C (Cukup / Butuh Bimbingan Tambahan)
              {/if}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label for="grade-feedback" class="form-label">
            Catatan &amp; Feedback Dosen Pembimbing
          </label>
          <textarea
            id="grade-feedback"
            rows="4"
            placeholder="Tuliskan evaluasi laporan keuangan, etika bisnis, dan capaian omzet mahasiswa..."
            class="feedback-textarea"
            bind:value={inputFeedback}
            required
          ></textarea>
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn-cancel"
            onclick={() => activeEvaluationItem = null}
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn-save"
          >
            Simpan Nilai &amp; Evaluasi
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .lecturer-view {
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

  .filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .academic-select {
    font-size: 0.75rem;
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-lowest);
    color: var(--color-on-surface);
    outline: none;
  }

  /* Summary Cards */
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .stat-card {
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

  .stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .stat-icon {
    font-size: 26px;
    color: var(--color-primary);
  }

  .stat-tag {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-outline);
  }

  .growth-tag {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-success);
  }

  .alert-tag {
    font-size: 0.625rem;
    font-weight: 700;
    color: var(--color-error);
    background-color: var(--color-error-container);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
  }

  .stat-label {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    display: block;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  }

  .val-sub {
    font-size: 0.9375rem;
    color: var(--color-outline);
    font-weight: 500;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .btn-export {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    border: 1px solid var(--color-outline-variant);
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
  }

  .table-container {
    overflow-x: auto;
  }

  .eval-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    min-width: 720px;
  }

  .eval-table th {
    padding: 0.875rem 1.25rem;
    text-align: left;
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .eval-row td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .eval-row:hover {
    background-color: var(--color-surface-container-low);
  }

  .student-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar-initials {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .student-name {
    font-weight: 700;
    color: var(--color-primary);
    display: block;
  }

  .biz-name {
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant);
  }

  .stage-stepper {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    width: 150px;
  }

  .stage-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.5625rem;
    color: var(--color-outline);
  }

  .stage-done {
    color: var(--color-primary);
    font-weight: 700;
  }

  .stepper-bar {
    display: flex;
    height: 6px;
    background-color: var(--color-surface-container-highest);
    border-radius: var(--radius-full);
    overflow: hidden;
    gap: 2px;
  }

  .step-seg {
    flex: 1;
    background-color: var(--color-surface-container-highest);
  }

  .step-seg.active {
    background-color: var(--color-primary);
  }

  .status-pill {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .status-graded {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
  }

  .status-pending {
    background-color: var(--color-error-container);
    color: var(--color-error);
  }

  .btn-grade {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-detail {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
  }

  .text-right { text-align: right; }
  .text-center { text-align: center; }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background-color: rgba(0, 6, 102, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal-box {
    background-color: var(--color-surface-container-lowest);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-outline-variant);
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-width: 520px;
    padding: 1.5rem;
  }

  .modal-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 0.75rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .modal-eyebrow {
    font-size: 0.625rem;
    color: var(--color-secondary);
    letter-spacing: 0.08em;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .modal-sub {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .btn-close {
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
  }

  .grade-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .form-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .score-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .score-input {
    width: 90px;
    padding: 0.5rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
    text-align: center;
  }

  .score-rubric {
    font-size: 0.75rem;
    color: var(--color-secondary);
    font-weight: 600;
  }

  .feedback-textarea {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-family: var(--font-sans);
    outline: none;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .btn-cancel {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .btn-save {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  /* Lecturer Sub-Views */
  .sub-card-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .lecturer-metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .sub-view-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .sub-view-desc {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .btn-export-dosen {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
  }

  .revenue-compare-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .rev-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .rev-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .rev-team {
    font-weight: 700;
    font-size: 0.8125rem;
    color: var(--color-primary);
  }

  .badge-status-green {
    font-size: 0.625rem;
    color: var(--color-success);
    background-color: var(--color-success-container);
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .badge-status-yellow {
    font-size: 0.625rem;
    color: var(--color-secondary);
    background-color: var(--color-secondary-fixed);
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .rev-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .rev-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .rev-bar-track {
    height: 8px;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-top: 0.5rem;
  }

  .rev-bar-fill {
    height: 100%;
    background-color: var(--color-primary);
  }

  .growth-matrix-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }

  .lecturer-metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .matrix-table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    margin-top: 1rem;
  }

  .matrix-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    min-width: 640px;
  }

  .matrix-table th {
    padding: 0.75rem 1rem;
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    text-align: left;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .matrix-table td {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .badge-tag-active {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .badge-tag-pending {
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .badge-tag-done {
    background-color: var(--color-success-container);
    color: var(--color-success);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .view-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .filter-group {
      width: 100%;
      flex-direction: column;
      gap: 0.5rem;
    }
    .academic-select {
      width: 100%;
    }
    .summary-cards {
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .revenue-compare-grid {
      grid-template-columns: 1fr;
    }
    .lecturer-metric-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .btn-export-dosen {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .summary-cards {
      grid-template-columns: 1fr;
    }
  }
</style>
