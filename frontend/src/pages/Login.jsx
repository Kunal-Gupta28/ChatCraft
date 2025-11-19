import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';
import { useUser } from '../contexts/user.context';

const Login = () => {

  // react router dom
  const navigate = useNavigate();

  // state variable 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // context api 
  const { setUser } = useUser();

  // handle login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/login', { email, password });
      if (res.status === 200) {
        const { user, token } = res.data;

        localStorage.setItem('token', token);
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate('/home');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md transition-transform duration-300">

        {/* navigate to landing page */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          &larr; Back
        </button>

        {/* heading */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Sign In
        </h2>

        {/* display error when occurs */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleLogin}>

          {/* email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>

          {/* password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Enter your password"
            />
          </div>

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* navigate to register page */}
        <div className="mt-6 text-center text-gray-700 dark:text-gray-300">
          <span>Don't have an account?</span>{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
