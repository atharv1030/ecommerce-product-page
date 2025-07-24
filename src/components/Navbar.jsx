import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext"; // ✅ NEW
import { useEffect, useState } from "react";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const { user, logout } = useUser(); // ✅ NEW
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  return (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 sm:px-6 py-2 flex justify-between items-center text-black dark:text-white">
    {/* Logo */}
    <Link
      to="/"
      className="text-2xl font-bold text-blue-600 hover:text-blue-700"
    >
      NexusMart
    </Link>

    {/* Add Product Button */}
    <div className="flex-1 flex justify-start items-center px-4 sm:px-8">
      <Link
        to="/AddProductForm"
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        Add Product
      </Link>
    </div>

    {/* Right Side */}
    {!user ? (
      <div>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </Link>
      </div>
    ) : (
      <div className="flex items-center space-x-4 sm:space-x-6">
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          Hi, {user.name?.split(" ")[0]} 👋
        </span>

        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 transition-colors"
        >
          Home
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-colors text-sm"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* Profile Picture */}
        <Link
          to="/profile"
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors"
        >
          <img
            src={user.profilePic || "https://wallpapers.com/images/hd/generic-person-icon-profile-ulmsmhnz0kqafcqn-2.jpg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>

        {/* Cart Button */}
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
