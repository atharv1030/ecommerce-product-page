import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Please fill all fields');
      return;
    }

    // Send login request to backend
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Store JWT token in local storage
        navigate('/'); // Redirect to homepage
      } else {
        alert(data.error || data.message); // Display error message
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const tokenId = credentialResponse.credential;

    try {
      const res = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Store JWT token
        navigate('/'); // Redirect to homepage
      } else {
        console.error('Google login failed');
      }
    } catch (error) {
      console.error('Error with Google login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email" // Changed to type="email" for better validation
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-3 mt-4">
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;