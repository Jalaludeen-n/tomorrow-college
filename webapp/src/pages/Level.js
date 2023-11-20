import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";
import { io } from "socket.io-client";

import { fetchRoundPdf } from "../components/services/level";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import Layout from "../components/Layout";
import NavbarLeft from "../components/NavbarLeft";
import NavbarRight from "../components/NabarRight";
import {
  decryptData,
  encryptData,
  getDataFromURL,
} from "../components/helper/utils";
import { fetchRolePdf } from "../components/services/role";
import Decision from "../components/Decision";

const Level = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const [activeComponent, setActiveComponent] = useState("Round1Instruction");
  const [rolePdf, setRolePdf] = useState(null);
  const [roundPdf, setRoundPdf] = useState(null);
  const [data, setData] = useState({});
  const [started, setStarted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [loader, setLoader] = useState(false);

  const handleError = (error) => {
    console.error("Error:", error);
  };

  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("Movelevel", (data) => {
      console.log("movelevel socket");
      const encryptedData = getDataFromURL(location);
      const key = "secret_key";
      const decryptedData = decryptData(encryptedData, key);
      const updatedData = {
        ...decryptedData,
        level: data.CurrentLevel,
        started: data.started,
      };
      const newData = encryptData(updatedData, "secret_key");
      navigate(`/result?data=${encodeURIComponent(newData)}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleComponentChange = async (component) => {
    if (component == "RoleBriefing") {
      await fetchRoleInstruction(data);
    }
    if (component == "Round1Instruction") {
      await fetchRoundInstruction(data);
    }
    setActiveComponent(component);
  };
  const fetchRoleInstruction = async (decryptData) => {
    const data = {
      GameName: decryptData.GameName,
      role: decryptData.role,
    };
    const res = await fetchRolePdf(data);
    const pdf = res.data;
    setRolePdf(pdf);
  };
  const fetchRoundInstruction = async (decryptData) => {
    const data = {
      GameName: decryptData.GameName,
      role: decryptData.role,
      level: decryptData.level,
    };
    console.log("dd");
    console.log(data);
    const res = await fetchRoundPdf(data);

    if (res.success) {
      const pdf = res.data;
      setRoundPdf(pdf);
    }
  };
  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
    console.log("u");
    console.log(data);
    fetchRoundInstruction(data);
  }, []);

  return (
    <>
      <Layout
        className={`app-container ${styles.levelPage}`}
        LeftNavbar={NavbarLeft}
        RightNavbar={NavbarRight}>
        <Row className={styles.levelHeaders}>
          <Col
            className={`d-flex align-items-center justify-content-center ${
              activeComponent === "Round1Instruction" ? styles.activeHeader : ""
            }`}
            onClick={() => handleComponentChange("Round1Instruction")}>
            Round {data.level} Instruction
          </Col>
          <Col
            className={`d-flex align-items-center justify-content-center ${
              styles.header
            } ${activeComponent === "RoleBriefing" ? styles.activeHeader : ""}`}
            onClick={() => handleComponentChange("RoleBriefing")}>
            Your Role Briefing
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
        {activeComponent === "Round1Instruction" && (
          <GameDescription pdfData={roundPdf} />
        )}
        {activeComponent === "RoleBriefing" && (
          <GameDescription pdfData={rolePdf} />
        )}
        {activeComponent === "HistoricalDecisions" && <Decision />}
      </Layout>
    </>
  );
};

export default Level;
