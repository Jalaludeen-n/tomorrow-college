import React from "react";
import styles from "../../styles/components/game/Header.module.scss"; // Use the SCSS Module import
import { Container, Row, Form, Col, Button } from "react-bootstrap";

const EnterGameForm = ({ gameName, groupName, numberOfRounds }) => {
  return (
    <Row className={` ${styles["topSection"]} `}>
      <Col className={styles["topSection__message-container"]}>
        <div
          className={`${styles["topSection__message-container__welcome-message"]} mb-2`}>
          Welcome to {gameName}
        </div>
        <div className={`${styles["topSection__message-container__date"]}`}>
          {groupName}
        </div>
      </Col>
      <Col
        className={`${styles["topSection__top-buttons"]} d-flex flex-column align-items-end justify-content-end `}>
        <div
          className={`${styles["combined-button"]} ${styles["combined-button-text"]}`}>
          <div className={styles["combined-button__number"]}>
            {numberOfRounds}
          </div>
        </div>
        <div
          className={`${styles["combined-button-text"]} ${styles["combined-button__text"]} text-center`}>
          Game Rounds
        </div>
      </Col>
    </Row>
  );
};

export default EnterGameForm;
