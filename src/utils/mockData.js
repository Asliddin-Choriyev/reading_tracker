// src/utils/mockData.js
export const initializeMockData = () => {
  if (!localStorage.getItem('books')) {
    const mockBooks = [
      {
        id: 1,
        title: "Sariq devni minib",
        author: "Xudoyberdi To'xtaboyev",
        totalPages: 250,
        currentPage: 120,
        genre: "fantasy",
        status: "reading",
        progress: 48,
        addedDate: new Date().toISOString(),
        description: "Sarguzashtli va qiziqarli kitob"
      },
      {
        id: 2,
        title: "Dunyoning ishlari",
        author: "O'tkir Hoshimov",
        totalPages: 400,
        currentPage: 400,
        genre: "fiction",
        status: "completed",
        progress: 100,
        addedDate: new Date().toISOString(),
        description: "Hayotiy kitob"
      },
      {
        id: 3,
        title: "Atom odatlari",
        author: "James Clear",
        totalPages: 320,
        currentPage: 150,
        genre: "self_help",
        status: "reading",
        progress: 47,
        addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 kun oldin
        description: "Odatiylik haqida kitob"
      }
    ];
    localStorage.setItem('books', JSON.stringify(mockBooks));
  }
  
  if (!localStorage.getItem('user')) {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      name: "Test Foydalanuvchi",
      readingGoal: 5,
      totalBooksRead: 1,
      totalReadingTime: 7200, // 2 soat
      joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 kun oldin
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
  }
  
  // Mock sessions for testing
  if (!localStorage.getItem('sessions_1')) {
    const mockSessions = [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 1800, // 30 daqiqa
        pagesRead: 25,
        bookId: 1
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 2700, // 45 daqiqa
        pagesRead: 40,
        bookId: 1
      }
    ];
    localStorage.setItem('sessions_1', JSON.stringify(mockSessions));
  }
};

// App.jsx da useEffect ichida chaqiring
useEffect(() => {
  initializeMockData();
  // ... existing code
}, []);