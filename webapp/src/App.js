import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main";
import List from "./pages/List";
import Create from "./pages/Create";
import EnterGameForm from "./pages/EnterGameForm";
import GameDetails from "./pages/GameDetails";
import Level from "./pages/Level";
import ViewRoom from "./pages/ViewRoom.js";
import WithHeader from "./pages/WithHeader.js";
import Leaderboard from "./pages/Leaderboard";
import GameHomepage from "./pages/GameHomepage";
import Score from "./pages/Score";

const HeaderedLeaderboard = WithHeader(Leaderboard);
const HeaderedLevel = WithHeader(Level);
const HeaderedGameHomepage = WithHeader(GameHomepage);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/dashboard' element={<Main />} />
        <Route path='/joinGame' element={<EnterGameForm />} />
        <Route path='/list' element={<List />} />
        <Route path='/create' element={<Create />} />
        <Route path='/home' element={<HeaderedGameHomepage />} />
        <Route path='/level' element={<HeaderedLevel />} />
        <Route path='/viewStatus' element={<ViewRoom />} />
        <Route path='/leader' element={<HeaderedLeaderboard />} />
        <Route path='/score' element={<Score />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
