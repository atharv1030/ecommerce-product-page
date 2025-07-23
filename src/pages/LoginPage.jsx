import { useState, useRef, useEffect } from 'react';
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
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
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
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loginMethod', 'email');
      localStorage.setItem('nexusUser', JSON.stringify(response.data.user));

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

      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: user.displayName,
        email: user.email,
        isGooglelogin: true,
        password: user.accessToken,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loginMethod', 'google');
      localStorage.setItem('nexusUser', JSON.stringify(response.data.user));

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md space-y-8 mt-16 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
          Sign in to your account
        </h2>

        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold transition-colors ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">OR</div>

        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className={`w-full py-2 rounded font-semibold transition-colors ${
            isGoogleLoading
              ? 'bg-red-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          } text-white`}
        >
          {isGoogleLoading ? 'Loading...' : 'Sign in with Google'}
        </button>

        <p className="text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
