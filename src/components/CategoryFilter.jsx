// components/CategoryFilter.jsx
import { useEffect, useState } from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://nexusmart123.netlify.app/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 rounded-full ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        All 
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => setSelectedCategory(category._id)}
          className={`px-4 py-2 rounded-full ${selectedCategory === category._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;