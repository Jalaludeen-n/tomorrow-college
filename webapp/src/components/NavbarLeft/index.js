// Navbar.js
import React from "react";
import Welcome from "./Welcome";
import Close from "../../icons/Close.svg";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import GameDetails from "./GameDetails";
import Players from "./Players";

const NavbarLeft = ({ onClick }) => {
  return (
    <Row>
      <Row>
        <Col
          xs={4}
          md={2}
          className='d-flex justify-content-end align-items-center'>
          <img
            onClick={onClick}
            className={`img-fluid`}
            src={Close}
            alt='Back Icon'
            width='50'
            height='20'
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
