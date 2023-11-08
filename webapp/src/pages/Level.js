import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css"; // Import your CSS file for styling
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";
import { io } from "socket.io-client";

import {
  fetchLevelDetails,
  storeAnsweres,
  gameCompleted,
  fetchRolePdf,
} from "../components/services/airtable";
import { getLevelStatus } from "../components/services/level";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import Layout from "../components/Layout";
import NavbarLeft from "../components/NavbarLeft";
import NavbarRight from "../components/NabarRight";
import { decryptData, getDataFromURL } from "../components/helper/utils";

const Level = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const [activeComponent, setActiveComponent] = useState("Round1Instruction");
  const [rolePdf, setRolePdf] = useState(null);

  const navigate = useNavigate(); // Initialize the navigate function
  const [pdfData, setPdfData] = useState(getPDFFromLocalStorage());
  const [isSubmitted, setIssubmitted] = useState(false);
  const location = useLocation();
  const [decryptedData, setDecryptedData] = useState(
    getDecryptedDataFromLocalStorage(),
  );
  const [loader, setLoader] = useState(false);
  const [questions, setQustions] = useState(getQstionsFromLocalStorage);
  const [answers, setAnswers] = useState(getAnsFromLocalStorage());
  const [submit, setSubmit] = useState(getSubmitFromLocalStorage());
  const [started, setStarted] = useState(false);
  const [firstLoader, setFirstLoader] = useState(true);

  function getDecryptedDataFromLocalStorage() {
    const decryptedData = localStorage.getItem("levelpageDecryptedData");
    return decryptedData ? JSON.parse(decryptedData) : {};
  }
  function getQstionsFromLocalStorage() {
    const questions = localStorage.getItem("levelpageqstns");
    return questions ? JSON.parse(questions) : [];
  }
  function getAnsFromLocalStorage() {
    const answers = localStorage.getItem("levelpageans");
    return answers ? JSON.parse(answers) : [];
  }
  function getSubmitFromLocalStorage() {
    const submit = localStorage.getItem("submit");
    return submit ? JSON.parse(submit) : true;
  }
  function getPDFFromLocalStorage() {
    const pdf = localStorage.getItem("levelPDF");
    return pdf ? pdf : null;
  }

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decryptedData);
      localStorage.setItem(
        "levelpageDecryptedData",
        JSON.stringify(decryptedData),
      );

      setLoader(true);
      if (started) {
        await fetchLevelDetailsAndSet(decryptedData);
      } else {
        await checkIfLevelStarted(decryptedData);
      }

      setLoader(false);
    } catch (error) {
      handleError(error);
    }
  };
  const handleError = (error) => {
    console.error("Error:", error);
    // Handle error here, e.g., show an error message to the user
  };
  const completed = async (data) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          email: data.email,
          roomNumber: data.roomNumber,
          groupName: data.groupName,
          name: data.name,
          gameID: data.GameID,
          role: data.role,
          level: data.level,
          gameName: data.GameName,
          scoreVisibilityForPlayers: data.ScoreVisibilityForPlayers,
          ResultsSubmission: data.ResultsSubmission,
          sheetID: data.GoogleSheetID,
        }),
      );

      await gameCompleted(formData);
    } catch (error) {
      handleError(error);
    }
  };
  const fetchLevelDetailsAndSet = async (data) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          email: data.email,
          roomNumber: data.roomNumber,
          groupName: data.groupName,
          name: data.name,
          gameID: data.GameID,
          role: data.role,
          level: data.level,
          gameName: data.GameName,
          scoreVisibilityForPlayers: data.ScoreVisibilityForPlayers,
          ResultsSubmission: data.ResultsSubmission,
          sheetID: data.GoogleSheetID,
          numberOfRounds: data.NumberOfRounds,
        }),
      );

      const res = await fetchLevelDetails(formData);

      if (res.success) {
        setQustions(res.data.qustions);
        localStorage.setItem(
          "levelpageqstns",
          JSON.stringify(res.data.qustions),
        );
        localStorage.setItem("submit", JSON.stringify(res.data.submit));
        setSubmit(res.data.submit);
        setPdfData(res.data.instruction);
        localStorage.setItem("levelPDF", res.data.instruction);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    // Listen for events from the server
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("level", (data) => {
      const searchParams = new URLSearchParams(location.search);
      const encryptedData = searchParams.get("data");
      if (encryptedData) {
        updateLevel(encryptedData, data);
      }
    });
    socket.on("start", (data) => {
      setStarted(true);
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
    // if (encryptedData) {
    //   decryptAndFetchData(encryptedData);
    // } else {
    //   setPdfData(getPDFFromLocalStorage());
    //   setDecryptedData(getDecryptedDataFromLocalStorage());

    //   setQustions(getQstionsFromLocalStorage);
    //   setAnswers(getAnsFromLocalStorage());
    //   setSubmit(getSubmitFromLocalStorage());
    //   setStarted(localStorage.getItem("started"));
    //   setFirstLoader(false);
    // }
  }, [location, started, firstLoader]);

  const checkIfLevelStarted = async (decryptedData) => {
    try {
      const formData = {
        RoomNumber: decryptedData.roomNumber,
        GameID: decryptedData.GameID,
        Level: decryptedData.level,
      };
      const res = await getLevelStatus(formData);
      const data = res.levelStatus;
      const started = data.some((obj) => obj.Level === decryptedData.level);

      if (started) {
        setStarted(true);
        localStorage.setItem("started", true);

        await fetchLevelDetailsAndSet(decryptedData);
      } else {
        console.log(`Not started`);
      }
      setFirstLoader(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("started");
    localStorage.removeItem("levelpageans");
    localStorage.removeItem("levelpageDecryptedData");
    localStorage.removeItem("levelpageqstns");
    localStorage.removeItem("submit");
    localStorage.removeItem("levelPDF");
    if (decryptedData.NumberOfRounds >= decryptedData.level) {
      setLoader(true);
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          email: decryptedData.email,
          roomNumber: decryptedData.roomNumber,
          groupName: decryptedData.groupName,
          name: decryptedData.name,
          gameID: decryptedData.GameID,
          role: decryptedData.role,
          level: decryptedData.level,
          gameName: decryptedData.GameName,
          scoreVisibilityForPlayers: decryptedData.ScoreVisibilityForPlayers,
          ResultsSubmission: decryptedData.ResultsSubmission,
          sheetID: decryptedData.GoogleSheetID,
          numberOfRounds: decryptedData.NumberOfRounds,
          answers: answers,
        }),
      );

      const res = await storeAnsweres(formData);

      const updatedEncryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({
          ...decryptedData,
          level: res.level,
          submit: submit,
        }),
        "secret_key",
      ).toString();
      setAnswers([]);
      setQustions([]);
      setStarted(false);

      navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
    }
  };
  const updateLevel = (decryptedData, level) => {
    const updatedEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        ...decryptedData,
        level: level,
      }),
      "secret_key",
    ).toString();
    setLoader(true);
    if (decryptedData.NumberOfRounds >= level) {
      navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
    }
    setLoader(false);
  };

  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
    localStorage.setItem("levelpageans", JSON.stringify(newAnswers));
  };
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };
  const fetchPdf = async (decryptData) => {
    const data = {
      GameName: decryptData.GameName,
      role: decryptData.role,
    };
    const res = await fetchRolePdf(data);
    console.log(res);
    setRolePdf(res.data);
  };
  const fetchInstraction = async (decryptData) => {
    const data = {
      GameName: decryptData.GameName,
      role: decryptData.role,
    };
    // const res = await fetchRoundPdf(data);
    // console.log(res);
    // setRolePdf(res.data);
  };
  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    fetchPdf(data);
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
            Round 1 Instruction
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
        {activeComponent === "Round1Instruction" && <GameDescription />}
        {activeComponent === "RoleBriefing" && (
          <GameDescription pdfData={rolePdf} />
        )}
        {activeComponent === "HistoricalDecisions" && <GameDescription />}

        {/* <Form onSubmit={handleSubmit}>
        <Row className={` ${styles.paddingTop} flex-grow-1`}>
          <Col xs={5} className='flex-grow-1'>
            {!loader ? (
              <GameDescription
                pdfData={pdfData}
                header={"Round scenario"}
                height={"60vh"}
              />
            ) : (
              <Loader />
            )}
          </Col>
          <Col xs={6} className={`d-flex flex-column ${styles.rightSide}`}>
            {!loader ? (
              <div className={`${styles.questionsContainer}`}>
                {questions.map((question, index) => (
                  <div key={index} className={`question ${styles.question}`}>
                    <p>{question.question}</p>
                    {question.type === "Multiple-Choice" && (
                      <Form.Group
                        className={`options ${styles.options}`}
                        aria-required>
                        {question.choices.map((option, optionIndex) => (
                          <Form.Check
                            key={optionIndex}
                            type='radio'
                            name={`question-${index}`}
                            label={option}
                            value={option}
                            onChange={(e) =>
                              handleRadioChange(index, e.target.value)
                            } // Add an onChange handler
                            checked={answers[index] === option}
                            required
                          />
                        ))}
                      </Form.Group>
                    )}
                    {question.type === "Boolean" && (
                      <Form.Group className={`input ${styles.input}`} required>
                        <Form.Check
                          type='radio'
                          name={`question-${index}`}
                          label='True'
                          value='true'
                          onChange={() => handleRadioChange(index, "true")}
                          checked={answers[index] === "true"}
                          inline
                          required
                        />
                        <Form.Check
                          type='radio'
                          name={`question-${index}`}
                          label='False'
                          value='false'
                          checked={answers[index] === "false"}
                          onChange={() => handleRadioChange(index, "false")}
                          inline
                        />
                      </Form.Group>
                    )}
                    {question.type === "Number" && (
                      <Form.Group className={`input ${styles.input}`}>
                        <Form.Control
                          type='Number'
                          name={`question-${index}`}
                          className={`form-control ${styles.numberInput}`}
                          value={answers[index] || ""}
                          onChange={(e) =>
                            handleRadioChange(index, e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
        <Row className={`${styles.submitButtonRow}`}>
          {!loader ? (
            <Col xs={12} className={`text-end ${styles.submitButtonCol}`}>
              {submit && (
                <button className={`${styles.submitButton}`} type='submit'>
                  Submit
                </button>
              )}
            </Col>
          ) : (
            <Loader />
          )}
        </Row>
      </Form> */}
      </Layout>
    </>
  );
};

export default Level;
