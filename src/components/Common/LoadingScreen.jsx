import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-logo">
          <div className="logo-icon">📚</div>
          <h1 className="logo-text">Reading Tracker</h1>
        </div>
        
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
        
        <div className="loading-text">
          <p>Kitob o'qish sarguzashtingiz boshlanmoqda...</p>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;