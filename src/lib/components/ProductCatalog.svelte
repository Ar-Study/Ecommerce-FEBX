<script>
  import { categories } from '$lib/data/mockData.js';
  import { base } from '$app/paths';

  let {
    products = [],
    selectedCategory = $bindable('all'),
    searchQuery = $bindable(''),
    onSelectProduct = (prod) => {},
    onAddToCart = (prod) => {}
  } = $props();

  let sortBy = $state('featured');
  let addedItemId = $state(null);

  // Category counts
  function getCategoryCount(catId) {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  }

  // Filter & sort products
  let filteredProducts = $derived.by(() => {
    let list = products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.mentor.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      return [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'sold') {
      return [...list].sort((a, b) => b.soldCount - a.soldCount);
    }
    return list;
  });

  // Active category display name
  let activeCategoryName = $derived(
    categories.find((c) => c.id === selectedCategory)?.name || 'Semua Kategori'
  );

  function handleAdd(p, event) {
    event.stopPropagation();
    onAddToCart(p);
    addedItemId = p.id;
    setTimeout(() => {
      if (addedItemId === p.id) addedItemId = null;
    }, 1400);
  }

  function handleResetFilters() {
    selectedCategory = 'all';
    searchQuery = '';
    sortBy = 'featured';
  }
</script>

<section id="catalog" class="catalog-section">
  <div class="container">
    <!-- Top Header with Title, Live Search & Sort -->
    <div class="catalog-header">
      <div class="header-text-col">
        <div class="eyebrow-container">
          <span class="eyebrow-chip">MARKETPLACE FEB-X</span>
          <span class="stock-status font-mono">{filteredProducts.length} Produk &amp; Jasa Terverifikasi</span>
        </div>
        <h2 class="catalog-title">Katalog Produk &amp; Inovasi Mahasiswa</h2>
        <p class="catalog-desc">
          Seluruh produk dikurasi oleh dekanat dan didampingi langsung oleh dosen pembimbing kewirausahaan.
        </p>
      </div>

      <!-- Controls Toolbar: Quick Search + Sort -->
      <div class="catalog-controls">
        <div class="search-field-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Cari produk, inovasi, atau mentor..."
            bind:value={searchQuery}
            class="search-input"
          />
          {#if searchQuery}
            <button
              type="button"
              class="btn-clear-search"
              onclick={() => searchQuery = ''}
              aria-label="Hapus kata kunci"
            >
              <span class="material-symbols-outlined text-xs">close</span>
            </button>
          {/if}
        </div>

        <div class="sort-field-wrap">
          <span class="material-symbols-outlined sort-icon">tune</span>
          <select class="sort-select font-mono" bind:value={sortBy}>
            <option value="featured">Rekomendasi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="sold">Paling Banyak Terjual</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Category Pills Navigation Strip -->
    <div class="category-strip-wrap">
      <div class="category-pills">
        {#each categories as cat}
          <button
            type="button"
            class="cat-pill {selectedCategory === cat.id ? 'active' : ''}"
            onclick={() => selectedCategory = cat.id}
          >
            <span class="material-symbols-outlined cat-icon">{cat.icon}</span>
            <span class="cat-name">{cat.name}</span>
            <span class="cat-count font-mono">{getCategoryCount(cat.id)}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Active Filter Feedback Banner (if filtered) -->
    {#if selectedCategory !== 'all' || searchQuery.trim() !== ''}
      <div class="filter-status-banner">
        <div class="filter-status-info">
          <span class="material-symbols-outlined text-sm icon-fill text-primary">filter_list</span>
          <span>
            Menampilkan <strong>{filteredProducts.length}</strong> hasil untuk
            {#if selectedCategory !== 'all'}
              kategori <strong>"{activeCategoryName}"</strong>
            {/if}
            {#if selectedCategory !== 'all' && searchQuery.trim()}
              dan
            {/if}
            {#if searchQuery.trim()}
              pencarian <strong>"{searchQuery}"</strong>
            {/if}
          </span>
        </div>
        <button
          type="button"
          class="btn-reset-filter font-mono"
          onclick={handleResetFilters}
        >
          <span class="material-symbols-outlined text-xs">restart_alt</span>
          <span>Reset Filter</span>
        </button>
      </div>
    {/if}

    <!-- Product Grid -->
    {#if filteredProducts.length === 0}
      <div class="empty-state">
        <div class="empty-icon-circle">
          <span class="material-symbols-outlined empty-icon">search_off</span>
        </div>
        <h3 class="empty-title">Tidak Ada Produk yang Cocok</h3>
        <p class="empty-desc">
          Tidak ditemukan produk dengan filter "{searchQuery || activeCategoryName}". Coba kata kunci lain atau reset filter.
        </p>
        <button
          type="button"
          class="btn-reset-empty font-mono"
          onclick={handleResetFilters}
        >
          Tampilkan Semua Produk
        </button>
      </div>
    {:else}
      <div class="products-grid">
        {#each filteredProducts as product (product.id)}
          <div
            class="product-card"
            onclick={() => onSelectProduct(product)}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectProduct(product); }}
            tabindex="0"
            role="button"
          >
            <!-- Image Wrap -->
            <div class="card-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                class="card-img"
                loading="lazy"
              />
              <div class="card-badges">
                {#if product.badge}
                  <span class="badge badge-{product.badgeType}">{product.badge}</span>
                {/if}
              </div>
              <div class="category-chip">
                <span>{product.categoryName}</span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="seller-meta">
                <span class="material-symbols-outlined seller-icon">store</span>
                <span class="seller-name">{product.seller}</span>
                <span class="verified-dot" title="Tenant Terverifikasi Dekanat">
                  <span class="material-symbols-outlined verified-icon">verified</span>
                </span>
              </div>

              <h3 class="product-name">{product.name}</h3>

              <div class="product-mentor font-mono">
                <span class="material-symbols-outlined mentor-icon">school</span>
                <span>Mentor: {product.mentor}</span>
              </div>

              <div class="rating-row">
                <div class="rating-score">
                  <span class="material-symbols-outlined text-xs icon-fill star-icon">star</span>
                  <span class="font-mono font-bold">{product.rating}</span>
                  <span class="review-count">({product.reviewsCount})</span>
                </div>
                <span class="sold-count font-mono">{product.soldCount} terjual</span>
              </div>

              <!-- Price & Actions Footer -->
              <div class="card-footer">
                <div class="price-wrap">
                  <span class="price-val font-mono">{product.formattedPrice}</span>
                  {#if product.priceSuffix}
                    <span class="price-suffix font-mono">{product.priceSuffix}</span>
                  {/if}
                </div>

                <div class="card-actions">
                  <a
                    href="{base}/product/{product.id}"
                    class="btn-detail-link"
                    onclick={(e) => e.stopPropagation()}
                    aria-label="Lihat Detail Lengkap"
                    title="Buka Halaman Khusus Produk"
                  >
                    <span class="material-symbols-outlined text-sm">open_in_new</span>
                  </a>

                  <button
                    type="button"
                    class="btn-cart {addedItemId === product.id ? 'added' : ''}"
                    onclick={(e) => handleAdd(product, e)}
                    aria-label="Tambah ke Keranjang"
                    title="Tambah ke Keranjang"
                  >
                    {#if addedItemId === product.id}
                      <span class="material-symbols-outlined text-sm">check</span>
                    {:else}
                      <span class="material-symbols-outlined text-sm icon-fill">add_shopping_cart</span>
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .catalog-section {
    padding: 2.5rem 0 4rem;
    background-color: var(--color-surface-container-low);
    border-top: 1px solid var(--color-outline-variant);
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .catalog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .header-text-col {
    max-width: 600px;
  }

  .eyebrow-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
    flex-wrap: wrap;
  }

  .eyebrow-chip {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-secondary);
  }

  .stock-status {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    background-color: var(--color-surface-container-high);
    padding: 0.15rem 0.55rem;
    border-radius: var(--radius-xs);
    border: 1px solid var(--color-outline-variant);
  }

  .catalog-title {
    font-size: 1.85rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
    margin-bottom: 0.35rem;
  }

  .catalog-desc {
    font-size: 0.9375rem;
    color: var(--color-on-surface-variant);
    line-height: 1.5;
  }

  /* Controls Toolbar */
  .catalog-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .search-field-wrap {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 260px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    font-size: 18px;
    color: var(--color-outline);
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.55rem 2rem 0.55rem 2.25rem;
    font-size: 0.8125rem;
    font-family: var(--font-sans);
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-full);
    outline: none;
    color: var(--color-on-surface);
    transition: all 0.2s ease;
    box-shadow: var(--shadow-subtle);
  }

  .search-input:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 6, 102, 0.08);
  }

  .btn-clear-search {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sort-field-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .sort-icon {
    position: absolute;
    left: 10px;
    font-size: 16px;
    color: var(--color-outline);
    pointer-events: none;
  }

  .sort-select {
    padding: 0.55rem 1rem 0.55rem 2rem;
    font-size: 0.75rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-full);
    color: var(--color-on-surface);
    cursor: pointer;
    outline: none;
    box-shadow: var(--shadow-subtle);
  }

  .sort-select:focus {
    border-color: var(--color-primary);
  }

  /* Category Strip */
  .category-strip-wrap {
    margin-bottom: 1.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 0.25rem;
  }

  .category-strip-wrap::-webkit-scrollbar {
    display: none;
  }

  .category-pills {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    white-space: nowrap;
  }

  .cat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1.1rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-full);
    color: var(--color-on-surface);
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
    box-shadow: var(--shadow-subtle);
  }

  .cat-pill:hover {
    border-color: var(--color-primary);
    background-color: var(--color-surface-container-low);
    transform: translateY(-1px);
  }

  .cat-pill.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(0, 6, 102, 0.2);
  }

  .cat-icon {
    font-size: 16px;
  }

  .cat-pill.active .cat-icon {
    color: var(--color-secondary-container);
  }

  .cat-count {
    font-size: 0.6875rem;
    opacity: 0.8;
    background: rgba(0, 0, 0, 0.06);
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius-full);
  }

  .cat-pill.active .cat-count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  /* Filter Status Banner */
  .filter-status-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 1rem;
    background-color: var(--color-surface-container-high);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
    font-size: 0.8125rem;
    animation: fadeIn 0.2s ease;
  }

  .filter-status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-on-surface);
  }

  .btn-reset-filter {
    background: none;
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-lowest);
    color: var(--color-primary);
    padding: 0.25rem 0.65rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    transition: all 0.15s ease;
  }

  .btn-reset-filter:hover {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }

  /* Product Grid: 4-3-2-1 columns */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 1200px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
  }

  @media (max-width: 860px) {
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 540px) {
    .products-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  /* Product Card */
  .product-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-ambient);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
    text-align: left;
    height: 100%;
  }

  .product-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card-hover);
    border-color: var(--color-primary-fixed-dim);
  }

  .card-image-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background-color: var(--color-surface-container);
    overflow: hidden;
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
  }

  .product-card:hover .card-img {
    transform: scale(1.04);
  }

  .card-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 0.5rem;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .badge-new {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .badge-popular {
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
  }

  .category-chip {
    position: absolute;
    bottom: 8px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(4px);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-primary);
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  /* Card Body */
  .card-body {
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .seller-meta {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    margin-bottom: 0.35rem;
  }

  .seller-icon {
    font-size: 14px;
    color: var(--color-secondary);
  }

  .seller-name {
    font-weight: 600;
  }

  .verified-icon {
    font-size: 14px;
    color: var(--color-primary);
    vertical-align: middle;
  }

  .product-name {
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--color-on-surface);
    margin-bottom: 0.4rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-mentor {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.6875rem;
    color: var(--color-outline);
    margin-bottom: 0.65rem;
  }

  .mentor-icon {
    font-size: 14px;
    color: var(--color-primary);
  }

  .rating-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: 0.85rem;
    padding-bottom: 0.65rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .rating-score {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--color-on-surface);
  }

  .star-icon {
    color: var(--color-secondary-container);
    font-size: 15px;
  }

  .review-count, .sold-count {
    color: var(--color-outline);
  }

  /* Price & Actions Footer */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    gap: 0.5rem;
  }

  .price-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    overflow: hidden;
  }

  .price-val {
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--color-primary);
    white-space: nowrap;
  }

  .price-suffix {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .btn-detail-link {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .btn-detail-link:hover {
    background-color: var(--color-surface-container-high);
    border-color: var(--color-primary);
  }

  .btn-cart {
    width: 34px;
    height: 34px;
    border-radius: var(--radius-sm);
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-cart:hover {
    background-color: var(--color-primary-container);
    transform: scale(1.05);
  }

  .btn-cart.added {
    background-color: var(--color-success);
    color: white;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3.5rem 1.5rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xl);
    max-width: 560px;
    margin: 2rem auto;
  }

  .empty-icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: var(--color-surface-container-low);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .empty-icon {
    font-size: 32px;
    color: var(--color-outline);
  }

  .empty-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .empty-desc {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .btn-reset-empty {
    padding: 0.65rem 1.25rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-reset-empty:hover {
    background-color: var(--color-primary-container);
  }

  /* Mobile Tweaks */
  @media (max-width: 640px) {
    .catalog-section {
      padding: 1.75rem 0 3rem;
    }
    .catalog-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    .catalog-title {
      font-size: 1.5rem;
    }
    .catalog-controls {
      width: 100%;
      flex-direction: column;
      gap: 0.65rem;
    }
    .search-field-wrap {
      width: 100%;
      min-width: 0;
    }
    .sort-field-wrap {
      width: 100%;
    }
    .sort-select {
      width: 100%;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
