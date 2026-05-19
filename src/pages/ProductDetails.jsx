import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import productGroups from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id, pid } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // ✅ SAFE STRING MATCH (MAIN FIX)
  const group = productGroups.find(
    (g) => String(g.id) === String(id)
  );

  if (!group) return <h2>Category Not Found</h2>;

  const product = group.products.find(
    (p) => String(p.id) === String(pid)
  );

  if (!product) return <h2>Product Not Found</h2>;

  const increase = () => setQty(qty + 1);

  const decrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
      navigate("/cart");
    }, 1200);
  };

  return (
    <div className="product-detail-page">

      <div className="detail-card">

        <img src={product.image} alt={product.name} />

        <h1>{product.name}</h1>

        <p>
          {product.description ||
            "Natural Himalayan salt lamp giving warm glow and peaceful environment."}
        </p>

        <h2>${product.price}</h2>

        {/* QTY */}
        <div className="qty-box">
  <button className="qty-btn" onClick={decrease}>-</button>
  <span className="qty-number">{qty}</span>
  <button className="qty-btn" onClick={increase}>+</button>
</div>

        <button onClick={handleAdd} className="add-btn">
          Add to Cart
        </button>

        <button onClick={() => navigate(-1)}>
          ← Back
        </button>

        {added && (
          <div className="toast">
            ✅ Added Successfully
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;