import { useCart } from "../context/CartContext";
import { useMemo } from "react";

function ProductCard({ product }) {
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    cartItems
  } = useCart();

  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === product.id),
    [cartItems, product.id]
  );

  return (
    <div className="relative group bg-white dark:bg-gray-800 dark:text-white p-4 shadow-md dark:shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700 mb-6">
      
      {/* Category Ribbon */}
      <div className="absolute top-2 left-2 overflow-hidden z-10">
        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-r-full 
                        transform -translate-x-full group-hover:translate-x-0 
                        transition-transform duration-300 ease-in-out shadow-md">
          {product.catname}
        </div>
      </div>

      {/* Product Image */}
      <img
        className="h-90 sm:h-80 w-full object-cover rounded-md mb-4"
        src={product.image}
        alt={product.name}
      />

      {/* Product Info */}
      <div>
        <h3 className="text-lg font-bold mb-1">{product.name}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mb-4">
          {product.price && (
            <p className="text-md font-semibold text-red-600 line-through">
              ₹{product.price}
            </p>
          )}
          <p className="text-lg font-semibold text-green-600">
            ₹{product.dprice || product.price}
          </p>
        </div>

        {/* Add to Cart or Quantity Controls */}
        {!cartItem ? (
          <button
            onClick={() =>
              addToCart({
                ...product,
                price: product.dprice || product.price,
                quantity: 1
              })
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center border rounded dark:border-gray-600">
              <button
                onClick={() =>
                  updateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))
                }
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                -
              </button>
              <span className="px-4 py-1 border-x dark:border-gray-600">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
