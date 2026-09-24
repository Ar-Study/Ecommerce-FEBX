<script>
  import { products } from '$lib/data/mockData.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import HeroBento from '$lib/components/HeroBento.svelte';
  import ProductCatalog from '$lib/components/ProductCatalog.svelte';
  import ProductDetailModal from '$lib/components/ProductDetailModal.svelte';
  import CartDrawer from '$lib/components/CartDrawer.svelte';
  import SSOLoginModal from '$lib/components/SSOLoginModal.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { currentUser, loginUser, logoutUser } from '$lib/stores/auth.js';

  // Svelte 5 Runes State
  let selectedCategory = $state('all');
  let searchQuery = $state('');
  let cartItems = $state([]);
  let activeProductDetail = $state(null);
  let isCartOpen = $state(false);
  let isSSOLoginOpen = $state(false);
  let activeRole = $derived($currentUser);
  let toastMessage = $state(null);
  let toastTimer = null;

  // Cart count calculation
  let totalCartCount = $derived(
    cartItems.reduce((sum, item) => sum + item.quantity, 0)
  );

  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage = msg;
    toastTimer = setTimeout(() => {
      toastMessage = null;
    }, 3000);
  }

  function handleAddToCart(product, qty = 1) {
    const existingIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += qty;
      cartItems = [...cartItems];
    } else {
      cartItems = [
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          seller: product.seller,
          image: product.image,
          quantity: qty
        }
      ];
    }
    showToast(`✓ Berhasil menambahkan ${qty}x ${product.name} ke keranjang`);
  }

  function handleDirectCheckout(product, qty = 1) {
    handleAddToCart(product, qty);
    activeProductDetail = null;
    isCartOpen = true;
  }

  function handleUpdateQuantity(id, delta) {
    const index = cartItems.findIndex((item) => item.id === id);
    if (index > -1) {
      cartItems[index].quantity += delta;
      if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
      }
      cartItems = [...cartItems];
    }
  }

  function handleRemoveItem(id) {
    cartItems = cartItems.filter((item) => item.id !== id);
    showToast('Item telah dihapus dari keranjang.');
  }

  function handleClearCart() {
    cartItems = [];
  }

  function handleLoginSuccess(role) {
    loginUser(role);
    showToast(`Selamat datang, ${role.name}! Anda terhubung dengan SSO FEB.`);
  }

  function handleNavigateSection(sectionId) {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
</script>

<svelte:head>
  <title>FEB-X | FEB Business Ecosystem eXperience</title>
</svelte:head>

<!-- Top Navbar -->
<Navbar
  cartCount={totalCartCount}
  bind:searchQuery
  onOpenCart={() => isCartOpen = true}
  onOpenLogin={() => isSSOLoginOpen = true}
  onNavigateSection={handleNavigateSection}
/>

<!-- User Status Bar (if logged in via SSO) -->
{#if activeRole}
  <div class="active-role-bar font-mono">
    <div class="container role-bar-inner">
      <div class="role-info">
        <span class="material-symbols-outlined text-sm icon-fill">verified_user</span>
        <span>SESI AKTIF: {activeRole.name.toUpperCase()} ({activeRole.badge})</span>
      </div>
      <div class="role-bar-actions">
        <a href="/dashboard" class="btn-goto-dash font-mono">
          <span class="material-symbols-outlined text-xs">dashboard</span>
          <span>Buka Dashboard</span>
        </a>
        <button
          type="button"
          class="role-switch-btn"
          onclick={() => isSSOLoginOpen = true}
        >
          Ganti Role
        </button>
        <button
          type="button"
          class="role-switch-btn"
          onclick={() => { logoutUser(); showToast('Anda telah logout dari sesi.'); }}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Toast Notification -->
{#if toastMessage}
  <div class="toast-popup font-mono" role="status" aria-live="polite">
    <span class="material-symbols-outlined text-sm">notifications_active</span>
    <span>{toastMessage}</span>
  </div>
{/if}

<main class="page-content">
  <!-- Bento Hero Section -->
  <HeroBento
    onExploreCatalog={() => handleNavigateSection('catalog')}
    onOpenRegister={() => isSSOLoginOpen = true}
  />

  <!-- Product & Venture Catalog with Integrated Category Filter & Search -->
  <ProductCatalog
    {products}
    bind:selectedCategory
    bind:searchQuery
    onSelectProduct={(prod) => activeProductDetail = prod}
    onAddToCart={handleAddToCart}
  />
</main>

<!-- Footer -->
<Footer />

<!-- Modals & Drawers -->
<ProductDetailModal
  product={activeProductDetail}
  isOpen={activeProductDetail !== null}
  onClose={() => activeProductDetail = null}
  onAddToCart={handleAddToCart}
  onDirectCheckout={handleDirectCheckout}
/>

<CartDrawer
  isOpen={isCartOpen}
  {cartItems}
  onClose={() => isCartOpen = false}
  onUpdateQuantity={handleUpdateQuantity}
  onRemoveItem={handleRemoveItem}
  onClearCart={handleClearCart}
/>

<SSOLoginModal
  isOpen={isSSOLoginOpen}
  onClose={() => isSSOLoginOpen = false}
  onLoginSuccess={handleLoginSuccess}
/>

<style>
  .page-content {
    flex: 1;
  }

  .active-role-bar {
    background-color: var(--color-primary-container);
    color: var(--color-primary-fixed);
    border-bottom: 1px solid var(--color-primary);
    padding: 0.45rem 0;
    font-size: 0.75rem;
    animation: fadeIn 0.2s ease;
  }

  .role-bar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .role-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .role-bar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-goto-dash {
    background: var(--color-secondary-container);
    color: var(--color-on-secondary-container);
    font-size: 0.6875rem;
    padding: 0.25rem 0.625rem;
    border-radius: var(--radius-xs);
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: all 0.15s ease;
  }

  .btn-goto-dash:hover {
    background: var(--color-secondary-hover);
  }

  .role-switch-btn {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: 0.6875rem;
    padding: 0.25rem 0.6rem;
    border-radius: var(--radius-xs);
    cursor: pointer;
    font-weight: 600;
  }

  .role-switch-btn:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  /* Toast Notification */
  .toast-popup {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 120;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    box-shadow: var(--shadow-modal);
    border-left: 4px solid var(--color-secondary-container);
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 640px) {
    .toast-popup {
      left: 16px;
      right: 16px;
      bottom: 16px;
      justify-content: center;
      text-align: center;
    }
  }
</style>
