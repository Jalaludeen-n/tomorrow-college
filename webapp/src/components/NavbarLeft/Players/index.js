import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import { decryptData, getDataFromURL } from "../../helper/utils";
import { useLocation } from "react-router-dom";
import { fetchRolesAndParticipants } from "../../services/airtable";

const Players = ({ name }) => {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve"];

  const location = useLocation();
  const [data, setData] = useState({});
  const [players, setPlayers] = useState([]);

  const fetchParticipants = async (email, roomNumber, groupName) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          groupName: groupName,
          email: email,
          roomNumber: roomNumber,
        }),
      );

      const res = await fetchRolesAndParticipants(formData);
      console.log(res.data.filteredparticipants);
      console.log("+_+++++++");

      if (res && res.data.filteredparticipants.length) {
        setPlayers(res.data.filteredparticipants);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchParticipantsAndSet = async (data) => {
    try {
      await fetchParticipants(data.email, data.roomNumber, data.groupName);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
    fetchParticipantsAndSet(data);
  }, []);

  return (
    <div className={styles.GameDetails}>
      <Row className={styles.PlayerHeader}>
        <Col md={1}></Col>
        <Col>Players</Col>
        <Col>Role</Col>
      </Row>
      {players.map((player, index) => (
        <Row key={index} className={styles.PlayerRow}>
          <Col md={1} className={styles.PlayerNumber}>
            {index + 1}
          </Col>
          <Col className={styles.PlayerName}>{player.Name}</Col>
          <Col className={styles.PlayerRole}>{player.Role}</Col>
        </Row>
      ))}
    </div>
  );
};

export default Players;
