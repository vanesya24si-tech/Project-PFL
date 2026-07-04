import React, { useState } from "react";
import { 
  FaFacebookF, FaGoogle, FaLinkedinIn 
} from "react-icons/fa";
import { 
  MdOutlineEmail, MdLockOutline, MdPersonOutline, MdDashboard, 
  MdPeople, MdBarChart, MdShoppingCart, MdSettings, MdNotifications, 
  MdSearch, MdTrendingUp, MdTrendingDown, MdAttachMoney, 
  MdOutlineInventory2, MdMenu, MdChevronLeft, MdLogout
} from "react-icons/md";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from "recharts";

// ─── DESIGN TOKENS ──────────────────────────────────────────
const T = {
  primary: "#1ABC9C",
  primaryDark: "#16A085",
  primaryLight: "#E8F8F5",
  gradient: "linear-gradient(135deg, #1ABC9C 0%, #0D7A68 100%)",
  sidebar: "#1A2E35",
  sidebarActive: "#1ABC9C",
  white: "#FFFFFF",
  bg: "#F8FAFB",
  surface: "#FFFFFF",
  border: "#E0EEEA",
  text: "#1A2E35",
  textMuted: "#7F9E97",
  success: "#2ECC71",
  danger: "#E74C3C",
  info: "#3498DB",
  warning: "#F39C12",
};

// ─── MOCK DATA ──────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4700 },
  { month: "Apr", revenue: 6300 },
  { month: "May", revenue: 5800 },
  { month: "Jun", revenue: 7200 },
  { month: "Jul", revenue: 8100 },
];

// ─── REUSABLE COMPONENTS ────────────────────────────────────
function Logo({ white = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ 
        width: 35, height: 35, borderRadius: 10, 
        background: white ? "rgba(255,255,255,0.2)" : T.primary, 
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: white ? "none" : `0 4px 10px ${T.primary}40`
      }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>N</span>
      </div>
      <span style={{ 
        fontWeight: 800, fontSize: 18, 
        color: white ? "#fff" : T.text, letterSpacing: "-0.5px" 
      }}>
        NETTO<span style={{ color: white ? "#fff" : T.primary }}>LAUNDRY.</span>
      </span>
    </div>
  );
}

function PrimaryButton({ children, white = false, onClick, loading = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "14px", borderRadius: 12, 
        border: white ? "2px solid #fff" : "none",
        background: white ? (hov ? "white" : "transparent") : (hov ? T.primaryDark : T.primary),
        color: white ? (hov ? T.primary : "#fff") : "#fff",
        fontWeight: 800, fontSize: 14, cursor: "pointer", 
        transition: "all 0.3s ease",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: !white && hov ? `0 8px 20px ${T.primary}40` : "none"
      }}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
}

function InputField({ icon, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <span style={{ 
        position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
        color: focused ? T.primary : T.textMuted, fontSize: 20, transition: "0.3s" 
      }}>{icon}</span>
      <input
        type={type} placeholder={placeholder} 
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ 
          width: "100%", padding: "14px 14px 14px 48px", background: "#F9FBFA", 
          border: `2px solid ${focused ? T.primary : "#F1F5F4"}`, 
          borderRadius: 12, fontSize: 14, color: T.text, outline: "none", 
          transition: "0.3s", boxSizing: "border-box"
        }}
      />
    </div>
  );
}

// ─── DASHBOARD SUB-COMPONENTS ───────────────────────────────
function StatCard({ label, value, trend, icon, color }) {
  const isUp = trend >= 0;
  return (
    <div style={{ 
      background: "#fff", padding: 24, borderRadius: 20, 
      border: `1px solid ${T.border}`, boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
        <div style={{ 
          width: 45, height: 45, borderRadius: 12, background: color + "15",
          display: "flex", alignItems: "center", justifyContent: "center", 
          color: color, fontSize: 24
        }}>{icon}</div>
        <div style={{ 
          display: "flex", alignItems: "center", gap: 4, 
          color: isUp ? T.success : T.danger, fontSize: 12, fontWeight: 700 
        }}>
          {isUp ? <MdTrendingUp /> : <MdTrendingDown />} {Math.abs(trend)}%
        </div>
      </div>
      <h4 style={{ margin: 0, color: T.textMuted, fontSize: 14, fontWeight: 600 }}>{label}</h4>
      <h2 style={{ margin: "5px 0 0", fontSize: 24, fontWeight: 800, color: T.text }}>{value}</h2>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────
export default function NettoLaundryApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("signin");
  const [collapsed, setCollapsed] = useState(false);

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: "100vh", background: "#F0F4F3", display: "flex", 
        alignItems: "center", justifyContent: "center", padding: 20,
        fontFamily: "'Nunito', sans-serif"
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
        
        <div style={{ 
          background: "#fff", borderRadius: 30, overflow: "hidden", 
          display: "flex", width: "100%", maxWidth: 900, height: 550,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)"
        }}>
          {/* Form Side */}
          <div style={{ flex: 1, padding: "50px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Logo />
            <div style={{ marginTop: 30, marginBottom: 30 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: T.text, margin: 0 }}>
                {mode === "signin" ? "Selamat Datang!" : "Buat Akun"}
              </h1>
              <p style={{ color: T.textMuted, fontSize: 15, marginTop: 8 }}>
                {mode === "signin" ? "Masuk ke panel admin laundry Anda." : "Mulai kelola bisnis laundry Anda hari ini."}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              {mode === "signup" && <InputField icon={<MdPersonOutline />} placeholder="Nama Lengkap" />}
              <InputField icon={<MdOutlineEmail />} placeholder="Email Admin" />
              <InputField icon={<MdLockOutline />} placeholder="Kata Sandi" type="password" />
              <PrimaryButton onClick={() => setIsLoggedIn(true)}>
                {mode === "signin" ? "MASUK SEKARANG" : "DAFTAR AKUN"}
              </PrimaryButton>
            </div>

            <p style={{ textAlign: "center", marginTop: 25, fontSize: 14, color: T.textMuted }}>
              {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}
              <span 
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                style={{ color: T.primary, fontWeight: 800, cursor: "pointer", marginLeft: 5 }}
              >
                {mode === "signin" ? "Daftar" : "Login"}
              </span>
            </p>
          </div>

          {/* Decor Side */}
          <div style={{ 
            flex: 0.8, background: T.gradient, padding: 40,
            display: "flex", flexDirection: "column", alignItems: "center", 
            justifyContent: "center", color: "#fff", textAlign: "center" 
          }}>
            <div style={{ fontSize: 80, marginBottom: 20 }}>🧺</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 15 }}>Netto Laundry CRM</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.6 }}>Sistem manajemen laundry cerdas untuk efisiensi maksimal dan pelanggan puas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "'Nunito', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
      
      {/* Sidebar */}
      <aside style={{ 
        width: collapsed ? 80 : 260, background: T.sidebar, 
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
        display: "flex", flexDirection: "column", color: "#fff"
      }}>
        <div style={{ padding: "25px 20px", marginBottom: 20 }}>
          <Logo white />
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { icon: <MdDashboard />, label: "Dashboard", id: "dash" },
            { icon: <MdPeople />, label: "Pelanggan", id: "cust" },
            { icon: <MdShoppingCart />, label: "Pesanan", id: "ord" },
            { icon: <MdBarChart />, label: "Laporan", id: "rep" },
            { icon: <MdSettings />, label: "Pengaturan", id: "sett" },
          ].map((item) => (
            <div 
              key={item.id}
              style={{ 
                display: "flex", alignItems: "center", gap: 15, padding: "15px 25px",
                cursor: "pointer", transition: "0.2s",
                color: item.id === "dash" ? T.primary : "#94A3B8",
                background: item.id === "dash" ? "rgba(26,188,156,0.1)" : "transparent",
                borderLeft: `4px solid ${item.id === "dash" ? T.primary : "transparent"}`
              }}
            >
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              {!collapsed && <span style={{ fontWeight: 700, fontSize: 15 }}>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div 
          onClick={() => setIsLoggedIn(false)}
          style={{ padding: 25, borderTop: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", display: "flex", gap: 15, alignItems: "center", color: "#94A3B8" }}
        >
          <MdLogout size={24} />
          {!collapsed && <span style={{ fontWeight: 700 }}>Keluar</span>}
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ 
          height: 80, background: "#fff", display: "flex", 
          alignItems: "center", justifyContent: "space-between", padding: "0 30px",
          borderBottom: `1px solid ${T.border}`
        }}>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: "#F1F5F4", border: "none", padding: 8, borderRadius: 10, cursor: "pointer", color: T.text }}
          >
            {collapsed ? <MdMenu size={24} /> : <MdChevronLeft size={24} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative" }}>
              <MdNotifications size={24} color={T.textMuted} />
              <div style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: T.danger, borderRadius: "50%", border: "2px solid #fff" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right", display: "none", sm: "block" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Admin Netto</p>
                <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>Manager</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: T.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>AD</div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 40 }}>
          <div style={{ marginBottom: 35 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: T.text, margin: 0 }}>Ringkasan Bisnis</h1>
            <p style={{ color: T.textMuted, fontSize: 16, marginTop: 5 }}>Pantau performa laundry Anda secara real-time.</p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 25, marginBottom: 40 
          }}>
            <StatCard label="Total Pendapatan" value="Rp 84,2 Jt" trend={12.5} icon={<MdAttachMoney />} color={T.primary} />
            <StatCard label="Pelanggan Baru" value="1,293" trend={8.2} icon={<MdPeople />} color={T.info} />
            <StatCard label="Pesanan Selesai" value="847" trend={-2.4} icon={<MdShoppingCart />} color={T.success} />
            <StatCard label="Stok Deterjen" value="42 Kg" trend={5.1} icon={<MdOutlineInventory2 />} color={T.warning} />
          </div>

          <div style={{ background: "#fff", padding: 30, borderRadius: 24, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Grafik Pendapatan</h3>
              <select style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${T.border}`, outline: "none" }}>
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={T.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: T.textMuted, fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: T.textMuted, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                />
                <Area type="monotone" dataKey="revenue" stroke={T.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
}