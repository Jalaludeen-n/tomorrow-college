import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/components/AppHeader.module.css"; // Import your style module
import Logo from "./../icons/logo.svg";
import { decryptData, encryptData, getDataFromURL } from "./helper/utils";

const AppHeader = ({ form }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const decryptedData = decryptData(encryptedData, key);
    const updatedData = {
      ...decryptedData,
      main: true,
      from: window.location.pathname,
    };
    const newData = encryptData(updatedData, "secret_key");
    navigate(`/home?data=${encodeURIComponent(newData)}`);
  };
  const handleCurrent = () => {
    console.log("dssss");
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const decryptedData = decryptData(encryptedData, key);
    const updatedData = {
      ...decryptedData,
      main: false,
    };
    const newData = encryptData(updatedData, "secret_key");
    navigate(`${updatedData.from}?data=${encodeURIComponent(newData)}`);
  };

  return (
    <div className={styles["sub-header"]}>
      <div className={styles["icon-container"]}>
        <img src={Logo} alt='SVG Icon' />
      </div>
      {!form && (
        <div className={styles["button-container"]}>
          <div
            onClick={handleClick}
            className={`${styles["header-link"]} ${
              window.location.pathname === "/home" ? styles["active"] : ""
            }`}>
            Game Homepage
          </div>
          {/* <Link
            to='/leaderboard'
            className={`${styles["header-link"]} ${
              window.location.pathname === "/leaderboard"
                ? styles["active"]
                : ""
            }`}>
            Leaderboard
          </Link> */}
          <div
            onClick={handleCurrent}
            className={`${styles["header-link"]} ${
              window.location.pathname === "/level" ? styles["active"] : ""
            }`}>
            Current Round
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
