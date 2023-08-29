import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
import { fetchGroupDetails } from "../components/services/airtable";
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import "../styles/page/ViewRoom.scss";

const ViewRoom = () => {
  const [decryptedData, setDecryptedData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const fetchData = async (RoomNumber, GameID) => {
    try {
      const formData = new FormData();
      formData.append(
        `data`,
        JSON.stringify({
          GameID,
          RoomNumber,
        }),
      );

      const res = await fetchGroupDetails(formData);
      const levels = res.Data.Levels;
      console.log(res);
      console.log("______________");
      console.log(levels);
      setName(res.Data.Name);
      setLevels(levels);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    console.log("ds");
    const searchParams = new URLSearchParams(window.location.search);
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
    <Container className='viewRoom_container'>
      <Row>
        <Col className='viewRoom_container__GamePage-title'>
          <h3>GamePage</h3>
        </Col>
      </Row>
      <Row>
        <Col className='viewRoom_container__GameName-container'>
          <h4>Game Name</h4>
          <div className='viewRoom_container__GameName-container__name'>
            {name}
          </div>
        </Col>
        <Col className='viewRoom_container'>
          <h4>Game Number</h4>
          <p>{roomNumber}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className='game-list'>
            <div className='game-list__headline'>
              <h2 className='game-list__title'>Group</h2>
              <h2 className='game-list__title'>Status</h2>
            </div>
            <div className='game-list__scrollable'>
              <ul className='game-list__scrollable__items'>
                {levels.map((level, index) => (
                  <li
                    key={index}
                    className='game-list__scrollable__items__item'>
                    <div className='game-list__scrollable__items__item__attribute'>
                      {level.groupName}
                    </div>
                    <div className='game-list__scrollable__items__item__attribute'>
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
