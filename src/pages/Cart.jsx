import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();

  if (cart.length === 0) {
    return (
      <Layout showSidebar={false}>
        <div className="cart-container">
          <h1 className="cart-title">Carrito de Compras</h1>
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2 className="cart-empty-title">Tu carrito está vacío</h2>
            <Link
              to="/"
              className="cart-continue-shopping"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Carrito de Compras</h1>
          <button
            onClick={clearCart}
            className="cart-clear-btn"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="cart-items-container">
          {cart.map((item) => {
            // Usar el descuento guardado en el carrito
            const discountPercentage = item.cartDiscount || 0;
            const finalPrice = item.cartFinalPrice || item.price;
            
            return (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-title">
                    {item.title}
                  </h3>
                  <p className="cart-item-category">
                    {item.category}
                  </p>
                  {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  <p className="cart-item-price">
                    {formatPrice(finalPrice)}
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="cart-quantity-btn"
                  >
                    -
                  </button>
                  
                  <span className="cart-quantity-display">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="cart-quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="cart-item-total-price">
                    {formatPrice(finalPrice * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cart-item-remove"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-total">
            <span>Total:</span>
            <span className="cart-summary-total-price">
              {formatPrice(getCartTotal())}
            </span>
          </div>
          
          <div className="cart-summary-actions">
            <Link
              to="/"
              className="cart-summary-continue"
            >
              Continuar comprando
            </Link>
            <Link
              to="/checkout"
              className="cart-summary-checkout"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;