<script>
  import { base } from '$app/paths';
  let {
    product = null,
    isOpen = false,
    onClose = () => {},
    onAddToCart = (prod, qty) => {},
    onDirectCheckout = (prod, qty) => {}
  } = $props();

  let quantity = $state(1);

  function increment() {
    if (product && quantity < product.stock) {
      quantity += 1;
    }
  }

  function decrement() {
    if (quantity > 1) {
      quantity -= 1;
    }
  }

  function handleAdd() {
    if (!product) return;
    onAddToCart(product, quantity);
  }

  function handleBuy() {
    if (!product) return;
    onDirectCheckout(product, quantity);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen && product}
  <div
    class="modal-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
    role="dialog"
    aria-modal="true"
    aria-label="Detail Produk"
    tabindex="-1"
  >
    <div
      class="modal-card"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <!-- Modal Close Button -->
      <button
        type="button"
        class="close-btn"
        onclick={onClose}
        aria-label="Tutup"
      >
        <span class="material-symbols-outlined">close</span>
      </button>

      <div class="modal-grid">
        <!-- Left: Image & Academic Accreditation -->
        <div class="modal-media">
          <div class="main-image-wrap">
            <img src={product.image} alt={product.name} class="detail-img" />
            {#if product.badge}
              <span class="detail-badge badge-{product.badgeType}">{product.badge}</span>
            {/if}
          </div>

          <!-- Academic Incubation Seal -->
          <div class="incubation-box">
            <span class="material-symbols-outlined inc-icon icon-fill">school</span>
            <div class="inc-text">
              <span class="inc-title">PROGRAM INKUBATOR MAHASISWA FEB</span>
              <p class="inc-desc">Unit bisnis telah diverifikasi tim kurasi dosen &amp; memperoleh pendampingan tata kelola keuangan.</p>
            </div>
          </div>
        </div>

        <!-- Right: Content & Actions -->
        <div class="modal-info">
          <div class="meta-row">
            <span class="cat-label">{product.categoryName}</span>
            <span class="stock-pill font-mono">Stok: {product.stock} {product.unit}</span>
          </div>

          <h2 class="detail-title">{product.name}</h2>

          <div class="rating-bar">
            <div class="stars">
              <span class="material-symbols-outlined text-sm icon-fill star-icon">star</span>
              <span class="font-mono font-bold">{product.rating}</span>
              <span class="review-label">({product.reviewsCount} Ulasan Konsumen)</span>
            </div>
            <span class="dot">•</span>
            <span class="sold-label font-mono">{product.soldCount} Transaksi Sukses</span>
          </div>

          <!-- Price Display -->
          <div class="price-box">
            <span class="price-tag font-mono">{product.formattedPrice}</span>
            {#if product.priceSuffix}
              <span class="price-suf">{product.priceSuffix}</span>
            {/if}
          </div>

          <!-- Student & Mentor Profile -->
          <div class="seller-card">
            <div class="seller-icon-wrap">
              <span class="material-symbols-outlined">account_circle</span>
            </div>
            <div class="seller-details">
              <span class="seller-sub">Pengelola Bisnis</span>
              <span class="seller-main">{product.owner}</span>
              <span class="seller-store">{product.seller} • {product.location}</span>
              <div class="mentor-tag font-mono">
                <span class="material-symbols-outlined text-xs">verified</span>
                <span>Dosen Pembimbing: {product.mentor}</span>
              </div>
            </div>
          </div>

          <!-- Product Description -->
          <div class="desc-box">
            <h4 class="desc-heading">Deskripsi Produk</h4>
            <p class="desc-content">{product.description}</p>
          </div>

          <!-- Quantity & Purchase Row -->
          <div class="purchase-row">
            <div class="qty-control">
              <button
                type="button"
                class="qty-btn"
                onclick={decrement}
                disabled={quantity <= 1}
                aria-label="Kurang satu"
              >
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="qty-number font-mono">{quantity}</span>
              <button
                type="button"
                class="qty-btn"
                onclick={increment}
                disabled={quantity >= product.stock}
                aria-label="Tambah satu"
              >
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            <div class="action-buttons">
              <button
                type="button"
                class="btn-modal-cart"
                onclick={handleAdd}
              >
                <span class="material-symbols-outlined">add_shopping_cart</span>
                <span>Tambah Keranjang</span>
              </button>

              <button
                type="button"
                class="btn-modal-buy"
                onclick={handleBuy}
              >
                <span>Beli Sekarang</span>
              </button>
            </div>
          </div>

          <div class="modal-footer-nav">
            <a href="{base}/product/{product.id}" class="link-full-page font-mono">
              <span class="material-symbols-outlined text-xs">open_in_new</span>
              <span>Buka Halaman Khusus Produk Ini</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    background-color: rgba(0, 6, 102, 0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    overflow-y: auto;
    animation: fadeIn 0.2s ease;
  }

  .modal-card {
    background-color: var(--color-surface-container-lowest);
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-outline-variant);
    box-shadow: var(--shadow-modal);
    width: 100%;
    max-width: 920px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: 2rem;
    animation: scaleUp 0.2s ease;
  }

  .close-btn {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-on-surface);
    cursor: pointer;
    z-index: 10;
    transition: all 0.15s ease;
  }

  .close-btn:hover {
    background-color: var(--color-surface-container-high);
    color: var(--color-error);
  }

  .modal-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 768px) {
    .modal-grid {
      grid-template-columns: 4.5fr 5.5fr;
      align-items: start;
    }
  }

  /* Left Media */
  .modal-media {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .main-image-wrap {
    position: relative;
    width: 100%;
    height: 320px;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background-color: var(--color-surface-container);
    border: 1px solid var(--color-outline-variant);
  }

  .detail-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .detail-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.3rem 0.65rem;
    border-radius: var(--radius-xs);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .badge-new {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .badge-popular {
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
  }

  .badge-incubated {
    background-color: var(--color-tertiary-container);
    color: var(--color-tertiary-fixed);
  }

  .incubation-box {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background-color: var(--color-primary-fixed);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--color-primary);
  }

  .inc-icon {
    font-size: 24px;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  .inc-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .inc-title {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-primary);
  }

  .inc-desc {
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--color-on-primary-fixed-variant);
  }

  /* Right Info */
  .modal-info {
    display: flex;
    flex-direction: column;
    gap: 1.15rem;
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cat-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-secondary);
    letter-spacing: 0.05em;
  }

  .stock-pill {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    background-color: var(--color-surface-container);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .detail-title {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.25;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .rating-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }

  .stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .star-icon {
    color: var(--color-secondary-container);
  }

  .review-label, .sold-label {
    color: var(--color-outline);
  }

  .dot {
    color: var(--color-outline-variant);
  }

  .price-box {
    padding: 0.75rem 1rem;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-md);
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .price-tag {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .price-suf {
    font-size: 0.875rem;
    color: var(--color-outline);
  }

  /* Seller Card */
  .seller-card {
    display: flex;
    gap: 0.875rem;
    padding: 1rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    background-color: var(--color-surface-container-lowest);
  }

  .seller-icon-wrap {
    color: var(--color-primary);
    font-size: 32px;
  }

  .seller-details {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .seller-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .seller-main {
    font-weight: 700;
    font-size: 0.9375rem;
    color: var(--color-on-surface);
  }

  .seller-store {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant);
  }

  .mentor-tag {
    margin-top: 0.35rem;
    font-size: 0.75rem;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
  }

  .desc-box {
    border-top: 1px solid var(--color-outline-variant);
    padding-top: 1rem;
  }

  .desc-heading {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-on-surface);
    margin-bottom: 0.4rem;
  }

  .desc-content {
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--color-on-surface-variant);
  }

  /* Purchase Row */
  .purchase-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-outline-variant);
  }

  .qty-control {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-low);
    overflow: hidden;
  }

  .qty-btn {
    background: transparent;
    border: none;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-on-surface);
    transition: background 0.15s ease;
  }

  .qty-btn:hover:not(:disabled) {
    background-color: var(--color-surface-container-high);
  }

  .qty-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .qty-number {
    width: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 0.9375rem;
  }

  .action-buttons {
    display: flex;
    flex: 1;
    gap: 0.75rem;
  }

  .btn-modal-cart {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
    border: 1.5px solid var(--color-primary);
    padding: 0.625rem 1.125rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.15s ease;
    flex: 1;
    justify-content: center;
  }

  .btn-modal-cart:hover {
    background-color: var(--color-primary-fixed);
  }

  .btn-modal-buy {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    flex: 1;
  }

  .btn-modal-buy:hover {
    background-color: var(--color-primary-container);
    box-shadow: var(--shadow-ambient);
  }

  .modal-footer-nav {
    margin-top: 0.75rem;
    text-align: center;
  }

  .link-full-page {
    font-size: 0.75rem;
    color: var(--color-primary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 700;
  }

  .link-full-page:hover {
    text-decoration: underline;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleUp {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 640px) {
    .modal-backdrop {
      padding: 0.5rem;
    }
    .modal-card {
      padding: 1.25rem 1rem;
    }
    .main-image-wrap {
      height: 200px;
    }
    .purchase-row {
      flex-direction: column;
      gap: 0.75rem;
    }
    .qty-control {
      width: 100%;
      justify-content: space-between;
    }
    .action-buttons {
      flex-direction: column;
      width: 100%;
    }
    .btn-modal-cart, .btn-modal-buy {
      width: 100%;
    }
  }
</style>
