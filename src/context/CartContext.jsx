import { createContext, useContext, useEffect, useState, useRef } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const toastRef = useRef(null);

  // AUTH LISTENER
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        try {
          const saved = localStorage.getItem(`cart_${u.uid}`);
          setCart(saved ? JSON.parse(saved) : []);
        } catch (err) {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    });

    return () => unsub();
  }, []);

  // SAVE CART
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // ✅ CLEAN SINGLE TOAST (FIXED)
  const showToast = (msg) => {
    if (toastRef.current) {
      clearTimeout(toastRef.current);
    }

    setToast(msg);

    toastRef.current = setTimeout(() => {
      setToast("");
    }, 2000);
  };

  // ADD TO CART (LOGIN PROTECTED)
  const addToCart = (item) => {
    if (!user) {
      showToast("Please login first 🔐");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);

      if (exists) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });

    showToast("Item added to cart ✅");
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed ❌");
  };

  const clearCart = () => {
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
    setCart([]);
    showToast("Cart cleared 🧹");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        user,
        cart,
        setCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        toast,
      }}
    >
      {children}

    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}