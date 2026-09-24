<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { mockProducts } from '$lib/data/mockData.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  // Svelte 5 state
  let selectedDelivery = $state('locker'); // 'locker' | 'courier'
  let selectedPayment = $state('qris'); // 'qris' | 'mandiri' | 'bni'
  let isProcessing = $state(false);
  let orderSuccess = $state(false);
  let invoiceData = $state(null);

  // Read query params if any
  let paramProductId = $derived($page.url.searchParams.get('productId'));
  let paramQty = $derived(parseInt($page.url.searchParams.get('qty') || '1'));

  // Target item
  let checkoutItem = $derived(
    mockProducts.find((p) => p.id === paramProductId) || mockProducts[0]
  );

  let deliveryCost = $derived(selectedDelivery === 'courier' ? 5000 : 0);
  let adminFee = 1000;
  let subtotal = $derived(checkoutItem.price * paramQty);
  let grandTotal = $derived(subtotal + deliveryCost + adminFee);

  function formatIDR(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  function handleProcessPayment() {
    isProcessing = true;
    setTimeout(() => {
      isProcessing = false;
      orderSuccess = true;
      invoiceData = {
        invoiceNo: 'INV-' + Math.floor(100000 + Math.random() * 900000),
        vaNumber: '89102' + Math.floor(10000000 + Math.random() * 90000000),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        method: selectedPayment.toUpperCase()
      };
    }, 1200);
  }
</script>

<svelte:head>
  <title>Checkout | FEB-X Marketplace</title>
</svelte:head>

<div class="checkout-page">
  <Navbar
    cartCount={1}
    onOpenCart={() => {}}
    onOpenLogin={() => goto('/login')}
    onNavigateSection={() => goto('/')}
  />

  <main class="page-container">
    <!-- Header & Stepper -->
    <div class="checkout-header">
      <h1 class="page-title">Pembayaran &amp; Checkout</h1>
      <div class="stepper-bar font-mono">
        <span class="step done">1. Keranjang</span>
        <span class="step-line"></span>
        <span class="step active">2. Checkout</span>
        <span class="step-line"></span>
        <span class="step {orderSuccess ? 'active' : ''}">3. Pembayaran</span>
        <span class="step-line"></span>
        <span class="step {orderSuccess ? 'done' : ''}">4. Selesai</span>
      </div>
    </div>

    {#if !orderSuccess}
      <div class="checkout-grid">
        <!-- Left: Delivery & Payment Options -->
        <div class="checkout-main-col">
          <!-- Delivery Options -->
          <section class="section-card">
            <h2 class="card-heading">
              <span class="material-symbols-outlined text-primary">local_shipping</span>
              Metode Pengambilan &amp; Pengiriman
            </h2>

            <div class="options-list">
              <label class="option-card {selectedDelivery === 'locker' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="delivery"
                  value="locker"
                  checked={selectedDelivery === 'locker'}
                  onchange={() => selectedDelivery = 'locker'}
                  class="radio-input"
                />
                <div class="option-content">
                  <div class="option-title-row">
                    <span class="option-title">Ambil di Smart Locker FEB-X (Gratis)</span>
                    <span class="option-price font-mono">GRATIS</span>
                  </div>
                  <p class="option-desc">Lobi Lantai 1 Gedung Dekanat FEB. Siap diambil 15 menit setelah konfirmasi.</p>
                </div>
              </label>

              <label class="option-card {selectedDelivery === 'courier' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="delivery"
                  value="courier"
                  checked={selectedDelivery === 'courier'}
                  onchange={() => selectedDelivery = 'courier'}
                  class="radio-input"
                />
                <div class="option-content">
                  <div class="option-title-row">
                    <span class="option-title">Kurir Mahasiswa Antar Gedung</span>
                    <span class="option-price font-mono">+Rp 5.000</span>
                  </div>
                  <p class="option-desc">Diantarkan langsung ke ruang kuliah atau lab kampus oleh kurir magang FEB.</p>
                </div>
              </label>
            </div>
          </section>

          <!-- Payment Options -->
          <section class="section-card">
            <h2 class="card-heading">
              <span class="material-symbols-outlined text-primary">payments</span>
              Metode Pembayaran Kampus
            </h2>

            <div class="options-list">
              <label class="option-card {selectedPayment === 'qris' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="payment"
                  value="qris"
                  checked={selectedPayment === 'qris'}
                  onchange={() => selectedPayment = 'qris'}
                  class="radio-input"
                />
                <div class="option-content">
                  <div class="option-title-row">
                    <span class="option-title">QRIS Instant (Semua Bank &amp; E-Wallet)</span>
                    <span class="badge-rec font-mono">REKOMENDASI</span>
                  </div>
                  <p class="option-desc">Scan langsung via GoPay, OVO, ShopeePay, BCA, Livin Mandiri, atau BSI.</p>
                </div>
              </label>

              <label class="option-card {selectedPayment === 'mandiri' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="payment"
                  value="mandiri"
                  checked={selectedPayment === 'mandiri'}
                  onchange={() => selectedPayment = 'mandiri'}
                  class="radio-input"
                />
                <div class="option-content">
                  <div class="option-title-row">
                    <span class="option-title">Bank Mandiri Virtual Account</span>
                    <span class="option-price font-mono">VA Otomatis</span>
                  </div>
                  <p class="option-desc">Verifikasi otomatis tanpa perlu unggah bukti transfer.</p>
                </div>
              </label>

              <label class="option-card {selectedPayment === 'bni' ? 'selected' : ''}">
                <input
                  type="radio"
                  name="payment"
                  value="bni"
                  checked={selectedPayment === 'bni'}
                  onchange={() => selectedPayment = 'bni'}
                  class="radio-input"
                />
                <div class="option-content">
                  <div class="option-title-row">
                    <span class="option-title">Bank BNI Virtual Account</span>
                    <span class="option-price font-mono">VA Otomatis</span>
                  </div>
                  <p class="option-desc">Terhubung langsung dengan host-to-host sistem keuangan kampus.</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <!-- Right: Order Summary -->
        <div class="checkout-summary-col">
          <div class="section-card summary-card">
            <h2 class="card-heading border-b">Ringkasan Pesanan</h2>

            <!-- Item Row -->
            <div class="summary-item">
              <img src={checkoutItem.image} alt={checkoutItem.name} class="summary-item-img" />
              <div class="summary-item-info">
                <span class="summary-item-name">{checkoutItem.name}</span>
                <span class="summary-item-meta font-mono">{paramQty}x @ {checkoutItem.formattedPrice}</span>
                <span class="summary-item-store font-mono">{checkoutItem.studentOwner}</span>
              </div>
            </div>

            <!-- Calculation breakdown -->
            <div class="breakdown-list font-mono">
              <div class="breakdown-row">
                <span>Subtotal Produk</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div class="breakdown-row">
                <span>Ongkos Kirim Kampus</span>
                <span>{selectedDelivery === 'courier' ? 'Rp 5.000' : 'GRATIS'}</span>
              </div>
              <div class="breakdown-row">
                <span>Biaya Inkubator FEB</span>
                <span>Rp 1.000</span>
              </div>
              <div class="breakdown-total">
                <span>TOTAL PEMBAYARAN</span>
                <span class="total-val">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              class="btn-pay-now font-mono"
              onclick={handleProcessPayment}
              disabled={isProcessing}
            >
              {#if isProcessing}
                <span class="material-symbols-outlined text-sm spin">sync</span>
                <span>Membuat Virtual Account...</span>
              {:else}
                <span class="material-symbols-outlined text-sm">lock</span>
                <span>BAYAR SEKARANG ({formatIDR(grandTotal)})</span>
              {/if}
            </button>

            <p class="secure-hint font-mono">
              <span class="material-symbols-outlined text-xs">verified_user</span>
              Transaksi diamankan oleh Gateway FinTech FEB-X
            </p>
          </div>
        </div>
      </div>
    {:else}
      <!-- Success / Payment Instruction Card -->
      <div class="invoice-container">
        <div class="invoice-box">
          <div class="invoice-badge">
            <span class="material-symbols-outlined text-xl">qr_code_scanner</span>
            <span>TAGIHAN PEMBAYARAN DIHASILKAN</span>
          </div>

          <h2 class="invoice-num font-mono">{invoiceData.invoiceNo}</h2>
          <p class="invoice-inst">Selesaikan pembayaran sebelum batas waktu berakhir (23:59 WIB hari ini).</p>

          <div class="invoice-details font-mono">
            <div class="inv-row">
              <span>Total Tagihan:</span>
              <span class="inv-amount">{formatIDR(grandTotal)}</span>
            </div>
            <div class="inv-row">
              <span>Metode:</span>
              <span>{invoiceData.method}</span>
            </div>
            {#if selectedPayment !== 'qris'}
              <div class="inv-row va-box">
                <span>Nomor Virtual Account:</span>
                <span class="va-num">{invoiceData.vaNumber}</span>
              </div>
            {:else}
              <div class="qris-box">
                <span class="material-symbols-outlined text-6xl text-primary">qr_code_2</span>
                <span class="text-xs">Scan QRIS melalui aplikasi M-Banking Anda</span>
              </div>
            {/if}
          </div>

          <div class="invoice-actions">
            <button
              type="button"
              class="btn-back-market"
              onclick={() => goto('/')}
            >
              Kembali ke Marketplace
            </button>
            <button
              type="button"
              class="btn-dash"
              onclick={() => goto('/dashboard')}
            >
              Lihat di Dashboard
            </button>
          </div>
        </div>
      </div>
    {/if}
  </main>

  <Footer />
</div>

<style>
  .checkout-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
  }

  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    width: 100%;
    flex: 1;
  }

  .checkout-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .stepper-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .step.active {
    color: var(--color-primary);
    font-weight: 700;
  }

  .step.done {
    color: var(--color-success);
  }

  .step-line {
    width: 24px;
    height: 1px;
    background-color: var(--color-outline-variant);
  }

  .checkout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  @media (min-width: 960px) {
    .checkout-grid {
      grid-template-columns: 7fr 5fr;
    }
  }

  .checkout-main-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .section-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-ambient);
  }

  .card-heading {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .border-b {
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-card {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem;
    border: 1.5px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .option-card:hover {
    border-color: var(--color-primary-fixed-dim);
  }

  .option-card.selected {
    border-color: var(--color-primary);
    background-color: var(--color-surface-bright);
    box-shadow: 0 2px 8px rgba(0, 6, 102, 0.06);
  }

  .radio-input {
    margin-top: 0.25rem;
    accent-color: var(--color-primary);
  }

  .option-content {
    flex: 1;
  }

  .option-title-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.25rem;
  }

  .option-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .option-price {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .badge-rec {
    font-size: 0.625rem;
    font-weight: 700;
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
  }

  .option-desc {
    font-size: 0.75rem;
    color: var(--color-outline);
    line-height: 1.4;
  }

  /* Summary */
  .summary-item {
    display: flex;
    gap: 0.875rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .summary-item-img {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-sm);
    object-fit: cover;
  }

  .summary-item-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .summary-item-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .summary-item-meta {
    font-size: 0.75rem;
    color: var(--color-secondary);
    font-weight: 600;
  }

  .summary-item-store {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.8125rem;
    margin-bottom: 1.5rem;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    color: var(--color-on-surface-variant);
  }

  .breakdown-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    border-top: 2px solid var(--color-outline-variant);
    font-weight: 800;
    color: var(--color-primary);
  }

  .total-val {
    font-size: 1.25rem;
  }

  .btn-pay-now {
    width: 100%;
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.875rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-pay-now:hover:not(:disabled) {
    background-color: var(--color-primary-container);
    box-shadow: var(--shadow-ambient);
  }

  .btn-pay-now:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .secure-hint {
    font-size: 0.6875rem;
    color: var(--color-outline);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-top: 0.75rem;
  }

  /* Invoice */
  .invoice-container {
    max-width: 560px;
    margin: 2rem auto;
  }

  .invoice-box {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xl);
    padding: 2rem;
    text-align: center;
    box-shadow: var(--shadow-modal);
  }

  .invoice-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-full);
    margin-bottom: 1rem;
  }

  .invoice-num {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .invoice-inst {
    font-size: 0.8125rem;
    color: var(--color-outline);
    margin-bottom: 1.5rem;
  }

  .invoice-details {
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-md);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: 0.8125rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .inv-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .inv-amount {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .va-box {
    border-top: 1px dashed var(--color-outline-variant);
    padding-top: 0.5rem;
  }

  .va-num {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--color-secondary);
    letter-spacing: 0.05em;
  }

  .qris-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
  }

  .invoice-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-back-market, .btn-dash {
    flex: 1;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-back-market {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface);
  }

  .btn-dash {
    background-color: var(--color-primary);
    color: white;
    border: none;
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
      padding: 1rem 1rem 3rem;
    }
    .stepper-bar {
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 0.5rem;
      scrollbar-width: none;
    }
    .stepper-bar::-webkit-scrollbar {
      display: none;
    }
    .section-card {
      padding: 1rem;
    }
    .invoice-actions {
      flex-direction: column;
    }
  }
</style>
