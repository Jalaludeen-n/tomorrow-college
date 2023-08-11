import React from 'react';
import { Link } from 'react-router-dom';
import './../styles/page/main.css';

const Main = () => {
  return (
    <div className="app-container">
    <div className="top-section">
      <div className="welcome-message">
        Welcome to Game Dashboard!
      </div>
      <div className="top-buttons">
        <Link to="/create" className='top-button'>Create Game</Link>
        <Link to="/list" className='top-button'>Start Game</Link>
      </div>
    </div>
    <div className="bottom-section">
      <div className="left-section">
        
      <h2 className="title">Running Games</h2>
      </div>
      <div className="right-section">
      <h2 className="title">Past Games</h2>
      </div>
    </div>
  </div>
  );
};

export default Main;