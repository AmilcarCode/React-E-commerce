import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';

const Sidebar = ({ onLinkClick }) => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <aside className="w-full h-full bg-gray-50">
      <div className="sidebar-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="sidebar-title">Categorías</h2>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`sidebar-link ${
              !currentCategory ? 'sidebar-link-active' : 'sidebar-link-inactive'
            }`}
          >
            Todos los productos
          </Link>
          
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/?category=${encodeURIComponent(category)}`}
              onClick={handleLinkClick}
              className={`sidebar-link capitalize ${
                currentCategory === category
                  ? 'sidebar-link-active'
                  : 'sidebar-link-inactive'
              }`}
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;