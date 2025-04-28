function ProductCard({ product, handleAddToCart }) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          className="h-60 w-full object-cover"
          src={product.image}
          alt={product.name}
        />
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-gray-700 mb-2">{product.description}</p>
          <p className="text-xl font-semibold text-blue-600 mb-4">₹{product.price}</p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
  
  export default ProductCard;
  