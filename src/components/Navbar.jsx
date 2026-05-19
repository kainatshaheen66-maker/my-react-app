import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Cart from "../pages/Cart";

function Navbar() {
  const { cartCount, toast } = useCart(); // 🔥 UPDATED (toast added)
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="navbar">

        <h2 className="logo">Glow Salt</h2>

        {/* MOBILE BUTTON */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <div className={`nav-links ${open ? "active" : ""}`}>

          <Link to="/" onClick={() => setOpen(false)}>Home</Link>

          <Link to="/orders" onClick={() => setOpen(false)}>Orders</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>

              <Link to="/signup" className="signup-btn" onClick={() => setOpen(false)}>
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="user-email">{user.email}</span>

              {/* CART ICON */}
              <button
                className="cart-icon-btn"
                onClick={() => setCartOpen(true)}
              >
                🛒 ({cartCount})
              </button>

              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          )}

          {user?.email === "admin@gmail.com" && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}

        </div>
      </nav>

      {/* CART DRAWER */}
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button onClick={() => setCartOpen(false)}>✖</button>
        </div>

        <div className="cart-drawer-body">
          <Cart />
        </div>
      </div>

      {/* OVERLAY */}
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)} />
      )}

      {/* 🔥 TOAST (NEW ADDITION) */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  );
}

export default Navbar;