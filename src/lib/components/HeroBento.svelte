<script>
  import heroIllustration from '$lib/assets/hero-marketplace.jpg';
  import { base } from '$app/paths';

  let {
    onExploreCatalog = () => {},
    onOpenRegister = () => {}
  } = $props();

  const keyPoints = [
    { icon: 'verified', label: 'Kurasi & NIM Dekanat Terverifikasi' },
    { icon: 'school', label: 'Bimbingan Dosen Kewirausahaan' },
    { icon: 'lock', label: 'Transaksi Aman & Ambil di Kampus' }
  ];
</script>

<section class="hero-section">
  <div class="container hero-container">
    <div class="hero-card">
      <!-- Decorative Neo-Nusantara Corner Watermarks -->
      <div class="ornament-corner ornament-tl" aria-hidden="true">
        <svg viewBox="0 0 80 80" class="ornament-svg">
          <circle cx="0" cy="0" r="40" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.3" />
          <circle cx="0" cy="0" r="60" fill="none" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="3 3" stroke-opacity="0.25" />
          <polygon points="0,0 35,0 45,10 0,55" fill="#f59e0b" fill-opacity="0.04" />
          <circle cx="28" cy="28" r="4" fill="#f59e0b" fill-opacity="0.3" />
        </svg>
      </div>

      <div class="ornament-corner ornament-br" aria-hidden="true">
        <svg viewBox="0 0 80 80" class="ornament-svg">
          <circle cx="80" cy="80" r="40" fill="none" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.3" />
          <circle cx="80" cy="80" r="60" fill="none" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="3 3" stroke-opacity="0.25" />
          <polygon points="80,80 45,80 35,70 80,25" fill="#f59e0b" fill-opacity="0.04" />
          <circle cx="52" cy="52" r="4" fill="#f59e0b" fill-opacity="0.3" />
        </svg>
      </div>

      <!-- Left Column: Content -->
      <div class="hero-content">
        <div class="hero-badge">
          <span class="live-dot"></span>
          <span class="badge-text font-mono">EKOSISTEM BISNIS MAHASISWA FEB</span>
          <span class="badge-seal font-mono">RESMI</span>
        </div>

        <h1 class="hero-title font-heading">
          Karya &amp; Inovasi<br />
          <span class="highlight-text gold-gradient-text">Wirausaha Mahasiswa</span>
        </h1>

        <p class="hero-description">
          Dukung wirausaha muda kampus! Temukan buku kuliah, kuliner kreatif, merchandise eksklusif, serta aneka produk inovatif binaan resmi Fakultas Ekonomi &amp; Bisnis.
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

          <a
            href="{base}/registrasi-bisnis"
            class="btn-cta-secondary"
          >
            <span class="material-symbols-outlined text-sm">add_business</span>
            <span>Buka Usaha Mahasiswa</span>
          </a>
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
          <div class="image-overlay-glow"></div>

          <!-- Top Status Floating Chip -->
          <div class="top-float-badge font-mono">
            <span class="material-symbols-outlined text-xs gold-icon">workspace_premium</span>
            <span>Kurasi Dekanat FEB</span>
          </div>

          <!-- Bottom Label Badge -->
          <div class="image-badge">
            <span class="material-symbols-outlined text-sm icon-fill">storefront</span>
            <div class="badge-info">
              <span class="badge-title">Bazaar &amp; Inkubator Bisnis</span>
              <span class="badge-sub font-mono">Terbuka untuk Civitas Kampus</span>
            </div>
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
    background-color: #0b1938;
    background-image: 
      radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.16) 0%, transparent 40%),
      radial-gradient(circle at 10% 80%, rgba(29, 78, 216, 0.25) 0%, transparent 45%),
      var(--pattern-kawung-dark);
    background-repeat: no-repeat, no-repeat, repeat;
    background-size: auto, auto, 60px 60px;
    border: 1px solid rgba(245, 158, 11, 0.28);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 16px 40px -4px rgba(11, 25, 56, 0.2), 0 0 0 1px rgba(254, 243, 199, 0.08);
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
  }

  @media (min-width: 960px) {
    .hero-card {
      grid-template-columns: 1.2fr 0.95fr;
      min-height: 440px;
    }
  }

  /* Decorative Corner SVGs */
  .ornament-corner {
    position: absolute;
    width: 80px;
    height: 80px;
    pointer-events: none;
    z-index: 1;
  }

  .ornament-tl {
    top: 0;
    left: 0;
  }

  .ornament-br {
    bottom: 0;
    right: 0;
  }

  .ornament-svg {
    width: 100%;
    height: 100%;
  }

  .hero-content {
    padding: 3rem 2.75rem;
    z-index: 2;
    color: #ffffff;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-full);
    margin-bottom: 1.25rem;
    backdrop-filter: blur(8px);
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--color-secondary-container);
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
  }

  .badge-text {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-secondary-fixed);
  }

  .badge-seal {
    font-size: 9px;
    font-weight: 800;
    padding: 2px 6px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #0b1938;
    border-radius: var(--radius-xs);
    letter-spacing: 0.05em;
  }

  .hero-title {
    font-size: clamp(2.1rem, 3.6vw, 3.1rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.035em;
    color: #ffffff;
    margin-bottom: 1.15rem;
  }

  .highlight-text {
    display: inline-block;
  }

  .hero-description {
    font-size: 0.975rem;
    line-height: 1.65;
    color: rgba(241, 245, 249, 0.88);
    margin-bottom: 2rem;
    max-width: 520px;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.25rem;
    flex-wrap: wrap;
  }

  .btn-cta-primary {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 100%);
    color: #0b1938;
    border: none;
    padding: 0.85rem 1.85rem;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(245, 158, 11, 0.35);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5);
  }

  .btn-cta-secondary {
    background: rgba(255, 255, 255, 0.07);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.25);
    padding: 0.85rem 1.4rem;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
  }

  .btn-cta-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--color-secondary-container);
    color: var(--color-secondary-fixed);
    transform: translateY(-2px);
  }

  .trust-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .trust-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: rgba(241, 245, 249, 0.8);
  }

  .trust-icon {
    font-size: 17px;
    color: var(--color-secondary-container);
  }

  /* Right Visual */
  .hero-visual {
    position: relative;
    height: 100%;
    min-height: 320px;
    padding: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: 380px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .hero-banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }

  .hero-visual:hover .hero-banner-img {
    transform: scale(1.04);
  }

  .image-overlay-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(11, 25, 56, 0.1) 0%, rgba(11, 25, 56, 0.6) 100%);
    pointer-events: none;
  }

  .top-float-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(11, 25, 56, 0.85);
    border: 1px solid rgba(245, 158, 11, 0.4);
    backdrop-filter: blur(8px);
    color: #ffffff;
    font-size: 0.725rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    gap: 0.35rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .gold-icon {
    color: var(--color-secondary-container);
  }

  .image-badge {
    position: absolute;
    bottom: 14px;
    left: 14px;
    right: 14px;
    background-color: rgba(11, 25, 56, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 0.6rem 0.9rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }

  .badge-info {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .badge-title {
    font-size: 0.825rem;
    font-weight: 700;
    color: #ffffff;
  }

  .badge-sub {
    font-size: 0.7rem;
    color: var(--color-secondary-fixed);
    opacity: 0.9;
  }

  @media (max-width: 959px) {
    .hero-content {
      padding: 2.25rem 1.75rem 1.5rem;
    }
    .hero-visual {
      padding: 0 1.75rem 1.75rem;
      min-height: 260px;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 1.85rem;
    }
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
    .btn-cta-primary,
    .btn-cta-secondary {
      width: 100%;
      justify-content: center;
    }
    .trust-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
</style>
