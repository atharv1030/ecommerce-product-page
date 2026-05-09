import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";
import { motion } from "framer-motion";
import { Grid, List } from "lucide-react";

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdd = () => {
    fetchProducts();
  };

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Sidebar - Add Product Form */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants}>
              <AddProductForm onProductAdd={handleProductAdd} />
            </motion.div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h2>
                <p className="text-gray-500 dark:text-gray-400">{products.length} products available</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </motion.div>

            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 rounded-2xl skeleton" />
                ))}
              </div>
            ) : (
              <motion.div
                variants={pageVariants}
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      id: product._id,
                      price: product.price,
                      dprice: product.price,
                      image: product.imageUrl,
                      catname: product.category?.name || "Uncategorized",
                    }}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Marketplace;