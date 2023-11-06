import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from "../styles/page/GameDetails.module.scss";
import { Switch } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import Homepage from "./HomePage/index";
import Leaderboard from "./Leaderboard";
import Level from "./Level";

const GameDetails = () => {
  return (
    <Router>
      <div className={styles["app-container"]}>
        <AppHeader />
        <Routes>
          <Route path='/' exact component={Homepage} />
          <Route path='/leaderboard' component={Leaderboard} />
          <Route path='/current-round' component={Level} />
        </Routes>
      </div>
    </Router>
  );
};

export default GameDetails;
