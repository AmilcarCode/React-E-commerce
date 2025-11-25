import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartFromStorage, saveCartToStorage } from '../utils/helpers';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = getCartFromStorage();
    setCart(savedCart);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveCartToStorage(cart);
    }
  }, [cart, loading]);

  const addToCart = (product, discountInfo) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, solo incrementar cantidad (mantener el descuento original)
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Nuevo producto: guardar con el descuento actual
      return [...prevCart, { 
        ...product, 
        quantity: 1,
        cartDiscount: discountInfo.discountPercentage, // Guardar el descuento aplicado
        cartFinalPrice: discountInfo.finalPrice // Guardar el precio final
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      // Usar el precio guardado en el carrito
      const finalPrice = item.cartFinalPrice || item.price;
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};