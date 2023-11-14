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
import Homepage from "./pages/HomePage/index";
import Score from "./pages/Score";
import Login from "./pages/Login";
import { UserAuth } from "./components/auth/UserAuth";
import { AdminAuthProvider } from "./components/auth/AdminAuth";
import Layout from "./components/Layout";
import Roles from "./pages/Roles.js";
import Result from "./pages/Result.js";

const HeaderedHomepage = WithHeader(Homepage);
const HeaderedRolepage = WithHeader(Roles);

// const WithLayout = Layout(Homepage);
const HeaderedLeaderboard = WithHeader(Leaderboard);
const HeaderedLevel = WithHeader(Level);
const HeaderedResult = WithHeader(Result);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/result' element={<HeaderedResult />} />
        <Route path='/roles' element={<HeaderedRolepage />} />
        <Route path='/home' element={<HeaderedHomepage />} />
        <Route path='/level' element={<HeaderedLevel />} />
        <Route path='/' element={<EnterGameForm />} />
      </Routes>
      <AdminAuthProvider>
        <Routes>
          <Route path='/admin' element={<Login />} />
          <Route path='/dashboard' element={<Main />} />
          <Route path='/list' element={<List />} />
          <Route path='/create' element={<Create />} />

          <Route path='/viewStatus' element={<ViewRoom />} />
          <Route path='/leader' element={<HeaderedLeaderboard />} />
          <Route path='/score' element={<Score />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
