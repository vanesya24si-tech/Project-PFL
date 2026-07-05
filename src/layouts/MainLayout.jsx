import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      background: "linear-gradient(135deg, #F8FCFE 0%, #F0F9FF 100%)", // Gradien biru laundry fresh
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
        
        <main style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "16px 24px",
          scrollBehavior: "smooth",
          background: "linear-gradient(135deg, #F8FCFE 0%, #F0F9FF 100%)"
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}