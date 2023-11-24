import React, { useEffect, useState, useContext } from "react";
import "./../styles/page/main.scss";
import Header from "./../components/admin/main/Header";
import GameList from "../components/admin/main/GameList";
import { fetchRunningAndPastGames } from "../components/services/airtable";
import { AdminAuthContext } from "../components/auth/AdminAuth";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Main = () => {
  const [runningGames, setrunningGames] = useState([]);
  const [completedGames, setcompletedGames] = useState([]);
  const { isLoggedIn } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {

      const res = await fetchRunningAndPastGames();
      

      if (res.data) {
        const allGames = res.data;
        const runningGames = allGames.filter(
          (game) => game.Status === "Running" || game.Status === "Started",
        );
        setrunningGames(runningGames);

        const completedGames = allGames.filter(
          (game) => game.Status === "Completed",
        );
        setcompletedGames(completedGames);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/admin");
    } else {
      fetchData();
    }
    const api_url = process.env.REACT_APP_API_URL;
    const socket = io(`${api_url}`, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    socket.on("newplayer", (data) => {
      fetchData();
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='app-container'>
      <Header />
      <div className='bottom-section'>
        <div className='bottom-section__left'>
          <div className='bottom-section__left__title'>Active games</div>
          <GameList games={runningGames} />
        </div>
        <div className='bottom-section__right'>
          <div className='bottom-section__right__title'>Past games</div>
          <GameList games={completedGames} />
        </div>
      </div>
    </div>
  );
};

export default Main;
