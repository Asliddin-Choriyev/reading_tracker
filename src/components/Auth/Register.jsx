import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Register.css';

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    readingGoal: 10
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readingGoal' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }

    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError('Ro\'yxatdan o\'tishda xatolik yuz berdi');
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
        <h2 className="auth-title">Ro'yxatdan o'tish</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Ism
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ismingiz"
              className="form-control"
              required
              disabled={loading}
              style={{ color:'black' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Parolingiz (kamida 6 ta belgi)"
              className="form-control"
              required
              disabled={loading}
              style={{ color:'black' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Parolni tasdiqlash
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Parolni qayta kiriting"
              className="form-control"
              required
              disabled={loading}
              style={{ color:'black' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="readingGoal">
              Oylik o'qish maqsadi (kitob)
            </label>
            <input
              type="number"
              id="readingGoal"
              name="readingGoal"
              value={formData.readingGoal}
              onChange={handleChange}
              min="1"
              max="100"
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
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/login" className="auth-link">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;