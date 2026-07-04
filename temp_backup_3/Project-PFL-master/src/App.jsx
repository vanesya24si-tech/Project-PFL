import "./assets/tailwind.css";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./utils/AuthContext";

/* Error Fallback Component */
const ErrorFallback = ({ error }) => (
  <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-black text-red-600 mb-2">Terjadi Kesalahan</h1>
      <p className="text-sm text-red-500 mb-4">{error?.message || "Gagal memuat halaman"}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition"
      >
        Muat Ulang
      </button>
    </div>
  </div>
);

/* Pages - Original */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Member = lazy(() => import("./pages/Member"));
const AddMember = lazy(() => import("./pages/AddMember"));
const Order = lazy(() => import("./pages/Order"));
const AddOrder = lazy(() => import("./pages/AddOrder"));
const Laporan = lazy(() => import("./pages/Laporan"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const MemberDetail = lazy(() => import("./pages/MemberDetail"));

/* Pages - Fitur Baru CRM Netto */
const Tracking = lazy(() => import("./pages/Tracking"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Loyalty = lazy(() => import("./pages/Loyalty"));
const Segmentation = lazy(() => import("./pages/Segmentation"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProfilAdmin = lazy(() => import("./pages/ProfilAdmin"));
const Settings = lazy(() => import("./pages/Settings"));
const AllMembers = lazy(() => import("./pages/AllMembers"));

/* Auth */
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

/* Layout */
const MainLayout = lazy(() => import("./layouts/MainLayout"));

/* Protected Route */
const ProtectedRoute = ({ children, requiredRole = "admin" }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole === "admin" && role !== "admin") return <Navigate to="/" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return children;

  return <Navigate to={role === "admin" ? "/dashboard" : "/"} replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>

        {/* PUBLIC LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot" element={<PublicRoute><Forgot /></PublicRoute>} />

        {/* MAIN */}
        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* MEMBERS */}
          <Route path="/members" element={<Member />} />
          <Route path="/members/add" element={<AddMember />} />
          <Route path="/members/:id/edit" element={<AddMember />} />
          {/* Rute baru diletakkan di sini sebelum dynamic parameter :id */}
          <Route path="/members/all" element={<AllMembers />} />
          <Route path="/members/:id" element={<MemberDetail />} />

          {/* PRODUCTS */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* ORDERS */}
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/add" element={<AddOrder />} />

          {/* NEW CRM FEATURES (Sesuai Sidebar) */}
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/segmentation" element={<Segmentation />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/profil-admin" element={<ProfilAdmin />} />
          <Route path="/settings" element={<Settings />} />

          {/* REPORTS */}
          <Route path="/reports" element={<Laporan />} />

          {/* ERROR */}
          <Route path="/400" element={<ErrorPage code="400" />} />
          <Route path="/401" element={<ErrorPage code="401" />} />
          <Route path="/403" element={<ErrorPage code="403" />} />

          {/* 404 */}
          <Route path="*" element={<ErrorPage code="404" />} />
        </Route>

      </Routes>
    </Suspense>
  </ErrorBoundary>
  );
}

export default App;