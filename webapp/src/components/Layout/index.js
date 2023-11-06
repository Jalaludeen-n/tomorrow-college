import React, { useState } from "react";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import Closed from "../NavbarLeft/Closed";
import style from "../../styles/components/Layout.module.scss";

const Layout = ({ LeftNavbar, RightNavbar, children }) => {
  const [isLeftNavbarVisible, setIsLeftNavbarVisible] = useState(!!LeftNavbar);
  const [isRightNavbarVisible, setIsRightNavbarVisible] = useState(
    !!RightNavbar,
  );

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
    return 11;
  }

  return (
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
        className={`content p-0 m-0 ${
          !isLeftNavbarVisible && !isRightNavbarVisible
            ? style["full-width"]
            : ""
        }`}
        xs={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}
        md={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}>
        {children}
      </Col>
      {isRightNavbarVisible && (
        <Col
          className='navbar-right p-0 m-0'
          xs={isRightNavbarVisible ? 3 : 1}
          md={isRightNavbarVisible ? 3 : 1}>
          {RightNavbar}
          <button onClick={toggleRightNavbar}>Hide Right Navbar</button>
        </Col>
      )}
    </Row>
  );
};

export default Layout;
