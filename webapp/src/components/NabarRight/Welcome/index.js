import React, { useEffect, useState } from "react";
import style from "../../../styles/components/navbar/Right.module.scss"; // Use the SCSS Module import
import { Row } from "react-bootstrap";
import { getCurrentFormattedDate } from "../../helper/date";
import { decryptData, getDataFromURL } from "../../helper/utils";
import { useLocation } from "react-router-dom";

const Welcome = ({ name }) => {
  const location = useLocation();
  const [data, setData] = useState({});

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    setData(data);
  }, []);

  return (
    <div className={style.welcome_container}>
      <Row className={`${style.welcomeName} `}>Welcome to 1</Row>
      <Row className={`${style.welcomeDate} `}>{getCurrentFormattedDate()}</Row>
    </div>
  );
};

export default Welcome;
