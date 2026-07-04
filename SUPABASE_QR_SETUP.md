# 🔐 Panduan Setup QR Code Tracking dengan Supabase

## Status Saat Ini ✅

Konfigurasi Supabase sudah:
- ✅ Tersambung ke project: `qneymdunezljptbxgaxq.supabase.co`
- ✅ Tabel `orders` sudah dibuat dengan RLS yang tepat
- ✅ Realtime tracking sudah enabled
- ✅ QR code dapat di-scan dari halaman publik `/track/:orderId`

---

## 🚀 Untuk Development (Localhost)

**Tidak perlu konfigurasi tambahan.** URL QR akan otomatis jadi:
```
http://localhost:5173/track/ORD-1234
```

Cukup jalankan:
```bash
npm run dev
```

---

## 🌐 Untuk Production (Deploy)

### Step 1: Update `.env` dengan URL Production

Ganti `VITE_APP_URL` di file `.env`:

```env
# Sebelum:
VITE_APP_URL=http://localhost:5173

# Sesudah (contoh jika deploy ke Vercel):
VITE_APP_URL=https://laundry-app.vercel.app

# Atau jika deploy ke domain sendiri:
VITE_APP_URL=https://nettolaundry.com
```

### Step 2: Rebuild & Deploy

```bash
# Build untuk production
npm run build

# Deploy (tergantung platform)
# - Vercel: git push (otomatis deploy)
# - Netlify: drag & drop folder dist/
# - Custom server: copy dist/ ke server
```

### Step 3: Verifikasi QR Code Berfungsi

1. **Buka halaman admin** → `/orders/add`
2. **Buat order baru** → klik "Proses Nota & Tampilkan Invoice"
3. **Scan QR code** dengan handphone
   - QR seharusnya mengarah ke: `https://yourdomain.com/track/ORD-XXXX`
   - Halaman tracking harusnya tampil tanpa error

---

## ⚠️ Troubleshooting

### ❌ "QR Code Link Tidak Berfungsi" / "Halaman Tidak Ditemukan"

**Penyebab:** URL di QR masih localhost

**Solusi:**
```bash
# 1. Pastikan .env sudah diupdate dengan VITE_APP_URL production
# 2. Build ulang:
npm run build

# 3. Deploy ulang dengan build terbaru
```

### ❌ "Error: Supabase Connection Failed"

**Penyebab:** Credentials Supabase tidak valid

**Solusi:**
```bash
# Pastikan di .env ada:
VITE_SUPABASE_URL=https://qneymdunezljptbxgaxq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ "QR Tidak Bisa Dibuka dari Handphone Customer"

**Kemungkinan:**
1. Domain production belum domain publik
2. Firewall/router memblokir akses
3. SSL certificate tidak valid

**Solusi:**
- Gunakan domain publik yang dapat diakses dari mana saja
- Test dengan buka URL manual di handphone sebelum generate QR

---

## 📱 Testing QR Code

### Local Testing (Simulasi Production):

```bash
# Terminal 1: Jalankan dev server
npm run dev

# Terminal 2: Akses via external IP
# Contoh jika IP lokal: 192.168.1.100
http://192.168.1.100:5173
# Update VITE_APP_URL ke IP tersebut untuk test
```

### Production Testing:

1. Buat order test di admin page
2. Copy URL dari QR code
3. Buka di browser handphone yang berbeda
4. Pastikan halaman tracking loading tanpa error

---

## 🔗 URLs yang Harus Diperhatikan

| Halaman | Untuk Siapa | Publik? |
|---------|------------|--------|
| `/track/:orderId` | Customer (scan QR) | ✅ Ya |
| `/orders/add` | Admin | ❌ Perlu login |
| `/tracking` | Admin (lihat semua) | ❌ Perlu login |

---

## 💾 Environment Variables Lengkap

```env
# Supabase
VITE_SUPABASE_URL=https://qneymdunezljptbxgaxq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application Base URL (untuk QR tracking)
VITE_APP_URL=http://localhost:5173  # Dev
# VITE_APP_URL=https://yourdomain.com  # Production
```

---

## ✨ Tips

- **Jangan commit `.env` ke git** — gunakan `.env.example` sebagai template
- **Ganti `VITE_APP_URL` per environment** — dev vs production berbeda
- **Test QR code dari multiple devices** — pastikan semua bisa akses
- **Monitor Supabase realtime** — cek di dashboard jika order ter-sync

---

**Pertanyaan?** Cek `README.md` atau lihat error log di browser console (F12).
