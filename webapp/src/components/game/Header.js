import React from "react";
import styles from "../../styles/components/game/Header.module.scss"; // Use the SCSS Module import
import { Container, Row, Form, Col, Button } from "react-bootstrap";

const EnterGameForm = ({ gameName, groupName, numberOfRounds }) => {
  //   const { values, handleChange, handleSubmit, validateField, errors } =
  //     useForm();

  return (
    <Row
      className={`pt-4 mt-3 ${styles["top-section"]} align-items-center justify-content-between`}>
      <Col className={styles["top-section__message-container"]}>
        <div
          className={`${styles["top-section__message-container__welcome-message"]} mb-2`}>
          Welcome to {gameName}
        </div>
        <div className={`${styles["top-section__message-container__date"]}`}>
          {groupName}
        </div>
      </Col>
      <Col
        className={`${styles["top-section__top-buttons"]} d-flex flex-column align-items-end justify-content-end `}>
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
