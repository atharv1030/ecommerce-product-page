import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import ProductCard from './components/ProductCard';
import CartPage from "./pages/CartPage";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/userContext";
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Marketplace from "./pages/MarketPlace";
import AddProductForm from './components/AddProductForm';
import CategoryFilter from './components/CategoryFilter';
import AdminCategoryPage from './pages/AdminCategoryPage';

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
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Loading products...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl text-red-500">Error: {error}</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartCount={cartCount} />
      <div className="pt-20 px-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: '64px' }}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                dprice: product.dprice,
                image: product.imageUrl
              }}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/AddProductForm" element={<AddProductForm />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={<AdminCategoryPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </Router>
      </UserProvider>
    </CartProvider>
  );
}

export default App;