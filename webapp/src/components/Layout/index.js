import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Closed from "../NavbarLeft/Closed";
import style from "../../styles/components/Layout.module.scss";

const Layout = ({ LeftNavbar, RightNavbar, children, left = true }) => {
  const [isLeftNavbarVisible, setIsLeftNavbarVisible] = useState(
    !!LeftNavbar && left,
  );
  const [isRightNavbarVisible, setIsRightNavbarVisible] = useState(
    !!RightNavbar,
  );
  const [width, setWidth] = useState("customWidth50");

  const toggleLeftNavbar = () => {
    setIsLeftNavbarVisible(!isLeftNavbarVisible);
    calculateWidth(!isLeftNavbarVisible, isRightNavbarVisible);
  };

  const toggleRightNavbar = () => {
    setIsRightNavbarVisible(!isRightNavbarVisible);
    calculateWidth(isLeftNavbarVisible, !isRightNavbarVisible);
  };

  function calculateColumnSize(leftVisible, rightVisible) {
    if (RightNavbar) {
      return leftVisible || rightVisible ? 7 : 10;
    } else {
      return leftVisible ? 9 : 11;
    }
  }

  function calculateWidth(leftVisible, rightVisible) {
    if (RightNavbar) {
      if (leftVisible && rightVisible) {
        setWidth("customWidth50");
        return 7;
      }
      if (leftVisible) {
        setWidth("customWidth70");
        return 5;
      }
      if (rightVisible) {
        setWidth("customWidth63");
        return 5;
      }
      if (!leftVisible && !rightVisible) {
        setWidth("customWidth90");
        return 10;
      }
    } else {
      if (leftVisible) {
        setWidth("customWidth75");
        return style.customWidth75;
      } else {
        setWidth("custom_Width_full");
        return style.custom_Width_full;
      }
    }
  }

  useEffect(() => {
    calculateWidth(isLeftNavbarVisible, isRightNavbarVisible);
  }, [width]);

  return (
    <Row className='m-0 p-0'>
      {isLeftNavbarVisible ? (
        <Col xs={3} md={3} className={style.leftContainer}>
          <LeftNavbar onClick={toggleLeftNavbar} />
        </Col>
      ) : (
        <Col
          xs={1}
          md={1}
          className={`${style.leftContainer} ${style.customwidth5}`}>
          <Closed onClick={toggleLeftNavbar} text='Details' />
        </Col>
      )}
      <Col
        className={`content p-0 m-0 ${style[width]}`}
        xs={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}
        md={calculateColumnSize(isLeftNavbarVisible, isRightNavbarVisible)}>
        {children}
      </Col>
      {RightNavbar && (
        <>
          {isRightNavbarVisible ? (
            <Col
              xs={3}
              md={3}
              className={`${style.rightContainer} ${style.customwidth33}`}>
              <RightNavbar onClick={toggleRightNavbar} />
            </Col>
          ) : (
            <Col
              xs={1}
              md={1}
              className={`${style.rightContainer} ${style.customwidth5} `}
              style={{ color: "#fff" }}>
              <Closed
                onClick={toggleRightNavbar}
                text='Decisions'
                className={style.right_closed_container}
                right={true}
                style={{ color: "#fff" }}
              />
            </Col>
          )}
        </>
      )}
    </Row>
  );
};

export default Layout;
