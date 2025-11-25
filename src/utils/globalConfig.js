// Sistema de configuración global sincronizado entre pestañas/navegadores
// Ahora usando localStorage exclusivamente

const GLOBAL_CONFIG_KEY = 'libremercado_global_config';
const STORAGE_EVENT_KEY = 'libremercado_config_update';

// Configuración por defecto
const DEFAULT_CONFIG = {
  productSource: 'mockapi',
  discountSettings: {
    enabled: true,
    possibleDiscounts: [0, 5, 10, 25, 40], // 0 significa sin descuento
    noDiscountChance: 30, // 30% de probabilidad de no tener descuento
  },
  lastUpdated: Date.now(),
  updatedBy: 'system',
  source: 'local'
};

// Obtener configuración global desde localStorage
export const getGlobalConfig = async () => {
  try {
    const stored = localStorage.getItem(GLOBAL_CONFIG_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      // Asegurar que discountSettings existe
      if (!config.discountSettings) {
        config.discountSettings = DEFAULT_CONFIG.discountSettings;
      }
      return config;
    }
    
    // Configuración por defecto si no existe
    const defaultConfig = { ...DEFAULT_CONFIG };
    localStorage.setItem(GLOBAL_CONFIG_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  } catch (error) {
    console.error('Error reading local config:', error);
    return { ...DEFAULT_CONFIG };
  }
};

// Guardar configuración global en localStorage
export const setGlobalConfig = async (config, updatedBy = 'admin') => {
  try {
    const currentConfig = await getGlobalConfig();
    const newConfig = {
      ...currentConfig,
      ...config,
      lastUpdated: Date.now(),
      updatedBy,
      source: 'local'
    };
    
    localStorage.setItem(GLOBAL_CONFIG_KEY, JSON.stringify(newConfig));
    
    // Disparar evento personalizado para sincronización en la misma pestaña
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT_KEY, {
      detail: newConfig
    }));
    
    return newConfig;
  } catch (error) {
    console.error('Error saving local config:', error);
    return null;
  }
};

// Obtener fuente de productos desde localStorage
export const getProductSource = async () => {
  try {
    const config = await getGlobalConfig();
    return config.productSource || 'mockapi';
  } catch (error) {
    console.error('Error getting product source:', error);
    return 'mockapi';
  }
};

// Actualizar fuente de productos en localStorage
export const updateProductSource = async (source, updatedBy = 'admin') => {
  if (!['mockapi', 'fakestore', 'both'].includes(source)) {
    throw new Error('Fuente de productos no válida');
  }
  
  return await setGlobalConfig({ productSource: source }, updatedBy);
};

// Obtener configuración de descuentos
export const getDiscountSettings = async () => {
  try {
    const config = await getGlobalConfig();
    return config.discountSettings || DEFAULT_CONFIG.discountSettings;
  } catch (error) {
    console.error('Error getting discount settings:', error);
    return DEFAULT_CONFIG.discountSettings;
  }
};

// Actualizar configuración de descuentos
export const updateDiscountSettings = async (discountSettings, updatedBy = 'admin') => {
  return await setGlobalConfig({ discountSettings }, updatedBy);
};

// Suscribirse a cambios de configuración
export const subscribeToConfigChanges = (callback) => {
  let isSubscribed = true;
  
  // Listener para cambios en otras pestañas (storage event)
  const storageListener = (e) => {
    if (!isSubscribed) return;
    
    if (e.key === GLOBAL_CONFIG_KEY && e.newValue) {
      try {
        const newConfig = JSON.parse(e.newValue);
        callback(newConfig);
      } catch (error) {
        console.error('Error parsing config update:', error);
      }
    }
  };
  
  // Listener para cambios en la misma pestaña (custom event)
  const customListener = (e) => {
    if (!isSubscribed) return;
    callback(e.detail);
  };
  
  window.addEventListener('storage', storageListener);
  window.addEventListener(STORAGE_EVENT_KEY, customListener);
  
  // Retornar función de limpieza
  return () => {
    isSubscribed = false;
    window.removeEventListener('storage', storageListener);
    window.removeEventListener(STORAGE_EVENT_KEY, customListener);
  };
};

// Inicializar configuración
export const initializeConfig = async () => {
  try {
    const config = await getGlobalConfig();
    console.log('🔄 Configuración global inicializada:', {
      productSource: config.productSource,
      discountSettings: config.discountSettings,
      source: config.source,
      updatedBy: config.updatedBy
    });
    return config;
  } catch (error) {
    console.error('Error initializing config:', error);
    return null;
  }
};