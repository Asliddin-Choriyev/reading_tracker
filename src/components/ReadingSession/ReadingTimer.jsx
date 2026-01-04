/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { useBook } from '../../contexts/BookContext';
import './ReadingTimer.css';

const ReadingTimer = ({ bookId }) => {
  const { getBookById, updateBook } = useBook();
  const book = getBookById(bookId);
  
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionPages, setSessionPages] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const timerRef = useRef(null);

  // Initialize state with useEffect
  useEffect(() => {
    const savedTimer = localStorage.getItem(`timer_${bookId}`);
    if (savedTimer) {
      try {
        const data = JSON.parse(savedTimer);
        
        // Use functional update to avoid direct setState in effect
        setTime(prev => data.time || 0);
        
        if (data.isRunning) {
          setIsRunning(true);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [bookId]);

  // Handle timer interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Save timer state when time or isRunning changes
  useEffect(() => {
    const timerState = {
      time,
      isRunning,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(`timer_${bookId}`, JSON.stringify(timerState));
  }, [time, isRunning, bookId]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setSessionPages(0);
    localStorage.removeItem(`timer_${bookId}`);
  };

  const handleFinishSession = () => {
    pauseTimer();
    
    if (book && sessionPages > 0) {
      const newCurrentPage = Math.min(
        book.currentPage + sessionPages,
        book.totalPages
      );
      
      const newStatus = newCurrentPage >= book.totalPages ? 'completed' : 'reading';
      
      updateBook(book.id, {
        currentPage: newCurrentPage,
        progress: Math.round((newCurrentPage / book.totalPages) * 100),
        status: newStatus
      });

      // Save session history
      const sessionHistory = JSON.parse(localStorage.getItem(`sessions_${bookId}`) || '[]');
      sessionHistory.push({
        date: new Date().toISOString(),
        duration: time,
        pagesRead: sessionPages,
        bookId
      });
      localStorage.setItem(`sessions_${bookId}`, JSON.stringify(sessionHistory));
    }

    resetTimer();
    setShowFinishModal(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!book) {
    return (
      <div className="reading-timer error">
        <h3>Kitob topilmadi</h3>
        <p>Iltimos, kitobni tanlang yoki yangi kitob qo'shing.</p>
      </div>
    );
  }

  const progressPercentage = book.progress || 0;

  return (
    <div className="reading-timer">
      <div className="book-info-header">
        <h2>{book.title}</h2>
        <p className="book-author">{book.author}</p>
        <div className="book-meta">
          <span>Sahifalar: {book.currentPage} / {book.totalPages}</span>
          <span>Progress: {progressPercentage}%</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>Boshlash</span>
          <span>{progressPercentage}%</span>
          <span>Tugatish</span>
        </div>
      </div>

      <div className="timer-section">
        <div className="timer-display">
          <div className="time">{formatTime(time)}</div>
          <div className="timer-label">O'qish vaqti</div>
        </div>

        <div className="timer-controls">
          {!isRunning ? (
            <button className="btn btn-success" onClick={startTimer}>
              ▶️ O'qishni boshlash
            </button>
          ) : (
            <button className="btn btn-warning" onClick={pauseTimer}>
              ⏸️ Pauza
            </button>
          )}
          
          <button 
            className="btn btn-secondary" 
            onClick={resetTimer}
            disabled={time === 0}
          >
            🔄 Qayta boshlash
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={() => setShowFinishModal(true)}
            disabled={time === 0}
          >
            ✅ Sessiyani tugatish
          </button>
        </div>
      </div>

      {showFinishModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Sessiyani tugatish</h3>
            
            <div className="session-summary">
              <div className="summary-item">
                <span className="label">O'qish vaqti:</span>
                <span className="value">{formatTime(time)}</span>
              </div>
              
              <div className="summary-item">
                <span className="label">Kitob:</span>
                <span className="value">{book.title}</span>
              </div>
              
              <div className="summary-item">
                <span className="label">Hozirgi sahifa:</span>
                <span className="value">{book.currentPage}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Ushbu sessiyada nechta sahifa o'qidingiz?
              </label>
              <input
                type="number"
                value={sessionPages}
                onChange={(e) => setSessionPages(parseInt(e.target.value) || 0)}
                className="form-control"
                min="0"
                max={book.totalPages - book.currentPage}
                placeholder="Sahifalar soni"
                style={{ color: 'var(--gray-900)' }}
              />
              <small className="form-text">
                Qolgan sahifalar: {book.totalPages - book.currentPage}
              </small>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFinishModal(false)}
              >
                Bekor qilish
              </button>
              
              <button 
                className="btn btn-primary"
                onClick={handleFinishSession}
                disabled={sessionPages <= 0}
              >
                Saqlash va tugatish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingTimer;