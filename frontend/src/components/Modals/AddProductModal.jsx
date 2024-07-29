// src/components/AddProductModal.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AddProductModal = ({ product, onClose, addNewProduct }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [category, setCategory] = useState(product ? product.category : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(product ? product.image : null);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(product ? product.name : '');
    setCategory(product ? product.category : '');
    setDescription(product ? product.description : '');
    setPrice(product ? product.price : '');
    setPreviewUrl(product ? product.image : null);
    setImage(null);
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('image', image);

      const response = await axiosInstance.post('/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && !response.data.error) {
        addNewProduct(response.data.product);
        onClose();
      } else {
        setError('Error adding product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error adding product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('image', image);

      const response = await axiosInstance.put(`/update-product/${product.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && !response.data.error) {
        addNewProduct(response.data.product);
        onClose();
      } else {
        setError('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error updating product');
    }
  };

  const handleSubmit = () => {
    if (product) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add Product'}</h2>

        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
            <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="w-full px-4 mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full"
              rows="4"
            />
          </div>

          <div className="w-full md:w-1/2 px-4 mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="w-full md:w-1/2 px-4 mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Image</label>
            <div className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 border-dashed rounded-lg">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
              />
              {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg" />}
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
          >
            {product ? 'Update' : 'Add'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
