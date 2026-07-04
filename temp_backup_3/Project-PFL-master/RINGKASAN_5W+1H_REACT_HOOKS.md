# ✅ RINGKASAN 5W+1H REACT HOOKS - Project CRM Netto Laundry

---

## 🔵 A. useState - Dynamic State Management

### 📋 Ringkasan 5W+1H

#### **What - Apa fungsi useState yang diterapkan?**
`useState` adalah React Hook untuk **menyimpan dan mengelola state (data dinamis) di functional component**. Pada Project CRM, kami menggunakan useState untuk:
- **Toggle UI elements**: Dropdown profile admin (open/close)
- **Form inputs**: Menyimpan nilai input form (nama, email, password)
- **Filtering & Search**: Menyimpan query pencarian dan filter status
- **Data arrays**: Menyimpan list pesanan, data pelanggan, template notifikasi

**Contoh konkret dari project:**
```javascript
// Header.jsx - Toggle dropdown
const [isProfileOpen, setIsProfileOpen] = useState(false);

// Tracking.jsx - Multiple states
const [searchQuery, setSearchQuery] = useState("");
const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
const [tracks, setTracks] = useState([...data]);
```

---

#### **Why - Mengapa useState diperlukan?**
1. **Functional components butuh state management** - Sebelum Hooks, hanya class components yang bisa pakai state
2. **Automatic re-render** - Saat state berubah, React otomatis render ulang komponen dengan nilai baru
3. **Menyimpan data yang berubah** - User input, toggle UI, filter conditions
4. **Predictable behavior** - State management yang konsisten dan mudah di-track

**Di Project CRM:** Tanpa useState, admin tidak bisa:
- Buka/tutup dropdown profile
- Search pesanan dengan dynamic hasil
- Toggle filter "Pesanan Belum Dibayar"
- Mengisi form membuat order baru

---

#### **Who - Siapa yang menggunakan fitur tersebut?**
- **Admin** → Interaksi utama dengan dropdown, search, form input
- **Sistem CRM** → State tracking untuk UI updates
- **Database** → State yang disimpan ke localStorage/backend

**User yang terpengaruh di CRM:**
- Admin portal user saat login
- Admin saat melihat tracking pesanan
- Admin saat menambah order baru

---

#### **When - Kapan state berubah?**
| Event | State Berubah | Component Re-render |
|-------|---------------|-------------------|
| User klik tombol profile | `isProfileOpen: false → true` | ✅ Ya |
| User ketik di search box | `searchQuery: "" → "ORD-001"` | ✅ Ya |
| User toggle filter | `showUnpaidOnly: false → true` | ✅ Ya |
| User klik tombol "Lanjut" | `currentStep: 1 → 2` | ✅ Ya |
| Admin pilih member | `crmData.customerName: "" → "Budi"` | ✅ Ya |

**Real-time flow:**
```
Mousedown event triggered
         ↓
setSearchQuery("text baru")
         ↓
State value berubah
         ↓
React detect perubahan
         ↓
Component re-render dengan state baru
         ↓
UI update dengan hasil filter baru
```

---

#### **Where - Di bagian mana useState digunakan?**

**Pemetaan penggunaan useState di Project CRM:**

| Komponen | File | useState Usage | Purpose |
|----------|------|----------------|---------|
| **Header** | `src/components/Header.jsx` | `isProfileOpen` | Toggle profile dropdown |
| **Tracking Page** | `src/pages/Tracking.jsx` | `searchQuery, activePrintOrder, showUnpaidOnly, tracks` | Search, filter, print state |
| **AddOrder Page** | `src/pages/AddOrder.jsx` | `showCustomerModal, searchMemberQuery, crmData, selectedProductId, weight, paymentMethod, ...` | Form state management |
| **Dashboard** | `src/pages/Dashboard.jsx` | `searchTerm, selectedPeriod, customers` | Filter data & search |
| **Notifications** | `src/pages/Notifications.jsx` | `activePreview, templates` | Template selection |
| **MainLayout** | `src/layouts/MainLayout.jsx` | `collapsed` | Sidebar toggle state |
| **Login** | `src/pages/auth/Login.jsx` | `dataForm, showPassword` | Form & password visibility |
| **Laporan** | `src/pages/Laporan.jsx` | `period` | Report period selection |

---

#### **How - Bagaimana useState mempengaruhi tampilan aplikasi?**

**Mekanisme useState pada Dropdown Profile (Header.jsx):**

```javascript
// 1. DECLARE STATE
const [isProfileOpen, setIsProfileOpen] = useState(false);
// Inisialisasi: isProfileOpen = false (dropdown tertutup)

// 2. RENDER UI BERDASARKAN STATE
return (
  <>
    {/* Button untuk trigger state change */}
    <button 
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      className="profile-button"
    >
      {admin.name} ▼
    </button>

    {/* Conditional rendering: hanya tampil jika state = true */}
    {isProfileOpen && (
      <div className="dropdown-menu">
        <a href="/profile">Profil</a>
        <a href="/settings">Pengaturan</a>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )}
  </>
);
```

**Visual Impact pada UI:**

```
Initial State: isProfileOpen = false
┌──────────────────┐
│ Denny Netto ▼    │  ← Button visible
└──────────────────┘
(Dropdown tidak tampil)

User klik button
         ↓
setState(true)
         ↓
isProfileOpen = true
         ↓
Component re-render
         ↓
┌──────────────────┐
│ Denny Netto ▲    │  ← Button masih visible
├──────────────────┤
│ Profil           │  ← Dropdown muncul ✓
│ Pengaturan       │
│ Logout           │
└──────────────────┘

User klik Logout / luar area
         ↓
setState(false)
         ↓
isProfileOpen = false
         ↓
Component re-render
         ↓
Dropdown hilang
```

**Contoh Lain: Search Real-time pada Tracking.jsx**

```javascript
const [searchQuery, setSearchQuery] = useState("");

{/* Input field */}
<input 
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Cari ID pesanan..."
/>

{/* Filter berdasarkan state */}
const filteredTracks = tracks.filter(t =>
  t.id.includes(searchQuery) || t.user.includes(searchQuery)
);

{/* Render filtered results */}
{filteredTracks.map(track => (
  <OrderCard key={track.id} data={track} />
))}
```

**User Experience:**
```
User ketik "ORD"
         ↓
onChange trigger: setSearchQuery("ORD")
         ↓
searchQuery state = "ORD"
         ↓
Component re-render
         ↓
filteredTracks = [ORD-001, ORD-002, ORD-003, ...]
         ↓
UI update: hanya tampil pesanan dengan ID "ORD"
```

---

## 🟡 B. useEffect - Side Effects & Lifecycle Management

### 📋 Ringkasan 5W+1H

#### **What - Apa fungsi useEffect yang diterapkan?**
`useEffect` adalah React Hook untuk **menjalankan side effects (kode yang ingin dilakukan setelah render)** di functional component.

**Pada Project CRM, useEffect digunakan untuk:**
1. **Event listener setup** - Mendengarkan user clicks untuk close dropdown
2. **Cleanup resources** - Menghapus event listener saat component unmount
3. **Data fetching** - Mengambil data dari API (potensial di future)
4. **DOM manipulation** - Direct DOM access setelah render selesai

**Implementasi konkret dari Header.jsx:**
```javascript
useEffect(() => {
  // Fungsi untuk deteksi klik luar dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false); // Tutup dropdown
    }
  };

  // Setup: Attach event listener
  document.addEventListener("mousedown", handleClickOutside);

  // Cleanup: Hapus listener saat component unmount
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []); // Empty dependency array = jalankan sekali saat mount
```

---

#### **Why - Mengapa proses tersebut menggunakan useEffect?**
1. **Side effects tidak bisa di render function** - React render function harus pure, tanpa side effects
2. **Perlu akses DOM setelah render** - Event listeners harus di-attach setelah element exists di DOM
3. **Lifecycle management** - Setup saat mount, cleanup saat unmount mencegah memory leaks
4. **Dependency tracking** - Kontrol kapan effect dijalankan dengan dependency array

**Mengapa tidak bisa pakai setState/logic biasa:**
```javascript
// ❌ SALAH - Event listener akan di-attach SETIAP RENDER
function BadHeader() {
  const handleClickOutside = () => { /* ... */ };
  document.addEventListener("mousedown", handleClickOutside);
  // ⚠️ Multiple listeners stacked = Memory leak!
  return <div>{/* ... */}</div>;
}

// ✅ BENAR - Event listener di-attach SEKALI saat mount
function GoodHeader() {
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener(...);
  }, []); // Hanya jalankan 1x
}
```

---

#### **Who - Siapa yang merasakan dampaknya?**
- **Admin** → Pengalaman lebih baik, dropdown tertutup otomatis
- **System Performance** → Memory tidak terpakai sia-sia (cleanup function)
- **Developer** → Code lebih maintainable dan predictable
- **Browser** → Tidak ada memory leak yang menurunkan performa

**Real user impact di CRM:**
- Admin tidak perlu klik close button, cukup klik di area lain
- Dropdown reliability tinggi (tidak buggy)
- App performance tetap smooth (no memory leak)

---

#### **When - Kapan useEffect dijalankan?**

**Execution Timeline:**

```
┌─────────────────────────────────────────┐
│ Component Lifecycle with useEffect      │
└─────────────────────────────────────────┘

1️⃣ MOUNT PHASE
   Component instance dibuat
         ↓
   JSX di-render ke DOM
         ↓
   ⭐ useEffect() JALANKAN
   (karena [] = dependency kosong)
         ↓
   document.addEventListener("mousedown", ...)
         ↓
   Effect selesai

2️⃣ UPDATE PHASE  
   [state/props tidak ada dependency]
   ⭐ useEffect TIDAK JALANKAN LAGI
   (karena [] kosong = tidak ada dependency berubah)

3️⃣ UNMOUNT PHASE
   User navigate ke page lain
   Component akan di-unmount
         ↓
   ⭐ Cleanup function JALANKAN
   ↓
   document.removeEventListener("mousedown", ...)
         ↓
   Memory terbersihkan
         ↓
   Component removed from DOM
```

**Dependency Array Menentukan Kapan Effect Runs:**
| Dependency Array | Kapan Dijalankan | Use Case |
|------------------|-----------------|----------|
| `[]` (kosong) | Sekali saat mount | Setup listeners, fetch initial data |
| Tidak ada array | Setiap render | Rare, usually bugs |
| `[dep1, dep2]` | Saat mount + dep berubah | React to state/props changes |

**Untuk Header.jsx dengan `[]`:**
- ✅ Jalankan sekali saat Header pertama kali mount
- ✅ Listener siap mendengarkan user click
- ✅ Cleanup saat Header unmount (user logout/navigate)
- ✅ Tidak jalankan lagi saat state berubah (efficient)

---

#### **Where - Pada halaman atau fitur apa useEffect digunakan?**

**Lokasi penggunaan useEffect di Project CRM:**

| File | useEffect Function | Purpose |
|------|------------------|---------|
| `src/components/Header.jsx` | Click outside listener | Auto-close dropdown profile |
| `src/pages/Laporan.jsx` | PDF library loader | Load html2pdf.js sebelum export |
| Potensial di future | Data fetching | Load customer list, transactions |
| Potensial di future | Form validation | Real-time input validation |

**Di Laporan.jsx:**
```javascript
const exportReportToPdf = async () => {
  // Load library jika belum ada
  if (!window.html2pdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  // ... generate PDF
};
```
Ini adalah side effect karena mengubah DOM (menambah script element).

---

#### **How - Bagaimana dependency array mempengaruhi proses tersebut?**

**Dependency Array Impact pada Behavior:**

**Scenario 1: Empty Dependency `[]`**
```javascript
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener(...);
}, []); // ← Empty array

Behavior:
- Component mount → Effect RUNS (1x)
- isProfileOpen state changes → Effect NOT run (tetap 1 listener)
- Component unmount → Cleanup RUNS (listener removed)
- Result: Memory efficient ✅, listener selalu 1 ✅
```

**Scenario 2: With Dependencies `[isProfileOpen]`**
```javascript
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener(...);
}, [isProfileOpen]); // ← Dependency included

Behavior:
- Component mount → Effect RUNS
- isProfileOpen changes (false→true) → Effect RUNS AGAIN
- Cleanup runs → Listener removed
- New listener attached
- Result: Inefficient ❌, listener di-attach/remove multiple times
```

**Scenario 3: No Dependency Array (AVOID!)**
```javascript
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  // Opsie! Tidak ada return cleanup
}, ); // ← No array!

Behavior:
- Component mount → Effect RUNS
- ANY state/prop change → Effect RUNS AGAIN
- Result: Memory leak ❌❌, 100+ listeners stacked!
```

**Best Practice untuk Header.jsx:**
```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };
  
  document.addEventListener("mousedown", handleClickOutside);
  
  // ✅ ALWAYS cleanup!
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []); // ✅ Empty = mount/unmount only
```

---

## 🟢 C. useRef - Direct DOM Access & Persistent Values

### 📋 Ringkasan 5W+1H

#### **What - Apa fungsi useRef yang diterapkan?**
`useRef` adalah React Hook untuk **membuat reference ke elemen DOM atau menyimpan nilai yang persisten antar render** tanpa menyebabkan re-render.

**Pada Project CRM, useRef digunakan untuk:**
1. **DOM element reference** - Akses element untuk click-outside detection
2. **PDF export target** - Reference ke area yang akan di-export ke PDF
3. **Form value access** - Direct access ke input values tanpa state
4. **Conditional DOM manipulation** - Check apakah element contains click target

**Implementasi konkret:**
```javascript
// Header.jsx - Reference ke dropdown element
const dropdownRef = useRef(null);

// Digunakan untuk click-outside detection
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  setIsProfileOpen(false);
}

// Di JSX: attach ref ke element
<div ref={dropdownRef}>
  {/* Dropdown content */}
</div>

// Laporan.jsx - Reference ke report area
const reportRef = useRef(null);

const exportReportToPdf = () => {
  const el = reportRef.current;
  window.html2pdf().from(el).save();
};
```

---

#### **Why - Mengapa tidak menggunakan useState?**

**Perbedaan kritis useState vs useRef:**

```javascript
// ❌ WRONG: useState untuk DOM reference
const [dropdownEl, setDropdownEl] = useState(null);

// Problem 1: Unnecessary re-renders
useEffect(() => {
  setDropdownEl(document.querySelector('[ref-el]'));
}, []); // setRef causes re-render!

// Problem 2: State value delays
// setState bersifat asynchronous, ref immediate

// ✅ CORRECT: useRef untuk DOM reference
const dropdownRef = useRef(null);

// Benefit 1: No re-render
// ref.current tidak trigger render

// Benefit 2: Synchronous access
// dropdownRef.current tersedia immediately
```

**Kapan gunakan apa:**

| Use Case | useState | useRef |
|----------|----------|--------|
| Toggle dropdown | ✅ YES | ❌ NO |
| Store form input | ✅ YES | ❌ NO |
| Save DOM element ref | ❌ NO | ✅ YES |
| Track value without render | ❌ NO | ✅ YES |
| Re-render saat change | ✅ YES | ❌ NO |

**Alasan tidak pakai useState:**
1. **useState causes re-render** - DOM reference tidak butuh trigger render
2. **Asynchronous update** - setState butuh waktu, ref immediate
3. **Performance** - useState will cause unnecessary renders
4. **Complexity** - useState untuk DOM access adalah over-engineering

---

#### **Who - Siapa yang terbantu dengan fitur tersebut?**
- **Admin** → Dropdown menutup otomatis saat klik di luar (better UX)
- **System** → DOM manipulation efficient (no unnecessary re-renders)
- **Performance** → Render performance tetap smooth
- **Memory** → Tidak ada extra memory untuk state tracking

**Real benefit di CRM:**
- Admin experience improved: dropdown auto-closes
- Component doesn't waste re-renders on DOM refs
- PDF export bekerja dengan reference yang persisten

---

#### **When - Kapan useRef digunakan?**

**Access Timeline:**

```
┌─────────────────────────────┐
│ useRef Lifecycle            │
└─────────────────────────────┘

1️⃣ DECLARATION
   const dropdownRef = useRef(null);
   ↓ dropdownRef.current = null (initially)

2️⃣ COMPONENT RENDERS
   JSX dievaluasi
   ↓ Element belum ada di DOM

3️⃣ REF ATTACHED
   <div ref={dropdownRef}>...</div>
   ↓ React attach ref ke actual DOM element

4️⃣ AVAILABLE IN useEffect
   useEffect(() => {
     dropdownRef.current ← Sekarang bisa diakses!
     dropdownRef.current.contains(...)
   }, [])

5️⃣ ALWAYS ACCESSIBLE
   Dalam event handlers, callbacks, etc.
   ref.current selalu tersedia selama element exist
```

**Timing di Event Handler:**
```javascript
const handleClickOutside = (event) => {
  // ✅ dropdownRef.current SELALU tersedia
  // dropdownRef value tidak perlu di-track sebagai state
  
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setIsProfileOpen(false); // Hanya setState yang butuh trigger render
  }
};
```

---

#### **Where - Di bagian mana useRef diterapkan?**

**Pemetaan penggunaan useRef di Project CRM:**

| File | useRef Name | Purpose | DOM Element |
|------|-----------|---------|------------|
| `src/components/Header.jsx` | `dropdownRef` | Click-outside detection | `<div ref={dropdownRef}>` |
| `src/pages/Laporan.jsx` | `reportRef` | PDF export target area | `<div id="crm-report-area" ref={reportRef}>` |
| Potensial | `inputRef` | Auto-focus input | `<input ref={inputRef} />` |
| Potensial | `videoRef` | Play/pause video | `<video ref={videoRef} />` |

**Di Header.jsx:**
```javascript
import { useRef } from "react";

export default function Header() {
  const dropdownRef = useRef(null); // ← Create ref
  
  return (
    <div ref={dropdownRef}> {/* ← Attach ref */}
      <button>Profile</button>
      <menu>Menu items...</menu>
    </div>
  );
}

// Di useEffect:
useEffect(() => {
  const handler = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      // dropdownRef.current ← Access ref value
      setIsProfileOpen(false);
    }
  };
}, []);
```

---

#### **How - Bagaimana useRef bekerja pada implementasi tersebut?**

**Mekanisme Click-Outside Detection dengan useRef:**

```
┌────────────────────────────────────────┐
│  Document (Whole Browser Window)       │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ <div ref={dropdownRef}>          │  │
│  │ ┌──────────────────────────────┐ │  │
│  │ │ <button>Profile</button>     │ │  │
│  │ └──────────────────────────────┘ │  │
│  │ ┌──────────────────────────────┐ │  │
│  │ │ <menu> (dropdown content)    │ │  │
│  │ │ - Profil                     │ │  │
│  │ │ - Settings                   │ │  │
│  │ │ - Logout                     │ │  │
│  │ │ </menu>                      │ │  │
│  │ └──────────────────────────────┘ │  │
│  └────────────────────────────────────┘  ↑
│         ↑ dropdownRef.current             │
│         └─ Ref pointing to this div       │
│                                        │
│  [Rest of page...]                     │
│                                        │
└────────────────────────────────────────┘

EVENT DETECTION:

User klik di DALAM dropdown
├─ event.target = element dalam dropdownRef
├─ dropdownRef.current.contains(event.target) = TRUE ✓
└─ Dropdown tetap terbuka

User klik DI LUAR dropdown (e.g. di area page lain)
├─ event.target = element OUTSIDE dropdownRef
├─ dropdownRef.current.contains(event.target) = FALSE ✗
├─ setIsProfileOpen(false) dijalankan
└─ Dropdown closes otomatis ✓
```

**Step-by-step Code Execution:**

```javascript
// 1. Setup useEffect
useEffect(() => {
  const handleClickOutside = (event) => {
    // 2. Setiap mousedown di document, function ini dijalankan
    
    // 3. Cek apakah dropdownRef.current ada
    if (dropdownRef.current) {
      // 4. Cek apakah event.target ADA DALAM dropdownRef element
      const isClickInside = dropdownRef.current.contains(event.target);
      
      // 5. Jika click OUTSIDE (isClickInside = false)
      if (!isClickInside) {
        // 6. Trigger state change untuk tutup dropdown
        setIsProfileOpen(false);
      }
    }
  };

  // 7. Setup listener di document
  document.addEventListener("mousedown", handleClickOutside);

  // 8. Cleanup saat unmount
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []); // Jalankan hanya 1x saat mount
```

**User Interaction Flow:**

```
User terbuka halaman Header
         ↓
Component mount
         ↓
useEffect jalankan
         ↓
dropdownRef.current = <div ref={dropdownRef}> ← Element HTML
         ↓
document.addEventListener("mousedown", handler) ← Listening
         ↓
User klik tombol profile
         ↓
setIsProfileOpen(true)
         ↓
Dropdown menu render (isProfileOpen = true)
         ↓
User klik di area INSIDE dropdown (menu item)
         ↓
handleClickOutside triggered
         ↓
dropdownRef.current.contains(event.target) = TRUE
         ↓
Nothing happens, dropdown stays open ✓
         ↓
User klik di area OUTSIDE dropdown
         ↓
handleClickOutside triggered
         ↓
dropdownRef.current.contains(event.target) = FALSE
         ↓
setIsProfileOpen(false) executed
         ↓
Component re-render
         ↓
Dropdown menu disappears ✓
```

---

## 📊 Perbandingan Ringkas Ketiga Hooks

| Aspek | **useState** | **useEffect** | **useRef** |
|-------|-----------|------------|----------|
| **Fungsi** | Manage state | Side effects | DOM/Value reference |
| **Cause Re-render** | ✅ YES | ❌ NO | ❌ NO |
| **Diakses Kapan** | Render time | After render | After render |
| **Update Cara** | setState() | Auto (dependencies) | Direct assign |
| **Cleanup Needed** | - | ✅ MUST (effects) | ❌ NO |
| **CRM Example** | Dropdown toggle | Click listener | Dropdown element |
| **Memory Efficient** | Biasa saja | ✅ Highly (cleanup) | ✅ Highly |

---

## 🎯 CRM Implementation Summary

**Satu Fitur, Tiga Hooks Bekerja Bersama:**

```javascript
// Header.jsx - Profile Dropdown Feature

import { useState, useEffect, useRef } from "react";

export default function Header() {
  // 1️⃣ useState: Track apakah dropdown open/close
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 2️⃣ useRef: Reference ke dropdown DOM element
  const dropdownRef = useRef(null);

  // 3️⃣ useEffect: Setup click listener, manage lifecycle
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Gunakan useRef untuk check apakah click outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Gunakan useState untuk close dropdown
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []); // Dependency array dari useEffect

  return (
    // Attach useRef ke elemen
    <div ref={dropdownRef}>
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)} // setState trigger
      >
        {admin.name}
      </button>
      
      {isProfileOpen && ( // useState conditional render
        <div className="dropdown-menu">
          <a href="/profile">Profil</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
```

**How They Work Together:**
```
useState (isProfileOpen)
    ↓ Stores boolean state
    ↓ Triggers re-render on change
    ↓ Controls what's visible in UI
    
useRef (dropdownRef)
    ↓ References dropdown DOM element
    ↓ Used in useEffect to detect outside clicks
    ↓ No re-render when accessed
    
useEffect (listener setup)
    ↓ Runs once on mount
    ↓ Uses useRef to access element
    ↓ Uses useState to update state
    ↓ Cleans up on unmount
```

---

**✅ Dokumentasi Lengkap Selesai**

**File references:**
- 📄 Detailed explanation: `REACT_HOOKS_DOCUMENTATION.md`
- 📐 Diagram guide: `EXCALIDRAW_DIAGRAM_GUIDE.md`
- 📸 Screenshots: Take from code files mentioned above

**Next steps:**
1. Buat 3 diagrams di Excalidraw sesuai guide
2. Export as PNG
3. Screenshot code from VS Code
4. Kumpulkan semua files dalam folder assignment
