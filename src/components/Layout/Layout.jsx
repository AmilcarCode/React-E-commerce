import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children, showSidebar = true }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-content">
        {showSidebar && (
          <>
            {/* Mobile Sidebar Toggle Button */}
            {isMobile && (
              <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
              <div className="sidebar-overlay" onClick={closeSidebar} />
            )}

            {/* Sidebar */}
            <div className={`
              sidebar
              ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'}
              ${isMobile && !isSidebarOpen ? 'sidebar-hidden' : 'sidebar-visible'}
              lg:translate-x-0 lg:static
            `}>
              <Sidebar onLinkClick={closeSidebar} />
            </div>
          </>
        )}

        <main className={`main-content ${showSidebar ? '' : 'w-full'}`}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;