# Spesifikasi Teknis: FEB Business Ecosystem eXperience Platform (FEB-X)

## 1. User Stories & Product Backlog

### Modul 1: Autentikasi & Role Management (SSO & RBAC)
*   **User Story:** Sebagai pengguna, saya ingin masuk ke sistem menggunakan SSO Kampus agar proses login cepat dan aman.
*   **Acceptance Criteria:**
    *   **Given:** Pengguna berada di halaman login.
    *   **When:** Pengguna memilih opsi "Login via SSO Kampus" dan memasukkan kredensial universitas.
    *   **Then:** Sistem memvalidasi token, mencocokkan data profil dengan database lokal, menetapkan role (Mahasiswa/Dosen/Admin), dan mengarahkan ke dashboard yang relevan.

### Modul 2: Registrasi & Manajemen Bisnis (Mahasiswa)
*   **User Story:** Sebagai Mahasiswa, saya ingin mendaftarkan profil bisnis saya agar produk saya dapat dilihat oleh konsumen.
*   **Acceptance Criteria:**
    *   **Given:** Mahasiswa telah login dan belum memiliki profil bisnis yang divalidasi.
    *   **When:** Mahasiswa mengisi formulir registrasi bisnis (nama bisnis, deskripsi, kategori, legalitas/NIM) dan mengunggah dokumen pendukung.
    *   **Then:** Status bisnis menjadi "Pending Validation" dan muncul di dashboard Admin Fakultas untuk divalidasi.

### Modul 3: Core Marketplace (Konsumen)
*   **User Story:** Sebagai Konsumen, saya ingin mencari dan membeli produk untuk memenuhi kebutuhan saya.
*   **Acceptance Criteria:**
    *   **Given:** Konsumen mencari kata kunci tertentu di search bar.
    *   **When:** Konsumen memilih produk, menambah ke keranjang (cart), memilih metode pembayaran VA/QRIS, dan menekan "Checkout".
    *   **Then:** Sistem membuat invoice unik, mengurangi stok produk, dan mengirim notifikasi transaksi ke Seller (Mahasiswa).

### Modul 4: Dashboard Monitoring (Dosen/Mentor)
*   **User Story:** Sebagai Dosen Pembimbing, saya ingin melihat performa bisnis mahasiswa bimbingan saya untuk keperluan evaluasi akademik.
*   **Acceptance Criteria:**
    *   **Given:** Dosen login ke dashboard akademik.
    *   **When:** Dosen memfilter data berdasarkan kelas atau semester.
    *   **Then:** Sistem menampilkan grafik omzet, jumlah transaksi, dan rating rata-rata dari seluruh bisnis mahasiswa di bawah bimbingannya.

---

## 2. Skema Relasi Basis Data (PostgreSQL)

### Tabel Utama:
1.  **users** (id PK, sso_id, name, email, role_id FK, created_at)
2.  **roles** (id PK, role_name, permissions JSONB)
3.  **businesses** (id PK, owner_id FK, name, description, category_id FK, status, logo_url, created_at)
    *   *Index: idx_businesses_owner_id, idx_businesses_status*
4.  **products** (id PK, business_id FK, name, price, stock, description, images JSONB, created_at)
    *   *Index: idx_products_business_id*
5.  **orders** (id PK, buyer_id FK, total_amount, payment_status, shipping_address, created_at)
6.  **order_items** (id PK, order_id FK, product_id FK, quantity, price_at_purchase)
7.  **evaluations** (id PK, business_id FK, evaluator_id FK, score, feedback, created_at)

---

## 3. API Contract (RESTful JSON)

### GET /api/v1/marketplace/products
**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-1",
      "name": "Kopi Mahasiswa Premium",
      "price": 25000,
      "seller": "Bisnis Mandiri Jaya",
      "rating": 4.8,
      "stock": 50
    }
  ]
}
```

### GET /api/v1/dashboard/lecturer/monitoring
**Response:**
```json
{
  "summary": {
    "total_supervised_businesses": 15,
    "total_omzet_period": 45000000,
    "avg_growth": "12%"
  },
  "business_list": [
    {
      "id": "uuid-biz-1",
      "name": "Tech Gadget FEB",
      "owner": "Budi Santoso",
      "status": "active",
      "total_sales": 120
    }
  ]
}
```

---

## 4. Sprint Roadmap (26-30 Minggu)

### Phase 1: Discovery & System Design (Minggu 1-4)
*   Analisis kebutuhan mendalam, finalisasi ERD, UI/UX Design (High-Fidelity), dan Setup Environment (Docker, CI/CD).

### Phase 2: MVP Development - Core Engine (Minggu 5-14)
*   **Sprint 1-2:** Auth SSO & RBAC, User Profile.
*   **Sprint 3-5:** Modul Registrasi Bisnis & Katalog Produk.
*   **Sprint 6-10:** Order Processing, Cart, & Payment Gateway Integration.

### Phase 3: Analytics & Monitoring (Minggu 15-22)
*   **Sprint 11-13:** Dashboard Dosen, Admin, & Reporting Engine.
*   **Sprint 14-15:** Chat Engine & Real-time Notification (Socket.io/Firebase).

### Phase 4: QA, UAT & Optimization (Minggu 23-28)
*   Security Penetration Testing, Performance Tuning (Indexing PostgreSQL), & User Acceptance Testing (UAT) bersama civitas akademika.

### Phase 5: Deployment & Handover (Minggu 29-30)
*   Go-Live di Cloud Infrastructure, Monitoring Pasca-Release, & Dokumentasi Teknis Lengkap.
