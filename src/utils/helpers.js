export const calculateDiscount = (price, discountPercent = 10) => {
  const discount = price * (discountPercent / 100);
  return {
    originalPrice: price,
    finalPrice: price - discount,
    discount: discount,
    discountPercent: discountPercent
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('libremercado_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('libremercado_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const getAuthFromStorage = () => {
  try {
    const isAuth = localStorage.getItem('isAuth') === '1';
    const userName = localStorage.getItem('userName') || '';
    return { isAuth, userName };
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
    return { isAuth: false, userName: '' };
  }
};

export const saveAuthToStorage = (isAuth, userName = '') => {
  try {
    localStorage.setItem('isAuth', isAuth ? '1' : '0');
    localStorage.setItem('userName', userName);
  } catch (error) {
    console.error('Error saving auth to localStorage:', error);
  }
};