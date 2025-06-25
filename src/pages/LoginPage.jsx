import { useState, useRef, useEffect } from 'react'; // ✅ added useRef, useEffect
import { Link, useNavigate } from 'react-router-dom';
import { auth, provider, signInWithPopup } from '../firebase';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useUser } from '../context/userContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const emailRef = useRef(null); // ✅ create ref

  useEffect(() => {
    emailRef.current?.focus(); // ✅ focus input on mount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loginMethod', 'email');

      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post('http://localhost:5000/api/signup', {
        name: user.displayName,
        email: user.email,
        isGooglelogin: true,
        password: user.accessToken
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loginMethod', 'google');

      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md space-y-8 mt-16">
        <h2 className="text-3xl font-bold text-center">Sign in to your account</h2>

        {error && <div className="text-red-600">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            ref={emailRef} // ✅ useRef here
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          {isGoogleLoading ? 'Loading...' : 'Sign in with Google'}
        </button>

        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
