import React, { useState, useEffect, useReducer } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import styles from "../styles/page/GameDetails.module.scss";
import { io } from "socket.io-client";
import {
  fetchGameDetails,
  fetchRolesAndParticipants,
  selectRole,
} from "../components/services/airtable";
import Header from "../components/game/Header";
import GameDescription from "../components/game/GameDescription";
import Players from "../components/game/Players";
import { Col, Row } from "react-bootstrap";
import {
  initialStateForGameDetails,
  newGameDetailsReducer,
} from "../components/helper/reducer";
import Loader from "../pages/Loader";

const GameDetails = () => {
  const storedState =
    JSON.parse(localStorage.getItem("gameDetails")) ||
    initialStateForGameDetails;
  const [state, dispatch] = useReducer(newGameDetailsReducer, storedState);
  const [loader, setLoader] = useState(false);
  const [decryptedData, setDecryptedData] = useState({});

  const fetchParticipants = async (email, roomNumber, groupNumber) => {
    try {
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

      if (res && !res.data.roleAutoAssigned) {
        dispatch({ type: "SET_ROLES", payload: res.data.roles });
      }

      if (res && res.data.filteredparticipants.length) {
        dispatch({
          type: "SET_PARTICIPANTS",
          payload: res.data.filteredparticipants,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error("Error:", error);
    // Handle error here, e.g., show an error message to the user
  };
  const handleStartClick = () => {
    const data = JSON.stringify({
      gameName: state.gameName,
      email: state.email,
      roomNumber: state.roomNumber,
      groupName: state.groupName,
      name: state.name,
      gameID: state.gameID,
      role: state.role,
      scoreVisibilityForPlayers: state.scoreVisibilityForPlayers,
      resultsSubbmision: state.resultsSubbmision,
      level: 1,
      numberOfRounds: state.rounds,
    });
    const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
    window.location.href = `/level?data=${encodeURIComponent(encryptedData)}`;
  };

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const storedData = JSON.parse(localStorage.getItem("gameDetails"));
      setLoader(true);
      setDecryptedData(decryptedData);

      await Promise.all([
        fetchGameDetailsAndSet(decryptedData),
        fetchParticipantsAndSet(decryptedData),
      ]);

      setLoader(false);
    } catch (error) {
      handleError(error);
    }
  };
  const decryptAndFetchRole = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const storedData = JSON.parse(localStorage.getItem("gameDetails"));

      await fetchParticipantsAndSet(decryptedData);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchGameDetailsAndSet = async (data) => {
    try {
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
        dispatch({ type: "SET_GROUP_NAME", payload: data.groupNumber });
        dispatch({ type: "SET_NUM_ROUNDS", payload: res.data.numberOfRounds });
        dispatch({ type: "SET_GAME_INSTRUCTIONS", payload: res.data.pdf });
        dispatch({ type: "SET_NAME", payload: res.data.name });
        dispatch({ type: "SET_EMAIL", payload: res.data.email });
        dispatch({ type: "SET_ROOM_NUMBER", payload: data.roomNumber });
        dispatch({ type: "SET_GAME_ID", payload: res.data.gameID });
        dispatch({
          type: "SET_SCORE_VISIBILITY_FOR_PLAYERS",
          payload: res.data.scoreVisibilityForPlayers,
        });
        dispatch({
          type: "SET_AUTO_SELECTION",
          payload: res.roleAutoAssigned,
        });
        dispatch({
          type: "SET_RESULTS_SUBBMISION",
          payload: res.data.resultsSubbmision,
        });

        if (res.roleAutoAssigned) {
          dispatch({ type: "SET_ROLE", payload: res.data.role });
          dispatch({ type: "SET_ROLES", payload: [] });
        }
        setLoader(false);
      } else {
        alert(res.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchParticipantsAndSet = async (data) => {
    try {
      await fetchParticipants(data.email, data.roomNumber, data.groupNumber);
    } catch (error) {
      handleError(error);
    }
  };

  const updateRole = async (role) => {
    const formData = new FormData();
    dispatch({ type: "SET_ROLE", payload: role });
    formData.append(
      "data",
      JSON.stringify({
        groupName: state.groupName,
        email: state.email,
        roomNumber: state.roomNumber,
        role: role,
      }),
    );
    try {
      await selectRole(formData);
    } catch (er) {
      dispatch({ type: "SET_ROLE", payload: "" });
      handleError(er);
    }
  };

  useEffect(() => {
    // Establish a WebSocket connection to the server
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    // Listen for events from the server
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("participants", (data) => {
      const searchParams = new URLSearchParams(window.location.search);
      const encryptedData = searchParams.get("data");
      if (encryptedData) {
        decryptAndFetchRole(encryptedData);
        // localStorage.setItem("gameDetails", JSON.stringify(state));
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encryptedData = searchParams.get("data");
    if (encryptedData) {
      decryptAndFetchData(encryptedData);
      // localStorage.setItem("gameDetails", JSON.stringify(state));
    }
  }, []);

  return (
    <div className='app-container'>
      <Header
        gameName={state.gameName}
        groupName={state.groupName}
        numberOfRounds={state.rounds}
        className={`${styles.headerContainer}`} // Use the imported style
      />
      <div
        className={`bottom-section d-flex flex-column ${styles.bottomSection}`}>
        <Row className={`p-2 mt3 ${styles.paddingTop} flex-grow-1`}>
          <Col xs={5} className='flex-grow-1'>
            {!loader ? (
              <Players state={state} updateRole={updateRole} />
            ) : (
              <Loader />
            )}
          </Col>
          <Col xs={7} className='flex-grow-3'>
            {!loader ? (
              <GameDescription pdfData={state.gameInstructions} />
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
        <Row className={`mt-3 text-end ${styles.mt5}`}>
          <Col>
            <button className='btn btn-primary' onClick={handleStartClick}>
              Start
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GameDetails;
