import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Users from "./pages/Users";
import CategoryPage from "./pages/CategoryPage";
import AddItems from "./pages/AddItems";
import ProductDetails from "./pages/ProductDetails";

function ScrollFix() {
  const location = useLocation();

  useEffect(() => {
    // 🔥 HARD RESET SCROLL (FIXES YOUR ISSUE COMPLETELY)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.email === "admin@gmail.com";

  const adminPages = [
    "/admin",
    "/admin/orders",
    "/users",
    "/add-items",
  ];

  const isAdminPage = adminPages.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* 🔥 GLOBAL SCROLL FIX (IMPORTANT) */}
      <ScrollFix />

      {/* NAVBAR */}
      {isAdminPage && isAdmin ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id/:pid" element={<ProductDetails />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminLayout>
                <Admin />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/orders"
          element={
            isAdmin ? (
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            isAdmin ? (
              <AdminLayout>
                <Users />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/add-items"
          element={
            isAdmin ? (
              <AdminLayout>
                <AddItems />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />

      </Routes>
    </>
  );
}

export default App;