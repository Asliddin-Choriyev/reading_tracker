import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            📚 Reading Tracker
          </Link>
        </div>
        
        {isAuthenticated && (
          <>
            <div className="navbar-menu">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              
              <Link to="/books" className="nav-link">
                Kitoblar
              </Link>
            </div>
            
            <div className="navbar-actions">
              <div className="user-info">
                <span className="user-name">👤 {user?.name || 'Foydalanuvchi'}</span>
              </div>
              
              <Link to="/profile" className="btn btn-secondary btn-sm">
                Profil
              </Link>
              
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Chiqish
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;