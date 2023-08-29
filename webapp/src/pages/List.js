import React, { useEffect, useState } from "react";
import "./../styles/page/ListPage.css";
import { fetchGameData, startGame } from "../components/services/airtable";
import GameList from "../components/admin/main/GameList";
import { generateRoomID } from "../components/helper/utils";
const List = () => {
  const [games, setGames] = useState([]); // State to store fetched game data
  const [showPopup, setShowPopup] = useState(false);
  const [randomNumber, setRandomNumber] = useState("");

  const handleStartGameClick = async (id) => {
    const number = generateRoomID();
    setRandomNumber(number);
    setShowPopup(!showPopup);
    const data = formatDataForAirtable(id, number);
    await startGame(data);
  };
  const fetchData = () => {
    fetchGameData()
      .then((res) => {
        setGames(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleClosePopup = () => {
    const textToCopy = randomNumber;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setShowPopup(!showPopup);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error copying text:", error);
      });
  };

  const formatDataForAirtable = (Id, Number) => {
    const formData = new FormData();
    formData.append(
      `data`,
      JSON.stringify({
        gameId: Id,
        roomNumber: Number,
      }),
    );
    return formData;
  };
  useEffect(() => {
    fetchData(); // Call the function to fetch and set game data
  }, []);
  return (
    <div className='list-container'>
      <div className='title'>List of Games</div>
      <GameList
        games={games}
        isPage={true}
        handleStartGameClick={handleStartGameClick}
        showPopup={showPopup}
        randomNumber={randomNumber}
        handleClosePopup={handleClosePopup}
      />
    </div>
  );
};
export default List;
