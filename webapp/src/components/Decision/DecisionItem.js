// Navbar.js
import React from "react";
import { Row, Col } from "react-bootstrap";
import style from "../../styles/page/Result.module.scss";

const Decision = ({ data, round }) => {
  return (
    <Row className={style.resultItem}>
      <Row className={style.header}>
        <Col xs={6} md={6} className='d-flex align-items-center'>
          <div className={style.round}>Round {round + 1}</div>
        </Col>
        <Col
          xs={6}
          md={6}
          className='d-flex align-items-center justify-content-end'>
          <div className={style.output}>Output</div>
        </Col>
      </Row>
      <Row className={style.header}>
        <Col xs={6} md={6} className='d-flex align-items-center'>
          <div className={style.decision}>Decision</div>
        </Col>
        <Col
          xs={6}
          md={6}
          className='d-flex align-items-left justify-content-left'>
          <div className={style.decision}>Your answers</div>
        </Col>
      </Row>
      {Object.entries(data).map(([key, value]) => (
        <Row className={style.ans}>
          <Col xs={6} md={6} className='d-flex align-items-center'>
            <div className={style.decisio}>{key}</div>
          </Col>
          <Col
            xs={6}
            md={6}
            className='d-flex align-items-left justify-content-left'>
            <div className={style.decisio}>{value}</div>
          </Col>
        </Row>
      ))}
    </Row>
  );
};

export default Decision;
