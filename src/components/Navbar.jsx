function Navbar({ cartCount }) {
    return (
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 ">NexusMart</div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Products</a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
          <div className="relative">
            <span className="material-icons">Shopping Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </nav>
    );
  }
  
  export default Navbar;
  