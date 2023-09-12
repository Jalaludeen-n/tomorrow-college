import React, { useEffect, useState } from "react";
import "./../styles/page/main.scss";
import Header from "./../components/admin/main/Header";
import GameList from "../components/admin/main/GameList";
import { fetchRunningAndPastGames } from "../components/services/airtable";
import { Link } from "react-router-dom";

const Main = () => {
  const [runningGames, setrunningGames] = useState([]);
  const [completedGames, setcompletedGames] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetchRunningAndPastGames();
      const allGames = res.data;
      const runningGames = allGames.filter(
        (game) => game.Status === "Running" || game.Status === "Started",
      );
      setrunningGames(runningGames);

      const completedGames = allGames.filter(
        (game) => game.Status === "Completed",
      );
      setcompletedGames(completedGames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className='app-container'>
      <Header />
      <div className='bottom-section'>
        <div className='bottom-section__left'>
          <h2 className='bottom-section__left__title'>Active games</h2>
          <GameList games={runningGames} />
        </div>
        <div className='bottom-section__right'>
          <h2 className='bottom-section__right__title'>Past games</h2>
          <GameList games={completedGames} />
        </div>
      </div>
      <Link to='/joinGame' className='test-game'>
        Test Game
      </Link>
    </div>
  );
};

export default Main;
