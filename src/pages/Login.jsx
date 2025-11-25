import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { USERS } from '../utils/constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { isAuth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect si ya está autenticado
  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const fillCredentials = (user) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <Layout showSidebar={false}>
      <div className="login-container">
        <div className="login-form-container">
          <div>
            <h2 className="login-header-title">
              Iniciar Sesión
            </h2>
            <p className="login-header-subtitle">
              Accede a tu cuenta de LibreMercado
            </p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-fields">
              <div>
                <label htmlFor="username" className="sr-only">
                  Usuario
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-form-field-top"
                  placeholder="Usuario"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-form-field-bottom"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>

            <div className="login-test-credentials-info">
              <p className="login-test-credentials-title font-bold text-lg mb-3">Credenciales de acceso:</p>
              
              <div className="space-y-4">
                {USERS.map((user) => (
                  <div key={user.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {user.role === 'admin' ? '👑 Administrador' : '👤 Usuario común'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fillCredentials(user)}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Usar
                      </button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Usuario:</span> {user.username}</p>
                      <p><span className="font-medium">Contraseña:</span> {user.password}</p>
                    </div>
                    {user.role === 'admin' && (
                      <p className="text-xs text-blue-600 mt-2">
                        ✓ Puede acceder al panel de administración y cambiar la fuente de productos
                      </p>
                    )}
                    {user.role === 'user' && (
                      <p className="text-xs text-gray-500 mt-2">
                        ✓ Puede comprar productos pero no acceder al panel de administración
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;