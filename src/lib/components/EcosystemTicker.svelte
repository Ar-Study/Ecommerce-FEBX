<script>
  import { ecosystemStats } from '$lib/data/mockData.js';

  let activeTooltip = $state(null);

  const tickerItems = [
    {
      id: 'omzet',
      label: 'TOTAL OMZET TERCATAT',
      value: ecosystemStats.totalOmzet,
      badge: ecosystemStats.growthPercent,
      desc: 'Akumulasi transaksi riil seluruh bisnis binaan mahasiswa semester berjalan melalui FEB-X gateway.'
    },
    {
      id: 'ventures',
      label: 'BISNIS TERVALIDASI',
      value: `${ecosystemStats.verifiedVentures} Unit Usaha`,
      badge: 'Dekanat Approved',
      desc: 'Bisnis yang telah lolos kurasi proposal kelayakan usaha, legalitas etis, dan verifikasi NIM oleh dekanat.'
    },
    {
      id: 'mentors',
      label: 'MENTOR & EVALUATOR',
      value: `${ecosystemStats.activeMentors} Dosen FEB`,
      badge: 'Akademik Terpadu',
      desc: 'Dosen pembimbing yang aktif memberikan asistensi laporan keuangan, strategi pemasaran, dan penilaian SKS kewirausahaan.'
    },
    {
      id: 'trans',
      label: 'VOLUME TRANSAKSI',
      value: `${ecosystemStats.totalTransactions} Pesanan`,
      badge: '100% Kampus Aman',
      desc: 'Transaksi jual-beli produk dan jasa terverifikasi dengan opsi ambil mandiri di loker fakultas atau pesan antar internal.'
    }
  ];
</script>

<section class="ticker-section">
  <div class="container">
    <div class="ticker-box">
      <!-- Seal / Institutional Indicator -->
      <div class="ticker-seal">
        <span class="material-symbols-outlined seal-icon icon-fill">verified</span>
        <div class="seal-meta">
          <span class="seal-title">FEB-X VERIFIED LEDGER</span>
          <span class="seal-sub">Laboratorium Bisnis Nyata &amp; Fintech Akademik</span>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        {#each tickerItems as item}
          <div
            class="metric-cell"
            role="button"
            tabindex="0"
            onmouseenter={() => activeTooltip = item.id}
            onmouseleave={() => activeTooltip = null}
            onclick={() => activeTooltip = activeTooltip === item.id ? null : item.id}
            onkeydown={(e) => e.key === 'Enter' && (activeTooltip = activeTooltip === item.id ? null : item.id)}
          >
            <div class="metric-header">
              <span class="metric-label">{item.label}</span>
              <span class="metric-badge">{item.badge}</span>
            </div>
            <div class="metric-value font-mono">{item.value}</div>

            {#if activeTooltip === item.id}
              <div class="metric-tooltip">
                <span class="material-symbols-outlined text-xs">info</span>
                <span>{item.desc}</span>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .ticker-section {
    padding: 0.5rem 0 2rem;
  }

  .ticker-box {
    background-color: var(--color-surface-container-lowest);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-ambient);
    overflow: hidden;
  }

  .ticker-seal {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  .seal-icon {
    font-size: 20px;
    color: var(--color-secondary-container);
  }

  .seal-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .seal-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-secondary-fixed);
  }

  .seal-sub {
    font-size: 0.75rem;
    color: var(--color-primary-fixed);
    opacity: 0.85;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    divide-x: 1px solid var(--color-outline-variant);
  }

  .metric-cell {
    padding: 1.25rem 1.5rem;
    position: relative;
    cursor: pointer;
    background-color: var(--color-surface-container-lowest);
    transition: background-color 0.15s ease;
    border-right: 1px solid var(--color-outline-variant);
  }

  .metric-cell:last-child {
    border-right: none;
  }

  .metric-cell:hover {
    background-color: var(--color-surface-container-low);
  }

  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }

  .metric-label {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--color-outline);
  }

  .metric-badge {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-xs);
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
  }

  .metric-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
  }

  .metric-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 1rem;
    right: 1rem;
    z-index: 30;
    background-color: var(--color-inverse-surface);
    color: var(--color-inverse-on-surface);
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    line-height: 1.4;
    box-shadow: var(--shadow-modal);
    display: flex;
    align-items: flex-start;
    gap: 0.375rem;
    animation: fadeIn 0.15s ease;
  }

  .metric-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 20px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-inverse-surface) transparent transparent transparent;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .metric-cell {
      border-right: none;
      border-bottom: 1px solid var(--color-outline-variant);
    }
    .metric-cell:last-child {
      border-bottom: none;
    }
  }
</style>
