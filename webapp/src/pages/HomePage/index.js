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

const Homepage = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const [state, dispatch] = useReducer(
    newGameDetailsReducer,
    initialStateForGameDetails,
  );

  const [loader, setLoader] = useState(false);

  const [decryptedData, setDecryptedData] = useState({});

  const handleError = (error) => {
    console.error("Error:", error);
  };
  const handleStartClick = () => {
    const encryptedData = encryptData(decryptedData, "secret_key");

    if (decryptedData.roleAutoAssigned && decryptedData.role) {
      navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
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
    socket.on("participants", (data) => {});

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
    decryptAndShowPdf(data);
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
        {!loader && (
          <Row className={`mt-1 text-end ${styles.mt5} mr-0`}>
            <Col className=''>
              <button className={styles.startButton} onClick={handleStartClick}>
                {decryptedData.roleAutoAssigned && decryptedData.role
                  ? "Start THE ROUND"
                  : "CHOOSE YOUR ROLE"}
              </button>
            </Col>
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default Homepage;
