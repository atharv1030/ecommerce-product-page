import { useEffect, useState } from 'react';

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="flex gap-4 flex-wrap mb-6">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 rounded ${selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => setSelectedCategory(cat._id)}
          className={`px-4 py-2 rounded ${selectedCategory === cat._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
