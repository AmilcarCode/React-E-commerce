import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

const NotFound = () => {
  return (
    <Layout showSidebar={false}>
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-number">404</div>
          <h1 className="not-found-title">
            Página no encontrada
          </h1>
          <p className="not-found-description">
            Lo sentimos, la página que buscas no existe.
          </p>
          <Link
            to="/"
            className="not-found-home-link"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;