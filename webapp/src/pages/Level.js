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
import { decryptData, getDataFromURL } from "../components/helper/utils";
import { fetchRolePdf } from "../components/services/role";

const Level = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const [activeComponent, setActiveComponent] = useState("Round1Instruction");
  const [rolePdf, setRolePdf] = useState(null);
  const [roundPdf, setRoundPdf] = useState(null);
  const [data, setData] = useState({});

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

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("level", (data) => {
      const searchParams = new URLSearchParams(location.search);
      const encryptedData = searchParams.get("data");
      if (encryptedData) {
      }
    });
    socket.on("start", (data) => {});

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const checkIfLevelStarted = async (decryptedData) => {
  //   try {
  //     const formData = {
  //       RoomNumber: decryptedData.roomNumber,
  //       GameID: decryptedData.GameID,
  //       Level: decryptedData.level,
  //     };
  //     const res = await getLevelStatus(formData);
  //     const data = res.levelStatus;
  //     const started = data.some((obj) => obj.Level === decryptedData.level);

  //     if (started) {
  //       setStarted(true);
  //       localStorage.setItem("started", true);
  //     } else {
  //       console.log(`Not started`);
  //     }
  //     setFirstLoader(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleComponentChange = async (component) => {
    if (component == "RoleBriefing") {
      await fetchRoleInstruction(data);
    }
    if (component == "Round1Instruction") {
      await fetchRoundInstruction(data);
    }
    if (component == "HistoricalDecisions") {
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
    setRolePdf(res.data);
  };
  const fetchRoundInstruction = async (decryptData) => {
    const data = {
      GameName: decryptData.GameName,
      role: decryptData.role,
      level: decryptData.level,
    };
    const res = await fetchRoundPdf(data);
    setRoundPdf(res.data);
  };
  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
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
        {activeComponent === "HistoricalDecisions" && <GameDescription />}
      </Layout>
    </>
  );
};

export default Level;
