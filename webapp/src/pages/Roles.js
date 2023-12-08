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
import { updateIndivitualLevel } from "../components/services/level";

const Roles = () => {
  const api_url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);
  const location = useLocation();
  const [data, setData] = useState({});
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState([]);

  const handleRoleChange = async (role) => {
    const formData = new FormData();
    const updatedData = { ...data, role: role };
    const updatedEncryptedData = encryptData(updatedData, "secret_key");
    navigate(`/roles?data=${encodeURIComponent(updatedEncryptedData)}`);
    setData(updatedData);
    setButtonLoader(true);

    formData.append(
      "data",
      JSON.stringify({
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
        role: role,
        resultsSubmission: data.ResultsSubmission,
        gameId: data.GameID,
      }),
    );
    try {
      const res = await selectRole(formData);
      const submit = res.data;
      const updatedDatawithSubmit = { ...updatedData, submit };
      const updatedEncryptedData = encryptData(
        updatedDatawithSubmit,
        "secret_key",
      );
      setButtonLoader(false);

      navigate(`/roles?data=${encodeURIComponent(updatedEncryptedData)}`);
    } catch (er) {
      console.error(er);
    }
  };
  const handleStartClick = async () => {
    setLoader(true);
    const isRoundStarted = await update(data);
    console.log(data);

    if (!isRoundStarted) {
      alert(
        "Please wait; the round has not yet started. We will redirect you once the admin starts the round.",
      );
      setLoader(false);
    }
  };

  const update = async (data) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        gameId: data.GameID,
        groupName: data.groupName,
        email: data.email,
        roomNumber: data.roomNumber,
      }),
    );

    const res = await updateIndivitualLevel(formData);
    const updatedData = {
      ...data,
      level: res.data.level,
      started: res.data.started,
    };

    if (res.data.started) {
      const encryptedData = encryptData(updatedData, "secret_key");
      navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
      return true;
    } else {
      return false;
    }
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
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("gameStarted", (data) => {
      if (
        parseInt(data.CurrentLevel) - 1 == parseInt(decryptedData.level) &&
        decryptedData.role
      ) {
        update(decryptedData);
      } else {
        alert(
          "The admin has started the game. Please choose your role and begin playing.",
        );
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
          <div className={styles.container}>
            <Row className={styles.centeredRow}>
              <h4>Choose your role</h4>
            </Row>
            <Row className={styles.centeredRow}>
              <p>
                Please discuss with your team before choosing your role. Note
                that your role cannot be changed later.
              </p>
            </Row>

            <div>
              <div className={styles.rolesContainer}>
                <Row className={`${styles.RolesHeader} pl-0`}>
                  <Col md={1}></Col>
                  <Col className='pl-0' style={{ padding: "0px" }}>
                    Players
                  </Col>
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
              {!buttonLoader && (
                <div className={styles.startButtonContainer}>
                  <button
                    className={styles.startButton}
                    onClick={handleStartClick}>
                    Start THE ROUND
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Roles;
