import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import styles from "./../styles/components/user/EnterGameForm.module.css";
import { joinGame } from "../components/services/airtable";
import CryptoJS from "crypto-js";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

const EnterGameForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [showRoomNumberAlert, setShowRoomNumberAlert] = useState(false);
  const [showGroupNumberAlert, setShowGroupNumberAlert] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowEmailAlert(false);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
    setShowNameAlert(false);
  };

  const handleRoomNumberChange = (event) => {
    setRoomNumber(event.target.value);
    setShowRoomNumberAlert(false);
  };

  const handleGroupNumberChange = (event) => {
    const newValue = event.target.value.replace(/\s+/g, "").toLowerCase();
    setGroupNumber(newValue);
    setShowGroupNumberAlert(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoader(true);
    const data = formatDataForAirtable();
    const res = await joinGame(data);
    if (res.success) {
      const {
        RolesAutoSelection,
        ResultsSubbmision,
        GoogleSheetID,
        GameName,
        NumberOfRounds,
        ScoreVisibilityForPlayers,
        Date,
        GameID,
        roleAutoAssigned,
        gameInstruction,
        role,
      } = res.data;

      localStorage.setItem("gameInstruction", gameInstruction);
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({
          email,
          roomNumber,
          groupNumber,
          name,
          RolesAutoSelection,
          ResultsSubbmision,
          GameName,
          NumberOfRounds,
          ScoreVisibilityForPlayers,
          Date,
          GameID,
          GoogleSheetID,
          roleAutoAssigned,
          role,
        }),
        "secret_key",
      ).toString();

      navigate(`/home?data=${encodeURIComponent(encryptedData)}`);
    } else {
      alert(res.message);
      setLoader(false);
    }
  };

  const formatDataForAirtable = () => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        roomNumber: roomNumber,
        email: email,
        group: groupNumber,
        name: name,
      }),
    );
    return formData;
  };

  return (
    <>
      <AppHeader form={true} />
      <Container className={styles["centered-form-container"]}>
        {!loader ? (
          <Row className={styles["enter-game-form"]}>
            <Col className={styles["top-left-form"]}>
              <div className='d-flex flex-column'>
                <div className='text-center'>
                  <h1 className='form-heading'>Join Game</h1>
                </div>
                <Form onSubmit={handleSubmit} className='pt-3 text-left'>
                  <Form.Group controlId='formEmail' className='mt-2'>
                    <Form.Label className={styles["form-text"]}>
                      Email:
                    </Form.Label>
                    <Form.Control
                      type='email'
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    {showEmailAlert && (
                      <p className='alert'>Please enter your email.</p>
                    )}
                  </Form.Group>
                  <Form.Group controlId='formName' className='mt-3'>
                    <Form.Label className={styles["form-text"]}>
                      Name:
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={name}
                      pattern='[a-zA-Z]{3,}'
                      onChange={handleNameChange}
                      required
                    />
                    {showNameAlert && (
                      <p className='alert'>Please enter your Name.</p>
                    )}
                  </Form.Group>

                  <Form.Group controlId='formRoomNumber' className='mt-3'>
                    <Form.Label className={styles["form-text"]}>
                      Room Number:
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={roomNumber}
                      onChange={handleRoomNumberChange}
                      required
                    />
                    {showRoomNumberAlert && (
                      <p className='alert'>Please enter the room number.</p>
                    )}
                  </Form.Group>
                  <Form.Group controlId='formGroupNumber' className='mt-3'>
                    <Form.Label className={styles["form-text"]}>
                      Group Name:
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={groupNumber}
                      onChange={handleGroupNumberChange}
                      pattern='^[a-z]{3,}$'
                      required
                    />
                    {showGroupNumberAlert && (
                      <p className='alert'>
                        Please enter a valid group number.
                      </p>
                    )}
                  </Form.Group>
                  <div className='text-center mt-5'>
                    <button className={`${styles.loginButton}`} type='submit'>
                      Join Game
                    </button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
};

export default EnterGameForm;
