// Navbar.js
import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import style from "../../styles/components/navbar/Right.module.scss";
import Welcome from "./Welcome";
import Open from "../../icons/Open.svg";
import { useLocation } from "react-router-dom";
import { decryptData, getDataFromURL } from "../helper/utils";
import Decision from "./Decision";

const NavbarRight = ({ onClick }) => {
  const location = useLocation();
  const [data, setData] = useState({});

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
  }, []);

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
        <Welcome level={data.level} role={data.role} />
      </Row>
      <Row>
        <Decision data={data} />
      </Row>
    </Row>
  );
};

export default NavbarRight;
