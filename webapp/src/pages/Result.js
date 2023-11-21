import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";
import { io } from "socket.io-client";

import { getCurrentLevelStatus } from "../components/services/level";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import Layout from "../components/Layout";
import NavbarLeft from "../components/NavbarLeft";
import {
  decryptData,
  encryptData,
  getDataFromURL,
} from "../components/helper/utils";
import Decision from "../components/Decision";
import { fetchResultPdf } from "../components/services/decision";

const Result = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const [activeComponent, setActiveComponent] = useState("RoundResult");
  const [roundPdf, setRoundPdf] = useState(null);
  const [data, setData] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const [loader, setLoader] = useState(false);

  const handleComponentChange = async (component) => {
    if (component == "RoundResult") {
      await fetchResult(data);
    }
    setActiveComponent(component);
  };
  const fetchResult = async (decryptData) => {
    const data = {
      sheetID: decryptData.GoogleSheetID,
      level: decryptData.level,
    };
    const res = await fetchResultPdf(data);
    setRoundPdf(res.data);
  };
  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("updatelevel", (receivedData) => {
      let updatedData = {
        ...receivedData,
        level: receivedData.CurrentLevel,
        started: receivedData.started,
      };

      if (receivedData.playerClick && receivedData.email === data.email) {
        if (receivedData.started) {
          const encryptedData = encryptData(updatedData, "secret_key");
          navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
        } else {
          setLoader(false);
          alert(
            "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
          );
        }
      } else if (
        receivedData.started &&
        receivedData.CurrentLevel === data.level
      ) {
        const encryptedData = encryptData(updatedData, "secret_key");
        navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
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
    setData(data);
    fetchResult(data);
  }, []);

  const handleStartClick = async () => {
    setLoader(true);
    const formData = {
      roomNumber: data.roomNumber,
      gameId: data.GameID,
      level: data.level,
    };

    const res = await getCurrentLevelStatus(formData);
    const started = res.data.started;

    if (started) {
      const encryptedData = encryptData(data, "secret_key");
      navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
    } else {
      setLoader(false);
      alert(
        "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
      );
    }
  };

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <>
          <Layout
            className={`app-container ${styles.levelPage}`}
            LeftNavbar={NavbarLeft}>
            <Row className={styles.levelHeaders}>
              <Col
                className={`d-flex align-items-center justify-content-center ${
                  activeComponent === "RoundResult" ? styles.activeHeader : ""
                }`}
                onClick={() => handleComponentChange("RoundResult")}>
                Round {data.completed ? data.level : data.level - 1} Result
              </Col>
              <Col
                className={`d-flex align-items-center justify-content-center ${
                  activeComponent === "HistoricalDecisions"
                    ? styles.activeHeader
                    : ""
                }`}
                onClick={() => handleComponentChange("HistoricalDecisions")}>
                Historical Decisions
              </Col>
            </Row>
            {activeComponent === "RoundResult" && (
              <GameDescription pdfData={roundPdf} show={false} />
            )}
            {activeComponent === "HistoricalDecisions" && <Decision />}
          </Layout>

          {!data.completed && (
            <div className={styles.startButtonContainer}>
              <button className={styles.startButton} onClick={handleStartClick}>
                Start NEXT ROUND
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Result;
