import React from 'react';
import { 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  ExternalLink,
  Twitter,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-grid">
          
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">LibreMercado</h3>
            <p className="footer-description">
              Tu tienda online de confianza. Encontrá los mejores productos con descuentos increíbles y envíos a todo el país.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contacto</h4>
            <div className="space-y-3">
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-contact-text">info@libremercado.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+54 11 1234-5678</span>
              </div>
              <div className="footer-contact-item">
                <Clock className="footer-contact-icon" />
                <span className="footer-contact-text">Lun - Vie: 9:00 - 18:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Enlaces Útiles</h4>
            <ul className="footer-nav-list">
              <li><a href="#" className="footer-nav-link">Ayuda y Soporte</a></li>
              <li><a href="#" className="footer-nav-link">Devoluciones</a></li>
              <li><a href="#" className="footer-nav-link">Medios de Pago</a></li>
              <li><a href="#" className="footer-nav-link">Envíos</a></li>
              <li><a href="#" className="footer-nav-link">Términos y Condiciones</a></li>
              <li><a href="#" className="footer-nav-link">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Location */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Ubicación</h4>
            <div className="space-y-3">
              <div className="footer-location-content">
                <MapPin className="footer-location-icon" />
                <div className="footer-location-text">
                  <p>Av. Corrientes 1234</p>
                  <p>Buenos Aires, Argentina</p>
                  <p>C1043AAZ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Google Maps */}
      <div className="footer-maps-section">
        <div className="footer-maps-container">
          <h4 className="footer-maps-title">Encontranos en el Mapa</h4>
          <div className="footer-maps-iframe-container">
            <iframe
              src="https://www.google.com/maps?q=Av.+Corrientes+1234,+Buenos+Aires,+Argentina&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LibreMercado Location"
              className="footer-maps-iframe"
            ></iframe>
          </div>
          <div className="footer-maps-link-container">
            <a 
              href="https://maps.google.com/?q=Av.+Corrientes+1234,+Buenos+Aires,+Argentina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-maps-link"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir en Google Maps</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2024 LibreMercado. Todos los derechos reservados.
            </p>
            <div className="footer-payment-section">
              <span className="footer-payment-label">Métodos de pago:</span>
              <div className="footer-payment-methods">
                <div className="footer-payment-card">
                  <span className="footer-payment-visa">VISA</span>
                </div>
                <div className="footer-payment-card">
                  <span className="footer-payment-mc">MC</span>
                </div>
                <div className="footer-payment-card">
                  <span className="footer-payment-amex">AMEX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;