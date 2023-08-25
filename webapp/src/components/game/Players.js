import { Col, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import styles from "../../styles/page/GameDetails.module.scss";

const Players = ({ roleAutoSelection, name, role, participants }) => {
  const levels = [];
  // const handleRoleChange = (e) => {
  //   setStateFunction(e.target.value);
  // };
  return (
    <Row>
      {/* <Col>
        <div className={`${styles.playerList}`}>
          <div className={`${styles.playerListHeadline}`}>
            <h2 className={`${styles.gameListTitle}`}>Players</h2>
            <h2 className={`${styles.gameListTitle}`}>Role</h2>
          </div>
          <div className={`${styles.gameListScrollable}`}>
            <ul className={`${styles.gameListScrollableItems}`}>
              <li>{name}</li>
              <div className={`${styles.gameListScrollableItemAttribute}`}>
                {roleAutoSelection ? (
                  role
                ) : (
                  <select
                    value={resultsSubmission}
                    onChange={(e) => handleRoleChange(e, setResultsSubmission)}>
                    {role.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {participants.map((data, index) => (
                <li key={index} className={`${styles.gameListScrollableItem}`}>
                  <div className={`${styles.gameListScrollableItemAttribute}`}>
                    {data.name}
                  </div>
                  <div className={`${styles.gameListScrollableItemAttribute}`}>
                    {data.role}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Col> */}
    </Row>
  );
};

export default Players;
