/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser = {
            id: 1,
            email,
            name: email.split('@')[0],
            readingGoal: 10,
            totalBooksRead: 0,
            totalReadingTime: 0,
            joinedDate: new Date().toISOString()
          };
          
          localStorage.setItem('token', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          resolve({ success: true, user: mockUser });
        } else {
          reject(new Error('Email va parol kiritilishi shart'));
        }
      }, 1000);
    });
  };
  // AuthContext.jsx ga qo'shimcha funksiyalar
const calculateReadingTime = (totalPages) => {
  // Average reading speed: 40 pages per hour
  return Math.floor((totalPages / 40) * 3600);
};

const updateUserStats = (newPages) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = {
    ...user,
    totalReadingTime: (user.totalReadingTime || 0) + calculateReadingTime(newPages),
    lastActive: new Date().toISOString()
  };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  setUser(updatedUser);
};
  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          const mockUser = {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            readingGoal: userData.readingGoal || 10,
            totalBooksRead: 0,
            totalReadingTime: 0,
            joinedDate: new Date().toISOString()
          };
          
          localStorage.setItem('token', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          
          resolve({ success: true, user: mockUser });
        } else {
          reject(new Error('Barcha maydonlarni to\'ldiring'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

 // AuthContext.jsx - updateProfile funksiyasiga qo'shing
const updateProfile = async (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...profileData };
      
      // Calculate total reading time from all sessions if not already set
      if (!updatedUser.totalReadingTime || updatedUser.totalReadingTime === 0) {
        let totalSeconds = 0;
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        
        books.forEach(book => {
          const sessions = JSON.parse(localStorage.getItem(`sessions_${book.id}`) || '[]');
          sessions.forEach(session => {
            totalSeconds += session.duration || 0;
          });
        });
        
        updatedUser.totalReadingTime = totalSeconds;
      }
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      resolve({ success: true, user: updatedUser });
    }, 500);
  });
};

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
