import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css"; // Import your CSS file for styling
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useHistory } from "history"; // Import useHistory from 'history' library
import { useNavigate } from "react-router-dom";
import GameDescription from "../components/game/GameDescription";
import { io } from "socket.io-client";

import {
  fetchLevelDetails,
  storeAnsweres,
} from "../components/services/airtable";
import { useLocation } from "react-router-dom";

const Level = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [pdfData, setPdfData] = useState(null);
  const location = useLocation();
  const [decryptedData, setDecryptedData] = useState({});
  const [loader, setLoader] = useState(false);
  const [questions, setQustions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submit, setSubmit] = useState(true);

  const decryptAndFetchData = async (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decryptedData);
      setLoader(true);
      if (decryptedData.numberOfRounds >= decryptedData.level) {
        await fetchLevelDetailsAndSet(decryptedData);
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
          gameID: data.gameID,
          role: data.role,
          level: data.level,
          gameName: data.gameName,
          scoreVisibilityForPlayers: data.scoreVisibilityForPlayers,
          resultsSubbmision: data.resultsSubbmision,
        }),
      );

      const res = await fetchLevelDetails(formData);
      if (res.success) {
        setQustions(res.data.qustions);
        setSubmit(res.data.submit);
        setPdfData(res.data.instruction);
        // localStorage.setItem(`qstions`, JSON.stringify(res.data.qustions));
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    // Listen for events from the server
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("level", (data) => {
      const searchParams = new URLSearchParams(window.location.search);
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
  }, [location]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (decryptedData.numberOfRounds >= decryptedData.level) {
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
          groupName: decryptedData.groupName,
          name: decryptedData.name,
          gameID: decryptedData.gameID,
          role: decryptedData.role,
          level: decryptedData.level + 1,
          gameName: decryptedData.gameName,
          answers: answers,
          resultsSubbmision,
          scoreVisibilityForPlayers,
        }),
      );

      await storeAnsweres(formData);

      // Update the URL with the new level
      const updatedEncryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({
          ...decryptedData,
          level: newLevel,
          submit: submit,
          scoreVisibilityForPlayers,
          resultsSubbmision,
          sheetID,
        }),
        "secret_key",
      ).toString();
      setAnswers([]);
      setQustions([]);
      if (decryptedData.numberOfRounds >= decryptedData.level) {
        navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
      }
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
    setAnswers([]);
    setQustions([]);
    if (decryptedData.numberOfRounds >= level) {
      navigate(`/level?data=${encodeURIComponent(updatedEncryptedData)}`);
    }
  };
  const handleOtherPageClick = () => {
    // Replace "/other-page" with the actual path of the other page
    // history.push("/other-page");
  };
  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
  };

  return (
    <div className={`app-container ${styles.levelPage}`}>
      {decryptedData.numberOfRounds >= decryptedData.level ? (
        <>
          <Row>
            <Col className={`text-end ${styles.rightSection}`}>
              <Link to='/' className={`${styles.icon}`}>
                Home
              </Link>
              <button
                className={`btn btn-link ${styles.icon}`}
                onClick={handleOtherPageClick}>
                Other Page
              </button>
            </Col>
          </Row>
          <Row>
            <Col className={`${styles.rightSection}`}>
              <div className={`${styles.welcomeText}`}>
                Welcome to Round {decryptedData.level}
              </div>
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className={`p-2 mt3 ${styles.paddingTop} flex-grow-1`}>
              <Col xs={5} className='flex-grow-1'>
                <GameDescription pdfData={pdfData} />
              </Col>
              <Col xs={6} className={`d-flex flex-column ${styles.rightSide}`}>
                <h4 className={`${styles.roundHeader}`}>Qustions</h4>
                <div
                  className={`questions-container ${styles.questionsContainer}`}>
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
                        <Form.Group
                          className={`input ${styles.input}`}
                          required>
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
              </Col>
            </Row>
            <Row className={`${styles.submitButtonRow}`}>
              <Col xs={12} className={`text-end ${styles.submitButtonCol}`}>
                {submit && (
                  <Button
                    className={`btn btn-primary ${styles.submitButton}`}
                    variant='primary'
                    type='submit'>
                    Submit
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <>You have successfully completed.</>
      )}
    </div>
  );
};

export default Level;
