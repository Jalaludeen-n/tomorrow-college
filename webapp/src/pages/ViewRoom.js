import React, { useEffect, useState, useContext } from "react";
import CryptoJS from "crypto-js";
import Arrow from "../icons/Arrow.svg";
import { AdminAuthContext } from "../components/auth/AdminAuth";
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
  const { isLoggedIn } = useContext(AdminAuthContext);
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
    if (!isLoggedIn) {
      navigate("/admin");
    } else {
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
    }
  }, []);

  return (
    <>
      {activeGame ? (
        <Container className={`${styles.viewRoom__container}`}>
          <Row className='mb-4'>
            <Col className={styles.viewRoom__container__GamePageTitle}>
              <div className='title ml-3'>
                <Link to='/'>
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
                        {Array.from({ length: total }, (_, index) => {
                          const buttonData = data
                            ? data.find((item) => item.Level === index + 1)
                            : null;

                          const buttonText =
                            buttonData && buttonData.Status === "Started"
                              ? buttonData.Status
                              : "start";

                          return (
                            <Col>
                              <button
                                key={index}
                                disabled={buttonText === "Started"}
                                className={styles.startButton}
                                onClick={() => {
                                  start(index + 1);
                                }}>
                                {buttonText}
                              </button>
                            </Col>
                          );
                        })}
                      </div>
                    </div>
                  </Row>
                  <Row className={styles.gameList__scrollable}>
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
                    })}
                  </Row>
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
              No Active games <Link to='/'> Go Home</Link>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewRoom;
