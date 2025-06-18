import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    profilePic: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Uncomment this when your backend is ready
  /*
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUser(data.user);
      if (data.user.profilePic) {
        setPreview(`http://localhost:5000${data.user.profilePic}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('contact', user.contact);
    formData.append('address', user.address);
    if (file) formData.append('profilePic', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setIsEditing(false);
        // fetchUser(); // Uncomment when backend is ready
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };
  

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img 
                    src={preview || '/default-avatar.png'} 
                    className="w-24 h-24 rounded-full object-cover border-8 border-white shadow"
                    // alt="Picture"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-blue-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Contact</h3>
                  <p>{user.contact || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>{user.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4"> {/* Changed to flex with gap */}
                <button
                  onClick={() => navigate('/')} // Navigates to home
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <label className="cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                  <img 
                    src={preview || '/default-avatar.png'} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                    alt="Profile"
                  />
                  <span className="block text-center text-sm mt-2 text-blue-600">
                    Change Photo
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  value={user.contact}
                  onChange={(e) => setUser({...user, contact: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Address</label>
                <textarea
                  value={user.address}
                  onChange={(e) => setUser({...user, address: e.target.value})}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;