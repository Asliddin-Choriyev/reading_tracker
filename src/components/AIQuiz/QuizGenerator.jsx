import React, { useState, useEffect } from 'react';
import { useBook } from '../../contexts/BookContext';
import { useNavigate } from 'react-router-dom';
import './QuizGenerator.css';

const QuizGenerator = ({ bookId }) => {
  const { getBookById } = useBook();
  const navigate = useNavigate();
  const book = getBookById(bookId);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load existing quiz if available
    const savedQuiz = localStorage.getItem(`quiz_${bookId}`);
    const savedResults = localStorage.getItem(`quiz_results_${bookId}`);
    
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz));
    }
    
    if (savedResults) {
      const results = JSON.parse(savedResults);
      setSubmitted(true);
      setScore(results.score);
      setUserAnswers(results.answers);
    }
  }, [bookId]);

  const generateQuiz = () => {
    setLoading(true);
    
    // Simulate AI quiz generation
    setTimeout(() => {
      const mockQuiz = {
        id: `quiz_${Date.now()}`,
        bookId: parseInt(bookId),
        bookTitle: book?.title || 'Noma\'lum kitob',
        generatedAt: new Date().toISOString(),
        questions: [
          {
            id: 1,
            question: "Kitobning asosiy g'oyasi nimadan iborat?",
            options: [
              "Hayotiy qiyinchiliklarni engib o'tish",
              "Sevgi va sadoqat haqida",
              "Muvaffaqiyat sirlari",
              "Texnologiyaning ta'siri"
            ],
            correctAnswer: 0,
            explanation: "Kitobning asosiy mavzusi - hayotiy to'siqlarni engib o'tish va shaxsiy o'sishdir."
          },
          {
            id: 2,
            question: "Asosiy qahramonning eng katta kamchiligi nima edi?",
            options: [
              "O'ziga bo'lgan ishonchsizlik",
              "Boshqalarga bo'lgan ishonchsizlik",
              "O'zini yuqori baholash",
              "Tez xafa bo'lish"
            ],
            correctAnswer: 1,
            explanation: "Qahramonning asosiy kamchiligi boshqalarga ishonmaslik edi."
          },
          {
            id: 3,
            question: "Kitob qaysi davrga tegishli voqealarni o'z ichiga oladi?",
            options: [
              "Zamonaviy davr",
              "O'tmishdagi voqealar",
              "Kelajak tasviri",
              "Afsonaviy davr"
            ],
            correctAnswer: 0,
            explanation: "Kitob zamonaviy hayotdagi voqealarni o'z ichiga oladi."
          },
          {
            id: 4,
            question: "Kitobdan olingan asosiy saboq nima?",
            options: [
              "Do'stlikning ahamiyati",
              "Muvaffaqiyat uchun kurash",
              "Ishonch va sadoqat",
              "Hamma javoblar to'g'ri"
            ],
            correctAnswer: 3,
            explanation: "Kitobda ko'plab muhim saboqlar mavjud."
          },
          {
            id: 5,
            question: "Kitobning oxiri qanday ta'sir qoldirdi?",
            options: [
              "Ochig'ini qoldirdi",
              "Baxtli yakun bilan tugadi",
              "Tushunarli yakun bilan tugadi",
              "Qayta o'ylashga undadi"
            ],
            correctAnswer: 3,
            explanation: "Kitob o'quvchini o'ylashga undaydigan yakunga ega."
          }
        ]
      };
      
      setQuiz(mockQuiz);
      localStorage.setItem(`quiz_${bookId}`, JSON.stringify(mockQuiz));
      setLoading(false);
    }, 2000);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = () => {
    if (!quiz) return;
    
    let correctCount = 0;
    quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    
    // Save results
    const results = {
      score: calculatedScore,
      answers: userAnswers,
      submittedAt: new Date().toISOString(),
      bookId: parseInt(bookId)
    };
    
    localStorage.setItem(`quiz_results_${bookId}`, JSON.stringify(results));
    
    // Update book if score is good
    if (calculatedScore >= 70) {
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const updatedBooks = books.map(b => {
        if (b.id === parseInt(bookId)) {
          return {
            ...b,
            quizCompleted: true,
            quizScore: calculatedScore,
            lastQuizDate: new Date().toISOString()
          };
        }
        return b;
      });
      localStorage.setItem('books', JSON.stringify(updatedBooks));
    }
  };

  const resetQuiz = () => {
    setSubmitted(false);
    setUserAnswers({});
    setScore(0);
    localStorage.removeItem(`quiz_results_${bookId}`);
  };

  const getScoreLevel = (score) => {
    if (score >= 90) return { text: "A'lo", color: "#10b981", emoji: "🎉" };
    if (score >= 70) return { text: "Yaxshi", color: "#3b82f6", emoji: "👍" };
    if (score >= 50) return { text: "Qoniqarli", color: "#f59e0b", emoji: "😊" };
    return { text: "Qoniqarsiz", color: "#ef4444", emoji: "📚" };
  };

  if (!book) {
    return (
      <div className="quiz-container error">
        <h3>Kitob topilmadi</h3>
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

  if (loading) {
    return (
      <div className="quiz-container loading">
        <div className="spinner"></div>
        <h3>AI Test tayyorlanmoqda...</h3>
        <p>Kitob tahlili asosida test savollari yaratilmoqda</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>AI Test: {book.title}</h2>
        <p className="book-author">Muallif: {book.author}</p>
        <p className="quiz-description">
          Kitobni qanchalik yaxshi tushunganingizni tekshiring. 
          AI tomonidan yaratilgan test sizning tushunishingizni baholaydi.
        </p>
      </div>

      {!quiz ? (
        <div className="generate-section">
          <div className="info-card">
            <h3>Test yaratish</h3>
            <p>
              AI tizimi "{book.title}" kitobining mazmunini tahlil qilib, 
              5 ta test savolini yaratadi. Testni yakunlaganingizdan so'ng, 
              tushunish darajangiz baholanadi.
            </p>
            <ul className="features-list">
              <li>✅ 5 ta ko'p tanlovli savol</li>
              <li>✅ Har bir savol uchun tushuntirish</li>
              <li>✅ Tushunish darajasini baholash</li>
              <li>✅ Natijalarni saqlash</li>
            </ul>
          </div>
          
          <button className="btn btn-primary generate-btn" onClick={generateQuiz}>
            🎯 Test Yaratish
          </button>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="quiz-info">
            <span className="questions-count">{quiz.questions.length} ta savol</span>
            {submitted && (
              <button className="btn btn-secondary btn-sm" onClick={resetQuiz}>
                Qayta boshlash
              </button>
            )}
          </div>

          {quiz.questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Savol {index + 1}</span>
                {submitted && userAnswers[question.id] === question.correctAnswer && (
                  <span className="correct-badge">✅ To'g'ri</span>
                )}
                {submitted && userAnswers[question.id] !== question.correctAnswer && (
                  <span className="incorrect-badge">❌ Noto'g'ri</span>
                )}
              </div>
              
              <h4 className="question-text">{question.question}</h4>
              
              <div className="options-grid">
                {question.options.map((option, idx) => (
                  <div 
                    key={idx} 
                    className={`option ${
                      submitted 
                        ? idx === question.correctAnswer 
                          ? 'correct' 
                          : userAnswers[question.id] === idx 
                            ? 'incorrect' 
                            : ''
                        : userAnswers[question.id] === idx
                          ? 'selected'
                          : ''
                    }`}
                  >
                    <input
                      type="radio"
                      id={`q${question.id}_opt${idx}`}
                      name={`question_${question.id}`}
                      checked={userAnswers[question.id] === idx}
                      onChange={() => handleAnswerSelect(question.id, idx)}
                      disabled={submitted}
                    />
                    <label htmlFor={`q${question.id}_opt${idx}`} className="option-label">
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-text">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              {submitted && (
                <div className="explanation">
                  <strong>Tushuntirish:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}

          {!submitted ? (
            <div className="submit-section">
              <div className="progress-info">
                <span>
                  {Object.keys(userAnswers).length} / {quiz.questions.length} savolga javob berildi
                </span>
                <button 
                  className="btn btn-primary submit-btn"
                  onClick={submitQuiz}
                  disabled={Object.keys(userAnswers).length !== quiz.questions.length}
                >
                  Testni Yakunlash
                </button>
              </div>
            </div>
          ) : (
            <div className="results-section">
              <div className="score-card" style={{ borderColor: getScoreLevel(score).color }}>
                <div className="score-header">
                  <h3>Test natijalari</h3>
                  <span className="score-emoji">{getScoreLevel(score).emoji}</span>
                </div>
                
                <div className="score-display">
                  <div className="score-circle" style={{ 
                    background: `conic-gradient(${getScoreLevel(score).color} ${score}%, #e5e7eb ${score}%)`
                  }}>
                    <div className="score-inner">
                      <span className="score-value">{score}%</span>
                    </div>
                  </div>
                  
                  <div className="score-info">
                    <h4 style={{ color: getScoreLevel(score).color }}>
                      {getScoreLevel(score).text}
                    </h4>
                    <p className="score-message">
                      {score >= 80 
                        ? "Ajoyib! Kitobni juda yaxshi tushunganingiz aniq!" 
                        : score >= 60 
                        ? "Yaxshi! Asosiy g'oyalarni tushunganingiz ko'rinadi"
                        : score >= 40 
                        ? "Qoniqarli. Kitobni qayta o'qib chiqish foydali bo'lishi mumkin"
                        : "Kitobni qayta o'qib, diqqat bilan o'ylab ko'ring"}
                    </p>
                    
                    <div className="score-details">
                      <div className="detail-item">
                        <span className="detail-label">To'g'ri javoblar:</span>
                        <span className="detail-value">
                          {Object.values(userAnswers).filter((ans, idx) => 
                            ans === quiz.questions[idx].correctAnswer
                          ).length} / {quiz.questions.length}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Test sanasi:</span>
                        <span className="detail-value">
                          {new Date().toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="result-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowResults(!showResults)}
                  >
                    {showResults ? 'Natijalarni yashirish' : 'Batafsil natijalarni ko\'rish'}
                  </button>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={resetQuiz}
                  >
                    Qayta urinish
                  </button>
                </div>
              </div>
              
              {showResults && (
                <div className="detailed-results">
                  <h4>Batafsil natijalar:</h4>
                  <div className="results-grid">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="result-item">
                        <div className="result-question">
                          <strong>Savol {index + 1}:</strong> {question.question}
                        </div>
                        <div className="result-answer">
                          <span className={`answer-status ${
                            userAnswers[question.id] === question.correctAnswer 
                              ? 'correct' 
                              : 'incorrect'
                          }`}>
                            {userAnswers[question.id] === question.correctAnswer 
                              ? '✅ To\'g\'ri' 
                              : '❌ Noto\'g\'ri'}
                          </span>
                          <span className="correct-option">
                            To'g'ri javob: {String.fromCharCode(65 + question.correctAnswer)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;