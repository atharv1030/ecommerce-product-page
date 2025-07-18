import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("previewUsed");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-3 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:text-blue-700"
      >
        NexusMart
      </Link>

      {!isLoggedIn ? (
        <div className="ml-auto">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      ) : (
        <div className="flex-1 flex justify-end space-x-10 items-center">
          <Link
            to="/"
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors"
          >
            <img
              src="https://wallpapers.com/images/hd/generic-person-icon-profile-ulmsmhnz0kqafcqn-2.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>

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
      )}
    </nav>
  );
}

export default Navbar;
