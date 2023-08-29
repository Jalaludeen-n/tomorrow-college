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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<EnterGameForm />} />
        <Route path='/list' element={<List />} />
        <Route path='/create' element={<Create />} />
        <Route path='/details' element={<GameDetails />} />
        <Route path='/level' element={<Level />} />
        <Route path='/viewStatus' element={<ViewRoom />} />
        <Route path='/admin' element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
