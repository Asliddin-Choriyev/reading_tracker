import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Kirishda xatolik yuz berdi');
      }
    } catch (err) {
      setError(err.message || 'Server xatosi yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tizimga Kirish</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="form-control"
              required
              disabled={loading}
              style={{ color:'black' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Parol
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolingiz"
              className="form-control"
              required
              disabled={loading}
              style={{ color:'black' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="auth-link">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;