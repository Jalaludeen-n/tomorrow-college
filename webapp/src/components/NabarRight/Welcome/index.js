import React from "react";
import style from "../../../styles/components/navbar/Right.module.scss"; // Use the SCSS Module import
import { Row } from "react-bootstrap";
import { getCurrentFormattedDate } from "../../helper/date";

const Welcome = ({ level, role }) => {
  return (
    <div className={style.welcome_container}>
      <Row className={`${style.welcomeName} `}>Welcome to Round {level}</Row>
      <Row className={`${style.welcomeRole} `}>Your role is {role}</Row>
    </div>
  );
};

export default Welcome;
