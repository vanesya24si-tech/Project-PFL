# 📋 CHECKLIST & SUBMISSION GUIDE - React Hooks Assignment

**Pertemuan 12 - React Hooks (useState, useEffect, useRef)**

---

## 📦 File & Folder Structure yang Harus Ada

```
c:\Project PFL nesa\
├── REACT_HOOKS_DOCUMENTATION.md (Detailed explanation)
├── RINGKASAN_5W+1H_REACT_HOOKS.md (5W+1H Answers)
├── EXCALIDRAW_DIAGRAM_GUIDE.md (How to create diagrams)
│
└── SUBMISSION_FOLDER\
    ├── DIAGRAMS\
    │   ├── 1-useState-flow.png ← useState flow diagram
    │   ├── 2-useEffect-lifecycle.png ← useEffect lifecycle diagram
    │   └── 3-useRef-dom-access.png ← useRef DOM access diagram
    │
    ├── SCREENSHOTS\
    │   ├── screenshot-useState-header.png
    │   ├── screenshot-useEffect-header.png
    │   ├── screenshot-useRef-laporan.png
    │   └── screenshot-useState-tracking.png
    │
    └── 5W+1H_ANSWERS\
        ├── A-useState-5W+1H.txt
        ├── B-useEffect-5W+1H.txt
        └── C-useRef-5W+1H.txt
```

---

## ✅ COMPLETE CHECKLIST

### Part 1: Documentation Files ✓ READY
- [x] **REACT_HOOKS_DOCUMENTATION.md**
  - [x] Penjelasan lengkap useState dengan contoh project
  - [x] Penjelasan lengkap useEffect dengan diagram lifecycle
  - [x] Penjelasan lengkap useRef dengan konsep DOM access
  - [x] Perbandingan ketiga hooks
  - [x] Best practices

- [x] **RINGKASAN_5W+1H_REACT_HOOKS.md**
  - [x] 5W+1H untuk useState (lengkap dengan contoh code)
  - [x] 5W+1H untuk useEffect (lengkap dengan timeline)
  - [x] 5W+1H untuk useRef (lengkap dengan diagram ASCII)

- [x] **EXCALIDRAW_DIAGRAM_GUIDE.md**
  - [x] Step-by-step cara membuat diagram 1 (useState)
  - [x] Step-by-step cara membuat diagram 2 (useEffect)
  - [x] Step-by-step cara membuat diagram 3 (useRef)
  - [x] Export instructions ke PNG

---

### Part 2: Diagrams & Screenshots (TODO)

#### 📐 Diagram 1: useState Flow
- [ ] Buka https://excalidraw.com
- [ ] Ikuti panduan di EXCALIDRAW_DIAGRAM_GUIDE.md (Section "Diagram 1: useState Flow")
- [ ] Buat diagram dengan elements:
  - [x] Deskripsi: State variable (isProfileOpen)
  - [x] State boxes (FALSE/TRUE)
  - [x] Trigger elements (user clicks)
  - [x] Arrows (state transitions)
  - [x] Component re-render indicator
- [ ] Export as PNG dengan nama: `1-useState-flow.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/DIAGRAMS/`

#### 📐 Diagram 2: useEffect Lifecycle
- [ ] Buka https://excalidraw.com
- [ ] Ikuti panduan di EXCALIDRAW_DIAGRAM_GUIDE.md (Section "Diagram 2: useEffect Lifecycle")
- [ ] Buat diagram timeline dengan:
  - [x] Mount phase
  - [x] Update phase
  - [x] Unmount phase
  - [x] Event listener attachment
  - [x] Cleanup function execution
  - [x] Dependency array explanation
- [ ] Export as PNG dengan nama: `2-useEffect-lifecycle.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/DIAGRAMS/`

#### 📐 Diagram 3: useRef DOM Access
- [ ] Buka https://excalidraw.com
- [ ] Ikuti panduan di EXCALIDRAW_DIAGRAM_GUIDE.md (Section "Diagram 3: useRef DOM Access")
- [ ] Buat diagram dengan:
  - [x] Document container
  - [x] Component container
  - [x] Sub-elements (button, dropdown, ref)
  - [x] Click inside scenario
  - [x] Click outside scenario
  - [x] contains() method explanation
- [ ] Export as PNG dengan nama: `3-useRef-dom-access.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/DIAGRAMS/`

---

#### 📸 Screenshots Implementation Code

##### Screenshot 1: useState in Header.jsx
- [ ] Buka VS Code dengan project folder
- [ ] Navigate ke file: `src/components/Header.jsx`
- [ ] Pilih lines 13-15 (useState declarations):
  ```javascript
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  ```
- [ ] Print screen atau gunakan screenshot tool
- [ ] Save as: `screenshot-useState-header.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/SCREENSHOTS/`

##### Screenshot 2: useEffect in Header.jsx
- [ ] Di file: `src/components/Header.jsx`
- [ ] Pilih lines 30-39 (useEffect with dependencies):
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
- [ ] Print screen
- [ ] Save as: `screenshot-useEffect-header.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/SCREENSHOTS/`

##### Screenshot 3: useRef in Laporan.jsx
- [ ] Di file: `src/pages/Laporan.jsx`
- [ ] Pilih lines 1-15 (import dan useRef):
  ```javascript
  import { useState, useRef } from "react";
  // ...
  export default function Reports() {
    const [period, setPeriod] = useState("Bulan Mei 2026");
    const reportRef = useRef(null);
    // ...
    <div id="crm-report-area" ref={reportRef}>
  ```
- [ ] Print screen
- [ ] Save as: `screenshot-useRef-laporan.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/SCREENSHOTS/`

##### Screenshot 4: Multiple useState in Tracking.jsx
- [ ] Di file: `src/pages/Tracking.jsx`
- [ ] Pilih lines 11-20 (multiple state management):
  ```javascript
  const [searchQuery, setSearchQuery] = useState("");
  const [activePrintOrder, setActivePrintOrder] = useState(null);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  const initialTracks = getAllTransactions();
  const [tracks, setTracks] = useState(initialTracks.length > 0 ? ...);
  ```
- [ ] Print screen
- [ ] Save as: `screenshot-useState-tracking.png`
- [ ] Save di folder: `SUBMISSION_FOLDER/SCREENSHOTS/`

---

### Part 3: 5W+1H Written Answers (TODO)

#### A. useState - 5W+1H
- [ ] Buat file: `SUBMISSION_FOLDER/5W+1H_ANSWERS/A-useState-5W+1H.txt`
- [ ] Copy-paste jawaban untuk useState dari `RINGKASAN_5W+1H_REACT_HOOKS.md` bagian A
- [ ] Sections yang harus ada:
  - [ ] **What** - Fungsi useState apa yang diterapkan
  - [ ] **Why** - Mengapa useState diperlukan
  - [ ] **Who** - Siapa yang menggunakan
  - [ ] **When** - Kapan state berubah
  - [ ] **Where** - Di bagian mana useState digunakan
  - [ ] **How** - Bagaimana useState mempengaruhi tampilan
- [ ] Include code examples dari project
- [ ] Include visual flow diagrams (ASCII atau reference ke PNG)

#### B. useEffect - 5W+1H
- [ ] Buat file: `SUBMISSION_FOLDER/5W+1H_ANSWERS/B-useEffect-5W+1H.txt`
- [ ] Copy-paste jawaban untuk useEffect dari dokumentasi
- [ ] Sections yang harus ada:
  - [ ] **What** - Fungsi useEffect apa
  - [ ] **Why** - Mengapa perlu useEffect
  - [ ] **Who** - Siapa yang merasakan dampak
  - [ ] **When** - Kapan useEffect dijalankan (lifecycle)
  - [ ] **Where** - Pada halaman/fitur apa digunakan
  - [ ] **How** - Bagaimana dependency array bekerja
- [ ] Include timeline explanation
- [ ] Include cleanup function importance

#### C. useRef - 5W+1H
- [ ] Buat file: `SUBMISSION_FOLDER/5W+1H_ANSWERS/C-useRef-5W+1H.txt`
- [ ] Copy-paste jawaban untuk useRef dari dokumentasi
- [ ] Sections yang harus ada:
  - [ ] **What** - Fungsi useRef apa
  - [ ] **Why** - Mengapa tidak pakai useState
  - [ ] **Who** - Siapa terbantu dengan feature ini
  - [ ] **When** - Kapan useRef digunakan
  - [ ] **Where** - Di bagian mana useRef diterapkan
  - [ ] **How** - Bagaimana useRef bekerja pada implementasi
- [ ] Include comparison vs useState
- [ ] Include DOM access mechanism explanation

---

## 📝 How to Create & Submit Files

### Option 1: Using Documentation Files (EASIEST)
1. Buka file `RINGKASAN_5W+1H_REACT_HOOKS.md`
2. Copy-paste bagian A (useState) ke `A-useState-5W+1H.txt`
3. Copy-paste bagian B (useEffect) ke `B-useEffect-5W+1H.txt`
4. Copy-paste bagian C (useRef) ke `C-useRef-5W+1H.txt`
5. Save semua di folder `SUBMISSION_FOLDER/5W+1H_ANSWERS/`

### Option 2: Using Online Excalidraw (RECOMMENDED)
1. Buka https://excalidraw.com
2. Ikuti step-by-step dari `EXCALIDRAW_DIAGRAM_GUIDE.md`
3. Buat 3 diagrams masing-masing untuk useState, useEffect, useRef
4. Export each sebagai PNG
5. Save di folder `SUBMISSION_FOLDER/DIAGRAMS/`

### Option 3: Taking Screenshots from VS Code
1. Buka VS Code dengan project folder
2. Buka file yang sesuai (Header.jsx, Laporan.jsx, Tracking.jsx)
3. Highlight code yang relevan
4. Print screen (Ctrl+Print Screen) atau gunakan tool
5. Paste ke Paint/SnagIt
6. Save as PNG
7. Save di folder `SUBMISSION_FOLDER/SCREENSHOTS/`

---

## 🎯 Quality Checklist Sebelum Submit

### Diagrams Quality
- [ ] Setiap diagram clear dan readable
- [ ] Font size 14-16pt (bukan terlalu kecil)
- [ ] Warna konsisten dengan tema (Blue, Orange, Green)
- [ ] Arrows dan connections jelas
- [ ] Labels dan annotations lengkap
- [ ] Not cluttered - whitespace bagus

### Screenshots Quality
- [ ] Code jelas terlihat (font size reasonable)
- [ ] File names visible di tab
- [ ] Full context dari code snippet
- [ ] Syntax highlighting jelas
- [ ] No blur atau distortion

### 5W+1H Answers Quality
- [ ] Semua 6 sections ada (What, Why, Who, When, Where, How)
- [ ] Menggunakan contoh dari project CRM
- [ ] Clear dan mudah dipahami
- [ ] Ada code examples
- [ ] Ada visual explanations (flow, timeline, etc)
- [ ] Tidak copy-paste generic, tapi context CRM

### Documentation Overall
- [ ] Semua files tersimpan di structure yang benar
- [ ] File names sesuai convention
- [ ] No missing deliverables
- [ ] Language Bahasa Indonesia (sesuai permintaan)
- [ ] Professional presentation

---

## 📂 Final Submission Checklist

**Buat struktur folder exactly seperti ini:**

```
SUBMISSION_FOLDER/
│
├── DIAGRAMS/
│   ├── 1-useState-flow.png ⬅️ MUST
│   ├── 2-useEffect-lifecycle.png ⬅️ MUST
│   └── 3-useRef-dom-access.png ⬅️ MUST
│
├── SCREENSHOTS/
│   ├── screenshot-useState-header.png ⬅️ MUST
│   ├── screenshot-useEffect-header.png ⬅️ MUST
│   ├── screenshot-useRef-laporan.png ⬅️ MUST
│   └── screenshot-useState-tracking.png ⬅️ MUST
│
└── 5W+1H_ANSWERS/
    ├── A-useState-5W+1H.txt ⬅️ MUST
    ├── B-useEffect-5W+1H.txt ⬅️ MUST
    └── C-useRef-5W+1H.txt ⬅️ MUST
```

---

## ⏰ Timeline Suggestion

**Jika assignment due dalam 1 minggu:**

- **Day 1-2**: Read documentation files yang sudah dibuat
- **Day 2-3**: Buat 3 diagrams di Excalidraw
- **Day 3-4**: Ambil screenshots dari VS Code
- **Day 4-5**: Finalize 5W+1H answers, organize files
- **Day 5-6**: Review semua deliverables, quality check
- **Day 6-7**: Submit!

---

## 🆘 Troubleshooting

### Problem: Diagram tidak bisa export sebagai PNG
**Solution:** 
- Di Excalidraw, gunakan File → Export → PNG
- Jika error, coba refresh halaman
- Alternative: gunakan SnagIt untuk screenshot dari Excalidraw

### Problem: Code screenshot terlalu kecil/tidak jelas
**Solution:**
- Zoom in VS Code (Ctrl + Plus)
- Use built-in screenshot feature
- Adjust window size sebelum screenshot

### Problem: Tidak tahu apa yang harus ditulis di 5W+1H
**Solution:**
- Lihat contoh lengkap di `RINGKASAN_5W+1H_REACT_HOOKS.md`
- Setiap section sudah ada jawaban lengkap
- Tinggal copy-paste atau paraphrase sesuai pemahaman

### Problem: File organization bingung
**Solution:**
- Ikuti struktur folder yang sudah diberikan
- Jangan rename files
- Maintain exact structure untuk mudah grading

---

## 📞 Reference Files dalam Project

**Jika perlu referensi code yang sudah ada:**

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| useState example | `src/components/Header.jsx` | 13-15 | Dropdown toggle |
| useEffect example | `src/components/Header.jsx` | 30-39 | Click listener |
| useRef example | `src/pages/Laporan.jsx` | 15, 68 | PDF export ref |
| Multiple useState | `src/pages/Tracking.jsx` | 11-20 | Search, filter, tracks |
| Form useState | `src/pages/AddOrder.jsx` | 20-60+ | Extensive form state |

---

## ✨ Pro Tips

1. **Use Excalidraw templates** - Ada template yang sudah jadi, bisa modify
2. **Consistent naming** - Follow kebijakan penamaan yang sudah ditetapkan
3. **Code comments** - Tambahkan comments di code untuk clarify (optional but better)
4. **Color coding** - Gunakan warna yang berbeda untuk setiap hook (Blue/Orange/Green)
5. **Diagram annotations** - Label semua komponen untuk clarity
6. **Double-check paths** - Verify semua file ada di tempat yang benar sebelum submit

---

**🎉 Good luck dengan assignment! Semua resources sudah siap!**

**Questions?** Refer back to:
- `REACT_HOOKS_DOCUMENTATION.md` - Detailed explanations
- `RINGKASAN_5W+1H_REACT_HOOKS.md` - Ringkasan & answers
- `EXCALIDRAW_DIAGRAM_GUIDE.md` - Diagram creation guide
