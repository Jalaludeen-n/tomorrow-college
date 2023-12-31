import React, { useState, useEffect, useReducer, useContext } from "react";
import Layout from "../components/Layout";
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
import Loader from "./Loader";
import { AuthContext } from "../components/auth/UserAuth";
import { decryptData, getDataFromURL } from "../components/helper/utils";
import NavbarLeft from "../components/NavbarLeft";

const Homepage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [started, setStarted] = useState(false);

  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const [state, dispatch] = useReducer(
    newGameDetailsReducer,
    initialStateForGameDetails,
  );

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

  const decryptAndFetchData = async (decryptedData) => {
    try {
      setLoader(true);
      setDecryptedData(decryptedData);

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
      const key = "secret_key";
      const decryptedData = decryptData(encryptedData, key);
      await fetchParticipantsAndSet(decryptedData);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchParticipantsAndSet = async (data) => {
    try {
      const gameInstruction = localStorage.getItem("gameInstruction");
      dispatch({ type: "SET_GAME_INSTRUCTIONS", payload: gameInstruction });
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
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setStarted(true);
    const fetchData = async () => {
      await fetchParticipantsAndSet(data);
    };
    fetchData();
  }, [location]);

  return (
    <Layout LeftNavbar={NavbarLeft}>
      <div className={styles.homeContainer}>
        <div className={styles.bottomSectionContainer}>
          <div>
            {!loader ? (
              <GameDescription
                pdfData={state.gameInstructions}
                header={"Game Introduction"}
                height={"40vh"}
              />
            ) : (
              <Loader />
            )}
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
    </Layout>
  );
};

export default Homepage;
