// Navbar.js
import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import style from "../../styles/page/Result.module.scss";
import PopupComponent from "../popup";
import GameDescription from "../game/GameDescription";
import { fetchResultPdf } from "../services/decision";

const Decision = ({ data, round, fullData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [pdf, setRoundPdf] = useState(null);

  const togglePopup = async () => {
    const formatData = {
      sheetID: fullData.GoogleSheetID,
      level: parseInt(round) + 2,
    };
    console.log(formatData);
    if (!showPopup) {
      const res = await fetchResultPdf(formatData);
      setRoundPdf(res.data);
    }
    setShowPopup(!showPopup);
  };
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
          <div className={style.output} onClick={togglePopup}>
            Output
          </div>
        </Col>
      </Row>
      <Row className={style.header}>
        <Col xs={6} md={6} className='d-flex align-items-center'>
          <div className={style.decisions}>Decision</div>
        </Col>
        <Col
          xs={6}
          md={6}
          className='d-flex align-items-left justify-content-left'>
          <div className={style.decisions}>Your answers</div>
        </Col>
      </Row>
      {Object.entries(data).map(([key, value]) => (
        <Row className={style.ans}>
          <Col xs={6} md={6} className='d-flex align-items-center'>
            <div className={style.decis}>{key}</div>
          </Col>
          <Col
            xs={6}
            md={6}
            className='d-flex align-items-left justify-content-left'>
            <div className={style.decisi}>{value}</div>
          </Col>
        </Row>
      ))}
      {showPopup && (
        <PopupComponent
          onClose={togglePopup}
          contentComponent={<GameDescription pdfData={pdf} show={false} />}
        />
      )}
    </Row>
  );
};

export default Decision;
