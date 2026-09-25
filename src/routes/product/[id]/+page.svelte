<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { mockProducts } from '$lib/data/mockData.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  // Resolve product from route param id
  let productId = $derived($page.params.id);
  let product = $derived(
    mockProducts.find((p) => p.id === productId) || mockProducts[0]
  );

  let quantity = $state(1);
  let selectedImgIdx = $state(0);
  let toastMsg = $state(null);
  let toastTimer = null;

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg = msg;
    toastTimer = setTimeout(() => {
      toastMsg = null;
    }, 3000);
  }

  function handleAddToCart() {
    showToast(`✓ Berhasil menambahkan ${quantity}x "${product.name}" ke keranjang belanja.`);
  }

  function handleDirectBuy() {
    goto(`${base}/checkout?productId=${product.id}&qty=${quantity}`);
  }

  let relatedProducts = $derived(
    mockProducts.filter((p) => p.id !== product.id).slice(0, 3)
  );
</script>

<svelte:head>
  <title>{product.name} | Detail Produk FEB-X</title>
</svelte:head>

<div class="product-page">
  <Navbar
    cartCount={2}
    onOpenCart={() => goto(`${base}/checkout`)}
    onOpenLogin={() => goto(`${base}/login`)}
    onNavigateSection={() => goto(`${base}/`)}
  />

  <main class="page-container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb font-mono">
      <a href="{base}/">Beranda</a>
      <span class="material-symbols-outlined text-xs">chevron_right</span>
      <a href="{base}/">Marketplace</a>
      <span class="material-symbols-outlined text-xs">chevron_right</span>
      <span class="active">{product.name}</span>
    </nav>

    <!-- Product Bento Container -->
    <div class="product-layout">
      <!-- Left: Image Gallery -->
      <div class="gallery-col">
        <div class="main-image-wrap">
          <img
            src={product.image}
            alt={product.name}
            class="main-product-img"
          />
          <span class="category-badge font-mono">{product.category.toUpperCase()}</span>
        </div>

        <div class="thumbnail-row">
          <button
            type="button"
            class="thumb-box {selectedImgIdx === 0 ? 'active' : ''}"
            onclick={() => selectedImgIdx = 0}
          >
            <img src={product.image} alt="Thumbnail 1" class="thumb-img" />
          </button>
          <button
            type="button"
            class="thumb-box {selectedImgIdx === 1 ? 'active' : ''}"
            onclick={() => selectedImgIdx = 1}
          >
            <img src={product.image} alt="Thumbnail 2" class="thumb-img" style="filter: brightness(0.95);" />
          </button>
          <div class="thumb-more font-mono">
            <span>+2 Foto</span>
          </div>
        </div>
      </div>

      <!-- Right: Details & Purchase Card -->
      <div class="info-col">
        <div class="product-card-inner">
          <div class="title-section">
            <span class="badge-mentor font-mono">
              <span class="material-symbols-outlined text-xs icon-fill">school</span>
              Bimbingan: {product.lecturerMentor}
            </span>
            <h1 class="product-title">{product.name}</h1>

            <div class="rating-row">
              <div class="stars">
                {#each [1, 2, 3, 4, 5] as s}
                  <span class="material-symbols-outlined star-icon icon-fill">star</span>
                {/each}
              </div>
              <span class="rating-num font-mono">{product.rating} (124 Ulasan Mahasiswa)</span>
              <span class="dot">•</span>
              <span class="sold-count font-mono">{product.soldCount}+ Terjual</span>
            </div>
          </div>

          <!-- Price & Discount -->
          <div class="price-section">
            <span class="price-val font-mono">{product.formattedPrice}</span>
            <span class="student-discount font-mono">Diskon Khusus Civitas 10%</span>
          </div>

          <!-- Description -->
          <div class="desc-section">
            <h3 class="desc-heading font-mono">DESKRIPSI PRODUK MAHASISWA</h3>
            <p class="desc-body">{product.description}</p>
          </div>

          <!-- Student Venture Badge -->
          <div class="venture-card">
            <div class="venture-icon">
              <span class="material-symbols-outlined">storefront</span>
            </div>
            <div class="venture-meta">
              <span class="venture-name">{product.studentOwner}</span>
              <span class="venture-nim font-mono">{product.nim} • {product.major}</span>
              <span class="venture-valid font-mono">
                <span class="material-symbols-outlined text-xs">verified</span>
                Inkubator Terverifikasi Dekanat FEB
              </span>
            </div>
          </div>

          <!-- Actions & Quantity -->
          <div class="purchase-actions">
            <div class="qty-control font-mono">
              <button
                type="button"
                class="qty-btn"
                onclick={() => quantity = Math.max(1, quantity - 1)}
                disabled={quantity <= 1}
              >-</button>
              <span class="qty-num">{quantity}</span>
              <button
                type="button"
                class="qty-btn"
                onclick={() => quantity++}
              >+</button>
            </div>

            <button
              type="button"
              class="btn-cart"
              onclick={handleAddToCart}
            >
              <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
              <span>Keranjang</span>
            </button>

            <button
              type="button"
              class="btn-buy"
              onclick={handleDirectBuy}
            >
              <span class="material-symbols-outlined text-sm">shopping_bag</span>
              <span>Beli Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="related-section">
      <h2 class="section-title">Produk Mahasiswa Terkait</h2>
      <div class="related-grid">
        {#each relatedProducts as rel}
          <a href="{base}/product/{rel.id}" class="related-card">
            <img src={rel.image} alt={rel.name} class="rel-img" />
            <div class="rel-body">
              <span class="rel-name">{rel.name}</span>
              <span class="rel-price font-mono">{rel.formattedPrice}</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </main>

  <Footer />

  <!-- Toast -->
  {#if toastMsg}
    <div class="toast-popup font-mono">
      <span class="material-symbols-outlined text-sm">check_circle</span>
      <span>{toastMsg}</span>
    </div>
  {/if}
</div>

<style>
  .product-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem 4rem;
    width: 100%;
    flex: 1;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--color-outline);
    margin-bottom: 1.5rem;
  }

  .breadcrumb a {
    color: var(--color-outline);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    color: var(--color-primary);
  }

  .breadcrumb .active {
    color: var(--color-primary);
    font-weight: 700;
  }

  .product-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3.5rem;
  }

  @media (min-width: 900px) {
    .product-layout {
      grid-template-columns: 7fr 5fr;
    }
  }

  /* Gallery */
  .gallery-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-image-wrap {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-low);
  }

  .main-product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .category-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background-color: rgba(0, 6, 102, 0.85);
    color: white;
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: var(--radius-xs);
    backdrop-filter: blur(4px);
  }

  .thumbnail-row {
    display: flex;
    gap: 0.75rem;
  }

  .thumb-box {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-md);
    overflow: hidden;
    border: 2px solid var(--color-outline-variant);
    cursor: pointer;
    background: none;
    padding: 0;
  }

  .thumb-box.active {
    border-color: var(--color-primary);
  }

  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .thumb-more {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-md);
    background-color: var(--color-surface-container-high);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  /* Info Column */
  .product-card-inner {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    box-shadow: var(--shadow-ambient);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    height: 100%;
  }

  .badge-mentor {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .product-title {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .rating-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .stars {
    display: flex;
    color: var(--color-secondary);
  }

  .star-icon {
    font-size: 18px;
  }

  .rating-num, .sold-count {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .dot {
    color: var(--color-outline-variant);
  }

  .price-section {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .price-val {
    font-size: 1.875rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .student-discount {
    font-size: 0.6875rem;
    font-weight: 700;
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .desc-heading {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-outline);
    margin-bottom: 0.4rem;
    letter-spacing: 0.05em;
  }

  .desc-body {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    line-height: 1.6;
  }

  .venture-card {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-outline-variant);
  }

  .venture-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .venture-meta {
    display: flex;
    flex-direction: column;
  }

  .venture-name {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .venture-nim {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .venture-valid {
    font-size: 0.6875rem;
    color: var(--color-success);
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-weight: 600;
    margin-top: 0.15rem;
  }

  .purchase-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
    flex-wrap: wrap;
  }

  .qty-control {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .qty-btn {
    width: 34px;
    height: 42px;
    background: var(--color-surface-container-low);
    border: none;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
  }

  .qty-num {
    padding: 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
  }

  .btn-cart {
    background: transparent;
    border: 1.5px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0 1rem;
    height: 42px;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  .btn-buy {
    flex: 1;
    background-color: var(--color-primary);
    color: white;
    border: none;
    height: 42px;
    padding: 0 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
  }

  .btn-buy:hover {
    background-color: var(--color-primary-container);
  }

  /* Related */
  .related-section {
    margin-top: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  .related-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    overflow: hidden;
    text-decoration: none;
    transition: transform 0.2s ease;
  }

  .related-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-ambient);
  }

  .rel-img {
    width: 100%;
    height: 140px;
    object-fit: cover;
  }

  .rel-body {
    padding: 0.875rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .rel-name {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .rel-price {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-secondary);
  }

  .toast-popup {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-modal);
    border-left: 4px solid var(--color-secondary-container);
    z-index: 100;
  }

  @media (max-width: 640px) {
    .page-container {
      padding: 1rem 1rem 3rem;
    }
    .purchase-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    .qty-control {
      width: 100%;
      justify-content: space-between;
    }
    .qty-btn {
      flex: 1;
    }
    .btn-cart, .btn-buy {
      width: 100%;
      justify-content: center;
    }
    .related-grid {
      grid-template-columns: 1fr;
    }
    .main-image-wrap {
      aspect-ratio: 16 / 11;
    }
  }
</style>
