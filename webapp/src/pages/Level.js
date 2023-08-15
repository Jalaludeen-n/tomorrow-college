import React, { useState } from "react";
import "../styles/page/Level.css"; // Import your CSS file for styling

const Level = () => {
  const [pdfData, setPdfData] = useState("");
  const [roundHeader, setRoundHeader] = useState("");
  const [questions] = useState([
    {
      text: "Question 1: What is the capital of France?",
      type: "multiple-choice",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      text: "Question 2: Who painted the Mona Lisa?",
      type: "multiple-choice",
      options: [
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Michelangelo",
      ],
      answer: "Leonardo da Vinci",
    },
    {
      text: "Question 3: What is the chemical symbol for gold?",
      type: "multiple-choice",
      options: ["Au", "Ag", "Fe", "Hg"],
      answer: "Au",
    },
    {
      text: "Question 4: Is the Earth flat?",
      type: "boolean",
      answer: "false",
    },
    {
      text: "Question 5: How many continents are there?",
      type: "number",
      answer: "7",
    },
    {
      text: 'Question 6: Which planet is known as the "Red Planet"?',
      type: "multiple-choice",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      text: 'Question 7: Who wrote "Romeo and Juliet"?',
      type: "multiple-choice",
      options: [
        "William Shakespeare",
        "Jane Austen",
        "Charles Dickens",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
    {
      text: "Question 8: True or false: The Great Wall of China is visible from space.",
      type: "boolean",
      answer: "false",
    },
    {
      text: "Question 9: What is the largest mammal on Earth?",
      type: "multiple-choice",
      options: ["Blue whale", "Elephant", "Giraffe", "Hippopotamus"],
      answer: "Blue whale",
    },
    {
      text: "Question 10: How many sides does a hexagon have?",
      type: "number",
      answer: "6",
    },
  ]);

  return (
    <div className='game-details-container'>
      {/* Left Side - PDF and Level Header */}
      <div className='left-side'>
        <div className='pdf-container'>
          {/* <iframe
            src={`data:application/pdf;base64,${pdfData}`}
            title='PDF'
            width='100%'
            height='100%'
          /> */}
          <iframe
            // src={pdfPath}
            title='PDF Viewer'
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              zoom: "100%",
            }}
            sandbox='allow-modals allow-scripts allow-same-origin'
          />
        </div>
        <div className='level-header'>
          <h2>Level</h2>
        </div>
      </div>

      {/* Right Side - Round Header and GK Questions */}
      <div className='right-side'>
        <div className='round-header'>
          <h2>{roundHeader}</h2>
        </div>
        <div className='questions-container'>
          <h3>General Knowledge Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className='question'>
              <p>{question.text}</p>
              {question.type === "multiple-choice" && (
                <ul className='options'>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <input
                        type='radio'
                        name={`question-${index}`}
                        value={option}
                      />{" "}
                      {option}
                    </li>
                  ))}
                </ul>
              )}
              {question.type === "boolean" && (
                <div className='input'>
                  <label>
                    <input
                      type='radio'
                      name={`question-${index}`}
                      value='true'
                    />{" "}
                    True
                  </label>
                  <label>
                    <input
                      type='radio'
                      name={`question-${index}`}
                      value='false'
                    />{" "}
                    False
                  </label>
                </div>
              )}
              {question.type === "number" && (
                <div className='input'>
                  <input type='number' name={`question-${index}`} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='next-button'>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Level;
