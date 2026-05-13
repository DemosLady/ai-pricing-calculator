import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        maxWidth: 900, margin: "0 auto", padding: "16px 16px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Link to="/" style={{
          textDecoration: "none", fontSize: 15, fontWeight: 700, color: "#1a1a1a",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            background: "#1a1a1a", color: "#fff", width: 28, height: 28,
            borderRadius: 6, display: "inline-flex", alignItems: "center",
            justifyContent: "center", fontSize: 13, fontWeight: 700,
          }}>AI</span>
          Pricing Calculator
        </Link>
        <div style={{ display: "flex", gap: 24, fontSize: 14 }}>
          <Link to="/" style={{
            textDecoration: "none", fontWeight: isHome ? 600 : 400,
            color: isHome ? "#1a1a1a" : "#888",
          }}>Calculator</Link>
          <Link to="/blog" style={{
            textDecoration: "none",
            fontWeight: location.pathname.startsWith("/blog") ? 600 : 400,
            color: location.pathname.startsWith("/blog") ? "#1a1a1a" : "#888",
          }}>Blog</Link>
        </div>
      </nav>

      {/* CONTENT */}
      <Outlet />

      {/* FOOTER */}
      <footer style={{
        maxWidth: 900, margin: "0 auto", padding: "32px 16px 48px",
        borderTop: "1px solid #eeece7", fontSize: 12, color: "#bbb",
        textAlign: "center",
      }}>
        <div style={{ marginBottom: 8 }}>
          <Link to="/" style={{ color: "#999", textDecoration: "none", marginRight: 16 }}>Calculator</Link>
          <Link to="/blog" style={{ color: "#999", textDecoration: "none", marginRight: 16 }}>Blog</Link>
        </div>
        <div style={{ marginBottom: 4 }}>Prices sourced from official provider documentation · Last updated: May 2026</div>
        <div>Built with care · Free to use · No tracking</div>
      </footer>
    </div>
  );
}
