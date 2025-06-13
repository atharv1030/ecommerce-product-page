import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
        NexusMart
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
          Products
        </Link>
        
       
        <Link 
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>

        {/* signup page */}
        <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>
        
        <Link 
          to="/cart" 
          className="relative flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <span className="material-icons mr-1">shopping_cart</span>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;