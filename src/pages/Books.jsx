import React, { useState } from 'react';
import BookList from '../components/Books/BookList';
import BookForm from '../components/Books/BookForm';
import './Books.css';

const Books = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleCloseForm = () => {
    setShowBookForm(false);
    setEditingBook(null);
  };

  const handleSuccess = () => {
    setShowBookForm(false);
    setEditingBook(null);
  };

  return (
    <div className="books-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Kitoblarim</h1>
          <p className="page-description">
            Barcha kitoblaringizni boshqaring, o'qing va progressni kuzating
          </p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowBookForm(true)}
        >
          + Yangi kitob
        </button>
      </div>

      <BookList onEditBook={handleEditBook} />

      {showBookForm && (
        <BookForm
          bookToEdit={editingBook}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Books;