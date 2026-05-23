import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">

      {/* TOP BAR (MOBILE HAMBURGER) */}
      <div className="admin-topbar">
        <button
          className="admin-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h2 className="admin-logo-mobile">Admin Panel</h2>
      </div>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2 className="admin-logo">Admin Panel</h2>

        <Link to="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
        <Link to="/admin/orders" onClick={() => setSidebarOpen(false)}>Orders</Link>
        <Link to="/users" onClick={() => setSidebarOpen(false)}>Users</Link>
        <Link to="/add-items" onClick={() => setSidebarOpen(false)}>Add Items ➕</Link>

        <button onClick={handleLogout} className="admin-logout">
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {children}
      </main>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

    </div>
  );
}

export default AdminLayout;