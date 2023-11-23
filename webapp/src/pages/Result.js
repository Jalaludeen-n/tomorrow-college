import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";
import { io } from "socket.io-client";

import {
  getCurrentLevelStatus,
  updateIndivitualLevel,
} from "../components/services/level";
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

  const update = async (data) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        gameId: data.GameID,
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
      }),
    );
    const res = await updateIndivitualLevel(formData);
    const updatedData = {
      ...data,
      level: res.data.level,
      started: res.data.started,
    };

    if (res.data.started) {
      const encryptedData = encryptData(updatedData, "secret_key");
      navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
    } else {
      alert(
        "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
      );
    }
  };
  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
    fetchResult(data);
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("gameStarted", (data) => {
      const encryptedData = getDataFromURL(location);
      const key = "secret_key";
      const decryptedData = decryptData(encryptedData, key);
      if (parseInt(data.CurrentLevel) == parseInt(decryptedData.level)) {
        navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
      }
    });
    // socket.on("updatelevel", (receivedData) => {
    //   let updatedData = {
    //     ...data,
    //     started: receivedData.started,
    //   };

    //   if (receivedData.playerClick && receivedData.email === data.email) {
    //     if (
    //       receivedData.started &&
    //       receivedData.CurrentLevel === parseInt(data.level)
    //     ) {
    //       const encryptedData = encryptData(updatedData, "secret_key");
    //       navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
    //     } else {
    //       setLoader(false);
    //       alert(
    //         "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
    //       );
    //     }
    //   } else if (
    //     receivedData.started &&
    //     receivedData.CurrentLevel === parseInt(data.level)
    //   ) {
    //     const encryptedData = encryptData(updatedData, "secret_key");
    //     navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
    //   }
    // });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [location]);

  const handleStartClick = async () => {
    setLoader(true);
    const formData = {
      roomNumber: data.roomNumber,
      gameId: data.GameID,
      level: data.level,
    };

    const res = await getCurrentLevelStatus(formData);
    const started = res.data;

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
