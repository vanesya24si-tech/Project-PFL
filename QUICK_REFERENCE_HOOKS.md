# 🚀 QUICK REFERENCE - React Hooks Cheat Sheet

**Pertemuan 12 - useState, useEffect, useRef**

---

## 🔵 useState - State Management

### What It Does
Menyimpan & mengelola state (data yang bisa berubah) di functional component.

### Syntax
```javascript
const [state, setState] = useState(initialValue);
```

### Example from CRM
```javascript
// Header.jsx - Toggle dropdown
const [isProfileOpen, setIsProfileOpen] = useState(false);

// Tracking.jsx - Search query
const [searchQuery, setSearchQuery] = useState("");

// AddOrder.jsx - Form data
const [crmData, setCrmData] = useState({ name: "", phone: "", ... });
```

### When State Changes
```
User interaction (click, type, etc)
         ↓
setState() dipanggil
         ↓
State value berubah
         ↓
Component re-render dengan state baru
         ↓
UI update
```

### 5W+1H Quick Summary
| Question | Answer |
|----------|--------|
| **What** | Manage UI state (toggle, form, data) |
| **Why** | Functional components need state management |
| **Who** | Admin users interacting with UI |
| **When** | User klik button, ketik input, toggle switch |
| **Where** | Header, Tracking, AddOrder, Dashboard, etc |
| **How** | State change triggers re-render |

### Usage Pattern
```javascript
// 1. Declare
const [visible, setVisible] = useState(false);

// 2. Update
setVisible(true);

// 3. Use in JSX
{visible && <div>Show this</div>}
```

### Common Use Cases
✅ Toggle UI (dropdown, modal, sidebar)
✅ Form inputs (email, password, search)
✅ Filter & sort data
✅ Track active selection
✅ Store list data

❌ Store DOM references (use useRef)
❌ Side effects like API calls (use useEffect)

---

## 🟡 useEffect - Side Effects & Lifecycle

### What It Does
Menjalankan kode setelah component render (side effects).

### Syntax
```javascript
useEffect(() => {
  // Kode yang dijalankan SETELAH render
  return () => {
    // Cleanup function (opsional)
  };
}, [dependencies]); // Kontrol kapan dijalankan
```

### Example from CRM
```javascript
// Header.jsx - Click outside detection
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };
  
  document.addEventListener("mousedown", handleClickOutside);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []); // Run once on mount
```

### Execution Timeline
```
Component Mount
         ↓
JSX Render
         ↓
⭐ useEffect() RUNS
         ↓
Setup event listener / fetch data / etc
         ↓
[User interactions...]
         ↓
Component Unmount
         ↓
⭐ Cleanup function RUNS
         ↓
Remove listener / clean resources
```

### Dependency Array Rules
| Array | Behavior | Use Case |
|-------|----------|----------|
| `[]` | Run once on mount | Setup listeners, initial fetch |
| `[dep1, dep2]` | Run when deps change | React to state/props |
| Omitted | Run every render | ⚠️ Usually a mistake |

### 5W+1H Quick Summary
| Question | Answer |
|----------|--------|
| **What** | Run side effects after render |
| **Why** | Can't do DOM manipulation in render |
| **Who** | System/Browser (handles lifecycle) |
| **When** | After render, when dependencies change |
| **Where** | Header (click listener), Laporan (PDF export) |
| **How** | Dependency array controls execution |

### Usage Pattern
```javascript
// 1. Setup listener on mount
useEffect(() => {
  document.addEventListener("click", handler);
  
  // 2. Cleanup on unmount
  return () => {
    document.removeEventListener("click", handler);
  };
}, []); // 3. Empty = once
```

### Common Use Cases
✅ Event listener setup (with cleanup!)
✅ Data fetching from API
✅ Timer / intervals (with cleanup)
✅ DOM manipulation
✅ Subscription setup

⚠️ Always add cleanup return function for listeners/subscriptions!
❌ Don't use for DOM references (use useRef)

---

## 🟢 useRef - Direct DOM Access

### What It Does
Membuat reference ke DOM element atau persistent value (tidak trigger re-render).

### Syntax
```javascript
const ref = useRef(null);

// Attach ke element
<div ref={ref}>...</div>

// Access in handler
if (ref.current && ref.current.contains(target)) { ... }
```

### Example from CRM
```javascript
// Header.jsx - Dropdown reference
const dropdownRef = useRef(null);

// Used in useEffect
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  setIsProfileOpen(false);
}

// In JSX
<div ref={dropdownRef}>...</div>

// Laporan.jsx - PDF export target
const reportRef = useRef(null);

const exportToPdf = () => {
  const el = reportRef.current;
  window.html2pdf().from(el).save();
};
```

### Why NOT useState for Refs
```javascript
// ❌ WRONG - useState causes unnecessary re-renders
const [el, setEl] = useState(null);
setEl(domElement); // Triggers re-render!

// ✅ RIGHT - useRef no re-render
const ref = useRef(null);
ref.current = domElement; // NO re-render
```

### Access Timeline
```
Component Render
         ↓
ref.current = null (initially)
         ↓
Element render dengan ref attached
         ↓
React attach ref ke actual DOM
         ↓
⭐ ref.current NOW accessible
```

### 5W+1H Quick Summary
| Question | Answer |
|----------|--------|
| **What** | Reference to DOM element or persistent value |
| **Why** | Direct DOM access without re-renders |
| **Who** | useEffect / event handlers use it |
| **When** | After element renders to DOM |
| **Where** | Header (dropdown), Laporan (report area) |
| **How** | Check if click inside/outside via .contains() |

### Usage Pattern
```javascript
// 1. Create ref
const ref = useRef(null);

// 2. Attach to element
<input ref={ref} />

// 3. Access in handler
ref.current.focus();
ref.current.value;
ref.current.contains(target);
```

### Common Use Cases
✅ Focus/blur input field
✅ Click outside detection
✅ Play/pause media
✅ Get input value without form state
✅ Trigger animations
✅ Direct DOM queries

❌ For state that needs UI updates (use useState)
❌ For tracking values that trigger re-render (use useState)

---

## 📊 COMPARISON TABLE

```
╔══════════════╦════════════╦══════════════╦═════════════╗
║  Attribute   ║  useState  ║  useEffect   ║   useRef    ║
╠══════════════╬════════════╬══════════════╬═════════════╣
║ Purpose      ║ State mgmt ║ Side effects ║ DOM access  ║
║ Re-render?   ║ ✅ YES     ║ ❌ NO        ║ ❌ NO       ║
║ Update via   ║ setState() ║ Auto (deps)  ║ Direct      ║
║ Access when  ║ Render     ║ After render ║ After mount ║
║ Cleanup?     ║ ❌ NO      ║ ✅ MUST      ║ ❌ NO       ║
║ CRM Example  ║ Dropdown   ║ Listener     ║ Element     ║
║              ║ toggle     ║ setup        ║ reference   ║
╚══════════════╩════════════╩══════════════╩═════════════╝
```

---

## 🎯 Complete Working Example (Header Component)

```javascript
import { useState, useEffect, useRef } from "react";

export default function Header() {
  // 1️⃣ useState: Track state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 2️⃣ useRef: Reference to element
  const dropdownRef = useRef(null);

  // 3️⃣ useEffect: Setup listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // useRef used here
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // useState used here
        setIsProfileOpen(false);
      }
    };
    
    // Setup
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Dependencies

  return (
    <div ref={dropdownRef}> {/* useRef attached */}
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)} {/* useState */}
      >
        Profile
      </button>
      
      {isProfileOpen && ( {/* useState conditional */}
        <menu>
          <a href="/profile">Profil</a>
          <a href="/logout">Logout</a>
        </menu>
      )}
    </div>
  );
}
```

**Flow:**
1. User klik button → `setIsProfileOpen(true)` → Menu tampil
2. User klik luar menu → useEffect detect via `dropdownRef` → `setIsProfileOpen(false)` → Menu hilang
3. Component unmount → cleanup function hapus listener

---

## 💡 Decision Tree: Which Hook to Use?

```
Need to store changing value?
├─ YES → useState
│   ├─ Form input? → useState
│   ├─ Toggle UI? → useState
│   └─ Filter/search? → useState
│
└─ NO → Do you need DOM reference?
    ├─ YES → useRef
    │   ├─ Click outside detect? → useRef
    │   ├─ Focus input? → useRef
    │   └─ Get element for export? → useRef
    │
    └─ NO → Do you need side effect?
        ├─ YES → useEffect
        │   ├─ Event listener? → useEffect + cleanup
        │   ├─ Data fetch? → useEffect
        │   └─ Setup resource? → useEffect + cleanup
        │
        └─ NO → Just regular variable
            └─ const value = ...;
```

---

## ✅ Best Practices Checklist

### useState
- ✅ One state per logical piece
- ✅ Use descriptive names (isOpen, searchTerm)
- ✅ Initialize with correct default value
- ❌ Don't store DOM elements (use useRef)
- ❌ Don't overuse (group related states)

### useEffect
- ✅ Always add cleanup for listeners/subscriptions
- ✅ Use dependency array to control execution
- ✅ Separate effects for separate concerns
- ❌ Don't forget cleanup return function
- ❌ Don't omit dependency array (unless intentional)

### useRef
- ✅ Use for direct DOM access only
- ✅ Access via ref.current
- ✅ Initialize with null
- ❌ Don't use for state that needs UI updates
- ❌ Don't mutate ref.current in render function

---

## 🚨 Common Mistakes

### Mistake 1: useState for DOM reference
```javascript
// ❌ WRONG
const [dropdown, setDropdown] = useState(null);
setDropdown(document.getElementById("dropdown"));
// Causes unnecessary re-render!

// ✅ RIGHT
const dropdownRef = useRef(null);
// No re-render, cleaner code
```

### Mistake 2: useEffect without cleanup
```javascript
// ❌ WRONG - Memory leak!
useEffect(() => {
  document.addEventListener("click", handler);
}, []);
// Multiple listeners stacked on re-render

// ✅ RIGHT
useEffect(() => {
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}, []); // Cleanup function!
```

### Mistake 3: useRef in render logic
```javascript
// ❌ WRONG
function Component() {
  const ref = useRef(null);
  ref.current.focus(); // DOM might not exist yet!
  return <input ref={ref} />;
}

// ✅ RIGHT
function Component() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus(); // Safe in useEffect
  }, []);
  return <input ref={ref} />;
}
```

---

## 📚 File References

For more details, see:
- `REACT_HOOKS_DOCUMENTATION.md` - Detailed explanations with diagrams
- `RINGKASAN_5W+1H_REACT_HOOKS.md` - Complete 5W+1H answers
- `EXCALIDRAW_DIAGRAM_GUIDE.md` - How to create visual diagrams
- `SUBMISSION_CHECKLIST.md` - What to submit

---

**Print this sheet and keep it with you! 📄**

Happy coding! 🚀
