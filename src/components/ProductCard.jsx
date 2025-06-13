import { useCart } from "../context/CartContext";
import { useMemo } from "react";

function ProductCard({ product }) {
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    cartItems
  } = useCart();

  // Check if product is already in cart
  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === product.id),
    [cartItems, product.id]
  );

  return (
    <div className="bg-white p-12 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        className="h-60 w-full object-cover"
        src={product.image}
        alt={product.name}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-2 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-3 mb-4">
          {product.price && (
            <p className="text-xl font-semibold text-red-600 line-through">
              ₹{product.price}
            </p>
          )}
          <p className="text-xl font-semibold text-green-600">
            ₹{product.dprice || product.price}
          </p>
        </div>

        {!cartItem ? (
          <button
            onClick={() =>
              addToCart({
                ...product,
                price: product.dprice || product.price,
                quantity: 1
              })
            }
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center border rounded">
              <button
                onClick={() =>
                  updateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))
                }
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1 border-x">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(cartItem.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
