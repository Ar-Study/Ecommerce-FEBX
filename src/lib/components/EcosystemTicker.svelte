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
      <!-- Seal / Institutional Indicator with Neo-Nusantara Pattern -->
      <div class="ticker-seal">
        <div class="seal-left">
          <span class="material-symbols-outlined seal-icon icon-fill">verified</span>
          <div class="seal-meta">
            <span class="seal-title font-heading">FEB-X VERIFIED ACADEMIC LEDGER</span>
            <span class="seal-sub">Laboratorium Inkubasi Bisnis Nyata &amp; Fintech Terpadu Kampus</span>
          </div>
        </div>
        <div class="seal-badge font-mono">
          <span class="pulse-indicator"></span>
          <span>SINKRONISASI LIVE</span>
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
            <div class="metric-top-bar"></div>
            <div class="metric-header">
              <span class="metric-label font-mono">{item.label}</span>
              <span class="metric-badge font-mono">{item.badge}</span>
            </div>
            <div class="metric-value font-mono">{item.value}</div>

            {#if activeTooltip === item.id}
              <div class="metric-tooltip">
                <span class="material-symbols-outlined text-xs gold-icon">info</span>
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
    background-color: var(--color-surface-bright);
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-xl);
    box-shadow: 0 4px 20px rgba(11, 25, 56, 0.05);
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .ticker-box:hover {
    border-color: rgba(245, 158, 11, 0.4);
    box-shadow: 0 8px 28px rgba(11, 25, 56, 0.08);
  }

  .ticker-seal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1.75rem;
    background: linear-gradient(90deg, #0b1938 0%, #102450 60%, #142a5c 100%);
    background-image: var(--pattern-songket-gold);
    background-size: 32px 32px;
    background-repeat: repeat;
    color: var(--color-on-primary);
    position: relative;
    flex-wrap: wrap;
  }

  .seal-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .seal-icon {
    font-size: 22px;
    color: var(--color-secondary-container);
    filter: drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4));
  }

  .seal-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .seal-title {
    font-size: 0.8125rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #ffffff;
  }

  .seal-sub {
    font-size: 0.725rem;
    color: var(--color-secondary-fixed);
    opacity: 0.9;
  }

  .seal-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 0.25rem 0.65rem;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--color-secondary-fixed);
    backdrop-filter: blur(4px);
  }

  .pulse-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    divide-x: 1px solid var(--color-outline-variant);
  }

  .metric-cell {
    padding: 1.35rem 1.65rem;
    position: relative;
    cursor: pointer;
    background-color: var(--color-surface-bright);
    transition: all 0.2s ease;
    border-right: 1px solid var(--color-outline-variant);
    overflow: hidden;
  }

  .metric-cell:last-child {
    border-right: none;
  }

  .metric-top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    transition: background 0.2s ease;
  }

  .metric-cell:hover {
    background-color: #ffffff;
    box-shadow: inset 0 -2px 12px rgba(245, 158, 11, 0.05);
  }

  .metric-cell:hover .metric-top-bar {
    background: linear-gradient(90deg, #b45309, #f59e0b);
  }

  .metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.45rem;
  }

  .metric-label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--color-on-surface-variant);
  }

  .metric-badge {
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0.15rem 0.45rem;
    border-radius: var(--radius-xs);
    background-color: var(--color-secondary-fixed);
    color: var(--color-on-secondary-fixed);
    border: 1px solid rgba(180, 83, 9, 0.15);
  }

  .metric-value {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .metric-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 1rem;
    right: 1rem;
    z-index: 30;
    background-color: #0b1938;
    color: #ffffff;
    border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    line-height: 1.45;
    box-shadow: 0 12px 28px rgba(11, 25, 56, 0.3);
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    animation: fadeIn 0.15s ease;
  }

  .gold-icon {
    color: var(--color-secondary-container);
  }

  .metric-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 24px;
    border-width: 6px;
    border-style: solid;
    border-color: #0b1938 transparent transparent transparent;
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
    .seal-badge {
      display: none;
    }
  }
</style>
