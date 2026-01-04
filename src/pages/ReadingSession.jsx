import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../contexts/BookContext';
import ReadingTimer from '../components/ReadingSession/ReadingTimer';
import SessionHistory from '../components/ReadingSession/SessionHistory';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import './ReadingSession.css';
import FullScreenTimer from '../components/ReadingSession/FullScreenTimer';

const ReadingSession = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getBookById } = useBook();
  const book = getBookById(bookId);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  
  useEffect(() => {
    console.log('ReadingSession component mounted, bookId:', bookId);
    console.log('Book found:', book);
    
    if (!bookId) {
      console.error('bookId is undefined!');
    }
  }, [bookId, book]);

  if (fullScreenMode) {
    return (
      <FullScreenTimer 
        bookId={parseInt(bookId)} 
        onExit={() => setFullScreenMode(false)} 
      />
    );
  }

  if (!bookId) {
    return (
      <div className="reading-session error">
        <h3>Kitob tanlanmagan</h3>
        <p>Iltimos, o'qish uchun kitob tanlang.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/books')}
        >
          Kitoblar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="reading-session">
        <div className="session-header">
          <button 
            className="btn btn-secondary back-btn"
            onClick={() => navigate('/books')}
          >
            ← Ortga
          </button>
        </div>
        <div className="session-content">
          <LoadingSpinner text="Kitob yuklanmoqda..." />
        </div>
      </div>
    );
  }

  return (
    <div className="reading-session">
      <div className="session-header">
        <button 
          className="btn btn-secondary back-btn"
          onClick={() => navigate('/books')}
        >
          ← Ortga
        </button>
        
        <div className="session-title">
          <h1>{book.title}</h1>
          <p className="book-subtitle">Muallif: {book.author}</p>
        </div>
        
        <div className="header-actions">
          {book.status === 'completed' && (
            <button 
              className="btn btn-success"
              onClick={() => navigate(`/quiz/${bookId}`)}
            >
              Testni boshlash
            </button>
          )}
         
        </div>
      </div>

      <div className="session-content">
        <div className="main-session">
          <ReadingTimer bookId={parseInt(bookId)} />
        </div>
        
        <div className="session-sidebar">
          <div className="sidebar-section">
            <h3>Kitob ma'lumotlari</h3>
            <div className="book-details">
              <div className="detail-item">
                <span className="detail-label">Jami sahifalar:</span>
                <span className="detail-value">{book.totalPages}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">O'qilgan sahifalar:</span>
                <span className="detail-value">{book.currentPage}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Qolgan sahifalar:</span>
                <span className="detail-value">{book.totalPages - book.currentPage}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Progress:</span>
                <span className="detail-value">{book.progress}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Holati:</span>
                <span className={`status-value ${book.status}`}>
                  {book.status === 'reading' ? 'O\'qilmoqda' : 
                   book.status === 'completed' ? 'Tugatilgan' : 
                   'Rejalashtirilgan'}
                </span>
              </div>
            </div>
          </div>
          
          {book.description && (
            <div className="sidebar-section">
              <h3>Tavsif</h3>
              <p className="book-description">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      <SessionHistory bookId={parseInt(bookId)} />
    </div>
  );
};

export default ReadingSession;