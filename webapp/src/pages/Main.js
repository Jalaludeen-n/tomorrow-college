import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/page/main.scss";
import io from "socket.io-client";
import Header from "./../components/admin/main/Header";
import GameList from "../components/admin/main/GameList";
import { fetchRunningAndPastGames } from "../components/services/airtable";

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
    console.log(process.env.REACT_APP_ENV);
    fetchData();
  }, []);
  return (
    <div className='app-container'>
      <Header />
      <div className='bottom-section'>
        <div className='bottom-section__left'>
          <h2 className='bottom-section__left__title'>Running Games</h2>
          <GameList games={runningGames} />
        </div>
        <div className='bottom-section__right'>
          <h2 className='bottom-section__right__title'>Past Games</h2>
          <GameList games={completedGames} />
        </div>
      </div>
    </div>
  );
};

export default Main;
