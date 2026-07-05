import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
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

/* ─── ADMIN PAGES ─── */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Member = lazy(() => import("./pages/Member"));
const AddMember = lazy(() => import("./pages/AddMember"));
const Order = lazy(() => import("./pages/Order"));
const AddOrder = lazy(() => import("./pages/AddOrder"));
const Laporan = lazy(() => import("./pages/Laporan"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const MemberDetail = lazy(() => import("./pages/MemberDetail"));
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

/* ─── USER (CUSTOMER) PAGES ─── */
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));
const UserOrders = lazy(() => import("./pages/user/UserOrders"));
const UserLoyalty = lazy(() => import("./pages/user/UserLoyalty"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const UserFeedback = lazy(() => import("./pages/user/UserFeedback"));
const UserComplaint = lazy(() => import("./pages/user/UserComplaint"));

/* ─── PUBLIC ─── */
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const CekOrder = lazy(() => import("./pages/CekOrder"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

/* ─── LAYOUTS ─── */
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const UserLayout = lazy(() => import("./layouts/UserLayout"));

/* ─── ROUTE GUARDS ─── */

/** Hanya admin yang boleh masuk */
const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/user" replace />;
  return children;
};

/** Hanya customer yang boleh masuk */
const CustomerRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

/** Redirect user yang sudah login ke halaman yang sesuai role-nya */
const PublicRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return children;
  return <Navigate to={role === "admin" ? "/dashboard" : "/user"} replace />;
};

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" reverseOrder={false} />
      <Suspense fallback={<Loading />}>
        <Routes>

          {/* ─── PUBLIC LANDING PAGE ─── */}
          <Route path="/" element={<LandingPage />} />

          {/* ─── PUBLIC LIVE TRACKING (scan QR/barcode, tanpa login) ─── */}
          <Route path="/track/:orderId" element={<TrackOrder />} />

          {/* ─── CEK ORDER PUBLIK (pelanggan, tanpa registrasi) ─── */}
          <Route path="/cek-order" element={<CekOrder />} />

          {/* ─── AUTH ─── */}
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot"   element={<PublicRoute><Forgot /></PublicRoute>} />

          {/* ════════════════════════════════════
              ADMIN ROUTES — role: "admin"
          ════════════════════════════════════ */}
          <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Members */}
            <Route path="/members"           element={<Member />} />
            <Route path="/members/add"       element={<AddMember />} />
            <Route path="/members/:id/edit"  element={<AddMember />} />
            <Route path="/members/all"       element={<AllMembers />} />
            <Route path="/members/:id"       element={<MemberDetail />} />

            {/* Products */}
            <Route path="/products"    element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Orders */}
            <Route path="/orders"     element={<Order />} />
            <Route path="/orders/add" element={<AddOrder />} />

            {/* CRM Features */}
            <Route path="/tracking"      element={<Tracking />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/loyalty"       element={<Loyalty />} />
            <Route path="/segmentation"  element={<Segmentation />} />
            <Route path="/feedback"      element={<Feedback />} />
            <Route path="/profil-admin"  element={<ProfilAdmin />} />
            <Route path="/settings"      element={<Settings />} />

            {/* Reports */}
            <Route path="/reports" element={<Laporan />} />

            {/* Error pages */}
            <Route path="/400" element={<ErrorPage code="400" />} />
            <Route path="/401" element={<ErrorPage code="401" />} />
            <Route path="/403" element={<ErrorPage code="403" />} />
            <Route path="*"    element={<ErrorPage code="404" />} />
          </Route>

          {/* ════════════════════════════════════
              CUSTOMER PORTAL — role: "customer"
          ════════════════════════════════════ */}
          <Route element={<CustomerRoute><UserLayout /></CustomerRoute>}>
            <Route path="/user"             element={<UserDashboard />} />
            <Route path="/user/orders"      element={<UserOrders />} />
            <Route path="/user/loyalty"     element={<UserLoyalty />} />
            <Route path="/user/profile"     element={<UserProfile />} />
            <Route path="/user/feedback"    element={<UserFeedback />} />
            <Route path="/user/complaint"   element={<UserComplaint />} />
          </Route>

        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;