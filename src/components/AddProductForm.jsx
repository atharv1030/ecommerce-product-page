import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddProductForm({ onProductAdd }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [dprice, setdprice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !dprice || !category || !image) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("dprice", dprice);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        alert("Product added successfully!");
        onProductAdd();
        setTimeout(() => navigate('/'), 3000);
        resetForm();
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setdprice("");
    setCategory("");
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-lg font-bold">Add Your Product</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full"
        required
      />
      {image && <img src={URL.createObjectURL(image)} alt="Preview" className="h-40 object-cover rounded" />}

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Discount Price"
        value={dprice}
        onChange={(e) => setdprice(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      {loading ? (
        <select disabled className="w-full p-2 border rounded bg-gray-100">
          <option>Loading categories...</option>
        </select>
      ) : (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
        >
          Add Product
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 flex-1"
        >
          Home
        </button>
      </div>
    </form>
  );
}

export default AddProductForm;