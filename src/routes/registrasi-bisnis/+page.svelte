<script>
  import { goto } from '$app/navigation';
  import { adminValidationQueue } from '$lib/data/mockData.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  // Step 1 - 3
  let currentStep = $state(1);
  let isSubmitting = $state(false);
  let isSubmitted = $state(false);

  // Form Fields
  let businessName = $state('');
  let category = $state('fnb');
  let description = $state('');
  let founderName = $state('');
  let nim = $state('');
  let phone = $state('');
  let targetMarket = $state('Civitas Akademika Kampus');
  let agreeEthics = $state(true);

  function handleNextStep(e) {
    if (e) e.preventDefault();
    if (currentStep === 1) {
      if (!businessName.trim() || !description.trim()) {
        alert('Mohon lengkapi nama dan deskripsi usaha.');
        return;
      }
      currentStep = 2;
    } else if (currentStep === 2) {
      if (!founderName.trim() || !nim.trim()) {
        alert('Mohon isi nama pendiri dan NIM ketua tim.');
        return;
      }
      currentStep = 3;
    }
  }

  function handleFinalSubmit() {
    isSubmitting = true;
    setTimeout(() => {
      isSubmitting = false;
      isSubmitted = true;

      // Add to shared admin validation queue
      adminValidationQueue.unshift({
        id: 'val-' + Math.floor(100 + Math.random() * 900),
        businessName: businessName,
        owner: `${founderName} (${nim})`,
        category: category === 'fnb' ? 'Food & Beverage' : category === 'tech' ? 'Teknologi & Digital' : 'Retail & Kreatif',
        submissionDate: 'Hari ini',
        documents: 'Proposal Inkubasi, Validasi NIM',
        status: 'Menunggu Review'
      });
    }, 1000);
  }
</script>

<svelte:head>
  <title>Registrasi Bisnis Mahasiswa | FEB-X</title>
</svelte:head>

<div class="reg-page">
  <Navbar
    cartCount={0}
    onOpenCart={() => goto('/checkout')}
    onOpenLogin={() => goto('/login')}
    onNavigateSection={() => goto('/')}
  />

  <main class="page-container">
    <header class="reg-header">
      <h1 class="reg-title">Registrasi Bisnis Mahasiswa</h1>
      <p class="reg-sub">
        Daftarkan unit usaha Anda ke dalam ekosistem FEB-X untuk kurasi produk, validasi SKS praktikum, dan monitoring dekanat.
      </p>
    </header>

    <!-- Step Progress Bar -->
    <div class="stepper-wrap font-mono">
      <div class="step-item {currentStep >= 1 ? 'active' : ''}">
        <div class="step-circle">{currentStep > 1 ? '✓' : '1'}</div>
        <span class="step-label">Informasi Bisnis</span>
      </div>
      <div class="step-connector {currentStep >= 2 ? 'active' : ''}"></div>
      <div class="step-item {currentStep >= 2 ? 'active' : ''}">
        <div class="step-circle">{currentStep > 2 ? '✓' : '2'}</div>
        <span class="step-label">Dokumen &amp; Tim</span>
      </div>
      <div class="step-connector {currentStep >= 3 ? 'active' : ''}"></div>
      <div class="step-item {currentStep >= 3 ? 'active' : ''}">
        <div class="step-circle">3</div>
        <span class="step-label">Review &amp; Kirim</span>
      </div>
    </div>

    <!-- Form Box -->
    <div class="form-card">
      {#if !isSubmitted}
        {#if currentStep === 1}
          <!-- Step 1: Info Bisnis -->
          <form onsubmit={handleNextStep} class="step-form">
            <h2 class="section-title">Detail Informasi Bisnis</h2>

            <div class="form-group">
              <label for="reg-biz-name" class="form-label font-mono">Nama Usaha / Brand</label>
              <div class="input-icon-wrap">
                <input
                  id="reg-biz-name"
                  type="text"
                  placeholder="Contoh: Kopi Mandiri Kampus"
                  class="form-input"
                  bind:value={businessName}
                  required
                />
                <span class="material-symbols-outlined input-icon">storefront</span>
              </div>
              <span class="input-hint font-mono">Nama resmi produk/layanan yang akan tampil di Marketplace.</span>
            </div>

            <div class="form-group">
              <label for="reg-cat" class="form-label font-mono">Kategori Industri</label>
              <select id="reg-cat" class="form-input" bind:value={category}>
                <option value="fnb">Food &amp; Beverage (Kuliner)</option>
                <option value="retail">Fashion, Kriya &amp; Retail</option>
                <option value="tech">Teknologi Finansial &amp; Digital</option>
                <option value="services">Jasa &amp; Konsultasi Bisnis</option>
              </select>
            </div>

            <div class="form-group">
              <label for="reg-desc" class="form-label font-mono">Deskripsi Produk &amp; Nilai Tambah</label>
              <textarea
                id="reg-desc"
                rows="4"
                placeholder="Jelaskan spesifikasi produk, target pembeli mahasiswa, dan keunggulan kompetitif..."
                class="form-input"
                bind:value={description}
                required
              ></textarea>
              <div class="char-count font-mono">{description.length} / 300 karakter</div>
            </div>

            <div class="info-alert">
              <span class="material-symbols-outlined text-primary icon-fill">info</span>
              <p class="alert-text">
                Semua bisnis yang didaftarkan wajib mematuhi panduan etika wirausaha dan standar mutu kurasi laboratorium FEB.
              </p>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn-cancel"
                onclick={() => goto('/')}
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                <span>Lanjut ke Dokumen</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        {:else if currentStep === 2}
          <!-- Step 2: Tim & Dokumen -->
          <form onsubmit={handleNextStep} class="step-form">
            <h2 class="section-title">Legalitas &amp; Pengelola Bisnis</h2>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-founder" class="form-label font-mono">Nama Ketua Tim / Founder</label>
                <input
                  id="reg-founder"
                  type="text"
                  placeholder="Nama Lengkap Mahasiswa"
                  class="form-input"
                  bind:value={founderName}
                  required
                />
              </div>

              <div class="form-group">
                <label for="reg-nim" class="form-label font-mono">Nomor Induk Mahasiswa (NIM)</label>
                <input
                  id="reg-nim"
                  type="text"
                  placeholder="22/504123/EK/24102"
                  class="form-input"
                  bind:value={nim}
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="reg-phone" class="form-label font-mono">WhatsApp Bisnis</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+62 812-3456-7890"
                  class="form-input"
                  bind:value={phone}
                  required
                />
              </div>

              <div class="form-group">
                <label for="reg-target" class="form-label font-mono">Target Segmen Pasar</label>
                <input
                  id="reg-target"
                  type="text"
                  placeholder="Civitas Kampus &amp; Umum"
                  class="form-input"
                  bind:value={targetMarket}
                />
              </div>
            </div>

            <div class="form-group">
              <span class="form-label font-mono">Unggah Berkas Proposal Usaha (PDF)</span>
              <div class="file-drop-area">
                <span class="material-symbols-outlined text-3xl text-primary">upload_file</span>
                <span class="file-hint font-mono">Proposal_Bisnis_Inkubasi.pdf (Tersimulasi Siap)</span>
                <span class="file-size font-mono">Maksimal 10 MB • Format PDF</span>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn-cancel"
                onclick={() => currentStep = 1}
              >
                Kembali
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                <span>Lanjut ke Review</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </form>
        {:else}
          <!-- Step 3: Review & Submit -->
          <div class="step-form">
            <h2 class="section-title">Review Pengajuan Proposal</h2>

            <div class="review-box font-mono">
              <div class="review-row">
                <span class="review-k">Nama Bisnis:</span>
                <span class="review-v font-bold text-primary">{businessName}</span>
              </div>
              <div class="review-row">
                <span class="review-k">Kategori:</span>
                <span class="review-v">{category.toUpperCase()}</span>
              </div>
              <div class="review-row">
                <span class="review-k">Ketua Pengusul:</span>
                <span class="review-v">{founderName} (NIM: {nim})</span>
              </div>
              <div class="review-row">
                <span class="review-k">Kontak WA:</span>
                <span class="review-v">{phone || '+62 812-3456-7890'}</span>
              </div>
              <div class="review-row">
                <span class="review-k">Deskripsi:</span>
                <span class="review-v">{description}</span>
              </div>
            </div>

            <label class="checkbox-label font-mono">
              <input type="checkbox" bind:checked={agreeEthics} />
              <span>Saya menyatakan data di atas akurat dan siap mengikuti pendampingan inkubator FEB.</span>
            </label>

            <div class="form-actions">
              <button
                type="button"
                class="btn-cancel"
                onclick={() => currentStep = 2}
                disabled={isSubmitting}
              >
                Kembali
              </button>
              <button
                type="button"
                class="btn-submit-final font-mono"
                onclick={handleFinalSubmit}
                disabled={isSubmitting || !agreeEthics}
              >
                {#if isSubmitting}
                  <span class="material-symbols-outlined text-sm spin">sync</span>
                  <span>Mengirimkan Proposal...</span>
                {:else}
                  <span class="material-symbols-outlined text-sm">send</span>
                  <span>Kirim Proposal ke Admin Dekanat</span>
                {/if}
              </button>
            </div>
          </div>
        {/if}
      {:else}
        <!-- Congratulations / Success Screen -->
        <div class="success-box">
          <div class="success-badge font-mono">
            <span class="material-symbols-outlined text-2xl icon-fill">verified</span>
            <span>PROPOSAL BERHASIL DIAJUKAN</span>
          </div>

          <h2 class="success-title">Terima Kasih, {founderName || 'Mahasiswa Pengusul'}!</h2>
          <p class="success-desc">
            Proposal bisnis <strong>"{businessName}"</strong> telah masuk ke antrean kurasi Admin Fakultas. Tim verifikator dekanat akan memeriksa berkas dalam 1x24 jam kerja.
          </p>

          <div class="success-actions">
            <button
              type="button"
              class="btn-to-dash font-mono"
              onclick={() => goto('/dashboard')}
            >
              Buka Dashboard FEB-X
            </button>
            <button
              type="button"
              class="btn-to-home font-mono"
              onclick={() => goto('/')}
            >
              Kembali ke Marketplace
            </button>
          </div>
        </div>
      {/if}
    </div>
  </main>

  <Footer />
</div>

<style>
  .reg-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .page-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 4rem;
    width: 100%;
    flex: 1;
  }

  .reg-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .reg-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .reg-sub {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }

  /* Stepper */
  .stepper-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-outline);
  }

  .step-item.active {
    color: var(--color-primary);
    font-weight: 700;
  }

  .step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid var(--color-outline-variant);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }

  .step-item.active .step-circle {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
    color: white;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-connector {
    width: 36px;
    height: 2px;
    background-color: var(--color-outline-variant);
  }

  .step-connector.active {
    background-color: var(--color-primary);
  }

  /* Form Card */
  .form-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-ambient);
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
    margin-bottom: 1.5rem;
  }

  .step-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .input-icon-wrap {
    position: relative;
  }

  .form-input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    outline: none;
    background-color: var(--color-surface-container-lowest);
  }

  .form-input:focus {
    border-color: var(--color-primary);
  }

  .input-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-outline);
    font-size: 20px;
  }

  .input-hint, .char-count {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .char-count {
    text-align: right;
  }

  .info-alert {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    padding: 0.875rem;
  }

  .alert-text {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    line-height: 1.4;
  }

  .file-drop-area {
    border: 2px dashed var(--color-outline-variant);
    border-radius: var(--radius-sm);
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    background-color: var(--color-surface-container-low);
  }

  .file-hint {
    font-size: 0.8125rem;
    color: var(--color-primary);
    font-weight: 700;
  }

  .file-size {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .review-box {
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-sm);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.8125rem;
  }

  .review-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .review-k {
    color: var(--color-outline);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-on-surface);
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-outline-variant);
  }

  .btn-cancel {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    cursor: pointer;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.55rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  .btn-submit-final {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.65rem 1.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  .btn-submit-final:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Success Card */
  .success-box {
    text-align: center;
    padding: 2rem 1rem;
  }

  .success-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--color-success-container);
    color: var(--color-success);
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-full);
    margin-bottom: 1.25rem;
  }

  .success-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .success-desc {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    max-width: 540px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }

  .success-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .btn-to-dash, .btn-to-home {
    padding: 0.65rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-to-dash {
    background-color: var(--color-primary);
    color: white;
    border: none;
  }

  .btn-to-home {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface);
  }

  .spin {
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .page-container {
      padding: 1.5rem 1rem 3rem;
    }
    .reg-title {
      font-size: 1.5rem;
    }
    .form-card {
      padding: 1.25rem 1rem;
    }
    .form-row {
      flex-direction: column;
      gap: 0.75rem;
    }
    .stepper-wrap {
      gap: 0.35rem;
    }
    .step-connector {
      width: 16px;
    }
    .step-label {
      display: none;
    }
    .form-actions {
      flex-direction: column-reverse;
      gap: 0.5rem;
    }
    .btn-primary, .btn-cancel, .btn-submit-final {
      width: 100%;
      justify-content: center;
    }
    .success-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-to-dash, .btn-to-home {
      width: 100%;
    }
  }
</style>
