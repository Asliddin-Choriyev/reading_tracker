// Mock API service for demonstration
// In a real app, replace with actual API calls

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      await delay(1000);
      
      if (!email || !password) {
        throw new Error('Email va parol kiritilishi shart');
      }
      
      return {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email,
          name: email.split('@')[0],
          readingGoal: 10,
          totalBooksRead: 5,
          totalReadingTime: 12500,
          joinedDate: new Date().toISOString()
        }
      };
    },
    
    register: async (userData) => {
      await delay(1000);
      
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Barcha maydonlarni to\'ldiring');
      }
      
      return {
        token: 'mock-jwt-token',
        user: {
          id: Date.now(),
          ...userData,
          totalBooksRead: 0,
          totalReadingTime: 0,
          joinedDate: new Date().toISOString()
        }
      };
    },
    
    logout: () => {
      return Promise.resolve();
    },
    
    updateProfile: async (profileData) => {
      await delay(500);
      return { success: true, user: profileData };
    }
  },
  
  // Books endpoints
  books: {
    getAll: async () => {
      await delay(500);
      const books = localStorage.getItem('books');
      return books ? JSON.parse(books) : [];
    },
    
    create: async (bookData) => {
      await delay(500);
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const newBook = {
        id: Date.now(),
        ...bookData,
        addedDate: new Date().toISOString()
      };
      books.push(newBook);
      localStorage.setItem('books', JSON.stringify(books));
      return newBook;
    },
    
    update: async (bookId, updates) => {
      await delay(500);
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const index = books.findIndex(book => book.id === bookId);
      
      if (index !== -1) {
        books[index] = { ...books[index], ...updates };
        localStorage.setItem('books', JSON.stringify(books));
        return books[index];
      }
      
      throw new Error('Kitob topilmadi');
    },
    
    delete: async (bookId) => {
      await delay(500);
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const filteredBooks = books.filter(book => book.id !== bookId);
      localStorage.setItem('books', JSON.stringify(filteredBooks));
      return { success: true };
    }
  },
  
  // Reading sessions
  sessions: {
    save: async (sessionData) => {
      await delay(500);
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      sessions.push({
        ...sessionData,
        id: Date.now(),
        date: new Date().toISOString()
      });
      localStorage.setItem('sessions', JSON.stringify(sessions));
      return { success: true };
    },
    
    getByBook: async (bookId) => {
      await delay(500);
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      return sessions.filter(session => session.bookId === bookId);
    }
  },
  
  // AI Quiz
  quiz: {
    generate: async (bookData) => {
      await delay(2000);
      
      return {
        id: `quiz_${Date.now()}`,
        bookId: bookData.id,
        bookTitle: bookData.title,
        generatedAt: new Date().toISOString(),
        questions: [
          {
            id: 1,
            question: "Kitobning asosiy mavzusi nima?",
            options: ["Sevgi", "Dostlik", "Muvaffaqiyat", "Sarguzasht"],
            correctAnswer: 0,
            explanation: "Kitobning asosiy mavzusi sevgi haqida."
          },
          // ... more questions
        ]
      };
    },
    
    submit: async (quizId, answers) => {
      await delay(1000);
      
      // Calculate score
      let correct = 0;
      const total = Object.keys(answers).length;
      
      // Mock calculation
      correct = Math.floor(total * 0.7); // 70% correct for demo
      
      const score = Math.round((correct / total) * 100);
      
      return {
        quizId,
        score,
        correct,
        total,
        submittedAt: new Date().toISOString()
      };
    }
  }
};

export default api;