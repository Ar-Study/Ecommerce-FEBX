<script>
  import { mentorGuidedBusinesses, mentorCollaborations } from '$lib/data/mockData.js';

  let {
    onShowToast = (msg) => {},
    activeTab: externalTab = 'summary'
  } = $props();

  let businesses = $state([...mentorGuidedBusinesses]);
  let collaborations = $state([...mentorCollaborations]);
  let activeTab = $state('businesses'); // 'businesses' | 'feedback' | 'collaborations'

  $effect(() => {
    if (externalTab === 'feedback' || externalTab === 'collaborations' || externalTab === 'businesses') {
      activeTab = externalTab;
    } else if (externalTab === 'summary') {
      activeTab = 'businesses';
    }
  });

  // Mentoring note form state
  let selectedBizId = $state(mentorGuidedBusinesses[0]?.id || '');
  let feedbackCategory = $state('pricing');
  let feedbackText = $state('');

  // Business detail modal state
  let modalBiz = $state(null);

  function handleSaveFeedback(e) {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const targetBiz = businesses.find((b) => b.id === selectedBizId);
    if (targetBiz) {
      targetBiz.notes = feedbackText;
      businesses = [...businesses];
    }

    onShowToast(`✓ Catatan pembinaan mentor untuk "${targetBiz?.name}" berhasil dikirimkan ke mahasiswa!`);
    feedbackText = '';
  }

  function handleApplyCollab(collab) {
    onShowToast(`Proposal kemitraan untuk "${collab.title}" berhasil dihubungkan ke pengelola inkubator.`);
  }
</script>

<div class="mentor-view">
  <!-- Header -->
  <div class="view-header">
    <div>
      <h1 class="view-title">Dashboard Mentor Alumni &amp; Industri</h1>
      <p class="view-sub">Program Pendampingan Wirausaha: Bimbing bisnis mahasiswa FEB menuju komersialisasi pasar nyata.</p>
    </div>

    <!-- Sub-tab switcher -->
    <div class="sub-tab-pills font-mono">
      <button
        type="button"
        class="sub-pill {activeTab === 'businesses' ? 'active' : ''}"
        onclick={() => activeTab = 'businesses'}
      >
        <span class="material-symbols-outlined text-xs">business_center</span>
        <span>Bisnis Dampingan</span>
      </button>

      <button
        type="button"
        class="sub-pill {activeTab === 'feedback' ? 'active' : ''}"
        onclick={() => activeTab = 'feedback'}
      >
        <span class="material-symbols-outlined text-xs">rate_review</span>
        <span>Masukan &amp; Catatan</span>
      </button>

      <button
        type="button"
        class="sub-pill {activeTab === 'collaborations' ? 'active' : ''}"
        onclick={() => activeTab = 'collaborations'}
      >
        <span class="material-symbols-outlined text-xs">handshake</span>
        <span>Peluang Kolaborasi</span>
      </button>
    </div>
  </div>

  <!-- KPI Cards -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">BISNIS DAMPINGAN</span>
        <span class="material-symbols-outlined kpi-icon text-primary icon-fill">business_center</span>
      </div>
      <div>
        <h3 class="kpi-val font-mono">{businesses.length}</h3>
        <p class="kpi-sub">Unit usaha mahasiswa aktif</p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">TOTAL SESI MENTORING</span>
        <span class="material-symbols-outlined kpi-icon text-secondary icon-fill">forum</span>
      </div>
      <div>
        <h3 class="kpi-val font-mono">15</h3>
        <p class="kpi-growth text-success">
          <span class="material-symbols-outlined text-xs">check</span>
          100% Kehadiran Tim Mahasiswa
        </p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">KOLABORASI INDUSTRI</span>
        <span class="material-symbols-outlined kpi-icon text-primary icon-fill">handshake</span>
      </div>
      <div>
        <h3 class="kpi-val font-mono">3</h3>
        <p class="kpi-sub">Program kemitraan berjalan</p>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-top">
        <span class="kpi-label font-mono">INDEX KEPUASAN BINAAN</span>
        <span class="badge-good font-mono">SANGAT TINGGI</span>
      </div>
      <div>
        <h3 class="kpi-val font-mono">96%</h3>
        <p class="kpi-sub">Evaluasi umpan balik mahasiswa</p>
      </div>
    </div>
  </div>

  <!-- Content depending on active sub-tab -->
  {#if activeTab === 'businesses'}
    <!-- Bisnis Dampingan View -->
    <div class="section-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Daftar Bisnis Mahasiswa Dampingan</h2>
          <p class="card-sub font-mono">Pantau omzet bulanan, pertumbuhan, dan jadwal evaluasi berikutnya.</p>
        </div>
      </div>

      <div class="biz-grid">
        {#each businesses as b (b.id)}
          <div class="biz-card">
            <div class="biz-header">
              <div>
                <h3 class="biz-name">{b.name}</h3>
                <span class="biz-founder font-mono">{b.founder} • {b.category}</span>
              </div>
              <span class="biz-stage font-mono">{b.stage}</span>
            </div>

            <div class="biz-metrics font-mono">
              <div class="metric-row">
                <span class="metric-label">Omzet Terverifikasi:</span>
                <span class="metric-val text-primary font-bold">{b.omzet}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">Pertumbuhan MoM:</span>
                <span class="metric-val text-success font-bold">{b.growth}</span>
              </div>
              <div class="metric-row">
                <span class="metric-label">Sesi Mendatang:</span>
                <span class="metric-val text-secondary">{b.nextSession}</span>
              </div>
            </div>

            <div class="biz-notes-box">
              <span class="notes-label font-mono">CATATAN EVALUASI TERAKHIR:</span>
              <p class="notes-content">{b.notes}</p>
            </div>

            <div class="biz-actions">
              <button
                type="button"
                class="btn-detail font-mono"
                onclick={() => modalBiz = b}
              >
                Lihat Profil Usaha Lengkap
              </button>
              <button
                type="button"
                class="btn-give-note font-mono"
                onclick={() => { selectedBizId = b.id; activeTab = 'feedback'; }}
              >
                Beri Masukan
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if activeTab === 'feedback'}
    <!-- Masukan & Catatan Pembinaan View -->
    <div class="section-card">
      <h2 class="card-title">Form Masukan &amp; Catatan Pembinaan Mentor</h2>
      <p class="card-sub font-mono">Umpan balik langsung kepada pendiri bisnis mahasiswa untuk asistensi bisnis.</p>

      <form onsubmit={handleSaveFeedback} class="feedback-form">
        <div class="form-row">
          <div class="form-group">
            <label for="fb-biz" class="form-label font-mono">Pilih Bisnis Mahasiswa</label>
            <select id="fb-biz" class="form-select" bind:value={selectedBizId}>
              {#each businesses as b}
                <option value={b.id}>{b.name} ({b.founder})</option>
              {/each}
            </select>
          </div>

          <div class="form-group">
            <label for="fb-cat" class="form-label font-mono">Fokus Evaluasi</label>
            <select id="fb-cat" class="form-select" bind:value={feedbackCategory}>
              <option value="pricing">Model Bisnis &amp; Penetapan Harga (Pricing)</option>
              <option value="marketing">Strategi Pemasaran &amp; Branding</option>
              <option value="operations">Efisiensi Operasional &amp; Pasokan</option>
              <option value="finance">Manajemen Arus Kas (Cashflow)</option>
              <option value="legal">Legalitas, P-IRT, &amp; HAKI</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="fb-text" class="form-label font-mono">Uraian Masukan &amp; Action Plan</label>
          <textarea
            id="fb-text"
            rows="5"
            placeholder="Tuliskan rekomendasi praktis, referensi kontak industri, atau target minggu depan..."
            class="form-textarea"
            bind:value={feedbackText}
            required
          ></textarea>
        </div>

        <div class="form-footer">
          <button type="submit" class="btn-send-fb font-mono">
            <span class="material-symbols-outlined text-sm">send</span>
            <span>Kirimkan Masukan ke Founder Mahasiswa</span>
          </button>
        </div>
      </form>
    </div>
  {:else}
    <!-- Peluang Kolaborasi Industri View -->
    <div class="section-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Papan Peluang Kolaborasi Industri &amp; Alumni</h2>
          <p class="card-sub font-mono">Akses pendanaan bibit (seed funding), sponsorship festival, dan kemitraan korporat.</p>
        </div>
      </div>

      <div class="collab-grid">
        {#each collaborations as c (c.id)}
          <div class="collab-card">
            <div class="collab-badge font-mono">{c.type}</div>
            <h3 class="collab-title">{c.title}</h3>
            <p class="collab-company font-mono">{c.company}</p>

            <div class="collab-meta font-mono">
              <div class="meta-item">
                <span class="k">Nilai / Alokasi:</span>
                <span class="v text-primary font-bold">{c.budget}</span>
              </div>
              <div class="meta-item">
                <span class="k">Batas Pengajuan:</span>
                <span class="v text-secondary">{c.deadline}</span>
              </div>
            </div>

            <button
              type="button"
              class="btn-apply-collab font-mono"
              onclick={() => handleApplyCollab(c)}
            >
              Hubungkan ke Bisnis Binaan
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Modal Profil Bisnis Binaan Detail -->
{#if modalBiz}
  <div
    class="modal-backdrop"
    onclick={() => modalBiz = null}
    onkeydown={(e) => { if (e.key === 'Escape') modalBiz = null; }}
    role="dialog"
    aria-modal="true"
    aria-label="Detail Profil Bisnis Binaan"
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
          <span class="modal-eyebrow font-mono">PROFIL BISNIS BINAAN FEB-X</span>
          <h3 class="modal-name">{modalBiz.name}</h3>
          <span class="modal-founder font-mono">{modalBiz.founder}</span>
        </div>
        <button type="button" class="btn-close" onclick={() => modalBiz = null}>
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="modal-body font-mono">
        <div class="modal-info-row">
          <span>Kategori Usaha:</span>
          <span class="font-bold">{modalBiz.category}</span>
        </div>
        <div class="modal-info-row">
          <span>Tahapan Bisnis:</span>
          <span class="badge-stage">{modalBiz.stage}</span>
        </div>
        <div class="modal-info-row">
          <span>Rata-rata Omzet:</span>
          <span class="font-bold text-primary">{modalBiz.omzet}</span>
        </div>
        <div class="modal-info-row">
          <span>Tingkat Pertumbuhan:</span>
          <span class="font-bold text-success">{modalBiz.growth}</span>
        </div>

        <div class="modal-notes-area">
          <span class="label">Catatan Mentoring Berjalan:</span>
          <p class="content">{modalBiz.notes}</p>
        </div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn-modal-close font-mono"
          onclick={() => modalBiz = null}
        >
          Tutup Profil
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .mentor-view {
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

  .sub-tab-pills {
    display: flex;
    gap: 0.35rem;
    background-color: var(--color-surface-container-low);
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-outline-variant);
  }

  .sub-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.75rem;
    border: none;
    background: transparent;
    border-radius: var(--radius-xs);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-outline);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .sub-pill.active {
    background-color: var(--color-primary);
    color: white;
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

  .kpi-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .kpi-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-outline);
    letter-spacing: 0.05em;
  }

  .kpi-icon {
    font-size: 24px;
  }

  .kpi-val {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1;
  }

  .kpi-sub {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    margin-top: 0.25rem;
  }

  .kpi-growth {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  .badge-good {
    background-color: var(--color-success-container);
    color: var(--color-success);
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
  }

  /* Section Card */
  .section-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-ambient);
  }

  .card-header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .card-sub {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  /* Businesses Grid */
  .biz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
  }

  .biz-card {
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    background-color: var(--color-surface-bright);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .biz-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .biz-name {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .biz-founder {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .biz-stage {
    font-size: 0.625rem;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .biz-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.75rem;
    background-color: var(--color-surface-container-low);
    padding: 0.75rem;
    border-radius: var(--radius-xs);
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
  }

  .metric-label {
    color: var(--color-outline);
  }

  .biz-notes-box {
    font-size: 0.75rem;
    border-left: 3px solid var(--color-secondary);
    padding-left: 0.6rem;
  }

  .notes-label {
    font-size: 0.5625rem;
    color: var(--color-secondary);
    font-weight: 700;
    display: block;
  }

  .notes-content {
    color: var(--color-on-surface-variant);
    line-height: 1.4;
  }

  .biz-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
  }

  .btn-detail, .btn-give-note {
    flex: 1;
    padding: 0.45rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-detail {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }

  .btn-give-note {
    background-color: var(--color-primary);
    color: white;
    border: none;
  }

  /* Feedback Form */
  .feedback-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  .form-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .form-select, .form-textarea {
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    outline: none;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
  }

  .btn-send-fb {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  /* Collabs */
  .collab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .collab-card {
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    background-color: var(--color-surface-bright);
    display: flex;
    flex-direction: column;
  }

  .collab-badge {
    align-self: flex-start;
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
    margin-bottom: 0.5rem;
  }

  .collab-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .collab-company {
    font-size: 0.75rem;
    color: var(--color-outline);
    margin-bottom: 1rem;
  }

  .collab-meta {
    background-color: var(--color-surface-container-low);
    padding: 0.75rem;
    border-radius: var(--radius-xs);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
  }

  .meta-item .k {
    color: var(--color-outline);
  }

  .btn-apply-collab {
    margin-top: auto;
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

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
    padding: 1.75rem;
  }

  .modal-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
    margin-bottom: 1.25rem;
  }

  .modal-eyebrow {
    font-size: 0.625rem;
    color: var(--color-secondary);
    letter-spacing: 0.08em;
  }

  .modal-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .modal-founder {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .btn-close {
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.8125rem;
  }

  .modal-info-row {
    display: flex;
    justify-content: space-between;
  }

  .badge-stage {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
  }

  .modal-notes-area {
    margin-top: 0.5rem;
    background-color: var(--color-surface-container-low);
    padding: 0.75rem;
    border-radius: var(--radius-xs);
  }

  .modal-notes-area .label {
    font-size: 0.625rem;
    color: var(--color-outline);
    display: block;
    margin-bottom: 0.25rem;
  }

  .modal-notes-area .content {
    font-size: 0.75rem;
    color: var(--color-on-surface);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .btn-modal-close {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-xs);
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .sub-tab-pills {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    max-width: 100%;
  }

  .sub-tab-pills::-webkit-scrollbar {
    display: none;
  }

  .sub-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-lowest);
    color: var(--color-on-surface);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .sub-pill:hover {
    background-color: var(--color-surface-container-low);
    border-color: var(--color-primary);
  }

  .sub-pill.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(0, 6, 102, 0.18);
  }

  @media (max-width: 768px) {
    .view-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .sub-tab-pills {
      width: 100%;
      padding-bottom: 0.25rem;
    }
    .kpi-grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .biz-grid {
      grid-template-columns: 1fr;
    }
    .collab-grid {
      grid-template-columns: 1fr;
    }
    .btn-send-fb {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .kpi-grid {
      grid-template-columns: 1fr;
    }
    .modal-box {
      width: 95%;
      padding: 1.25rem;
    }
  }
</style>
