<script>
  let currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="container footer-content">
    <div class="footer-top">
      <!-- Brand column -->
      <div class="footer-brand-col">
        <div class="footer-logo">
          <span class="material-symbols-outlined icon-fill logo-icon">account_balance</span>
          <span class="logo-title">FEB-X</span>
        </div>
        <p class="brand-sub">
          FEB Business Ecosystem eXperience — Platform integrasi marketplace kewirausahaan mahasiswa, inkubator dekanat, dan laboratorium fintech akademik.
        </p>
        <div class="accreditation-tag font-mono">
          <span class="material-symbols-outlined text-xs">verified</span>
          <span>Terakreditasi Unggul LAMEMBA &amp; AACSB Member</span>
        </div>
      </div>

      <!-- Links Column 1: Marketplace -->
      <div class="footer-links-col">
        <h4 class="links-title font-mono">MARKETPLACE</h4>
        <ul class="links-list">
          <li><a href="#catalog">Katalog Produk Baru</a></li>
          <li><a href="#catalog">Jasa Konsultasi FinTech</a></li>
          <li><a href="#catalog">Katering Sehat Mahasiswa</a></li>
          <li><a href="#catalog">Merchandise Resmi Kampus</a></li>
        </ul>
      </div>

      <!-- Links Column 2: Akademik -->
      <div class="footer-links-col">
        <h4 class="links-title font-mono">AKADEMIK &amp; RISET</h4>
        <ul class="links-list">
          <li><a href="#ecosystem">Konversi SKS Wirausaha</a></li>
          <li><a href="#ecosystem">Bimbingan Dosen Mentor</a></li>
          <li><a href="#ecosystem">Tax Center &amp; Accounting Lab</a></li>
          <li><a href="#ecosystem">Inkubator Bisnis Fakultas</a></li>
        </ul>
      </div>

      <!-- Links Column 3: Bantuan & Kontak -->
      <div class="footer-links-col">
        <h4 class="links-title font-mono">BANTUAN KAMPUS</h4>
        <ul class="links-list">
          <li><a href="#help" onclick={(e) => { e.preventDefault(); alert('Layanan Loker Pengambilan: Gedung FEB Barat Lt. 1 (Jam operasional 08:00 - 17:00 WIB)'); }}>Lokasi Pengambilan Barang</a></li>
          <li><a href="#help" onclick={(e) => { e.preventDefault(); alert('Panduan Registrasi Bisnis: Hubungi Unit Inkubator FEB.'); }}>Registrasi Toko Baru</a></li>
          <li><a href="#help" onclick={(e) => { e.preventDefault(); alert('Standar Keamanan Transaksi: QRIS & VA Kampus terjamin.'); }}>Keamanan Transaksi</a></li>
          <li><a href="#help" onclick={(e) => { e.preventDefault(); alert('Helpdesk IT: support@feb-x.ac.id'); }}>Hubungi Helpdesk IT</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom font-mono">
      <p class="copyright">
        © {currentYear} Fakultas Ekonomi &amp; Bisnis. Hak Cipta Dilindungi Undang-Undang.
      </p>
      <div class="bottom-badges">
        <span>KAMPUS MERDEKA</span>
        <span>•</span>
        <span>FINTECH ECOSYSTEM</span>
        <span>•</span>
        <span>ISO 27001 COMPLIANT</span>
      </div>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background-color: var(--color-surface-container-highest);
    border-top: 1px solid var(--color-outline-variant);
    padding: 3.5rem 0 2rem;
    margin-top: auto;
  }

  .footer-top {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2.5rem;
    margin-bottom: 2.5rem;
  }

  @media (min-width: 900px) {
    .footer-top {
      grid-template-columns: 2fr 1fr 1fr 1fr;
    }
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .logo-icon {
    font-size: 26px;
    color: var(--color-primary);
  }

  .logo-title {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
  }

  .brand-sub {
    font-size: 0.8125rem;
    line-height: 1.6;
    color: var(--color-on-surface-variant);
    margin-bottom: 1rem;
    max-width: 380px;
  }

  .accreditation-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--color-primary);
    background-color: var(--color-primary-fixed);
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-xs);
  }

  .links-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  .links-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .links-list a {
    color: var(--color-on-surface-variant);
    text-decoration: none;
    font-size: 0.8125rem;
    transition: color 0.15s ease;
  }

  .links-list a:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-outline-variant);
    font-size: 0.6875rem;
    color: var(--color-outline);
  }

  .bottom-badges {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-secondary);
  }

  @media (max-width: 640px) {
    .site-footer {
      padding: 2.5rem 0 1.5rem;
    }
    .footer-top {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .bottom-badges {
      flex-wrap: wrap;
    }
  }
</style>
