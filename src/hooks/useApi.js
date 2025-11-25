import { useState, useEffect } from 'react';
import { mockProducts } from '../utils/mockdata';

const MOCKAPI_URL = import.meta.env.VITE_MOCKAPI_URL;
const FAKESTORE_URL = 'https://fakestoreapi.com/products';

export const useApi = (endpoint = '', sourceFilter = 'both') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const isSingleProduct = !!endpoint;
        
        if (isSingleProduct) {
          // For single product, try to find it in our combined data first
          // Check if it's a FakeStore product (ID > 1000) or MockAPI product
          const productId = parseInt(endpoint);
          
          if (productId > 1000) {
            // It's a FakeStore product - fetch from FakeStore with original ID
            const originalId = productId - 1000;
            try {
              const response = await fetch(`${FAKESTORE_URL}/${originalId}`);
              if (response.ok) {
                const product = await response.json();
                // Transform to our format - store prices in pesos (no conversion needed)
                const transformedProduct = {
                  id: product.id + 1000,
                  title: product.title,
                  price: product.price, // Keep as pesos, no conversion
                  description: product.description,
                  category: product.category,
                  image: product.image,
                  rating: {
                    rate: product.rating?.rate || 0,
                    count: product.rating?.count || 0
                  },
                  source: 'fakestore'
                };
                setData(transformedProduct);
                return;
              }
            } catch (err) {
              console.warn('Failed to fetch from FakeStore:', err);
            }
          } else {
            // It's a MockAPI product - fetch from MockAPI
            try {
              const response = await fetch(`${MOCKAPI_URL}/${endpoint}`);
              if (response.ok) {
                const product = await response.json();
                setData({ ...product, source: 'mockapi' });
                return;
              }
            } catch (err) {
              console.warn('Failed to fetch from MockAPI:', err);
            }
          }
          
          // If both APIs failed, try mock data
          const product = mockProducts.find(p => p.id === productId);
          if (product) {
            setData({ ...product, source: 'mockapi' });
            return;
          }
          
          setData(null);
          setError('Producto no encontrado');
          
        } else {
          // For product list, fetch from both APIs
          const [mockApiResponse, fakeStoreResponse] = await Promise.allSettled([
            fetch(MOCKAPI_URL),
            fetch(FAKESTORE_URL)
          ]);

          let combinedData = [];
          const errors = [];

          // Process MockAPI response
          if (mockApiResponse.status === 'fulfilled' && mockApiResponse.value.ok) {
            const mockData = await mockApiResponse.value.json();
            if (Array.isArray(mockData)) {
              const dataWithSource = mockData.map(item => ({ ...item, source: 'mockapi' }));
              combinedData = [...combinedData, ...dataWithSource];
            }
          } else {
            errors.push('MockAPI: ' + (mockApiResponse.reason?.message || 'Failed to fetch'));
          }

          // Process FakeStore API response
          if (fakeStoreResponse.status === 'fulfilled' && fakeStoreResponse.value.ok) {
            const fakeStoreData = await fakeStoreResponse.value.json();
            if (Array.isArray(fakeStoreData)) {
              // Transform FakeStore data to match our format - store prices in pesos
              const transformedData = fakeStoreData.map(product => ({
                id: product.id + 1000, // Offset IDs to avoid conflicts
                title: product.title,
                price: product.price, // Keep as pesos, no conversion to cents
                description: product.description,
                category: product.category,
                image: product.image,
                rating: {
                  rate: product.rating?.rate || 0,
                  count: product.rating?.count || 0
                },
                source: 'fakestore'
              }));
              combinedData = [...combinedData, ...transformedData];
            }
          } else {
            errors.push('FakeStore: ' + (fakeStoreResponse.reason?.message || 'Failed to fetch'));
          }

          // Apply source filter
          let filteredData = combinedData;
          if (sourceFilter === 'mockapi') {
            filteredData = combinedData.filter(item => item.source === 'mockapi');
          } else if (sourceFilter === 'fakestore') {
            filteredData = combinedData.filter(item => item.source === 'fakestore');
          }

          // If both APIs failed, use mock data as fallback
          if (combinedData.length === 0) {
            console.warn('Both APIs failed, using local mock data');
            const mockDataWithSource = mockProducts.map(item => ({ ...item, source: 'mockapi' }));
            setData(mockDataWithSource);
          } else {
            setData(filteredData);
          }

          // Set error if any API failed
          if (errors.length > 0) {
            setError(errors.join('; '));
          }
        }

      } catch (err) {
        console.warn('API Error, using local mock data:', err);
        // Use mock data as final fallback
        if (endpoint) {
          const product = mockProducts.find(p => p.id === parseInt(endpoint));
          setData(product ? { ...product, source: 'mockapi' } : null);
        } else {
          const mockDataWithSource = mockProducts.map(item => ({ ...item, source: 'mockapi' }));
          setData(mockDataWithSource);
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, sourceFilter]);

  return { data, loading, error };
};

export const useProducts = (sourceFilter = 'both') => {
  return useApi('', sourceFilter);
};

export const useProduct = (id) => {
  return useApi(id, 'both');
};

export const useCategories = (sourceFilter = 'both') => {
  const { data: products, loading, error } = useApi('', sourceFilter);
  
  const categories = products ? 
    [...new Set(products.map(product => product.category))] : 
    [];
    
  return { data: categories, loading, error };
};