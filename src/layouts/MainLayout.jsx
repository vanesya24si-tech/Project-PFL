import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "#F4F7FE", // Warna abu-biru muda khas desain
      fontFamily: "'Inter', sans-serif", 
      overflow: "hidden" 
    }}>
      <Sidebar collapsed={collapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          onLogout={handleLogout} 
        />
        
        {/* Area scrollable untuk halaman-halaman */}
        <main style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "20px 40px",
          scrollBehavior: "smooth" 
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}