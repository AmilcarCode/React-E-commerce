// API Service - Updated to use server-configured product sources
import { getProductSource } from '../utils/globalConfig';

// MockAPI Configuration
const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL || 'https://691ce333d58e64bf0d344a14.mockapi.io/products/products';

// FakeStore API Configuration
const FAKESTORE_URL = 'https://fakestoreapi.com/products';

// Get products based on server configuration
export const getProducts = async () => {
  try {
    const productSource = await getProductSource();
    console.log('🔄 Obteniendo productos desde fuente:', productSource);
    
    let products = [];
    
    switch (productSource) {
      case 'mockapi': {
        products = await getProductsFromMockAPI();
        break;
      }
      case 'fakestore': {
        products = await getProductsFromFakeStore();
        break;
      }
      case 'both': {
        const [mockapiProducts, fakestoreProducts] = await Promise.all([
          getProductsFromMockAPI().catch(() => []),
          getProductsFromFakeStore().catch(() => [])
        ]);
        products = [...mockapiProducts, ...fakestoreProducts];
        break;
      }
      default: {
        products = await getProductsFromMockAPI();
      }
    }
    
    console.log(`✅ Productos cargados desde ${productSource}:`, products.length);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to local mock data
    const { mockProducts } = await import('../utils/mockdata.js');
    return mockProducts;
  }
};

// Get products from MockAPI
const getProductsFromMockAPI = async () => {
  try {
    const response = await fetch(MOCKAPI_URL);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    return products.map(product => ({
      ...product,
      source: 'mockapi'
    }));
  } catch (error) {
    console.error('Error fetching from MockAPI:', error);
    throw error;
  }
};

// Get products from FakeStore API
const getProductsFromFakeStore = async () => {
  try {
    const response = await fetch(FAKESTORE_URL);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const products = await response.json();
    return products.map(product => ({
      ...product,
      source: 'fakestore',
      // Normalize data structure to match MockAPI
      id: product.id.toString(),
      rating: product.rating || { rate: 0, count: 0 }
    }));
  } catch (error) {
    console.error('Error fetching from FakeStore:', error);
    throw error;
  }
};

// GET - Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const productSource = await getProductSource();
    let product = null;
    
    if (productSource === 'mockapi' || productSource === 'both') {
      try {
        const response = await fetch(`${MOCKAPI_URL}/${id}`);
        if (response.ok) {
          product = await response.json();
          product.source = 'mockapi';
        }
      } catch (error) {
        console.error('Error fetching product from MockAPI:', error);
      }
    }
    
    if (!product && (productSource === 'fakestore' || productSource === 'both')) {
      try {
        const response = await fetch(`${FAKESTORE_URL}/${id}`);
        if (response.ok) {
          product = await response.json();
          product.source = 'fakestore';
          product.id = product.id.toString();
          product.rating = product.rating || { rate: 0, count: 0 };
        }
      } catch (error) {
        console.error('Error fetching product from FakeStore:', error);
      }
    }
    
    if (product) {
      return product;
    }
    
    throw new Error('Producto no encontrado');
  } catch (error) {
    console.error('Error fetching product:', error);
    // Fallback to local mock data
    const { mockProducts } = await import('../utils/mockdata.js');
    return mockProducts.find(product => product.id === parseInt(id)) || null;
  }
};

// POST - Crear un nuevo producto (solo en MockAPI)
export const createProduct = async (productData) => {
  try {
    const productSource = await getProductSource();
    
    // Solo permitir crear productos en MockAPI
    if (productSource === 'fakestore') {
      throw new Error('No se pueden crear productos en FakeStore API');
    }
    
    const response = await fetch(MOCKAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        source: 'mockapi'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// PUT - Actualizar un producto existente (solo en MockAPI)
export const updateProduct = async (id, productData) => {
  try {
    const productSource = await getProductSource();
    
    // Solo permitir actualizar productos en MockAPI
    if (productSource === 'fakestore') {
      throw new Error('No se pueden actualizar productos en FakeStore API');
    }
    
    const response = await fetch(`${MOCKAPI_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        source: 'mockapi'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// DELETE - Eliminar un producto (solo en MockAPI)
export const deleteProduct = async (id) => {
  try {
    const productSource = await getProductSource();
    
    // Solo permitir eliminar productos en MockAPI
    if (productSource === 'fakestore') {
      throw new Error('No se pueden eliminar productos en FakeStore API');
    }
    
    const response = await fetch(`${MOCKAPI_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Validaciones para el formulario de productos
export const validateProduct = (product) => {
  const errors = {};

  if (!product.title || product.title.trim() === '') {
    errors.title = 'El nombre del producto es obligatorio';
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'El precio debe ser mayor a 0';
  }

  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres';
  }

  if (!product.category || product.category.trim() === '') {
    errors.category = 'La categoría es obligatoria';
  }

  if (!product.image || product.image.trim() === '') {
    errors.image = 'La URL de la imagen es obligatoria';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Get current product source for display
export const getCurrentProductSource = async () => {
  return await getProductSource();
};