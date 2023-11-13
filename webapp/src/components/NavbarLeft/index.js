// Navbar.js
import React, { useEffect, useState } from "react";
import Welcome from "./Welcome";
import Close from "../../icons/Close.svg";
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
        <Welcome name={data.name} />
      </Row>
      <Row>
        <GameDetails data={data} />
      </Row>
      <Row>
        <Players data={data} />
      </Row>
    </Row>
  );
};

export default NavbarLeft;
