import React, { createContext, useContext, useState, useEffect } from 'react';
import { setGlobalConfig, subscribeToConfigChanges, initializeConfig } from '../utils/globalConfig';

const ProductSourceContext = createContext();

export const useProductSource = () => {
  const context = useContext(ProductSourceContext);
  if (!context) {
    throw new Error('useProductSource must be used within ProductSourceProvider');
  }
  return context;
};

export const ProductSourceProvider = ({ children }) => {
  const [productSource, setProductSource] = useState('mockapi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar configuración
    const initConfig = async () => {
      try {
        setLoading(true);
        const config = await initializeConfig();
        if (config) {
          setProductSource(config.productSource || 'mockapi');
          console.log('✅ Configuración inicializada desde localStorage');
        }
      } catch (error) {
        console.error('Error initializing config:', error);
        setProductSource('mockapi');
      } finally {
        setLoading(false);
      }
    };

    initConfig();

    // Suscribirse a cambios de configuración desde otras pestañas
    const unsubscribe = subscribeToConfigChanges((newConfig) => {
      console.log('📢 Configuración actualizada globalmente:', newConfig);
      setProductSource(newConfig.productSource);
    });

    return unsubscribe;
  }, []);

  const updateProductSource = async (source) => {
    if (['mockapi', 'fakestore', 'both'].includes(source)) {
      try {
        setLoading(true);
        const newConfig = await setGlobalConfig({ productSource: source }, 'admin');
        if (newConfig) {
          setProductSource(source);
          console.log('✅ Fuente de productos actualizada en localStorage:', source);
        }
      } catch (error) {
        console.error('Error updating product source:', error);
        // Fallback to local state update
        setProductSource(source);
      } finally {
        setLoading(false);
      }
    }
  };

  const value = {
    productSource,
    updateProductSource,
    loading
  };

  return (
    <ProductSourceContext.Provider value={value}>
      {children}
    </ProductSourceContext.Provider>
  );
};