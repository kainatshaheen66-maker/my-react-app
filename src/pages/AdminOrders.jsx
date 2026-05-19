import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ⭐ PRIORITY SORT (Pending → Processing → Shipped → Delivered → Cancelled)
        const getPriority = (status) => {
          if (!status || status === "Pending") return 1;
          if (status === "Processing") return 2;
          if (status === "Shipped") return 2;
          if (status === "Delivered") return 3;
          if (status === "Cancelled") return 4;
          return 2;
        };

        const sorted = data.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;

          const aPriority = getPriority(a.status);
          const bPriority = getPriority(b.status);

          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          return bTime - aTime;
        });

        setOrders(sorted);
      }
    );

    return () => unsubscribe();
  }, []);

  // update status
  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), {
      status,
      isNew: false,
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status, isNew: false } : order
      )
    );
  };

  // delete order
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));

    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "badge green";
      case "Shipped":
        return "badge blue";
      case "Processing":
        return "badge orange";
      case "Cancelled":
        return "badge red";
      default:
        return "badge gray";
    }
  };

  return (
    <div className="admin-orders-container">
      <h1 className="admin-title">📦 All Orders</h1>

      <div className="orders-grid">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`order-card ${
              !order.status || order.status === "Pending"
                ? "new-order"
                : ""
            }`}
          >

            {/* ORDER TOP */}
            <div className="order-top">
              <span>#{order.id.slice(0, 8)}</span>

              <small>
                {order.createdAt
                  ? new Date(
                      order.createdAt.seconds * 1000
                    ).toLocaleString()
                  : "No Date"}
              </small>

              <span className={getBadgeClass(order.status)}>
                {order.status || "Pending"}
              </span>
            </div>

            {/* USER DETAILS */}
            <div style={{ marginTop: "10px", padding: "8px", background: "#f7f7f7", borderRadius: "8px" }}>
              <p><b>Name:</b> {order.userName || "N/A"}</p>
              <p><b>Email:</b> {order.userEmail || "N/A"}</p>
              <p><b>Phone:</b> {order.phone || "N/A"}</p>
              <p><b>Address:</b> {order.address || "N/A"}</p>
            </div>

            {/* ITEMS */}
            <div style={{ marginTop: "10px" }}>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "8px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <div>
                    <b>{item.name}</b>
                    <div>Qty: {item.quantity}</div>
                    <div>
                      Price: ${item.price} × {item.quantity} ={" "}
                      <b>${item.price * item.quantity}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <p><b>Total:</b> ${order.total}</p>

            {/* STATUS CHANGE */}
            <select
              value={order.status || "Pending"}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              className="status-select"
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            {/* DELETE */}
            <button
              className="delete-btn"
              onClick={() => deleteOrder(order.id)}
            >
              Delete Order
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;