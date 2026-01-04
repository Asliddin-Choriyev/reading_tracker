/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { createContext, useState, useContext, useEffect } from 'react';

const BookContext = createContext();

export const useBook = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (error) {
        console.error('Error parsing books data:', error);
      }
    } else {
      // Mock data for initial use
      const mockBooks = [];
      setBooks(mockBooks);
      localStorage.setItem('books', JSON.stringify(mockBooks));
    }
    setLoading(false);
  }, []);

  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      progress: Math.round((bookData.currentPage / bookData.totalPages) * 100),
      addedDate: new Date().toISOString()
    };
    
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    
    return newBook;
  };

  const updateBook = (bookId, updates) => {
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        const updatedBook = { ...book, ...updates };
        if (updates.currentPage !== undefined && updates.totalPages !== undefined) {
          updatedBook.progress = Math.round((updates.currentPage / updates.totalPages) * 100);
        }
        return updatedBook;
      }
      return book;
    });
    
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const deleteBook = (bookId) => {
    const filteredBooks = books.filter(book => book.id !== bookId);
    setBooks(filteredBooks);
    localStorage.setItem('books', JSON.stringify(filteredBooks));
  };

  const getBookById = (bookId) => {
    return books.find(book => book.id === parseInt(bookId));
  };

  const getReadingStats = () => {
    const totalBooks = books.length;
    const completedBooks = books.filter(book => book.status === 'completed').length;
    const totalPagesRead = books.reduce((sum, book) => sum + book.currentPage, 0);
    const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0);
    
    return {
      totalBooks,
      completedBooks,
      readingBooks: books.filter(book => book.status === 'reading').length,
      totalPagesRead,
      totalPages,
      completionRate: totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0
    };
  };

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getReadingStats
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};