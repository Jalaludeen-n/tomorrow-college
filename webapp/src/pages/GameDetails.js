import React, { useState, useEffect, useReducer } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import styles from "../styles/page/GameDetails.module.scss";
import {
  fetchGameDetails,
  fetchRolesAndParticipants,
} from "../components/services/airtable";
import Header from "../components/game/Header";
import GameDescription from "../components/game/GameDescription";
import Players from "../components/game/Players";
import { Col, Row } from "react-bootstrap";
import {
  initialStateForGameDetails,
  newGameDetailsReducer,
} from "../components/helper/reducer";

const GameDetails = () => {
  const storedState =
    JSON.parse(localStorage.getItem("gameDetails")) ||
    initialStateForGameDetails;
  const [state, dispatch] = useReducer(newGameDetailsReducer, storedState);

  const fetchParticipants = async (email, roomNumber, groupNumber) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        groupName: groupNumber,
        email: email,
        roomNumber: roomNumber,
      }),
    );

    const res = await fetchRolesAndParticipants(formData);
    if (res) {
      if (!res.data.roleAutoAssigned) {
        dispatch({ type: "SET_ROLES", payload: res.data.roles });
      }
      if (res.data.filteredparticipants.length) {
        dispatch({
          type: "SET_PARTICIPANTS",
          payload: res.data.filteredparticipants,
        });
      }
    }
  };

  const decryptAndFetchData = async (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const storedData = JSON.parse(localStorage.getItem("gameDetails"));
    console.log(storedData);
    console.log(storedData.rounds);
    console.log(storedData.name);
    console.log(storedData.email);
    console.log(storedData.autoSelection);
    console.log(storedData.role);
    console.log(storedData.roles);
    console.log(storedData.participants);

    if (!storedData) {
      await Promise.all([
        fetchGameDetailsAndSet(decryptedData),
        fetchParticipantsAndSet(decryptedData),
      ]);
    }
  };

  const fetchGameDetailsAndSet = async (data) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        groupName: data.groupNumber,
        email: data.email,
        roomNumber: data.roomNumber,
      }),
    );

    const res = await fetchGameDetails(formData);
    if (res.success) {
      dispatch({ type: "SET_GAME_NAME", payload: res.data.gameName });
      dispatch({ type: "SET_NUM_ROUNDS", payload: res.data.numberOfRounds });
      dispatch({ type: "SET_GAME_INSTRUCTIONS", payload: res.data.pdf });
      dispatch({ type: "SET_NAME", payload: res.data.name });
      dispatch({ type: "SET_EMAIL", payload: res.data.email });
      dispatch({
        type: "SET_AUTO_SELECTION",
        payload: res.roleAutoAssigned,
      });

      if (res.roleAutoAssigned) {
        dispatch({ type: "SET_ROLE", payload: res.data.role });
      }
    } else {
      alert(res.message);
    }
  };

  const fetchParticipantsAndSet = async (data) => {
    await fetchParticipants(data.email, data.roomNumber, data.groupNumber);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encryptedData = searchParams.get("data");

    if (encryptedData) {
      decryptAndFetchData(encryptedData);
      localStorage.setItem("gameDetails", JSON.stringify(state));
    }
  }, []);

  return (
    <div className='app-container'>
      <Header
        gameName={""}
        groupName={""}
        numberOfRounds={0}
        className={`${styles.headerContainer}`} // Use the imported style
      />
      <div
        className={`bottom-section d-flex flex-column ${styles.bottomSection}`}>
        <Row className={`p-2 ${styles.paddingTop} flex-grow-1`}>
          <Col xs={5} className='flex-grow-1'>
            <Players />
          </Col>
          <Col xs={7} className='flex-grow-3'>
            <GameDescription games={[]} />
          </Col>
        </Row>
        <Row className={`mt-3 text-end ${styles.mt5}`}>
          <Col>
            <button className='btn btn-primary'>Your Button</button>
          </Col>
        </Row>
      </div>
    </div>
  );

  // <div className='game-details-page'>
  //   <div className='left-side'>
  //     <div className='welcome-text'>
  //       <h1>Welcome to the Game!</h1>
  //     </div>
  //     <div className='role-selection'>
  //       <h2>Your Role:</h2>
  //       <select
  //         value={selectedRole}
  //         onChange={(e) => setSelectedRole(e.target.value)}>
  //         <option value=''>Select Role</option>
  //         {roles.map((role) => (
  //           <option key={role} value={role}>
  //             {role}
  //           </option>
  //         ))}
  //       </select>
  //     </div>
  //     <div className='user-list'>
  //       <h2>Players:</h2>
  //       <ul>
  //         {users.map((user) => (
  //           <li key={user.id}>{user.name}</li>
  //         ))}
  //       </ul>
  //     </div>
  //     <div className='game-info'>
  //       <h2>Game Information:</h2>
  //       <p>Total Rounds: 5</p>
  //       <p>Group Name: Group A</p>
  //     </div>
  //   </div>
  //   <div className='right-side'>
  //     <div className='pdf-container'>
  //       {pdfData && (
  //         <iframe
  //           src={`data:application/pdf;base64,${pdfData}`}
  //           title='PDF'
  //           style={{
  //             width: "100%",
  //             height: "100vh",
  //             border: "none",
  //             // zoom: "100%",
  //           }}
  //         />
  //       )}
  //     </div>
  //     <button
  //       onClick={() => {
  //         window.location.href = "/level";
  //       }}>
  //       start
  //     </button>
  //   </div>
  // </div>
};

export default GameDetails;
