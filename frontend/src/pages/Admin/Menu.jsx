import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar/Sidebar';
import AddProductModal from '../../components/Modals/AddProductModal';
import axiosInstance from '../../utils/axiosInstance';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/get-products');
      if (response.data && !response.data.error) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Open modal to add a new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // Open modal to edit an existing product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  // Add new product to the list
  const addNewProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axiosInstance.delete(`/delete-product/${productId}`);
      if (response.data && !response.data.error) {
        fetchProducts(); // Optionally, update the product list after deletion
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    (acc[product.category] = acc[product.category] || []).push(product);
    return acc;
  }, {});

  return (
    <div className="flex">
      <Sidebar fetchProducts={fetchProducts} /> {/* Sidebar added here */}

      <div className="flex-grow p-4">
        {products.length === 0 ? (
          // Hero Section when no products are available
          <section className="flex justify-center items-center h-screen w-full bg-gray-100 text-gray-800">
            <div className="container flex flex-col items-center px-4 text-center mx-auto md:px-10 lg:px-32 xl:max-w-3xl">
              <h1 className="text-4xl font-bold leading-none sm:text-5xl">
                No Products Available
                <span className="block text-violet-600">Add Your First Product!</span>
              </h1>
              <p className="px-8 mt-8 mb-12 text-lg">
                Start by adding new products to your menu. Click the button below to get started and showcase your offerings to the world!
              </p>
              <div className="flex flex-wrap justify-center">
                <button
                  onClick={handleAddProduct} // This will open the Add Product Modal
                  className="px-8 py-3 m-2 text-lg font-semibold rounded bg-violet-600 text-white hover:bg-violet-700"
                >
                  Add Your First Product
                </button>
                <button className="px-8 py-3 m-2 text-lg border rounded text-gray-900 border-gray-300 hover:bg-gray-300">
                  Learn More
                </button>
              </div>
            </div>
          </section>

        ) : (
          // Product List with Menu Title and Add Product Button
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Menu</h1>
              <button
                onClick={handleAddProduct}
                className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
              >
                <AiOutlinePlus className="mr-2" />
                Add Product
              </button>
            </div>

            {Object.keys(groupedProducts).map((category) => (
              <section key={category} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                <ul className="space-y-2">
                  {groupedProducts[category].map((product) => (
                    <li
                      key={product.id}
                      className="bg-white rounded-md shadow-sm overflow-hidden p-2 flex items-center space-x-4 border border-gray-300"
                    >
                      <img
                        className="object-cover w-16 h-16 rounded-md"
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 border border-indigo-600 rounded-md px-2 py-1 text-sm hover:bg-indigo-600 hover:text-white"
                        >
                          <FaEdit className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 border border-red-600 rounded-md px-2 py-1 text-sm hover:bg-red-600 hover:text-white"
                        >
                          <FaTrash className="inline mr-1" />
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <AddProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          addNewProduct={addNewProduct} // Pass the function to add new product
        />
      )}
    </div>
  );
};

export default Menu;
