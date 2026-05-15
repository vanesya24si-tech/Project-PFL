import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Import icon yang sesuai dengan fungsionalitas baru
import { 
  MdDashboard, 
  MdPeople, 
  MdReceipt, 
  MdLocalLaundryService,
  MdLocationOn, 
  MdNotifications, 
  MdStar, 
  MdTimeline, 
  MdChatBubble, 
  MdBarChart, 
  MdSettings,
  MdShield 
} from "react-icons/md";

const T = {
  primary: "#1ABC9C", // Tetap Hijau Netto
  textMuted: "#808191",
  textActive: "#11142D",
  surface: "#FFFFFF",
  border: "#E4E4E4"
};

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu Lengkap Berdasarkan Referensi Gambar
  const menuItems = [
    { icon: <MdDashboard />, label: "Dashboard", path: "/" },
    { icon: <MdPeople />, label: "Pelanggan", path: "/members" },
    { icon: <MdLocalLaundryService />, label: "Produk Laundry", path: "/products" },
    { icon: <MdReceipt />, label: "Transaksi", path: "/orders" },
    { icon: <MdLocationOn />, label: "Tracking Laundry", path: "/tracking" },
    { icon: <MdNotifications />, label: "Notifikasi", path: "/notifications" },
    { icon: <MdStar />, label: "Program Loyalitas", path: "/loyalty" },
    { icon: <MdTimeline />, label: "Segmentasi", path: "/segmentation" },
    { icon: <MdChatBubble />, label: "Feedback", path: "/feedback" },
    { icon: <MdBarChart />, label: "Laporan CRM", path: "/reports" },
  ];

  return (
    <aside style={{ 
      width: collapsed ? 90 : 260, 
      background: T.surface, 
      padding: "30px 20px", 
      display: "flex", 
      flexDirection: "column", 
      borderRight: `1px solid ${T.border}`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      height: "100vh"
    }}>
      
      {/* Logo Netto Laundry */}
      <div style={{ 
        display: "flex", alignItems: "center", gap: 12, 
        paddingLeft: 10, marginBottom: 30, overflow: "hidden" 
      }}>
        <div style={{ 
          width: 35, height: 35, borderRadius: 10, background: T.primary, 
          display: "flex", alignItems: "center", justifyContent: "center", 
          color: "#fff", fontWeight: "800", fontSize: 20, flexShrink: 0,
          boxShadow: `0 4px 10px rgba(26, 188, 156, 0.3)`
        }}>N</div>
        {!collapsed && (
          <span style={{ 
            fontWeight: 800, fontSize: 20, color: "#11142D", 
            letterSpacing: "-1px", fontFamily: "'Inter', sans-serif" 
          }}>
            NETTO<span style={{ color: T.primary }}>.</span>
          </span>
        )}
      </div>

      {!collapsed && (
        <p style={{ 
          fontSize: "11px", 
          fontWeight: "800", 
          color: T.textMuted, 
          marginBottom: "15px", 
          paddingLeft: "15px",
          letterSpacing: "1px"
        }}>
          MENU UTAMA
        </p>
      )}

      {/* Navigasi Menu - Scrollable jika menu banyak */}
      <nav style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 4, 
        overflowY: "auto",
        paddingRight: "5px" 
      }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 15, padding: "12px 15px", 
                borderRadius: 12, cursor: "pointer", transition: "0.2s",
                background: isActive ? "rgba(26, 188, 156, 0.1)" : "transparent",
                color: isActive ? T.primary : T.textMuted,
              }}
            >
              <span style={{ 
                fontSize: 22, display: "flex", 
                color: isActive ? T.primary : "#B2B3BD" 
              }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span style={{ 
                  fontWeight: isActive ? "700" : "600", 
                  fontSize: "14px", flex: 1 
                }}>
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <div style={{ 
                  width: 6, height: 6, borderRadius: "50%", 
                  background: T.primary, boxShadow: `0 0 8px ${T.primary}` 
                }} />
              )}
            </div>
          );
        })}
      </nav>

      {/* Security Card Tetap di Bawah */}
      {!collapsed && (
        <div style={{ 
          marginTop: "auto", background: T.primary, borderRadius: 24, 
          padding: "20px", color: "#fff", position: "relative", overflow: "hidden",
          boxShadow: `0 10px 20px rgba(26, 188, 156, 0.2)`
        }}>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ 
              width: 32, height: 32, borderRadius: "50%", 
              background: "rgba(255,255,255,0.2)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              marginBottom: 12 
            }}>
              <MdShield size={18} color="#fff" />
            </div>
            <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>Keamanan Data</p>
            <p style={{ fontSize: "11px", opacity: 0.8, margin: "4px 0 15px", lineHeight: "1.4" }}>
              Sesi aktif sebagai Supervisor Netto.
            </p>
          </div>
          <div style={{ 
            position: "absolute", bottom: -20, right: -20, width: 80, height: 80, 
            background: "rgba(255,255,255,0.15)", borderRadius: "50%" 
          }} />
        </div>
      )}
    </aside>
  );
}