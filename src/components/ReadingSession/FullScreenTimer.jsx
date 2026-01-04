// src/components/ReadingSession/FullScreenTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useBook } from '../../contexts/BookContext';
import './FullScreenTimer.css';

const FullScreenTimer = ({ bookId, onExit }) => {
  const { getBookById } = useBook();
  const book = getBookById(bookId);
  
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [goalTime, setGoalTime] = useState(25 * 60); // 25 minut default
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const timerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const motivationalQuotes = [
    "Har bir sahifa sizni yanada dono qiladi.",
    "O'qish - bu aqlning oziq-ovqati.",
    "Katta maqsadlar kichik qadamlar bilan boshlanadi.",
    "Bugun o'qiganingiz ertaga sizni farqlaydi.",
    "Kitoblar - bu vaqt mashinasi.",
    "Har bir kitob yangi dunyoni ochib beradi.",
    "O'qish orqali biz bir umrda bir necha hayot kechiramiz.",
    "Kitob - eng yaxshi do'st.",
    "Ma'lumot - bu kuch.",
    "Muvaffaqiyat o'qish bilan boshlanadi.",
    "Har bir daqiqa o'qish - kelajakka sarmoya.",
    "Kitoblar sizning eng sodiq maslahatchilaringiz.",
    "O'qish - ruhni parvarish qilish.",
    "Har bir kitob yangi imkoniyat.",
    "Aqlli odam har kuni yangi narsa o'rganadi."
  ];

  useEffect(() => {
    // Hide controls after 3 seconds
    if (isRunning) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    // Set random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotivationalQuote(randomQuote);

    // Load saved time
    const savedTimer = localStorage.getItem(`timer_${bookId}`);
    if (savedTimer) {
      try {
        const data = JSON.parse(savedTimer);
        setTime(data.time || 0);
      } catch (error) {
        console.error('Error loading timer:', error);
      }
    }
  }, [bookId]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save timer state
    const timerData = {
      time,
      isRunning,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(`timer_${bookId}`, JSON.stringify(timerData));

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, time, bookId]);

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isRunning) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return Math.min(Math.round((time / goalTime) * 100), 100);
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const setQuickGoal = (minutes) => {
    setGoalTime(minutes * 60);
    setShowGoalModal(false);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    setShowGoalModal(false);
  };

  const progressPercentage = getProgressPercentage();
  const remainingTime = goalTime - time;

  if (!book) {
    return (
      <div className="fullscreen-error">
        <h2>Kitob topilmadi</h2>
        <button className="exit-btn" onClick={onExit}>
          Chiqish
        </button>
      </div>
    );
  }

  return (
    <div className="fullscreen-container" onMouseMove={handleMouseMove}>
      {/* Background */}
      <div className="concentration-background"></div>
      
      {/* Main content */}
      <div className="fullscreen-content">
        {/* Header */}
        <div className={`fullscreen-header ${showControls ? 'visible' : 'hidden'}`}>
          <div className="book-info">
            <h2>{book.title}</h2>
            <p className="book-author">{book.author}</p>
          </div>
          <button className="exit-btn" onClick={onExit}>
            ✕ Chiqish
          </button>
        </div>

        {/* Timer display */}
        <div className="timer-display-wrapper">
          <div className="progress-circle">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {/* Background circle */}
              <circle
                cx="150"
                cy="150"
                r="130"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="150"
                cy="150"
                r="130"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 130}`}
                strokeDashoffset={`${2 * Math.PI * 130 * (1 - progressPercentage / 100)}`}
                transform="rotate(-90 150 150)"
              />
            </svg>
            <div className="timer-text">
              <div className="current-time">{formatTime(time)}</div>
              <div className="time-label">O'qish vaqti</div>
              {goalTime > 0 && (
                <div className="goal-time">
                  Maqsad: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')} qoldi
                </div>
              )}
            </div>
          </div>

          {/* Motivational quote */}
          <div className="motivational-quote">
            " {motivationalQuote} "
          </div>
        </div>

        {/* Controls */}
        <div className={`fullscreen-controls ${showControls ? 'visible' : 'hidden'}`}>
          <div className="control-buttons">
            {!isRunning ? (
              <button className="control-btn start-btn" onClick={startTimer}>
                <span className="btn-icon">▶️</span>
                <span className="btn-text">Boshlash</span>
              </button>
            ) : (
              <button className="control-btn pause-btn" onClick={pauseTimer}>
                <span className="btn-icon">⏸️</span>
                <span className="btn-text">Pauza</span>
              </button>
            )}
            
            <button className="control-btn reset-btn" onClick={resetTimer}>
              <span className="btn-icon">🔄</span>
              <span className="btn-text">Qayta</span>
            </button>
            
            <button 
              className="control-btn goal-btn" 
              onClick={() => setShowGoalModal(true)}
            >
              <span className="btn-icon">🎯</span>
              <span className="btn-text">Maqsad</span>
            </button>
            
            <button className="control-btn quick-goal-btn" onClick={() => setQuickGoal(25)}>
              <span className="btn-icon">🍅</span>
              <span className="btn-text">25 min</span>
            </button>
          </div>

          <div className="quick-goals">
            <button onClick={() => setQuickGoal(15)}>15 min</button>
            <button onClick={() => setQuickGoal(30)}>30 min</button>
            <button onClick={() => setQuickGoal(45)}>45 min</button>
            <button onClick={() => setQuickGoal(60)}>60 min</button>
          </div>
        </div>

        {/* Stats */}
        <div className={`fullscreen-stats ${showControls ? 'visible' : 'hidden'}`}>
          <div className="stat-item">
            <div className="stat-value">{book.currentPage}</div>
            <div className="stat-label">Sahifa</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{book.progress}%</div>
            <div className="stat-label">Progress</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {time > 0 ? Math.round((book.currentPage / time) * 3600) : 0}
            </div>
            <div className="stat-label">Sahifa/soat</div>
          </div>
        </div>
      </div>

      {/* Goal setting modal */}
      {showGoalModal && (
        <div className="goal-modal">
          <div className="goal-modal-content">
            <h3>O'qish Maqsadini Belgilang</h3>
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <label>Vaqt (daqiqa)</label>
                <input
                  type="number"
                  value={Math.floor(goalTime / 60)}
                  onChange={(e) => setGoalTime(parseInt(e.target.value) * 60 || 0)}
                  min="1"
                  max="240"
                  className="form-control"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn secondary-btn"
                  onClick={() => setShowGoalModal(false)}
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="btn primary-btn"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="progress-bar-bottom">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Instruction hint */}
      {!showControls && isRunning && (
        <div className="instruction-hint">
          Sichqonchani siljitish yoki tugmani bosish orqali boshqaruvlarni ko'rsatish
        </div>
      )}
    </div>
  );
};

export default FullScreenTimer;