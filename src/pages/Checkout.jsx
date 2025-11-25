import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Checkout = () => {
  const { isAuth } = useAuth();
  const { cart, getCartTotal, clearCart } = useCart();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});

  // Ruta protegida - redirigir si no está autenticado
  if (!isAuth) {
    return <Navigate to="/login" state={{ from: { pathname: '/checkout' } }} replace />;
  }

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'El formato del teléfono no es válido';
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    // Validar ciudad
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    // Validar código postal
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    } else if (!/^\d{4,6}$/.test(formData.postalCode.replace(/\s/g, ''))) {
      newErrors.postalCode = 'El código postal debe contener entre 4 y 6 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si todos los campos están completos
  const isFormComplete = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  const handleFinalizePurchase = () => {
    if (!validateForm()) {
      alert('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

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
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    className={`form-input ${errors.firstName ? 'form-input-error' : ''}`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    className={`form-input ${errors.lastName ? 'form-input-error' : ''}`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              
              <div className="form-input-wrapper">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  className={`form-input ${errors.address ? 'form-input-error' : ''}`}
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>
              
              <div className="form-input-group">
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-input-wrapper">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Código Postal"
                    className={`form-input ${errors.postalCode ? 'form-input-error' : ''}`}
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  {errors.postalCode && <span className="form-error">{errors.postalCode}</span>}
                </div>
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
              className={`checkout-confirm-btn ${!isFormComplete() ? 'checkout-confirm-btn-disabled' : ''}`}
              disabled={!isFormComplete()}
            >
              {isFormComplete() ? 'Confirmar Compra' : 'Complete los datos de envío'}
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