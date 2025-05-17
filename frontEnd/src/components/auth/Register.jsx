import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';

const Register = ({ onSubmit, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-sky-800">
        Create Account
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
            <MdEmail className="text-sky-700" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <RiLockPasswordLine className="text-sky-700" />
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-700 text-white py-2 px-4 rounded-lg hover:bg-sky-800 transition-colors"
        >
          Register
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-sky-700 hover:underline"
            onClick={onSwitchToLogin}
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;