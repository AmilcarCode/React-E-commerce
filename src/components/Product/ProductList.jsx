import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Pagination from '../Pagination';

const ProductList = ({ products = [], loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOrder, setSortOrder] = useState('relevant');
  const [sortedProducts, setSortedProducts] = useState([]);
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  // Sort products based on selected order
  useEffect(() => {
    if (!products || products.length === 0) {
      setSortedProducts([]);
      return;
    }

    const sorted = [...products];
    
    switch (sortOrder) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'relevant':
      default:
        // Randomize order for "relevant"
        sorted.sort(() => Math.random() - 0.5);
        break;
    }
    
    setSortedProducts(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [products, sortOrder]);

  // Paginate sorted products
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProducts(sortedProducts.slice(startIndex, endIndex));
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text mt-4">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="error-back-link"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-no-results">
        <h3 className="products-no-results-title">
          No se encontraron productos
        </h3>
        <p className="products-no-results-description">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sort dropdown */}
      <div className="sort-container">
        <label htmlFor="sort-select" className="sort-label">
          Ordenar por:
        </label>
        <select 
          id="sort-select"
          value={sortOrder} 
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="relevant">Más relevantes</option>
          <option value="price-asc">Menor precio</option>
          <option value="price-desc">Mayor precio</option>
        </select>
      </div>

      <div className="products-grid">
        {paginatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={sortedProducts.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default ProductList;