import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        // 🔥 NEW ORDERS FIRST
        .sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );

      setOrders(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const cancelOrder = async (id) => {
    await deleteDoc(doc(db, "orders", id));
  };

  const canCancel = (status) =>
    !status || status === "Pending";

  if (loading) {
    return (
      <div className="orders-container">
        <h2 className="orders-title">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="orders-container">

      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="orders-empty">No Orders Found</p>
      ) : (
        <div className="orders-grid">

          {orders.map((order) => (
            <div key={order.id} className="order-card">

              {/* HEADER */}
              <div className="order-header">
                <h3>Order #{order.id.slice(0, 8)}</h3>

                <small style={{ color: "#777" }}>
                  {order.createdAt
                    ? new Date(
                        order.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "No Date"}
                </small>
              </div>

              {/* ITEMS */}
              {order.items?.map((item, i) => (
                <div key={i} className="order-item">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                  />

                  <div className="order-item-info">
                    <span className="order-item-name">
                      {item.name}
                    </span>

                    <span className="order-item-qty">
                      Qty: {item.quantity}
                    </span>

                    <span style={{ color: "#ff8800", marginTop: "4px" }}>
                      Price: ${item.price} × {item.quantity} ={" "}
                      <b>${item.price * item.quantity}</b>
                    </span>
                  </div>

                </div>
              ))}

              {/* BOTTOM */}
              <div style={{ marginTop: "auto" }}>

                <h4 className="order-total">
                  Total: ${order.total}
                </h4>

                <div
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontWeight: "bold",
                    letterSpacing: "0.5px",
                    background:
                      order.status === "Delivered"
                        ? "green"
                        : order.status === "Shipped"
                        ? "blue"
                        : order.status === "Processing"
                        ? "orange"
                        : order.status === "Cancelled"
                        ? "red"
                        : "gray",
                  }}
                >
                  {order.status || "Pending"}
                </div>

                {canCancel(order.status) && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;