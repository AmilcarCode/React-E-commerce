import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
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

    const result = login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const fillTestCredentials = () => {
    setEmail('test@libremercado.com');
    setPassword('123456');
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
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-form-field-top"
                  placeholder="Email"
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

            <div className="text-center">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="login-test-credentials-btn"
              >
                Usar credenciales de prueba
              </button>
            </div>

            <div className="login-test-credentials-info">
              <p className="login-test-credentials-title">Credenciales de prueba:</p>
              <p>Email: test@libremercado.com</p>
              <p>Contraseña: 123456</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;