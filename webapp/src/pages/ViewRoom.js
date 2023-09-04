import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { fetchGroupDetails } from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import styles from "../styles/page/ViewRoom.module.scss";
import { useLocation } from "react-router-dom";

const ViewRoom = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const location = useLocation();
  const [levels, setLevels] = useState([]);
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const fetchData = async (RoomNumber, GameID) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          GameID,
          RoomNumber,
        }),
      );

      const res = await fetchGroupDetails(formData);

      if (res.success && res.Data) {
        const levels = res.Data.Levels;
        setName(res.Data.Name);
        setLevels(levels);
      } else {
        console.log("No Active Games");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const encryptedData = searchParams.get("data");
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, "secret_key");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDecryptedData(decryptedData);
      setRoomNumber(decryptedData.roomNumber);
      fetchData(decryptedData.roomNumber, decryptedData.GameID);
    }
  }, []);
  return (
    <Container className={styles.viewRoom_container}>
      <Row>
        <Col className={styles.viewRoom_container__GamePageTitle}>
          <h3>GamePage</h3>
        </Col>
      </Row>
      <Row className={`mt-4 ${styles.gameInfo}`}>
        <Col md={8}>
          <h4>Game Name</h4>
        </Col>
        <Col>
          <h4>Room Number</h4>
        </Col>
      </Row>
      <Row>
        <Col
          md={8}
          className={`d-flex flex-column align-items-left justify-content-center ${styles.gameInfoName}`}>
          <div className='p-4'>{name}</div>
        </Col>
        <Col
          className={`d-flex flex-column align-items-left justify-content-center ${styles.gameInfoName}`}>
          <div className='p-4'>{roomNumber}</div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={styles.gameList}>
            <div className={styles.gameList__headline}>
              <h2 className={styles.gameList__title}>Group</h2>
              <h2 className={styles.gameList__title}>Status</h2>
            </div>
            <div className={styles.gameList__scrollable}>
              <ul className={styles.gameList__scrollable__items}>
                {levels.map((level, index) => (
                  <li
                    key={index}
                    className={styles.gameList__scrollable__items__item}>
                    <div className={styles.gameList__attribute}>
                      {level.groupName}
                    </div>
                    <div className={styles.gameList__attribute}>
                      {level.level}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewRoom;
