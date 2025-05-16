import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';

const Login = ({ onSubmit, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-800">
        Welcome Back!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <FaUserCircle className="text-sky-700" />
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <RiLockPasswordLine className="text-sky-700" />
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 px-4 rounded-lg hover:bg-sky-800 transition-colors"
        >
          Login
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-sky-700 hover:underline"
            onClick={onSwitchToRegister}
          >
            Don't have an account? Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;