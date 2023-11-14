import React, { useEffect, useState } from "react";
import styles from "../../../styles/components/navbar/Right.module.scss";
import { Row, Form, Col } from "react-bootstrap";
import { isObjectEmpty } from "../../helper/utils";
import { fetchQustions, storeAnsweres } from "../../services/decision";

const Decision = ({ data }) => {
  const [questions, setQustions] = useState([]); // Initialize state using useState
  const [answers, setAnswers] = useState([]); // Initialize state using useState

  const fetchLevelDetailsAndSet = async (data) => {
    const formData = {
      level: data.level,
      sheetID: data.GoogleSheetID,
    };

    try {
      const res = await fetchQustions(formData);
      setQustions(res.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (!isObjectEmpty(data)) {
      fetchLevelDetailsAndSet(data);
    }
  }, [data, fetchQustions]); 

  
  const handleRadioChange = (questionIndex, selectedValue) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = selectedValue;
    setAnswers(newAnswers);
    localStorage.setItem("levelpageans", JSON.stringify(newAnswers));
  };

  const handleSubmit = async (event) => {
    // setLoader(true);
    const formData = new FormData();
    event.preventDefault();

    formData.append(
      "data",
      JSON.stringify({
        sheetID: data.GoogleSheetID,
        answers: answers,
        level: data.level,
      }),
    );

    await storeAnsweres(formData);
    // const res = await updateLevel(formData);

    // const updatedData = {
    //   ...data,
    //   level: res.data.updatedData.CurrentLevel,
    // };

    // const encryptedData = encryptData(updatedData, "secret_key");
    // navigate(`/level?data=${encodeURIComponent(encryptedData)}`);
  };

  return (
    <div className={styles.decision_container}>
      <Row className={`${styles.decision_header} `}>Decisions</Row>
      <Form onSubmit={handleSubmit}>
        <Col className={`${styles.questionsContainer}`}>
          {questions.length > 0 &&
            questions.map((question, index) => (
              <div key={index} className={`question ${styles.question}`}>
                <p>{question.question}</p>
                {question.type === "Multiple-Choice" && (
                  <Form.Group
                    className={`options ${styles.options}`}
                    aria-required>
                    {question.choices.map((option, optionIndex) => (
                      <Form.Check
                        key={optionIndex}
                        type='radio'
                        name={`question-${index}`}
                        label={option}
                        value={option}
                        onChange={(e) =>
                          handleRadioChange(index, e.target.value)
                        }
                        checked={answers[index] === option}
                        required
                      />
                    ))}
                  </Form.Group>
                )}
                {question.type === "Boolean" && (
                  <Form.Group className={`input ${styles.input}`} required>
                    <Form.Check
                      type='radio'
                      name={`question-${index}`}
                      label='True'
                      value='true'
                      onChange={() => handleRadioChange(index, "true")}
                      checked={answers[index] === "true"}
                      inline
                      required
                    />
                    <Form.Check
                      type='radio'
                      name={`question-${index}`}
                      label='False'
                      value='false'
                      checked={answers[index] === "false"}
                      onChange={() => handleRadioChange(index, "false")}
                      inline
                    />
                  </Form.Group>
                )}
                {question.type === "Number" && (
                  <Form.Group className={`input ${styles.input}`}>
                    <Form.Control
                      type='Number'
                      name={`question-${index}`}
                      className={`form-control ${styles.numberInput}`}
                      value={answers[index] || ""}
                      onChange={(e) => handleRadioChange(index, e.target.value)}
                      required
                    />
                  </Form.Group>
                )}
              </div>
            ))}
        </Col>
        <div className={styles.startButtonContainer}>
          <button className={styles.startButton} type='submit'>
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Decision;
