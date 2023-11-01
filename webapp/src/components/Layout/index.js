import React, { useState } from "react";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import ToggleButton from "../ToggleButton";
import Closed from "../NavbarLeft/Closed";
import style from "../../styles/components/Layout.module.scss";

const Layout = ({ LeftNavbar, rightNavbar, children }) => {
  const [isLeftNavbarVisible, setIsLeftNavbarVisible] = useState(true);
  const [isRightNavbarVisible, setIsRightNavbarVisible] = useState(true);

  const toggleLeftNavbar = () => {
    setIsLeftNavbarVisible(!isLeftNavbarVisible);
  };

  const toggleRightNavbar = () => {
    setIsRightNavbarVisible(!isRightNavbarVisible);
  };
  function calculateColumnSize(leftVisible, rightVisible) {
    if (leftVisible && rightVisible) {
      return 6;
    }
    if (leftVisible || rightVisible) {
      return 9;
    }
    return 10;
  }

  return (
    <>
      <Row className='m-0'>
        <Col
          className={`${style.container} ${
            !isLeftNavbarVisible ? style["custom-width-5"] : ""
          }`}
          xs={isLeftNavbarVisible ? 3 : 1}
          md={isLeftNavbarVisible ? 3 : 1}>
          {isLeftNavbarVisible ? (
            <LeftNavbar onClick={toggleLeftNavbar} />
          ) : (
            <Closed onClick={toggleLeftNavbar} />
          )}
        </Col>

        <Col
          className={`content p-0 ${
            !isLeftNavbarVisible || !isRightNavbarVisible ? "full-width" : ""
          }`}
          // xs={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}
          // md={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}
        >
          {children}
        </Col>
        {isRightNavbarVisible && (
          <Col
            className='navbar-right'
            xs={isRightNavbarVisible ? 3 : 1}
            md={isRightNavbarVisible ? 3 : 1}>
            {rightNavbar}
            <button onClick={toggleRightNavbar}>Hide Right Navbar</button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default Layout;
