import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { fetchScore, fetchMember } from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import styles from "../styles/page/ViewRoom.module.scss";
import style from "../styles/page/Score.module.scss";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import Arrow from "../icons/Arrow.svg";

const Score = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const location = useLocation();
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [loader, setLoader] = useState(false);
  const [scoreLoader, setScoreLoader] = useState(false);
  const [total, setTotal] = useState(0);
  const [groupMembers, setGroupMembers] = useState([{}]);
  const [data, setData] = useState([{}]);
  const [pdf, setPdf] = useState(null);
  const [sheetID, setSheetID] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const [type, setType] = useState("");

  const goBack = () => {
    window.history.back();
  };

  const getScore = async (level) => {
    try {
      setScoreLoader(true);
      const gameID = decryptedData.gameID;
      const roomNumber = decryptedData.roomNumber;
      const groupName = decryptedData.groupName;
      const formData = new FormData();
      const email = groupMembers[selectedMemberIndex].ParticipantEmail;

      formData.append(
        "data",
        JSON.stringify({
          gameID,
          roomNumber,
          groupName,
          email: email,
          level,
        }),
      );

      const res = await fetchScore(formData);
      setScoreLoader(false);

      setType(res.type);
      if (res.type === "number") {
        setData(res.data);
      } else {
        setPdf(res.data);
      }
      setSheetID(res.sheetID);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const storeMember = async (index) => {
    try {
      setSelectedMemberIndex(index);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async (roomNumber, gameID, groupName) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          gameID,
          roomNumber,
          groupName,
        }),
      );
      await getScore(selectedLevel);
      const res = await fetchMember(formData);
      setGroupMembers(res.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoader(true);
    const searchParams = new URLSearchParams(location.search);
    const encryptedData = searchParams.get("data");
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decryptedData);
      const total = decryptedData.total;
      setTotal(total);
      fetchData(
        decryptedData.roomNumber,
        decryptedData.gameID,
        decryptedData.groupName,
      );
    }
  }, []);
  return (
    <Container className={styles.viewRoom__container}>
      <Row>
        <Col className={styles.viewRoom__container__GamePageTitle}>
          <img
            src={Arrow}
            alt='arrow '
            className='arrow'
            onClick={goBack}
            style={{ cursor: "pointer" }}
          />

          <div className='title'>Group page</div>
        </Col>
      </Row>
      <Row className={`mt-4 ${styles.gameInfo}`}>
        <Col md={8}>
          <div className='mb-2'>Group name</div>
        </Col>
      </Row>
      <Row>
        <Col
          className={`d-flex flex-column align-items-left justify-content-center ${styles.gameInfoName}`}>
          <div className='p-4'>{decryptedData && decryptedData.groupName}</div>
        </Col>
      </Row>

      <>
        {!loader ? (
          <Row>
            <Col md={4}>
              <div className={styles.gameList}>
                <div
                  className={`${styles.gameList__headline} align-items-center`}>
                  Group members
                </div>
                <Row className={`list-unstyled ${style.memberList} p-0 m-0 `}>
                  {groupMembers.map((member, index) => (
                    <Row
                      key={index}
                      className={` p-0 m-3  ${
                        selectedMemberIndex === index
                          ? `${styles.fontWeightBold}`
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => storeMember(index)}>
                      <Col
                        md={1}
                        className={`text-center p-0 m-0  ${
                          selectedMemberIndex === index
                            ? `${styles.fontWeightBold}`
                            : ""
                        }`}>
                        {index + 1}
                      </Col>
                      <Col
                        md={11}
                        className={`text-left p-0 m-0  ${
                          selectedMemberIndex === index
                            ? `${styles.fontWeightBold}`
                            : ""
                        }`}>
                        {member.Name}
                      </Col>
                    </Row>
                  ))}
                </Row>
              </div>
            </Col>
            <Col>
              <div className={styles.gameList}>
                <div className={styles.gameList__headline}>
                  Group submission
                </div>
                <Row className={` p-4 ${style.levelHeader} m-0`}>
                  {Array.from({ length: total }, (_, index) => (
                    <Col
                      key={index}
                      style={{
                        cursor: "pointer",
                        fontWeight:
                          selectedLevel === index + 1 ? "bold" : "normal",
                      }}
                      onClick={() => {
                        setSelectedLevel(index + 1);
                        getScore(index + 1);
                      }}>
                      Level {index + 1}
                    </Col>
                  ))}
                </Row>

                <Row className=' d-flex justify-content-center align-items-center'>
                  {!scoreLoader ? (
                    <div>
                      {data.type === "number" ? (
                        <Col
                          className='d-flex align-items-center justify-content-center'
                          style={{
                            width: "100%",
                            height: "50vh",
                          }}>
                          Score: {data}
                        </Col>
                      ) : (
                        <Col>
                          <iframe
                            className={`${styles.description}`}
                            src={`data:application/pdf;base64,${pdf}`}
                            title='PDF'
                            style={{
                              width: "100%",
                              height: "50vh",
                              border: "none",
                              zoom: "100%",
                            }}
                          />
                        </Col>
                      )}
                    </div>
                  ) : (
                    <Col
                      className='d-flex align-items-center justify-content-center'
                      style={{
                        width: "100%",
                        height: "50vh",
                      }}>
                      submission in progress...
                    </Col>
                  )}
                </Row>
              </div>
            </Col>
          </Row>
        ) : (
          <Loader />
        )}
      </>
    </Container>
  );
};

export default Score;
