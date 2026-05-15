import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";

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

/* Auth */
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

/* Layout */
const MainLayout = lazy(() => import("./layouts/MainLayout"));

/* Protected Route */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* MAIN */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          {/* MEMBERS */}
          <Route path="/members" element={<Member />} />
          <Route path="/members/add" element={<AddMember />} />
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
  );
}

export default App;