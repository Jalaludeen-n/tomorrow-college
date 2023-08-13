import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Main from "./pages/Main";
import List from "./pages/List";
import Create from "./pages/Create";
import Start from "./pages/Start";
import EnterGameForm from "./pages/EnterGameForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/list' element={<List />} />
        <Route path='/create' element={<Create />} />
        <Route path='/start' element={<Start />} />
        <Route path='/enterGame' element={<EnterGameForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
