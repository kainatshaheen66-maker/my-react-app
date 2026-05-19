import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/orders";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import Users from "./pages/Users";
import CategoryPage from "./pages/CategoryPage";
import AddItems from "./pages/AddItems";
import ProductDetails from "./pages/ProductDetails";

import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.email === "admin@gmail.com";

  // ADMIN PAGES LIST
  const adminPages = [
    "/admin",
    "/admin/orders",
    "/users",
    "/add-items",
  ];

  // FIXED: supports sub-routes too
  const isAdminPage = adminPages.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* NAVBAR */}
      {isAdminPage && isAdmin ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />

        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/product/:id/:pid" element={<ProductDetails />} />

        {/* ADMIN DASHBOARD */}
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

        {/* ADMIN ORDERS */}
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

        {/* USERS */}
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

        {/* ADD ITEMS */}
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