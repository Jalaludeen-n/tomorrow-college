import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import styles from "./../styles/components/user/EnterGameForm.module.css";
import { joinGame } from "../components/services/airtable";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { encryptData, setLocalStorageItem } from "../components/helper/utils";

const EnterGameForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [showRoomNumberAlert, setShowRoomNumberAlert] = useState(false);
  const [showGroupNameAlert, setShowGroupNameAlert] = useState(false);
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

  const handleGroupNameChange = (event) => {
    const newValue = event.target.value.replace(/\s+/g, "").toLowerCase();
    setGroupName(newValue);
    setShowGroupNameAlert(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();
    setLoader(true);
    const data = formatDataForAirtable();
    const res = await joinGame(data);
    if (res.success) {
      const { gameData, gameInstruction } = formatGameData(
        res,
        email,
        roomNumber,
        groupName,
        name,
      );
      setLocalStorageItem("gameInstruction", gameInstruction);
      const encryptedData = encryptData(gameData, "secret_key");
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
        group: groupName,
        name: name,
      }),
    );
    return formData;
  };
  const formatGameData = (res, email, roomNumber, groupName, name) => {
    if (res.success) {
      const {
        RolesAutoSelection,
        ResultsSubmission,
        GoogleSheetID,
        GameName,
        NumberOfRounds,
        ScoreVisibilityForPlayers,
        Date,
        GameID,
        roleAutoAssigned,
        gameInstruction,
        role,
        submit,
        level,
        IndividualInstructionsPerRound,
      } = res.data;

      const gameData = {
        email,
        roomNumber,
        groupName,
        name,
        RolesAutoSelection,
        ResultsSubmission,
        GameName,
        NumberOfRounds,
        ScoreVisibilityForPlayers,
        Date,
        GameID,
        GoogleSheetID,
        roleAutoAssigned,
        role,
        submit,
        level,
        individualInstructionsPerRound: IndividualInstructionsPerRound,
      };

      return { gameData, gameInstruction };
    } else {
      throw new Error("Failed to format game data");
    }
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
                  <div className={styles.formHeading}>Join Game</div>
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
                  <Form.Group controlId='formGroupName' className='mt-3'>
                    <Form.Label className={styles["form-text"]}>
                      Group Name:
                    </Form.Label>
                    <Form.Control
                      type='text'
                      value={groupName}
                      onChange={handleGroupNameChange}
                      pattern='^[a-z]{3,}$'
                      required
                    />
                    {showGroupNameAlert && (
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
