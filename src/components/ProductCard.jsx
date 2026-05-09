import { useCart } from "../context/CartContext";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

function ProductCard({ product, index = 0 }) {
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Category Ribbon */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25">
          {product.catname}
        </span>
      </div>

      {/* Discount Badge */}
      {product.price && product.dprice && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25">
            {Math.round(((product.price - product.dprice) / product.price) * 100)}% OFF
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={product.image}
          alt={product.name}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-5">
          {product.price && (
            <span className="text-sm font-medium text-gray-400 line-through">
              ₹{product.price}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{product.dprice || product.price}
          </span>
        </div>

        {/* Add to Cart or Quantity Controls */}
        {!cartItem ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              addToCart({
                ...product,
                price: product.dprice || product.price,
                quantity: 1
              })
            }
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        ) : (
          <div className="space-y-3">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center gap-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <button
                onClick={() =>
                  updateQuantity(cartItem.id, Math.max(1, cartItem.quantity - 1))
                }
                className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition-colors shadow-sm"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                className="p-2 rounded-lg bg-white dark:bg-gray-600 hover:bg-blue-50 dark:hover:bg-gray-500 text-gray-700 dark:text-white transition-colors shadow-sm"
              >
                <Plus size={18} />
              </button>
            </motion.div>
            <button
              onClick={() => removeFromCart(cartItem.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Remove
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;