import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #F8FCFE 0%, #F0F9FF 100%)",
            padding: "20px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "400px",
              background: "white",
              padding: "40px",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              border: "1px solid #E2E8F0",
            }}
          >
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "900",
                color: "#DC2626",
                marginBottom: "12px",
              }}
            >
              Terjadi Kesalahan
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#64748B",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}
            >
              {this.state.error?.message || "Gagal memuat halaman. Silakan refresh."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                background: "#DC2626",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#B91C1C")}
              onMouseOut={(e) => (e.target.style.background = "#DC2626")}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
