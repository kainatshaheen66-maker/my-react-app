import { useParams, useNavigate } from "react-router-dom";
import productGroups from "../data/products";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [showPopup, setShowPopup] = useState(false);

  const group = productGroups.find((g) => g.id === id);

  if (!group) return <h2>Category Not Found</h2>;

  const handleAddToCart = (item) => {
    addToCart(item);
    setShowPopup(true);

    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="category-page">

      {showPopup && (
        <div className="popup">✅ Successfully Added to Cart</div>
      )}

      <h2 className="category-title">{group.title}</h2>

      <div className="product-grid">
        {group.products.map((item) => (
          <div className="product-card" key={item.id}>

            {/* CLICK → PRODUCT PAGE */}
            <img
              src={item.image}
              alt={item.name}
              className="product-image"
              onClick={() =>
  navigate(`/product/${String(group.id)}/${String(item.id)}`)
}
              style={{ cursor: "pointer" }}
            />

            <h3>{item.name}</h3>
            <p>${item.price}</p>

            <button
              className="add-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;