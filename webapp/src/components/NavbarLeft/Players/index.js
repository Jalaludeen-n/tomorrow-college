import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/navbar/Left.module.scss"; // Use the SCSS Module import
import { Row, Col } from "react-bootstrap";
import { fetchRolesAndParticipants } from "../../services/airtable";
import Loader from "../../../pages/Loader";
import { isObjectEmpty } from "../../helper/utils";

const Players = ({ data }) => {
  const [loader, setLoader] = useState(true);
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

      setLoader(false);
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
    if (!isObjectEmpty(data)) {
      fetchParticipantsAndSet(data);
    }
  }, [data]);

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className={styles.GameDetails}>
          <Row className={styles.PlayerHeader}>
            <Col md={1}></Col>
            <Col>Players</Col>
            <Col>Role</Col>
          </Row>
          <div className={styles.PlayerList}>
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
        </div>
      )}
    </>
  );
};

export default Players;
