import React, { useState, useEffect } from "react";
import styles from "../styles/page/Level.module.css"; // Import your CSS file for styling
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  fetchLevelDetails,
  storeAnsweres,
} from "../components/services/airtable";

const Level = () => {
  const [pdfData, setPdfData] = useState("");
  const [decryptedData, setDecryptedData] = useState();
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
      await fetchLevelDetailsAndSet(decryptedData);

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
        localStorage.setItem(`qstions`, JSON.stringify(res.data.qustions));
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encryptedData = searchParams.get("data");
    const storedAnswers = JSON.parse(localStorage.getItem("answers"));
    const storedQustions = JSON.parse(localStorage.getItem("qstions"));

    if (encryptedData && !storedAnswers) {
      decryptAndFetchData(encryptedData);
    } else {
      setAnswers(storedAnswers);
      setQustions(storedQustions);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAnswers = Array.from(formData.entries()).map(
      ([key, value]) => value,
    );
    setAnswers(newAnswers);
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        email: decryptedData.email,
        roomNumber: decryptedData.roomNumber,
        groupName: decryptedData.groupName,
        name: decryptedData.name,
        gameID: decryptedData.gameID,
        role: decryptedData.role,
        level: decryptedData.level,
        gameName: decryptedData.gameName,
        answers: answers,
      }),
    );

    await storeAnsweres(formData);

    // Store answers in local storage
    localStorage.setItem("answers", JSON.stringify(newAnswers));
  };

  const handleOtherPageClick = () => {
    // Replace "/other-page" with the actual path of the other page
    // history.push("/other-page");
  };
  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
    console.log(newAnswers);
  };

  return (
    <div className={`app-container ${styles.levelPage}`}>
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
          <div className={`${styles.welcomeText}`}>Welcome to Round 1</div>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className={`p-2 mt3 ${styles.paddingTop} flex-grow-1`}>
          <Col xs={5} className='flex-grow-1'>
            ds
          </Col>
          <Col xs={6} className={`d-flex flex-column ${styles.rightSide}`}>
            <h4 className={`${styles.roundHeader}`}>Qustions</h4>
            <div className={`questions-container ${styles.questionsContainer}`}>
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
    </div>
  );
  {
    /* </div>
    <div className='game-details-container'>
      {/* Left Side - PDF and Level Header */
  }
  <div className='left-side'>
    <div className='pdf-container'>
      {/* <iframe
            src={`data:application/pdf;base64,${pdfData}`}
            title='PDF'
            width='100%'
            height='100%'
          /> */}
      <iframe
        // src={pdfPath}
        title='PDF Viewer'
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          zoom: "100%",
        }}
        sandbox='allow-modals allow-scripts allow-same-origin'
      />
    </div>
    <div className='level-header'>
      <h2>Level</h2>
    </div>
  </div>;

  /* Right Side - Round Header and GK Questions */
};

export default Level;
