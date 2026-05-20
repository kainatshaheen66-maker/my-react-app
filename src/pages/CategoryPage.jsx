import { useParams, useNavigate } from "react-router-dom";
import productGroups from "../data/products";
import { useCart } from "../context/CartContext";

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, user } = useCart();

  const group = productGroups.find(
    (g) => String(g.id) === String(id)
  );

  if (!group) return <h2>Category Not Found</h2>;

  const handleAddToCart = (item) => {
    if (!user) {
      addToCart(item);
      return;
    }

    addToCart(item);
  };

  return (
    <div className="category-page">

      <h2 className="category-title">
        {group.title}
      </h2>

      <div className="product-grid">
        {group.products.map((item) => (
          <div className="product-card" key={item.id}>

            <img
              src={item.image}
              alt={item.name}
              className="product-image"
              onClick={() =>
                navigate(`/product/${group.id}/${item.id}`)
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