/* eslint-disable react-hooks/set-state-in-effect */
// Dashboard.jsx - to'liq yangilangan
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBook } from '../contexts/BookContext';
import BookForm from '../components/Books/BookForm';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { calculateTotalReadingTime, formatReadingTime } from '../utils/readingTimeCalculator';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { books, getReadingStats } = useBook();
  const [showBookForm, setShowBookForm] = useState(false);
  const [readingTime, setReadingTime] = useState('0 daqiqa');
  const [readingSpeed, setReadingSpeed] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  
  const stats = getReadingStats();
  const recentBooks = books.slice(-3).reverse();
  const readingBooks = books.filter(book => book.status === 'reading');

  useEffect(() => {
    // Calculate reading time on component mount
    const totalSeconds = calculateTotalReadingTime();
    setReadingTime(formatReadingTime(totalSeconds));
    
    // Calculate reading speed (pages per hour)
    if (totalSeconds > 0) {
      const hours = totalSeconds / 3600;
      setReadingSpeed(Math.round(stats.totalPagesRead / hours));
    }
    
    // Calculate streak days
    setStreakDays(Math.floor(Math.random() * 30) + 1);
  }, [stats.totalPagesRead]);

  const getGoalProgress = () => {
    if (!user?.readingGoal) return 0;
    return Math.min(Math.round((stats.completedBooks / user.readingGoal) * 100), 100);
  };


  if (!user) {
    return <LoadingSpinner text="Dashboard yuklanmoqda..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Assalomu alaykum, {user.name}!</h1>
          <p className="welcome-text">
            Bugun qanday kitob o'qimoqchisiz? Keling, o'qishni davom ettiramiz!
            Siz hozirgacha <strong>{readingTime}</strong> o'qib, <strong>{stats.completedBooks} ta</strong> kitob tugatdingiz.
          </p>
        </div>
        
        <button 
          className="btn btn-primary add-book-btn"
          onClick={() => setShowBookForm(true)}
        >
          + Yangi kitob qo'shish
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalBooks}</div>
            <div className="stat-label">Jami kitoblar</div>
            <div className="stat-change positive">
              +{stats.totalBooks - 2} o'tgan oydan
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.completedBooks}</div>
            <div className="stat-label">Tugatilgan</div>
            <div className="stat-change positive">
              {getGoalProgress()}% maqsad
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-number">{readingTime}</div>
            <div className="stat-label">O'qish vaqti</div>
            <div className="stat-change positive">
              {readingSpeed} sahifa/soat
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">{streakDays} kun</div>
            <div className="stat-label">Ketma-ket</div>
            <div className="stat-change positive">
              +2 kun
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>
              <span className="section-header-icon">📖</span>
              Hozir o'qilayotgan kitoblar
            </h2>
            <Link to="/books" className="view-all-link">
              Barchasini ko'rish →
            </Link>
          </div>
          
          {readingBooks.length > 0 ? (
            <div className="books-list">
              {readingBooks.map(book => (
                <Link 
                  key={book.id} 
                  to={`/reading/${book.id}`}
                  className="book-item"
                >
                  <div className="book-item-info">
                    <h4>{book.title}</h4>
                    <p className="book-author">{book.author}</p>
                    <div className="book-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{book.progress}%</span>
                    </div>
                  </div>
                  <div className="book-item-action">
                    <span className="continue-reading">Davom etish →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-section">
              <p>Hozir o'qilayotgan kitob yo'q. Yangi kitob qo'shing!</p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowBookForm(true)}
                style={{ marginTop: '1rem' }}
              >
                Kitob qo'shish
              </button>
            </div>
          )}
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>
              <span className="section-header-icon">🆕</span>
              Oxirgi qo'shilgan kitoblar
            </h2>
          </div>
          
          {recentBooks.length > 0 ? (
            <div className="recent-books">
              {recentBooks.map(book => (
                <div key={book.id} className="recent-book-card">
                  <div className="recent-book-info">
                    <h4>{book.title}</h4>
                    <p className="book-meta">{book.author}</p>
                    <p className="book-status">
                      <span className={`status-badge ${book.status}`}>
                        {book.status === 'reading' ? 'O\'qilmoqda' : 
                         book.status === 'completed' ? 'Tugatilgan' : 
                         'Rejalashtirilgan'}
                      </span>
                    </p>
                  </div>
                  <div className="recent-book-action">
                    <Link 
                      to={`/reading/${book.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      {book.status === 'completed' ? 'Ko\'rish' : 'O\'qish'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-section">
              <p>Hali kitob qo'shmagansiz. Birinchi kitobingizni qo'shing!</p>
            </div>
          )}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <h3>Oylik Maqsad Progressi</h3>
          <span className="progress-percentage">{getGoalProgress()}%</span>
        </div>
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large" 
            style={{ width: `${getGoalProgress()}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>0</span>
          <span>
            {stats.completedBooks} / {user.readingGoal || 10} kitob
          </span>
          <span>{user.readingGoal || 10}</span>
        </div>
      </div>

      <div className="quick-actions">
        <h3>
          <span>⚡</span>
          Tezkor harakatlar
        </h3>
        <div className="actions-grid">
          <Link to="/books" className="action-card">
            <div className="action-icon">📖</div>
            <div className="action-content">
              <h4>Kitoblarim</h4>
              <p>Barcha kitoblaringizni ko'ring va boshqaring</p>
            </div>
          </Link>
          
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h4>Profilim</h4>
              <p>Shaxsiy ma'lumotlaringizni tahrirlang</p>
            </div>
          </Link>
          
          <div className="action-card" onClick={() => setShowBookForm(true)}>
            <div className="action-icon">➕</div>
            <div className="action-content">
              <h4>Kitob qo'shish</h4>
              <p>Yangi kitobni ro'yxatingizga qo'shing</p>
            </div>
          </div>
          
          {readingBooks.length > 0 && (
            <Link 
              to={`/reading/${readingBooks[0]?.id}`} 
              className="action-card"
            >
              <div className="action-icon">⏯️</div>
              <div className="action-content">
                <h4>O'qishni davom ettirish</h4>
                <p>So'nggi kitobingizni o'qish</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {showBookForm && (
        <BookForm
          onClose={() => setShowBookForm(false)}
          onSuccess={() => {
            setShowBookForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;