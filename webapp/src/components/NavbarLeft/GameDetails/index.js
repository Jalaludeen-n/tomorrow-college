import React from "react";
import style from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Row, Col } from "react-bootstrap";

const GameDetails = ({ data }) => {
  return (
    <div className={style.GameDetails}>
      <Row className={`${style.GameDetailsHeader}`}>Game details</Row>
      <Row className={style.GameDetailItems}>
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
      </Row>
    </div>
  );
};

export default GameDetails;
