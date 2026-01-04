// Utility functions

// Format time in seconds to HH:MM:SS
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format time to readable string
export const formatTimeReadable = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} soat ${minutes} daqiqa`;
  }
  return `${minutes} daqiqa`;
};

// Calculate reading progress percentage
export const calculateProgress = (currentPage, totalPages) => {
  if (!totalPages || totalPages === 0) return 0;
  const progress = (currentPage / totalPages) * 100;
  return Math.min(Math.round(progress), 100);
};

// Format date
export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('uz-UZ', { ...defaultOptions, ...options });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate reading speed (pages per hour)
export const calculateReadingSpeed = (pages, seconds) => {
  if (!seconds || seconds === 0) return 0;
  const hours = seconds / 3600;
  return Math.round(pages / hours);
};

// Get status text
export const getStatusText = (status) => {
  const statusMap = {
    reading: "O'qilmoqda",
    completed: 'Tugatilgan',
    to_read: 'Rejalashtirilgan'
  };
  return statusMap[status] || status;
};

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    reading: '#f59e0b',
    completed: '#10b981',
    to_read: '#6b7280'
  };
  return colorMap[status] || '#6b7280';
};