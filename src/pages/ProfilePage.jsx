import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // ✅ Importing context

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, login } = useUser(); // ✅ Accessing user info & login function
  const [localUser, setLocalUser] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    profilePic: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  // Load user data from context
  useEffect(() => {
    if (user) {
      setLocalUser(user);
      if (user.profilePic) {
        setPreview(user.profilePic);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', localUser.name);
    formData.append('email', localUser.email);
    formData.append('contact', localUser.contact);
    formData.append('address', localUser.address);
    if (file) formData.append('profilePic', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (response.ok) {
        setIsEditing(false);
        login(data.updatedUser); // ✅ Update global user in context
        setPreview(data.updatedUser.profilePic); // update preview
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:shadow-lg dark:bg-gray-800">
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
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{localUser.name}</h2>
                  <p className="text-blue-600">{localUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Contact</h3>
                  <p>{localUser.contact || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>{localUser.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
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
                    value={localUser.name}
                    onChange={(e) => setLocalUser({...localUser, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={localUser.email}
                    onChange={(e) => setLocalUser({...localUser, email: e.target.value})}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  value={localUser.contact}
                  onChange={(e) => setLocalUser({...localUser, contact: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Address</label>
                <textarea
                  value={localUser.address}
                  onChange={(e) => setLocalUser({...localUser, address: e.target.value})}
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
                  type="submit" // ✅ now correctly triggers submit
                  onClick={() => setIsEditing(false)}
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
