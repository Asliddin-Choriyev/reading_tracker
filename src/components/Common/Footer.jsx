import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">📚</span>
              <span className="footer-logo-text">Reading Tracker</span>
            </div>
            <p className="footer-description">
              Kitob o'qishni kuzatish va boshqarish uchun zamonaviy platforma.
              O'qing, o'zlashtiring va rivojlaning.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">O'qilgan sahifalar</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Foydalanuvchilar</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Kitoblar</span>
              </div>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Platforma</h4>
              <a href="/dashboard">Dashboard</a>
              <a href="/books">Kitoblar</a>
              <a href="/profile">Profil</a>
              <a href="/stats">Statistika</a>
            </div>
            
            <div className="link-group">
              <h4>Resurslar</h4>
              <a href="/blog">Blog</a>
              <a href="/guides">Qo'llanmalar</a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Aloqa</a>
            </div>
            
            <div className="link-group">
              <h4>Jamoatchilik</h4>
              <a href="/community">Hamjamiyat</a>
              <a href="/discussions">Muhokamalar</a>
              <a href="/challenges">Musobaqalar</a>
              <a href="/achievements">Yutuqlar</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} Reading Tracker. Barcha huquqlar himoyalangan.
          </div>
          
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">𝕏</span>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">f</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon">📸</span>
            </a>
            <a href="#" className="social-link" aria-label="Telegram">
              <span className="social-icon">✈️</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;