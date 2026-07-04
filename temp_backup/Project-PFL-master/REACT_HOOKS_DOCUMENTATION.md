# 📚 Dokumentasi React Hooks pada Project CRM Netto Laundry
**Pertemuan 12 - Penjelasan 5W+1H React Hooks (useState, useEffect, useRef)**

---

## 🔵 A. useState - State Management

### What (Apa)
`useState` adalah Hook React yang memungkinkan kita **menambahkan state (variabel yang bisa berubah) ke dalam functional component**. 

**Implementasi pada Project CRM:**
Di file `src/components/Header.jsx`, kami menggunakan `useState` untuk mengelola status apakah profile dropdown admin terbuka atau tertutup:
```javascript
const [isProfileOpen, setIsProfileOpen] = useState(false);
```

Di file `src/pages/Tracking.jsx`, kami menggunakan `useState` untuk mengelola beberapa state sekaligus:
- **searchQuery**: menyimpan input pencarian pesanan
- **activePrintOrder**: menyimpan pesanan mana yang sedang dicetak
- **showUnpaidOnly**: boolean untuk filter pesanan yang belum dibayar
- **tracks**: menyimpan data array semua pesanan tracking laundry

Contoh lengkap dari Tracking.jsx:
```javascript
const [searchQuery, setSearchQuery] = useState("");
const [activePrintOrder, setActivePrintOrder] = useState(null);
const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
const [tracks, setTracks] = useState(initialTracks);
```

### Why (Mengapa)
`useState` diperlukan karena **functional component di React tidak bisa menyimpan state tanpa Hook**. Sebelum React Hooks (versi <16.8), hanya class component yang bisa menggunakan state. Dengan `useState`, kita bisa:
1. **Menyimpan data dinamis** yang bisa berubah saat user berinteraksi
2. **Re-render component** otomatis saat state berubah
3. **Membuat functional component lebih powerful** tanpa perlu class syntax yang kompleks

### Who (Siapa)
**User yang terpengaruh:**
- **Admin** → merasakan dampak ketika membuka/menutup profile dropdown di Header
- **Admin saat tracking pesanan** → bisa mencari pesanan berdasarkan ID/nama pelanggan
- **Admin filter pembayaran** → bisa melihat hanya pesanan yang belum dibayar saja

### When (Kapan)
State di `useState` berubah ketika:
1. **User klik tombol/switch** → `setIsProfileOpen(!isProfileOpen)`
2. **User mengetik di search box** → `setSearchQuery(input)`
3. **User klik tombol "Lanjut ke Langkah Berikutnya"** → status pesanan naik dari "Antre" ke "Cuci"
4. **User aktifkan filter** → `setShowUnpaidOnly(true)`

Setiap kali state berubah, React otomatis **re-render component** dengan nilai state baru.

### Where (Di mana)
**Lokasi penggunaan di Project CRM:**
| File | Implementasi |
|------|-------------|
| `src/components/Header.jsx` | Dropdown profile admin (isProfileOpen) |
| `src/pages/Tracking.jsx` | Search pesanan, filter, active print order |
| `src/pages/AddOrder.jsx` | Form input: nama pelanggan, phone, weight, dll |
| `src/pages/Dashboard.jsx` | Search member, selected period |
| `src/pages/Notifications.jsx` | Active preview template, templates array |
| `src/layouts/MainLayout.jsx` | Sidebar collapsed state |
| `src/pages/auth/Login.jsx` | Form input email & password |

### How (Bagaimana)
**Mekanisme kerja useState dalam aplikasi CRM:**

**Contoh dari Header.jsx - Profile Dropdown:**
```javascript
// 1. Declare state
const [isProfileOpen, setIsProfileOpen] = useState(false);

// 2. Render UI berdasarkan state
return (
  <button 
    onClick={() => setIsProfileOpen(!isProfileOpen)}
    className="profile-btn"
  >
    {admin.name}
  </button>
  
  {isProfileOpen && (  // Hanya tampil jika state = true
    <div className="dropdown-menu">
      <a href="/profile">Profil</a>
      <a href="/settings">Pengaturan</a>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
);
```

**Flow Dampak pada UI:**
```
User klik tombol profile
         ↓
setIsProfileOpen(true) dipanggil
         ↓
State berubah dari false → true
         ↓
Component re-render
         ↓
Dropdown menu muncul (isProfileOpen === true)
         ↓
User klik lagi / klik luar area
         ↓
setIsProfileOpen(false) dipanggil
         ↓
Dropdown menu hilang
```

**Contoh dari Tracking.jsx - Real-time Search:**
```javascript
const [searchQuery, setSearchQuery] = useState("");

// Input field
<input 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Cari ID pesanan atau nama pelanggan..."
/>

// List pesanan tersaring
const filteredTracks = tracks.filter(t => 
  t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  t.user.toLowerCase().includes(searchQuery.toLowerCase())
);

// Render hanya pesanan yang cocok
{filteredTracks.map(track => <OrderCard key={track.id} data={track} />)}
```

---

## 🟡 B. useEffect - Side Effects & Lifecycle

### What (Apa)
`useEffect` adalah Hook React yang memungkinkan kita **menjalankan "side effects" (efek samping) di functional component**, yaitu kode yang ingin kita lakukan **setelah component render**.

**Implementasi pada Project CRM:**
Di file `src/components/Header.jsx`, kami menggunakan `useEffect` untuk **mendeteksi klik di luar area dropdown dan menutupnya otomatis**:

```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

### Why (Mengapa)
`useEffect` diperlukan karena **ada aksi yang harus terjadi di luar logic render component**, seperti:
1. **Event listener setup** → mendengarkan klik user di document
2. **Data fetching** → mengambil data dari API
3. **Timer/Interval** → menjalankan fungsi setiap X detik
4. **DOM manipulation langsung** → mengubah element HTML secara langsung
5. **Cleanup resource** → membersihkan memory saat component unmount

Di Header.jsx, kita **butuh mendengarkan event global "mousedown"** untuk tahu kapan user klik di mana saja di halaman, lalu tutup dropdown jika klik di luar.

### Who (Siapa)
**User yang terpengaruh:**
- **Admin** → pengalaman lebih baik karena dropdown otomatis tertutup saat klik di tempat lain
- **End user** → tidak perlu secara eksplisit klik tombol close, cukup klik di area lain

### When (Kapan)
`useEffect` **dijalankan:**
1. **Setelah component pertama kali render** (dependency array `[]` kosong)
2. **Setelah component update** (jika ada dependency berubah)
3. **Sebelum component unmount** (cleanup function)

Untuk kode di Header.jsx dengan `[]` dependency array kosong:
```javascript
useEffect(() => {
  // JALANKAN HANYA SEKALI: saat component pertama kali mount
  document.addEventListener("mousedown", handleClickOutside);
  
  // CLEANUP: saat component unmount
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []); // Kosong = hanya jalankan 1x saat mount
```

Timeline eksekusi:
```
Component Header dimount
         ↓
JSX di-render ke DOM
         ↓
useEffect() dijalankan (karena [] dependency)
         ↓
Event listener "mousedown" di-attach ke document
         ↓
[User interaksi di halaman...]
         ↓
Component unmount
         ↓
Cleanup function jalankan: removeEventListener()
         ↓
Memory terbersihkan (tidak ada memory leak)
```

### Where (Di mana)
**Lokasi penggunaan di Project CRM:**
| File | Implementasi useEffect |
|------|----------------------|
| `src/components/Header.jsx` | Click outside detection untuk close dropdown |
| `src/pages/Laporan.jsx` | Load html2pdf library sebelum export PDF |
| Potensial di semua pages | Data fetch dari API/database |

### How (Bagaimana)
**Mekanisme kerja useEffect - Click Outside Detection:**

**Kode lengkap dari Header.jsx:**
```javascript
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ⭐ useEffect untuk setup event listener
  useEffect(() => {
    // 1. Fungsi handler ketika ada mousedown event
    const handleClickOutside = (event) => {
      // Cek apakah click target BUKAN bagian dari dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false); // Tutup dropdown
      }
    };

    // 2. Attach event listener ke document
    document.addEventListener("mousedown", handleClickOutside);

    // 3. Return cleanup function (dipanggil saat unmount)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // [] = jalankan sekali saat mount

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
        Profil Admin
      </button>
      {isProfileOpen && (
        <div className="dropdown-menu">
          {/* Menu items... */}
        </div>
      )}
    </div>
  );
}
```

**User Experience Flow:**
```
User klik tombol profil
         ↓
setIsProfileOpen(true)
         ↓
Dropdown menu muncul ✓
         ↓
User klik OUTSIDE dropdown area
         ↓
handleClickOutside() dipanggil via useEffect
         ↓
setIsProfileOpen(false)
         ↓
Dropdown menu hilang otomatis ✓
```

**Mengapa Cleanup Function Penting:**
```javascript
useEffect(() => {
  document.addEventListener(...);
  
  // ⚠️ TANPA cleanup:
  // Setiap kali component re-render, listener baru ditambah
  // → Memory leak! Ada 100 listener tertempel.
  
  // ✅ DENGAN cleanup:
  return () => document.removeEventListener(...);
  // → Listener lama dihapus sebelum listener baru ditambah
  // → Selalu hanya 1 listener aktif
}, []);
```

---

## 🟢 C. useRef - Direct DOM Access

### What (Apa)
`useRef` adalah Hook React yang memungkinkan kita **membuat reference (referensi) ke element DOM atau nilai yang persisten antar render** tanpa menyebabkan re-render.

**Implementasi pada Project CRM:**
Di file `src/components/Header.jsx`, kami menggunakan `useRef` untuk **menyimpan referensi ke elemen dropdown HTML**:

```javascript
const dropdownRef = useRef(null);

// Digunakan di JSX:
<div ref={dropdownRef}>
  {/* Dropdown menu content */}
</div>

// Diakses di useEffect:
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  setIsProfileOpen(false);
}
```

Di file `src/pages/Laporan.jsx`, kami menggunakan `useRef` untuk **menyimpan referensi ke container yang akan di-export ke PDF**:
```javascript
const reportRef = useRef(null);

const exportReportToPdf = async () => {
  const el = reportRef.current || document.getElementById('crm-report-area');
  // ... generate PDF dari element ini
};
```

### Why (Mengapa)
`useRef` diperlukan karena **ada kasus di mana kita butuh akses langsung ke DOM element, bukan hanya nilai state**:

1. **Mendeteksi klik di luar element** → butuh tahu exact element DOM yang diklik
2. **Focus/Blur input** → `inputRef.current.focus()`
3. **Play/Pause media** → `videoRef.current.play()`
4. **Trigger print** → `printRef.current`
5. **Mengakses value DOM** → `inputRef.current.value`

**Perbedaan useState vs useRef:**
```javascript
// ❌ Tidak tepat pakai useState:
const [dropdownEl, setDropdownEl] = useState(null);
// Setiap kali set element, component re-render (tidak efisien)

// ✅ Tepat pakai useRef:
const dropdownRef = useRef(null);
// Reference tidak cause re-render, pure akses DOM
```

### Who (Siapa)
**User yang terpengaruh:**
- **Admin** → bisa close dropdown dengan klik di area lain (via click-outside detection)
- **Admin saat report** → bisa export laporan ke PDF dengan kualitas baik
- **Developer/QA** → bisa test DOM behavior lebih mudah

### When (Kapan)
`useRef` diakses:
1. **Setelah component render** (ref.current tersedia)
2. **Dalam event handler** → `if (ref.current.contains(event.target))`
3. **Dalam useEffect** → untuk setup DOM manipulation
4. **Setelah conditional rendering** → pastikan element sudah ada di DOM

**Beda dengan useState yang re-render:**
```javascript
const [count, setCount] = useState(0);
// Setiap setCount() → component re-render

const countRef = useRef(0);
countRef.current = countRef.current + 1;
// countRef.current berubah → TIDAK re-render
```

### Where (Di mana)
**Lokasi penggunaan di Project CRM:**
| File | Implementasi useRef |
|------|-------------------|
| `src/components/Header.jsx` | `dropdownRef` - akses dropdown element untuk click-outside |
| `src/pages/Laporan.jsx` | `reportRef` - akses report area untuk export PDF |
| Potensial lainnya | Input focus, video controls, carousel, dll |

### How (Bagaimana)
**Mekanisme kerja useRef - Click Outside Detection:**

**Kombinasi useRef + useEffect + useState:**
```javascript
import { useState, useEffect, useRef } from "react";

export default function Header() {
  // 1️⃣ useState untuk state yang butuh re-render
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 2️⃣ useRef untuk referensi DOM (tidak re-render)
  const dropdownRef = useRef(null);

  // 3️⃣ useEffect untuk setup event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Gunakan dropdownRef.current untuk akses element DOM
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    // 4️⃣ Attach ref ke elemen yang ingin diakses
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
        {admin.name}
      </button>
      
      {isProfileOpen && (
        <div className="dropdown-menu">
          <a href="/profile">Profil</a>
          <a href="/settings">Pengaturan</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
```

**Alur Deteksi Click Outside:**
```
┌─────────────────────────────────────┐
│     Document (whole page)           │
│  ┌───────────────────────────────┐  │
│  │   Div ref={dropdownRef}       │  │
│  │  ┌──────────────────────────┐ │  │
│  │  │  Profile Button          │ │  │
│  │  └──────────────────────────┘ │  │
│  │  ┌──────────────────────────┐ │  │
│  │  │  Dropdown Menu           │ │  │
│  │  │  (isProfileOpen = true)  │ │  │
│  │  └──────────────────────────┘ │  │
│  └───────────────────────────────┘  │
│           ↑ dropdownRef.current      │
└─────────────────────────────────────┘

Saat user klik:
├─ INSIDE dropdown (dalam ref) 
│  → dropdownRef.current.contains(event.target) = true
│  → Dropdown tetap terbuka
│
└─ OUTSIDE dropdown (diluar ref)
   → dropdownRef.current.contains(event.target) = false
   → setIsProfileOpen(false)
   → Dropdown tertutup otomatis ✓
```

**Contoh Lain dari Laporan.jsx - Export PDF:**
```javascript
const reportRef = useRef(null);

const exportReportToPdf = async () => {
  // Akses element DOM via ref, BUKAN via useState
  const el = reportRef.current;
  
  // Gunakan library html2pdf
  window.html2pdf()
    .set({ /* options */ })
    .from(el)
    .save();
};

return (
  <div id="crm-report-area" ref={reportRef}>
    {/* Report content yang akan di-export ke PDF */}
  </div>
);
```

---

## 📊 Perbandingan Ketiga Hooks

| Aspek | useState | useEffect | useRef |
|-------|----------|-----------|--------|
| **Purpose** | Menyimpan state | Side effects | DOM reference |
| **Cause Re-render?** | ✅ YES | ❌ NO | ❌ NO |
| **Kapan Diakses** | Render time | After render | After render |
| **Cleanup?** | - | ✅ Ya (return function) | ❌ Tidak perlu |
| **Update Value** | `setState()` | Otomatis | `ref.current =` |
| **CRM Example** | Dropdown toggle | Click listener | Dropdown element |

---

## 🎯 Summary 5W+1H untuk CRM Project

### useState: Dropdown Profile Admin
- **What**: Menyimpan status apakah dropdown terbuka/tertutup
- **Why**: Perlu track state untuk toggle UI
- **Who**: Admin user
- **When**: Saat user klik tombol profile
- **Where**: src/components/Header.jsx
- **How**: State berubah → component re-render → dropdown tampil/hilang

### useEffect: Click Outside Detection
- **What**: Menutup dropdown otomatis saat klik di luar area
- **Why**: UX lebih baik, user tidak perlu klik close button
- **Who**: Admin user
- **When**: Setup saat mount, cleanup saat unmount
- **Where**: src/components/Header.jsx
- **How**: Event listener detect click, check if outside via ref, trigger setState

### useRef: Dropdown Element Reference
- **What**: Menyimpan referensi ke dropdown DOM element
- **Why**: Butuh tahu exact element untuk deteksi click di luar
- **Who**: System (via useEffect)
- **When**: Setelah component render
- **Where**: src/components/Header.jsx
- **How**: Ref diakses di useEffect untuk check `.contains(event.target)`

---

## 💡 Best Practices

✅ **GUNAKAN useState untuk:**
- Form inputs (email, password, dll)
- Toggle UI (modal, dropdown, sidebar)
- Filter & search
- Data yang sering berubah

✅ **GUNAKAN useEffect untuk:**
- Data fetching
- Event listeners
- Timers & intervals
- DOM manipulation setelah render

✅ **GUNAKAN useRef untuk:**
- Direct DOM access
- Menyimpan nilai tanpa re-render
- Akses element untuk validation
- Modal, input focus, video player

❌ **JANGAN:**
- useRef untuk state yang perlu trigger UI update
- Banyak useEffect tanpa dependency array
- useEffect tanpa cleanup untuk event listeners
- State untuk hal yang tidak perlu re-render (gunakan useRef)

---

**Dokumentasi ini dibuat berdasarkan analisis real code dari Project CRM Netto Laundry**
