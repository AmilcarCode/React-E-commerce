import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { calculateRandomDiscount, formatPrice } from '../../utils/helpers';
import { getDiscountSettings } from '../../utils/globalConfig';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [discountInfo, setDiscountInfo] = useState({
    originalPrice: product.price,
    finalPrice: product.price,
    discountPercentage: 0,
    hasDiscount: false
  });
  const [discountSettings, setDiscountSettings] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Cargar configuración de descuentos
    const loadDiscountSettings = async () => {
      const settings = await getDiscountSettings();
      setDiscountSettings(settings);
    };
    loadDiscountSettings();
  }, []);

  useEffect(() => {
    // Generar descuento aleatorio cada vez que se monta el componente
    if (discountSettings) {
      const discount = calculateRandomDiscount(product.price, discountSettings);
      setDiscountInfo(discount);
    }
  }, [product.price, discountSettings]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Pasar el descuento actual al carrito
    addToCart(product, discountInfo);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            loading="lazy"
            decoding="async"
            width="200"
            height="200"
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x200?text=Imagen+no+disponible';
              setImageLoaded(true);
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">
            {product.title}
          </h3>
          
          <div className="product-pricing">
            {discountInfo.hasDiscount ? (
              <>
                <div className="product-price-row">
                  <span className="product-price-original">
                    {formatPrice(discountInfo.originalPrice)}
                  </span>
                  <span className="product-discount-badge">
                    {discountInfo.discountPercentage}% OFF
                  </span>
                </div>
                <div className="product-price-final">
                  {formatPrice(discountInfo.finalPrice)}
                </div>
              </>
            ) : (
              <div className="product-price-final">
                {formatPrice(product.price)}
              </div>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button onClick={handleAddToCart} className="product-add-btn" aria-label="Agregar al carrito">
          <span>🛒</span>
          <span className="hidden xs:inline">Agregar al carrito</span>
          <span className="xs:hidden">Agregar</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;