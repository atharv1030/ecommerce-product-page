import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AddProductForm from "../components/AddProductForm";

function Marketplace() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdd = () => {
    fetchProducts(); // Re-fetch after adding
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
      <div className="md:col-span-1">
        <AddProductForm onProductAdd={handleProductAdd} />
      </div>
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={{
            ...product,
            id: product._id,
            price: product.price,
            dprice: product.price,
            image: product.image,
          }} />
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
