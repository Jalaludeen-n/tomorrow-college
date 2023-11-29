import React from "react";
import style from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Row } from "react-bootstrap";
import { getCurrentFormattedDate } from "../../helper/date";

const Welcome = ({ name }) => {
  return (
    <div className={style.welcome_container}>
      <Row className={`${style.welcomeName} `}>Welcome {name}!</Row>
      <Row className={`${style.welcomeDate} `}>{getCurrentFormattedDate()}</Row>
    </div>
  );
};

export default Welcome;
