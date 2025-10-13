import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { calculateDiscount, formatPrice } from '../../utils/helpers';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { originalPrice, finalPrice } = calculateDiscount(product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="product-image-container">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x200?text=Imagen+no+disponible';
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-title">
            {product.title}
          </h3>
          
          <div className="product-pricing">
            <div className="product-price-row">
              <span className="product-price-original">
                {formatPrice(originalPrice)}
              </span>
              <span className="product-discount-badge">
                10% OFF
              </span>
            </div>
            <div className="product-price-final">
              {formatPrice(finalPrice)}
            </div>
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button onClick={handleAddToCart} className="product-add-btn">
          <span>🛒</span>
          <span className="hidden xs:inline">Agregar al carrito</span>
          <span className="xs:hidden">Agregar</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;