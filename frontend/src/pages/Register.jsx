import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/user.context';
import axiosInstance from '../config/axios';

const Register = () => {

  // react router dom 
  const navigate = useNavigate();

  // context api
  const { setUser } = useUser();

  // state varible 
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // handle the change in input of form 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // handle submi button and register function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/register', form);
      if (res.status === 201) {
        localStorage.setItem('token', res.data.token);
        
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md transition-transform duration-300">

        {/* navigate to landing page  */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          &larr; Back
        </button>

        {/* heading */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Create Account
        </h2>

        {/* display error when occurs */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* form  */}
        <form onSubmit={handleSubmit}>
          {['username', 'email', 'password'].map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-gray-700 dark:text-gray-300 mb-1 capitalize"
              >
                {field}
              </label>
              <input
                id={field}
                type={field === 'password' ? 'password' : field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* naivgate to login page */}
        <div className="mt-6 text-center text-gray-700 dark:text-gray-300">
          <span>Already have an account?</span>{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
