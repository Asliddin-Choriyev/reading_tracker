import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBook } from '../../contexts/BookContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { getReadingStats } = useBook();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    readingGoal: 10
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        readingGoal: user.readingGoal || 10
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readingGoal' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage('Profil muvaffaqiyatli yangilandi!');
        setEditMode(false);
      } else {
        setMessage('Profilni yangilashda xatolik yuz berdi');
      }
    } catch (err) {
      setMessage('Xatolik yuz berdi: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const stats = getReadingStats();
  
  // Mock achievements data
  const achievements = [
    { id: 1, title: 'Birinchi Kitob', description: 'Birinchi kitobni o\'qing', icon: '📚', unlocked: true },
    { id: 2, title: 'Kitob Sevargisi', description: '10 ta kitob o\'qing', icon: '📖', unlocked: stats.completedBooks >= 10 },
    { id: 3, title: 'O\'qish Maestro', description: '1000 sahifa o\'qing', icon: '👑', unlocked: stats.totalPagesRead >= 1000 },
    { id: 4, title: 'Vaqt Ulashuvchi', description: '10 soat o\'qish', icon: '⏱️', unlocked: false },
    { id: 5, title: 'Maqsadli', description: 'Oylik maqsadga erishish', icon: '🎯', unlocked: false },
    { id: 6, title: 'Seriyali O\'quvchi', description: '30 kun ketma-ket o\'qish', icon: '🔥', unlocked: false },
  ];

  if (!user) {
    return <LoadingSpinner text="Profil yuklanmoqda..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mening Profilim</h1>
        <button 
          className="edit-profile-btn"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? (
            <>
              <span>✖️</span>
              Bekor qilish
            </>
          ) : (
            <>
              <span>✏️</span>
              Profilni tahrirlash
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('muvaffaqiyatli') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        {editMode ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-header">
              <h3>Profilni Tahrirlash</h3>
              <p>Shaxsiy ma'lumotlaringizni yangilang</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ism</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="Ismingizni kiriting"
                  style={{ color:'black' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Oylik o'qish maqsadi (kitob)</label>
                <input
                  type="number"
                  name="readingGoal"
                  value={formData.readingGoal}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="form-control"
                  required
                  placeholder="Oylik maqsad"
                  style={{ color:'black' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={user.email}
                className="form-control"
                disabled
              />
              <span className="form-text">Emailni o'zgartirish mumkin emas</span>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
                disabled={loading}
              >
                Bekor qilish
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-container">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-name-display">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <div className="icon">📚</div>
                  <div className="meta-content">
                    <div className="meta-label">Oylik Maqsad</div>
                    <div className="meta-value">{user.readingGoal} ta kitob</div>
                  </div>
                </div>

                <div className="meta-item">
                  <div className="icon">📅</div>
                  <div className="meta-content">
                    <div className="meta-label">A'zo bo'lgan sana</div>
                    <div className="meta-value">
                      {new Date(user.joinedDate).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="meta-item">
                  <div className="icon">⏱️</div>
                  <div className="meta-content">
                    <div className="meta-label">O'qish vaqti</div>
                    <div className="meta-value">
                      {Math.floor((user.totalReadingTime || 0) / 3600)} soat
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-main">
              <div className="info-section">
                <h3>Shaxsiy Ma'lumotlar</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">👤 Ism</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📧 Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">🎯 Oylik Maqsad</span>
                    <span className="info-value">{user.readingGoal} ta kitob</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">📅 A'zolik</span>
                    <span className="info-value">
                      {new Date(user.joinedDate).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>O'qish Statistikasi</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-number">{stats.totalBooks}</div>
                    <div className="stat-label">Jami Kitoblar</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{stats.completedBooks}</div>
                    <div className="stat-label">Tugatilgan</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{stats.readingBooks}</div>
                    <div className="stat-label">O'qilayotgan</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{stats.completionRate}%</div>
                    <div className="stat-label">Tugatish Darajasi</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">{stats.totalPagesRead}</div>
                    <div className="stat-label">Sahifalar</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">
                      {stats.totalBooks > 0 ? Math.round(stats.totalPagesRead / stats.totalBooks) : 0}
                    </div>
                    <div className="stat-label">O'rtacha Sahifa</div>
                  </div>
                </div>
              </div>

              <div className="achievements-section">
                <h3>Yutuqlar</h3>
                <div className="achievements-grid">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`achievement-card ${achievement.unlocked ? '' : 'locked'}`}
                      title={achievement.description}
                    >
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div className="achievement-title">{achievement.title}</div>
                      <div className="achievement-description">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;