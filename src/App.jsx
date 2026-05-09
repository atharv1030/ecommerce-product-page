import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartPage from "./pages/CartPage";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext.jsx";
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import MarketPlace from './pages/Marketplace.jsx';
import AIChatbot from './components/AIChatbot';

import AddProductForm from './components/AddProductForm';
import CategoryFilter from './components/CategoryFilter';
import AdminCategoryPage from './pages/AdminCategoryPage';
import SiteAdmin from "./admin/siteAdmin";
import Dashboard from "./admin/pages/DashboardHome";
import ProductsAdmin from "./admin/pages/ProductsAdmin";
import UsersAdmin from "./admin/pages/UsersAdmin";

function HomePage() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `http://localhost:5000/api/products/category/${selectedCategory}`
          : 'http://localhost:5000/api/products';

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = useCallback(() => {
    setCartCount((prev) => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-500 animate-pulse">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Products</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar cartCount={cartCount} />

      {/* Hero Section */}
      <div className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-500/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aC0ydi0zaDJ2M3ptLTIgMGgtMnYtNGgyek0zMiAzNGgtMnYtNWgyek0zMCAzNGgtMnYtNmgyek0yOCAzNGgtMnYtN2gyek0yNiAzNGgtMnYtOGgyeiIvPjwvZjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">NexusMart</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices. Shop with confidence.
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
            .filter((product) => product.category && product.category.name)
            .map((product, index) => (
              <ProductCard
                key={product._id}
                product={{
                  id: product._id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  dprice: product.dprice,
                  image: product.imageUrl,
                  catname: product.category.name,
                }}
                index={index}
                handleAddToCart={handleAddToCart}
              />
            ))}
        </div>

        {products.filter((product) => product.category && product.category.name).length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for new products!</p>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<SiteAdmin />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/AddProductForm" element={<AddProductForm />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={<AdminCategoryPage />} />
            <Route path="/marketplace" element={<MarketPlace />} />

          </Routes>
        </Router>
      </UserProvider>
    </CartProvider>
  );
}

export default App;