import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";

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
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
    fetchResult(data);
  }, []);

  const handleStartClick = async () => {
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
      alert(
        "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
      );
    }
  };

  return (
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
            Round {data.level} Result
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
      <div className={styles.startButtonContainer}>
        <button className={styles.startButton} onClick={handleStartClick}>
          Start NEXT ROUND
        </button>
      </div>
    </>
  );
};

export default Result;
