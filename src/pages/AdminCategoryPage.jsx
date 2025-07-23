import { useEffect, useState } from 'react';

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', parent: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingCategoryId ? 'PUT' : 'POST';
    const url = editingCategoryId
      ? `http://localhost:5000/api/categories/${editingCategoryId}`
      : 'http://localhost:5000/api/categories';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save category');
      setFormData({ name: '', description: '', parent: '' });
      setEditingCategoryId(null);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategoryId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description,
      parent: cat.parent?._id || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete category');
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return ( 
    <div className="p-8 ">
      <h2 className="text-2xl font-bold mb-4">Category Management</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Category name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-2">
          <select
            value={formData.parent}
            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">No Parent</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingCategoryId ? 'Update Category' : 'Add Category'}
        </button>
      </form>

      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.description}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cat)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >Edit</button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategoryPage;