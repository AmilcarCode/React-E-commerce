export const formatPrice = (price) => {
  // Price comes as-is from the API (already in the correct format)
  // MockAPI sends prices in pesos, FakeStore prices are also in pesos
  // We just format them without any conversion
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price); // Remove division by 100 - prices are already in correct format
};

// Generar descuento aleatorio para mostrar en la página (cambia con cada render)
export const calculateRandomDiscount = (price, discountSettings) => {
  if (!discountSettings || !discountSettings.enabled) {
    return {
      originalPrice: price,
      finalPrice: price,
      discountPercentage: 0,
      hasDiscount: false
    };
  }

  const { possibleDiscounts, noDiscountChance } = discountSettings;
  
  // Determinar si este producto tiene descuento
  const random = Math.random() * 100;
  
  if (random < noDiscountChance) {
    // Sin descuento
    return {
      originalPrice: price,
      finalPrice: price,
      discountPercentage: 0,
      hasDiscount: false
    };
  }
  
  // Filtrar solo descuentos mayores a 0
  const validDiscounts = possibleDiscounts.filter(d => d > 0);
  
  if (validDiscounts.length === 0) {
    return {
      originalPrice: price,
      finalPrice: price,
      discountPercentage: 0,
      hasDiscount: false
    };
  }
  
  // Seleccionar un descuento aleatorio
  const discountPercentage = validDiscounts[Math.floor(Math.random() * validDiscounts.length)];
  const discountedPrice = price * (1 - discountPercentage / 100);
  
  return {
    originalPrice: price,
    finalPrice: discountedPrice,
    discountPercentage: discountPercentage,
    hasDiscount: discountPercentage > 0
  };
};

// Calcular descuento fijo (para productos en el carrito)
export const calculateFixedDiscount = (price, discountPercentage) => {
  const discountedPrice = price * (1 - discountPercentage / 100);
  
  return {
    originalPrice: price,
    finalPrice: discountedPrice,
    discountPercentage: discountPercentage,
    hasDiscount: discountPercentage > 0
  };
};

// Mantener compatibilidad con código existente
export const calculateDiscount = (price, productId) => {
  // Esta función ahora es solo para compatibilidad
  // En la práctica, usaremos calculateRandomDiscount o calculateFixedDiscount
  const discountSeed = productId ? parseInt(productId.toString().slice(-2)) : Math.floor(Math.random() * 100);
  
  let discountPercentage = 0;
  
  if (discountSeed < 10) {
    discountPercentage = 5;
  } else if (discountSeed < 20) {
    discountPercentage = 40;
  } else if (discountSeed < 60) {
    discountPercentage = 10;
  } else {
    discountPercentage = 25;
  }
  
  const discountedPrice = price * (1 - discountPercentage / 100);
  
  return {
    originalPrice: price,
    finalPrice: discountedPrice,
    discountPercentage: discountPercentage,
    hasDiscount: discountPercentage > 0
  };
};

export const getAuthFromStorage = () => {
  try {
    const isAuth = localStorage.getItem('isAuth') === 'true';
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { isAuth, user };
  } catch (error) {
    console.error('Error reading auth from storage:', error);
    return { isAuth: false, user: null };
  }
};

export const saveAuthToStorage = (isAuth, user) => {
  try {
    localStorage.setItem('isAuth', isAuth.toString());
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

export const getCartFromStorage = () => {
  try {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};