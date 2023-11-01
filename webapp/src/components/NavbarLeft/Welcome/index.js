import React from "react";
import styles from "../../../styles/components/game/Header.module.scss"; // Use the SCSS Module import
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import { getCurrentFormattedDate } from "../../helper/date";

const Welcome = ({ name }) => {
  return (
    <>
      Welcome to {name}
      <div>{getCurrentFormattedDate()}</div>
    </>
  );
};

export default Welcome;
