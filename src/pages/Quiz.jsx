import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizGenerator from '../components/AIQuiz/QuizGenerator';
import './Quiz.css';

const Quiz = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  if (!bookId) {
    return (
      <div className="quiz-page error">
        <h3>Kitob tanlanmagan</h3>
        <p>Test yaratish uchun kitobni tanlang.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/books')}
        >
          Kitoblar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-page-header">
        <button 
          className="btn btn-secondary back-btn"
          onClick={() => navigate(`/reading/${bookId}`)}
        >
          ← Ortga
        </button>
        
        <div className="header-title">
          <h1>AI Test</h1>
          <p className="subtitle">Kitobni tushunish darajangizni tekshiring</p>
        </div>
      </div>

      <QuizGenerator bookId={parseInt(bookId)} />
    </div>
  );
};

export default Quiz;