<script>
  let currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-nusantara-ribbon"></div>
  <div class="container footer-content">
    <div class="footer-top">
      <!-- Brand column -->
      <div class="footer-brand-col">
        <div class="footer-logo">
          <span class="material-symbols-outlined icon-fill logo-icon">account_balance</span>
          <span class="logo-title font-heading">FEB-X</span>
        </div>
        <p class="brand-sub">
          FEB Business Ecosystem eXperience — Platform integrasi marketplace kewirausahaan mahasiswa, inkubator dekanat, dan laboratorium fintech akademik terpercaya.
        </p>
        <div class="accreditation-tag font-mono">
          <span class="material-symbols-outlined text-xs gold-icon">workspace_premium</span>
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
        <span class="badge-dot">•</span>
        <span>FINTECH ECOSYSTEM</span>
        <span class="badge-dot">•</span>
        <span>DEKANAT VERIFIED</span>
      </div>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background-color: #0b1938;
    background-image: 
      radial-gradient(circle at 15% 15%, rgba(245, 158, 11, 0.08) 0%, transparent 40%),
      var(--pattern-kawung-dark);
    background-repeat: no-repeat, repeat;
    background-size: auto, 60px 60px;
    color: #ffffff;
    padding: 0 0 2rem;
    margin-top: 4rem;
    position: relative;
    border-top: 1px solid rgba(245, 158, 11, 0.25);
  }

  .footer-nusantara-ribbon {
    height: 3px;
    width: 100%;
    background: linear-gradient(90deg, #0b1938 0%, #b45309 30%, #f59e0b 50%, #b45309 70%, #0b1938 100%);
    position: relative;
    overflow: hidden;
    margin-bottom: 3.5rem;
  }

  .footer-nusantara-ribbon::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--pattern-songket-gold);
    background-size: 24px 24px;
    opacity: 0.7;
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
    gap: 0.6rem;
    margin-bottom: 0.85rem;
  }

  .logo-icon {
    font-size: 28px;
    color: var(--color-secondary-container);
    filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
  }

  .logo-title {
    font-size: 1.45rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .brand-sub {
    font-size: 0.8125rem;
    line-height: 1.65;
    color: rgba(241, 245, 249, 0.75);
    margin-bottom: 1.25rem;
    max-width: 380px;
  }

  .accreditation-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-secondary-fixed);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.35);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-full);
    backdrop-filter: blur(4px);
  }

  .gold-icon {
    color: var(--color-secondary-container);
  }

  .links-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--color-secondary-container);
    margin-bottom: 1rem;
  }

  .links-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .links-list a {
    color: rgba(241, 245, 249, 0.75);
    text-decoration: none;
    font-size: 0.8125rem;
    transition: all 0.15s ease;
  }

  .links-list a:hover {
    color: var(--color-secondary-fixed);
    transform: translateX(2px);
    display: inline-block;
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-top: 1.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    font-size: 0.6875rem;
    color: rgba(241, 245, 249, 0.6);
  }

  .bottom-badges {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-secondary-fixed);
  }

  .badge-dot {
    color: rgba(245, 158, 11, 0.6);
  }

  @media (max-width: 640px) {
    .site-footer {
      padding: 0 0 1.5rem;
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
