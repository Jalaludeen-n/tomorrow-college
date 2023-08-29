import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "./../styles/components/user/EnterGameForm.css";
import { joinGame } from "../components/services/airtable";
import CryptoJS from "crypto-js";
import Loader from "./Loader";

const EnterGameForm = () => {
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
        }),
        "secret_key",
      ).toString();

      window.location.href = `/details?data=${encodeURIComponent(
        encryptedData,
      )}`;
    } else {
      console.log(res);
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
    <Container className='centered-form-container'>
      {!loader ? (
        <Row className='enter-game-form'>
          <Col className='text-center d-flex flex-wrap align-items-center'>
            <h1 className='form-heading'>Join Game</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formEmail'>
                <Form.Label>Email:</Form.Label>
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
              <Form.Group controlId='formName'>
                <Form.Label>Name:</Form.Label>
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

              <Form.Group controlId='formRoomNumber'>
                <Form.Label>Room Number:</Form.Label>
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
              <Form.Group controlId='formGroupNumber'>
                <Form.Label>Group Name:</Form.Label>
                <Form.Control
                  type='text'
                  value={groupNumber}
                  onChange={handleGroupNumberChange}
                  pattern='^[a-z]{3,}$'
                  required
                />
                {showGroupNumberAlert && (
                  <p className='alert'>Please enter a valid group number.</p>
                )}
              </Form.Group>
              <Button variant='primary' type='submit'>
                Enter the Game
              </Button>
            </Form>
          </Col>
        </Row>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default EnterGameForm;
