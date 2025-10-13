import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Checkout = () => {
  const { isAuth } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();

  // Ruta protegida - redirigir si no está autenticado
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: { pathname: '/checkout' } }} replace />;
  }

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleFinalizePurchase = () => {
    alert('¡Compra realizada con éxito! Gracias por tu compra.');
    clearCart();
  };

  return (
    <Layout showSidebar={false}>
      <div className="checkout-container">
        <h1 className="checkout-title">Finalizar Compra</h1>

        <div className="checkout-grid">
          {/* Información de envío */}
          <div className="form-section">
            <h2 className="form-section-title">Información de Envío</h2>
            <form className="form-fields">
              <div className="form-input-group">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  className="form-input"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="form-input"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="form-input"
              />
              <input
                type="text"
                placeholder="Dirección"
                className="form-input"
              />
              <div className="form-input-group">
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Código Postal"
                  className="form-input"
                />
              </div>
            </form>
          </div>

          {/* Resumen del pedido */}
          <div className="form-section">
            <h2 className="form-section-title">Resumen del Pedido</h2>
            
            <div className="checkout-summary-items">
              {cart.map((item) => {
                const finalPrice = item.price * 0.9;
                return (
                  <div key={item.id} className="checkout-summary-item">
                    <div className="checkout-summary-item-info">
                      <p className="checkout-summary-item-title">
                        {item.title}
                      </p>
                      <p className="checkout-summary-item-quantity">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="checkout-summary-item-price">
                      {formatPrice(finalPrice * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary-totals">
              <div className="checkout-summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Envío:</span>
                <span className="checkout-summary-shipping">Gratis</span>
              </div>
              <div className="checkout-summary-total">
                <span>Total:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>

            <button
              onClick={handleFinalizePurchase}
              className="checkout-confirm-btn"
            >
              Confirmar Compra
            </button>

            <div className="checkout-terms">
              <p>Al confirmar tu compra aceptas nuestros términos y condiciones</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;