import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import ProductCard from './components/ProductCard';
import products from './data/products';
import CartPage from "./pages/CartPage";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import ProfilePage from './pages/ProfilePage';
import { CartProvider } from "./context/CartContext";
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
// import PrivateRoute from './components/privateRoute.jsx';
// import HomeGuard from './components/HomeGuard';

function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar cartCount={cartCount} />
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: '64px' }}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={
              <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute>
      <CartPage />
    </ProtectedRoute>} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;