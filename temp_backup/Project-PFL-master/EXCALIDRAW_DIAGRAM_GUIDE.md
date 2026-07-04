# 📐 Panduan Membuat Diagram Excalidraw - React Hooks

Ikuti panduan berikut untuk membuat 3 diagram di Excalidraw (https://excalidraw.com) untuk masing-masing hook.

---

## 🔵 Diagram 1: useState Flow - Profile Dropdown

### Deskripsi Diagram
Buat diagram alur yang menunjukkan bagaimana `useState` bekerja untuk toggle dropdown profile.

### Step-by-Step di Excalidraw:

1. **Buat Rectangle untuk State Variable:**
   - Teks: `state: isProfileOpen = false`
   - Background: Light Blue (#E3F2FD)
   - Position: Top center

2. **Buat 2 State Boxes di bawahnya (sebelah-sebelahan):**
   - LEFT BOX: 
     - Teks: `State = FALSE\nDropdown: HIDDEN`
     - Background: Light Gray (#F5F5F5)
     - Border: 2px
   - RIGHT BOX:
     - Teks: `State = TRUE\nDropdown: VISIBLE`
     - Background: Light Blue (#E3F2FD)
     - Border: 2px Blue

3. **Buat Trigger Elements:**
   - CIRCLE di atas LEFT BOX: "🖱️ User Click\nProfile Btn"
   - CIRCLE di atas RIGHT BOX: "🖱️ User Click\nDropdown Area"

4. **Buat Arrows (koneksi):**
   - Dari LEFT box ke RIGHT box: Arrow dengan label "setIsProfileOpen(true)"
   - Dari RIGHT box ke LEFT box: Arrow dengan label "setIsProfileOpen(false)"

5. **Buat Component UI di bawah:**
   - Teks: "React Component Re-render ✓"
   - Background: Light Green (#E8F5E9)

6. **Export sebagai PNG:**
   - File → Export → PNG
   - Nama file: `1-useState-flow.png`

---

## 🟡 Diagram 2: useEffect Lifecycle - Event Listener Setup & Cleanup

### Deskripsi Diagram
Buat diagram timeline yang menunjukkan kapan useEffect dijalankan dan cleanup function dipanggil.

### Step-by-Step di Excalidraw:

1. **Buat Timeline Horizontal:**
   - Garis panjang dari kiri ke kanan
   - Beri label di bawah: "Component Lifecycle"

2. **Buat 4 Milestone Points di timeline:**

   **Point 1 (Paling Kiri):**
   - Icon: 🔄
   - Label: "Component Mount"
   - Box: "useEffect() RUN"
   - Sub-text: "addEventListener attached"
   - Color: Light Green

   **Point 2:**
   - Icon: 👆
   - Label: "User Interactions"
   - Box: "Event Listener Active"
   - Sub-text: "Listening for 'mousedown'"
   - Color: Light Yellow

   **Point 3:**
   - Icon: 👆
   - Label: "User Click Outside"
   - Box: "handleClickOutside() Called"
   - Sub-text: "setIsProfileOpen(false)"
   - Color: Light Orange

   **Point 4 (Paling Kanan):**
   - Icon: ❌
   - Label: "Component Unmount"
   - Box: "Cleanup Function RUN"
   - Sub-text: "removeEventListener()"
   - Color: Light Red

3. **Tambah Boxes Detail untuk Dependency Array:**
   - Box terpisah: "[] = Empty Dependency Array"
   - Sub-text: "Effect runs once at mount"
   - Color: Light Purple

4. **Buat Memory Leak Warning:**
   - Alert Box: "⚠️ Without cleanup = Memory Leak"
   - "Multiple listeners stacked!"

5. **Export sebagai PNG:**
   - Nama file: `2-useEffect-lifecycle.png`

---

## 🟢 Diagram 3: useRef - Direct DOM Access & Click Outside Detection

### Deskripsi Diagram
Buat diagram yang menunjukkan bagaimana useRef mengakses elemen DOM untuk click-outside detection.

### Step-by-Step di Excalidraw:

1. **Buat Rectangle besar untuk "Browser Document":**
   - Teks: `📄 Browser Document (Whole Page)`
   - Background: Very Light Gray (#FAFAFA)
   - Besar, cover area utama

2. **Di dalam Document, buat Rectangle untuk "Component Container":**
   - Teks: `<div ref={dropdownRef}>`
   - Background: Light Blue (#E3F2FD)
   - Border: 2px Blue

3. **Di dalam Container, buat 3 Sub-elements:**
   - BOX 1: "🔘 Button (Profile)"
   - BOX 2: "📋 Dropdown Menu"
   - BOX 3: "✓ ref.current = HTML Element"

4. **Buat 2 Click Scenarios dengan Arrows:**

   **Scenario A - CLICK INSIDE:**
   - Arrow dari "Click Here" ke dalam dropdown
   - Label: "ref.current.contains(target) = TRUE"
   - Result: "Dropdown stays open ✓"
   - Color: Green

   **Scenario B - CLICK OUTSIDE:**
   - Arrow dari "Click Here" (di luar box) ke area luar dropdown
   - Label: "ref.current.contains(target) = FALSE"
   - Result: "Dropdown closes (setIsProfileOpen=false) ✓"
   - Color: Orange

5. **Tambah Code Snippet Box:**
   - Teks kecil: `if (ref.current && !ref.current.contains(event.target))`
   - Background: Light Yellow (#FFFDE7)
   - Font: Monospace

6. **Export sebagai PNG:**
   - Nama file: `3-useRef-dom-access.png`

---

## 📸 Screenshot Implementation Code

Setelah membuat diagram, ambil screenshot dari code berikut menggunakan VS Code:

### Screenshot 1: useState Implementation
**File: `src/components/Header.jsx` - Lines 13-15**

Buka file di VS Code, pilih lines:
```javascript
const [isProfileOpen, setIsProfileOpen] = useState(false);
const dropdownRef = useRef(null);
const navigate = useNavigate();
```

**Action:** 
- Print screen (PrtScn) atau Ctrl+Shift+X di VS Code
- Nama file: `screenshot-useState-header.png`

### Screenshot 2: useEffect Implementation
**File: `src/components/Header.jsx` - Lines 30-39**

Pilih code:
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

**Action:**
- Screenshot
- Nama file: `screenshot-useEffect-header.png`

### Screenshot 3: useRef Implementation
**File: `src/pages/Laporan.jsx` - Lines 1-15**

Pilih code:
```javascript
import { useState, useRef } from "react";

export default function Reports() {
  const [period, setPeriod] = useState("Bulan Mei 2026");
  const reportRef = useRef(null);
  
  // ... 
  <div id="crm-report-area" ref={reportRef}>
    {/* Report content */}
  </div>
```

**Action:**
- Screenshot
- Nama file: `screenshot-useRef-laporan.png`

### Screenshot 4: Complete Tracking Component dengan useState + useRef
**File: `src/pages/Tracking.jsx` - Lines 11-20**

Pilih code menunjukkan beberapa useState sekaligus:
```javascript
const [searchQuery, setSearchQuery] = useState("");
const [activePrintOrder, setActivePrintOrder] = useState(null);
const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
const initialTracks = getAllTransactions();
const [tracks, setTracks] = useState(initialTracks.length > 0 ? initialTracks : [...]);
```

**Action:**
- Screenshot
- Nama file: `screenshot-useState-tracking.png`

---

## 🎨 Color Scheme Recommendation untuk Diagrams

- **useState**: Blue (#2196F3) - Dynamic, changes
- **useEffect**: Orange (#FF9800) - Side effects, timing
- **useRef**: Green (#4CAF50) - Direct access, stable
- **Good practices**: Green (#8BC34A)
- **Warnings**: Red (#F44336)
- **Neutral**: Gray (#9E9E9E)

---

## 📝 Checklist Sebelum Submit

- [ ] ✅ Diagram 1: useState flow - DONE
- [ ] ✅ Diagram 2: useEffect lifecycle - DONE  
- [ ] ✅ Diagram 3: useRef DOM access - DONE
- [ ] 📸 Screenshot 1: useState Header code
- [ ] 📸 Screenshot 2: useEffect Header code
- [ ] 📸 Screenshot 3: useRef Laporan code
- [ ] 📸 Screenshot 4: useState Tracking code (multiple states)
- [ ] 📄 5W+1H Documentation - DONE (REACT_HOOKS_DOCUMENTATION.md)
- [ ] 📁 Folder structure organized

---

## 💾 Cara Save & Export Diagrams

### Di Excalidraw:
1. Buat diagram sesuai spesifikasi di atas
2. File → Export → PNG
3. Download dengan nama: `1-useState-flow.png`, dll
4. Simpan di folder: `c:\Project PFL nesa\React-Hooks-Diagrams\`

### Screenshot Code:
1. Buka VS Code dengan folder project
2. Pilih code yang ingin dishare
3. Print screen / Ctrl+Shift+X 
4. Paste ke Paint/SnagIt
5. Save sebagai PNG di folder yang sama

---

## 🚀 Additional Tips

- **For better diagrams:** Gunakan shapes dengan border 2-3px
- **For text:** Gunakan font size 14-16px agar readable saat di-submit
- **For arrows:** Gunakan arrow dengan label yang jelas
- **For colors:** Konsisten dengan color scheme
- **For organization:** Group related elements dengan rectangle border

**Happy diagramming! 🎨**
