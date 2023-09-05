import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { fetchScore, fetchMember } from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import styles from "../styles/page/ViewRoom.module.scss";
import style from "../styles/page/Score.module.scss";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import IframeButton from "./Iframe";

const Score = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const location = useLocation();
  const [levels, setLevels] = useState([]);
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [activeGame, setActiveGame] = useState(true);
  const [total, setTotal] = useState(0);
  const [groupMembers, setGroupMembers] = useState([{}]);
  const [data, setData] = useState([{}]);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [sheetID, setSheetID] = useState("");

  const getScore = async (member) => {
    try {
      console.log(member.ParticipantEmail);
      const email = member.ParticipantEmail;
      const gameID = decryptedData.gameID;
      const roomNumber = decryptedData.roomNumber;
      const groupName = decryptedData.groupName;
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          gameID,
          roomNumber,
          groupName,
          email,
        }),
      );

      const res = await fetchScore(formData);
      setData(res.data);
      setSheetID(res.sheetID);
      console.log(res.sheetID);
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
      console.log(decryptedData);
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
    <Container className={styles.viewRoom_container}>
      <Row>
        <Col className={styles.viewRoom_container__GamePageTitle}>
          <h3>group Page</h3>
        </Col>
      </Row>
      <Row className={`mt-4 ${styles.gameInfo}`}>
        <Col md={8}>
          <h4>groupName Name</h4>
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
                <div className={styles.gameList__headline}>Group members</div>
                <ul className={`list-unstyled ${style.memberList}`}>
                  {groupMembers.map((member, index) => (
                    <li
                      key={index}
                      className={style.member}
                      onClick={(e) => getScore(member)}>
                      {index + 1}. {member.Name}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col>
              <div className={styles.gameList}>
                <div className={styles.gameList__headline}>
                  Group submission
                </div>
                <nav
                  className={`navbar navbar-expand-lg navbar-light bg-light ${style.levelHeader}`}>
                  <ul className={`navbar-nav w-100 justify-content-between `}>
                    {Array.from({ length: 4 }, (_, index) => (
                      <li className={`nav-item ml-2 `} key={index}>
                        <a
                          className='nav-link'
                          href='#'
                          onClick={() => setSelectedLevel(index + 1)} // Set the selected level when clicked
                        >
                          Level {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className='vh-20 d-flex justify-content-center align-items-center'>
                  {selectedLevel !== 0 && data[`Level ${selectedLevel}`] ? (
                    <div>
                      {data[`Level ${selectedLevel}`].type === "number" ? (
                        <div>Score: {data[`Level ${selectedLevel}`].score}</div>
                      ) : (
                        <div>
                          <IframeButton
                            iframeURL={`https://docs.google.com/spreadsheets/d/${sheetID}/view#gid=${
                              data[`Level ${selectedLevel}`].id
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className=''>Select a level to view details</div>
                  )}
                </div>
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
