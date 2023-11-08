import React, { useEffect, useState } from "react";
import styles from "../styles/page/Roles.module.scss"; // Use the SCSS Module import
import { Container, Row, Form, Col, Button } from "react-bootstrap";
import {
  decryptData,
  encryptData,
  getDataFromURL,
} from "../components/helper/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  fetchRemainingRoles,
  fetchRolesAndParticipants,
  selectRole,
} from "../components/services/airtable";
import Loader from "./Loader";
import { getLevelStatus } from "../components/services/level";

const Roles = ({ name }) => {
  const navigate = useNavigate();
  const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
  const [loader, setLoader] = useState(true);
  const location = useLocation();
  const [data, setData] = useState({});
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState([]);
  const handleRoleChange = async (role) => {
    const formData = new FormData();
    console.log(role);
    const updatedData = { ...data };
    updatedData.role = role;
    setData(updatedData);

    formData.append(
      "data",
      JSON.stringify({
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
        role: role,
      }),
    );
    try {
      await selectRole(formData);
      const updatedEncryptedData = encryptData(updatedData, "secret_key");
      navigate(`/roles?data=${encodeURIComponent(updatedEncryptedData)}`);
    } catch (er) {
      console.error(er);
    }
  };

  const handleStartClick = async () => {
    console.log(data);
    const d = {
      GameID: data.GameID,
      roomNumber: data.RoomNumber,
      level: 0,
    };
    
    const res = await getLevelStatus(d);
    console.log(res);
    // const encryptedData = encryptData(data, "secret_key");
    // navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
  };

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
      const gameData = {
        roomNumber: data.roomNumber,
        groupName: data.groupName,
      };
      const res = await fetchRemainingRoles(gameData);
      if (res.data.length) {
        const data = res.data;
        const seen = new Set();
        const roles = data.filter((item) => {
          if (item !== null && !seen.has(item)) {
            seen.add(item);
            return true;
          }
          return false;
        });
        setRoles(roles);
      }
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
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className={styles.centeredContainer}>
          <div className={styles.rolesContainer}>
            <Row className={styles.RolesHeader}>
              <Col md={1}></Col>
              <Col>Players</Col>
              <Col>Role</Col>
            </Row>
            <div className={styles.PlayerList}>
              {players
                .slice()
                .sort((a, b) => {
                  if (a.ParticipantEmail === data.email) return -1;
                  if (b.ParticipantEmail === data.email) return 1;
                  return 0;
                })
                .map((player, index) => (
                  <Row key={index} className={styles.RolesRow}>
                    <Col md={1} className={styles.RolesNumber}>
                      {index + 1}
                    </Col>
                    <Col className={styles.PlayerName}>{player.Name}</Col>
                    <Col className={styles.PlayerRole}>
                      {player.ParticipantEmail === data.email ? (
                        <>
                          {data.autoSelection || data.role ? (
                            data.role
                          ) : (
                            <select
                              value={data.role || ""}
                              onChange={(e) =>
                                handleRoleChange(e.target.value)
                              }>
                              <option value=''>Select your role</option>
                              {roles.map((data) => (
                                <option key={data} value={data}>
                                  {data}
                                </option>
                              ))}
                            </select>
                          )}
                        </>
                      ) : (
                        player.Role
                      )}
                    </Col>
                  </Row>
                ))}
            </div>
          </div>
          <div className={styles.startButtonContainer}>
            <button className={styles.startButton} onClick={handleStartClick}>
              Start THE ROUND
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Roles;
