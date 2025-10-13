import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useProduct } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { calculateDiscount, formatPrice } from '../utils/helpers';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);
  const { addToCart } = useCart();

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div className="loading-container">
          <div className="loading-text">Cargando producto...</div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout showSidebar={false}>
        <div className="error-container">
          <div className="error-text">
            {error || 'Producto no encontrado'}
          </div>
          <Link to="/" className="error-back-link">
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const { originalPrice, finalPrice } = calculateDiscount(product.price);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Layout showSidebar={false}>
      <div className="product-detail-container">
        <nav className="product-detail-nav">
          <Link to="/" className="product-detail-back-link">
            ← Volver a productos
          </Link>
        </nav>

        <div className="product-detail-card">
          <div className="product-detail-grid">
            {/* Imagen del producto */}
            <div className="product-detail-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="product-detail-image"
              />
            </div>

            {/* Información del producto */}
            <div className="product-detail-info">
              <div>
                <p className="product-detail-category">
                  {product.category}
                </p>
                <h1 className="product-detail-title">
                  {product.title}
                </h1>
              </div>

              <div className="product-detail-pricing">
                <p className="product-detail-original-price">
                  {formatPrice(originalPrice)}
                </p>
                <p className="product-detail-final-price">
                  {formatPrice(finalPrice)}
                </p>
                <p className="product-detail-discount">
                  ¡10% de descuento!
                </p>
              </div>

              <div className="product-detail-description-section">
                <h3 className="product-detail-description-title">Descripción</h3>
                <p className="product-detail-description">
                  {product.description}
                </p>
              </div>

              <div className="product-detail-rating-section">
                <div className="product-detail-rating">
                  <span className="product-detail-stars">
                    {'★'.repeat(Math.floor(product.rating?.rate || 0))}
                    {'☆'.repeat(5 - Math.floor(product.rating?.rate || 0))}
                  </span>
                  <span className="product-detail-rating-count">
                    ({product.rating?.count || 0} reseñas)
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="product-detail-add-btn"
                >
                  Agregar al carrito 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;