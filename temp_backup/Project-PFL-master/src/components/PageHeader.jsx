import React from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";

const T = {
  primary: "#1ABC9C", // Hijau Netto Zarvis
  primaryDark: "#16A085",
  text: "#11142D",
  textMuted: "#808191",
  surface: "#FFFFFF",
  border: "#E4E4E4"
};

export default function PageHeader({
  title,
  breadcrumb = [],
  children,
  onAdd,
  addLabel,
}) {
  return (
    <div 
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      style={{
        background: T.surface,
        padding: "24px 30px",
        borderRadius: "24px", // Radius khas Zarvis (lebih lembut)
        border: `1px solid ${T.border}`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
      }}
    >
      {/* Left: Title & Breadcrumb */}
      <div>
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {title}
        </h1>

        <div className="flex items-center flex-wrap gap-2 mt-1">
          {Array.isArray(breadcrumb) ? (
            breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <span key={index} className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: isLast ? 700 : 500,
                      color: isLast ? T.primary : T.textMuted,
                      cursor: isLast ? "default" : "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {item}
                  </span>
                  {!isLast && (
                    <FaChevronRight style={{ fontSize: 8, color: "#cbd5e1" }} />
                  )}
                </span>
              );
            })
          ) : (
            <span style={{ fontSize: "12px", color: T.textMuted, fontWeight: 500 }}>
              {breadcrumb}
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="w-full sm:w-auto flex justify-end">
        {children ? (
          children
        ) : onAdd ? (
          <button
            onClick={onAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.95]"
            style={{
              background: T.primary,
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              boxShadow: `0 8px 20px rgba(26, 188, 156, 0.25)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = T.primaryDark;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.primary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <FaPlus style={{ fontSize: 12 }} />
            {addLabel || "Tambah Baru"}
          </button>
        ) : null}
      </div>
    </div>
  );
}