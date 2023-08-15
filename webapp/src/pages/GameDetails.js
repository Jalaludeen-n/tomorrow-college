import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/page/GameDetails.scss"; // Import your CSS file for styling

const GameDetails = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [gameDetails, setGameDetails] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const roles = ["CEO", "HR", "Developer", "Designer"]; // Replace with your actual roles

  // Placeholder user data
  const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
  ];

  useEffect(() => {
    fetchGameDetails();
    console.log("ds");
    console.log(pdfData);
  }, [pdfData]);
  const fetchGameDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/get-game-details",
        {
          responseType: "json",
        },
      );
      setGameDetails(response.data.gameDetails);
      setPdfData(response.data.base64Pdf);
      console.log(response);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  };

  return (
    <div className='game-details-page'>
      <div className='left-side'>
        <div className='welcome-text'>
          <h1>Welcome to the Game!</h1>
        </div>
        <div className='role-selection'>
          <h2>Your Role:</h2>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}>
            <option value=''>Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className='user-list'>
          <h2>Players:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
        <div className='game-info'>
          <h2>Game Information:</h2>
          <p>Total Rounds: 5</p>
          <p>Group Name: Group A</p>
        </div>
      </div>
      <div className='right-side'>
        <div className='pdf-container'>
          {pdfData && (
            <iframe
              src={`data:application/pdf;base64,${pdfData}`}
              title='PDF'
              style={{
                width: "100%",
                height: "100vh",
                border: "none",
                // zoom: "100%",
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            window.location.href = "/level";
          }}>
          start
        </button>
      </div>
    </div>
  );
};

export default GameDetails;
