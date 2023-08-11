import React, { useEffect, useState } from 'react';
import './../styles/page/ListPage.css';
import { fetchGameDataFromAirtable } from '../components/services/airtable';
import { Link } from 'react-router-dom';


const List = () => {
  const [games, setGames] = useState([]); // State to store fetched game data

  // Function to fetch and set game data
  const fetchGamesData = async () => {
    try {
      const gameData = await fetchGameDataFromAirtable();
      console.log(gameData.data)

      // Assuming the fetched game data is an array of game names
      if (gameData) {
        setGames(gameData.data);
      }
      console.log(games)
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    fetchGamesData(); // Call the function to fetch and set game data
  }, []);

  return (
    <div className="list-container">
      <div className="title">List of Games</div>
      <div className="games-list">
        {games.map((game, index) => (
          <div key={index} className="game-item">
            <div className="game-text">{game.name}</div>
            <Link to="/start"  state={{ id: game.id }} className='game-button'>Start this Game</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
