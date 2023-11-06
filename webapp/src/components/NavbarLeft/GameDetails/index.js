import React, { useEffect, useState } from "react";
import style from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Row, Col } from "react-bootstrap";
import { decryptData, getDataFromURL } from "../../helper/utils";
import Loader from "../../../pages/Loader";
import { useLocation } from "react-router-dom";

const GameDetails = ({ name }) => {
  const location = useLocation();
  const [data, setData] = useState({});

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
  }, []);
  return (
    <div className={style.GameDetails}>
      <Row className={`${style.GameDetailsHeader}`}>Game details</Row>
      <Row className={`${style.DetailsRow}`}>
        <Col className={`${style.LeftColumn} text-left m-2`}>Game name</Col>
        <Col className={`${style.RightColumn} text-left m-2`}>
          {data.GameName}
        </Col>
      </Row>
      <Row className={`${style.DetailsRow}`}>
        <Col className={`${style.LeftColumn} text-left m-2`}>Group name</Col>
        <Col className={`${style.RightColumn} text-left m-2`}>
          {data.groupName}
        </Col>
      </Row>
      <Row className={`${style.DetailsRow}`}>
        <Col className={`${style.LeftColumn} text-left m-2`}>
          Number of rounds
        </Col>
        <Col className={`${style.RightColumn} text-left m-2`}>
          {data.NumberOfRounds}
        </Col>
      </Row>
    </div>
  );
};

export default GameDetails;
