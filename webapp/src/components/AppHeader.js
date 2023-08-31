import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/AppHeader.module.css"; // Import your style module
import Logo from "./../icons/logo.svg";
const AppHeader = ({ form }) => {
  return (
    <div className={styles["sub-header"]}>
      <div className={styles["icon-container"]}>
        <img src={Logo} alt='SVG Icon' />
      </div>
      {!form && (
        <div className={styles["button-container"]}>
          <Link
            to='/'
            className={`${styles["header-link"]} ${
              window.location.pathname === "/details" ? styles["active"] : ""
            }`}>
            Game Homepage
          </Link>
          <Link
            to='/leaderboard'
            className={`${styles["header-link"]} ${
              window.location.pathname === "/leaderboard"
                ? styles["active"]
                : ""
            }`}>
            Leaderboard
          </Link>
          <Link
            to='/level'
            className={`${styles["header-link"]} ${
              window.location.pathname === "/level" ? styles["active"] : ""
            }`}>
            Current Round
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppHeader;
