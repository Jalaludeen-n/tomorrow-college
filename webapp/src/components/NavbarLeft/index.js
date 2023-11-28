// Navbar.js
import React, { useEffect, useState } from "react";
import Welcome from "./Welcome";
import Close from "../../icons/Back.svg";
import { Row, Col } from "react-bootstrap";
import GameDetails from "./GameDetails";
import Players from "./Players";
import style from "../../styles/components/navbar/Left.module.scss";
import { useLocation } from "react-router-dom";
import { decryptData, getDataFromURL } from "../helper/utils";

const NavbarLeft = ({ onClick }) => {
  const location = useLocation();
  const [data, setData] = useState({});

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
  }, []);

  return (
    <Row
      className={`${style.container} r-0 p-0`}
      style={{
        flexShrink: "unset",
        width: "auto",
        maxWidth: "none",
        padding: 0,
        marginTop: 0,
        margin: 0,
      }}>
      <Row className='r-0 p-0'>
        <Col xs={8} md={10}></Col>
        <Col
          xs={4}
          md={2}
          className='d-flex justify-content-end align-items-center order-md-2 pointer'>
          <img
            onClick={onClick}
            src={Close}
            alt='Back Icon'
            width='50'
            height='80'
          />
        </Col>
      </Row>

      <Row
        className=''
        style={{
          flexShrink: "unset",
          maxWidth: "none",
          padding: 0,
          margin: 0,
        }}>
        <Welcome name={data.name} />
      </Row>
      <Row
        className=''
        style={{
          flexShrink: "unset",
          width: "auto",
          maxWidth: "none",
          padding: 0,
          margin: 0,
        }}>
        <GameDetails data={data} />
      </Row>
      <Row
        className=''
        style={{
          flexShrink: "unset",
          width: "auto",
          maxWidth: "none",
          padding: 0,
          margin: 0,
        }}>
        <Players data={data} />
      </Row>
    </Row>
  );
};

export default NavbarLeft;
