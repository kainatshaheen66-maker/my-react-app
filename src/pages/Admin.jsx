import { useEffect, useState } from "react";
import {collection, getDocs, updateDoc, doc }from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const ADMIN_EMAIL = "admin@gmail.com";

  if (user?.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // NEW ORDERS TOP
      // ⭐ PRIORITY SORT (NEW → PENDING TOP → DELIVERED LAST → CANCELLED VERY LAST)
const getPriority = (status) => {
  if (!status || status === "Pending") return 1;     // TOP
  if (status === "Processing") return 2;             // MIDDLE
  if (status === "Shipped") return 2;                // MIDDLE
  if (status === "Delivered") return 3;              // LAST
  if (status === "Cancelled") return 4;              // VERY LAST
  return 2;
};

const sortedData = data.sort((a, b) => {
  const aTime = a.createdAt?.seconds || 0;
  const bTime = b.createdAt?.seconds || 0;

  const aPriority = getPriority(a.status);
  const bPriority = getPriority(b.status);

  // 1️⃣ Priority sorting
  if (aPriority !== bPriority) {
    return aPriority - bPriority;
  }

  // 2️⃣ Newest first inside same group
  return bTime - aTime;
});

      setOrders(sortedData);
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: newStatus
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const getStatusClass = (status) => {
    switch ((status || "Pending").toLowerCase()) {
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  return (
    <div className="admin-container">

      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-stats">

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{pendingOrders}</p>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>
          <p>{deliveredOrders}</p>
        </div>

      </div>

      <div className="admin-table">

        <h2>All Orders</h2>

        {orders.map((order) => (

          <div
            key={order.id}
            className={`admin-order-card ${
              !order.status || order.status === "Pending"
                ? "new-order"
                : ""
            }`}
          >

            <div>
              <b>Order ID:</b> {order.id.slice(0, 8)}...
            </div>

            <div>
              <b>Date & Time:</b>{" "}
              {order.createdAt
                ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                : "No Date"}
            </div>

            <div>
              <b>Total:</b> ${order.total}
            </div>

            <div>
              <b>Items:</b> {order.items?.length}
            </div>

            <div className="status-box">
              <b>Status:</b>

              <span className={`status-badge ${getStatusClass(order.status)}`}>
                {order.status || "Pending"}
              </span>

              <select
                value={order.status || "Pending"}
                onChange={(e) =>
                  updateStatus(order.id, e.target.value)
                }
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>

          </div>

        ))}
      </div>
    </div>
  );
}

export default Admin;