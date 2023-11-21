import React, { useState, useEffect, useReducer, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { Col, Row } from "react-bootstrap";

import Layout from "../../components/Layout";
import GameDescription from "../../components/game/GameDescription";
import NavbarLeft from "../../components/NavbarLeft";

import styles from "../../styles/page/GameDetails.module.scss";

import {
  initialStateForGameDetails,
  newGameDetailsReducer,
} from "../../components/helper/reducer";

import Loader from ".././Loader";

import {
  decryptData,
  encryptData,
  getDataFromURL,
} from "../../components/helper/utils";
import { decryptAndStoreData } from "./helper/homePageUtils";
import {
  updateIndivitualLevel,
  updateLevel,
} from "../../components/services/level";

const Homepage = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const [state, dispatch] = useReducer(
    newGameDetailsReducer,
    initialStateForGameDetails,
  );

  const [loader, setLoader] = useState(false);
  const [NextPageloader, setnextPageloader] = useState(false);

  const [decryptedData, setDecryptedData] = useState({});

  const handleError = (error) => {
    console.error("Error:", error);
  };
  const handleStartClick = async () => {
    setnextPageloader(true);
    const encryptedData = encryptData(decryptedData, "secret_key");

    if (decryptedData.roleAutoAssigned && decryptedData.role) {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          gameId: decryptedData.GameID,
          groupName: decryptedData.groupName,
          email: decryptedData.email,
          roomNumber: decryptedData.roomNumber,
          resultsSubmission: decryptedData.ResultsSubmission,
        }),
      );

      await updateLevel(formData);
    } else navigate(`/roles?data=${encodeURIComponent(encryptedData)}`);
  };

  const decryptAndShowPdf = (decryptedData) => {
    try {
      setLoader(true);
      decryptAndStoreData(decryptedData, dispatch);
      setDecryptedData(decryptedData);
      setLoader(false);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("updatelevel", (data) => {
      const updatedData = {
        ...decryptedData,
        level: data.CurrentLevel,
        started: data.started,
      };

      if (data.playerClick) {
        if (
          data.started &&
          data.role &&
          (data.CurrentLevel === 1 || data.CurrentLevel === decryptedData.level)
        ) {
          const encryptedData = encryptData(updatedData, "secret_key");
          navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
          return;
        }
      }

      if (
        (data.CurrentLevel === decryptedData.level ||
          data.CurrentLevel === 1) &&
        data.started
      ) {
        if (decryptedData.role && data.update) {
          update(decryptedData);
        } else {
          alert(
            "The admin has started the game. Please choose your role and begin playing.",
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const update = async (data) => {
    const formData = new FormData();
    console.log("update");

    formData.append(
      "data",
      JSON.stringify({
        gameId: data.GameID,
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
        resultsSubmission: data.ResultsSubmission,
      }),
    );

    const res = await updateIndivitualLevel(formData);
    const updatedData = {
      ...data,
      level: res.data.CurrentLevel,
      started: res.data.started,
    };
    const encryptedData = encryptData(updatedData, "secret_key");
    navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
  };

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    decryptAndShowPdf(data);
  }, [location]);

  return (
    <>
      {NextPageloader ? (
        <Loader />
      ) : (
        <Layout LeftNavbar={NavbarLeft}>
          <div className={styles.homeContainer}>
            <div className={styles.bottomSectionContainer}>
              <div>
                {!loader ? (
                  <GameDescription
                    pdfData={state.gameInstructions}
                    header={"Game Introduction"}
                  />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            {!loader && !decryptedData.main && (
              <Row className={`mt-1 text-end ${styles.mt5} mr-0`}>
                <Col className=''>
                  <button
                    className={styles.startButton}
                    onClick={handleStartClick}>
                    {decryptedData.roleAutoAssigned && decryptedData.role
                      ? "Start THE ROUND"
                      : "CHOOSE YOUR ROLE"}
                  </button>
                </Col>
              </Row>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};

export default Homepage;
