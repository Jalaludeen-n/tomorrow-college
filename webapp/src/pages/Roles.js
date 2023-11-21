import React, { useEffect, useState } from "react";
import styles from "../styles/page/Roles.module.scss"; // Use the SCSS Module import
import { Row, Col } from "react-bootstrap";
import { io } from "socket.io-client";
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
import { updateLevel } from "../components/services/level";

const Roles = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const location = useLocation();
  const [data, setData] = useState({});
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState([]);

  const handleRoleChange = async (role) => {
    const formData = new FormData();

    const updatedData = { ...data, role: role };
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
    setLoader(true);
    const formData = new FormData();

    formData.append(
      "data",
      JSON.stringify({
        gameId: data.GameID,
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
        resultsSubmission: data.ResultsSubmission,
      }),
    );
    await updateLevel(formData);
  };

  const fetchParticipants = async (data) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          roomNumber: data.roomNumber,
          groupName: data.groupName,
          email: data.email,
        }),
      );
      const res = await fetchRolesAndParticipants(formData);
      if (res?.data?.length) {
        setPlayers(res.data);
      }
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParticipantsAndSet = async (data) => {
    try {
      setData(data);
      await fetchParticipants(data);

      const gameData = {
        roomNumber: data.roomNumber,
        groupName: data.groupName,
        roleAutoAssigned: data.roleAutoAssigned,
        gameId: data.GameID,
        email: data.email,
      };

      const res = await fetchRemainingRoles(gameData);
      if (res?.data?.length) {
        const uniqueRoles = [
          ...new Set(res.data.filter((item) => item !== null)),
        ];
        setRoles(uniqueRoles);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const decryptedData = decryptData(encryptedData, key);
    console.log(decryptedData);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("updatelevel", (data) => {
      const updatedData = {
        ...decryptedData,
        level: data.CurrentLevel,
        started: data.started,
      };

      if (data.playerClick) {
        if (data.email == decryptedData.email) {
          if (data.started) {
            const encryptedData = encryptData(updatedData, "secret_key");
            navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
          } else {
            setLoader(false);
            alert(
              "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
            );
          }
        } else if (data.started) {
          const encryptedData = encryptData(updatedData, "secret_key");
          navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
        }
      } else if (
        (data.CurrentLevel == decryptedData.level || data.CurrentLevel == 1) &&
        data.started
      ) {
        if (decryptedData.role) {
          const encryptedData = encryptData(updatedData, "secret_key");
          navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
        } else {
          alert(
            "The admin has started the game. Please choose your role and begin playing.",
          );
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    fetchParticipantsAndSet(decryptedData);

    return () => {
      socket.disconnect();
    };
  }, [location]);
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
                      {console.log(data.email)}
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
