import React, { useEffect, useState, useContext } from "react";
import "./../styles/page/ListPage.css";
import { fetchGameData, startGame } from "../components/services/airtable";
import GameList from "../components/admin/main/GameList";
import { generateRoomID } from "../components/helper/utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Arrow from "../icons/Arrow.svg";
import Loader from "./Loader";
import { Col, Row } from "react-bootstrap";
import Copy from "./../icons/copy.svg";
import { AdminAuthContext } from "../components/auth/AdminAuth";

const List = () => {
  const { isLoggedIn } = useContext(AdminAuthContext);
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
  const copyNumber = () => {
    const textToCopy = randomNumber;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((error) => {
          console.error("Error using Clipboard API:", error);
          fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
      fallbackCopyTextToClipboard(textToCopy);
    }
  };

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      const msg = successful ? "successful" : "unsuccessful";
      console.log(`Fallback: Copying text was ${msg}`);
    } catch (error) {
      console.error("Fallback: Unable to copy text:", error);
    }

    document.body.removeChild(textArea);
  }
  const close = () => {
    navigate("/dashboard");
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
    if (!isLoggedIn) {
      navigate("/admin");
    } else {
      setLoader(true);
      fetchData();
    }
  }, []);
  return (
    <>
      {!loader ? (
        <div className='list-container'>
          <div className='title ml-3'>
            <Link to='/dashboard'>
              <img src={Arrow} alt='arrow ' className='arrow'></img>
            </Link>
            All games
          </div>
          {games.length === 0 ? (
            <div>No participants have joined the game.</div>
          ) : (
            <>
              {!showPopup ? (
                <GameList
                  games={games}
                  isPage={true}
                  handleStartGameClick={handleStartGameClick}
                />
              ) : (
                // <div className='parent-container'>
                <div className='centered-container'>
                  <div className='popupHeadline'>Game has been created</div>
                  <div className='popupText'>
                    The game has been created. This is room number for users to
                    join this game
                  </div>
                  <div className='popupNumber'>
                    {randomNumber}{" "}
                    <img
                      src={Copy}
                      alt='SVG Icon'
                      onClick={copyNumber}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <button className='popupCopyButton' onClick={close}>
                    GO BACK TO HOMEPAGE
                  </button>
                </div>
                // </div>
              )}{" "}
            </>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default List;
