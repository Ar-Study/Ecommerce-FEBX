<script>
  let {
    isOpen = false,
    cartItems = [],
    onClose = () => {},
    onUpdateQuantity = (id, delta) => {},
    onRemoveItem = (id) => {},
    onClearCart = () => {}
  } = $props();

  let pickupMethod = $state('pickup'); // 'pickup' | 'delivery'
  let paymentMethod = $state('qris'); // 'qris' | 'mandiri' | 'bni'
  let checkoutSuccess = $state(false);
  let invoiceData = $state(null);

  // Computations
  let subtotal = $derived(
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  let shippingCost = $derived(pickupMethod === 'delivery' ? 5000 : 0);
  let serviceFee = $derived(cartItems.length > 0 ? 1000 : 0);
  let grandTotal = $derived(subtotal + shippingCost + serviceFee);

  function formatIDR(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function handleProcessCheckout() {
    invoiceData = {
      invoiceId: 'INV-FEB-' + Math.floor(100000 + Math.random() * 900000),
      total: grandTotal,
      method: paymentMethod.toUpperCase(),
      vaNumber: '89102' + Math.floor(100000000 + Math.random() * 900000000),
      pickup: pickupMethod === 'pickup' ? 'Ambil di Loker Mandiri FEB Lt. 1' : 'Pengiriman Antar Ruang FEB',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };
    checkoutSuccess = true;
  }

  function handleFinishCheckout() {
    checkoutSuccess = false;
    invoiceData = null;
    onClearCart();
    onClose();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <div
    class="drawer-backdrop"
    onclick={onClose}
    onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
    role="dialog"
    aria-modal="true"
    aria-label="Keranjang Belanja"
    tabindex="-1"
  >
    <div
      class="drawer-panel"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-title-wrap">
          <span class="material-symbols-outlined header-icon">shopping_bag</span>
          <div>
            <h3 class="drawer-title">Keranjang Belanja</h3>
            <span class="items-count font-mono">{cartItems.length} Produk Mahasiswa</span>
          </div>
        </div>
        <button
          type="button"
          class="close-btn"
          onclick={onClose}
          aria-label="Tutup Keranjang"
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      {#if checkoutSuccess && invoiceData}
        <!-- Invoice / Checkout Success Screen -->
        <div class="invoice-container">
          <div class="invoice-card">
            <div class="success-badge">
              <span class="material-symbols-outlined icon-fill">task_alt</span>
            </div>
            <h4 class="invoice-title">Invoice Transaksi FEB-X</h4>
            <p class="invoice-sub">Pesanan telah diteruskan ke seller mahasiswa dan tercatat di sistem fakultas.</p>

            <div class="invoice-meta font-mono">
              <div class="meta-item">
                <span class="meta-label">Nomor Invoice</span>
                <span class="meta-val font-bold text-primary">{invoiceData.invoiceId}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Waktu Transaksi</span>
                <span class="meta-val">{invoiceData.createdAt}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Metode Pembayaran</span>
                <span class="meta-val">{invoiceData.method}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Lokasi Penyerahan</span>
                <span class="meta-val">{invoiceData.pickup}</span>
              </div>
              <div class="meta-item total-row">
                <span class="meta-label">Total Tagihan</span>
                <span class="meta-val total-price">{formatIDR(invoiceData.total)}</span>
              </div>
            </div>

            <!-- Virtual Account / QRIS Mock Display -->
            <div class="payment-mock-box">
              {#if invoiceData.method === 'QRIS'}
                <span class="material-symbols-outlined qris-icon">qr_code_2</span>
                <span class="qris-hint">Scan QRIS Nasional FEB-X via Bank/E-Wallet</span>
              {:else}
                <span class="va-label">Nomor Virtual Account {invoiceData.method}</span>
                <span class="va-num font-mono">{invoiceData.vaNumber}</span>
                <span class="va-hint">Berlaku selama 2 jam. Otomatis terverifikasi.</span>
              {/if}
            </div>

            <button
              type="button"
              class="btn-done"
              onclick={handleFinishCheckout}
            >
              Selesai &amp; Belanja Lagi
            </button>
          </div>
        </div>
      {:else if cartItems.length === 0}
        <!-- Empty Cart -->
        <div class="empty-cart">
          <span class="material-symbols-outlined empty-icon">shopping_cart</span>
          <h4 class="empty-title">Keranjang Anda Kosong</h4>
          <p class="empty-desc">Jelajahi produk dan dukung bisnis teman-teman mahasiswa sekarang!</p>
          <button
            type="button"
            class="btn-shop-now"
            onclick={onClose}
          >
            Mulai Belanja
          </button>
        </div>
      {:else}
        <!-- Cart Items List -->
        <div class="drawer-body">
          <div class="items-list">
            {#each cartItems as item (item.id)}
              <div class="cart-item">
                <img src={item.image} alt={item.name} class="item-img" />
                <div class="item-info">
                  <span class="item-seller">{item.seller}</span>
                  <h4 class="item-name">{item.name}</h4>
                  <span class="item-price font-mono">{formatIDR(item.price)}</span>

                  <div class="item-actions">
                    <div class="item-qty font-mono">
                      <button
                        type="button"
                        class="qty-mini-btn"
                        onclick={() => onUpdateQuantity(item.id, -1)}
                        aria-label="Kurang"
                      >
                        -
                      </button>
                      <span class="qty-mini-num">{item.quantity}</span>
                      <button
                        type="button"
                        class="qty-mini-btn"
                        onclick={() => onUpdateQuantity(item.id, 1)}
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      class="btn-remove"
                      onclick={() => onRemoveItem(item.id)}
                      aria-label="Hapus dari keranjang"
                    >
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <!-- Pickup / Shipping Selection -->
          <div class="options-section">
            <h5 class="options-title">Pengambilan &amp; Pengiriman</h5>
            <div class="radio-options">
              <label class="radio-card {pickupMethod === 'pickup' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="pickup"
                  value="pickup"
                  bind:group={pickupMethod}
                />
                <div class="radio-body">
                  <span class="radio-label">Ambil di Loker FEB (Gedung Barat / Timur)</span>
                  <span class="radio-sub">Bebas Ongkir • Siap diambil dalam 2 jam</span>
                </div>
                <span class="free-tag font-mono">GRATIS</span>
              </label>

              <label class="radio-card {pickupMethod === 'delivery' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="pickup"
                  value="delivery"
                  bind:group={pickupMethod}
                />
                <div class="radio-body">
                  <span class="radio-label">Kurir Mahasiswa Antar Gedung Kampus</span>
                  <span class="radio-sub">Diantar ke kelas / lab / selasar fakultas</span>
                </div>
                <span class="fee-tag font-mono">Rp 5.000</span>
              </label>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="options-section">
            <h5 class="options-title">Metode Pembayaran</h5>
            <div class="payment-pills">
              <button
                type="button"
                class="pay-pill {paymentMethod === 'qris' ? 'selected' : ''}"
                onclick={() => paymentMethod = 'qris'}
              >
                <span class="material-symbols-outlined text-sm">qr_code_2</span>
                <span>QRIS Instant</span>
              </button>
              <button
                type="button"
                class="pay-pill {paymentMethod === 'mandiri' ? 'selected' : ''}"
                onclick={() => paymentMethod = 'mandiri'}
              >
                <span class="material-symbols-outlined text-sm">account_balance</span>
                <span>Mandiri VA</span>
              </button>
              <button
                type="button"
                class="pay-pill {paymentMethod === 'bni' ? 'selected' : ''}"
                onclick={() => paymentMethod = 'bni'}
              >
                <span class="material-symbols-outlined text-sm">payments</span>
                <span>BNI VA</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout Summary -->
        <div class="drawer-footer">
          <div class="summary-breakdown">
            <div class="summary-line">
              <span>Subtotal Produk</span>
              <span class="font-mono">{formatIDR(subtotal)}</span>
            </div>
            {#if shippingCost > 0}
              <div class="summary-line">
                <span>Ongkos Kirim Kampus</span>
                <span class="font-mono">{formatIDR(shippingCost)}</span>
              </div>
            {/if}
            <div class="summary-line">
              <span>Layanan Inkubator FEB</span>
              <span class="font-mono">{formatIDR(serviceFee)}</span>
            </div>
            <div class="summary-line total-line">
              <span class="font-bold">Total Pembayaran</span>
              <span class="font-mono grand-price">{formatIDR(grandTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            class="btn-checkout"
            onclick={handleProcessCheckout}
          >
            <span>Bayar Sekarang ({formatIDR(grandTotal)})</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .drawer-backdrop {
    position: fixed;
    inset: 0;
    z-index: 95;
    background-color: rgba(0, 6, 102, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: flex-end;
    animation: fadeIn 0.2s ease;
  }

  .drawer-panel {
    background-color: var(--color-surface-container-lowest);
    width: 100%;
    max-width: 480px;
    height: 100%;
    box-shadow: var(--shadow-drawer);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.25s ease;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-bright);
  }

  .header-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-icon {
    font-size: 26px;
    color: var(--color-primary);
  }

  .drawer-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .items-count {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
    padding: 0.25rem;
  }

  .close-btn:hover {
    color: var(--color-on-surface);
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  /* Items List */
  .items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cart-item {
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .item-img {
    width: 72px;
    height: 72px;
    border-radius: var(--radius-sm);
    object-fit: cover;
    background-color: var(--color-surface-container);
    border: 1px solid var(--color-outline-variant);
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item-seller {
    font-size: 0.6875rem;
    color: var(--color-secondary);
    font-weight: 600;
  }

  .item-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-on-surface);
    margin: 0.15rem 0 0.35rem;
  }

  .item-price {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .item-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .item-qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xs);
    overflow: hidden;
  }

  .qty-mini-btn {
    background: var(--color-surface-container-low);
    border: none;
    width: 26px;
    height: 26px;
    cursor: pointer;
    font-weight: bold;
    color: var(--color-on-surface);
  }

  .qty-mini-num {
    padding: 0 0.5rem;
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .btn-remove {
    background: none;
    border: none;
    color: var(--color-outline);
    cursor: pointer;
    padding: 0.25rem;
  }

  .btn-remove:hover {
    color: var(--color-error);
  }

  /* Options Sections */
  .options-section {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .options-title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-surface);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .radio-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .radio-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .radio-card.selected {
    border-color: var(--color-primary);
    background-color: var(--color-primary-fixed);
  }

  .radio-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .radio-label {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-on-surface);
  }

  .radio-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .free-tag {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-success);
    background-color: var(--color-success-container);
    padding: 0.125rem 0.35rem;
    border-radius: var(--radius-xs);
  }

  .fee-tag {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  /* Payment Pills */
  .payment-pills {
    display: flex;
    gap: 0.5rem;
  }

  .pay-pill {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-low);
    color: var(--color-on-surface);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pay-pill.selected {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
  }

  /* Drawer Footer */
  .drawer-footer {
    padding: 1.25rem 1.5rem;
    background-color: var(--color-surface-bright);
    border-top: 1px solid var(--color-outline-variant);
  }

  .summary-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant);
  }

  .total-line {
    padding-top: 0.5rem;
    border-top: 1px dashed var(--color-outline-variant);
    font-size: 0.9375rem;
    color: var(--color-on-surface);
  }

  .grand-price {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .btn-checkout {
    width: 100%;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    padding: 0.875rem;
    border-radius: var(--radius-sm);
    font-size: 0.9375rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-checkout:hover {
    background-color: var(--color-primary-container);
    box-shadow: var(--shadow-ambient);
  }

  /* Empty Cart */
  .empty-cart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }

  .empty-icon {
    font-size: 64px;
    color: var(--color-outline-variant);
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.35rem;
  }

  .empty-desc {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant);
    max-width: 260px;
    margin-bottom: 1.5rem;
  }

  .btn-shop-now {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
  }

  /* Invoice Modal Screen */
  .invoice-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .invoice-card {
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    text-align: center;
  }

  .success-badge {
    width: 48px;
    height: 48px;
    background-color: var(--color-success-container);
    color: var(--color-success);
    border-radius: var(--radius-full);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 0.75rem;
  }

  .invoice-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .invoice-sub {
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
    margin: 0.25rem 0 1.25rem;
  }

  .invoice-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: var(--color-surface-bright);
    padding: 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-outline-variant);
    text-align: left;
    margin-bottom: 1.25rem;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
  }

  .meta-label {
    color: var(--color-outline);
  }

  .meta-val {
    color: var(--color-on-surface);
  }

  .total-row {
    border-top: 1px dashed var(--color-outline-variant);
    padding-top: 0.5rem;
    margin-top: 0.25rem;
  }

  .total-price {
    font-size: 0.9375rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .payment-mock-box {
    background-color: var(--color-surface-bright);
    border: 1px dashed var(--color-primary);
    border-radius: var(--radius-sm);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 1.5rem;
  }

  .qris-icon {
    font-size: 80px;
    color: var(--color-primary);
  }

  .qris-hint {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .va-label {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .va-num {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: 0.08em;
  }

  .va-hint {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .btn-done {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 700;
    cursor: pointer;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @media (max-width: 480px) {
    .drawer-panel {
      max-width: 100%;
    }
    .drawer-header {
      padding: 1rem;
    }
    .drawer-body {
      padding: 1rem;
    }
    .drawer-footer {
      padding: 1rem;
    }
    .payment-pills {
      flex-direction: column;
      gap: 0.35rem;
    }
  }
</style>
