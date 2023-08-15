import React, { useState } from "react";
import "./../styles/components/user/EnterGameForm.css";
import { joinGame } from "../components/services/airtable";

const EnterGameForm = () => {
  const [email, setEmail] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoomNumberChange = (event) => {
    setRoomNumber(event.target.value);
  };

  const handleGroupNumberChange = (event) => {
    setGroupNumber(event.target.value);
  };

  const handleSubmit = async () => {
    // Handle form submission, e.g. send data to server
    const data = formatDataForAirtable();
    await joinGame(data);
    console.log("Submitted:", email, roomNumber, groupNumber);
    window.location.href = "/details";
  };

  const formatDataForAirtable = (levels) => {
    const formData = new FormData();

    formData.append(
      `data`,
      JSON.stringify({
        roomNumber: roomNumber,
        Email: email,
        group: groupNumber,
      }),
    );
    return formData;
  };

  return (
    <div className='enter-game-form'>
      <h1>Enter the Game</h1>
      <div className='input-group'>
        <label>Email:</label>
        <input type='email' value={email} onChange={handleEmailChange} />
      </div>
      <div className='input-group'>
        <label>Room Number:</label>
        <input
          type='text'
          value={roomNumber}
          onChange={handleRoomNumberChange}
        />
      </div>
      <div className='input-group'>
        <label>Group Number:</label>
        <input
          type='number'
          value={groupNumber}
          onChange={handleGroupNumberChange}
        />
      </div>
      <button onClick={handleSubmit}>Enter the Game</button>
    </div>
  );
};

export default EnterGameForm;
