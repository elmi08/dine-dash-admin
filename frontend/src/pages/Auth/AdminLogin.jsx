import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'
import {validateEmail} from '../../utils/helper'
import { HiEye, HiEyeOff } from 'react-icons/hi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });

      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);

      setSuccess(response.data.message);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-8 text-center">
            {/* Dine Dash Text Logo */}
            <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              Dine Dash
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Sign In</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to access your account</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                aria-label="Email address"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="*****"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="submit"
                className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Sign In
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account yet?
                <a
                  rel="noopener noreferrer"
                  href="/admin-signup"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center p-6">
        <img
          src="src/assets/login-page.png"
          alt="Food Delivery"
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AdminLogin;
