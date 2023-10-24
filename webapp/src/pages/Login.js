import React, { useState, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import styles from "./../styles/components/user/EnterGameForm.module.css";
import { joinGame } from "../components/services/airtable";
import CryptoJS from "crypto-js";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { AdminAuthContext } from "./../components/auth/AdminAuth";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AdminAuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();

    if (userId === "admin" && password === "admin") {
      login();
      navigate("/dashboard");
    } else {
      alert("Incorrect user id or password. Please try again.");
    }
  };

  return (
    <>
      <AppHeader form={true} />
      <Container className={styles["centered-form-container"]}>
        <Row className={styles["enter-game-form"]}>
          <Col className={styles["top-left-form"]}>
            <div className='d-flex flex-column'>
              <div className='text-center'>
                <div className={styles.formHeading}>Login</div>
              </div>
              <Form onSubmit={handleSubmit} className='pt-3 text-left'>
                <Form.Group controlId='formRoomNumber' className='mt-3'>
                  <Form.Label className={styles["form-text"]}>
                    User Id
                  </Form.Label>
                  <Form.Control
                    type='text'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId='formGroupName' className='mt-3'>
                  <Form.Label className={styles["form-text"]}>
                    Password
                  </Form.Label>
                  <Form.Control
                    type='password' // Change input type to 'password' to hide password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className='text-center mt-5'>
                  <button className={`${styles.loginButton}`} type='submit'>
                    Login
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
