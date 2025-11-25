import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useProduct } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import { calculateRandomDiscount, formatPrice } from '../utils/helpers';
import { getDiscountSettings } from '../utils/globalConfig';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [discountInfo, setDiscountInfo] = React.useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    const loadDiscount = async () => {
      if (product) {
        const settings = await getDiscountSettings();
        const discount = calculateRandomDiscount(product.price, settings);
        setDiscountInfo(discount);
      }
    };
    loadDiscount();
  }, [product]);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Cargando producto...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <p className="error-text">Error al cargar el producto: {error}</p>
          <Link to="/" className="error-back-link">
            ← Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="error-container">
          <p className="error-text">Producto no encontrado</p>
          <Link to="/" className="error-back-link">
            ← Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (discountInfo) {
      addToCart(product, discountInfo);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">⭐</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="opacity-30">⭐</span>);
    }
    return stars;
  };

  return (
    <Layout>
      <div className="product-detail-container">
        <div className="product-detail-nav">
          <Link to="/" className="product-detail-back-link">
            ← Volver a productos
          </Link>
        </div>

        <div className="product-detail-card">
          <div className="product-detail-grid">
            <div className="product-detail-image-container">
              <img
                src={product.image}
                alt={product.title}
                className="product-detail-image"
                loading="eager"
                decoding="async"
                width="400"
                height="400"
                style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible';
                  setImageLoaded(true);
                }}
              />
            </div>

            <div className="product-detail-info">
              <p className="product-detail-category">{product.category}</p>
              <h1 className="product-detail-title">{product.title}</h1>

              {discountInfo && (
                <div className="product-detail-pricing">
                  {discountInfo.hasDiscount ? (
                    <>
                      <p className="product-detail-original-price">
                        Precio original: {formatPrice(discountInfo.originalPrice)}
                      </p>
                      <p className="product-detail-final-price">
                        {formatPrice(discountInfo.finalPrice)}
                      </p>
                      <p className="product-detail-discount">
                        ¡Ahorra {discountInfo.discountPercentage}%!
                      </p>
                    </>
                  ) : (
                    <p className="product-detail-final-price">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>
              )}

              <div className="product-detail-description-section">
                <h2 className="product-detail-description-title">Descripción</h2>
                <p className="product-detail-description">{product.description}</p>
              </div>

              {product.rating && (
                <div className="product-detail-rating-section">
                  <div className="product-detail-rating">
                    <div className="product-detail-stars">
                      {renderStars(product.rating.rate)}
                    </div>
                    <span className="product-detail-rating-count">
                      ({product.rating.count} valoraciones)
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="product-detail-add-btn"
                aria-label="Agregar al carrito"
              >
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;