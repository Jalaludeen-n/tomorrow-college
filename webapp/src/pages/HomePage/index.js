import React, { useState, useEffect, useReducer, useContext } from "react";
import CryptoJS from "crypto-js";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Col, Row } from "react-bootstrap";
import { AuthContext } from "../../components/auth/UserAuth";

import Layout from "../../components/Layout";
import Header from "../../components/game/Header";
import GameDescription from "../../components/game/GameDescription";
import Players from "../../components/game/Players";
import NavbarLeft from "../../components/NavbarLeft";

import styles from "../../styles/page/GameDetails.module.scss";

import {
  fetchRolesAndParticipants,
  selectRole,
} from "../../components/services/airtable";

import {
  initialStateForGameDetails,
  newGameDetailsReducer,
} from "../../components/helper/reducer";

import Loader from ".././Loader";

import { decryptData, getDataFromURL } from "../../components/helper/utils";
import { decryptAndStoreData } from "./helper/homePageUtils";

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
      decryptAndStoreData(decryptedData, dispatch);
      setDecryptedData(decryptedData);
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
      await decryptAndFetchData(data);
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
