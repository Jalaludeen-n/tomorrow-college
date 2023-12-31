import { Col, Row } from "react-bootstrap";
import React from "react";
import styles from "../../styles/page/GameDetails.module.scss";

const Players = ({ state, updateRole }) => {
  const handleRoleChange = (value) => {
    updateRole(value);
  };
  return (
    <Row className='p-0'>
      <Col>
        <div className={`${styles.playerList}`}>
          <div className={`${styles.playerListHeadline}`}>
            <h2 className={`${styles.gameListTitle}`}>Players</h2>
            <h2 className={`${styles.gameListTitle}`}>Role</h2>
          </div>
          <div className={`${styles.gameListScrollable}`}>
            <ul className={`${styles.gameListScrollableItems}`}>
              <li className={`${styles.gameListScrollableItem}`}>
                <div className={`${styles.gameListScrollableItemAttribute}`}>
                  1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{state.name}
                </div>
                <div
                  className={`${styles.gameListScrollableItemAttributeRole} ${
                    state.autoSelection && styles.roleAutoSelected
                  }`}>
                  {state.autoSelection || state.role ? (
                    state.role
                  ) : (
                    <select
                      value={state.role}
                      onChange={(e) => handleRoleChange(e.target.value)}>
                      <option value=''>Select your role</option>
                      {state.roles.map((data) => (
                        <option key={data} value={data}>
                          {data}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </li>
              {state.participants.map(
                (data, index) =>
                  data.Name && (
                    <li
                      key={index}
                      className={`${styles.gameListScrollableItem} ${
                        index % 2 === 0 ? styles.evenItem : styles.oddItem
                      }`}>
                      <div
                        className={`${styles.gameListScrollableItemAttribute}`}>
                        {index + 2}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {data.Name}
                      </div>
                      <div
                        className={`${styles.gameListScrollableItemAttributeRole}`}>
                        {data.Role}
                      </div>
                    </li>
                  ),
              )}
            </ul>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Players;
