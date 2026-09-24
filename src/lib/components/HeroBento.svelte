<script>
  import heroIllustration from '$lib/assets/hero-marketplace.jpg';

  let {
    onExploreCatalog = () => {}
  } = $props();

  const keyPoints = [
    { icon: 'verified', label: 'Produk Resmi Mahasiswa' },
    { icon: 'school', label: 'Bimbingan Kampus FEB' },
    { icon: 'payments', label: 'Transaksi Aman & Mudah' }
  ];
</script>

<section class="hero-section">
  <div class="container hero-container">
    <div class="hero-card">
      <!-- Left Column: Content -->
      <div class="hero-content">
        <div class="hero-badge">
          <span class="live-dot"></span>
          <span class="badge-text">STUDENT MARKETPLACE FEB</span>
        </div>

        <h1 class="hero-title">
          Karya &amp; Produk<br />
          <span class="highlight-text">Kreatif Mahasiswa</span>
        </h1>

        <p class="hero-description">
          Dukung wirausaha muda kampus! Temukan buku kuliah, merchandise, makanan &amp; minuman, serta aneka produk inovatif langsung dari mahasiswa FEB.
        </p>

        <div class="hero-actions">
          <button
            type="button"
            class="btn-cta-primary"
            onclick={onExploreCatalog}
            id="hero-explore-btn"
          >
            <span class="material-symbols-outlined text-sm">shopping_bag</span>
            <span>Mulai Belanja</span>
          </button>
        </div>

        <!-- Trust Badges Row -->
        <div class="trust-row">
          {#each keyPoints as pt}
            <div class="trust-item">
              <span class="material-symbols-outlined trust-icon">{pt.icon}</span>
              <span>{pt.label}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Right Column: Visual Illustration Banner -->
      <div class="hero-visual" role="button" tabindex="0" onclick={onExploreCatalog} onkeydown={(e) => e.key === 'Enter' && onExploreCatalog()}>
        <div class="image-wrapper">
          <img
            src={heroIllustration}
            alt="Student Marketplace FEB - Suasana belanja dan karya mahasiswa di kampus"
            class="hero-banner-img"
          />
          <div class="image-badge">
            <span class="material-symbols-outlined text-xs">storefront</span>
            <span>Bazaar &amp; Produk Mahasiswa</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero-section {
    padding: 1.5rem 0 1.25rem;
  }

  .hero-card {
    position: relative;
    background: linear-gradient(135deg, #ffffff 0%, var(--color-surface-container-lowest) 100%);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 4px 24px -2px rgba(0, 6, 102, 0.06);
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
  }

  @media (min-width: 960px) {
    .hero-card {
      grid-template-columns: 1.15fr 1fr;
      min-height: 420px;
    }
  }

  .hero-content {
    padding: 2.75rem 2.5rem;
    z-index: 2;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-full);
    margin-bottom: 1.25rem;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--color-secondary);
    box-shadow: 0 0 0 3px rgba(253, 192, 3, 0.25);
  }

  .badge-text {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-primary);
  }

  .hero-title {
    font-size: clamp(2.1rem, 3.5vw, 3rem);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.035em;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  .highlight-text {
    background: linear-gradient(135deg, var(--color-primary) 20%, #1e40af 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-description {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-on-surface-variant);
    margin-bottom: 2rem;
    max-width: 520px;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .btn-cta-primary {
    background-color: var(--color-primary);
    color: #ffffff;
    border: none;
    padding: 0.85rem 1.85rem;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 6, 102, 0.2);
    transition: all 0.2s ease;
  }

  .btn-cta-primary:hover {
    background-color: #0b1a5e;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 6, 102, 0.26);
  }

  .trust-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 6, 102, 0.08);
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--color-on-surface-variant);
  }

  .trust-icon {
    font-size: 16px;
    color: #16a34a;
  }

  /* Right Visual */
  .hero-visual {
    position: relative;
    height: 100%;
    min-height: 300px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 380px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 6, 102, 0.1);
    border: 1px solid var(--color-outline-variant);
  }

  .hero-banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .hero-visual:hover .hero-banner-img {
    transform: scale(1.03);
  }

  .image-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background-color: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 6, 102, 0.1);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-primary);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 959px) {
    .hero-content {
      padding: 2rem 1.5rem 1.5rem;
    }
    .hero-visual {
      padding: 0 1.5rem 1.5rem;
      min-height: 250px;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 1.75rem;
    }
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
    .btn-cta-primary {
      width: 100%;
      justify-content: center;
    }
    .trust-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.65rem;
    }
  }
</style>
