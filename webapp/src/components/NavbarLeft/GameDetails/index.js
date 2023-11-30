import React from "react";
import style from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Row, Col } from "react-bootstrap";

const GameDetails = ({ data }) => {
  return (
    <div className={style.GameDetails}>
      <Row
        className={`${style.GameDetailsHeader}`}
        style={{
          marginLeft: 0,
          marginRight: 0,
        }}>
        Game details
      </Row>
      <Row className={`${style.GameDetailItems} p-0 m-0`}>
        <Row className={`${style.DetailsRow} p-0 m-0`}>
          <Col className={`${style.LeftColumn} text-left mr-2 mt-2 mb-2`}>
            Game name
          </Col>
          <Col className={`${style.RightColumn} text-left m-2`}>
            {data.GameName}
          </Col>
        </Row>
        <Row className={`${style.DetailsRow}`}>
          <Col
            className={`${style.LeftColumn} text-left mr-2 mt-2 mb-2`}
            style={{
              marginLeft: "3px",
            }}>
            Group name
          </Col>
          <Col className={`${style.RightColumn} text-left m-2`}>
            {data.groupName}
          </Col>
        </Row>
        <Row className={`${style.DetailsRow}`}>
          <Col className={`${style.LeftColumn} text-left mr-2 mt-2 mb-2`}>
            No. of rounds
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
