import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ searchTerm, selectedCategory, products = [] }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let filtered = products;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  if (filteredProducts.length === 0) {
    return (
      <div className="products-no-results">
        <h3 className="products-no-results-title">
          No se encontraron productos
        </h3>
        <p className="products-no-results-description">
          {searchTerm || selectedCategory !== 'all' 
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'No hay productos disponibles en este momento'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;