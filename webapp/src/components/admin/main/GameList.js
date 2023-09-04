import React, { useState } from "react";
import "./../../../styles/page/main.scss";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const GameList = ({
  games,
  isPage,
  handleStartGameClick,
  showPopup,
  randomNumber,
  handleClosePopup,
}) => {
  const navigate = useNavigate(); // Initialize the navigate function

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
      <div className='game-list__headline'>
        <h2 className='game-list__title'>Game Name</h2>
        <h2 className='game-list__title'>Date</h2>
        <h2 className='game-list__title'>{isPage ? "" : "Players"}</h2>
      </div>

      <div className='game-list__scrollable'>
        <ul className='game-list__scrollable__items'>
          {games &&
            games.map((game, index) => (
              <li
                key={index}
                className='game-list__scrollable__items__item'
                onClick={() => !isPage && isView(game.RoomNumber, game.GameID)}>
                <div
                  className={
                    isPage
                      ? "game-list__scrollable__items__item__attribute"
                      : "game-list__scrollable__items__item__attribute__clickable"
                  }>
                  {isPage ? game.GameName : game.RoomNumber}
                </div>
                <div className='game-list__scrollable__items__item__attribute'>
                  {game.Date}
                </div>
                <div className='game-list__scrollable__items__item__attribute'>
                  {isPage ? (
                    <>
                      {!showPopup ? (
                        <button onClick={() => startGame(game.GameID)}>
                          Start
                        </button>
                      ) : (
                        <div className='popup'>
                          <p>
                            The game has started successfully. Please share this
                            room number to join the game.
                          </p>
                          <p>Room number: {randomNumber}</p>
                          <button onClick={handleClosePopup}>Copy</button>
                        </div>
                      )}
                    </>
                  ) : (
                    game.Players
                  )}
                </div>
              </li>
            ))}
        </ul>
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
