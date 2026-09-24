<script>
  import {
    sellerOrders as initialOrders,
    sellerWeeklyRevenue,
    sellerInventory as initialInventory,
    sellerLedger as initialLedger
  } from '$lib/data/mockData.js';

  let {
    onShowToast = (msg) => {},
    isAddProductOpen = $bindable(false),
    activeTab = $bindable('summary')
  } = $props();

  // Reactive state data
  let orders = $state([...initialOrders]);
  let inventory = $state([...initialInventory]);
  let ledger = $state([...initialLedger]);

  // General helpers
  function formatIDR(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  }

  // --- STATE FOR SUMMARY TAB ---
  let hoveredDay = $state(null);
  let chartFilter = $state('7days');
  let isBoothOpen = $state(true);

  // --- STATE FOR ORDERS TAB ---
  let orderStatusFilter = $state('all');
  let orderSearchQuery = $state('');
  let orderPickupFilter = $state('all');
  let selectedOrderModal = $state(null);

  // Filtered orders derivation
  let filteredOrders = $derived(
    orders.filter((o) => {
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchPickup =
        orderPickupFilter === 'all' ||
        (orderPickupFilter === 'loker' && o.pickupMethod.includes('Loker')) ||
        (orderPickupFilter === 'booth' && o.pickupMethod.includes('Booth')) ||
        (orderPickupFilter === 'digital' && o.pickupMethod.includes('Digital'));
      const q = orderSearchQuery.toLowerCase();
      const matchSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.item.toLowerCase().includes(q) ||
        (o.nim && o.nim.toLowerCase().includes(q));
      return matchStatus && matchPickup && matchSearch;
    })
  );

  // Order Counts
  let orderCounts = $derived({
    all: orders.length,
    perluDikirim: orders.filter((o) => o.status === 'Perlu Dikirim').length,
    dikirim: orders.filter((o) => o.status === 'Dikirim').length,
    selesai: orders.filter((o) => o.status === 'Selesai').length,
    dibatalkan: orders.filter((o) => o.status === 'Dibatalkan').length
  });

  // Advance Order Status
  function updateOrderStatus(orderId, newStatus) {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    target.status = newStatus;
    orders = [...orders];

    if (newStatus === 'Dikirim') {
      onShowToast(`Pesanan ${orderId} siap di ${target.pickupMethod}. Notifikasi dikirim ke pembeli.`);
    } else if (newStatus === 'Selesai') {
      onShowToast(`Pesanan ${orderId} telah diselesaikan. Dana diteruskan ke saldo toko.`);
    } else {
      onShowToast(`Status pesanan ${orderId} diubah menjadi "${newStatus}".`);
    }

    if (selectedOrderModal && selectedOrderModal.id === orderId) {
      selectedOrderModal.status = newStatus;
    }
  }

  // --- STATE FOR REVENUE TAB ---
  let currentBalance = $state(4850000);
  let isWithdrawModalOpen = $state(false);
  let withdrawAmountInput = $state('1000000');
  let withdrawBankSelect = $state('Mandiri Kampus (137-00-1928374-1)');
  let ledgerFilter = $state('all');
  let ledgerSearchQuery = $state('');

  let filteredLedger = $derived(
    ledger.filter((l) => {
      const matchType = ledgerFilter === 'all' || l.type === ledgerFilter;
      const q = ledgerSearchQuery.toLowerCase();
      const matchSearch = !q || l.id.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q);
      return matchType && matchSearch;
    })
  );

  function handleWithdrawSubmit(e) {
    e.preventDefault();
    const amount = parseInt(String(withdrawAmountInput).replace(/\D/g, '')) || 0;
    if (amount <= 0) {
      alert('Masukkan nominal penarikan yang valid.');
      return;
    }
    if (amount > currentBalance) {
      alert(`Nominal penarikan melebihi saldo tersedia (${formatIDR(currentBalance)}).`);
      return;
    }

    currentBalance -= amount;
    const newTxId = 'TRX-' + Math.floor(1000 + Math.random() * 9000);
    ledger.unshift({
      id: newTxId,
      date: 'Hari ini, Baru Saja',
      desc: `Penarikan Saldo ke ${withdrawBankSelect}`,
      type: 'payout',
      amount: amount,
      formattedAmount: `-${formatIDR(amount)}`,
      status: 'Diproses',
      method: 'Transfer Bank SSO'
    });
    ledger = [...ledger];

    onShowToast(`✓ Penarikan ${formatIDR(amount)} berhasil diajukan ke bendahara fakultas!`);
    isWithdrawModalOpen = false;
  }

  // --- STATE FOR INVENTORY TAB ---
  let inventorySearch = $state('');
  let inventoryCategoryFilter = $state('all');
  let inventoryStatusFilter = $state('all');
  let editingItem = $state(null);

  let filteredInventory = $derived(
    inventory.filter((item) => {
      const matchCat = inventoryCategoryFilter === 'all' || item.category === inventoryCategoryFilter;
      const matchStat = inventoryStatusFilter === 'all' || item.status === inventoryStatusFilter;
      const q = inventorySearch.toLowerCase();
      const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      return matchCat && matchStat && matchSearch;
    })
  );

  let inventorySummary = $derived({
    totalSKU: inventory.length,
    totalStock: inventory.reduce((acc, cur) => acc + (cur.stock || 0), 0),
    lowStockCount: inventory.filter((i) => i.stock < 10).length,
    totalAssetValue: inventory.reduce((acc, cur) => acc + (cur.stock || 0) * (cur.price || 0), 0)
  });

  function adjustStock(itemId, delta) {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    item.stock = Math.max(0, item.stock + delta);
    item.status = item.stock <= 0 ? 'Habis' : item.stock < 10 ? 'Stok Menipis' : 'Aman';
    inventory = [...inventory];
    onShowToast(`Stok "${item.name}" diperbarui: ${item.stock} item`);
  }

  function handleSaveEditItem(e) {
    e.preventDefault();
    if (!editingItem) return;
    const target = inventory.find((i) => i.id === editingItem.id);
    if (target) {
      target.price = Number(editingItem.price);
      target.formattedPrice = formatIDR(target.price);
      target.stock = Number(editingItem.stock);
      target.status = target.stock <= 0 ? 'Habis' : target.stock < 10 ? 'Stok Menipis' : 'Aman';
      if (editingItem.hpp) target.hpp = Number(editingItem.hpp);
      if (editingItem.location) target.location = editingItem.location;
      inventory = [...inventory];
      onShowToast(`✓ Data produk "${target.name}" berhasil diperbarui!`);
    }
    editingItem = null;
  }

  function handleDeleteItem(itemId, itemName) {
    if (confirm(`Yakin ingin menghapus produk "${itemName}" dari etalase toko?`)) {
      inventory = inventory.filter((i) => i.id !== itemId);
      onShowToast(`Produk "${itemName}" telah dihapus.`);
    }
  }

  // --- STATE FOR BUSINESS PROFILE TAB ---
  let bizName = $state('Koperasi FEB Store (Unit Usaha Mahasiswa)');
  let bizTagline = $state('Penyedia perlengkapan akademik, merchandise resmi, dan camilan sehat civitas FEB UGM.');
  let bizWhatsapp = $state('+62 812-3456-7890');
  let bizHours = $state('Senin – Jumat, 08:00 – 16:30 WIB');
  let bizLocation = $state('Selasar Timur Gedung Pertamina Tower FEB Lantai 1 - Booth #04');
  let isEditingBiz = $state(false);

  function handleSaveBizProfile(e) {
    e.preventDefault();
    isEditingBiz = false;
    onShowToast('✓ Profil stan & unit usaha mahasiswa berhasil diperbarui!');
  }

  // --- ADD PRODUCT MODAL STATE ---
  let newProductName = $state('');
  let newProductCategory = $state('Merchandise');
  let newProductPrice = $state('');
  let newProductHpp = $state('');
  let newProductStock = $state(15);
  let newProductLocation = $state('Booth Selasar #04');
  let newProductDesc = $state('');

  function handleAddProduct(e) {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newSku = 'PRD-' + Math.floor(100 + Math.random() * 900);
    const priceNum = parseInt(String(newProductPrice).replace(/\D/g, '')) || 50000;
    const hppNum = parseInt(String(newProductHpp).replace(/\D/g, '')) || Math.round(priceNum * 0.6);

    inventory.unshift({
      id: newSku,
      name: newProductName,
      sku: newSku,
      category: newProductCategory,
      price: priceNum,
      hpp: hppNum,
      formattedPrice: formatIDR(priceNum),
      stock: Number(newProductStock),
      status: newProductStock < 10 ? 'Stok Menipis' : 'Aman',
      location: newProductLocation
    });
    inventory = [...inventory];

    onShowToast(`✓ Produk baru "${newProductName}" berhasil didaftarkan ke etalase!`);

    // Reset
    newProductName = '';
    newProductPrice = '';
    newProductHpp = '';
    newProductStock = 15;
    newProductDesc = '';
    isAddProductOpen = false;
  }
</script>

<div class="seller-view">
  <!-- TAB 1: RINGKASAN BISNIS (SUMMARY) -->
  {#if activeTab === 'summary'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Ringkasan Bisnis Mahasiswa</h1>
        <p class="view-sub">Kelola performa penjualan toko, inventaris stok, dan arus kas harian kampus.</p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-booth-status {isBoothOpen ? 'booth-open' : 'booth-closed'}"
          onclick={() => {
            isBoothOpen = !isBoothOpen;
            onShowToast(`Status Stan Selasar FEB: ${isBoothOpen ? 'BUKA (Melayani Pembeli)' : 'TUTUP'}`);
          }}
          title="Klik untuk mengubah status operasional stan fisik"
        >
          <span class="status-dot"></span>
          <span>{isBoothOpen ? 'Stan Selasar Buka' : 'Stan Sedang Tutup'}</span>
        </button>

        <button
          type="button"
          class="btn-primary-action font-button"
          onclick={() => isAddProductOpen = true}
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>Tambah Produk</span>
        </button>
      </div>
    </div>

    <!-- Campus Facility Banner -->
    <div class="facility-strip">
      <div class="facility-item">
        <span class="material-symbols-outlined text-primary">storefront</span>
        <div>
          <span class="fac-label">Lokasi Booth Fisik</span>
          <span class="fac-val font-mono">{bizLocation}</span>
        </div>
      </div>
      <div class="facility-item">
        <span class="material-symbols-outlined text-secondary">lock</span>
        <div>
          <span class="fac-label">Loker Pintar Terkoneksi</span>
          <span class="fac-val font-mono">Loker #10, #11, #12 (Otomatis PIN)</span>
        </div>
      </div>
      <div class="facility-item">
        <span class="material-symbols-outlined text-success">schedule</span>
        <div>
          <span class="fac-label">Jam Operasional Hari Ini</span>
          <span class="fac-val font-mono">{bizHours}</span>
        </div>
      </div>
    </div>

    <!-- Bento KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">PENDAPATAN HARI INI</span>
          <div class="kpi-icon-wrap bg-primary-fixed">
            <span class="material-symbols-outlined text-primary">payments</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">Rp 1.250.000</h3>
          <p class="kpi-growth">
            <span class="material-symbols-outlined text-xs">arrow_upward</span>
            <span>+12.5% vs kemarin</span>
          </p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">PESANAN BARU</span>
          <div class="kpi-icon-wrap bg-secondary-fixed">
            <span class="material-symbols-outlined text-secondary">shopping_bag</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">{orderCounts.perluDikirim}</h3>
          <p class="kpi-note font-mono">{orderCounts.perluDikirim} Menunggu Pengiriman</p>
        </div>
      </div>

      <div class="kpi-card kpi-card-gold-border">
        <div class="kpi-top">
          <span class="kpi-label font-mono">KONVERSI TOKO</span>
          <div class="kpi-icon-wrap bg-secondary-container">
            <span class="material-symbols-outlined text-on-secondary-container">analytics</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">4.8%</h3>
          <p class="kpi-growth">
            <span class="material-symbols-outlined text-xs">verified</span>
            <span>Kinerja Sangat Baik</span>
          </p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">PENGUNJUNG KAMPUS</span>
          <div class="kpi-icon-wrap bg-primary-fixed">
            <span class="material-symbols-outlined text-primary">group</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">842</h3>
          <p class="kpi-note">Hari ini di selasar FEB</p>
        </div>
      </div>
    </div>

    <!-- Chart & Recent Orders Row -->
    <div class="middle-grid">
      <!-- Revenue Chart Card -->
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <h2 class="section-card-title">Grafik Pendapatan Mingguan</h2>
            <span class="chart-sub font-mono">Target Inkubasi: Rp 1.000.000/hari</span>
          </div>
          <select class="time-select font-mono" bind:value={chartFilter}>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">Bulan Ini</option>
          </select>
        </div>

        <div class="bars-container">
          <div class="y-labels font-mono">
            <span>1.5M</span>
            <span>1.0M</span>
            <span>0.5M</span>
            <span>0</span>
          </div>

          <div class="bars-plot">
            <div class="grid-line line-75"></div>
            <div class="grid-line line-50"></div>
            <div class="grid-line line-25"></div>

            {#each sellerWeeklyRevenue as b}
              <div
                class="bar-column"
                role="presentation"
                onmouseenter={() => (hoveredDay = b.day)}
                onmouseleave={() => (hoveredDay = null)}
              >
                <div
                  class="bar-fill {b.isPeak ? 'bar-peak' : ''}"
                  style="height: {b.height};"
                ></div>
                <span class="day-label font-mono">{b.day}</span>

                {#if hoveredDay === b.day}
                  <div class="chart-tooltip font-mono">
                    <span>{formatIDR(b.amount)}</span>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Recent Orders Card with Quick Action -->
      <div class="orders-card">
        <div class="orders-header">
          <div>
            <h2 class="section-card-title">Pesanan Terbaru</h2>
            <span class="orders-hint font-mono">Klik status untuk update cepat</span>
          </div>
          <button
            type="button"
            class="btn-text-link font-mono"
            onclick={() => activeTab = 'orders'}
          >
            Lihat Semua ({orders.length}) →
          </button>
        </div>

        <div class="orders-list">
          {#each orders.slice(0, 4) as order (order.id)}
            <div class="order-item">
              <div class="order-left">
                <div class="order-icon-box">
                  <span class="material-symbols-outlined text-sm">shopping_bag</span>
                </div>
                <div>
                  <span class="order-id font-mono font-bold">{order.id}</span>
                  <p class="order-item-desc">{order.item}</p>
                  <span class="order-cust font-mono">{order.customer} • {order.time}</span>
                </div>
              </div>

              <div class="order-right">
                <span class="order-price font-mono">{order.formattedTotal}</span>
                <button
                  type="button"
                  class="status-badge status-{order.status.replace(/\s+/g, '-').toLowerCase()} font-mono"
                  onclick={() => {
                    if (order.status === 'Perlu Dikirim') updateOrderStatus(order.id, 'Dikirim');
                    else if (order.status === 'Dikirim') updateOrderStatus(order.id, 'Selesai');
                    else updateOrderStatus(order.id, 'Perlu Dikirim');
                  }}
                  title="Klik untuk mengubah status pesanan"
                >
                  {order.status}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Summary Bottom: Stock Alert & Incubation Status -->
    <div class="summary-bottom-grid">
      <!-- Low Stock Alerts -->
      <div class="card-box">
        <div class="card-box-header">
          <div class="flex-row items-center gap-2">
            <span class="material-symbols-outlined text-secondary">warning</span>
            <h3 class="box-title">Peringatan Stok Menipis</h3>
          </div>
          <button
            type="button"
            class="btn-text-link font-mono"
            onclick={() => activeTab = 'inventory'}
          >
            Kelola Stok →
          </button>
        </div>

        <div class="stock-alert-list">
          {#each inventory.filter((i) => i.stock < 10) as item}
            <div class="stock-alert-item">
              <div>
                <span class="stock-alert-name font-bold">{item.name}</span>
                <span class="stock-alert-loc font-mono text-xs text-outline">{item.location}</span>
              </div>
              <div class="flex-row items-center gap-2">
                <span class="stock-qty-chip font-mono {item.stock <= 0 ? 'chip-empty' : 'chip-warning'}">
                  Sisa: {item.stock}
                </span>
                <button
                  type="button"
                  class="btn-quick-restock font-mono"
                  onclick={() => adjustStock(item.id, 10)}
                >
                  +10 Restock
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Incubation Progress Checklist -->
      <div class="card-box">
        <div class="card-box-header">
          <div class="flex-row items-center gap-2">
            <span class="material-symbols-outlined text-primary">school</span>
            <h3 class="box-title">Milestone Inkubasi SKS FEB</h3>
          </div>
          <span class="incubation-pill font-mono">Dosen: Dr. Sri Rahayu</span>
        </div>

        <div class="milestone-track font-mono">
          <div class="milestone-step done">
            <span class="step-check">✓</span>
            <div>
              <span class="step-title">Tahap 1: Idea Pitching &amp; Validasi BMC</span>
              <span class="step-sub">Lolos seleksi inkubator fakultas (Nilai: 92)</span>
            </div>
          </div>
          <div class="milestone-step done">
            <span class="step-check">✓</span>
            <div>
              <span class="step-title">Tahap 2: Prototype &amp; Display Stan Kampus</span>
              <span class="step-sub">Booth #04 Selasar FEB aktif dan operasional</span>
            </div>
          </div>
          <div class="milestone-step current">
            <span class="step-check">●</span>
            <div>
              <span class="step-title">Tahap 3: Traksi Penjualan &amp; Cashflow</span>
              <span class="step-sub">Target omzet Rp 10.000.000/bulan (Capaian: 62.5%)</span>
            </div>
          </div>
          <div class="milestone-step upcoming">
            <span class="step-check">○</span>
            <div>
              <span class="step-title">Tahap 4: Laporan Keuangan Akhir Semester</span>
              <span class="step-sub">Konversi nilai praktikum kewirausahaan (3 SKS)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- TAB 2: PESANAN MASUK (ORDERS) -->
  {:else if activeTab === 'orders'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Manajemen Pesanan Masuk</h1>
        <p class="view-sub">Kelola antrean pemenuhan, pengantaran ke loker pintar kampus, dan verifikasi pembeli.</p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-report font-mono"
          onclick={() => alert('Daftar resi dan pesanan harian berhasil diekspor (.csv).')}
        >
          <span class="material-symbols-outlined text-sm">download</span>
          <span>Unduh Daftar Pesanan</span>
        </button>
      </div>
    </div>

    <!-- Order Status Tabs -->
    <div class="filter-tabs-bar">
      <div class="status-tab-group font-mono">
        <button
          type="button"
          class="tab-btn {orderStatusFilter === 'all' ? 'active' : ''}"
          onclick={() => orderStatusFilter = 'all'}
        >
          Semua ({orderCounts.all})
        </button>
        <button
          type="button"
          class="tab-btn {orderStatusFilter === 'Perlu Dikirim' ? 'active' : ''}"
          onclick={() => orderStatusFilter = 'Perlu Dikirim'}
        >
          Perlu Dikirim ({orderCounts.perluDikirim})
        </button>
        <button
          type="button"
          class="tab-btn {orderStatusFilter === 'Dikirim' ? 'active' : ''}"
          onclick={() => orderStatusFilter = 'Dikirim'}
        >
          Dalam Pengiriman ({orderCounts.dikirim})
        </button>
        <button
          type="button"
          class="tab-btn {orderStatusFilter === 'Selesai' ? 'active' : ''}"
          onclick={() => orderStatusFilter = 'Selesai'}
        >
          Selesai ({orderCounts.selesai})
        </button>
        <button
          type="button"
          class="tab-btn {orderStatusFilter === 'Dibatalkan' ? 'active' : ''}"
          onclick={() => orderStatusFilter = 'Dibatalkan'}
        >
          Dibatalkan ({orderCounts.dibatalkan})
        </button>
      </div>
    </div>

    <!-- Search & Secondary Filter Bar -->
    <div class="orders-toolbar">
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          placeholder="Cari ID pesanan, nama pembeli, NIM, atau produk..."
          bind:value={orderSearchQuery}
          class="search-input"
        />
        {#if orderSearchQuery}
          <button
            type="button"
            class="btn-clear-search"
            onclick={() => orderSearchQuery = ''}
          >
            <span class="material-symbols-outlined text-xs">close</span>
          </button>
        {/if}
      </div>

      <div class="secondary-filters font-mono">
        <select class="select-filter" bind:value={orderPickupFilter}>
          <option value="all">Semua Metode Ambil</option>
          <option value="loker">Loker Pintar FEB</option>
          <option value="booth">Ambil di Booth Stan</option>
          <option value="digital">Pengiriman Digital</option>
        </select>
      </div>
    </div>

    <!-- Orders Cards List -->
    {#if filteredOrders.length === 0}
      <div class="empty-state-card">
        <span class="material-symbols-outlined empty-icon">shopping_bag</span>
        <h3 class="empty-title">Tidak ada pesanan ditemukan</h3>
        <p class="empty-sub">Coba sesuaikan kata kunci pencarian atau filter status pesanan.</p>
        <button
          type="button"
          class="btn-reset-filter font-mono"
          onclick={() => { orderStatusFilter = 'all'; orderSearchQuery = ''; orderPickupFilter = 'all'; }}
        >
          Reset Filter
        </button>
      </div>
    {:else}
      <div class="order-cards-stack">
        {#each filteredOrders as order (order.id)}
          <div class="order-full-card">
            <!-- Card Header -->
            <div class="ofc-header">
              <div class="ofc-header-left">
                <span class="ofc-id font-mono font-bold">{order.id}</span>
                <span class="ofc-time font-mono text-xs">{order.time}</span>
                <span class="badge-payment font-mono">{order.paymentMethod}</span>
              </div>
              <div class="ofc-header-right">
                <span class="status-badge status-{order.status.replace(/\s+/g, '-').toLowerCase()} font-mono">
                  {order.status}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="ofc-body">
              <!-- Customer Info -->
              <div class="ofc-customer">
                <div class="avatar-circle font-mono">
                  {order.customer.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 class="cust-name">{order.customer}</h4>
                  <span class="cust-meta font-mono">{order.nim} • {order.major}</span>
                  <a
                    href="https://wa.me/{order.phone.replace(/\D/g, '')}"
                    target="_blank"
                    rel="noreferrer"
                    class="wa-btn font-mono"
                    title="Hubungi Pembeli via WhatsApp"
                  >
                    <span class="material-symbols-outlined text-xs">chat</span>
                    <span>{order.phone}</span>
                  </a>
                </div>
              </div>

              <!-- Product Item Details -->
              <div class="ofc-item-details">
                <div class="item-tag-row">
                  <span class="material-symbols-outlined text-primary text-sm">inventory_2</span>
                  <span class="item-name font-bold">{order.item}</span>
                  <span class="item-qty font-mono">x{order.qty || 1}</span>
                </div>
                <div class="pickup-info-box font-mono">
                  <span class="pickup-k">Metode Pengambilan:</span>
                  <span class="pickup-v">{order.pickupMethod}</span>
                  {#if order.pickupPin && order.pickupPin !== '-'}
                    <span class="pin-badge">PIN: {order.pickupPin}</span>
                  {/if}
                </div>
                {#if order.notes}
                  <div class="buyer-notes font-mono">
                    <span class="material-symbols-outlined text-xs text-secondary">info</span>
                    <span>"{order.notes}"</span>
                  </div>
                {/if}
              </div>

              <!-- Price & Quick Action -->
              <div class="ofc-pricing-action">
                <div class="price-wrap">
                  <span class="price-label font-mono text-xs">Total Pembayaran</span>
                  <span class="price-value font-mono font-bold text-primary">{order.formattedTotal}</span>
                </div>

                <div class="action-buttons-group">
                  {#if order.status === 'Perlu Dikirim'}
                    <button
                      type="button"
                      class="btn-act-primary font-button"
                      onclick={() => updateOrderStatus(order.id, 'Dikirim')}
                    >
                      <span class="material-symbols-outlined text-xs">local_shipping</span>
                      <span>Kirim ke Loker / Stan</span>
                    </button>
                  {:else if order.status === 'Dikirim'}
                    <button
                      type="button"
                      class="btn-act-success font-button"
                      onclick={() => updateOrderStatus(order.id, 'Selesai')}
                    >
                      <span class="material-symbols-outlined text-xs">check_circle</span>
                      <span>Tandai Telah Diambil</span>
                    </button>
                  {/if}

                  <button
                    type="button"
                    class="btn-act-outline font-button"
                    onclick={() => selectedOrderModal = order}
                  >
                    <span class="material-symbols-outlined text-xs">receipt_long</span>
                    <span>Rincian &amp; Resi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

  <!-- TAB 3: PENDAPATAN & ARUS KAS (REVENUE) -->
  {:else if activeTab === 'revenue'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Pendapatan &amp; Arus Kas Bisnis</h1>
        <p class="view-sub">Lacak omzet harian, saldo siap ditarik ke rekening civitas, dan riwayat ledger transaksi.</p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-report font-mono"
          onclick={() => alert('Laporan Keuangan & Buku Kas (.xlsx) berhasil diunduh.')}
        >
          <span class="material-symbols-outlined text-sm">download</span>
          <span>Unduh Laporan Keuangan</span>
        </button>
      </div>
    </div>

    <!-- Payout Banner Hero -->
    <div class="payout-banner-hero">
      <div class="pbh-left">
        <span class="pbh-badge font-mono">SALDO SIAP DITARIK</span>
        <h2 class="pbh-balance font-mono">{formatIDR(currentBalance)}</h2>
        <div class="pbh-details font-mono">
          <span>• Saldo Ditahan (Escrow): Rp 585.000</span>
          <span>• Bank Terdaftar: Mandiri 137-00-1928374-1 (SSO Kampus)</span>
        </div>
      </div>
      <div class="pbh-right">
        <button
          type="button"
          class="btn-payout-cta font-button"
          onclick={() => isWithdrawModalOpen = true}
        >
          <span class="material-symbols-outlined text-sm">account_balance</span>
          <span>Tarik Saldo ke Rekening</span>
        </button>
      </div>
    </div>

    <!-- Financial 4-Cards Grid -->
    <div class="fin-cards-grid font-mono">
      <div class="fin-card">
        <span class="fin-k">Total Omzet Bulan Ini</span>
        <span class="fin-v text-primary">Rp 6.250.000</span>
        <span class="fin-sub text-success">+18.4% vs bulan lalu</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Fee Subsidi Inkubator (1%)</span>
        <span class="fin-v text-secondary">Rp 62.500</span>
        <span class="fin-sub">Fasilitas stan &amp; listrik dekanat</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Pendapatan Bersih Tenant</span>
        <span class="fin-v text-success">Rp 6.187.500</span>
        <span class="fin-sub">Terverifikasi sistem keuangan</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Rata-rata Transaksi (AOV)</span>
        <span class="fin-v">Rp 68.500</span>
        <span class="fin-sub">Dari total 91 transaksi</span>
      </div>
    </div>

    <!-- Category Contribution Breakdown -->
    <div class="cat-revenue-box">
      <h3 class="section-card-title">Kontribusi Omzet Berdasarkan Kategori</h3>
      <div class="cat-bars font-mono">
        <div class="cat-bar-item">
          <div class="cat-bar-info">
            <span>Edukasi &amp; Merchandise FEB</span>
            <span class="font-bold">Rp 3.000.000 (48%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill bg-primary" style="width: 48%;"></div>
          </div>
        </div>

        <div class="cat-bar-item">
          <div class="cat-bar-info">
            <span>Makanan &amp; Minuman Sehat Mahasiswa</span>
            <span class="font-bold">Rp 2.125.000 (34%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill bg-secondary" style="width: 34%;"></div>
          </div>
        </div>

        <div class="cat-bar-item">
          <div class="cat-bar-info">
            <span>Jasa Desain &amp; Konsultasi Akademik</span>
            <span class="font-bold">Rp 1.125.000 (18%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill bg-outline" style="width: 18%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ledger / Mutasi Transaksi -->
    <div class="ledger-card">
      <div class="ledger-header">
        <div>
          <h2 class="section-card-title">Buku Kas &amp; Mutasi Transaksi</h2>
          <span class="ledger-sub font-mono">Catatan keuangan otomatis terintegrasi portal inkubator</span>
        </div>

        <div class="ledger-filters font-mono">
          <select class="select-filter" bind:value={ledgerFilter}>
            <option value="all">Semua Tipe</option>
            <option value="income">Pemasukan Penjualan (+)</option>
            <option value="payout">Penarikan Saldo (-)</option>
            <option value="fee">Fee Inkubasi (-)</option>
            <option value="expense">Pengeluaran Kas (-)</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table font-mono">
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Waktu</th>
              <th>Keterangan / Referensi</th>
              <th>Metode</th>
              <th>Status</th>
              <th class="text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredLedger as item (item.id)}
              <tr>
                <td class="font-bold text-primary">{item.id}</td>
                <td class="text-xs text-outline">{item.date}</td>
                <td class="font-sans font-bold">{item.desc}</td>
                <td><span class="method-tag">{item.method}</span></td>
                <td>
                  <span class="status-pill status-selesai">{item.status}</span>
                </td>
                <td class="text-right font-bold {item.amount < 0 || item.type === 'payout' || item.type === 'expense' || item.type === 'fee' ? 'text-error' : 'text-success'}">
                  {item.formattedAmount}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

  <!-- TAB 4: PERTUMBUHAN & TRAFIK (GROWTH) -->
  {:else if activeTab === 'growth'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Pertumbuhan &amp; Analitik Trafik</h1>
        <p class="view-sub">Metrik konversi stan selasar, demografi pelanggan civitas akademika, dan channel promosi.</p>
      </div>

      <div class="header-actions">
        <span class="update-badge font-mono">Data Real-Time: Hari Ini</span>
      </div>
    </div>

    <!-- 4 Growth KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">RASIO KONVERSI TOKO</span>
          <div class="kpi-icon-wrap bg-primary-fixed">
            <span class="material-symbols-outlined text-primary">percent</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">4.8%</h3>
          <p class="kpi-growth text-success">
            <span class="material-symbols-outlined text-xs">trending_up</span>
            <span>Target Dekanat: 3.2% (Unggul)</span>
          </p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">PENGUNJUNG UNIK BOOTH</span>
          <div class="kpi-icon-wrap bg-secondary-fixed">
            <span class="material-symbols-outlined text-secondary">group</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">1.420 Org</h3>
          <p class="kpi-note font-mono">+15% minggu ini di selasar FEB</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">NILAI RATA-RATA PESANAN</span>
          <div class="kpi-icon-wrap bg-secondary-container">
            <span class="material-symbols-outlined text-on-secondary-container">shopping_cart</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">Rp 87.500</h3>
          <p class="kpi-note font-mono">Basket size civitas stabil</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label font-mono">PELANGGAN SETIA (REPEAT)</span>
          <div class="kpi-icon-wrap bg-primary-fixed">
            <span class="material-symbols-outlined text-primary">replay</span>
          </div>
        </div>
        <div>
          <h3 class="kpi-value font-mono">42.6%</h3>
          <p class="kpi-growth text-success">
            <span class="material-symbols-outlined text-xs">verified</span>
            <span>Retensi Mahasiswa Tinggi</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Conversion Funnel Section -->
    <div class="card-box">
      <div class="card-box-header">
        <div>
          <h3 class="box-title">Corong Konversi Pelanggan (Funnel Analysis)</h3>
          <p class="card-desc font-mono">Alur civitas dari melihat booth sampai menyelesaikan transaksi</p>
        </div>
        <span class="font-mono text-xs text-outline">Minggu Berjalan</span>
      </div>

      <div class="funnel-container font-mono">
        <div class="funnel-step">
          <div class="funnel-header">
            <span class="step-num">1</span>
            <span class="step-name">Pengunjung Stan &amp; Katalog Web</span>
            <span class="step-count">1.420 Civitas (100%)</span>
          </div>
          <div class="funnel-bar"><div class="funnel-fill" style="width: 100%;"></div></div>
        </div>

        <div class="funnel-step">
          <div class="funnel-header">
            <span class="step-num">2</span>
            <span class="step-name">Menjelajahi Detail Produk</span>
            <span class="step-count">860 Civitas (60.5%)</span>
          </div>
          <div class="funnel-bar"><div class="funnel-fill" style="width: 60.5%;"></div></div>
        </div>

        <div class="funnel-step">
          <div class="funnel-header">
            <span class="step-num">3</span>
            <span class="step-name">Menambahkan ke Keranjang / Memesan</span>
            <span class="step-count">210 Civitas (14.8%)</span>
          </div>
          <div class="funnel-bar"><div class="funnel-fill bg-secondary" style="width: 14.8%;"></div></div>
        </div>

        <div class="funnel-step">
          <div class="funnel-header">
            <span class="step-num">4</span>
            <span class="step-name">Transaksi Berhasil &amp; Diambil di Loker</span>
            <span class="step-count">68 Pesanan (4.8%)</span>
          </div>
          <div class="funnel-bar"><div class="funnel-fill bg-success" style="width: 4.8%;"></div></div>
        </div>
      </div>
    </div>

    <!-- Demographics & Channels Row -->
    <div class="middle-grid">
      <!-- Demographics -->
      <div class="card-box">
        <h3 class="box-title">Demografi Pelanggan Civitas</h3>
        <p class="card-desc font-mono">Profil pembeli berdasarkan program studi dan peran kampus</p>

        <div class="demo-bars font-mono">
          <div class="demo-row">
            <span class="demo-k">Mahasiswa S1 FEB (Reguler)</span>
            <div class="demo-bar-track">
              <div class="demo-bar-fill" style="width: 52%;"></div>
            </div>
            <span class="demo-pct">52%</span>
          </div>

          <div class="demo-row">
            <span class="demo-k">Dosen &amp; Tenaga Kependidikan</span>
            <div class="demo-bar-track">
              <div class="demo-bar-fill bg-secondary" style="width: 20%;"></div>
            </div>
            <span class="demo-pct">20%</span>
          </div>

          <div class="demo-row">
            <span class="demo-k">Mahasiswa S1 IUP (International)</span>
            <div class="demo-bar-track">
              <div class="demo-bar-fill bg-primary" style="width: 18%;"></div>
            </div>
            <span class="demo-pct">18%</span>
          </div>

          <div class="demo-row">
            <span class="demo-k">Civitas Luar FEB &amp; Tamu Umum</span>
            <div class="demo-bar-track">
              <div class="demo-bar-fill bg-outline" style="width: 10%;"></div>
            </div>
            <span class="demo-pct">10%</span>
          </div>
        </div>
      </div>

      <!-- Traffic Channels -->
      <div class="card-box">
        <h3 class="box-title">Sumber Trafik &amp; Saluran Promosi</h3>
        <p class="card-desc font-mono">Channel akuisisi pembeli ke produk tenant</p>

        <div class="channel-list font-mono">
          <div class="channel-item">
            <div class="channel-icon-wrap bg-primary-fixed">
              <span class="material-symbols-outlined text-primary">qr_code_2</span>
            </div>
            <div class="channel-info">
              <span class="channel-name">QR Code Meja Stan &amp; Selasar</span>
              <span class="channel-desc">Scan langsung di lokasi kampus</span>
            </div>
            <span class="channel-pct font-bold">48%</span>
          </div>

          <div class="channel-item">
            <div class="channel-icon-wrap bg-secondary-fixed">
              <span class="material-symbols-outlined text-secondary">storefront</span>
            </div>
            <div class="channel-info">
              <span class="channel-name">Katalog FEB-X Marketplace</span>
              <span class="channel-desc">Pencarian produk via website</span>
            </div>
            <span class="channel-pct font-bold">28%</span>
          </div>

          <div class="channel-item">
            <div class="channel-icon-wrap bg-primary-fixed">
              <span class="material-symbols-outlined text-primary">share</span>
            </div>
            <div class="channel-info">
              <span class="channel-name">Media Sosial KMFEB &amp; Grup WA</span>
              <span class="channel-desc">Broadcast angkatan &amp; story</span>
            </div>
            <span class="channel-pct font-bold">16%</span>
          </div>

          <div class="channel-item">
            <div class="channel-icon-wrap bg-secondary-fixed">
              <span class="material-symbols-outlined text-secondary">school</span>
            </div>
            <div class="channel-info">
              <span class="channel-name">Rekomendasi Dosen Kewirausahaan</span>
              <span class="channel-desc">Tugas praktikum &amp; case study</span>
            </div>
            <span class="channel-pct font-bold">8%</span>
          </div>
        </div>
      </div>
    </div>

  <!-- TAB 5: DATA BISNIS & BOOTH (BUSINESS_DATA) -->
  {:else if activeTab === 'business_data'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Data Bisnis &amp; Stan Kampus</h1>
        <p class="view-sub">Identitas unit usaha mahasiswa, pengaturan fasilitas stan fisik selasar FEB, dan bimbingan SKS.</p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-primary-action font-button"
          onclick={() => isEditingBiz = !isEditingBiz}
        >
          <span class="material-symbols-outlined text-sm">{isEditingBiz ? 'close' : 'edit'}</span>
          <span>{isEditingBiz ? 'Batal Edit' : 'Edit Profil Bisnis'}</span>
        </button>
      </div>
    </div>

    <!-- Business Header Profile Card -->
    <div class="biz-profile-hero">
      <div class="bph-avatar">
        <span class="material-symbols-outlined text-primary text-3xl">storefront</span>
      </div>
      <div class="bph-main">
        <div class="flex-row items-center gap-2 flex-wrap">
          <h2 class="bph-name">{bizName}</h2>
          <span class="badge-verified font-mono">✓ TERVALIDASI DEKANAT FEB</span>
        </div>
        <p class="bph-tagline">{bizTagline}</p>
        <div class="bph-meta font-mono">
          <span>NO. REG: FEB-X/2024/04102</span>
          <span>• Akreditasi Inkubator: A</span>
          <span>• Rating: 4.9 (124 Civitas)</span>
        </div>
      </div>
    </div>

    {#if isEditingBiz}
      <!-- Edit Profile Form -->
      <div class="card-box edit-biz-form">
        <h3 class="box-title">Perbarui Informasi Stan &amp; Bisnis</h3>
        <form onsubmit={handleSaveBizProfile} class="form-grid">
          <div class="form-group">
            <label class="form-label" for="edit-biz-name">Nama Unit Usaha Mahasiswa</label>
            <input id="edit-biz-name" type="text" class="form-input" bind:value={bizName} required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-biz-tagline">Slogan / Deskripsi Singkat</label>
            <input id="edit-biz-tagline" type="text" class="form-input" bind:value={bizTagline} required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-biz-wa">Nomor WhatsApp Kontak Layanan</label>
            <input id="edit-biz-wa" type="text" class="form-input font-mono" bind:value={bizWhatsapp} required />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-biz-hours">Jam Operasional Stan</label>
            <input id="edit-biz-hours" type="text" class="form-input font-mono" bind:value={bizHours} required />
          </div>

          <div class="form-group full-width">
            <label class="form-label" for="edit-biz-loc">Lokasi Booth Fisik di Kampus</label>
            <input id="edit-biz-loc" type="text" class="form-input font-mono" bind:value={bizLocation} required />
          </div>

          <div class="form-actions full-width">
            <button type="submit" class="btn-primary-action font-button">
              Simpan Perubahan
            </button>
            <button
              type="button"
              class="btn-act-outline font-button"
              onclick={() => isEditingBiz = false}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Facility & Booth Info Grid -->
    <div class="middle-grid">
      <!-- Stan Fisik Info -->
      <div class="card-box">
        <div class="card-box-header">
          <h3 class="box-title">Stan Fisik &amp; Fasilitas Kampus</h3>
          <span class="status-tag {isBoothOpen ? 'tag-good' : 'tag-warning'} font-mono">
            {isBoothOpen ? 'STAN BUKA' : 'STAN TUTUP'}
          </span>
        </div>

        <div class="detail-list font-mono">
          <div class="detail-item">
            <span class="detail-k">Lokasi Stan:</span>
            <span class="detail-v">{bizLocation}</span>
          </div>
          <div class="detail-item">
            <span class="detail-k">Jam Operasional:</span>
            <span class="detail-v">{bizHours}</span>
          </div>
          <div class="detail-item">
            <span class="detail-k">Loker Pintar Terhubung:</span>
            <span class="detail-v">Loker #10, #11, #12 (Otomatis PIN SMS/WA)</span>
          </div>
          <div class="detail-item">
            <span class="detail-k">Fasilitas Fakultas:</span>
            <span class="detail-v">Meja Display Kayu, Listrik 450W, Banner Selasar</span>
          </div>
          <div class="detail-item">
            <span class="detail-k">Kontak Hotline:</span>
            <span class="detail-v text-primary font-bold">{bizWhatsapp}</span>
          </div>
        </div>
      </div>

      <!-- Pembimbing & Mentorship -->
      <div class="card-box">
        <div class="card-box-header">
          <h3 class="box-title">Dosen &amp; Mentor Pembimbing</h3>
          <span class="incubation-pill font-mono">Program SKS</span>
        </div>

        <div class="mentors-stack">
          <!-- Dosen Pembimbing SKS -->
          <div class="mentor-card-item">
            <div class="mentor-icon-box bg-primary-fixed">
              <span class="material-symbols-outlined text-primary">school</span>
            </div>
            <div class="mentor-info">
              <span class="mentor-role font-mono">DOSEN PEMBIMBING AKADEMIK (3 SKS)</span>
              <h4 class="mentor-name">Dr. Sri Rahayu, S.E., M.Si.</h4>
              <span class="mentor-nip font-mono">NIP: 198204152008121002</span>
              <button
                type="button"
                class="btn-sm-action font-mono"
                onclick={() => alert('Jadwal konsultasi bimbingan SKS diajukan ke Dosen Pembimbing.')}
              >
                + Ajukan Konsultasi SKS
              </button>
            </div>
          </div>

          <!-- Mentor Alumni -->
          <div class="mentor-card-item">
            <div class="mentor-icon-box bg-secondary-fixed">
              <span class="material-symbols-outlined text-secondary">handshake</span>
            </div>
            <div class="mentor-info">
              <span class="mentor-role font-mono">MENTOR ALUMNI &amp; INVESTOR</span>
              <h4 class="mentor-name">Bramantyo, S.E., MBA</h4>
              <span class="mentor-nip font-mono">Alumni FEB '12 • Managing Partner VC</span>
              <button
                type="button"
                class="btn-sm-action font-mono"
                onclick={() => alert('Form permintaan review pitchdeck & feedback bisnis dibuka.')}
              >
                + Minta Review Mentoring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legalitas & Sertifikasi -->
    <div class="card-box">
      <h3 class="box-title">Legalitas &amp; Perizinan Usaha Mahasiswa</h3>
      <div class="legal-grid font-mono">
        <div class="legal-badge-card">
          <span class="material-symbols-outlined text-success">verified</span>
          <div>
            <span class="legal-title">Nomor Induk Berusaha (NIB Kampus)</span>
            <span class="legal-code">FEB-NIB-2024-00412</span>
            <span class="legal-status text-success">✓ Terdaftar di OSS Kampus</span>
          </div>
        </div>

        <div class="legal-badge-card">
          <span class="material-symbols-outlined text-success">health_and_safety</span>
          <div>
            <span class="legal-title">Sertifikasi Halal Self-Declare</span>
            <span class="legal-code">ID3411000192834</span>
            <span class="legal-status text-success">✓ Terverifikasi BPJPH</span>
          </div>
        </div>

        <div class="legal-badge-card">
          <span class="material-symbols-outlined text-secondary">fact_check</span>
          <div>
            <span class="legal-title">Kurasi Higienitas Lab FEB</span>
            <span class="legal-code">FEB-LAB-HYG-2024</span>
            <span class="legal-status text-secondary">✓ Lolos Uji Kelayakan</span>
          </div>
        </div>
      </div>
    </div>

  <!-- TAB 6: MANAJEMEN STOK (INVENTORY) -->
  {:else if activeTab === 'inventory'}
    <div class="view-header">
      <div>
        <h1 class="view-title">Manajemen Stok &amp; Katalog Produk</h1>
        <p class="view-sub">Kelola ketersediaan barang di booth stan dan loker pintar kampus, pantau HPP, dan restock cepat.</p>
      </div>

      <div class="header-actions">
        <button
          type="button"
          class="btn-primary-action font-button"
          onclick={() => isAddProductOpen = true}
        >
          <span class="material-symbols-outlined text-sm">add</span>
          <span>Tambah Produk Baru</span>
        </button>
      </div>
    </div>

    <!-- Inventory 4 Overview Cards -->
    <div class="fin-cards-grid font-mono">
      <div class="fin-card">
        <span class="fin-k">Total SKU Aktif</span>
        <span class="fin-v text-primary">{inventorySummary.totalSKU} Produk</span>
        <span class="fin-sub">Tampil di marketplace &amp; booth</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Total Stok Fisik</span>
        <span class="fin-v">{inventorySummary.totalStock} Unit</span>
        <span class="fin-sub">Tersedia di selasar &amp; loker</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Perlu Restock Segera</span>
        <span class="fin-v text-error">{inventorySummary.lowStockCount} SKU</span>
        <span class="fin-sub">Stok di bawah ambang batas (10)</span>
      </div>
      <div class="fin-card">
        <span class="fin-k">Estimasi Nilai Inventaris</span>
        <span class="fin-v text-success">{formatIDR(inventorySummary.totalAssetValue)}</span>
        <span class="fin-sub">Berdasarkan harga jual retail</span>
      </div>
    </div>

    <!-- Inventory Filter & Search Bar -->
    <div class="orders-toolbar">
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          placeholder="Cari nama produk atau kode SKU..."
          bind:value={inventorySearch}
          class="search-input"
        />
        {#if inventorySearch}
          <button
            type="button"
            class="btn-clear-search"
            onclick={() => inventorySearch = ''}
          >
            <span class="material-symbols-outlined text-xs">close</span>
          </button>
        {/if}
      </div>

      <div class="secondary-filters font-mono">
        <select class="select-filter" bind:value={inventoryCategoryFilter}>
          <option value="all">Semua Kategori</option>
          <option value="Merchandise">Merchandise</option>
          <option value="Edukasi & Merch">Edukasi &amp; Merch</option>
          <option value="Makanan & Minuman">Makanan &amp; Minuman</option>
          <option value="Jasa & Desain">Jasa &amp; Desain</option>
        </select>

        <select class="select-filter" bind:value={inventoryStatusFilter}>
          <option value="all">Semua Status</option>
          <option value="Aman">Stok Aman</option>
          <option value="Stok Menipis">Stok Menipis</option>
          <option value="Habis">Habis</option>
        </select>
      </div>
    </div>

    <!-- Inventory Comprehensive Table -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="data-table font-mono">
          <thead>
            <tr>
              <th>Nama Produk Mahasiswa</th>
              <th>SKU</th>
              <th>Kategori</th>
              <th>Lokasi Simpan</th>
              <th>Harga Jual</th>
              <th>HPP (Modal)</th>
              <th>Margin</th>
              <th>Stok Fisik</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredInventory as item (item.id)}
              {@const hppVal = item.hpp || Math.round(item.price * 0.6)}
              {@const marginPct = Math.round(((item.price - hppVal) / item.price) * 100)}
              <tr>
                <td class="font-sans font-bold text-primary">{item.name}</td>
                <td class="text-xs">{item.sku}</td>
                <td><span class="cat-pill">{item.category}</span></td>
                <td class="text-xs text-outline">{item.location || 'Booth Selasar'}</td>
                <td class="font-bold">{item.formattedPrice}</td>
                <td class="text-xs text-outline">{formatIDR(hppVal)}</td>
                <td class="font-bold text-success">+{marginPct}%</td>
                <td>
                  <div class="inline-qty-control">
                    <button
                      type="button"
                      class="btn-stock-adj"
                      onclick={() => adjustStock(item.id, -1)}
                      disabled={item.stock <= 0}
                    >-</button>
                    <span class="stock-qty-val font-bold">{item.stock}</span>
                    <button
                      type="button"
                      class="btn-stock-adj"
                      onclick={() => adjustStock(item.id, 1)}
                    >+</button>
                  </div>
                </td>
                <td>
                  <span class="stock-status-tag {item.status === 'Stok Menipis' ? 'tag-warning' : item.status === 'Habis' ? 'tag-error' : 'tag-good'}">
                    {item.status}
                  </span>
                </td>
                <td class="text-right">
                  <div class="flex-row items-center justify-end gap-1">
                    <button
                      type="button"
                      class="btn-restock"
                      onclick={() => adjustStock(item.id, 10)}
                      title="Tambah 10 stok cepat"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      class="btn-icon-action"
                      onclick={() => editingItem = { ...item }}
                      title="Edit harga dan rincian"
                    >
                      <span class="material-symbols-outlined text-xs">edit</span>
                    </button>
                    <button
                      type="button"
                      class="btn-icon-action text-error"
                      onclick={() => handleDeleteItem(item.id, item.name)}
                      title="Hapus produk"
                    >
                      <span class="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- ============================================== -->
<!-- MODAL: RINCIAN & RESI PESANAN -->
<!-- ============================================== -->
{#if selectedOrderModal}
  <div
    class="modal-backdrop"
    onclick={() => selectedOrderModal = null}
    onkeydown={(e) => e.key === 'Escape' && (selectedOrderModal = null)}
    role="dialog"
    aria-modal="true"
    aria-label="Rincian Pesanan"
    tabindex="-1"
  >
    <div
      class="modal-box modal-box-lg"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <div class="modal-header">
        <div>
          <span class="font-mono text-xs text-secondary font-bold">RESI DIGITAL FEB-X PLATFORM</span>
          <h3 class="modal-heading">Rincian Transaksi {selectedOrderModal.id}</h3>
        </div>
        <button
          type="button"
          class="btn-close"
          onclick={() => selectedOrderModal = null}
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="modal-body font-mono">
        <!-- Order Progress Stepper -->
        <div class="receipt-timeline">
          <div class="rtl-step done">
            <span class="rtl-dot">✓</span>
            <span class="rtl-text">Pesanan Masuk</span>
          </div>
          <div class="rtl-step done">
            <span class="rtl-dot">✓</span>
            <span class="rtl-text">Pembayaran Terverifikasi</span>
          </div>
          <div class="rtl-step {selectedOrderModal.status === 'Dikirim' || selectedOrderModal.status === 'Selesai' ? 'done' : 'current'}">
            <span class="rtl-dot">{selectedOrderModal.status === 'Dikirim' || selectedOrderModal.status === 'Selesai' ? '✓' : '●'}</span>
            <span class="rtl-text">Dipersiapkan / Di Loker</span>
          </div>
          <div class="rtl-step {selectedOrderModal.status === 'Selesai' ? 'done' : 'upcoming'}">
            <span class="rtl-dot">{selectedOrderModal.status === 'Selesai' ? '✓' : '○'}</span>
            <span class="rtl-text">Selesai Diambil</span>
          </div>
        </div>

        <!-- Receipt Grid Details -->
        <div class="receipt-grid">
          <div class="rg-col">
            <span class="rg-k">Nama Pembeli:</span>
            <span class="rg-v font-bold">{selectedOrderModal.customer}</span>
            <span class="rg-k">NIM &amp; Prodi:</span>
            <span class="rg-v">{selectedOrderModal.nim} ({selectedOrderModal.major})</span>
            <span class="rg-k">Kontak WA:</span>
            <span class="rg-v">{selectedOrderModal.phone}</span>
          </div>

          <div class="rg-col">
            <span class="rg-k">Waktu Pemesanan:</span>
            <span class="rg-v">{selectedOrderModal.time}</span>
            <span class="rg-k">Metode Pengambilan:</span>
            <span class="rg-v font-bold text-primary">{selectedOrderModal.pickupMethod}</span>
            {#if selectedOrderModal.pickupPin && selectedOrderModal.pickupPin !== '-'}
              <span class="rg-k">PIN Loker Pintar:</span>
              <span class="pin-badge">{selectedOrderModal.pickupPin}</span>
            {/if}
          </div>
        </div>

        <!-- Order Items Breakdown -->
        <div class="receipt-items-table">
          <div class="rit-row rit-head">
            <span>Item Produk</span>
            <span class="text-center">Jumlah</span>
            <span class="text-right">Harga</span>
          </div>
          <div class="rit-row">
            <span>{selectedOrderModal.item}</span>
            <span class="text-center">x{selectedOrderModal.qty || 1}</span>
            <span class="text-right font-bold">{selectedOrderModal.formattedTotal}</span>
          </div>
          <div class="rit-row rit-total">
            <span>Total Akhir</span>
            <span></span>
            <span class="text-right font-bold text-primary">{selectedOrderModal.formattedTotal}</span>
          </div>
        </div>

        {#if selectedOrderModal.notes}
          <div class="buyer-notes">
            <span class="material-symbols-outlined text-xs">notes</span>
            <span>Catatan Pembeli: "{selectedOrderModal.notes}"</span>
          </div>
        {/if}

        <div class="receipt-footer-actions">
          <button
            type="button"
            class="btn-act-outline font-button"
            onclick={() => alert('Resi PDF berhasil diunduh ke perangkat.')}
          >
            <span class="material-symbols-outlined text-xs">print</span>
            <span>Cetak Resi PDF</span>
          </button>

          {#if selectedOrderModal.status === 'Perlu Dikirim'}
            <button
              type="button"
              class="btn-act-primary font-button"
              onclick={() => {
                updateOrderStatus(selectedOrderModal.id, 'Dikirim');
                selectedOrderModal = null;
              }}
            >
              Kirim ke Loker Kampus
            </button>
          {:else if selectedOrderModal.status === 'Dikirim'}
            <button
              type="button"
              class="btn-act-success font-button"
              onclick={() => {
                updateOrderStatus(selectedOrderModal.id, 'Selesai');
                selectedOrderModal = null;
              }}
            >
              Tandai Telah Diambil
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- ============================================== -->
<!-- MODAL: TARIK SALDO (WITHDRAWAL) -->
<!-- ============================================== -->
{#if isWithdrawModalOpen}
  <div
    class="modal-backdrop"
    onclick={() => isWithdrawModalOpen = false}
    onkeydown={(e) => e.key === 'Escape' && (isWithdrawModalOpen = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Tarik Saldo"
    tabindex="-1"
  >
    <div
      class="modal-box"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <div class="modal-header">
        <h3 class="modal-heading">Tarik Saldo Penjualan ke Rekening</h3>
        <button
          type="button"
          class="btn-close"
          onclick={() => isWithdrawModalOpen = false}
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onsubmit={handleWithdrawSubmit} class="modal-form font-sans">
        <div class="balance-preview-box font-mono">
          <span class="bpb-k">Saldo Tersedia Siap Ditarik:</span>
          <span class="bpb-v text-primary font-bold">{formatIDR(currentBalance)}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="wd-bank">Pilih Rekening Tujuan</label>
          <select id="wd-bank" class="form-input font-mono" bind:value={withdrawBankSelect}>
            <option>Mandiri Kampus (137-00-1928374-1) a.n Dimas Pratama</option>
            <option>Bank Central Asia (BCA 849-1029381) a.n Dimas Pratama</option>
            <option>BNI Syariah Kampus (029-3847561) a.n Dimas Pratama</option>
            <option>QRIS / GoPay Civitas (0812-3456-7890)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="wd-amount">Nominal Penarikan (Rp)</label>
          <input
            id="wd-amount"
            type="number"
            class="form-input font-mono"
            bind:value={withdrawAmountInput}
            min="10000"
            max={currentBalance}
            step="10000"
            required
          />
          <div class="amount-quick-chips font-mono">
            <button type="button" class="chip-btn" onclick={() => withdrawAmountInput = 500000}>500rb</button>
            <button type="button" class="chip-btn" onclick={() => withdrawAmountInput = 1000000}>1jt</button>
            <button type="button" class="chip-btn" onclick={() => withdrawAmountInput = 2500000}>2.5jt</button>
            <button type="button" class="chip-btn chip-all" onclick={() => withdrawAmountInput = currentBalance}>Tarik Semua</button>
          </div>
        </div>

        <div class="info-alert font-mono">
          <span class="material-symbols-outlined text-xs text-primary">verified_user</span>
          <span>Bebas biaya transfer untuk civitas akademika FEB UGM. Pencairan otomatis dalam 15 menit.</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick={() => isWithdrawModalOpen = false}>Batal</button>
          <button type="submit" class="btn-submit">Konfirmasi Penarikan</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- ============================================== -->
<!-- MODAL: EDIT PRODUK & HARGA INVENTORY -->
<!-- ============================================== -->
{#if editingItem}
  <div
    class="modal-backdrop"
    onclick={() => editingItem = null}
    onkeydown={(e) => e.key === 'Escape' && (editingItem = null)}
    role="dialog"
    aria-modal="true"
    aria-label="Edit Produk"
    tabindex="-1"
  >
    <div
      class="modal-box"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <div class="modal-header">
        <h3 class="modal-heading">Edit Produk: {editingItem.name}</h3>
        <button
          type="button"
          class="btn-close"
          onclick={() => editingItem = null}
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onsubmit={handleSaveEditItem} class="modal-form font-sans">
        <div class="form-group">
          <label class="form-label" for="edit-price">Harga Jual (Rp)</label>
          <input
            id="edit-price"
            type="number"
            class="form-input font-mono"
            bind:value={editingItem.price}
            min="1000"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-hpp">HPP / Modal Pokok (Rp)</label>
          <input
            id="edit-hpp"
            type="number"
            class="form-input font-mono"
            bind:value={editingItem.hpp}
            min="1000"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-stock">Jumlah Stok Fisik</label>
          <input
            id="edit-stock"
            type="number"
            class="form-input font-mono"
            bind:value={editingItem.stock}
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-location">Lokasi Simpan</label>
          <input
            id="edit-location"
            type="text"
            class="form-input font-mono"
            bind:value={editingItem.location}
            required
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick={() => editingItem = null}>Batal</button>
          <button type="submit" class="btn-submit">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- ============================================== -->
<!-- MODAL: TAMBAH PRODUK BARU -->
<!-- ============================================== -->
{#if isAddProductOpen}
  <div
    class="modal-backdrop"
    onclick={() => isAddProductOpen = false}
    onkeydown={(e) => e.key === 'Escape' && (isAddProductOpen = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Tambah Produk Baru"
    tabindex="-1"
  >
    <div
      class="modal-box"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <div class="modal-header">
        <h3 class="modal-heading">Tambah Produk Mahasiswa Baru</h3>
        <button
          type="button"
          class="btn-close"
          onclick={() => isAddProductOpen = false}
        >
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onsubmit={handleAddProduct} class="modal-form font-sans">
        <div class="form-group">
          <label class="form-label" for="new-p-name">Nama Produk Mahasiswa</label>
          <input
            id="new-p-name"
            type="text"
            class="form-input"
            bind:value={newProductName}
            placeholder="Contoh: Binder Catatan Kuliah FEB"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="new-p-category">Kategori Produk</label>
          <select id="new-p-category" class="form-input" bind:value={newProductCategory}>
            <option value="Merchandise">Merchandise Kampus</option>
            <option value="Edukasi & Merch">Edukasi &amp; Catatan Kuliah</option>
            <option value="Makanan & Minuman">Makanan &amp; Minuman Sehat</option>
            <option value="Jasa & Desain">Jasa &amp; Konsultasi Desain</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="new-p-price">Harga Jual (Rp)</label>
            <input
              id="new-p-price"
              type="number"
              class="form-input font-mono"
              bind:value={newProductPrice}
              placeholder="Contoh: 50000"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-p-hpp">Modal HPP (Rp)</label>
            <input
              id="new-p-hpp"
              type="number"
              class="form-input font-mono"
              bind:value={newProductHpp}
              placeholder="Contoh: 30000"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="new-p-stock">Stok Awal</label>
            <input
              id="new-p-stock"
              type="number"
              class="form-input font-mono"
              bind:value={newProductStock}
              min="1"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-p-loc">Lokasi Simpan</label>
            <input
              id="new-p-loc"
              type="text"
              class="form-input font-mono"
              bind:value={newProductLocation}
              placeholder="Booth #04 / Loker #12"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="new-p-desc">Deskripsi Singkat</label>
          <textarea
            id="new-p-desc"
            class="form-textarea"
            rows="3"
            bind:value={newProductDesc}
            placeholder="Karya inovasi mahasiswa FEB untuk civitas kampus..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick={() => isAddProductOpen = false}>Batal</button>
          <button type="submit" class="btn-submit">Daftarkan ke Etalase</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .seller-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 3rem;
  }

  /* View Header */
  .view-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .view-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .view-sub {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn-booth-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.85rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-family: var(--font-mono);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .booth-open {
    background-color: var(--color-success-container);
    color: var(--color-success);
    border-color: rgba(19, 115, 51, 0.25);
  }

  .booth-closed {
    background-color: var(--color-error-container);
    color: var(--color-error);
    border-color: rgba(186, 26, 26, 0.25);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
    display: inline-block;
  }

  .btn-primary-action {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    box-shadow: var(--shadow-subtle);
    transition: all 0.15s ease;
  }

  .btn-primary-action:hover {
    background-color: var(--color-primary-hover);
  }

  .btn-report {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background-color: var(--color-surface-container-lowest);
    color: var(--color-on-surface-variant);
    padding: 0.5rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    border: 1px solid var(--color-outline-variant);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-report:hover {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  /* Facility Strip */
  .facility-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 0.85rem 1.25rem;
    box-shadow: var(--shadow-subtle);
  }

  .facility-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .fac-label {
    display: block;
    font-size: 0.6875rem;
    color: var(--color-outline);
    font-weight: 600;
  }

  .fac-val {
    display: block;
    font-size: 0.8125rem;
    color: var(--color-on-surface);
    font-weight: 700;
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .kpi-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 120px;
    box-shadow: var(--shadow-subtle);
  }

  .kpi-card-gold-border {
    border-color: rgba(253, 192, 3, 0.4);
    background: linear-gradient(135deg, #ffffff 0%, #fffdf8 100%);
  }

  .kpi-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .kpi-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-outline);
    letter-spacing: 0.05em;
  }

  .kpi-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kpi-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--color-primary);
    line-height: 1.1;
    margin-bottom: 0.25rem;
  }

  .kpi-growth {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-success);
  }

  .kpi-note {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  /* Middle Grid (Chart & Orders / 2-Columns) */
  .middle-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 1.25rem;
  }

  .chart-card, .orders-card, .card-box {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    box-shadow: var(--shadow-subtle);
  }

  .chart-header, .orders-header, .card-box-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .section-card-title, .box-title {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .chart-sub, .orders-hint, .card-desc {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .time-select, .select-filter {
    padding: 0.35rem 0.65rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-low);
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
  }

  /* Bar Chart */
  .bars-container {
    display: flex;
    height: 190px;
    gap: 0.75rem;
    padding-top: 1rem;
  }

  .y-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.625rem;
    color: var(--color-outline);
    padding-bottom: 1.5rem;
  }

  .bars-plot {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    position: relative;
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: 0.5rem;
  }

  .grid-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px dashed rgba(226, 226, 226, 0.7);
    pointer-events: none;
  }
  .line-75 { top: 25%; }
  .line-50 { top: 50%; }
  .line-25 { top: 75%; }

  .bar-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    width: 28px;
    position: relative;
    cursor: pointer;
  }

  .bar-fill {
    width: 16px;
    background-color: var(--color-primary);
    border-radius: 4px 4px 0 0;
    transition: all 0.25s ease;
  }

  .bar-column:hover .bar-fill {
    background-color: var(--color-secondary);
    transform: scaleX(1.15);
  }

  .bar-peak {
    background-color: var(--color-secondary-container);
  }

  .day-label {
    margin-top: 0.4rem;
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .chart-tooltip {
    position: absolute;
    top: -24px;
    background-color: var(--color-inverse-surface);
    color: var(--color-inverse-on-surface);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    white-space: nowrap;
    box-shadow: var(--shadow-subtle);
    z-index: 10;
  }

  /* Orders Mini List */
  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.85rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-low);
    gap: 0.75rem;
  }

  .order-left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .order-icon-box {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-xs);
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .order-id {
    font-size: 0.75rem;
    color: var(--color-primary);
  }

  .order-item-desc {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-on-surface);
    line-height: 1.2;
  }

  .order-cust {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .order-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .order-price {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .status-badge {
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-full);
    font-size: 0.625rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
  }

  .status-perlu-dikirim {
    background-color: #fff4e5;
    color: #b76e00;
  }

  .status-dikirim {
    background-color: #e8f0fe;
    color: #1a73e8;
  }

  .status-selesai {
    background-color: #e6f4ea;
    color: #137333;
  }

  .status-dibatalkan {
    background-color: #fce8e6;
    color: #c5221f;
  }

  .btn-text-link {
    background: none;
    border: none;
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
  }

  .btn-text-link:hover {
    text-decoration: underline;
  }

  /* Summary Bottom Row */
  .summary-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .stock-alert-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .stock-alert-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.75rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface-container-low);
  }

  .stock-alert-name {
    font-size: 0.8125rem;
    color: var(--color-on-surface);
    display: block;
  }

  .stock-qty-chip {
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
  }

  .chip-warning {
    background-color: #fff3e0;
    color: #e65100;
  }

  .chip-empty {
    background-color: #ffebee;
    color: #c62828;
  }

  .btn-quick-restock {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
    cursor: pointer;
  }

  /* Milestone Checklist */
  .milestone-track {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .milestone-step {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .step-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  .milestone-step.done .step-check {
    background-color: var(--color-success-container);
    color: var(--color-success);
    font-weight: 700;
  }

  .milestone-step.current .step-check {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    font-weight: 800;
  }

  .milestone-step.upcoming .step-check {
    background-color: var(--color-surface-container-high);
    color: var(--color-outline);
  }

  .step-title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-surface);
    display: block;
  }

  .step-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: block;
  }

  .incubation-pill {
    font-size: 0.6875rem;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  /* =================================================== */
  /* ORDERS TAB STYLES */
  /* =================================================== */
  .filter-tabs-bar {
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: 0.5rem;
  }

  .status-tab-group {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .tab-btn {
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-outline-variant);
    background: transparent;
    color: var(--color-on-surface-variant);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .tab-btn:hover {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  .tab-btn.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
  }

  .orders-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    padding: 0.4rem 0.75rem;
    gap: 0.5rem;
    flex: 1;
    min-width: 260px;
  }

  .search-icon {
    font-size: 18px;
    color: var(--color-outline);
  }

  .search-input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 0.8125rem;
    color: var(--color-on-surface);
  }

  .btn-clear-search {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-outline);
    display: flex;
  }

  .order-cards-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .order-full-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-subtle);
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .order-full-card:hover {
    border-color: var(--color-primary-fixed-dim);
    box-shadow: var(--shadow-card);
  }

  .ofc-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-surface-container-low);
    padding: 0.65rem 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .ofc-header-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
  }

  .ofc-id {
    color: var(--color-primary);
    font-size: 0.875rem;
  }

  .ofc-time {
    color: var(--color-outline);
  }

  .badge-payment {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
    font-size: 0.625rem;
    color: var(--color-on-surface-variant);
  }

  .ofc-body {
    padding: 1.25rem;
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    gap: 1.25rem;
    align-items: center;
  }

  .ofc-customer {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .avatar-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .cust-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .cust-meta {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: block;
    margin-bottom: 0.35rem;
  }

  .wa-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.6875rem;
    color: #128c7e;
    text-decoration: none;
    font-weight: 600;
  }

  .wa-btn:hover {
    text-decoration: underline;
  }

  .item-tag-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.35rem;
  }

  .item-name {
    font-size: 0.875rem;
    color: var(--color-on-surface);
  }

  .item-qty {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.1rem 0.35rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
  }

  .pickup-info-box {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .pickup-v {
    color: var(--color-on-surface);
    font-weight: 600;
  }

  .pin-badge {
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 800;
  }

  .buyer-notes {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    background-color: #fff9e6;
    border-left: 3px solid var(--color-secondary);
    padding: 0.3rem 0.6rem;
    border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
    font-size: 0.6875rem;
    color: #664d03;
    margin-top: 0.5rem;
  }

  .ofc-pricing-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.65rem;
  }

  .price-wrap {
    text-align: right;
  }

  .price-value {
    font-size: 1.125rem;
    display: block;
  }

  .action-buttons-group {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn-act-primary {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .btn-act-primary:hover {
    background-color: var(--color-primary-hover);
  }

  .btn-act-success {
    background-color: var(--color-success);
    color: white;
    border: none;
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .btn-act-outline {
    background: transparent;
    border: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface-variant);
    padding: 0.4rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .btn-act-outline:hover {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  .empty-state-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px dashed var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 3rem 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-icon {
    font-size: 48px;
    color: var(--color-outline);
    opacity: 0.6;
  }

  .empty-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .empty-sub {
    font-size: 0.8125rem;
    color: var(--color-outline);
  }

  .btn-reset-filter {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    border: none;
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  /* =================================================== */
  /* REVENUE TAB STYLES */
  /* =================================================== */
  .payout-banner-hero {
    background: linear-gradient(135deg, #000666 0%, #001280 100%);
    color: white;
    padding: 1.75rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 6, 102, 0.25);
    flex-wrap: wrap;
  }

  .pbh-badge {
    font-size: 0.6875rem;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 0.2rem 0.6rem;
    border-radius: var(--radius-full);
    display: inline-block;
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .pbh-balance {
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }

  .pbh-details {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    opacity: 0.85;
    flex-wrap: wrap;
  }

  .btn-payout-cta {
    background-color: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.15s ease;
  }

  .btn-payout-cta:hover {
    background-color: var(--color-secondary-hover);
    transform: translateY(-1px);
  }

  .fin-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .fin-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1rem 1.25rem;
    box-shadow: var(--shadow-subtle);
  }

  .fin-k {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: block;
    margin-bottom: 0.35rem;
  }

  .fin-v {
    font-size: 1.25rem;
    font-weight: 800;
    display: block;
    margin-bottom: 0.2rem;
  }

  .fin-sub {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .cat-revenue-box {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    box-shadow: var(--shadow-subtle);
  }

  .cat-bars {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-top: 1rem;
  }

  .cat-bar-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }

  .cat-bar-track {
    height: 8px;
    background-color: var(--color-surface-container-high);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .cat-bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
  }

  .ledger-card {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-subtle);
    overflow: hidden;
  }

  .ledger-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .method-tag {
    background-color: var(--color-surface-container-low);
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
  }

  /* Table styling */
  .table-wrapper {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.75rem;
    text-align: left;
  }

  .data-table th {
    background-color: var(--color-surface-container-low);
    color: var(--color-outline);
    padding: 0.75rem 1rem;
    font-weight: 700;
    border-bottom: 1px solid var(--color-outline-variant);
    white-space: nowrap;
  }

  .data-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--color-outline-variant);
    vertical-align: middle;
  }

  .data-table tr:hover td {
    background-color: var(--color-surface-container-low);
  }

  /* =================================================== */
  /* GROWTH TAB STYLES */
  /* =================================================== */
  .funnel-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .funnel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: 0.35rem;
  }

  .step-num {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    margin-right: 0.5rem;
  }

  .funnel-bar {
    height: 12px;
    background-color: var(--color-surface-container-high);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .funnel-fill {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  .demo-bars {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-top: 1rem;
  }

  .demo-row {
    display: grid;
    grid-template-columns: 180px 1fr 45px;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
  }

  .demo-bar-track {
    height: 8px;
    background-color: var(--color-surface-container-high);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .demo-bar-fill {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: var(--radius-full);
  }

  .channel-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-top: 1rem;
  }

  .channel-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-sm);
  }

  .channel-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .channel-info {
    flex: 1;
  }

  .channel-name {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--color-on-surface);
    display: block;
  }

  .channel-desc {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: block;
  }

  /* =================================================== */
  /* BUSINESS DATA TAB STYLES */
  /* =================================================== */
  .biz-profile-hero {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    box-shadow: var(--shadow-subtle);
  }

  .bph-avatar {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-md);
    background-color: var(--color-primary-fixed);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .bph-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .badge-verified {
    background-color: var(--color-success-container);
    color: var(--color-success);
    font-size: 0.6875rem;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
  }

  .bph-tagline {
    font-size: 0.875rem;
    color: var(--color-on-surface-variant);
    margin: 0.25rem 0 0.5rem;
  }

  .bph-meta {
    font-size: 0.75rem;
    color: var(--color-outline);
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border-bottom: 1px solid var(--color-outline-variant);
    padding-bottom: 0.5rem;
  }

  .detail-k {
    font-size: 0.6875rem;
    color: var(--color-outline);
    font-weight: 700;
  }

  .detail-v {
    font-size: 0.8125rem;
    color: var(--color-on-surface);
  }

  .status-tag {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.2rem 0.5rem;
    border-radius: var(--radius-xs);
  }

  .tag-good {
    background-color: #e6f4ea;
    color: #137333;
  }

  .tag-warning {
    background-color: #fff3e0;
    color: #e65100;
  }

  .tag-error {
    background-color: #ffebee;
    color: #c62828;
  }

  .mentors-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .mentor-card-item {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    padding: 0.85rem;
    background-color: var(--color-surface-container-low);
    border-radius: var(--radius-sm);
  }

  .mentor-icon-box {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-xs);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .mentor-role {
    font-size: 0.625rem;
    color: var(--color-outline);
    font-weight: 700;
    display: block;
  }

  .mentor-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-on-surface);
  }

  .mentor-nip {
    font-size: 0.6875rem;
    color: var(--color-outline);
    display: block;
    margin-bottom: 0.4rem;
  }

  .btn-sm-action {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    color: var(--color-primary);
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-xs);
    cursor: pointer;
  }

  .btn-sm-action:hover {
    background-color: var(--color-primary-fixed);
  }

  .legal-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .legal-badge-card {
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .legal-title {
    font-size: 0.75rem;
    font-weight: 700;
    display: block;
    color: var(--color-on-surface);
  }

  .legal-code {
    font-size: 0.6875rem;
    color: var(--color-primary);
    display: block;
    margin-bottom: 0.25rem;
  }

  .legal-status {
    font-size: 0.625rem;
    font-weight: 700;
  }

  /* =================================================== */
  /* INVENTORY TAB STYLES */
  /* =================================================== */
  .cat-pill {
    background-color: var(--color-surface-container-low);
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
  }

  .inline-qty-control {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xs);
    background-color: var(--color-surface-container-lowest);
    overflow: hidden;
  }

  .btn-stock-adj {
    background: none;
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 800;
    color: var(--color-primary);
  }

  .btn-stock-adj:hover:not(:disabled) {
    background-color: var(--color-primary-fixed);
  }

  .btn-stock-adj:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .stock-qty-val {
    min-width: 24px;
    text-align: center;
    font-size: 0.75rem;
  }

  .stock-status-tag {
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.2rem 0.45rem;
    border-radius: var(--radius-xs);
    text-transform: uppercase;
  }

  .btn-restock {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-restock:hover {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-icon-action {
    background: none;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    color: var(--color-outline);
    display: inline-flex;
    align-items: center;
    border-radius: var(--radius-xs);
  }

  .btn-icon-action:hover {
    background-color: var(--color-surface-container-high);
    color: var(--color-primary);
  }

  /* =================================================== */
  /* MODAL SHARED STYLES */
  /* =================================================== */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 1rem;
  }

  .modal-box {
    background-color: var(--color-surface-container-lowest);
    border-radius: var(--radius-md);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid var(--color-outline-variant);
  }

  .modal-box-lg {
    max-width: 650px;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .modal-heading {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .btn-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-outline);
    display: flex;
    padding: 0.25rem;
    border-radius: var(--radius-xs);
  }

  .btn-close:hover {
    background-color: var(--color-surface-container-low);
  }

  .modal-body, .modal-form {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-on-surface);
  }

  .form-input, .form-textarea {
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-outline-variant);
    background-color: var(--color-surface-container-lowest);
    font-size: 0.8125rem;
    color: var(--color-on-surface);
    outline: none;
  }

  .form-input:focus, .form-textarea:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-fixed);
  }

  .amount-quick-chips {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.35rem;
    flex-wrap: wrap;
  }

  .chip-btn {
    background-color: var(--color-surface-container-low);
    border: 1px solid var(--color-outline-variant);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-xs);
    font-size: 0.6875rem;
    cursor: pointer;
  }

  .chip-all {
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    font-weight: 700;
  }

  .balance-preview-box {
    background-color: var(--color-surface-container-low);
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
  }

  .info-alert {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--color-primary-fixed);
    color: var(--color-primary);
    padding: 0.65rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.6875rem;
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
    font-weight: 600;
    cursor: pointer;
  }

  .btn-submit {
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
  }

  /* Receipt Timeline & Table */
  .receipt-timeline {
    display: flex;
    justify-content: space-between;
    background-color: var(--color-surface-container-low);
    padding: 0.85rem;
    border-radius: var(--radius-sm);
    margin-bottom: 0.5rem;
  }

  .rtl-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    text-align: center;
  }

  .rtl-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6875rem;
    font-weight: 700;
  }

  .rtl-step.done .rtl-dot {
    background-color: var(--color-success);
    color: white;
  }

  .rtl-step.current .rtl-dot {
    background-color: var(--color-primary);
    color: white;
  }

  .rtl-step.upcoming .rtl-dot {
    background-color: var(--color-surface-container-high);
    color: var(--color-outline);
  }

  .receipt-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 0.85rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
  }

  .rg-col {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.75rem;
  }

  .rg-k {
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .receipt-items-table {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .rit-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    padding: 0.6rem 0.85rem;
    font-size: 0.75rem;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .rit-head {
    background-color: var(--color-surface-container-low);
    font-weight: 700;
    color: var(--color-outline);
  }

  .rit-total {
    background-color: var(--color-surface-container-low);
    border-bottom: none;
    font-size: 0.8125rem;
  }

  .receipt-footer-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  /* Form Grid */
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .full-width {
    grid-column: 1 / -1;
  }

  /* Utilities */
  .flex-row { display: flex; }
  .items-center { align-items: center; }
  .justify-end { justify-content: flex-end; }
  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .flex-wrap { flex-wrap: wrap; }
  .text-xs { font-size: 0.75rem; }
  .text-right { text-align: right; }
  .text-center { text-align: center; }
  .text-primary { color: var(--color-primary); }
  .text-secondary { color: var(--color-secondary); }
  .text-success { color: var(--color-success); }
  .text-error { color: var(--color-error); }
  .text-outline { color: var(--color-outline); }
  .bg-primary { background-color: var(--color-primary); }
  .bg-secondary { background-color: var(--color-secondary); }
  .bg-success { background-color: var(--color-success); }
  .bg-outline { background-color: var(--color-outline); }
  .bg-primary-fixed { background-color: var(--color-primary-fixed); }
  .bg-secondary-fixed { background-color: var(--color-secondary-fixed); }
  .bg-secondary-container { background-color: var(--color-secondary-container); }
  .text-on-secondary-container { color: var(--color-on-secondary-container); }

  /* Responsive Breakpoints */
  @media (max-width: 1024px) {
    .kpi-grid, .fin-cards-grid, .legal-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .middle-grid, .summary-bottom-grid {
      grid-template-columns: 1fr;
    }
    .ofc-body {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .ofc-pricing-action {
      align-items: flex-start;
    }
  }

  @media (max-width: 640px) {
    .kpi-grid, .fin-cards-grid, .legal-grid, .form-row, .receipt-grid, .form-grid {
      grid-template-columns: 1fr;
    }
    .demo-row {
      grid-template-columns: 1fr;
      gap: 0.25rem;
    }
    .view-title {
      font-size: 1.25rem;
    }
    .pbh-balance {
      font-size: 1.75rem;
    }
  }
</style>
