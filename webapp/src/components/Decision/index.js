// Navbar.js
import React, { useEffect, useState } from "react";
import style from "../../styles/page/Result.module.scss";
import { useLocation } from "react-router-dom";
import { fetchResults } from "../services/decision";
import ResultItem from "./DecisionItem";
import { decryptData, getDataFromURL } from "../helper/utils";

const Decision = ({ onClick }) => {
  const location = useLocation();
  const [fullData, setfullData] = useState([]);
  const [results, setResults] = useState([]);

  const fetchResultsAndSet = async (data) => {
    const level = data.completed
      ? parseInt(data.level)
      : parseInt(data.level) - 1;
    const formData = {
      level,
      completed: data.completed,
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
    setfullData(data);
  }, []);

  return (
    <div className={style.resultsContainer}>
      <>
        {results.length > 0 ? (
          results.map((data, index) => (
            <ResultItem data={data} fullData={fullData} round={index} />
          ))
        ) : (
          <div className='text-center mt-4'>
            <p>You haven't submitted any decisions yet.</p>
          </div>
        )}
      </>
    </div>
  );
};

export default Decision;
