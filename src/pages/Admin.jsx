import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AlertDialog from '../components/ui/AlertDialog';
import { getProducts, createProduct, updateProduct, deleteProduct, validateProduct } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useProductSource } from '../context/ProductSourceContext';
import { getDiscountSettings, updateDiscountSettings } from '../utils/globalConfig';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { productSource, updateProductSource, loading: configLoading } = useProductSource();
  
  // Discount settings state
  const [discountSettings, setDiscountSettings] = useState({
    enabled: true,
    possibleDiscounts: [0, 5, 10, 25, 40],
    noDiscountChance: 30,
  });
  const [discountFormData, setDiscountFormData] = useState({
    discount1: '0',
    discount2: '5',
    discount3: '10',
    discount4: '25',
    discount5: '40',
    noDiscountChance: '30',
  });
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    productId: null,
    productName: '',
  });

  useEffect(() => {
    loadProducts();
    loadDiscountSettings();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscountSettings = async () => {
    try {
      const settings = await getDiscountSettings();
      setDiscountSettings(settings);
      
      // Convertir array a campos individuales
      const discounts = settings.possibleDiscounts || [0, 5, 10, 25, 40];
      setDiscountFormData({
        discount1: discounts[0]?.toString() || '0',
        discount2: discounts[1]?.toString() || '5',
        discount3: discounts[2]?.toString() || '10',
        discount4: discounts[3]?.toString() || '25',
        discount5: discounts[4]?.toString() || '40',
        noDiscountChance: settings.noDiscountChance?.toString() || '30',
      });
    } catch (err) {
      console.error('Error loading discount settings:', err);
    }
  };

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveDiscountSettings = async () => {
    try {
      // Validar y convertir valores
      const discounts = [
        parseInt(discountFormData.discount1) || 0,
        parseInt(discountFormData.discount2) || 0,
        parseInt(discountFormData.discount3) || 0,
        parseInt(discountFormData.discount4) || 0,
        parseInt(discountFormData.discount5) || 0,
      ].filter(d => d >= 0 && d <= 100);

      const noDiscountChance = Math.min(100, Math.max(0, parseInt(discountFormData.noDiscountChance) || 30));

      const newSettings = {
        enabled: true,
        possibleDiscounts: discounts,
        noDiscountChance: noDiscountChance,
      };

      await updateDiscountSettings(newSettings);
      setDiscountSettings(newSettings);
      setSuccessMessage('✅ Configuración de descuentos actualizada exitosamente');
    } catch (err) {
      setError('Error al actualizar la configuración de descuentos');
      console.error(err);
    }
  };

  const handleSourceChange = async (e) => {
    const newSource = e.target.value;
    try {
      await updateProductSource(newSource);
      setSuccessMessage(`✅ Configuración actualizada: ${
        newSource === 'both' ? 'ambas fuentes (MockAPI + FakeStore)' : 
        newSource === 'mockapi' ? 'solo MockAPI' : 
        'solo FakeStore'
      }. Los cambios se aplican a todas las pestañas del navegador.`);
      
      // Recargar productos con la nueva fuente
      await loadProducts();
    } catch (err) {
      setError('Error al actualizar la configuración.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate random ratings: rate between 0-5, count between 2-1000
    const randomRate = (Math.random() * 5).toFixed(1);
    const randomCount = Math.floor(Math.random() * 999) + 2;
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: { rate: parseFloat(randomRate), count: randomCount },
    };

    const validation = validateProduct(productData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      setFormLoading(true);
      setError(null);
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setSuccessMessage('Producto actualizado exitosamente');
      } else {
        await createProduct(productData);
        setSuccessMessage('Producto creado exitosamente');
      }
      
      await loadProducts();
      handleCloseForm();
    } catch (err) {
      setError(editingProduct ? 'Error al actualizar el producto' : 'Error al crear el producto');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    // Prevent editing FakeStore products (they are read-only from external API)
    if (product.source === 'fakestore') {
      setError('No se pueden editar productos de FakeStore. Solo se pueden editar productos de MockAPI.');
      return;
    }
    
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      image: product.image,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleDelete = (product) => {
    // Prevent deleting FakeStore products (they are read-only from external API)
    if (product.source === 'fakestore') {
      setError('No se pueden eliminar productos de FakeStore. Solo se pueden eliminar productos de MockAPI.');
      return;
    }
    
    setDeleteDialog({
      isOpen: true,
      productId: product.id,
      productName: product.title,
    });
  };

  const confirmDelete = async () => {
    try {
      setError(null);
      await deleteProduct(deleteDialog.productId);
      setSuccessMessage('Producto eliminado exitosamente');
      await loadProducts();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    } finally {
      setDeleteDialog({ isOpen: false, productId: null, productName: '' });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: '',
    });
    setFormErrors({});
  };

  const handleNewProduct = () => {
    // Prevent creating new products when only FakeStore is selected
    if (productSource === 'fakestore') {
      setError('No se pueden crear nuevos productos cuando solo FakeStore está seleccionado. Cambia a MockAPI o ambas fuentes para crear productos.');
      return;
    }
    
    setEditingProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: '',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Check if edit/delete actions are disabled for a product
  // FakeStore products are always read-only regardless of selected source
  const isActionDisabled = (product) => {
    return product.source === 'fakestore';
  };

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text mt-4">Cargando productos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Gestiona el catálogo de productos y configuración de LibreMercado</p>
          </div>
          <button
            onClick={handleNewProduct}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 w-full sm:w-auto"
            title="Nuevo Producto"
          >
            <span className="text-xl sm:text-base">➕</span>
            <span className="hidden sm:inline">Nuevo Producto</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>

        {/* Discount Settings Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-md p-4 sm:p-6 mb-6 border-2 border-green-200 dark:border-green-700">
          <div className="flex items-start space-x-3 mb-4">
            <span className="text-2xl">💰</span>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Configuración de Descuentos Automáticos</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                Define los valores de descuento que se aplicarán aleatoriamente a los productos en la página principal.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descuento 1 (%)
              </label>
              <input
                type="number"
                name="discount1"
                value={discountFormData.discount1}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descuento 2 (%)
              </label>
              <input
                type="number"
                name="discount2"
                value={discountFormData.discount2}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descuento 3 (%)
              </label>
              <input
                type="number"
                name="discount3"
                value={discountFormData.discount3}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descuento 4 (%)
              </label>
              <input
                type="number"
                name="discount4"
                value={discountFormData.discount4}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Descuento 5 (%)
              </label>
              <input
                type="number"
                name="discount5"
                value={discountFormData.discount5}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                % Sin Descuento
              </label>
              <input
                type="number"
                name="noDiscountChance"
                value={discountFormData.noDiscountChance}
                onChange={handleDiscountInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveDiscountSettings}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Guardar Configuración
            </button>
          </div>

          <div className="mt-4 p-3 sm:p-4 bg-white dark:bg-gray-800 border-l-4 border-green-500 rounded-md">
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
              <strong>📊 Configuración actual:</strong> Los productos mostrarán descuentos aleatorios de: {discountSettings.possibleDiscounts.filter(d => d > 0).join('%, ')}%
            </p>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 mt-2">
              <strong>🎲 Probabilidad sin descuento:</strong> {discountSettings.noDiscountChance}% de los productos no tendrán descuento
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              ℹ️ Los descuentos se asignan aleatoriamente cada vez que se carga la página. Una vez agregados al carrito, los descuentos permanecen fijos.
            </p>
          </div>
        </div>

        {/* Product Source Filter - ADMIN ONLY - LOCAL STORAGE CONFIG */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow-md p-4 sm:p-6 mb-6 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-start space-x-3 mb-4">
            <span className="text-2xl">👑</span>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Control de Fuente de Productos</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                <strong>💾 Configuración local:</strong> Esta configuración se almacena en el navegador y se sincroniza entre pestañas. 
                Los cambios afectan a todas las pestañas abiertas del mismo sitio.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="productSource"
                value="mockapi"
                checked={productSource === 'mockapi'}
                onChange={handleSourceChange}
                disabled={configLoading}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">Solo MockAPI (por defecto)</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="productSource"
                value="fakestore"
                checked={productSource === 'fakestore'}
                onChange={handleSourceChange}
                disabled={configLoading}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">Solo FakeStore</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="productSource"
                value="both"
                checked={productSource === 'both'}
                onChange={handleSourceChange}
                disabled={configLoading}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-200 font-medium">Ambas fuentes (MockAPI + FakeStore)</span>
            </label>
          </div>
          
          <div className="mt-4 p-3 sm:p-4 bg-white dark:bg-gray-800 border-l-4 border-purple-500 rounded-md">
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">
              <strong>📊 Estado actual:</strong> Mostrando productos de {
                productSource === 'both' ? 'ambas fuentes (MockAPI + FakeStore)' : 
                productSource === 'mockapi' ? 'MockAPI únicamente' : 
                'FakeStore únicamente'
              }
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                💾 Almacenamiento local
              </span>
              {configLoading && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  🔄 Sincronizando...
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              ℹ️ Solo los administradores pueden cambiar esta configuración. Los cambios se sincronizan entre pestañas.
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-medium">
              💡 Los datos se almacenan localmente en tu navegador y persisten entre sesiones.
            </p>
            {productSource === 'fakestore' && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ <strong>Modo de solo lectura:</strong> Cuando solo FakeStore está seleccionado, los productos son de solo lectura. 
                  Solo se pueden editar y eliminar productos de MockAPI.
                </p>
              </div>
            )}
            {productSource === 'both' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 font-medium">
                  ℹ️ <strong>Modo mixto:</strong> Los productos de FakeStore son de solo lectura. 
                  Solo se pueden editar y eliminar productos de MockAPI.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-md mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-md mb-4 text-sm sm:text-base">
            {successMessage}
          </div>
        )}

        {/* Product Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseForm}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-input bg-white dark:bg-white text-gray-900 dark:text-gray-900 ${formErrors.title ? 'border-red-500' : ''}`}
                      placeholder="Ej: Smartphone Samsung Galaxy A54"
                    />
                    {formErrors.title && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      Precio (ARS) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`form-input bg-white dark:bg-white text-gray-900 dark:text-gray-900 ${formErrors.price ? 'border-red-500' : ''}`}
                      placeholder="Ej: 299999"
                      min="0"
                      step="0.01"
                    />
                    {formErrors.price && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`form-input bg-white dark:bg-white text-gray-900 dark:text-gray-900 ${formErrors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="electronics">Electrónica</option>
                      <option value="jewelery">Joyería</option>
                      <option value="men's clothing">Ropa de Hombre</option>
                      <option value="women's clothing">Ropa de Mujer</option>
                    </select>
                    {formErrors.category && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      Descripción * (mínimo 10 caracteres)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`form-input bg-white dark:bg-white text-gray-900 dark:text-gray-900 ${formErrors.description ? 'border-red-500' : ''}`}
                      placeholder="Describe el producto en detalle..."
                    />
                    {formErrors.description && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                      URL de la Imagen *
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={`form-input bg-white dark:bg-white text-gray-900 dark:text-gray-900 ${formErrors.image ? 'border-red-500' : ''}`}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formErrors.image && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{formErrors.image}</p>
                    )}
                    {formData.image && (
                      <div className="mt-2">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-32 h-32 object-contain border rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
                      disabled={formLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
                      disabled={formLoading}
                    >
                      {formLoading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      No hay productos disponibles. Crea tu primer producto.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mr-2 sm:mr-4"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                              {product.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 hidden sm:block">
                              {product.description}
                            </div>
                            {product.source && (
                              <div className={`text-xs mt-1 ${
                                product.source === 'mockapi' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                              }`}>
                                {product.source === 'mockapi' ? 'MockAPI' : 'FakeStore'}
                                {isActionDisabled(product) && (
                                  <span className="ml-1 text-yellow-600 dark:text-yellow-400">(R/O)</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={isActionDisabled(product)}
                          className={`mr-2 sm:mr-4 ${
                            isActionDisabled(product) 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
                          }`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={isActionDisabled(product)}
                          className={`${
                            isActionDisabled(product) 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          }`}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm sm:text-base text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, productId: null, productName: '' })}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar "${deleteDialog.productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </Layout>
  );
};

export default Admin;