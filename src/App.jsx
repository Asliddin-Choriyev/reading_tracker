/* eslint-disable react-hooks/set-state-in-effect */
// src/App.jsx - loading qismini yangilash
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookProvider } from './contexts/BookContext';
import Navbar from './components/Common/Navbar';
import LoadingScreen from './components/Common/LoadingScreen'; // Yangi loading komponent
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Auth/Profile';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import ReadingSession from './pages/ReadingSession';
import Quiz from './pages/Quiz';
import './App.css';
import Footer from './components/Common/Footer';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <AuthProvider>
        <BookProvider>
          <div className="App">
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <div className="container">
              <Routes>
                <Route path="/" element={
                  isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                } />
                
                <Route path="/login" element={
                  <Login setIsAuthenticated={setIsAuthenticated} />
                } />
                
                <Route path="/register" element={
                  <Register setIsAuthenticated={setIsAuthenticated} />
                } />
                
                <Route path="/dashboard" element={
                  isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                } />
                
                <Route path="/books" element={
                  isAuthenticated ? <Books /> : <Navigate to="/login" />
                } />
                
                <Route path="/reading/:bookId" element={
                  isAuthenticated ? <ReadingSession /> : <Navigate to="/login" />
                } />
                
                <Route path="/quiz/:bookId" element={
                  isAuthenticated ? <Quiz /> : <Navigate to="/login" />
                } />
                
                <Route path="/profile" element={
                  isAuthenticated ? <Profile /> : <Navigate to="/login" />
                } />
                
                <Route path="*" element={
                  <Navigate to="/" />
                } />
              </Routes>
            </div>
             <Footer />
          </div>
        </BookProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;