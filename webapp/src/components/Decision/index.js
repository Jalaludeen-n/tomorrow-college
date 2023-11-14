// Navbar.js
import React, { useEffect, useState } from "react";
import style from "../../styles/page/Result.module.scss";
import { useLocation } from "react-router-dom";
import { fetchResults } from "../services/decision";
import ResultItem from "./DecisionItem";

const Decision = ({ onClick }) => {
  const location = useLocation();
  //   const [data, setData] = useState({});
  const [results, setResults] = useState([]);
  const data = [
    {
      "The capital of France is Rome.": "true",
      "Which gas do plants primarily use for photosynthesis?": "Oxygen",
      "In which year did Christopher Columbus first reach the Americas?": "21",
      "How many continents are there on Earth?": "21",
      "The Great Wall of China is visible from space.": "true",
      "Mount Everest is the tallest mountain in the world.": "true",
      'Who wrote the play "Romeo and Juliet"?': "William Shakespeare",
      "What is the square root of 144?": "12",
      "Is the Earth flat?": "true",
      "How many sides does a hexagon have?": "21",
      test: "one",
    },
    {
      "The capital of France is Rome.": "true",
      "Which gas do plants primarily use for photosynthesis?": "Oxygen",
      "In which year did Christopher Columbus first reach the Americas?": "21",
      "How many continents are there on Earth?": "21",
      "The Great Wall of China is visible from space.": "true",
      "Mount Everest is the tallest mountain in the world.": "true",
      'Who wrote the play "Romeo and Juliet"?': "William Shakespeare",
      "What is the square root of 144?": "12",
      "Is the Earth flat?": "true",
      test: "21",
    },
  ];
  const fetchResultsAndSet = async (data) => {
    const formData = {
      level: data.level,
      sheetID: data.GoogleSheetID,
    };

    try {
      const res = await fetchResults(formData);
      setResults(res.data);
      console.log(res);
      console.log("result");
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  //   useEffect(() => {
  //     const encryptedData = getDataFromURL(location);
  //     const key = "secret_key";
  //     const data = decryptData(encryptedData, key);
  //     fetchResultsAndSet(data);
  //     setData(data);
  //   }, []);

  return (
    <div className={style.resultsContainer}>
      {data.map((data, index) => (
        <ResultItem data={data} round={index} />
      ))}
    </div>
  );
};

export default Decision;
