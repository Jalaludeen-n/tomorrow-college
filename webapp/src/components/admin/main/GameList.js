import React from "react";
import "./../../../styles/page/main.scss";

const GameList = ({ games }) => {
  return (
    <div className='game-list'>
      <div className='game-list__headline'>
        <h2 className='game-list__title'>Game Name</h2>
        <h2 className='game-list__title'>Date</h2>
        <h2 className='game-list__title'>Players</h2>
      </div>

      <div className='game-list__scrollable'>
        <ul className='game-list__scrollable__items'>
          {games &&
            games.map((game, index) => (
              <li key={index} className='game-list__scrollable__items__item'>
                <div className='game-list__scrollable__items__item__attribute'>
                  {game.name}
                </div>
                <div className='game-list__scrollable__items__item__attribute'>
                  {game.date}
                </div>
                <div className='game-list__scrollable__items__item__attribute'>
                  {game.players}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default GameList;
