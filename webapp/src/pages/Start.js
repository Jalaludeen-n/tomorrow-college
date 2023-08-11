import React, { useState, useEffect } from 'react';
import './../styles/page/Start.css'; // Import your CSS file for styling
import { useLocation } from 'react-router-dom';

const Start = () => {
  const [roomID, setRoomID] = useState('');
  const [showRoomID, setShowRoomID] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [numberOfPlayers, setNumberOfPlayers] = useState('');
  const [playersPerGroup, setPlayersPerGroup] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const gameId = location.state.id;

  useEffect(() => {
    if (showRoomID && secondsLeft > 0) {
      const countdownInterval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [showRoomID, secondsLeft]);

  const generateRoomID = () => {
    if ((numberOfPlayers%playersPerGroup) == 0) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let id = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
      }
      setRoomID(id);
      setShowRoomID(true);
      setSecondsLeft(5); // Reset the countdown timer
      setError('');
    } else {
      setError(`Unable to assign ${(numberOfPlayers/playersPerGroup).toFixed(1)} players per group, please adjust the value.`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomID);
    setShowRoomID(false); 
    alert('Room ID copied to clipboard');
  };

  useEffect(() => {
    if (showRoomID && secondsLeft === 0) {
      window.location.href = '/';
    }
  }, [showRoomID, secondsLeft]);

  return (
    <div className="room-generator">
      <h2>Create a Room</h2>
      <input
        type="number"
        placeholder="Number of players"
        value={numberOfPlayers}
        onChange={(e) => setNumberOfPlayers(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of players per group"
        value={playersPerGroup}
        onChange={(e) => setPlayersPerGroup(e.target.value)}
      />
      <button onClick={generateRoomID}>Generate Room ID</button>
      {error && <p className="error">{error}</p>}
      {showRoomID && (
        <div className="room-id">
          <p>Room ID: {roomID}</p>
          <button onClick={copyToClipboard}>Copy</button>
          <p>Redirecting in {secondsLeft} seconds...</p>
        </div>
      )}
    </div>
  );
};

export default Start;
