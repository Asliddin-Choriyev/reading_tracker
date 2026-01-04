/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { useBook } from '../../contexts/BookContext';
import './BookCard.css';

const BookCard = ({ book }) => {
  const { deleteBook } = useBook();

  const getStatusText = (status) => {
    switch (status) {
      case 'reading': return 'O\'qilmoqda';
      case 'completed': return 'Tugatilgan';
      case 'to_read': return 'Rejalashtirilgan';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'to_read': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Bu kitobni o\'chirishni xohlaysizmi?')) {
      deleteBook(book.id);
    }
  };

  return (
    <div className="book-card">
      <div className="book-card-header">
        <div className="book-status" style={{ backgroundColor: getStatusColor(book.status) }}>
          {getStatusText(book.status)}
        </div>
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Kitobni o'chirish"
        >
          ✕
        </button>
      </div>

      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        
        {book.genre && (
          <div className="book-genre">
            <span className="genre-tag">{book.genre}</span>
          </div>
        )}
      </div>

      <div className="book-progress">
        <div className="progress-info">
          <span className="pages">
            {book.currentPage} / {book.totalPages} sahifa
          </span>
          <span id="percentage" className="percentage">{book.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${book.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="book-actions">
        <Link 
          to={`/reading/${book.id}`}
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            // Tugma bosilganda sahifaga o'tishni tekshirish
            console.log('O\'qish tugmasi bosildi, kitob ID:', book.id);
          }}
        >
          {book.status === 'completed' ? 'Ko\'rish' : 'O\'qishni davom ettirish'}
        </Link>
        
        {book.status === 'completed' && (
          <Link 
            to={`/quiz/${book.id}`}
            className="btn btn-success btn-sm"
          >
            Test
          </Link>
        )}
      </div>
    </div>
  );
};

export default BookCard;