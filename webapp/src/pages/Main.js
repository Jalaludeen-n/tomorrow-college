import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../styles/page/main.scss";
import io from "socket.io-client";
import Header from "./../components/admin/main/Header";
import GameList from "../components/admin/main/GameList";
import { generateSampleGameData } from "../components/helper.js/utils";

const Main = () => {
  const sampleGameData = generateSampleGameData(50);
  return (
    <div className='app-container'>
      <Header />
      <div className='bottom-section'>
        <div className='bottom-section__left'>
          <h2 className='bottom-section__left__title'>Running Games</h2>
          <GameList games={sampleGameData} />
        </div>
        <div className='bottom-section__right'>
          <h2 className='bottom-section__right__title'>Past Games</h2>
          <GameList games={sampleGameData} />
        </div>
      </div>
    </div>
  );
};

export default Main;
