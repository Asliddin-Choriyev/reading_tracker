/* eslint-disable react-hooks/exhaustive-deps */
 
import React, { useState, useEffect } from 'react';
import './SessionHistory.css';

const SessionHistory = ({ bookId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [bookId]);

  const loadSessions = () => {
    const savedSessions = localStorage.getItem(`sessions_${bookId}`);
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Sort by date, newest first
        parsedSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSessions(parsedSessions);
      } catch (error) {
        console.error('Error parsing sessions:', error);
        setSessions([]);
      }
    }
    setLoading(false);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} soat ${minutes} daqiqa`;
    }
    return `${minutes} daqiqa`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateStats = () => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        totalPages: 0,
        avgPagesPerSession: 0,
        avgTimePerSession: 0
      };
    }

    const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
    const totalPages = sessions.reduce((sum, session) => sum + session.pagesRead, 0);

    return {
      totalSessions: sessions.length,
      totalTime,
      totalPages,
      avgPagesPerSession: Math.round(totalPages / sessions.length),
      avgTimePerSession: Math.round(totalTime / sessions.length)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="session-history loading">
        <div className="spinner"></div>
        <p>Sessiya tarixi yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="session-history">
      <div className="history-header">
        <h3>O'qish Sessiyalari Tarixi</h3>
        <span className="session-count">{sessions.length} ta sessiya</span>
      </div>

      {sessions.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">📖</div>
          <h4>Hali sessiya mavjud emas</h4>
          <p>Kitobni o'qishni boshlang va sessiyalar bu yerda saqlanadi</p>
        </div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="stat-item">
              <div className="stat-value">{stats.totalSessions}</div>
              <div className="stat-label">Jami sessiyalar</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{formatDuration(stats.totalTime)}</div>
              <div className="stat-label">Jami vaqt</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.totalPages}</div>
              <div className="stat-label">Jami sahifalar</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.avgPagesPerSession}</div>
              <div className="stat-label">O'rtacha sahifa/sessiya</div>
            </div>
          </div>

          <div className="sessions-list">
            {sessions.map((session, index) => (
              <div key={index} className="session-card">
                <div className="session-date">
                  <div className="date-icon">📅</div>
                  <div className="date-info">
                    <div className="date">{formatDate(session.date)}</div>
                    <div className="duration">
                      ⏱️ {formatDuration(session.duration)}
                    </div>
                  </div>
                </div>
                
                <div className="session-details">
                  <div className="detail-item">
                    <span className="detail-label">O'qilgan sahifalar:</span>
                    <span className="detail-value">{session.pagesRead} sahifa</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">O'rtacha tezlik:</span>
                    <span className="detail-value">
                      {session.duration > 0 
                        ? Math.round((session.pagesRead / (session.duration / 3600))) 
                        : 0} sahifa/soat
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SessionHistory;