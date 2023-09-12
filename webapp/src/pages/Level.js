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
  checkLevelStatus,
} from "../components/services/airtable";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";

const Level = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate(); // Initialize the navigate function
  const [pdfData, setPdfData] = useState(null);
  const [isSubmitted, setIssubmitted] = useState(false);
  const location = useLocation();
  const [decryptedData, setDecryptedData] = useState({});
  const [loader, setLoader] = useState(false);
  const [questions, setQustions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submit, setSubmit] = useState(true);
  const [started, setStarted] = useState(false);
  const [firstLoader, setFirstLoader] = useState(false);

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decryptedData);
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
          groupName: data.groupNumber,
          name: data.name,
          gameID: data.GameID,
          role: data.role,
          level: data.level,
          gameName: data.GameName,
          scoreVisibilityForPlayers: data.ScoreVisibilityForPlayers,
          resultsSubbmision: data.ResultsSubbmision,
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
          groupName: data.groupNumber,
          name: data.name,
          gameID: data.GameID,
          role: data.role,
          level: data.level,
          gameName: data.GameName,
          scoreVisibilityForPlayers: data.ScoreVisibilityForPlayers,
          resultsSubbmision: data.ResultsSubbmision,
          sheetID: data.GoogleSheetID,
        }),
      );

      if (data.NumberOfRounds >= data.level) {
        const res = await fetchLevelDetails(formData);

        if (res.success) {
          setQustions(res.data.qustions);
          setSubmit(res.data.submit);
          setPdfData(res.data.instruction);
        }
      } else {
        await completed(decryptedData);
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
    if (encryptedData) {
      decryptAndFetchData(encryptedData);
    }
  }, [location, started, firstLoader]);

  const checkIfLevelStarted = async (decryptedData) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          RoomNumber: decryptedData.roomNumber,
          GameID: decryptedData.GameID,
        }),
      );
      const res = await checkLevelStatus(formData);
      const data = res.data;

      const currentLevel = 1;
      const isLevelStarted = data.some((obj) => obj.Level === currentLevel);

      if (isLevelStarted) {
        setStarted(true);
      } else {
        console.log(`Level ${currentLevel} is not present in the array.`);
      }
      setFirstLoader(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (decryptedData.NumberOfRounds >= decryptedData.level) {
      // setLoader(true);
      const newLevel = decryptedData.level + 1;
      const scoreVisibilityForPlayers = decryptedData.scoreVisibilityForPlayers;
      const resultsSubbmision = decryptedData.resultsSubbmision;
      const formData = new FormData();
      const sheetID = decryptedData.sheetID;
      formData.append(
        "data",
        JSON.stringify({
          email: decryptedData.email,
          roomNumber: decryptedData.roomNumber,
          groupName: decryptedData.groupNumber,
          name: decryptedData.name,
          gameID: decryptedData.GameID,
          role: decryptedData.role,
          level: decryptedData.level,
          gameName: decryptedData.GameName,
          scoreVisibilityForPlayers: decryptedData.ScoreVisibilityForPlayers,
          resultsSubbmision: decryptedData.ResultsSubbmision,
          sheetID: decryptedData.GoogleSheetID,
        }),
      );

      // await storeAnsweres(formData);

      setLoader(false);

      // Update the URL with the new level
      // const updatedEncryptedData = CryptoJS.AES.encrypt(
      //   JSON.stringify({
      //     ...decryptedData,
      //     level: newLevel,
      //     submit: submit,
      //     scoreVisibilityForPlayers,
      //     resultsSubbmision,
      //     sheetID,
      //   }),
      //   "secret_key",
      // ).toString();
      // setAnswers([]);
      // setQustions([]);
      // if (decryptedData.NumberOfRounds >= decryptedData.level) {
      //   navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
      // }
    }

    // localStorage.setItem("answers", JSON.stringify(answers));
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
    setAnswers([]);
    setQustions([]);
    if (decryptedData.NumberOfRounds >= level) {
      navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
    }
    setLoader(false);
  };

  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
  };

  return (
    <div className={`app-container ${styles.levelPage}`}>
      {firstLoader ? (
        <>
          {started ? (
            <>
              {decryptedData.NumberOfRounds >= decryptedData.level ? (
                <>
                  <Row className='mt-4 mb-4'>
                    <Col className={`${styles.rightSection}`}>
                      <div className={`${styles.welcomeText}`}>
                        Welcome to Round {decryptedData.level}
                      </div>
                    </Col>
                  </Row>
                  <Form onSubmit={handleSubmit}>
                    <Row className={` ${styles.paddingTop} flex-grow-1`}>
                      <Col xs={5} className='flex-grow-1'>
                        {!loader ? (
                          <GameDescription
                            pdfData={pdfData}
                            header={"Round scenario"}
                          />
                        ) : (
                          <Loader />
                        )}
                      </Col>
                      <Col
                        xs={6}
                        className={`d-flex flex-column ${styles.rightSide}`}>
                        {!loader ? (
                          <div className={`${styles.questionsContainer}`}>
                            {questions.map((question, index) => (
                              <div
                                key={index}
                                className={`question ${styles.question}`}>
                                <p>{question.question}</p>
                                {question.type === "Multiple-Choice" && (
                                  <Form.Group
                                    className={`options ${styles.options}`}
                                    aria-required>
                                    {question.choices.map(
                                      (option, optionIndex) => (
                                        <Form.Check
                                          key={optionIndex}
                                          type='radio'
                                          name={`question-${index}`}
                                          label={option}
                                          value={option}
                                          onChange={(e) =>
                                            handleRadioChange(
                                              index,
                                              e.target.value,
                                            )
                                          } // Add an onChange handler
                                          checked={answers[index] === option}
                                          required
                                        />
                                      ),
                                    )}
                                  </Form.Group>
                                )}
                                {question.type === "Boolean" && (
                                  <Form.Group
                                    className={`input ${styles.input}`}
                                    required>
                                    <Form.Check
                                      type='radio'
                                      name={`question-${index}`}
                                      label='True'
                                      value='true'
                                      onChange={() =>
                                        handleRadioChange(index, "true")
                                      }
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
                                      onChange={() =>
                                        handleRadioChange(index, "false")
                                      }
                                      inline
                                    />
                                  </Form.Group>
                                )}
                                {question.type === "Number" && (
                                  <Form.Group
                                    className={`input ${styles.input}`}>
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
                        <Col
                          xs={12}
                          className={`text-end ${styles.submitButtonCol}`}>
                          {submit && (
                            <button
                              className={`${styles.submitButton}`}
                              type='submit'>
                              Submit
                            </button>
                          )}
                        </Col>
                      ) : (
                        <Loader />
                      )}
                    </Row>
                  </Form>
                </>
              ) : (
                <>
                  <Row
                    className='d-flex justify-content-center align-items-center'
                    style={{ height: "100vh" }}>
                    <Col className='text-center'>
                      You have successfully completed.{" "}
                      <Link to='/'> Go Home</Link>
                    </Col>
                  </Row>
                </>
              )}
            </>
          ) : (
            <Row
              className='d-flex justify-content-center align-items-center'
              style={{ height: "100vh" }}>
              <Col className='text-center'>
                Level has not started yet. Please wait for some time after the
                admin starts the game. You can enter the game once it begins.
              </Col>
            </Row>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Level;
