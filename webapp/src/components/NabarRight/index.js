// Navbar.js
import React from "react";
import { Row, Col } from "react-bootstrap";
import style from "../../styles/components/navbar/Right.module.scss";
import Welcome from "./Welcome";
import Close from "../../icons/Close.svg";
import Open from "../../icons/Open.svg";

const NavbarRight = ({ onClick }) => {
  return (
    <Row className={`${style.container} r-0 p-0`}>
      <Row>
        <Col xs={4} md={2}>
          <img
            onClick={onClick}
            src={Open}
            alt='Back Icon'
            width='100'
            height='80'
          />
        </Col>
        <Col xs={8} md={10}></Col>
      </Row>
      <Row>
        <Welcome />
      </Row>
    </Row>
  );
};

export default NavbarRight;
