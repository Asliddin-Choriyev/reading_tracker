import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBook } from '../../contexts/BookContext';
import BookCard from './BookCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import './BookList.css';

const BookList = () => {
  const { books, loading } = useBook();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status) => {
    return books.filter(book => book.status === status).length;
  };

  if (loading) {
    return <LoadingSpinner text="Kitoblar yuklanmoqda..." />;
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Kitob nomi yoki muallifini qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Barcha ({books.length})
            </button>
            <button
              className={`filter-btn ${filter === 'reading' ? 'active' : ''}`}
              onClick={() => setFilter('reading')}
            >
              O'qilayotgan ({getStatusCount('reading')})
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Tugatilgan ({getStatusCount('completed')})
            </button>
            <button
              className={`filter-btn ${filter === 'to_read' ? 'active' : ''}`}
              onClick={() => setFilter('to_read')}
            >
              Rejalashtirilgan ({getStatusCount('to_read')})
            </button>
          </div>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Kitob topilmadi</h3>
          <p>Qidiruvga mos keladigan kitob yo'q yoki hali kitob qo'shmagansiz</p>
          <Link to="/books?add=true" className="btn btn-primary">
            Birinchi kitobni qo'shing
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;