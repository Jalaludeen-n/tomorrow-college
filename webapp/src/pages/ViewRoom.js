import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import {
  fetchGroupDetails,
  startGame,
  getLevelStatus,
  startLevel,
} from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import styles from "../styles/page/ViewRoom.module.scss"; // Import your SCSS module styles
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const ViewRoom = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const location = useLocation();
  const [levels, setLevels] = useState([]);
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [activeGame, setActiveGame] = useState(true);

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

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
      try {
        const [res, levelRes] = await Promise.all([
          fetchGroupDetails(formData),
          getLevelStatus(formData),
        ]);

        setLoader(false);

        if (res.success && res.Data) {
          setTotal(res.Data.totalLevels);
          const levelData = levelRes.levelStatus;
          setData(levelData);
          const levels = res.Data.Levels;
          setName(res.Data.Name);
          setLevels(levels);
        } else {
          console.log("No Active Games");
          setActiveGame(false);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = (data) => {
    const groupName = data.groupName;
    const roomNumber = decryptedData.roomNumber;
    const gameID = decryptedData.GameID;
    const updatedEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({
        groupName,
        roomNumber,
        gameID,
        total,
      }),
      "secret_key",
    ).toString();

    navigate(`/score?data=${encodeURIComponent(updatedEncryptedData)}`);
  };

  const start = async (level) => {
    const formData = new FormData();
    const roomNumber = decryptedData.roomNumber;
    const gameID = decryptedData.GameID;
    formData.append(
      "data",
      JSON.stringify({
        gameID,
        roomNumber,
        level,
      }),
    );
    await startLevel(formData);
  };

  useEffect(() => {
    setLoader(true);
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
    <>
      {activeGame ? (
        <Container className={`${styles.viewRoom__container} mt-4`}>
          <Row className='mt-5'>
            <Col className={styles.viewRoom__container__GamePageTitle}>
              Game page
            </Col>
          </Row>
          <Row className={`mt-4 p-0 mb-4 ${styles.gameInfo}`}>
            <Col md={8} style={{ marginLeft: "2vw" }}>
              Game name
            </Col>
            <Col>Room Number</Col>
          </Row>
          <Row className='m-0 p-0'>
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

          <>
            {!loader ? (
              <Row className={`${styles.customRow} p-0 m-0`}>
                <div className={styles.gameList}>
                  <Col>
                    <div className={styles.gameList__headline}>
                      <h2 className={styles.gameList__title}>Group</h2>
                      {Array.from({ length: total }, (_, index) => (
                        <h2 key={index} className={styles.gameList__title}>
                          Round {index + 1}
                        </h2>
                      ))}
                    </div>
                  </Col>
                  <Col>
                    {/* this buttons are not alligned propperly. under the group is must empty the it will allign propperly below the header  */}
                    <div className={styles.gameButtons}>
                      <div className={styles.gameListButton}>
                        <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        {Array.from({ length: total }, (_, index) => {
                          const buttonData = data
                            ? data.find((item) => item.Level === index + 1)
                            : null;

                          console.log(data);
                          console.log("_+");
                          const buttonText =
                            buttonData && buttonData.Status === "Started"
                              ? buttonData.Status
                              : "start";

                          return (
                            <button
                              key={index}
                              disabled={buttonText === "Started"}
                              className={styles.startButton}
                              onClick={() => {
                                start(index + 1);
                              }}>
                              {buttonText}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Col>
                  <div className={styles.gameList__scrollable}>
                    <Col>
                      <ul className={styles.gameList__scrollable__items}>
                        {levels.map((level, index) => {
                          const array = Array(total).fill("");
                          if (level.level === "Completed") {
                            array.fill("Completed", 0, total);
                          } else if (level.level <= total) {
                            for (let i = 0; i < level.level - 1; i++) {
                              array[i] = "Completed";
                            }
                            array[level.level - 1] = "In Progress";
                            for (let i = level.level; i < total; i++) {
                              array[i] = "Not Started";
                            }
                          }

                          return (
                            <li
                              key={index}
                              onClick={(e) => handleClick(level)}
                              className={
                                styles.gameList__scrollable__items__item
                              }>
                              <div className={styles.gameList__attribute}>
                                {level.groupName}
                              </div>
                              {array.map((status, roundIndex) => (
                                <div
                                  key={roundIndex}
                                  className={styles.gameList__attribute}>
                                  {status}
                                </div>
                              ))}
                            </li>
                          );
                        })}
                      </ul>
                    </Col>
                  </div>
                </div>
              </Row>
            ) : (
              <Loader />
            )}
          </>
        </Container>
      ) : (
        <>
          <Row
            className='d-flex justify-content-center align-items-center'
            style={{ height: "100vh" }}>
            <Col className='text-center'>
              No Active games <Link to='/'> Go Home</Link>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewRoom;
