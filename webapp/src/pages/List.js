import React, { useEffect, useState } from "react";
import "./../styles/page/ListPage.css";
import { fetchGameData, startGame } from "../components/services/airtable";
import GameList from "../components/admin/main/GameList";
import { generateRoomID } from "../components/helper/utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Arrow from "../icons/Arrow.svg";
import Loader from "./Loader";
const List = () => {
  const [games, setGames] = useState([]); // State to store fetched game data
  const [showPopup, setShowPopup] = useState(false);
  const [randomNumber, setRandomNumber] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

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
        setLoader(false);
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
        navigate("/");
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
    setLoader(true);
    fetchData(); // Call the function to fetch and set game data
  }, []);
  return (
    <>
      {!loader ? (
        <div className='list-container'>
          <div className='title ml-3'>
            <Link to='/'>
              <img src={Arrow} alt='arrow ' className='arrow'></img>
            </Link>
            All games
          </div>
          {games.length === 0 ? (
            <div>No active games</div>
          ) : (
            <GameList
              games={games}
              isPage={true}
              handleStartGameClick={handleStartGameClick}
              showPopup={showPopup}
              randomNumber={randomNumber}
              handleClosePopup={handleClosePopup}
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default List;
