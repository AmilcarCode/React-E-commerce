import { useState, useEffect } from 'react';
import { mockProducts } from '../utils/mockdata';

const API_URL = 'https://fakestoreapi.com/products';

export const useApi = (endpoint = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = endpoint ? `${API_URL}/${endpoint}` : API_URL;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.warn('API Error, using mock data:', err);
        // Usar datos mock como fallback
        if (endpoint) {
          const product = mockProducts.find(p => p.id === parseInt(endpoint));
          setData(product || null);
        } else {
          setData(mockProducts);
        }
        setError(null); // No mostrar error si tenemos fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export const useProducts = () => {
  return useApi();
};

export const useProduct = (id) => {
  return useApi(id);
};

export const useCategories = () => {
  const { data: products, loading, error } = useApi();
  
  const categories = products ? 
    [...new Set(products.map(product => product.category))] : 
    [];
    
  return { data: categories, loading, error };
};