import React from "react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCart();

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-item">

            <img
              src={item.image}
              alt={item.name}
              className="cart-image"
            />

            <div>
              <h3>{item.name}</h3>

              <p>Price: {item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <button onClick={() => increaseQuantity(item.id)}>
                +
              </button>

              <button onClick={() => decreaseQuantity(item.id)}>
                -
              </button>

              <button onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;