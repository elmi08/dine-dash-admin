import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';


const Sidebar = () => {
  const [restaurant, setRestaurant] = useState({
    restaurantName: '',
    email: '',
    address: '',
  });

  // Fetch restaurant information
  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const response = await axiosInstance.get('/get-restaurant');
        if (!response.data.error) {
          setRestaurant(response.data.restaurant);
        } else {
          console.error('Failed to fetch restaurant info:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching restaurant info:', error.message);
      }
    };

    fetchRestaurantInfo();
  }, []);

  // Extract the first letter of the restaurant name
  const initial = restaurant.restaurantName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen">
      <div className="h-full p-3 space-y-2 w-60 dark:bg-gray-50 dark:text-gray-800">
        <div className="flex items-center p-2 space-x-4">
          {/* Modern Circle with Initial */}
          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-lg font-semibold text-gray-800 dark:bg-gray-500 dark:text-gray-50">
            {initial}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{restaurant.restaurantName}</h2>
            <span className="flex items-center space-x-1">
              <a
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline dark:text-gray-600"
              >
                {restaurant.email}
              </a>
            </span>
          </div>
        </div>
        <div className="divide-y dark:divide-gray-300">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li className="dark:bg-gray-100 dark:text-gray-900">
              <a
                rel="noopener noreferrer"
                href="admin-dashboard"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="/admin-menu"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>Menu</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="/admin-order-history"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                </svg>
                <span>Order History</span>
              </a>
            </li>
          </ul>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <li>
              <a
                rel="noopener noreferrer"
                href="/admin-settings"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md"
              >
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
