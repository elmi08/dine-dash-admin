import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'
import {validateEmail} from '../../utils/helper'
import { HiEye, HiEyeOff } from 'react-icons/hi';

const AdminSignUp = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [cuisine, setCuisine] = useState('');
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
      const response = await axiosInstance.post('/register', {
        restaurantName,
        email,
        password,
        address,
        cuisine,
      });

      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);

      setSuccess(response.data.message);
      navigate('/admin-login');
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Sign Up</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create an account to get started</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form noValidate onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="restaurantName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                id="restaurantName"
                placeholder="Restaurant Name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                aria-label="Restaurant Name"
              />
            </div>
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
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
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
            <div>
              <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Restaurant Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                aria-label="Address"
              />
            </div>
            <div>
              <label htmlFor="cuisine" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cuisine</label>
              <input
                type="text"
                name="cuisine"
                id="cuisine"
                placeholder="Type of Cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                aria-label="Cuisine"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="submit"
                className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Sign Up
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?
                <a
                  rel="noopener noreferrer"
                  href="/admin-login"
                  className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center p-6">
        <img
          src="src/assets/signup.png" // Adjust path if necessary
          alt="Food Delivery"
          className="object-cover w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AdminSignUp;
