// App constants

export const APP_NAME = 'Reading Tracker';

export const BOOK_STATUS = {
  TO_READ: 'to_read',
  READING: 'reading',
  COMPLETED: 'completed'
};

export const BOOK_GENRES = [
  { value: 'fantasy', label: 'Fantastika' },
  { value: 'science', label: 'Ilmiy' },
  { value: 'biography', label: 'Biografiya' },
  { value: 'history', label: 'Tarix' },
  { value: 'fiction', label: 'Badiiy' },
  { value: 'self_help', label: "O'ziyordam" },
  { value: 'classic', label: 'Klassika' },
  { value: 'mystery', label: 'Sir' },
  { value: 'romance', label: 'Romantika' },
  { value: 'science_fiction', label: 'Ilmiy fantastika' },
  { value: 'horror', label: 'Qo\'rqinchli' },
  { value: 'poetry', label: 'She\'riyat' },
  { value: 'drama', label: 'Drama' },
  { value: 'comedy', label: 'Komediya' }
];

export const READING_GOALS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

export const QUIZ_SCORE_LEVELS = {
  EXCELLENT: { min: 90, label: "A'lo", color: '#10b981' },
  GOOD: { min: 70, label: 'Yaxshi', color: '#3b82f6' },
  AVERAGE: { min: 50, label: 'O\'rtacha', color: '#f59e0b' },
  POOR: { min: 0, label: 'Qoniqarsiz', color: '#ef4444' }
};

export const DEFAULT_READING_SPEED = 40; // pages per hour