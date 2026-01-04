// src/utils/readingTimeCalculator.js
export const calculateTotalReadingTime = () => {
  let totalSeconds = 0;
  
  try {
    // 1. Check user's saved reading time
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.totalReadingTime && user.totalReadingTime > 0) {
      totalSeconds = user.totalReadingTime;
    } else {
      // 2. Calculate from all sessions
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      
      books.forEach(book => {
        const sessions = JSON.parse(localStorage.getItem(`sessions_${book.id}`) || '[]');
        sessions.forEach(session => {
          totalSeconds += session.duration || 0;
        });
      });
      
      // 3. If no sessions, calculate from pages (fallback)
      if (totalSeconds === 0) {
        const totalPages = books.reduce((sum, book) => sum + (book.currentPage || 0), 0);
        // Average reading speed: 2 minutes per page (30 pages/hour)
        totalSeconds = totalPages * 120; // 2 minutes * 60 seconds
      }
      
      // Save calculated time to user
      if (user) {
        const updatedUser = { ...user, totalReadingTime: totalSeconds };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
    
    return totalSeconds;
  } catch (error) {
    console.error('Error calculating reading time:', error);
    return 0;
  }
};

export const formatReadingTime = (seconds) => {
  if (!seconds) return '0 daqiqa';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} soat ${minutes} daqiqa`;
  }
  return `${minutes} daqiqa`;
};

export const getReadingSpeed = (pages, seconds) => {
  if (!seconds || seconds === 0) return 0;
  const hours = seconds / 3600;
  return Math.round(pages / hours);
};