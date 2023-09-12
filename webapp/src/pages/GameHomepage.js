import React, { useState, useEffect, useReducer } from "react";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import styles from "../styles/page/GameDetails.module.scss";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import {
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

const GameHomepage = () => {
  const location = useLocation();
  const [started, setStarted] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function
  const api_url = process.env.REACT_APP_API_URL;
  const [state, dispatch] = useReducer(
    newGameDetailsReducer,
    initialStateForGameDetails,
  );
  const [loader, setLoader] = useState(false);
  const initialDecryptedData = JSON.parse(
    localStorage.getItem("homePagedecryptedData") || "{}",
  );
  const [decryptedData, setDecryptedData] = useState(initialDecryptedData);

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
  };
  const handleStartClick = () => {
    const data = JSON.stringify({
      ...decryptedData,
      level: 1,
    });
    const encryptedData = CryptoJS.AES.encrypt(data, "secret_key").toString();
    navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
  };

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setLoader(true);
      setDecryptedData(decryptedData);
      localStorage.setItem("homePagedecryptedData", decryptedData);
      dispatch({ type: "SET_GAME_NAME", payload: decryptedData.GameName });
      dispatch({ type: "SET_GROUP_NAME", payload: decryptedData.groupNumber });
      dispatch({
        type: "SET_NUM_ROUNDS",
        payload: decryptedData.NumberOfRounds,
      });
      const gameInstruction = localStorage.getItem("gameInstruction");
      // localStorage.setItem("gameInstruction", gameInstruction);
      dispatch({ type: "SET_GAME_INSTRUCTIONS", payload: gameInstruction });
      dispatch({ type: "SET_NAME", payload: decryptedData.name });
      dispatch({ type: "SET_EMAIL", payload: decryptedData.email });
      dispatch({ type: "SET_ROOM_NUMBER", payload: decryptedData.roomNumber });
      dispatch({ type: "SET_GAME_ID", payload: decryptedData.gameID });
      dispatch({
        type: "SET_SCORE_VISIBILITY_FOR_PLAYERS",
        payload: decryptedData.ScoreVisibilityForPlayers,
      });
      if (decryptedData.roleAutoAssigned) {
        dispatch({ type: "SET_ROLE", payload: decryptedData.role });
        dispatch({ type: "SET_ROLES", payload: [] });
      }
      dispatch({
        type: "SET_AUTO_SELECTION",
        payload: decryptedData.roleAutoAssigned,
      });
      dispatch({
        type: "SET_RESULTS_SUBBMISION",
        payload: decryptedData.ResultsSubbmision,
      });

      await fetchParticipantsAndSet(decryptedData);

      setLoader(false);
    } catch (error) {
      handleError(error);
    }
  };
  const decryptAndFetchRole = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      await fetchParticipantsAndSet(decryptedData);
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
    const roleAutoAssigned = true;

    const updatedEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        ...decryptedData,
        role,
        roleAutoAssigned,
      }),
      "secret_key",
    ).toString();

    navigate(`/home?data=${encodeURIComponent(updatedEncryptedData)}`);
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
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("participants", (data) => {
      const searchParams = new URLSearchParams(location.search);
      const encryptedData = searchParams.get("data");
      if (encryptedData) {
        decryptAndFetchRole(encryptedData);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const encryptedData = searchParams.get("data");
    if (encryptedData) {
      decryptAndFetchData(encryptedData);
    }
  }, []);

  return (
    <>
      <Header
        gameName={state.gameName}
        groupName={state.groupName}
        numberOfRounds={state.rounds}
        className={`${styles.headerContainer}`}
      />

      <div
        className={`bottom-section d-flex flex-column ${styles.bottomSection}`}>
        <Row className={`p-2 ${styles.paddingTop} mr-0`}>
          <Col xs={5}>
            {!loader ? (
              <Players state={state} updateRole={updateRole} />
            ) : (
              <Loader />
            )}
          </Col>
          <Col xs={7} className='p-0'>
            {!loader ? (
              <GameDescription
                pdfData={state.gameInstructions}
                header={"Gameplay description"}
              />
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
        <Row className={`mt-1 text-end ${styles.mt5} mr-0`}>
          <Col className=''>
            <button className={styles.startButton} onClick={handleStartClick}>
              Start The Game
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GameHomepage;
