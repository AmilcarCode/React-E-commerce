import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuth, userName, logout, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Desktop Navigation */}
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="navbar-brand">LibreMercado</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="navbar-search">
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
              <button type="submit" className="navbar-search-btn">
                🔍
              </button>
            </form>
          </div>

          {/* Desktop User Menu and Cart */}
          <div className="navbar-user-menu">
            {isAuth ? (
              <div className="flex items-center space-x-2">
                <span className="user-greeting">Hola, {userName}</span>
                {/* Solo mostrar botón Admin si el usuario es administrador */}
                {isAdmin() && (
                  <Link to="/admin" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="user-logout">
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="user-login-link">
                Iniciar Sesión
              </Link>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="theme-toggle-btn"
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            <Link to="/cart" className="cart-icon">
              🛒
              {getCartItemsCount() > 0 && (
                <span className="cart-badge">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="navbar-mobile-menu">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={handleThemeToggle}
              className="theme-toggle-btn"
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            <Link to="/cart" className="cart-icon">
              🛒
              {getCartItemsCount() > 0 && (
                <span className="cart-badge">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            <button onClick={toggleMobileMenu} className="navbar-mobile-toggle">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="navbar-mobile-dropdown">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
              <button type="submit" className="navbar-search-btn">
                🔍
              </button>
            </form>

            {/* Mobile User Menu */}
            <div className="navbar-mobile-user-menu">
              {isAuth ? (
                <>
                  <span className="navbar-mobile-user-greeting">Hola, {userName}</span>
                  {/* Solo mostrar enlace Admin si el usuario es administrador */}
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="navbar-mobile-login"
                    >
                      Panel de Administración
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="navbar-mobile-logout"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="navbar-mobile-login"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;