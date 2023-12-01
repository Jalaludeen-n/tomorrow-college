import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Arrow from "../icons/Arrow.svg";
import { fetchGroupDetails } from "../components/services/airtable";
import { getLevelStatus, startLevel } from "../components/services/level";
import { io } from "socket.io-client";

import { Container, Row, Col } from "react-bootstrap";
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
  const [buttonText, setButtonText] = useState([]);

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchData = async (RoomNumber, GameID) => {
    try {
      const formData = {
        GameID,
        RoomNumber,
      };
      const [res, levelRes] = await Promise.all([
        fetchGroupDetails(formData),
        getLevelStatus(formData),
      ]);

      setLoader(false);
      if (res.success && res.data) {
        setTotal(res.data.totalLevels);
        setButtonText(Array(res.data.totalLevels).fill("start"));
        const levelData = levelRes.levelStatus;
        setData(levelData);
        const levels = res.data.Levels;
        setName(res.data.Name);
        setLevels(levels);
      } else {
        console.log("No participants have joined the game.");
        setActiveGame(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = (name) => {
    const groupName = name;
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
    if (buttonText[level - 1] !== "Started") {
      const newText = [...buttonText];
      newText[level - 1] = "Started";
      setButtonText(newText);
    }
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
      // }
    }
    const api_url = process.env.REACT_APP_API_URL;
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("newplayer", (data) => {
      fetchData();
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {activeGame ? (
        <Container className={`${styles.viewRoom__container}`}>
          <Row className='mb-4'>
            <Col className={styles.viewRoom__container__GamePageTitle}>
              <div className='title ml-3'>
                <Link to='/dashboard'>
                  <img src={Arrow} alt='arrow ' className='arrow'></img>
                </Link>
                Game page
              </div>
            </Col>
          </Row>
          <Row className={` ${styles.gameInfo} mb-2`}>
            <Col md={8}>Game name</Col>
            <Col style={{ marginLeft: "2%" }}>Room Number</Col>
          </Row>
          <Row className='p-0'>
            <Col
              md={8}
              className={`d-flex flex-column align-items-left justify-content-center ${styles.gameInfoName}`}>
              {name}
            </Col>
            <Col
              className={`d-flex flex-column align-items-left justify-content-center ${styles.gameInfoName} `}>
              {roomNumber}
            </Col>
          </Row>

          <>
            {!loader ? (
              <>
                <div className={styles.gameList}>
                  <Row className={`${styles.customRow} p-0 m-0`}>
                    <div className={styles.gameList__headline}>
                      <Col className={styles.gameList__title}>Group</Col>
                      {Array.from({ length: total }, (_, index) => (
                        <Col key={index} className={styles.gameList__title}>
                          Round {index + 1}
                        </Col>
                      ))}
                    </div>
                  </Row>

                  <Row>
                    <div className={styles.gameButtons}>
                      <div className={styles.gameListButton}>
                        <Col className={styles.marginLeft}>Round Status</Col>
                        {data &&
                          Array.from({ length: total }, (_, index) => {
                            const foundItem = data.find(
                              (item) => item.Level === index + 1,
                            );
                            return (
                              <Col key={index}>
                                <button
                                  disabled={buttonText[index] === "Started"}
                                  className={styles.startButton}
                                  onClick={() => start(index + 1)}>
                                  {foundItem && foundItem.Status
                                    ? foundItem.Status
                                    : buttonText[index]}
                                </button>
                              </Col>
                            );
                          })}
                      </div>
                    </div>
                  </Row>
                  {Object.entries(levels).map(([key, value]) => (
                    <Row key={key} className={styles.gameList__scrollable}>
                      <div
                        onClick={(e) => handleClick(key)}
                        className={styles.gameList__scrollable__items__item}>
                        <Col
                          className={`${styles.gameListAttribute} ${styles.marginLeft}`}>
                          {key}
                        </Col>
                        {value.map((item, index) => (
                          <Col className={styles.gameListAttribute}>{item}</Col>
                        ))}
                      </div>
                    </Row>
                  ))}
                  {/* {levels.map((level, index) => {
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
                        <div
                          key={index}
                          onClick={(e) => handleClick(level)}
                          className={styles.gameList__scrollable__items__item}>
                          <Col
                            className={`${styles.gameListAttribute} ${styles.marginLeft}`}>
                            {level.groupName}
                          </Col>
                          {array.map((status, roundIndex) => (
                            <Col
                              key={roundIndex}
                              className={styles.gameListAttribute}>
                              {status}
                            </Col>
                          ))}
                        </div>
                      );
                    })} */}
                </div>
              </>
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
              No participants have joined the game.
              <Link to='/dashboard'> Go Home</Link>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewRoom;
