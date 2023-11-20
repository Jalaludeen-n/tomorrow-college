// Navbar.js
import React, { useEffect, useState } from "react";
import style from "../../styles/page/Result.module.scss";
import { useLocation } from "react-router-dom";
import { fetchResults } from "../services/decision";
import ResultItem from "./DecisionItem";
import { Row, Col } from "react-bootstrap";
import { decryptData, getDataFromURL } from "../helper/utils";

const Decision = ({ onClick }) => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  const fetchResultsAndSet = async (data) => {
    const formData = {
      level: parseInt(data.level) - 1,
      sheetID: data.GoogleSheetID,
    };

    try {
      const res = await fetchResults(formData);
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    const encryptedData = getDataFromURL(location);
    const key = "secret_key";
    const data = decryptData(encryptedData, key);
    fetchResultsAndSet(data);
    setData(data);
  }, []);

  return (
    <div className={style.resultsContainer}>
      <>
        {results.map((data, index) => (
          <ResultItem data={data} round={index} />
        ))}
      </>
    </div>
  );
};

export default Decision;
