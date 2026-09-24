<script>
  import { categories } from '$lib/data/mockData.js';

  let {
    selectedCategory = 'all',
    onSelect = (categoryId) => {}
  } = $props();
</script>

<section class="categories-section">
  <div class="container">
    <div class="section-header">
      <div class="header-left">
        <span class="eyebrow-text">EXPLORE VENTURES</span>
        <h2 class="section-title">Kategori Unggulan</h2>
      </div>
      <span class="catalog-hint font-mono">Dikelola Mahasiswa Binaan FEB</span>
    </div>

    <!-- Category Pills List -->
    <div class="pills-wrapper">
      {#each categories as cat}
        <button
          type="button"
          class="pill-btn {selectedCategory === cat.id ? 'active' : ''}"
          onclick={() => onSelect(cat.id)}
        >
          <span class="material-symbols-outlined pill-icon">{cat.icon}</span>
          <span class="pill-name">{cat.name}</span>
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .categories-section {
    padding: 1.5rem 0 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .eyebrow-text {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-secondary);
    display: block;
    margin-bottom: 0.25rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .catalog-hint {
    font-size: 0.75rem;
    color: var(--color-outline);
  }

  .pills-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .pills-wrapper::-webkit-scrollbar {
    height: 4px;
  }

  .pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 1.25rem;
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-full);
    color: var(--color-on-surface);
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.15s ease;
    box-shadow: var(--shadow-subtle);
  }

  .pill-btn:hover {
    border-color: var(--color-primary);
    background-color: var(--color-surface-container-low);
    transform: translateY(-1px);
  }

  .pill-btn.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
    box-shadow: 0 4px 12px rgba(0, 6, 102, 0.2);
  }

  .pill-icon {
    font-size: 18px;
  }

  .pill-btn.active .pill-icon {
    color: var(--color-secondary-container);
  }
</style>
