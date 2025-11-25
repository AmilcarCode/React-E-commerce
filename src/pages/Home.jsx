import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProductList from '../components/Product/ProductList';
import { useProducts } from '../hooks/useApi';
import { useProductSource } from '../context/ProductSourceContext';

const Home = () => {
  const [searchParams] = useSearchParams();
  const { productSource } = useProductSource();
  const { data: products, loading, error } = useProducts(productSource);
  
  const searchQuery = searchParams.get('q');
  const categoryFilter = searchParams.get('category');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = [...products];
    
    // Filtrar por categoría
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Don't randomize here - let ProductList handle sorting
    return filtered;
  }, [products, searchQuery, categoryFilter]);

  return (
    <Layout>
      <div className="page-container">
        {searchQuery && (
          <div className="page-header">
            <p className="page-header-text">
              Resultados para: <span className="page-header-highlight">"{searchQuery}"</span>
              {filteredProducts.length > 0 && (
                <span className="ml-2">({filteredProducts.length} productos)</span>
              )}
            </p>
          </div>
        )}
        
        {categoryFilter && (
          <div className="page-header">
            <p className="page-header-text capitalize">
              Categoría: <span className="page-header-highlight">{categoryFilter}</span>
              {filteredProducts.length > 0 && (
                <span className="ml-2">({filteredProducts.length} productos)</span>
              )}
            </p>
          </div>
        )}
        
        <ProductList 
          products={filteredProducts} 
          loading={loading} 
          error={error} 
        />
      </div>
    </Layout>
  );
};

export default Home;