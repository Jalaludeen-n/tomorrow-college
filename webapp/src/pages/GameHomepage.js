import React, { useState, useEffect, useReducer, useContext } from "react";
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
import { AuthContext } from "../components/auth/UserAuth";

const GameHomepage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [started, setStarted] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function
  const api_url = process.env.REACT_APP_API_URL;
  const [state, dispatch] = useReducer(
    newGameDetailsReducer,
    getInitialStateFromLocalStorage(),
  );

  function getInitialStateFromLocalStorage() {
    const storedState = localStorage.getItem("gameHomepageState");
    return storedState ? JSON.parse(storedState) : initialStateForGameDetails;
  }

  const [loader, setLoader] = useState(false);

  const [decryptedData, setDecryptedData] = useState({});

  const fetchParticipants = async (email, roomNumber, groupName) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          groupName: groupName,
          email: email,
          roomNumber: roomNumber,
        }),
      );

      const res = await fetchRolesAndParticipants(formData);

      if (res && !res.data.roleAutoAssigned) {
        dispatch({ type: "SET_ROLES", payload: res.data.roles });
      }

      if (res && res.data.filteredparticipants.length) {
        console.log("working");
        dispatch({
          type: "SET_PARTICIPANTS",
          payload: res.data.filteredparticipants,
        });
      }
      localStorage.setItem("gameHomepageState", JSON.stringify(state));
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
    localStorage.setItem("gameHomepageState", JSON.stringify(state));
    navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
  };

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setLoader(true);
      setDecryptedData(decryptedData);
      localStorage.setItem(
        "homePagedecryptedData",
        JSON.stringify(decryptedData),
      );
      dispatch({ type: "SET_GAME_NAME", payload: decryptedData.GameName });
      dispatch({ type: "SET_GROUP_NAME", payload: decryptedData.groupName });
      dispatch({
        type: "SET_NUM_ROUNDS",
        payload: decryptedData.NumberOfRounds,
      });
      const gameInstruction = localStorage.getItem("gameInstruction");
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
        payload: decryptedData.ResultsSubmission,
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
      await fetchParticipants(data.email, data.roomNumber, data.groupName);
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

    if (encryptedData === null) {
      setStarted(true);
      const localStorageData = localStorage.getItem("gameHomepageState");
      const fetchData = async () => {
        const parsedData = JSON.parse(localStorageData);
        await fetchParticipantsAndSet(parsedData);
        const decryptedData = localStorage.getItem("homePagedecryptedData");
        setDecryptedData(JSON.parse(decryptedData));
      };
      fetchData();
    } else {
      const localStorageData = localStorage.getItem("gameHomepageState");
      const fetchData = async () => {
        if (encryptedData && !localStorageData) {
          await decryptAndFetchData(encryptedData);
        } else if (localStorageData) {
          const parsedData = JSON.parse(localStorageData);
          await fetchParticipantsAndSet(parsedData);
          const decryptedData = localStorage.getItem("homePagedecryptedData");
          setDecryptedData(JSON.parse(decryptedData));
        }
      };
      fetchData();
    }
  }, [location]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.bottomSectionContainer}>
        <Header
          gameName={state.gameName}
          groupName={state.groupName}
          numberOfRounds={state.rounds}
          className={`${styles.headerContainer}`}
        />

        <div
          className={`bottom-section d-flex flex-column ${styles.bottomSection}`}>
          <Row className={`${styles.paddingTop} mr-0 p-0`}>
            <Col xs={5} className=' m-0'>
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
                  height={"40vh"}
                />
              ) : (
                <Loader />
              )}
            </Col>
          </Row>
        </div>
      </div>
      {!started && (
        <Row className={`mt-1 text-end ${styles.mt5} mr-0`}>
          <Col className=''>
            <button className={styles.startButton} onClick={handleStartClick}>
              Start The Game
            </button>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default GameHomepage;
