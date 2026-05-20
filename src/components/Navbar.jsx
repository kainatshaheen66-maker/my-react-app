import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Cart from "../pages/Cart";

function Navbar() {
  const { cartCount, toast } = useCart();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // 🔥 helper function
  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav className="navbar">

        <h2 className="logo">Glow Salt</h2>

        {/* MOBILE BUTTON */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className={`nav-links ${open ? "active" : ""}`}>

          <Link to="/" onClick={closeMenu}>Home</Link>

          <Link to="/orders" onClick={closeMenu}>Orders</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu}>Login</Link>

              <Link
                to="/signup"
                className="signup-btn"
                onClick={closeMenu}
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="user-email">{user.email}</span>

              {/* CART ICON */}
              <button
                className="cart-icon-btn"
                onClick={() => {
                  setCartOpen(true);
                  closeMenu(); // 🔥 close mobile menu
                }}
              >
                🛒 ({cartCount})
              </button>

              <button
                onClick={() => {
                  logout();
                  closeMenu(); // 🔥 close menu after logout
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}

          {user?.email === "admin@gmail.com" && (
            <Link to="/admin" onClick={closeMenu}>
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
        <div
          className="overlay"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </>
  );
}

export default Navbar;