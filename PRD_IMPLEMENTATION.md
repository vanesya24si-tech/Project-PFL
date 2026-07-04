# PANDUAN PENERAPAN PRD (PRODUCT REQUIREMENT DOCUMENT)
## NETTO LAUNDRY - SMART LAUNDRY CRM & POS LANDING PAGE

Dokumen ini menjelaskan seluruh tahapan evolusi Landing Page **Netto Laundry** mulai dari V1 (Informasi Dasar), V2 (Interactive CRM), hingga V3 (Production-Ready SaaS) yang telah sukses diterapkan ke dalam sistem.

---

## 🛠️ PENERAPAN DAN RINCIAN FITUR PRD

### 📘 PRD V1: Dasar Informasi & Perkenalan Aplikasi
Penerapan dasar untuk memperkenalkan brand Netto Laundry kepada pengunjung pertama kali. Berfokus pada struktur tata letak (layout) dan konten penting tanpa interaksi rumit.

1. **Navbar Sederhana**: Navigasi dasar yang memuat tautan cepat (Home, Features, About, Contact) dan tombol Login Admin.
2. **Hero Section**: Area promosi utama dengan headline *"Digitalisasi Operasional & Layanan Pelanggan Laundry Anda"*, sub-headline, dan CTA pendaftaran.
3. **Tentang Aplikasi**: Penjelasan singkat tentang keunggulan Netto Laundry dalam menyederhanakan urusan cuci-menyetrika pakaian.
4. **Feature Cards**: Kartu ringkasan 4 fitur utama:
   - Informasi Status Antrean
   - Otomasi Timbangan Kasir
   - Laporan Keuangan Digital
   - Program Keanggotaan/Loyalty
5. **Footer Sederhana**: Kontak dasar, email outlet, alamat pusat, dan tautan sosial media.

---

### 📙 PRD V2: Interactive CRM (Citizen/Customer Engagement)
Pengembangan interaktif yang memindahkan fokus landing page dari sekadar media bacaan menjadi sarana komunikasi dua arah antara kasir/pengelola laundry dengan pelanggan.

6. **Sticky Navbar**: Navbar dinamis yang tetap melayang (sticky) di bagian atas layar untuk mempermudah navigasi pengunjung saat melakukan scroll ke bawah.
7. **Hero Modern + Ilustrasi**: Hero dengan tambahan dekorasi visual berupa lingkaran cahaya glowing dan tata letak modern.
8. **Dashboard Preview**: Mockup panel kasir sederhana yang memajang total pelanggan terdaftar, jumlah antrean aktif, dan persentase cucian selesai.
9. **Statistics Counter**: Baris statistik dinamis berisi angka real-time mitra outlet, kapasitas mesin pengering, jumlah order bulanan, dan total warga terhubung.
10. **Problem Section**: Menvisualisasikan 4 keluhan utama pelanggan laundry konvensional (pakaian tertukar, kasir lambat, status tidak jelas, poin hilang).
11. **Solution Section**: Menjelaskan bagaimana fitur digital Netto Laundry menyelesaikan masalah-masalah tersebut secara efisien.
12. **Citizen/Customer Service (Layanan Terpadu)**: Penjelasan tentang fitur unggulan seperti status pengerjaan terlacak, otomatisasi WhatsApp, dan antar-jemput.
13. **News Preview**: Grid artikel berisi tips bermanfaat seputar cara merawat kain sutra, mencuci pakaian putih, dan kabar promo outlet.
14. **Agenda/Promo Preview**: Menampilkan jadwal penawaran aktif mingguan (Weekend discount, Happy hour, sprei sprei sprei).
15. **Testimonial Slider**: Kumpulan ulasan kepuasan dari pelanggan setia dan mitra franchise laundry.
16. **FAQ Accordion (Awal)**: Tanya-jawab interaktif seputar durasi cuci, pemisahan cucian, dan asuransi pakaian.
17. **CTA Banner**: Spanduk ajakan bertindak untuk mendigitalisasikan bisnis laundry mitra.

---

### 🟢 PRD V3: Production-Ready Smart Laundry CRM & POS
Versi final berstandar SaaS (Software-as-a-Service) premium siap produksi yang menampilkan kapabilitas otomasi penuh, simulasi fungsional, dan pemrosesan data lokal secara instan.

18. **Smart Dashboard Preview + Grafik**: Dasbor mockup premium terintegrasi dengan **Responsive Grafik Area (Recharts)** yang menggambarkan tren omzet dan berat cucian mingguan secara dinamis.
19. **CRM Workflow**: Alur siklus pengerjaan pakaian interaktif dari mulai baju kotor diserahkan (drop), ditimbang, dicuci, dikirim notifikasi WA, hingga siap diambil.
20. **Citizen/Customer Loyalty Program**: Skema keanggotaan/membership berjenjang (Regular Member, Premium Member, Corporate Partner) lengkap dengan keuntungan kupon poin.
21. **Community Engagement (Polling Varian Parfum)**: Widget jajak pendapat interaktif. Pengunjung dapat memilih varian parfum baru (Sakura, Ocean, Baby Cuddle) dan melihat grafik persentase hasil voting warga secara real-time.
22. **Notification Center**: Deskripsi sistem notifikasi WhatsApp gateway otomatis untuk pengingat cucian selesai, pengingat jemput pakaian, dan broadcast kupon belanja.
23. **Customer Service Center (Live Chat Simulator)**: Simulator obrolan bantuan interaktif. Pengunjung dapat mengetik pesan (seperti: "harga" atau "status") dan asisten chatbot akan memberikan balasan otomatis instan.
24. **Complaint Management (Klaim Cucian)**: Form interaktif untuk mengajukan klaim pakaian hilang/rusak. Setelah disubmit, laporan akan langsung masuk ke daftar log status klaim kasir secara real-time (tahap 'Diterima' / 'Diproses' / 'Selesai').
25. **Feedback Management (Kritik & Saran)**: Form penilaian di mana pengunjung dapat memberikan rating bintang ⭐ dan saran tertulis yang langsung terunggah ke panel ulasan pelanggan.
26. **Integration Grid**: Menampilkan daftar komponen teknologi pendukung yang terintegrasi (Google Maps, WhatsApp API, SQLite Room DB, SMTP Email, Firebase).
27. **FAQ Accordion (Lengkap 10 Pertanyaan)**: Komponen FAQ yang diperluas dengan **AnimatePresence** (Framer Motion) untuk efek buka-tutup akordeon yang sangat mulus.
28. **Final CTA & Footer Premium**: Banner konversi akhir berdesain modern dan footer lengkap 4 kolom berisi kontak hotline, email, alamat kantor Pasteur, dan ikon sosial media.

---

## 📈 EVOLUSI DAN PERBANDINGAN TEMA WARNA

| Elemen | PRD V1 | PRD V2 | PRD V3 (Penerapan Saat Ini) |
| :--- | :--- | :--- | :--- |
| **Tema Desain** | Informasi Dasar | Interaktif CRM | Premium SaaS CRM POS |
| **Pilihan Warna** | Polos / Default | Modern Blue-Indigo | **Laundry Fresh Blue & Sky Blue** |
| **Visualisasi** | Teks Sederhana | Mockup Static | **Glassmorphism & Grafik Recharts** |
| **Animasi** | Tidak ada | Hover Dasar | **Scroll Reveal & AnimatePresence** |
| **Fungsionalitas** | Statis | Form Kosong | **Live Chat, Polling, & Form Submit** |
