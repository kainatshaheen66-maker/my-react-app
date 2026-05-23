import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function AdminNavbar({ toggleSidebar }) {

  const { logout } = useAuth();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      setOrdersCount(snap.size);
    };
    fetchOrders();
  }, []);

  return (
    <nav className="navbar">

      {/* 🔥 HAMBURGER */}
      <button className="admin-hamburger" onClick={toggleSidebar}>
        ☰
      </button>

      <h2 className="logo">Admin Panel</h2>

      <div className="nav-links">
        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/orders">
          Orders 📦 ({ordersCount})
        </Link>

        <Link to="/add-items">Add Items ➕</Link>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default AdminNavbar;