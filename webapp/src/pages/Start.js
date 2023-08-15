import React, { useState, useEffect } from "react";
import "./../styles/page/Start.css"; // Import your CSS file for styling
import { useLocation } from "react-router-dom";
import { startGame } from "../components/services/airtable";

const Start = () => {
  const [roomID, setRoomID] = useState("");
  const [showRoomID, setShowRoomID] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [playersPerGroup, setPlayersPerGroup] = useState(0);
  const [error, setError] = useState("");
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
  const generateRoomID = async () => {
    setShowRoomID(true);
    const data = formatDataForAirtable();
    await startGame(data);
    setSecondsLeft(5); // Reset the countdown timer
    setError("");
  };

  const formatDataForAirtable = (levels) => {
    const formData = new FormData();

    formData.append(
      `data`,
      JSON.stringify({
        gameId: gameId,
        roomNumber: roomID,
        numberOfPlayers: numberOfPlayers,
        numbersOfGroups: (numberOfPlayers / playersPerGroup).toFixed(1),
        playersPerGroup: playersPerGroup,
      }),
    );
    return formData;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomID);
    setShowRoomID(false);
    alert("Room ID copied to clipboard");
  };
  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    if (roomID == "") {
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
      }
      setRoomID(id);
    }

    if (showRoomID && secondsLeft === 0) {
      window.location.href = "/";
    }
  }, [showRoomID, secondsLeft]);
  return (
    <div className='room-generator'>
      <h2>Create a Room</h2>
      <input
        type='number'
        placeholder='Number of players'
        value={numberOfPlayers}
        onChange={(e) => setNumberOfPlayers(e.target.value)}
      />
      <input
        type='number'
        placeholder='Number of players per group'
        value={playersPerGroup}
        onChange={(e) => setPlayersPerGroup(e.target.value)}
      />
      <button onClick={generateRoomID}>Generate Room ID</button>
      {error && <p className='error'>{error}</p>}
      {showRoomID && (
        <div className='room-id'>
          <p>Room ID: {roomID}</p>
          <button onClick={copyToClipboard}>Copy</button>
          <p>Redirecting in {secondsLeft} seconds...</p>
        </div>
      )}
    </div>
  );
};
export default Start;
