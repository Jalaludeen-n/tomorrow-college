import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/navbar/Right.module.scss";
import { Row, Form, Col } from "react-bootstrap";
import {
  decryptData,
  encryptData,
  getDataFromURL,
  isObjectEmpty,
} from "../../helper/utils";
import { fetchQustions, storeAnsweres } from "../../services/decision";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../../pages/Loader";
import { io } from "socket.io-client";

const Decision = ({ data }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;

  const [questions, setQustions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchLevelDetailsAndSet = async (data) => {
    setLoader(true);
    const formData = {
      level: data.level,
      sheetID: data.GoogleSheetID,
    };

    try {
      const res = await fetchQustions(formData);
      setQustions(res.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (!isObjectEmpty(data)) {
      fetchLevelDetailsAndSet(data);
    }
  }, [data, fetchQustions]);

  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (event) => {
    setLoader(true);
    const formData = new FormData();
    event.preventDefault();

    formData.append(
      "data",
      JSON.stringify({
        sheetID: data.GoogleSheetID,
        answers: answers,
        level: data.level,
        groupName: data.groupName,
        gameId: data.GameID,
        roomNumber: data.roomNumber,
        email: data.email,
        resultsSubmission: data.ResultsSubmission,
        numberOfRounds: data.NumberOfRounds,
        name: data.name,
      }),
    );

    const res = await storeAnsweres(formData);
    const updatedData = {
      ...data,
      level: res.data.CurrentLevel,
      started: res.data.started,
      completed: res.data.completed,
    };
    const encryptedData = encryptData(updatedData, "secret_key");
    navigate(`/result?data=${encodeURIComponent(encryptedData)}`);
  };

  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("Movelevel", (data) => {
      const encryptedData = getDataFromURL(location);
      const key = "secret_key";
      const decryptedData = decryptData(encryptedData, key);
      const updatedData = {
        ...decryptedData,
        level: data.CurrentLevel,
        started: data.started,
        completed: data.completed,
      };

      if (
        data.email != decryptedData.email &&
        data.groupName == decryptedData.groupName
      ) {
        alert(
          `Your team, led by ${data.name}, has submitted the answer, so we are redirecting to the result page.`,
        );
        const newData = encryptData(updatedData, "secret_key");
        navigate(`/result?data=${encodeURIComponent(newData)}`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [location]);

  return (
    <div className={styles.decision_container}>
      {loader ? (
        <Loader />
      ) : (
        <>
          <Row className={`${styles.decision_header} `}>Decisions</Row>
          <Form onSubmit={handleSubmit}>
            <Col className={`${styles.questionsContainer}`}>
              {questions.length > 0 &&
                questions.map((question, index) => (
                  <div key={index} className={`question ${styles.questions}`}>
                    <Form.Label className={`question ${styles.question}`}>
                      {question.question}
                    </Form.Label>
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
                            }
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
                    {question.type === "Text" && (
                      <Form.Group className={`input ${styles.input}`}>
                        <Form.Control
                          type='text'
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
            </Col>
            {data && data.submit && (
              <div className={styles.startButtonContainer}>
                <button className={styles.startButton} type='submit'>
                  Submit
                </button>
              </div>
            )}
          </Form>
        </>
      )}
    </div>
  );
};

export default Decision;
