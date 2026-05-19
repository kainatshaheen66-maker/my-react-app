import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
  await logout();
  navigate("/login", { replace: true });
};

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>

        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/users">Users</Link>
        <Link to="/add-items">Add Items ➕</Link>

        <button onClick={handleLogout} className="admin-logout">
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;