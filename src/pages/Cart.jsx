import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // OPEN CHECKOUT
  const openCheckout = () => {
    const user = auth.currentUser;

    if (!user) return alert("Please login first");
    if (cart.length === 0) return alert("Cart is empty");

    setShowForm(true);
  };

  // PLACE ORDER (UPDATED)
  const placeOrder = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      const orderData = {
        userId: user.uid,

        // 👤 FLATTEN USER DATA (IMPORTANT FOR ADMIN)
        userName: formData.name,
        userEmail: formData.email,
        phone: formData.phone,
        address: formData.address,

        // 🛒 CLEAN ITEMS FORMAT (IMPORTANT)
        items: cart.map((item) => ({
          image: item.image,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),

        total: totalPrice,

        status: "Pending",

        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();
      setShowForm(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      alert("Order Placed Successfully ✅");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="cart-container">

      {/* HEADER */}
      <div className="cart-top">
        <h2>🛒 Shopping Cart</h2>

        {cart.length > 0 && (
          <div className="cart-top-total">
            Total: ${totalPrice.toFixed(2)}
          </div>
        )}
      </div>

      {/* EMPTY */}
      {cart.length === 0 ? (
        <div className="cart-empty">
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <div className="cart-items">

          {cart.map((item) => (
            <div key={item.id} className="cart-item">

              <img src={item.image} className="cart-image" alt="" />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>${item.price}</p>

                <div className="cart-controls">

                  <div className="qty">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>

                    <span style={{
                      color: "#ff8800",
                      fontWeight: "bold",
                      padding: "0 7px",
                    }}>
                      {item.quantity}
                    </span>

                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>

                </div>
              </div>
            </div>
          ))}

          {/* CHECKOUT BUTTON */}
          <button className="place-order-btn" onClick={openCheckout}>
            Checkout
          </button>

        </div>
      )}

      {/* CHECKOUT FORM */}
      {showForm && (
        <div className="checkout-modal">

          <form className="checkout-form" onSubmit={placeOrder}>

            <button
              type="button"
              className="close-form-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            <h2>Checkout Details</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Place Order
            </button>

          </form>

        </div>
      )}

    </div>
  );
}

export default Cart;