// Navbar.js
import React from "react";
import Welcome from "./Welcome";
import Close from "../../icons/Close.svg";
import Open from "../../icons/Open.svg";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import GameDetails from "./GameDetails";
import Players from "./Players";
import style from "../../styles/components/navbar/Left.module.scss";

const NavbarLeft = ({ onClick }) => {
  return (
    <Row className={`${style.container} r-0 p-0`}>
      <Row>
        <Col xs={8} md={10}></Col>
        <Col
          xs={4}
          md={2}
          className='d-flex justify-content-end align-items-center order-md-2'>
          <img
            onClick={onClick}
            src={Close}
            alt='Back Icon'
            width='100'
            height='80'
          />
        </Col>
      </Row>

      <Row>
        <Welcome name='Anna' />
      </Row>
      <Row>
        <GameDetails name='Anna' />
      </Row>
      <Row>
        <Players name='Anna' />
      </Row>
    </Row>
  );
};

export default NavbarLeft;
