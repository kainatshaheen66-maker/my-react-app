import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  collection,
  getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function AdminNavbar() {

  const { logout } = useAuth();

  const [ordersCount, setOrdersCount] = useState(0);

  // FETCH ORDERS COUNT
  useEffect(() => {

    const fetchOrders = async () => {
      try {

        const snap = await getDocs(
          collection(db, "orders")
        );

        setOrdersCount(snap.size);

      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();

  }, []);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <h2 className="logo">
        Admin Panel
      </h2>

      {/* LINKS */}
      <div className="nav-links">

        {/* DASHBOARD */}
        <Link to="/admin">
          Dashboard
        </Link>

        {/* ORDERS */}
        <Link to="/admin/orders">
          Orders 📦 ({ordersCount})
        </Link>

        {/* ADD ITEMS */}
        <Link to="/add-items">
          Add Items ➕
        </Link>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default AdminNavbar;