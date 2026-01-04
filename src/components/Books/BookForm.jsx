import React, { useState, useEffect } from 'react';
import { useBook } from '../../contexts/BookContext';
import './BookForm.css';

const BookForm = ({ bookToEdit, onClose, onSuccess }) => {
  const { addBook, updateBook } = useBook();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '0',
    genre: '',
    status: 'to_read',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || '',
        author: bookToEdit.author || '',
        totalPages: bookToEdit.totalPages || '',
        currentPage: bookToEdit.currentPage || '0',
        genre: bookToEdit.genre || '',
        status: bookToEdit.status || 'to_read',
        description: bookToEdit.description || ''
      });
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.title.trim()) {
      setError('Kitob nomi kiritilishi shart');
      return;
    }
    
    if (!formData.author.trim()) {
      setError('Muallif nomi kiritilishi shart');
      return;
    }
    
    const totalPages = parseInt(formData.totalPages);
    const currentPage = parseInt(formData.currentPage);
    
    if (!totalPages || totalPages < 1) {
      setError('To\'g\'ri sahifalar sonini kiriting');
      return;
    }
    
    if (currentPage < 0 || currentPage > totalPages) {
      setError('Hozirgi sahifa 0 dan jami sahifalar gacha bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const bookData = {
        ...formData,
        totalPages,
        currentPage,
        progress: Math.round((currentPage / totalPages) * 100)
      };

      if (bookToEdit) {
        updateBook(bookToEdit.id, bookData);
      } else {
        addBook(bookData);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError('Xatolik yuz berdi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="book-form-modal">
        <div className="modal-header">
          <h2>{bookToEdit ? 'Kitobni tahrirlash' : 'Yangi kitob qo\'shish'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kitob nomi *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Kitob nomi"
                required
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Muallif *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="form-control"
                placeholder="Muallif"
                required
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jami sahifalar *</label>
              <input
                type="number"
                name="totalPages"
                value={formData.totalPages}
                onChange={handleChange}
                className="form-control"
                min="1"
                required
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hozirgi sahifa</label>
              <input
                type="number"
                name="currentPage"
                value={formData.currentPage}
                onChange={handleChange}
                className="form-control"
                min="0"
                max={formData.totalPages || 10000}
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Janr</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="form-control"
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              >
                <option value="">Tanlamang</option>
                <option value="fantasy">Fantastika</option>
                <option value="science">Ilmiy</option>
                <option value="biography">Biografiya</option>
                <option value="history">Tarix</option>
                <option value="fiction">Badiiy</option>
                <option value="self_help">O'ziyordam</option>
                <option value="classic">Klassika</option>
                <option value="mystery">Sir</option>
                <option value="romance">Romantika</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Holati</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                disabled={loading}
                style={{ color: formData.title ? 'var(--gray-900)' : 'var(--gray-400)' }}
              >
                <option value="to_read">Rejalashtirilgan</option>
                <option value="reading">O'qilmoqda</option>
                <option value="completed">Tugatilgan</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Qisqacha tavsif</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Kitob haqida qisqacha..."
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saqlanmoqda...' : bookToEdit ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;