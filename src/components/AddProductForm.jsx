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
        body: formData,
      });

      if (res.ok) {
        alert("Product added successfully!");
        onProductAdd();
        setTimeout(() => navigate("/"), 3000);
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-md dark:shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Add Your Product
      </h2>

      {/* Image Upload */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="h-40 object-cover rounded mt-4 border dark:border-gray-700"
          />
        )}
      </div>

      {/* Text Inputs */}
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        required
      />

      <textarea
        placeholder="Product Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        required
      />

      <input
        type="number"
        placeholder="Discount Price"
        value={dprice}
        onChange={(e) => setdprice(e.target.value)}
        className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        required
      />

      {/* Category Dropdown */}
      {loading ? (
        <select
          disabled
          className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
        >
          <option>Loading categories...</option>
        </select>
      ) : (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
        >
          Add Product
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
        >
          Home
        </button>
      </div>
    </form>
  );
}

export default AddProductForm;
