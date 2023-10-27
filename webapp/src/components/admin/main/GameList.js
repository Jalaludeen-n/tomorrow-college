import React, { useState } from "react";
import "./../../../styles/page/main.scss";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const GameList = ({ games, isPage, handleStartGameClick }) => {
  const navigate = useNavigate(); 

  const startGame = (id) => {
    handleStartGameClick(id);
  };
  const isView = (roomNumber, GameID) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify({ roomNumber, GameID }),
      "secret_key",
    ).toString();
    navigate(`/viewStatus?data=${encodeURIComponent(encryptedData)}`);
  };
  return (
    <div className='game-list'>
      <Row className='game-list__headline m-0'>
        <Col className='game-list__title'>Game name</Col>
        <Col className='game-list__title'>{isPage ? "Created on" : "Date"}</Col>

        <Col className='game-list__title'>
          {isPage ? "No of rounds" : "Players"}
        </Col>
        {isPage && <Col />}
      </Row>

      <div className='game-list__scrollable'>
        <div className='game-list__scrollable__items'>
          {games &&
            games.map((game, index) => (
              <Row
                key={index}
                className='game-list__scrollable__items__item '
                onClick={() => !isPage && isView(game.RoomNumber, game.GameID)}>
                <Col
                  className={
                    isPage
                      ? "game-list__scrollable__items__item__attribute"
                      : "game-list__scrollable__items__item__attribute__clickable"
                  }>
                  {isPage ? game.GameName : game.RoomNumber}
                </Col>
                <Col
                  className={
                    isPage
                      ? "game-list__scrollable__items__item__attribute"
                      : "game-list__scrollable__items__item__attribute__clickable"
                  }>
                  {game.Date}
                </Col>
                {isPage && (
                  <Col
                    className={
                      isPage
                        ? "game-list__scrollable__items__item__attribute"
                        : "game-list__scrollable__items__item__attribute__clickable"
                    }>
                    {game.NumberOfRounds}
                  </Col>
                )}
                {isPage ? (
                  <>
                    <Col
                      className={
                        isPage
                          ? "game-list__scrollable__items__item__attribute"
                          : "game-list__scrollable__items__item__attribute__clickable"
                      }>
                      <div
                        className='listStartButton'
                        onClick={() => startGame(game.GameID)}>
                        Use this template
                      </div>
                    </Col>
                  </>
                ) : (
                  <Col
                    className={
                      isPage
                        ? "game-list__scrollable__items__item__attribute"
                        : "game-list__scrollable__items__item__attribute__clickable"
                    }>
                    {game.Players}
                  </Col>
                )}
              </Row>
            ))}
        </div>
      </div>
      <style jsx>{`
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default GameList;
