import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { fetchGroupDetails } from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import styles from "../styles/page/ViewRoom.module.scss";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const ViewRoom = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const location = useLocation();
  const [levels, setLevels] = useState([]);
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const [activeGame, setActiveGame] = useState(true);

  const [total, setTotal] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function

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
      setLoader(false);

      if (res.success && res.Data) {
        setTotal(res.Data.totalLevels);
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

  // const getchAndUpdateScore = async (groupName, roomNumber, gameID) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append(
  //       "data",
  //       JSON.stringify({
  //         groupName,
  //         roomNumber,
  //         gameID,
  //       }),
  //     );
  //     await fetchScore(formData);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
              <h4 style={{ marginLeft: "35px" }}>Room Number</h4>
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

          <>
            {!loader ? (
              <Row>
                <Col>
                  <div className={styles.gameList}>
                    <div className={styles.gameList__headline}>
                      <h2 className={styles.gameList__title}>Group</h2>
                      {Array.from({ length: total }, (_, index) => (
                        <h2 key={index} className={styles.gameList__title}>
                          Round {index + 1}
                        </h2>
                      ))}
                    </div>
                    <div className={styles.gameList__scrollable}>
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
                    </div>
                  </div>
                </Col>
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
